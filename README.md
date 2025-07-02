=======
# Content_agent
AI content manager agent to automate content building with high adherence to brand guidelines. 

>>>>>>> 7bad15b0 (checkpoint: v0.1)
# content-agent

## Overview
Automates content ideation, script generation, voiceover, video rendering, and scheduling using LLM agents and external services. Minimal UI via React. Outputs stored in Google Sheets by default.

## Folder Structure
```
content-agent/
│
├── agents/                 # LLM agents (ideation, scripting, analytics)
├── services/               # External service integrations (TTS, video, APIs, Google Sheets)
├── templates/              # Video templates (Remotion or JSON configs)
├── data/                   # Local or synced content database
├── ui/                     # Minimal UI for preview/chat (React)
├── utils/                  # Reusable logic/helpers
├── .env                    # API keys (OpenAI, ElevenLabs, Google, etc.)
├── README.md
└── index.ts                # Entry point to run the full pipeline
```

## Setup
1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Add your API keys to `.env` (see example below).

## .env Example
```
OPENAI_API_KEY=your_key
ELEVENLABS_API_KEY=your_key
GOOGLE_SERVICE_ACCOUNT_JSON=
SHEET_ID=your_sheet_id
```

## Usage
- Run the pipeline:
  ```bash
  npx tsx index.ts
  ```
- Launch the React UI:
  ```bash
  npx tsx ui/chat.tsx
  ```

## Troubleshooting
- If you see dependency conflicts (especially with React/Remotion), use:
  ```bash
  npm install --legacy-peer-deps
  ```
- For type errors, ensure all dependencies are installed and up to date.

## Default Output Storage
<<<<<<< HEAD
- Google Sheets (can switch to Supabase later) 
=======
- Google Sheets (can switch to Supabase later) 
>>>>>>> 7bad15b0 (checkpoint: v0.1)
