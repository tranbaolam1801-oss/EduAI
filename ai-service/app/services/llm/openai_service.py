from typing import Any

from openai import AsyncOpenAI

from app.core.config import get_settings
from app.core.exceptions import ApplicationError
from app.services.llm.base_llm_service import BaseLlmService


class OpenAiService(BaseLlmService):
    def __init__(self) -> None:
        settings = get_settings()
        self.model = settings.ai_model
        self.api_key = settings.openai_api_key
        self.client = AsyncOpenAI(api_key=self.api_key) if self.api_key else None

    async def generate_json(self, prompt: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        raise ApplicationError(
            message="OpenAI generation is not implemented in Phase 1.",
            error_code="OPENAI_NOT_IMPLEMENTED",
            status_code=501,
            details=[{"prompt_preview": prompt[:80], "context_keys": list((context or {}).keys())}],
        )
