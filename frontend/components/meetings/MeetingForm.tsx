"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Type, MapPin, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";
import { useCreateMeeting } from "@/hooks/useMeetings";
import { FormError } from "@/components/ui/form-error";
import { extractApiError } from "@/lib/utils";

export default function MeetingForm() {
  const router = useRouter();
  const { mutateAsync: createMeeting, isPending } = useCreateMeeting();
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    dateTime: "",
    description: "",
    agenda: "",
  });
  const [emailInput, setEmailInput] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);

  const handleAddParticipant = () => {
    if (!emailInput) return;
    if (!emailInput.includes("@")) {
      toast.error("Format email tidak valid!");
      return;
    }
    if (participants.includes(emailInput)) {
      toast.error("Email sudah ditambahkan!");
      return;
    }
    setParticipants([...participants, emailInput]);
    setEmailInput("");
  };

  const handleRemoveParticipant = (email: string) => {
    setParticipants(participants.filter((p) => p !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      const result = await createMeeting({
        title: formData.title,
        scheduled_at: new Date(formData.dateTime).toISOString(),
        location: formData.location,
        description: formData.description,
        agenda_text: formData.agenda,
        participant_emails: participants,
      });
      toast.success("Rapat berhasil dijadwalkan!");
      router.push(`/meetings/${result.id}`);
    } catch (err: any) {
      setFormError(extractApiError(err, "Gagal membuat rapat. Coba lagi."));
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 space-y-8"
    >
      {/* SECTION 1: INFORMASI UTAMA */}
      <div className="space-y-5">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">
          1. Detail Rapat
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <Type size={14} className="text-slate-500" /> Judul Rapat <span className="text-blue-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Weekly Standup Sprint"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <MapPin size={14} className="text-slate-500" /> Lokasi / Tautan Rapat <span className="text-blue-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Zoom / Ruang Rapat Lt. 3"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <Calendar size={14} className="text-slate-500" /> Jadwal & Waktu Pelaksanaan <span className="text-blue-600">*</span>
            </label>
            <input
              type="datetime-local"
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all [color-scheme:light]"
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: KONTEN & AGENDA */}
      <div className="space-y-5">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">
          2. Deskripsi & Agenda
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FileText size={14} className="text-slate-500" /> Deskripsi Singkat
            </label>
            <textarea
              rows={4}
              placeholder="Berikan gambaran ringkas mengenai topik rapat utama..."
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FileText size={14} className="text-slate-500" /> Poin-Poin Agenda
            </label>
            <textarea
              rows={4}
              placeholder="1. Pembuka&#10;2. Pembahasan Sprint 24&#10;3. Evaluasi Kendala"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
              onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: PESERTA */}
      <div className="space-y-5">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">
          3. Distribusi Undangan
        </h2>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700">Undang Peserta Rapat (Email)</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddParticipant())}
              placeholder="Ketik email rekan tim kamu di sini..."
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
            <button
              type="button"
              onClick={handleAddParticipant}
              className="px-4 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-700 hover:text-white transition-all flex items-center justify-center outline-none"
            >
              <Plus size={18} />
            </button>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            * Tekan Enter atau klik tombol + untuk memasukkan email ke dalam list undangan.
          </p>

          {participants.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {participants.map((email) => (
                <span
                  key={email}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-slate-200 text-blue-700 rounded-lg text-xs font-medium"
                >
                  <span>{email}</span>
                  <X
                    size={12}
                    className="cursor-pointer text-blue-600 hover:text-red-400 transition-colors"
                    onClick={() => handleRemoveParticipant(email)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <FormError message={formError} />

      {/* FOOTER ACTIONS BUTTON */}
      <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-semibold text-sm transition-all"
        >
          Batalkan
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm transition-all duration-300 disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : "Jadwalkan Pertemuan"}
        </button>
      </div>
    </form>
  );
}
