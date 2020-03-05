import psutil
import logging
import argparse
import subprocess


class Storrmbox:

    def __init__(self):
        self.workers = None

    # @staticmethod
    # def output_reader(process):
    #     while True:
    #         output = process.stdout.readline()
    #         if output == '' and process.poll() is not None:
    #             break
    #         if output:
    #             print("--> " + output.strip().decode("utf-8"))
    #     rc = process.poll()
    #     return rc

    def start_workers(self, count: int):
        if not count:
            count = config["task_worker_count"]

        logging.info(f"Starting {count} workers")
        cmd = f"huey_consumer.py storrmbox.tasks.task_queue -w {count}"
        cmd += "" if config["flask_debug"] else " -q"
        self.workers = subprocess.Popen(cmd, stdout=subprocess.PIPE, shell=True)

    def stop_workers(self):
        logging.info("Killing workers")
        self.workers.kill()
        self.workers.wait()

    def run(self):
        parser = argparse.ArgumentParser(description='Storrmbox')
        parser.add_argument('type', metavar='type', type=str,
                            help='type of deploy (prod*, dev)')
        parser.add_argument('-w', dest='workers', action='store',
                            type=int, default=None,
                            help='number of workers')
        parser.add_argument('-t', dest='threads', action='store',
                            type=int, default=None,
                            help='number of threads')

        args = parser.parse_args()

        # Set the config type
        args.type == "dev" and config.set_type("dev")

        # Ugly hack for werkzeug reloader
        for proc in psutil.process_iter():
            try:
                # TODO: create a custom consumer script
                if any("huey_consumer.py" in cmd for cmd in proc.cmdline()):
                    logging.warning(f"Found hanging worker with PID {proc.pid}, killing..")
                    proc.kill()
            except (psutil.AccessDenied, psutil.NoSuchProcess, OSError):
                pass

        # Start workers
        self.start_workers(args.workers)

        # Run the server
        from storrmbox.extensions.request_handler import StorrmboxRequestHandler
        if args.type == "dev":
            from storrmbox import create_app

            app = create_app()
            app.run(host=config["flask_hostname"],
                    port=config["flask_port"],
                    debug=config["flask_debug"],
                    request_handler=StorrmboxRequestHandler)

        else:  ## Prod
            from waitress import serve
            from storrmbox import create_app

            app = create_app()
            thread_count = args.threads if args.threads else config["thread_count"]
            logging.info(f"Serving on http://{config['flask_hostname']}:{config['flask_port']}/ with {thread_count} threads")
            serve(app,
                  host=config["flask_hostname"],
                  port=config["flask_port"],
                  threads=thread_count,
                  _quiet=True
                  )

        self.stop_workers()


if __name__ == "__main__":
    # Welcome message
    print("""             _                            _               
         ___| |_ ___  _ __ _ __ _ __ ___ | |__   _____  __
        / __| __/ _ \| '__| '__| '_ ` _ \| '_ \ / _ \ \/ /
        \__ \ || (_) | |  | |  | | | | | | |_) | (_) >  < 
        |___/\__\___/|_|  |_|  |_| |_| |_|_.__/ \___/_/\_\\
                                                    v0.1
        """)

    from storrmbox.extensions.config import config
    s = Storrmbox()
    s.run()
