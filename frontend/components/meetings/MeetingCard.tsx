"use client";

import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, FileCheck, ArrowRight, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface MeetingCardProps {
  id: string;
  title: string;
  status: "Dijadwalkan" | "Selesai" | "Dibatalkan";
  date: string;
  location: string;
  totalParticipants: number;
  attendedParticipants: number;
  hasTranscript: boolean;
  hasRecording?: boolean;
}

export default function MeetingCard({
  id,
  title,
  status,
  date,
  location,
  totalParticipants,
  hasTranscript,
  hasRecording,
}: MeetingCardProps) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-300 group">
      <div className="space-y-4">
        {/* Status Badge + Indikator */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={cn(
              "text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase",
              status === "Dijadwalkan" && "bg-indigo-50 text-indigo-700 border border-indigo-200",
              status === "Selesai" && "bg-emerald-50 text-emerald-700 border border-emerald-200",
              status === "Dibatalkan" && "bg-red-50 text-red-700 border border-red-200"
            )}
          >
            {status}
          </span>

          <div className="flex items-center gap-1.5">
            {hasRecording && !hasTranscript && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <Mic size={10} /> Rekaman
              </span>
            )}
            {hasTranscript && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                <FileCheck size={10} /> AI Ready
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-700 transition-colors">
          {title}
        </h3>

        {/* Metadata */}
        <div className="space-y-2 text-xs text-slate-500 font-normal">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-slate-400" />
            <span className="line-clamp-1">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-slate-400" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={13} className="text-slate-400" />
            <span>{totalParticipants} Peserta Terundang</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="border-t border-slate-100 mt-5 pt-4">
        <Link
          href={`/meetings/${id}`}
          className="flex items-center justify-between text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors w-full"
        >
          <span>Lihat Detail Notulensi</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
