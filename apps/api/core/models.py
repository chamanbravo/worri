from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import UserManager
from django.db import models


class BaseModel(models.Model):
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.__class__.__name__} #{self.pk}"

    class Meta:
        abstract = True


class Workspace(BaseModel):
    name = models.CharField(unique=True, max_length=32)
    access_code = models.CharField(max_length=50)
    created_by = models.ForeignKey(
        "User", on_delete=models.PROTECT, related_name="workspaces"
    )

    def __str__(self) -> str:
        return self.name


class User(AbstractUser):
    username = models.CharField(max_length=30, unique=True)
    first_name = models.CharField(max_length=30, default="")
    last_name = models.CharField(max_length=30, default="")
    email = models.EmailField(max_length=256, unique=True)
    password = models.CharField(max_length=256)
    role = models.CharField(
        max_length=20,
        choices=[
            ("ADMIN", "ADMIN"),
            ("EDITOR", "EDITOR"),
            ("VIEWER", "VIEWER"),
        ],
    )
    workspace = models.ManyToManyField(
        Workspace, related_name="users", blank=True
    )

    objects = UserManager()

    def __str__(self) -> str:
        return self.username


class Website(BaseModel):
    name = models.CharField(max_length=32)
    domain = models.CharField(max_length=32)
    workspace = models.ForeignKey(
        Workspace, on_delete=models.PROTECT, related_name="websites"
    )
    created_by = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="websites"
    )

    def __str__(self) -> str:
        return self.name
