from fastapi import APIRouter

from app.schemas.ai.job import JobExplainRequest
from app.schemas.common.api_response import SuccessResponse
from app.services.phase4_ai_service import build_job_explanations

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("/explain", response_model=SuccessResponse)
async def explain_jobs(payload: JobExplainRequest) -> SuccessResponse:
    return SuccessResponse(
        message="Job explanations generated successfully.",
        data=build_job_explanations(payload),
    )
