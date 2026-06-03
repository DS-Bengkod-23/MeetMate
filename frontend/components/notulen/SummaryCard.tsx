"use client";

import React from "react";
import { FileText, Sparkles, CheckCircle2, Tag } from "lucide-react";

interface SummaryData {
  executiveSummary: string;
  highlights: string[];
  topics?: string[];
}

interface SummaryCardProps {
  summary: SummaryData;
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <div className="space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-4">
        <Sparkles size={16} className="text-[#7E61F2]" />
        <h3 className="text-sm font-bold text-white">Ringkasan Otomatis AI</h3>
      </div>

      {/* Topics / Topik Dibahas */}
      {summary.topics && summary.topics.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Tag size={12} /> Topik yang Dibahas
          </h4>
          <div className="flex flex-wrap gap-2">
            {summary.topics.map((topic, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ringkasan Eksekutif */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <FileText size={12} /> Ringkasan Eksekutif
        </h4>
        <p className="text-xs leading-relaxed text-slate-300 bg-white/[0.02] p-4 rounded-xl border border-white/5">
          {summary.executiveSummary}
        </p>
      </div>

      {/* Keputusan / Highlights */}
      {summary.highlights && summary.highlights.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Keputusan Rapat
          </h4>
          <div className="grid gap-2.5">
            {summary.highlights.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/[0.08] transition duration-200"
              >
                <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-300 leading-normal">{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
