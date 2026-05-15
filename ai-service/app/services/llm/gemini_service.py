from typing import Any

from app.core.config import get_settings
from app.core.exceptions import ApplicationError
from app.services.llm.base_llm_service import BaseLlmService


class GeminiService(BaseLlmService):
    def __init__(self) -> None:
        settings = get_settings()
        self.model = settings.ai_model
        self.api_key = settings.gemini_api_key

    async def generate_json(self, prompt: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        raise ApplicationError(
            message="Gemini generation is not implemented in Phase 1.",
            error_code="GEMINI_NOT_IMPLEMENTED",
            status_code=501,
            details=[{"prompt_preview": prompt[:80], "context_keys": list((context or {}).keys())}],
        )
