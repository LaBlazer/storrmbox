from huey import SqliteHuey

from .logging import config

task_queue = SqliteHuey(config["task_database_path"])
