from sqlalchemy import Column, ForeignKey, Integer, String

from .base import TimeStampMixin


class Website(TimeStampMixin):
    __tablename__ = "websites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(32), nullable=False)
    domain = Column(String(32), nullable=False)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    created_by_id = Column(Integer, ForeignKey("users.id"))

    def __repr__(self):
        return f"<Website(name={self.name}, domain={self.domain})>"
