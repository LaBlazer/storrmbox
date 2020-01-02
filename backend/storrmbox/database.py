from enum import Enum

from sqlalchemy import SmallInteger, type_coerce, func
from sqlalchemy.orm import relationship
from datetime import timedelta, datetime
import sqlalchemy as sa
from sqlalchemy.sql import operators

from .extensions import db


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
                setattr(self, attr, value)
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
    __table_args__ = {'extend_existing': True}

    id = sa.Column(sa.Integer, primary_key=True)

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


class EnumComparator(SmallInteger.Comparator):
    def operate(self, op, *other, **kwargs):
        print(kwargs)
        print(other[0].value)
        print(dir(self))
        return op(func.__repr__(self), func.__repr__(other))


# https://stackoverflow.com/questions/12212636/sql-alchemy-overriding
class IntEnum(sa.types.TypeDecorator):
    impl = sa.SmallInteger
    coerce_to_is_types = Enum
    comparator_factory = EnumComparator

    def __init__(self, enumtype, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._enumtype = enumtype

    def process_bind_param(self, value, dialect):
        if isinstance(value, Enum):
            value = value.value
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            value = self._enumtype(value)
        return value

    def coerce_compared_value(self, op, value):
        print(type(value.value))
        print(op)

        return SmallInteger()

