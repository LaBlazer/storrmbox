import random
import time

from storrmbox.extensions import task_queue


@task_queue.task(name="download")
def download(url):
    randd = random.uniform(10, 20)
    print("Waiting " + str(randd) + "s")
    time.sleep(randd)
    print("Done")
    return url