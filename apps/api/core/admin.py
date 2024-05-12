from django.contrib.admin import ModelAdmin
from django.contrib.admin import register

from .models import User
from .models import Website
from .models import Workspace


@register(User)
class UserAdmin(ModelAdmin):
    list_display = ("id", "username", "email", "role", "firstname", "lastname")


@register(Website)
class WebsiteAdmin(ModelAdmin):
    list_display = ("id", "name")


@register(Workspace)
class WorkspaceAdmin(ModelAdmin):
    list_display = ("id", "name", "access_code", "created_by")
