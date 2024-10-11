from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Numeric
from sqlalchemy import String
from sqlalchemy.orm import relationship

from .base import TimeStampMixin


class Session(TimeStampMixin):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    hostname = Column(String(100), nullable=True)
    browser = Column(String(20), nullable=True)
    os = Column(String(20), nullable=True)
    device = Column(String(20), nullable=True)
    screen = Column(String(11), nullable=True)
    language = Column(String(35), nullable=True)
    country = Column(String(2), nullable=True)
    city = Column(String(50), nullable=True)
    website_id = Column(Integer, ForeignKey("websites.id"))

    website_events = relationship("WebsiteEvent", back_populates="session")
    session_data = relationship("SessionData", back_populates="session")

    def __repr__(self):
        return f"<Session(id={self.id}, website_id={self.website_id})>"


class SessionData(TimeStampMixin):
    __tablename__ = "session_data"

    id = Column(Integer, primary_key=True, index=True)
    website_id = Column(Integer, ForeignKey("websites.id"))
    session_id = Column(Integer, ForeignKey("sessions.id"))
    data_key = Column(String(500))
    string_value = Column(String(500))
    number_value = Column(Numeric(19, 4))
    date_value = Column(DateTime(timezone=True))
    data_type = Column(Integer)

    website = relationship("Website", back_populates="session_data")
    session = relationship("Session", back_populates="session_data")
