from typing import Any
from typing import List

from rest_framework.fields import BooleanField
from rest_framework.fields import CharField
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import Serializer
from rest_framework.serializers import SerializerMethodField

from .models import User
from .models import Website
from .models import Workspace


class UserOut(ModelSerializer[User]):
    workspace = SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "role",
            "workspace",
        ]

    def get_workspace(self, obj: User) -> List[str]:
        return [ws.name for ws in obj.workspace.all()]


class UserRegisterIn(ModelSerializer[User]):
    class Meta:
        model = User
        fields = ["username", "email", "password"]


class UserLoginIn(Serializer[Any]):
    username = CharField()
    password = CharField()


class NeedSetupOut(Serializer[Any]):
    need_setup = BooleanField()


class WorkspaceOut(ModelSerializer[Workspace]):
    class Meta:
        model = Workspace
        fields = ["name", "access_code"]


class WebsiteOut(ModelSerializer[Workspace]):
    created_by = CharField(source="created_by.username")

    class Meta:
        model = Website
        fields = ["id", "name", "domain", "created_by"]
