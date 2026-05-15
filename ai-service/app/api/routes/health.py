from fastapi import APIRouter

from app.schemas.common.api_response import SuccessResponse
from app.services.system.health_service import build_health_payload

router = APIRouter(prefix="/system", tags=["system"])


@router.get("/health", response_model=SuccessResponse)
async def get_health() -> SuccessResponse:
    return SuccessResponse(message="AI service is running.", data=build_health_payload())
