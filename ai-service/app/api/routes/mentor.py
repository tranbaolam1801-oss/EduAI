from fastapi import APIRouter

from app.schemas.ai.chat import MentorChatRequest
from app.schemas.common.api_response import SuccessResponse
from app.services.phase4_ai_service import build_mentor_reply

router = APIRouter(prefix="/mentor", tags=["mentor"])


@router.post("/chat", response_model=SuccessResponse)
async def send_mentor_message(payload: MentorChatRequest) -> SuccessResponse:
    return SuccessResponse(
        message="Mentor response generated successfully.",
        data=build_mentor_reply(payload),
    )
