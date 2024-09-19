from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .base import TimeStampMixin
from .user import user_workspace


class Workspace(TimeStampMixin):
    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(30), unique=True, index=True, nullable=False)
    access_code = Column(String(250), nullable=False)
    created_by_id = Column(Integer, ForeignKey("users.id"))

    users = relationship(
        "User", secondary=user_workspace, back_populates="workspaces"
    )

    def __repr__(self):
        return f"<Workspace(name={self.name})>"
