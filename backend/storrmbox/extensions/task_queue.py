from huey import SqliteHuey
from .config import config

task_queue = SqliteHuey(config["task_database_path"])
