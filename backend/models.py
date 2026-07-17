from sqlalchemy import Column, Integer, String, JSON, Boolean
from database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    phone = Column(String(50))
    email = Column(String(255), index=True)
    responses = Column(JSON)
    score = Column(Integer, default=0)
    is_hot_lead = Column(Boolean, default=False)
    ai_report = Column(JSON, nullable=True)

class ExploringLead(Base):
    __tablename__ = "exploring_leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    phone = Column(String(50))
    email = Column(String(255), index=True)
    responses = Column(JSON)
    score = Column(Integer, default=0)
    ai_report = Column(JSON, nullable=True)

class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, index=True) # References leads.id
    preferred_date = Column(String(50))
    preferred_time = Column(String(50))
    status = Column(String(50), default="Pending")
