from api import auth_router
from api import user_router
from api import website_router
from api import workspace_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app = FastAPI(title="Worri", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(user_router, prefix="/api", tags=["user"])
app.include_router(website_router, prefix="/api", tags=["website"])
app.include_router(workspace_router, prefix="/api", tags=["workspace"])
