from fastapi import APIRouter

from app.agents.registry import AGENT_REGISTRY
from app.schemas.ai.mentor import AgentMetadata
from app.schemas.common.api_response import SuccessResponse

router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("", response_model=SuccessResponse)
async def list_agents() -> SuccessResponse:
    data = [AgentMetadata(**agent.__dict__).model_dump() for agent in AGENT_REGISTRY]
    return SuccessResponse(message="Success", data=data)
