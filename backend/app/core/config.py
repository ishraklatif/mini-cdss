from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME:                    str  = "CDSS Backend API"
    APP_VERSION:                 str  = "1.0.0"
    DEBUG:                       bool = True

    DATABASE_URL: str = "postgresql://ishraklatif@localhost:5432/cdss_db"

    FHIR_SERVER_URL:             str  = "http://localhost:8080/fhir"

    REDIS_URL:                   str  = "redis://localhost:6379"

    SECRET_KEY:                  str  = "cdss-dev-secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int  = 60

    CORS_ORIGINS:                str  = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        extra    = "allow"

settings = Settings()