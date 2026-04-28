from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from google import genai
from dotenv import load_dotenv
import os
import uuid
import datetime
import json

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

alerts = []

class SOSRequest(BaseModel):
    guest_name: str
    room_number: str
    description: str
    location: str

@app.post("/sos")
async def receive_sos(req: SOSRequest):
    prompt = f"""You are an emergency response AI for a hospitality venue.
A guest has triggered an SOS alert. Analyze and respond in JSON only.

Guest: {req.guest_name}
Room: {req.room_number}
Location: {req.location}
Description: {req.description}

Respond with exactly this JSON structure, no markdown, no explanation:
{{
  "crisis_type": "one of: Medical, Fire, Security, Structural, Other",
  "severity": "one of: Critical, High, Medium, Low",
  "staff_instructions": "clear 2-3 sentence instruction for staff",
  "should_call_911": true or false,
  "estimated_response_time": "e.g. 3-5 minutes"
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        response_format={"type": "json_object"}
    )

    ai_result = json.loads(response.choices[0].message.content)

    alert = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.datetime.now().isoformat(),
        "guest_name": req.guest_name,
        "room_number": req.room_number,
        "location": req.location,
        "description": req.description,
        "status": "active",
        **ai_result
    }
    alerts.append(alert)
    return alert

@app.get("/alerts")
async def get_alerts():
    return alerts

@app.patch("/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: str):
    for alert in alerts:
        if alert["id"] == alert_id:
            alert["status"] = "resolved"
            return alert
    return {"error": "Alert not found"}

@app.post("/alerts/{alert_id}/report")
async def generate_report(alert_id: str):
    alert = next((a for a in alerts if a["id"] == alert_id), None)
    if not alert:
        return {"error": "Alert not found"}

    prompt = f"""Generate a concise post-incident report for a hospitality emergency.

Incident Data:
- Guest: {alert['guest_name']}, Room {alert['room_number']}
- Location: {alert['location']}
- Crisis Type: {alert['crisis_type']}
- Severity: {alert['severity']}
- Description: {alert['description']}
- Staff Instructions Given: {alert['staff_instructions']}
- 911 Called: {alert['should_call_911']}
- Status: {alert['status']}

Write a 3-4 sentence professional incident report summarizing what happened, actions taken, and recommendations."""

    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {
        "alert_id": alert_id,
        "report": response.text.strip()
    }

@app.get("/")
async def root():
    return {"status": "CrisisSync backend running"}