from typing import Any

from pydantic import BaseModel, Field


class ErrorBody(BaseModel):
    code: str
    message: str
    details: list[dict[str, Any]] = Field(default_factory=list)


class SuccessResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Any = Field(default_factory=dict)


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorBody
