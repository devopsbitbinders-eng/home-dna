from pydantic import BaseModel, EmailStr
from typing import Dict, Any, Optional

class AssessmentSubmit(BaseModel):
    name: str
    phone: str
    email: str
    responses: Dict[str, Any]

class LeadResponse(BaseModel):
    id: int
    name: str
    score: int
    is_hot_lead: bool
    ai_report: Optional[Dict[str, Any]]

    class Config:
        from_attributes = True

class ConsultationSubmit(BaseModel):
    lead_id: int
    preferred_date: str
    preferred_time: str

class ConsultationResponse(BaseModel):
    id: int
    lead_id: int
    preferred_date: str
    preferred_time: str
    status: str

    class Config:
        from_attributes = True
