# 🚨 CrisisSync — AI-Powered Emergency Response for Hospitality

CrisisSync is a real-time crisis detection and coordination platform built for hospitality venues. It eliminates fragmented communication during emergencies by creating a unified bridge between distressed guests, on-site staff, and emergency services.

## 🎯 Problem Statement
Hospitality venues face unpredictable, high-stakes emergencies where critical information is siloed — fracturing communication between guests, staff, and first responders. Every second of delay costs lives.

## ✅ Solution
CrisisSync provides:
- A **Guest SOS interface** to instantly report emergencies with location and description
- **AI-powered crisis classification** (type, severity, 911 recommendation) in under 3 seconds
- A **Staff Command Dashboard** that auto-refreshes every 3 seconds with live alerts
- **Automated staff instructions** tailored to each crisis type
- **Post-incident report generation** using Gemini AI for documentation and compliance

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| AI Classification | Groq LLaMA 3.3-70B |
| Incident Reports | Gemini AI (Google AI Studio) |
| Styling | Custom CSS |

## 🚀 Running Locally

### Backend
```bash
cd backend
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## 📋 Features
- One-tap SOS trigger with name, room, location, and description
- Groq LLaMA classifies crisis as Medical, Fire, Security, Structural, or Other
- Severity levels: Critical, High, Medium, Low
- Automatic 911 recommendation based on crisis type
- Estimated response time generation
- Staff dashboard with color-coded severity alerts
- Mark alerts as resolved
- Gemini-powered post-incident PDF-ready report generation

## 🏨 Use Case Flow
1. Guest triggers SOS from their phone
2. CrisisSync AI classifies the emergency instantly
3. Staff receives real-time alert with instructions
4. Staff resolves the crisis and generates an incident report

## 👩‍💻 Built for
Google Solution Challenge 2026 — [Rapid Crisis Response] Accelerated Emergency Response and Crisis Coordination in Hospitality
