from fastapi import FastAPI

from api import user_router

app = FastAPI(title="Worri", version="0.1.0")

app.include_router(user_router, prefix="/api/users", tags=["users"])
