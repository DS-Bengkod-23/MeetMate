import os
from pyannote.audio import Pipeline
try:
    from .schemas import TranscriptResult, TranscriptSegment
except ImportError:
    from schemas import TranscriptResult, TranscriptSegment


def diarize(audio_path: str) -> list[dict]:
    hf_token = os.getenv("HF_TOKEN")
    pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.1",
        token=hf_token,
    )

    result = pipeline(audio_path)
    annotation = result if hasattr(result, 'itertracks') else result.speaker_diarization

    turns = []
    for turn, _, speaker in annotation.itertracks(yield_label=True):
        turns.append({"start": turn.start, "end": turn.end, "speaker": speaker})

    return turns


def merge_transcript_diarization(
    transcript: TranscriptResult,
    diarization: list[dict],
) -> TranscriptResult:
    for segment in transcript.segments:
        mid = (segment.start + segment.end) / 2
        matched = "UNKNOWN"
        for turn in diarization:
            if turn["start"] <= mid <= turn["end"]:
                matched = turn["speaker"]
                break
        segment.speaker = matched

    return transcript
