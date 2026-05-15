from app.core.exceptions import ApplicationError


class StudentContextRepository:
    async def get_context(self, user_id: int) -> dict:
        raise ApplicationError(
            message="Student context integration is not implemented in Phase 1.",
            error_code="STUDENT_CONTEXT_NOT_IMPLEMENTED",
            status_code=501,
            details=[{"user_id": user_id}],
        )
