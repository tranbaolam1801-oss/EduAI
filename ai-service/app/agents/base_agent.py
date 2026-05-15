from dataclasses import dataclass

from app.core.exceptions import ApplicationError


@dataclass(slots=True)
class BaseAgent:
    key: str
    name: str
    description: str
    status: str = "placeholder"

    async def run(self, payload: dict) -> dict:
        raise ApplicationError(
            message=f"{self.name} is not implemented in Phase 1.",
            error_code="AGENT_NOT_IMPLEMENTED",
            status_code=501,
            details=[{"agent": self.key, "payload_keys": list(payload.keys())}],
        )
