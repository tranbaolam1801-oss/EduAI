from pydantic import BaseModel


class HealthData(BaseModel):
    service: str
    environment: str
    provider: str
    model: str
    backend_api_url: str
    timestamp: str
