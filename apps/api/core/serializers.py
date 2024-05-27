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


class CreateWorkspaceIn(ModelSerializer[Workspace]):
    class Meta:
        model = Workspace
        fields = ["name"]


class JoinWorkspaceIn(Serializer[Any]):
    access_code = CharField()


class WorkspacesOut(ModelSerializer[Workspace]):
    created_by = CharField(source="created_by.username")
    websites_count = SerializerMethodField()
    members_count = SerializerMethodField()

    class Meta:
        model = Workspace
        fields = [
            "name",
            "access_code",
            "created_by",
            "members_count",
            "websites_count",
        ]

    def get_websites_count(self, obj: Workspace):
        return Website.objects.filter(workspace=obj).count()

    def get_members_count(self, obj: Workspace):
        return User.objects.filter(workspace=obj).count()


class WebsiteIn(ModelSerializer[Workspace]):
    workspace = CharField(source="workspace.name")

    class Meta:
        model = Website
        fields = ["workspace", "name", "domain"]


class WebsiteOut(ModelSerializer[Workspace]):
    created_by = CharField(source="created_by.username")

    class Meta:
        model = Website
        fields = ["id", "name", "domain", "created_by"]


class WorkspaceMemberOut(ModelSerializer[User]):
    class Meta:
        model = User
        fields = ["id", "username", "role", "date_joined"]


class UpdateWorkspaceMemberIn(ModelSerializer[User]):
    class Meta:
        model = User
        fields = ["password", "role"]


class MemberUpdateParamIn(Serializer[Any]):
    username = CharField()
