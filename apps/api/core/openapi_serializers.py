from rest_framework.fields import CharField
from rest_framework.serializers import ListSerializer
from rest_framework.serializers import Serializer

from .serializers import WebsiteOut
from .serializers import WorkspaceMemberOut
from .serializers import WorkspacesOut


class GenericOut(Serializer):
    detail = CharField()


class RegisterErrorOut(GenericOut):
    username = ListSerializer(child=CharField())
    email = ListSerializer(child=CharField())
    password = ListSerializer(child=CharField())


class WebsitesListOut(Serializer):
    websites = ListSerializer(child=WebsiteOut())


class WorkspaceMembersListOut(Serializer):
    members = ListSerializer(child=WorkspaceMemberOut())


class WorkspaceListOut(Serializer):
    workspaces = ListSerializer(child=WorkspacesOut())


class CreateWorkspaceErrorOut(Serializer):
    name = ListSerializer(child=CharField())


class ChangePasswordErrorOut(GenericOut):
    current_password = ListSerializer(child=CharField())
    new_password = ListSerializer(child=CharField())
