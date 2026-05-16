from fastapi import APIRouter

from app.schemas.ai.quiz import QuizEvaluateRequest, QuizGenerateRequest
from app.schemas.common.api_response import SuccessResponse
from app.services.phase4_ai_service import build_quiz_draft, build_quiz_feedback

router = APIRouter(prefix="/quiz", tags=["quiz"])


@router.post("/generate", response_model=SuccessResponse)
async def generate_quiz(payload: QuizGenerateRequest) -> SuccessResponse:
    return SuccessResponse(
        message="Quiz draft generated successfully.",
        data=build_quiz_draft(payload),
    )


@router.post("/evaluate", response_model=SuccessResponse)
async def evaluate_quiz(payload: QuizEvaluateRequest) -> SuccessResponse:
    return SuccessResponse(
        message="Quiz evaluation generated successfully.",
        data=build_quiz_feedback(payload),
    )
