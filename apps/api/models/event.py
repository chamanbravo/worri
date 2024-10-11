from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Numeric
from sqlalchemy import String
from sqlalchemy.orm import relationship

from .base import TimeStampMixin


class WebsiteEvent(TimeStampMixin):
    __tablename__ = "website_event"

    id = Column(Integer, primary_key=True)
    website_id = Column(Integer, ForeignKey("website.id"))
    session_id = Column(Integer, ForeignKey("session.id"))
    visit_id = Column(Integer)
    url_path = Column(String(500))
    url_query = Column(String(500), nullable=True, default="")
    referrer_path = Column(String(500), nullable=True, default="")
    referrer_query = Column(String(500), nullable=True, default="")
    referrer_domain = Column(String(500), nullable=True, default="")
    page_title = Column(String(500), nullable=True, default="")
    event_type = Column(Integer, default=1)
    event_name = Column(String(50), nullable=True, default="")

    event_data = relationship("EventData", back_populates="website_event")
    session = relationship("Session", back_populates="website_events")


class EventData(TimeStampMixin):
    __tablename__ = "event_data"

    id = Column(Integer, primary_key=True)
    website_id = Column(Integer, ForeignKey("website.id"))
    website_event_id = Column(Integer, ForeignKey("website_event.id"))
    data_key = Column(String(500))
    string_value = Column(String(500), nullable=True, default="")
    number_value = Column(Numeric(19, 4), nullable=True, default=0.0)
    date_value = Column(DateTime(timezone=True), nullable=True, default=None)
    data_type = Column(Integer)

    website = relationship("Website", back_populates="event_data")
    website_event = relationship("WebsiteEvent", back_populates="event_data")
