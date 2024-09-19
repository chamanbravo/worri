from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    POSTGRES_HOST: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_DB: str = "worri"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_PORT: str = "5432"


ENV = Environment()
