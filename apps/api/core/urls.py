from rest_framework.routers import DefaultRouter

from .views import UserViewSet
from .views import WorkspaceViewSet

router = DefaultRouter()
router.register("users", UserViewSet)
router.register("workspaces", WorkspaceViewSet)

urlpatterns = router.urls
