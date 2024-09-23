from .routes.auth import router as auth_router
from .routes.user import router as user_router
from .routes.website import router as website_router

__all__ = ["auth_router", "user_router", "website_router"]
