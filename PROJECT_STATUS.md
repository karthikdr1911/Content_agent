# 🚀 Project Status — Content Agent (Split Frontend + Backend)

Automates content ideation → script → voiceover → video → scheduling using LLMs, APIs, and a minimal UI.

## 🧱 Directory Structure

```
project-root/
├── backend/           # Express.js API server
├── frontend/          # React + agent logic (Cursor-managed)
├── shared/ (optional) # Shared constants/types
```

## 📊 Functional Phases

| Phase                        | Owner                | Status   | Notes                                 |
|------------------------------|----------------------|----------|---------------------------------------|
| 1️⃣ Ideation (OpenAI)        | Backend + Frontend   | 🔡 50%   | Agent placeholder exists, needs OpenAI logic |
| 2️⃣ Script Generation        | Backend + Frontend   | 🔢       | Needs LLM prompt + storage            |
| 3️⃣ Voiceover (ElevenLabs)   | Backend              | 🔢       | No integration yet                    |
| 4️⃣ Video Rendering          | Backend              | 🔢       | FFmpeg/Remotion pending               |
| 5️⃣ Google Sheets Logging    | Backend              | 🔢       | Needs service + API route             |
| 6️⃣ UI + Testing Flow        | Frontend             | 🔡 40%   | chat.tsx built, needs wiring          |
| 7️⃣ API Layer (Express)      | Backend              | 🔢       | Planning endpoints now                |
| 8️⃣ Output Storage & Tracking| Backend              | 🔢       | Plan UUID folder + logs               |

## 🛠️ Next Actions

**Backend Team**


**Frontend Team (Cursor)**


## 🔪 End-to-End Testing Path

- Prompt → POST /api/ideate
- Topic → POST /api/script
- Script → POST /api/voiceover
- VO + Script → POST /api/render
- Metadata → POST /api/google-sheet

## 🔐 Environment Variables Required

- OPENAI_API_KEY
- ELEVENLABS_API_KEY
- GOOGLE_SERVICE_ACCOUNT_JSON
- SHEET_ID
- PORT

Place these in respective .env files in frontend/ and backend/ as needed.

## 📌 Final Goal

A production-ready, testable pipeline to generate video content from a single prompt — fully previewable and logged — split cleanly across a backend API and a Cursor-powered frontend. 

## Checkpoint: Scene-Based Animation System (UNTESTED)

- Steps 1-7 implemented (see README for details)
- All animation, overlay, and transition logic is parameterized and extensible
- No hardcoding; all features are driven by payload
- **UNTESTED:** End-to-end validation and sample payload testing are still pending 