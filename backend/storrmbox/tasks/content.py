import random
import time

from storrmbox.extensions import task_queue, logger


@task_queue.task(name="download")
def download():
    randd = random.uniform(15, 30)
    logger.debug("Waiting " + str(randd) + "s")
    time.sleep(randd)
    logger.debug("Done")
    return "serve/test.mp4"