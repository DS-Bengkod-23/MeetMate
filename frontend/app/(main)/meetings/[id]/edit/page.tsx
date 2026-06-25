"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Type, MapPin, Calendar, FileText, X, Plus, Clock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useMeeting, useUpdateMeeting } from "@/hooks/useMeeting";
import { FormError } from "@/components/ui/form-error";
import { extractApiError } from "@/lib/utils";

export default function EditMeetingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: meeting, isLoading, isError } = useMeeting(id);
  const { mutateAsync: updateMeeting, isPending } = useUpdateMeeting(id);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    dateTime: "",
    description: "",
    agenda: "",
    durationHours: 1,
    durationMins: 0,
  });
  const [participants, setParticipants] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!meeting) return;
    const localDateTime = meeting.scheduled_at
      ? new Date(meeting.scheduled_at).toISOString().slice(0, 16)
      : "";
    setFormData({
      title: meeting.title ?? "",
      location: meeting.location ?? "",
      dateTime: localDateTime,
      description: meeting.description ?? "",
      agenda: meeting.agenda_text ?? "",
      durationHours: Math.floor((meeting.duration_minutes ?? 60) / 60),
      durationMins: (meeting.duration_minutes ?? 60) % 60,
    });
    const existingEmails = (meeting.participants ?? []).map((p: any) => p.email);
    setParticipants(existingEmails);
  }, [meeting]);

  const handleAddParticipant = () => {
    const email = emailInput.trim();
    if (!email) return;
    if (!email.includes("@")) {
      toast.error("Format email tidak valid!");
      return;
    }
    if (participants.includes(email)) {
      toast.error("Email sudah ada dalam daftar!");
      return;
    }
    setParticipants((prev) => [...prev, email]);
    setEmailInput("");
  };

  const handleRemoveParticipant = (email: string) => {
    setParticipants((prev) => prev.filter((e) => e !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const totalMinutes = formData.durationHours * 60 + formData.durationMins;
    if (totalMinutes === 0) {
      setFormError("Durasi rapat tidak boleh 0 menit.");
      return;
    }

    try {
      await updateMeeting({
        title: formData.title,
        scheduled_at: new Date(formData.dateTime).toISOString(),
        location: formData.location,
        description: formData.description,
        agenda_text: formData.agenda,
        participant_emails: participants,
        duration_minutes: totalMinutes,
      });
      toast.success("Rapat berhasil diperbarui!");
      router.push(`/meetings/${id}`);
    } catch (err: any) {
      setFormError(extractApiError(err, "Gagal memperbarui rapat. Coba lagi."));
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-xs font-medium">
        Memuat data rapat...
      </div>
    );
  }

  if (isError || !meeting) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <p className="text-rose-400 text-sm">Rapat tidak ditemukan atau terjadi kesalahan.</p>
        <Link href="/meetings" className="text-blue-600 text-xs hover:underline">
        Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-10 space-y-8">
        <Link
          href={`/meetings/${id}`}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition text-xs font-medium"
        >
          <ArrowLeft size={16} /> Kembali ke Detail Rapat
        </Link>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Edit Rapat</h1>
          <p className="text-sm text-slate-500">Perbarui informasi rapat yang sudah dijadwalkan.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 space-y-8"
        >
          {/* SECTION 1: DETAIL RAPAT */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold text-blue-700 uppercase tracking-wider border-b border-slate-200 pb-2">
              1. Detail Rapat
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                  <Type size={14} className="text-slate-500" /> Judul Rapat <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                  <MapPin size={14} className="text-slate-500" /> Lokasi / Tautan Rapat
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                  <Calendar size={14} className="text-slate-500" /> Jadwal & Waktu Pelaksanaan <span className="text-blue-600">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all [color-scheme:light]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                  <Clock size={14} className="text-slate-500" /> Durasi Rapat <span className="text-blue-600">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.durationHours}
                    onChange={(e) => setFormData({ ...formData, durationHours: Number(e.target.value) })}
                    className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  >
                    {[0, 1, 2, 3, 4].map((h) => (
                      <option key={h} value={h}>{h} jam</option>
                    ))}
                  </select>
                  <select
                    value={formData.durationMins}
                    onChange={(e) => setFormData({ ...formData, durationMins: Number(e.target.value) })}
                    className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  >
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m} value={m}>{m} menit</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: DESKRIPSI & AGENDA */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold text-blue-700 uppercase tracking-wider border-b border-slate-200 pb-2">
              2. Deskripsi & Agenda
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                  <FileText size={14} className="text-slate-500" /> Deskripsi Singkat
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                  <FileText size={14} className="text-slate-500" /> Poin-Poin Agenda
                </label>
                <textarea
                  rows={4}
                  value={formData.agenda}
                  onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PESERTA */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold text-blue-700 uppercase tracking-wider border-b border-slate-200 pb-2">
              3. Daftar Peserta
            </h2>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500">Tambah Peserta (Email)</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddParticipant())}
                  placeholder="Ketik email peserta..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddParticipant}
                  className="px-4 rounded-xl bg-white border border-slate-300 text-blue-600 hover:bg-blue-700 hover:text-white transition-all flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                * Tekan Enter atau klik tombol + untuk menambahkan. Klik × untuk menghapus peserta.
              </p>

              {participants.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {participants.map((email) => (
                    <span
                      key={email}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-slate-200 text-blue-600 rounded-lg text-xs font-medium"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() => handleRemoveParticipant(email)}
                        className="text-blue-600 hover:text-rose-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {participants.length === 0 && (
                <p className="text-xs text-slate-400 italic">Belum ada peserta. Tambahkan email di atas.</p>
              )}
            </div>
          </div>

          <FormError message={formError} />

          {/* FOOTER ACTIONS */}
          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Link
              href={`/meetings/${id}`}
              className="w-full sm:w-auto text-center px-6 py-3 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-semibold text-sm transition-all"
            >
              Batalkan
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-sm transition-all duration-300 disabled:opacity-50"
            >
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
