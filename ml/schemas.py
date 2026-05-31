from pydantic import BaseModel
from typing import Optional


class TranscriptSegment(BaseModel):
    speaker: str
    start: float
    end: float
    text: str


class TranscriptResult(BaseModel):
    segments: list[TranscriptSegment]
    full_text: str
    language: Optional[str] = None


class ActionItem(BaseModel):
    assignee: Optional[str]
    task: str
    deadline: Optional[str] = None


class SummaryResult(BaseModel):
    summary: str
    action_items: list[ActionItem]
    key_points: list[str]
