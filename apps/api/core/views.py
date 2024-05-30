from typing import Any

from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib.auth.hashers import make_password
from django.http import HttpRequest
from drf_spectacular.utils import extend_schema  # type: ignore
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import DestroyModelMixin
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.mixins import UpdateModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .models import User
from .models import Website
from .models import Workspace
from .openapi_serializers import ChangePasswordErrorOut
from .openapi_serializers import CreateWorkspaceErrorOut
from .openapi_serializers import GenericOut
from .openapi_serializers import RegisterErrorOut
from .openapi_serializers import WebsitesListOut
from .openapi_serializers import WorkspaceListOut
from .openapi_serializers import WorkspaceMembersListOut
from .permissions import IsAdminRole
from .serializers import ChangePasswordOut
from .serializers import CreateWorkspaceIn
from .serializers import JoinWorkspaceIn
from .serializers import MemberUpdateParamIn
from .serializers import NeedSetupOut
from .serializers import UpdateUserSerializer
from .serializers import UpdateWorkspaceMemberIn
from .serializers import UserIn
from .serializers import UserLoginIn
from .serializers import UserOut
from .serializers import UserRegisterIn
from .serializers import WebsiteIn
from .serializers import WebsiteOut
from .serializers import WorkspaceMemberOut
from .serializers import WorkspaceOut
from .serializers import WorkspacesOut


