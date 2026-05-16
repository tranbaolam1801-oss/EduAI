from pydantic import BaseModel, Field


class QuizGenerateRequest(BaseModel):
    skill_id: int = Field(ge=1)
    skill_name: str = Field(min_length=1, max_length=120)
    difficulty_level: str = Field(min_length=1, max_length=20)
    number_of_questions: int = Field(ge=1, le=20)
    time_limit_minutes: int | None = Field(default=None, ge=1, le=240)


class QuizEvaluateRequest(BaseModel):
    attempt_id: int = Field(ge=1)
    quiz_title: str = Field(min_length=1, max_length=200)
    skill_name: str | None = Field(default=None, max_length=120)
    score: float = Field(ge=0, le=100)
    passing_score: float = Field(ge=0, le=100)
    correct_count: int = Field(ge=0)
    total_questions: int = Field(ge=1)
