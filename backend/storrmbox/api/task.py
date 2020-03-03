from flask_restplus import Resource, Namespace, fields

from storrmbox.extensions import auth, db, task_queue, logger

api = Namespace('task', description='Task system')


task_id = api.model("TaskId", {
    "id": fields.String
})

task_result = api.model("TaskResult", {
    "type": fields.String,
    "data": fields.String
})


@api.route("/<string:uid>")
class TaskResultResource(Resource):

    @auth.login_required
    @api.marshal_with(task_result)
    def get(self, uid):
        logger.debug("Pending: " + str(task_queue.pending()))
        logger.debug("Results: " + str(task_queue.all_results()))

        return {"type": None, "data": task_queue.result(uid)}