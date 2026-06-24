"use client";

import { useEffect, useState } from "react";
import {
  Video,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Clock,
  MapPin,
  FileText,
  ListChecks,
  Loader2,
  Lock,
  Download,
} from "lucide-react";
import { getCheckin, confirmCheckin, updateCheckinActionItem } from "@/lib/api";

interface CheckInPageProps {
  params: { token: string };
}

interface ActionItem {
  id: string;
  task: string;
  due_date?: string | null;
  status: "open" | "done";
}

interface Summary {
  tldr: string;
  decisions: string[];
  topics: string[];
}

interface MeetingInfo {
  meeting_id: string;
  meeting_title: string;
  scheduled_at: string;
  location: string;
  participant_name: string;
  already_checked_in: boolean;
  attendance_locked?: boolean;
  processing_status?: string | null;
  summary?: Summary | null;
  action_items?: ActionItem[];
}

const IN_PROGRESS_STATUSES = ["queued", "transcribing", "diarizing", "extracting", "sending_email"];

const PROCESSING_LABEL: Record<string, string> = {
  queued: "Menunggu antrian...",
  transcribing: "Sedang transkripsi audio...",
  diarizing: "Mengidentifikasi pembicara...",
  extracting: "Membuat ringkasan...",
  sending_email: "Mengirim notulen...",
};

