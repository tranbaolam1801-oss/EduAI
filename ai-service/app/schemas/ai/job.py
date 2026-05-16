from pydantic import BaseModel, Field


class JobSummary(BaseModel):
    job_id: int = Field(ge=1)
    job_title: str = Field(min_length=1, max_length=200)
    company_name: str = Field(min_length=1, max_length=200)
    match_percent: float = Field(ge=0, le=100)


class JobExplainRequest(BaseModel):
    user_id: int = Field(ge=1)
    preferred_location: str | None = Field(default=None, max_length=150)
    top_skills: list[dict] = Field(default_factory=list)
    jobs: list[JobSummary] = Field(default_factory=list)
