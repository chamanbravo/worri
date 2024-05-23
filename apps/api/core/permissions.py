from rest_framework.permissions import BasePermission
from rest_framework.request import Request


class IsAdminRole(BasePermission):
    """
    Custom permission to only allow users with the 'ADMIN' role.
    """

    def has_permission(self, request: Request, view) -> bool:  # type: ignore
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "ADMIN"
        )
