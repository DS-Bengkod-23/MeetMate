# Plan: Unified Check-in Participant Portal

**Status:** PLAN ONLY — Belum diimplementasikan  
**Owner:** BE (Audi) + FE (Helena)  
**ML:** Tidak ada perubahan

---

## Context

Saat ini magic link hanya dipakai untuk satu aksi — konfirmasi kehadiran. Setelah itu halaman tidak berguna lagi. Ide: jadikan halaman check-in sebagai **portal peserta permanen** yang menampilkan absen, notulen, dan action items di satu tempat. Attendance di-lock otomatis 2 jam setelah organizer upload rekaman.

---

## ML: Tidak Ada Perubahan

ML pipeline tidak perlu disentuh sama sekali. Data yang dihasilkan (summary, transcript, action items) sudah tersimpan di DB dan cukup di-query dari checkin service.

---

## BE Changes (Owner: Audi)

### 1. `backend/app/models/meeting.py`
Tambah satu field:
```python
attendance_locked_at: Mapped[datetime | None] = mapped_column(
    DateTime(timezone=True), nullable=True
)
```

### 2. Migration baru
```bash
docker compose exec backend-api alembic revision --autogenerate -m "add attendance_locked_at to meetings"
make migrate
```

### 3. `backend/app/services/recording.py` — trigger lock saat upload
Di fungsi `upload_recording`, setelah recording berhasil disimpan ke DB, set:
```python
from datetime import timedelta
meeting.attendance_locked_at = datetime.now(timezone.utc) + timedelta(hours=2)
db.commit()
```

### 4. `backend/app/schemas/checkin.py` — expand response
```python
class CheckinSummary(BaseModel):
    tldr: str
    decisions: list[str]
    topics: list[str]

class CheckinActionItem(BaseModel):
    id: UUID
    task: str
    due_date: date | None
    status: str  # "open" | "done"

class CheckinPageResponse(BaseModel):
    meeting_title: str
    scheduled_at: datetime
    location: str | None
    participant_name: str
    already_checked_in: bool
    attendance_locked: bool          # baru
    processing_status: str | None    # baru: status ML pipeline
    summary: CheckinSummary | None   # baru: None kalau ML belum selesai
    action_items: list[CheckinActionItem]  # baru: hanya milik peserta ini
```

### 5. `backend/app/services/checkin.py` — expand `get_checkin_info`
- **Hapus** cek `expires_at` dari `get_checkin_info` (token permanen untuk viewing)
- Tetap cek `attendance_locked_at` di `confirm_checkin` untuk block absen
- Tambah query ke `Recording`, `Summary`, `ActionItem` (filter `assignee_participant_id`)
- Helper:
```python
def _is_attendance_locked(meeting) -> bool:
    if meeting.attendance_locked_at:
        return datetime.now(timezone.utc) > meeting.attendance_locked_at
    # fallback: 48 jam dari scheduled_at
    return datetime.now(timezone.utc) > meeting.scheduled_at + timedelta(hours=48)
```

### 6. `backend/app/routers/checkin.py` — endpoint baru
```python
@router.patch("/check-in/{token}/action-items/{action_item_id}")
def update_action_item_via_token(token, action_item_id, data, db):
    # validasi token → dapat participant → cek action item milik participant → update status
```
Schema baru: `ActionItemStatusUpdate { status: "open" | "done" }`

---

## FE Changes (Owner: Helena)

### 1. `frontend/lib/api.ts`
Tambah fungsi:
```typescript
export const updateCheckinActionItem = async (
  token: string,
  actionItemId: string,
  status: "open" | "done"
) => api.patch(`/check-in/${token}/action-items/${actionItemId}`, { status })
```
Update tipe return `getCheckin` sesuai `CheckinPageResponse` baru dari BE.

### 2. `frontend/app/check-in/[token]/page.tsx` — expand jadi 3 section

**Section 1 — Absen:**
- `attendance_locked = false` + belum absen → tombol check-in
- `already_checked_in = true` → badge "Hadir ✓"
- `attendance_locked = true` + belum absen → "Absensi sudah ditutup"

**Section 2 — Notulen:**
- `processing_status === "completed"` + ada `summary` → tampil ringkasan + decisions
- Status masih jalan → "Notulen sedang diproses..."
- `processing_status === null` → "Rekaman belum diupload"

**Section 3 — Action Items saya:**
- List action items milik peserta ini dari response BE
- Toggle done/open via `updateCheckinActionItem`
- Kosong → "Tidak ada tugas untuk Anda di rapat ini"

---

## Urutan Implementasi yang Disarankan

1. BE: model + migration
2. BE: recording service (set `attendance_locked_at`)
3. BE: schema + service checkin (expand response + helper locked)
4. BE: router checkin (endpoint baru action item)
5. FE: api.ts (update tipe + fungsi baru)
6. FE: halaman check-in (expand UI 3 section)

---

## Verification

1. Buat rapat → cek magic link di Mailhog → buka link → form absen muncul
2. Upload rekaman → 2 jam kemudian buka magic link → tombol absen berubah jadi "ditutup"
3. Setelah ML selesai → buka magic link → section notulen muncul otomatis
4. Klik done di action item → cek di halaman detail rapat apakah status ikut berubah
5. Buka magic link kapan saja → halaman tetap bisa diakses (tidak 404 karena token tidak expire)
