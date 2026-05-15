from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api.routes.agents import router as agents_router
from app.api.routes.health import router as health_router
from app.api.routes.mentor import router as mentor_router
from app.core.config import get_settings
from app.core.exceptions import ApplicationError

settings = get_settings()

app = FastAPI(title=settings.app_name)


@app.exception_handler(ApplicationError)
async def application_error_handler(_request: Request, error: ApplicationError) -> JSONResponse:
    return JSONResponse(
        status_code=error.status_code,
        content={
            "success": False,
            "error": {
                "code": error.error_code,
                "message": error.message,
                "details": error.details,
            },
        },
    )


@app.exception_handler(Exception)
async def unhandled_error_handler(_request: Request, error: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Internal server error.",
                "details": [{"type": error.__class__.__name__}],
            },
        },
    )


app.include_router(health_router, prefix="/api/v1")
app.include_router(agents_router, prefix="/api/v1")
app.include_router(mentor_router, prefix="/api/v1")
