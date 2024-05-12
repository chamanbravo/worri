from django.contrib.auth import authenticate
from django.contrib.auth import login
from drf_spectacular.utils import extend_schema  # type: ignore
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .models import User
from .models import Workspace
from .serializers import GenericOut
from .serializers import UserLoginIn
from .serializers import UserOut
from .serializers import UserRegisterIn


class UserViewSet(GenericViewSet):
    queryset = User.objects.all()

    @extend_schema(request=UserRegisterIn, responses=GenericOut)
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
        user = User.objects.create_user(
            username=serializer.validated_data["username"],
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
            role="ADMIN",
        )
        default_workspace, _ = Workspace.objects.get_or_create(
            name="cool-space", access_code="12345", created_by=user
        )
        user.workspace.add(default_workspace)
        user.save()

        return Response(
            {"detail": "User created successfully."}, status=status.HTTP_200_OK
        )

    @extend_schema(request=UserLoginIn, responses=GenericOut)
    @action(detail=False, methods=["post"], url_path="login")
    def login(self, request: Request):
        serializer = UserLoginIn(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, user)
        return Response(
            {"user": UserOut(user).data}, status=status.HTTP_200_OK
        )
