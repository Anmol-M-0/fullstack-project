from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Secure API Backend"
    API_V1_STR: str = "/api/v1"
    
    # Security Context
    SECRET_KEY: str  # Must be set in .env
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS setup (Strict in production)
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "https://yourdomain.com"]
    
    # Database
    # Make Postgres variables optional so the app doesn't crash on startup without them
    POSTGRES_SERVER: str | None = None
    POSTGRES_USER: str | None = None
    POSTGRES_PASSWORD: str | None = None
    POSTGRES_DB: str | None = None

    @property
    def async_database_uri(self) -> str:
        # If all Postgres variables exist, use Postgres
        if all([self.POSTGRES_SERVER, self.POSTGRES_USER, self.POSTGRES_PASSWORD, self.POSTGRES_DB]):
            return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"
        
        # Fallback: Use an async SQLite database stored locally in the project root
        return "sqlite+aiosqlite:///./fallback_local.db"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()