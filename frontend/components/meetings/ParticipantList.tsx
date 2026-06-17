"use client";

import React from "react";
import { Mail, UserCheck } from "lucide-react";

interface ParticipantListProps {
  emails: string[];
}

export default function ParticipantList({ emails }: ParticipantListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <UserCheck size={14} className="text-blue-600" />
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Daftar Undangan ({emails.length})
        </h3>
      </div>

      <div className="max-h-[180px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
        {emails.length > 0 ? (
          emails.map((email) => (
            <div
              key={email}
              className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition"
            >
              <Mail size={12} className="text-slate-500" />
              <span className="text-xs text-slate-700 font-mono truncate">{email}</span>
            </div>
          ))
        ) : (
          <p className="text-xs italic text-slate-500">Tidak ada peserta yang diundang.</p>
        )}
      </div>
    </div>
  );
}
