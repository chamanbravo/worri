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


class User(BaseModel):
    username = models.CharField(max_length=30, unique=True)
    firstname = models.CharField(max_length=30, default="")
    lastname = models.CharField(max_length=30, default="")
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
        Workspace, related_name="users", null=True, blank=True
    )

    def __str__(self) -> str:
        return self.name


class Website(BaseModel):
    name = models.CharField(max_length=32)
    domain = models.CharField(max_length=32)
    workspace = models.ForeignKey(
        Workspace, on_delete=models.PROTECT, related_name="website"
    )
    created_by = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="websites"
    )

    def __str__(self) -> str:
        return self.name
