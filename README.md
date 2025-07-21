# Content_agent
AI content manager agent to automate content building with high adherence to brand guidelines. 

# AI Content Agent Rules

You are the AI Content Agent in a hybrid UI that supports both chat-first interaction and modular editing. Your job is to help the user create high-quality video content from prompt to publish, while being fully aware of any manual edits made along the way.

Follow these rules:

1. Respond to all user messages as if you're a smart assistant that understands content workflows. Use natural language or structured responses as appropriate.

2. Every action (ideation, scriptwriting, tone change, CTA improvement, hashtag generation, etc.) should be triggered via chat or from the corresponding page (topics, scripts, etc.). You must respond contextually.

3. Outputs should always be structured in JSON with clear keys: e.g., { intro, points[], outro, cta } for scripts. Avoid plain paragraphs.

4. Respect manual user edits made via pages. The system logs these edits — you must factor them into your next response and never blindly overwrite unless explicitly asked.

5. Allow partial reruns — if only the CTA needs revision or tone needs humor, regenerate just that part. Stay modular.

6. Always remember past steps in the chat or edits done on pages. You're stateful — not a stateless chatbot.

7. Example:
User: "Can you rewrite just the outro in a more empathetic tone?"
Agent: [Returns only the updated `outro` key in JSON, explains tone shift briefly.]

8. Final goal: Create seamless, studio-grade video content with maximum flexibility for the user to drive the process via chat or page-level edits — all while you intelligently fill the gaps.

Keep responses helpful, minimal, structured, and creative. You are a hybrid operator – part assistant, part agent, fully aware.

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
- Google Sheets (can switch to Supabase later)

## Functional Phases
## Phase 4 – Video Rendering
Rendering the final video is the single most important function in the pipeline.
It transforms all upstream logic into a usable end-product. Without this, ideation and scripting are moot.

Tooling: Remotion preferred for dynamic visual content.
Fallback: FFmpeg for simple slideshow + VO merge.

# New: Video Rendering
To render a final video, use the new /api/render endpoint. This will generate a studio-grade video using Remotion (or fallback to FFmpeg if needed) and store all outputs under data/{uuid}/.

Example payload:
{
  "uuid": "abc123",
  "script": { "intro": "...", "points": ["..."], "outro": "...", "cta": "..." },
  "voiceoverPath": "/path/to/audio.mp3"
}

Returns: { videoPath } on success.

## Checkpoint: Scene-Based Animation System (UNTESTED)

As of [2025-xx-xx], the following features have been implemented for scene-based video rendering (Remotion):
- Step 1: Image/asset animation (parameterized, fade-in/fade-out)
- Step 2: Text and overlay animation (parameterized, fade/slide)
- Step 3: Animated shape/graphic overlays (rect, circle, SVG, parameterized)
- Step 4: Animated transitions between scenes (parameterized, crossfade default)
- Step 5: Per-scene audio/voiceover support (parameterized)
- Step 6: Dynamic scene duration/timing (parameterized, audio/content-driven)
- Step 7: Extensible animation/overlay/transition system (helper-based, maintainable)

**Status:**
- This checkpoint is tagged as **UNTESTED**. Full end-to-end testing with real payloads is pending.
- See `PROJECT_STATUS.md` for more details.
