from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

CURRENT_DIR = Path(__file__).resolve().parent
SERVICE_ROOT = CURRENT_DIR.parent.parent
WORKSPACE_ROOT = SERVICE_ROOT.parent

load_dotenv(SERVICE_ROOT / ".env")
load_dotenv(WORKSPACE_ROOT / ".env")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(extra="ignore")

    app_name: str = "AI Learning System AI Service"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    backend_api_url: str = "http://localhost:3000/api/v1"
    ai_model: str = "gpt-4o-mini"
    llm_provider: str = "openai"
    openai_api_key: str | None = None
    gemini_api_key: str | None = Field(default=None, alias="GEMINI_API_KEY")


@lru_cache
def get_settings() -> Settings:
  return Settings()
