from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    database_url: str 
    secret_key: str = "fallback-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    db_pool_size: int = 10
    db_max_overflow: int = 20

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()