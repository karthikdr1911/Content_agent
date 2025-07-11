# Tech Stack

Here's the finalized tech stack for the end-to-end prompt-to-video pipeline:

| Stage                       | Final Tech/API Choice               | Notes                                                                                   |
|-----------------------------|-------------------------------------|-----------------------------------------------------------------------------------------|
| 1. Ideation & Script        | **OpenAI GPT-4 API**                | Best-in-class LLM for topic ideation and script generation.                             |
| 2. AI Image / Asset Gen     | **OpenAI DALL·E 3 API**             | High-fidelity images, on-brand color control, prompt-to-asset in one call.              |
| 3. Voiceover (TTS)          | **ElevenLabs**                      | Natural-sounding, expressive speech; programmatic API with SSML support.                |
| 4. Video Rendering          | **Remotion (with FFmpeg fallback)** | React-based templates driving FFmpeg under the hood; fully code-driven, production-grade.|
| 5. Data Logging & Tracking  | **Google Sheets API**               | Simple, low-overhead logging and audit trail; easy query and export.                    |
| 6. Frontend Hosting         | **Vercel**                          | Instant React deployments, supports serverless Remotion renders via Edge Functions.     |
| 7. Deployment Orchestration | **GitHub Actions → Vercel**         | Push-to-main triggers build and deployment; keeps pipeline CI/CD simple and robust.     |
