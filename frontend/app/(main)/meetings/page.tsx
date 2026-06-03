"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Plus, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import MeetingCard from "@/components/meetings/MeetingCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMeetings, useSearchMeetings } from "@/hooks/useMeetings";
import type { MeetingsParams } from "@/lib/api";

const STATUS_MAP: Record<string, "Dijadwalkan" | "Selesai" | "Dibatalkan"> = {
  scheduled: "Dijadwalkan",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const LIMIT = 9;

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MeetingsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua Status");
  const [userName, setUserName] = useState("Pengguna");
  const [page, setPage] = useState(1);

  // Debounce search 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1); // reset ke halaman 1 saat search berubah
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset halaman saat filter status berubah
  useEffect(() => { setPage(1); }, [statusFilter]);

  // Ambil nama dari localStorage untuk sapaan
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("user_profile") || "{}");
    if (profile.name) setUserName(profile.name.split(" ")[0]);
  }, []);

  const apiStatus = statusFilter === "Semua Status" ? undefined : (
    statusFilter === "Dijadwalkan" ? "scheduled" :
    statusFilter === "Selesai" ? "completed" : "cancelled"
  ) as MeetingsParams["status"];

  const { data: meetingsData, isLoading, isError } = useMeetings(
    debouncedQuery ? undefined : { status: apiStatus, page, limit: LIMIT }
  );
  const { data: searchData, isLoading: isSearching } = useSearchMeetings(debouncedQuery);

  const rawItems = debouncedQuery
    ? (searchData?.items ?? [])
    : (meetingsData?.items ?? []);

  const total = debouncedQuery ? (searchData?.total ?? 0) : (meetingsData?.total ?? 0);
  const totalPages = Math.ceil(total / LIMIT);

  const meetings = rawItems.map((m: any) => ({
    id: m.id,
    title: m.title,
    status: STATUS_MAP[m.status] ?? "Dijadwalkan",
    date: formatDate(m.scheduled_at),
    location: m.location ?? "–",
    totalParticipants: m.participant_count ?? 0,
    attendedParticipants: m.attendance_count ?? 0,
    hasTranscript: m.processing_status === "completed",
    hasRecording: m.has_recording ?? false,
  }));

  const loading = isLoading || isSearching;

  return (
    <div className="w-full min-h-screen bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#0b0a26] via-[#08061a] to-[#050412] text-white font-sans relative overflow-hidden pb-12">
      <div className="absolute top-[-10%] left-[-5%] w-[900px] h-[900px] bg-[#7E61F2]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-purple-950/20 rounded-full blur-[130px] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 space-y-10">
        {/* HEADER SECTION */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-purple-400">
            Selamat datang, {userName}!
          </h1>
          <p className="text-sm text-slate-400">Kelola dan tinjau riwayat rapat pintar Anda dengan mudah.</p>
        </div>

        {/* UTILITY BAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#120e2e]/40 p-4 rounded-2xl border border-purple-500/10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Cari rapat berdasarkan nama atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#08061a]/90 border border-purple-500/20 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#08061a]/90 border border-purple-500/20 text-sm font-semibold text-slate-300 hover:text-white hover:border-purple-500/40 transition-all outline-none">
                <Filter size={16} className="text-purple-400" />
                <span>{statusFilter}</span>
                <ChevronDown size={14} className="opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#120e2e] border border-purple-950/60 text-slate-200 rounded-xl shadow-2xl p-1 min-w-[160px]">
                {["Semua Status", "Dijadwalkan", "Selesai", "Dibatalkan"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className="rounded-lg px-3 py-2 text-sm focus:bg-purple-600 focus:text-white cursor-pointer transition-colors"
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/meetings/new"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#7E61F2] to-[#6344E3] hover:from-[#8F75FA] hover:to-[#7254F5] text-sm font-bold text-white shadow-[0_4px_20px_rgba(126,97,242,0.3)] hover:shadow-[0_4px_25px_rgba(126,97,242,0.5)] transition-all duration-300"
            >
              <Plus size={16} />
              <span>Buat Meeting Baru</span>
            </Link>
          </div>
        </div>

        {/* LIST CARDS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-[#120e2e]/20 rounded-2xl border border-dashed border-red-900/30">
            <p className="text-rose-400 text-sm">Gagal memuat data rapat. Pastikan backend sudah berjalan.</p>
          </div>
        ) : meetings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings.map((meeting: any) => (
                <MeetingCard key={meeting.id} {...meeting} />
              ))}
            </div>

            {/* PAGINATION — hanya tampil kalau tidak sedang search dan ada lebih dari 1 halaman */}
            {!debouncedQuery && totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl bg-[#120e2e]/60 border border-purple-500/10 text-slate-400 hover:text-white hover:border-purple-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                        p === page
                          ? "bg-[#7E61F2] text-white"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl bg-[#120e2e]/60 border border-purple-500/10 text-slate-400 hover:text-white hover:border-purple-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={16} />
                </button>

                <span className="text-xs text-slate-500 ml-2">
                  {total} rapat total
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-[#120e2e]/20 rounded-2xl border border-dashed border-purple-950/30">
            <p className="text-slate-500 text-sm">
              {debouncedQuery ? "Tidak ada hasil pencarian." : "Belum ada rapat. Buat rapat baru!"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
