from fastapi import FastAPI

from api import auth_router, user_router

app = FastAPI(title="Worri", version="0.1.0")

app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(user_router, prefix="/api", tags=["user"])
