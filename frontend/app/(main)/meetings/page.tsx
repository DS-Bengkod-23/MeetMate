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
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden pb-12">
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 space-y-10">
        {/* HEADER SECTION */}
        <div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-3 duration-300">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Selamat datang, {userName}!
          </h1>
          <p className="text-sm text-slate-500">Kelola dan tinjau riwayat rapat pintar Anda dengan mudah.</p>
        </div>

        {/* UTILITY BAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-slate-200 shadow-sm rounded-2xl p-4 animate-in fade-in-0 slide-in-from-bottom-3 duration-300 delay-75">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari rapat berdasarkan nama atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:border-slate-400 transition-all outline-none">
                <Filter size={16} className="text-blue-600" />
                <span>{statusFilter}</span>
                <ChevronDown size={14} className="opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-slate-200 text-slate-700 rounded-xl shadow-md p-1 min-w-[160px]">
                {["Semua Status", "Dijadwalkan", "Selesai", "Dibatalkan"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className="rounded-lg px-3 py-2 text-sm focus:bg-blue-700 focus:text-white cursor-pointer transition-colors"
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/meetings/new"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-sm font-bold text-white shadow-sm transition-all duration-300"
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
              <div key={i} className="h-48 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-white border border-dashed border-red-200 rounded-2xl shadow-sm">
            <p className="text-rose-400 text-sm">Gagal memuat data rapat. Pastikan backend sudah berjalan.</p>
          </div>
        ) : meetings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-0 slide-in-from-bottom-3 duration-300 delay-150">
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
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
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
                          ? "bg-blue-700 text-white"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
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
          <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl shadow-sm">
            <p className="text-slate-500 text-sm">
              {debouncedQuery ? "Tidak ada hasil pencarian." : "Belum ada rapat. Buat rapat baru!"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
