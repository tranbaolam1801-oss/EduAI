from pydantic import BaseModel, Field


class MentorMessageRequest(BaseModel):
    session_id: int | None = Field(default=None, ge=1)
    user_id: int = Field(ge=1)
    message: str = Field(min_length=1, max_length=2000)


class AgentMetadata(BaseModel):
    key: str
    name: str
    status: str
    description: str
