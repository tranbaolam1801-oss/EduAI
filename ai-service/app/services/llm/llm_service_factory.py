from app.core.config import get_settings
from app.core.exceptions import ApplicationError
from app.services.llm.base_llm_service import BaseLlmService
from app.services.llm.gemini_service import GeminiService
from app.services.llm.openai_service import OpenAiService


def create_llm_service() -> BaseLlmService:
    settings = get_settings()
    provider = settings.llm_provider.lower()

    if provider == "openai":
        return OpenAiService()

    if provider == "gemini":
        return GeminiService()

    raise ApplicationError(
        message=f"Unsupported LLM provider: {settings.llm_provider}.",
        error_code="LLM_PROVIDER_UNSUPPORTED",
        status_code=500,
    )
