import os
from pathlib import Path
import ollama
try:
    from .schemas import TranscriptResult, SummaryResult, ActionItem
except ImportError:
    from schemas import TranscriptResult, SummaryResult, ActionItem

PROMPTS_DIR = Path(__file__).parent / "prompts"
MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")


def _load_prompt(name: str) -> str:
    return (PROMPTS_DIR / name).read_text(encoding="utf-8")


def extract_summary(transcript: TranscriptResult) -> str:
    template = _load_prompt("summary.txt")
    prompt = template.format(transcript=transcript.full_text)

    response = ollama.chat(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.message.content.strip()


def extract_action_items(transcript: TranscriptResult) -> list[ActionItem]:
    import json

    template = _load_prompt("action_items.txt")
    prompt = template.format(transcript=transcript.full_text)

    response = ollama.chat(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.message.content.strip()
    items = json.loads(raw)
    return [ActionItem(**item) for item in items]
