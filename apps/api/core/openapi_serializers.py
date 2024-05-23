from rest_framework.fields import CharField
from rest_framework.serializers import ListSerializer
from rest_framework.serializers import Serializer

from .serializers import WebsiteOut


class GenericOut(Serializer):
    detail = CharField()


class RegisterErrorOut(GenericOut):
    username = ListSerializer(child=CharField())
    email = ListSerializer(child=CharField())
    password = ListSerializer(child=CharField())


class WebsitesListOut(Serializer):
    websites = ListSerializer(child=WebsiteOut())
