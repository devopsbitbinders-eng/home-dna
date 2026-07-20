from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models, schemas, scoring

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Home DNA Assessment API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/submit-assessment", response_model=schemas.LeadResponse)
def submit_assessment(assessment: schemas.AssessmentSubmit, db: Session = Depends(get_db)):
    # 1. Calculate Score
    score, is_hot_lead = scoring.calculate_score(assessment.responses)
    
    # 2. Generate AI Report
    ai_report = scoring.generate_ai_report_mock(assessment.responses)
    
    # 3. Save to Database based on user intent
    timeline = assessment.responses.get("timeline", "")
    
    if timeline == "Just Exploring":
        db_lead = models.ExploringLead(
            name=assessment.name,
            phone=assessment.phone,
            email=assessment.email,
            responses=assessment.responses,
            score=score,
            ai_report=ai_report
        )
    else:
        db_lead = models.Lead(
            name=assessment.name,
            phone=assessment.phone,
            email=assessment.email,
            responses=assessment.responses,
            score=score,
            is_hot_lead=is_hot_lead,
            ai_report=ai_report
        )
        
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    
    # 4. Save to Google Sheets via Webhook (if configured)
    import os
    import requests
    import threading
    
    sheet_webhook_url = os.getenv("GOOGLE_SHEET_WEBHOOK_URL")
    if sheet_webhook_url:
        def send_to_sheet():
            try:
                sheet_data = {
                    "name": assessment.name,
                    "phone": assessment.phone,
                    "email": assessment.email,
                    "score": score,
                    "is_hot_lead": is_hot_lead if timeline != "Just Exploring" else False,
                    "budget": assessment.responses.get("budget", ""),
                    "timeline": timeline,
                    "property_type": assessment.responses.get("property_type", ""),
                    "city": assessment.responses.get("city", "")
                }
                requests.post(sheet_webhook_url, json=sheet_data, timeout=5)
            except Exception as e:
                print(f"Failed to save to Google Sheets: {e}")
        
        # Run in background so it doesn't slow down the user's report generation
        threading.Thread(target=send_to_sheet).start()
    
    # We return the lead object, FastAPI will serialize it to LeadResponse
    return db_lead

@app.get("/")
def read_root():
    return {"message": "Home DNA Backend is running!"}

@app.post("/book-consultation", response_model=schemas.ConsultationResponse)
def book_consultation(consultation: schemas.ConsultationSubmit, db: Session = Depends(get_db)):
    db_consultation = models.Consultation(
        lead_id=consultation.lead_id,
        preferred_date=consultation.preferred_date,
        preferred_time=consultation.preferred_time
    )
    db.add(db_consultation)
    db.commit()
    db.refresh(db_consultation)
    return db_consultation
