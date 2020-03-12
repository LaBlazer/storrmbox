import codecs
import collections.abc
import os
from pathlib import Path

import yaml
import logging


class AppConfig:
    default_config = {
        "default": {
            "deluge_hostname": "127.0.0.1",
            "deluge_port": 58846,
            "deluge_username": "storrmbox",
            "deluge_password": "storrmbox",
            "deluge_share_ratio": 3.0,
            "deluge_daemon_path": "",

            "task_worker_count": 4,
            "task_database_path": "huey.db",
            "task_immediate": False,

            "flask_hostname": "127.0.0.1",
            "flask_port": 5000,
            "flask_debug": False,
            "flask_secret_key": codecs.encode(os.urandom(32), "hex").decode(),
            "flask_sqlalchemy_database_uri": "postgresql://user:pass@localhost:5432/database",
            "flask_sqlalchemy_track_modifications": False,

            "auth_token_expire_time": 3600,
            "auth_extended_token_expire_time": 604800,  # 1 week

            "download_folder": "downloads/",
            "logs_folder": "logs/",
            "thread_count": 4,
            "omdb_api_key": "replaceme"
        }
    }

    def __init__(self, config_path: Path, config_type="default"):
        self.log = logging.getLogger("app_config_parser")
        self.config = AppConfig.default_config
        self.config_type = config_type

        # Pre-populate selected config type
        self.config[config_type] = self.config["default"]

        self.log.info(f"Loading config '{config_path}'")

        if config_path.is_file():
            try:
                with config_path.open('r', encoding="utf-8") as f:
                    conf = yaml.safe_load(f)

                if config_type not in conf:
                    self.log.warning(f"Config file '{config_path}' does not contain config type '{config_type}'")

                # Update the config file if some keys are missing
                diff = set(AppConfig.default_config['default'].keys()).difference(set(conf['default'].keys()))
                AppConfig._update(self.config, conf)
                if len(diff) > 0:
                    self.log.info(f"Updating the config file (missing keys: {','.join(diff)})")
                    config_path.write_text(
                        yaml.dump(self.config, default_flow_style=False, allow_unicode=True),
                        encoding="utf-8"
                    )

            except yaml.YAMLError as ex:
                self.log.error(f"Error while parsing the config '{config_path}': {ex}")
        else:
            self.log.info(f"Config file does not exist, creating one at '{config_path}'")
            config_path.parent.mkdir(parents=True, exist_ok=True)

            with config_path.open('w', encoding="utf-8") as f:
                yaml.dump(self.config, f, default_flow_style=False, allow_unicode=True)
        self.log.debug(self.config)

    @staticmethod
    def _update(d, u):
        for k, v in u.items():
            if isinstance(v, collections.abc.Mapping):
                d[k] = AppConfig._update(d.get(k, {}), v)
            else:
                d[k] = v
        return d

    def __getitem__(self, key: str):
        return self.config[self.config_type][key]

    def __call__(self, *args, **kwargs):
        pass

    def get(self, key: str, type_=None, default=None):
        val = self.config[self.config_type].get(key, default)
        if type_ and type_ in [int, str, float, bool, dict, list]:
            if isinstance(val, type_):
                return val
            self.log.warning(
                f"Config '{key}' was expected to be type '{type_.__name__}', but was '{type(val).__name__}' instead")
            return type_(val)
        return val

    def set_type(self, config_type: str):
        if config_type not in self.config:
            self.log.warning(f"Config type '{config_type}' does not exist, type was not switched")
        else:
            self.log.info(f"Setting config type to '{config_type}'")
            self.config_type = config_type
            temp = self.config[config_type]
            self.config[config_type] = self.config["default"]
            AppConfig._update(self.config[config_type], temp)

            # Set log level
            logging.root.handlers[0].setLevel(logging.DEBUG if self.get("flask_debug") else logging.INFO)
            # print(logging.root.manager.loggerDict.values())
            # for logger in logging.root.manager.loggerDict.values():
            #     try:
            #         logger.setLevel(logging.DEBUG)
            #     except:
            #         pass

    def get_dict(self, prefix: str, uppercase=True, strip_prefix=True):
        # Sorry
        prefix += "_"
        if strip_prefix:
            return {(key[len(prefix):].upper() if uppercase else key[len(prefix):]): val for key, val in
                    self.config[self.config_type].items() if
                    key.startswith(prefix)}
        return {(key.upper() if uppercase else key): val for key, val in self.config[self.config_type].items() if
                key.startswith(prefix)}


config = AppConfig(Path("config.yml"))