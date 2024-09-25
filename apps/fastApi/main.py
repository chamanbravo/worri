from fastapi import FastAPI

from api import auth_router, user_router, website_router, workspace_router

app = FastAPI(title="Worri", version="0.1.0")

app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(user_router, prefix="/api", tags=["user"])
app.include_router(website_router, prefix="/api", tags=["website"])
app.include_router(workspace_router, prefix="/api", tags=["workspace"])
