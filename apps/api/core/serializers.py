from typing import Any

from rest_framework.fields import CharField
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import Serializer

from .models import User


class GenericOut(Serializer[Any]):
    detail = CharField()


class UserOut(ModelSerializer[User]):
    class Meta:
        model = User
        fields = "__all__"


class UserRegisterIn(ModelSerializer[User]):
    class Meta:
        model = User
        fields = ["username", "email", "password"]


class UserLoginIn(Serializer[Any]):
    username = CharField()
    password = CharField()
