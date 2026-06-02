"use client";

import { useEffect, useState } from "react";
import { Video, CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";
import { getCheckin, confirmCheckin } from "@/lib/api";

interface CheckInPageProps {
  params: {
    token: string;
  };
}

interface MeetingInfo {
  meeting_title: string;
  scheduled_at: string;
  location: string;
  participant_name: string;
  already_checked_in: boolean;
}

export default function CheckInPage({ params }: CheckInPageProps) {
  const [meetingInfo, setMeetingInfo] = useState<MeetingInfo | null>(null);
  const [tokenError, setTokenError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Validasi token saat halaman dibuka
  useEffect(() => {
    getCheckin(params.token)
      .then((data) => {
        setMeetingInfo(data);
        if (data.already_checked_in) setSubmitted(true);
      })
      .catch(() => setTokenError(true))
      .finally(() => setInitialLoading(false));
  }, [params.token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmCheckin(params.token);
      setSubmitted(true);
    } catch {
      setTokenError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Mini Header */}
      <header className="border-b border-gray-800/60 bg-[#0B0F19]/50 backdrop-blur-md py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[#7E61F2] to-[#1D008C] flex items-center justify-center">
            <Video size={12} className="text-white" />
          </div>
          <span className="font-semibold text-sm tracking-wide text-gray-300">MeetMate Presence</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md bg-[#111625] border border-gray-800/80 rounded-2xl p-8 shadow-xl relative z-10">

          {/* Loading awal validasi token */}
          {initialLoading && (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="h-6 w-6 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
              <p className="text-xs text-gray-400">Memvalidasi undangan...</p>
            </div>
          )}

          {/* Token tidak valid */}
          {!initialLoading && tokenError && (
            <div className="text-center py-6 flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Link Tidak Valid</h3>
              <p className="text-sm text-gray-400">Link undangan ini tidak valid atau sudah kadaluarsa.</p>
            </div>
          )}

          {/* Form check-in */}
          {!initialLoading && !tokenError && !submitted && meetingInfo && (
            <>
              <div className="mb-6">
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  Public Access
                </span>
                <h2 className="text-xl font-bold mt-3 text-white">Konfirmasi Kehadiran Rapat</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Halo, <span className="text-indigo-300 font-semibold">{meetingInfo.participant_name}</span>!
                  Kamu diundang ke rapat berikut:
                </p>
              </div>

              {/* Info rapat */}
              <div className="mb-6 bg-gray-900/40 border border-gray-800/60 rounded-xl p-4 text-xs text-gray-400 space-y-1.5">
                <p className="font-semibold text-gray-200">{meetingInfo.meeting_title}</p>
                <p>{formatDate(meetingInfo.scheduled_at)}</p>
                {meetingInfo.location && <p>📍 {meetingInfo.location}</p>}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-3 text-[11px] text-gray-500 font-mono mb-4">
                  Room Token ID: {params.token.substring(0, 12)}...
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-medium text-sm py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Check In Sekarang <ArrowRight size={14} /></>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Sukses */}
          {!initialLoading && !tokenError && submitted && (
            <div className="text-center py-6 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-lg font-bold text-white">Presensi Berhasil Dicatat!</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
                Terima kasih, <span className="text-indigo-400 font-medium">{meetingInfo?.participant_name}</span>. Kehadiran Anda telah sukses direkam.
              </p>
              <div className="text-xs text-gray-500 mt-6 pt-6 border-t border-gray-800/60 w-full">
                Anda sekarang bisa menutup tab halaman ini dengan aman.
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="py-4 text-center text-[11px] text-gray-600 border-t border-gray-900">
        © {new Date().getFullYear()} MeetMate Platform. All rights reserved.
      </footer>
    </div>
  );
}
