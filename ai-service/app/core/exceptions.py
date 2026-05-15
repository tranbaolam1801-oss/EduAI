from fastapi import status


class ApplicationError(Exception):
    def __init__(
        self,
        message: str,
        error_code: str = "APPLICATION_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: list[dict] | None = None,
    ) -> None:
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or []
        super().__init__(message)
