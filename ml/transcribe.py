import os
import whisper
try:
    from .schemas import TranscriptResult, TranscriptSegment
except ImportError:
    from schemas import TranscriptResult, TranscriptSegment


def transcribe(audio_path: str, model_size: str = "large-v3") -> TranscriptResult: #coba medium dulu ya 
    model_size = os.getenv("WHISPER_MODEL", model_size)
    model = whisper.load_model(model_size)

    result = model.transcribe(audio_path, word_timestamps=False)

    segments = [
        TranscriptSegment(
            speaker="UNKNOWN",
            start=seg["start"],
            end=seg["end"],
            text=seg["text"].strip(),
        )
        for seg in result["segments"]
    ]

    return TranscriptResult(
        segments=segments,
        full_text=result["text"].strip(),
        language=result.get("language"),
    )
