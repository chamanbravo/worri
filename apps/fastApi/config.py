from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    POSTGRES_HOST: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_DB: str = "worri"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_PORT: str = "5432"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    SECRET_KEY: str = "dc601fa393c8c0e07f65b49a58cabb9b"


ENV = Environment()