export default function CheckInPage({ params }: CheckInPageProps) {
  const [meetingInfo, setMeetingInfo] = useState<MeetingInfo | null>(null);
  const [tokenError, setTokenError] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Local action items state for optimistic toggle
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  // Track which item ids are being toggled
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());


  useEffect(() => {
    getCheckin(params.token)
      .then((data) => {
        setMeetingInfo(data);
        if (data.already_checked_in) setCheckedIn(true);
        if (data.action_items) {
          setActionItems(data.action_items);
        }
      })
      .catch(() => setTokenError(true))
      .finally(() => setInitialLoading(false));
  }, [params.token]);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await confirmCheckin(params.token);
      setCheckedIn(true);
    } catch {
      setTokenError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActionItem = async (item: ActionItem) => {
    if (togglingIds.has(item.id)) return;
    const newStatus = item.status === "done" ? "open" : "done";

    // Optimistic update
    setActionItems((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, status: newStatus } : a))
    );
    setTogglingIds((prev) => new Set(prev).add(item.id));

    try {
      await updateCheckinActionItem(params.token, item.id, newStatus);
    } catch {
      // Revert on error
      setActionItems((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, status: item.status } : a))
      );
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  const handleDownloadPdf = () => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    window.open(`${base}/check-in/${params.token}/notulen.pdf`, "_blank");
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const notulenReady =
    meetingInfo?.processing_status === "done" || meetingInfo?.processing_status === "completed";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-2xl mx-auto px-6 flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
            <Video size={12} className="text-white" />
          </div>
          <span className="font-bold text-sm text-slate-800 tracking-wide">MeetMate</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 space-y-6">

        {/* Loading */}
        {initialLoading && (
          <div className="flex flex-col items-center py-20 gap-3 text-slate-400">
            <Loader2 size={28} className="animate-spin" />
            <p className="text-sm">Memvalidasi undangan...</p>
          </div>
        )}

        {/* Token error */}
        {!initialLoading && tokenError && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center gap-3 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100">
              <AlertCircle size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Link Tidak Valid</h2>
            <p className="text-sm text-slate-500">Link undangan ini tidak valid.</p>
          </div>
        )}

        {/* Portal content */}
        {!initialLoading && !tokenError && meetingInfo && (
          <>
            {/* Meeting info header */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-1">
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Portal Peserta</p>
              <h1 className="text-xl font-bold text-slate-900">{meetingInfo.meeting_title}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} /> {formatDate(meetingInfo.scheduled_at)}
                </span>
                {meetingInfo.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} /> {meetingInfo.location}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 pt-1">
                Halo, <span className="font-semibold text-slate-900">{meetingInfo.participant_name}</span>!
              </p>
            </div>

            {/* KARTU 1: PRESENSI */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <CheckCircle2 size={14} /> Presensi
              </h2>

              {checkedIn ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-600">Hadir ✓</p>
                    <p className="text-xs text-slate-400">Kehadiran Anda sudah tercatat.</p>
                  </div>
                </div>
              ) : meetingInfo.attendance_locked ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center">
                    <Lock size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Presensi Ditutup</p>
                    <p className="text-xs text-slate-400">Waktu check-in sudah berakhir.</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleCheckIn}
                  disabled={loading}
                  className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold text-sm py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>Check In Sekarang <ArrowRight size={14} /></>
                  )}
                </button>
              )}
            </div>

            {/* KARTU 2: NOTULEN */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <FileText size={14} /> Notulen
                </h2>
                {/* PDF Download button — hanya tampil jika notulen sudah selesai */}
                {notulenReady && meetingInfo.summary && (
                  <button
                    id="btn-download-pdf"
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                  >
                    <Download size={12} />
                    Download PDF
                  </button>
                )}
              </div>

              {!meetingInfo.processing_status ? (
                <p className="text-sm text-slate-400">Rekaman rapat belum diupload.</p>
              ) : IN_PROGRESS_STATUSES.includes(meetingInfo.processing_status) ? (
                <div className="flex items-center gap-3 text-slate-500">
                  <Loader2 size={16} className="animate-spin text-blue-500 shrink-0" />
                  <p className="text-sm">{PROCESSING_LABEL[meetingInfo.processing_status] ?? "Sedang diproses..."}</p>
                </div>
              ) : meetingInfo.processing_status === "failed" ? (
                <p className="text-sm text-rose-400">Pemrosesan rekaman gagal.</p>
              ) : meetingInfo.summary ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ringkasan</p>
                    <p className="text-sm text-slate-700">{meetingInfo.summary.tldr}</p>
                  </div>
                  {meetingInfo.summary.decisions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Keputusan</p>
                      <ul className="space-y-1">
                        {meetingInfo.summary.decisions.map((d, i) => (
                          <li key={i} className="text-sm text-slate-700 flex gap-2">
                            <span className="text-blue-400 shrink-0">•</span> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {meetingInfo.summary.topics.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Topik</p>
                      <div className="flex flex-wrap gap-2">
                        {meetingInfo.summary.topics.map((t, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Notulen belum tersedia.</p>
              )}
            </div>

            {/* KARTU 3: ACTION ITEMS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <ListChecks size={14} /> Action Items Saya
              </h2>

              {actionItems.length === 0 ? (
                <p className="text-sm text-slate-400">Tidak ada action item untuk Anda di rapat ini.</p>
              ) : (
                <ul className="space-y-3">
                  {actionItems.map((item) => {
                    const isDone = item.status === "done";
                    const isToggling = togglingIds.has(item.id);
                    return (
                      <li key={item.id} className="flex items-start gap-3">
                        {/* Toggle circle button */}
                        <button
                          id={`toggle-action-${item.id}`}
                          onClick={() => handleToggleActionItem(item)}
                          disabled={isToggling}
                          title={isDone ? "Tandai sebagai Open" : "Tandai sebagai Selesai"}
                          className={`
                            mt-0.5 shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center
                            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1
                            ${isToggling ? "opacity-50 cursor-wait" : "cursor-pointer"}
                            ${isDone
                              ? "bg-emerald-500 border-emerald-500 text-white focus:ring-emerald-400"
                              : "border-slate-300 hover:border-emerald-400 focus:ring-emerald-400"
                            }
                          `}
                        >
                          {isToggling ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : isDone ? (
                            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                              <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : null}
                        </button>

                        {/* Task text */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm leading-snug transition-all duration-200 ${
                              isDone ? "line-through text-slate-400" : "text-slate-700"
                            }`}
                          >
                            {item.task}
                          </p>
                          {item.due_date && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              Tenggat:{" "}
                              {new Date(item.due_date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          )}
                        </div>

                        {/* Status badge — clickable shortcut */}
                        <button
                          onClick={() => handleToggleActionItem(item)}
                          disabled={isToggling}
                          className={`
                            text-xs font-medium px-2 py-0.5 rounded-full shrink-0 transition-all duration-200
                            ${isToggling ? "opacity-50 cursor-wait" : "cursor-pointer hover:opacity-80"}
                            ${isDone
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                            }
                          `}
                        >
                          {isDone ? "Selesai" : "Open"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="py-4 text-center text-[11px] text-slate-400 border-t border-slate-200">
        © {new Date().getFullYear()} MeetMate Platform
      </footer>
    </div>
  );
}
