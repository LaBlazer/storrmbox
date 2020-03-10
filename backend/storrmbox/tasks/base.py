from storrmbox.extensions import logger


class classproperty(property):
    def __get__(self, cls, owner):
        return classmethod(self.fget).__get__(None, owner)()


class Tasks:
    _app = None

    @classproperty
    def app(cls):
        # TODO: redo this propertly
        if cls._app is None:
            logger.info("Initializing huey flask instance")
            from storrmbox import create_huey_app
            cls._app = create_huey_app()
        return cls._app
