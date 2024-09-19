import enum

from sqlalchemy import Column, Enum, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from .base import Base, TimeStampMixin


class RoleEnum(enum.Enum):
    ADMIN = "ADMIN"
    EDITOR = "EDITOR"
    VIEWER = "VIEWER"


user_workspace = Table(
    "user_workspace",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("workspace_id", Integer, ForeignKey("workspaces.id")),
)


class User(TimeStampMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(30), unique=True, index=True, nullable=False)
    first_name = Column(String(30), nullable=True, default="")
    last_name = Column(String(30), nullable=True, default="")
    email = Column(String(100), unique=True, index=True, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    hashed_password = Column(String, nullable=False)

    workspaces = relationship(
        "Workspace", secondary=user_workspace, back_populates="users"
    )

    def __repr__(self):
        return f"<User(username={self.username}, email={self.email})>"
