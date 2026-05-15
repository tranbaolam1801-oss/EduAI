from datetime import datetime, timezone

from app.core.config import get_settings


def build_health_payload() -> dict[str, str]:
    settings = get_settings()
    return {
        "service": "ai-service",
        "environment": settings.app_env,
        "provider": settings.llm_provider,
        "model": settings.ai_model,
        "backend_api_url": settings.backend_api_url,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
