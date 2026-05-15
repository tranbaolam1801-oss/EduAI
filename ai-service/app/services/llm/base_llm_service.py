from abc import ABC, abstractmethod
from typing import Any


class BaseLlmService(ABC):
    @abstractmethod
    async def generate_json(self, prompt: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        """Return structured JSON from a provider."""
