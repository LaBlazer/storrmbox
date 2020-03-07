
from flask_sqlalchemy import SQLAlchemy
from flask_sqlalchemy.model import BindMetaMixin
from sqlalchemy.ext.declarative import declarative_base, DeclarativeMeta

from sqlalchemy import and_
from sqlalchemy.orm import relationship
from datetime import timedelta, datetime
import sqlalchemy as sa

from storrmbox.exceptions import InternalException
from storrmbox.extensions.logging import logger


# Disable Table Name Generation
class NoNameMeta(BindMetaMixin, DeclarativeMeta):
    pass


db = SQLAlchemy(model_class=declarative_base(metaclass=NoNameMeta, name="Model"))


def time_now():
    return datetime.utcnow().replace(microsecond=0)


def time_future(delta_hours=12, current_time=time_now()):
    return current_time + timedelta(hours=delta_hours)


def time_past(delta_hours=12, current_time=time_now()):
    return current_time - timedelta(hours=delta_hours)


class CRUDMixin(object):
    """Mixin that adds convenience methods for CRUD (create, read, update, delete)
    operations.
    """

    def __update__(self, attr, value):
        setattr(self, attr, value)

    @classmethod
    def create(cls, **kwargs):
        """Create a new record and save it the database."""
        instance = cls(**kwargs)
        return instance.save()

    @classmethod
    def purge(cls):
        try:
            rows_deleted = db.session.query(cls).delete()
            db.session.commit()
            return rows_deleted
        except:
            db.session.rollback()

        return 0

    def update(self, commit=True, **kwargs):
        """Update specific fields of a record."""
        # Prevent changing ID of object
        kwargs.pop('id', None)
        for attr, value in kwargs.items():
            # Flask-RESTful makes everything None by default :/
            if value is not None:
                self.__update__(attr, value)
        return commit and self.save() or self

    def save(self, commit=True):
        """Save the record."""
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def delete(self, commit=True):
        """Remove the record from the database."""
        db.session.delete(self)
        return commit and db.session.commit()


class Model(CRUDMixin, db.Model):
    """Base model class that includes CRUD convenience methods."""
    __abstract__ = True


class SurrogatePK(object):
    """A mixin that adds a surrogate integer 'primary key' column named
    ``id`` to any declarative-mapped class.
    """

    id = sa.Column(sa.Integer, primary_key=True, autoincrement=True)

    @classmethod
    def get_by_id(cls, id):
        if id <= 0:
            raise ValueError('ID must not be negative or zero!')
        if (isinstance(id, (bytes, str)) and id.isdigit()) or isinstance(id, (int, float)):
            return cls.query.get(int(id))
        return None


def ReferenceCol(tablename, nullable=False, pk_name='id', **kwargs):
    """Column that adds primary key foreign key reference.
    Usage: ::
        category_id = ReferenceCol('category')
        category = relationship('Category', backref='categories')
    """
    return sa.Column(sa.ForeignKey("{0}.{1}".format(tablename, pk_name)),
        nullable=nullable, index=True, **kwargs)  # pragma: no cover


class Cache(SurrogatePK):

    refresh_interval = 24

    created_at = sa.Column(sa.DateTime, nullable=False, default=time_now, primary_key=True)

    @classmethod
    def set_refresh_interval(cls, interval):
        cls.refresh_interval = interval

    @classmethod
    def fetch(cls, key, value, refresh_function=None, *refresh_function_args):
        filtered = cls.query.filter(and_(key == value, cls.created_at > time_past(24))).order_by(cls.id.asc()).all()

        if not filtered:
            if callable(refresh_function):
                # Refreshing data
                logger.debug(f"Refreshing {cls.__name__} cache")
                filtered = refresh_function(*refresh_function_args)

                # Check if function returned correct data
                if len(filtered) == 0 or not isinstance(filtered[0], cls):
                    raise InternalException("Cache fetch function returned invalid data")

                db.session.bulk_save_objects(filtered, update_changed_only=False)
                # Commit all new data
                db.session.commit()
            else:
                raise InternalException(f"{type(refresh_function)} is not callable")

        return filtered

    def purge(self):
        pass

