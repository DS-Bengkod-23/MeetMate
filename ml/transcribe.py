import os
from faster_whisper import WhisperModel
try:
    from .schemas import TranscriptResult, TranscriptSegment
except ImportError:
    from schemas import TranscriptResult, TranscriptSegment


def transcribe(audio_path: str, model_size: str = "large-v3") -> TranscriptResult:
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"File audio tidak ditemukan: {audio_path}")

    supported = (".mp3", ".mp4", ".wav", ".m4a", ".flac", ".ogg", ".webm")
    if not audio_path.lower().endswith(supported):
        raise ValueError(f"Format file tidak didukung: {audio_path}")

    try:
        model_size = os.getenv("WHISPER_MODEL", model_size)
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        result, info = model.transcribe(audio_path, beam_size=5)
        raw_segments = list(result)
    except Exception as e:
        raise RuntimeError(f"Whisper gagal memproses audio: {e}") from e

    segments = [
        TranscriptSegment(
            speaker="SPEAKER_00",
            start=seg.start,
            end=seg.end,
            text=seg.text.strip(),
        )
        for seg in raw_segments
    ]

    duration = segments[-1].end if segments else 0.0
    language = info.language or "id"

    return TranscriptResult(
        segments=segments,
        language=language,
        duration=duration,
    )
