from django.contrib.admin import ModelAdmin
from django.contrib.admin import register

from .models import User
from .models import Website
from .models import Workspace


@register(User)
class UserAdmin(ModelAdmin):  # type: ignore
    list_display = (
        "id",
        "username",
        "email",
        "role",
        "first_name",
        "last_name",
    )


@register(Website)
class WebsiteAdmin(ModelAdmin):  # type: ignore
    list_display = ("id", "name")


@register(Workspace)
class WorkspaceAdmin(ModelAdmin):  # type: ignore
    list_display = ("id", "name", "access_code", "created_by")
