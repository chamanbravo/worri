from django.contrib.auth import authenticate
from django.contrib.auth import login
from drf_spectacular.utils import extend_schema  # type: ignore
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.mixins import UpdateModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .models import User
from .models import Workspace
from .openapi_serializers import GenericOut
from .openapi_serializers import RegisterErrorOut
from .serializers import NeedSetupOut
from .serializers import UserLoginIn
from .serializers import UserOut
from .serializers import UserRegisterIn
from .serializers import WorkspaceOut


class UserViewSet(GenericViewSet):
    queryset = User.objects.all()

    @extend_schema(
        request=UserRegisterIn,
        responses={
            status.HTTP_200_OK: GenericOut,
            status.HTTP_400_BAD_REQUEST: RegisterErrorOut,
        },
    )
    @action(detail=False, methods=["post"], url_path="register")
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
    @action(detail=False, methods=["post"], url_path="login")
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
    @action(detail=False, methods=["get"], url_path="setup")
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


class WorkspaceViewSet(GenericViewSet, RetrieveModelMixin, UpdateModelMixin):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceOut
    lookup_field = "name"
    http_method_names = ["get", "patch", "post"]
