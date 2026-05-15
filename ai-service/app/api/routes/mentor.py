from fastapi import APIRouter

from app.core.exceptions import ApplicationError
from app.schemas.ai.mentor import MentorMessageRequest

router = APIRouter(prefix="/mentor", tags=["mentor"])


@router.post("/message")
async def send_mentor_message(payload: MentorMessageRequest) -> dict:
    raise ApplicationError(
        message="AI mentor interaction is not implemented in Phase 1.",
        error_code="AI_MENTOR_NOT_IMPLEMENTED",
        status_code=501,
        details=[{"user_id": payload.user_id, "session_id": payload.session_id}],
    )
