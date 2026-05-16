from typing import Any

from pydantic import BaseModel, Field


class MentorChatRequest(BaseModel):
    session_id: int = Field(ge=1)
    user_id: int = Field(ge=1)
    message: str = Field(min_length=1, max_length=4000)
    context: dict[str, Any] = Field(default_factory=dict)
