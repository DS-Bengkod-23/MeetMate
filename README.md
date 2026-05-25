# MeetMate

> Your offline meeting companion. Auto-transcribe, summarize, and distribute notulen with zero cloud dependency.

MeetMate is an end-to-end meeting management application designed for offline meetings (kantor, FGD, interview). It handles the full meeting lifecycle: scheduling, sending email invitations, attendance check-in, recording upload, automatic transcription and summarization, and notulen distribution to participants.

Built fully self-hosted with local LLM, MeetMate prioritizes privacy and zero recurring cost.

## Features

- Create meeting with schedule, location, agenda, and participant list
- Send email invitations with magic-link check-in
- Manual attendance check-in
- Upload audio recording (mp3, mp4, wav, m4a)
- Automatic transcription (Whisper large-v3, bilingual ID + EN)
- Speaker diarization (pyannote.audio)
- AI-generated summary, key decisions, and action items (Ollama + qwen2.5:7b)
- Auto-distribute notulen via email to all participants
- Search across all meetings and notulen
- CRUD recording document per meeting

## Tech Stack

**Frontend:** Next.js, shadcn/ui, Tailwind CSS
**Backend:** FastAPI, Celery, Redis, PostgreSQL
**ML Pipeline:** Whisper large-v3, pyannote.audio, Ollama (qwen2.5:7b)
**Storage:** MinIO (S3-compatible, local)
**Email:** Mailhog (dev) / SMTP (production)
**Infra:** Docker Compose

## Architecture

[insert architecture diagram di sini setelah dibikin]

## Status

Currently in MVP development. Built as a team project by 3 developers (background: data science / ML).

## License

MIT