class UserViewSet(GenericViewSet, RetrieveModelMixin, DestroyModelMixin):
    queryset = User.objects.all()
    serializer_class = WorkspaceMemberOut
    permission_classes = [IsAuthenticated]
    lookup_field = "username"

    @extend_schema(
        request=UserRegisterIn,
        responses={
            status.HTTP_200_OK: GenericOut,
            status.HTTP_400_BAD_REQUEST: RegisterErrorOut,
        },
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="register",
        permission_classes=[],
    )
    def register(self, request: Request):
        serializer = UserRegisterIn(data=request.data)
        serializer.is_valid(raise_exception=True)
        admin_user_exists = User.objects.filter(role="ADMIN").exists()
        if admin_user_exists:
            return Response(
                {"detail": "Admin already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = User.objects.create_user(  # type: ignore
            username=serializer.validated_data["username"],  # type: ignore
            email=serializer.validated_data["email"],  # type: ignore
            password=serializer.validated_data["password"],  # type: ignore
            role="ADMIN",
        )
        default_workspace, _ = Workspace.objects.get_or_create(
            name="cool-space", access_code="12345", created_by=user
        )
        user.workspace.add(default_workspace)
        user.save()

        login(request, user)  # type: ignore
        return Response(
            {"detail": "User created successfully."}, status=status.HTTP_200_OK
        )

    @extend_schema(
        request=UserLoginIn,
        responses={
            status.HTTP_200_OK: UserOut,
            status.HTTP_400_BAD_REQUEST: GenericOut,
        },
    )
    @action(
        detail=False, methods=["post"], url_path="login", permission_classes=[]
    )
    def login(self, request: Request):
        serializer = UserLoginIn(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data["username"]  # type: ignore
        password = serializer.validated_data["password"]  # type: ignore

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, user)  # type: ignore
        return Response(UserOut(user).data, status=status.HTTP_200_OK)

    @extend_schema(responses=NeedSetupOut)
    @action(
        detail=False, methods=["get"], url_path="setup", permission_classes=[]
    )
    def need_setup(self, request: Request):
        admin_user_exists = User.objects.filter(role="ADMIN").exists()
        if admin_user_exists:
            return Response(
                {"need_setup": False},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"need_setup": True},
            status=status.HTTP_200_OK,
        )

    @extend_schema(responses=UserOut)
    @action(
        detail=False,
        methods=["get"],
        url_path="current",
        permission_classes=[IsAuthenticated],
    )
    def current(self, request: Request):
        serializer = UserOut(instance=request.user)  # type: ignore

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        request=UpdateWorkspaceMemberIn,
        responses=GenericOut,
        parameters=[MemberUpdateParamIn],
    )
    @action(
        detail=False,
        methods=["patch"],
        url_path="update",
        permission_classes=[IsAuthenticated, IsAdminRole],
    )
    def update_user(self, request: Request):
        param_serializer = MemberUpdateParamIn(data=request.query_params)
        param_serializer.is_valid(raise_exception=True)

        body_serializer = UpdateWorkspaceMemberIn(data=request.data)
        body_serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(username=param_serializer.validated_data["username"])  # type: ignore

            if "password" in body_serializer.validated_data:  # type: ignore
                password: str = body_serializer.validated_data.pop("password")  # type: ignore
                user.password = make_password(password)  # type: ignore

            for attr, value in body_serializer.validated_data.items():  # type: ignore
                setattr(user, attr, value)  # type: ignore

            user.save()

            return Response(
                {"detail": "User updated successfully."},
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    @extend_schema(responses=WorkspaceListOut)
    @action(
        detail=False,
        methods=["get"],
        url_path="workspaces",
        permission_classes=[IsAuthenticated],
    )
    def workspaces(self, request: Request):
        user = request.user
        workspaces: WorkspacesOut = user.workspace.all()
        serializer = WorkspacesOut(workspaces, many=True)

        return Response(
            {"workspaces": serializer.data},
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        request=UserIn,
        responses={
            status.HTTP_200_OK: GenericOut,
            status.HTTP_400_BAD_REQUEST: RegisterErrorOut,
        },
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="create",
        permission_classes=[IsAuthenticated, IsAdminRole],
    )
    def create_user(self, request: Request):
        serializer = UserIn(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            workspace = Workspace.objects.get(name=serializer.validated_data["workspace"])  # type: ignore
        except Workspace.DoesNotExist:
            return Response({"detail": "Workspace not found."})

        user = User.objects.create_user(  # type: ignore
            username=serializer.validated_data["username"],  # type: ignore
            password=serializer.validated_data["password"],  # type: ignore
            role=serializer.validated_data["role"],  # type: ignore
        )
        user.workspace.add(workspace)
        user.save()

        return Response(
            {"detail": "User created successfully."},
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        request=None,
        responses={status.HTTP_200_OK: GenericOut},
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="logout",
        permission_classes=[IsAuthenticated],
    )
    def logout(self, request: HttpRequest):
        logout(request)
        return Response({"detail": "Successfully logged out."})

    @extend_schema(
        request=UpdateUserSerializer,
        responses={
            status.HTTP_200_OK: GenericOut,
            status.HTTP_403_FORBIDDEN: GenericOut,
        },
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="update-profile",
        permission_classes=[IsAuthenticated],
    )
    def update_profile(self, request: Request):
        serializer = UpdateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        for attr, value in serializer.validated_data.items():  # type: ignore
            setattr(user, attr, value)  # type: ignore

        user.save()

        return Response(
            {"detail": "Profile updated successfully."},
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        request=ChangePasswordOut,
        responses={
            status.HTTP_200_OK: GenericOut,
            status.HTTP_403_FORBIDDEN: GenericOut,
            status.HTTP_400_BAD_REQUEST: ChangePasswordErrorOut,
        },
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="change-password",
        permission_classes=[IsAuthenticated],
    )
    def change_password(self, request: Request):
        serializer = ChangePasswordOut(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        user = request.user
        new_password = serializer.validated_data["new_password"]  # type: ignore

        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )


class WorkspaceViewSet(
    GenericViewSet, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin
):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceOut
    lookup_field = "name"
    http_method_names = ["get", "patch", "post", "delete"]
    permission_classes = [IsAuthenticated, IsAdminRole]

    @extend_schema(
        request=CreateWorkspaceIn,
        responses={
            status.HTTP_200_OK: GenericOut,
            status.HTTP_400_BAD_REQUEST: CreateWorkspaceErrorOut,
        },
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="create",
        permission_classes=[IsAuthenticated, IsAdminRole],
    )
    def create_workspace(self, request: Request):
        serializer = CreateWorkspaceIn(data=request.data)
        serializer.is_valid(raise_exception=True)

        workspace = Workspace.objects.create(
            name=serializer.validated_data["name"],  # type: ignore
            created_by=request.user,
            access_code="hahaha",
        )

        user = request.user
        user.workspace.add(workspace)
        user.save

        return Response(
            {"detail": "Workspace created successfully."},
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        request=JoinWorkspaceIn,
        responses=GenericOut,
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="join",
        permission_classes=[IsAuthenticated],
    )
    def join_workspace(self, request: Request):
        serializer = JoinWorkspaceIn(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            workspace = Workspace.objects.get(
                access_code=serializer.validated_data["access_code"],  # type: ignore
            )
        except Workspace.DoesNotExist:
            return Response(
                {"detail": "Workspace not found."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        user.workspace.add(workspace)
        user.save

        return Response(
            {"detail": "Workspace joined successfully."},
            status=status.HTTP_200_OK,
        )

    @extend_schema(responses=WorkspaceMembersListOut)
    @action(
        detail=True,
        methods=["get"],
        url_path="members",
        permission_classes=[IsAuthenticated],
    )
    def members(self, request: Request, *args: Any, **kwargs: Any):
        workspace = self.get_object()
        users = User.objects.filter(workspace__name=workspace).all()
        return Response({"members": WorkspaceMemberOut(users, many=True).data})

    @extend_schema(responses=WebsitesListOut)
    @action(
        detail=True,
        methods=["get"],
        url_path="websites",
        permission_classes=[IsAuthenticated],
    )
    def websites(self, request: Request, *args: Any, **kwargs: Any):
        workspace = self.get_object()
        websites = Website.objects.filter(workspace__name=workspace).all()
        return Response({"websites": WebsiteOut(websites, many=True).data})


class WebsiteViewSet(
    GenericViewSet, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin
):
    queryset = Website.objects.all()
    serializer_class = WebsiteOut
    http_method_names = ["get", "patch", "post", "delete"]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=WebsiteIn,
        responses={
            status.HTTP_200_OK: GenericOut,
            status.HTTP_400_BAD_REQUEST: GenericOut,
        },
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="create",
        permission_classes=[IsAuthenticated, IsAdminRole],
    )
    def websites(self, request: Request, *args: Any, **kwargs: Any):
        serializer = WebsiteIn(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            workspace = Workspace.objects.get(name=serializer.validated_data["workspace"]["name"])  # type: ignore
        except Workspace.DoesNotExist:
            return Response({"detail": "Workspace not found."})

        Website.objects.create(
            name=serializer.validated_data["name"],  # type: ignore
            domain=serializer.validated_data["domain"],  # type: ignore
            workspace=workspace,
            created_by=request.user,
        )
        return Response({"detail": "Website added successfully."})
