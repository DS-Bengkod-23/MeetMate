"use client";

import { useState } from "react";
import Link from "next/link";
import { Video, Mic, Sparkles, CheckSquare, ChevronDown, ArrowRight, Play } from "lucide-react";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Format file apa saja yang didukung oleh MeetMate?",
      answer: "MeetMate mendukung format audio dan video populer seperti MP3, WAV, M4A, MP4, dan MKV dengan ukuran maksimal hingga 200MB per unggahan.",
    },
    {
      question: "Berapa lama waktu yang dibutuhkan AI untuk memproses rapat?",
      answer: "Rata-rata 15–20% dari durasi rekaman. Rapat 1 jam akan selesai diproses dalam 8–12 menit.",
    },
    {
      question: "Apakah data rekaman rapat saya aman?",
      answer: "Sangat aman. MeetMate sepenuhnya self-hosted — data tidak pernah keluar dari server Anda. Tidak ada cloud pihak ketiga yang terlibat.",
    },
    {
      question: "Apakah MeetMate bisa mendeteksi bahasa campuran (Indonesia + Inggris)?",
      answer: "Ya! Model Whisper yang kami gunakan sudah dioptimalkan untuk percakapan profesional bahasa Indonesia termasuk istilah teknis bahasa Inggris.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Video size={15} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-wide text-slate-900">MeetMate</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition">Fitur</a>
            <a href="#cara-kerja" className="hover:text-slate-900 transition">Cara Kerja</a>
            <a href="#testimoni" className="hover:text-slate-900 transition">Testimoni</a>
            <a href="#faq" className="hover:text-slate-900 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition px-3 py-2">
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white px-5 py-2 rounded-lg transition shadow-md shadow-indigo-500/20"
            >
              Mulai Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        {/* Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-float absolute top-20 left-[10%] w-72 h-72 rounded-full bg-indigo-400/15 blur-3xl" />
          <div className="animate-float-slow absolute top-40 right-[8%] w-96 h-96 rounded-full bg-violet-400/10 blur-3xl" />
          <div className="animate-float-delay absolute bottom-20 left-[35%] w-64 h-64 rounded-full bg-purple-400/8 blur-3xl" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-medium mb-8">
                <Sparkles size={12} />
                AI-Powered · 100% Self-Hosted · Offline-First
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                <span className="text-slate-900">Notulensi Rapat</span>
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Otomatis dengan AI
                </span>
              </h1>

              <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-lg">
                Upload rekaman rapat — dapatkan transkrip, ringkasan, dan action items dalam hitungan menit. Data tidak pernah keluar dari server kamu.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-semibold px-8 py-4 rounded-xl transition shadow-xl shadow-indigo-500/25 text-base"
                >
                  Mulai Sekarang <ArrowRight size={16} />
                </Link>
                <a
                  href="#cara-kerja"
                  className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-xl transition text-base"
                >
                  <Play size={14} /> Lihat Cara Kerja
                </a>
              </div>

              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-200">
                {[["100%", "Self-Hosted"], ["Whisper", "Large-v3"], ["Offline", "First"]].map(([val, label]) => (
                  <div key={label}>
                    <p className="text-lg font-bold text-slate-900">{val}</p>
                    <p className="text-xs text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — fake UI mockup */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-3xl blur-2xl" />

                <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Fake browser bar */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-400/60" />
                      <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
                    </div>
                    <div className="flex-1 mx-3 bg-white border border-slate-200 rounded-md h-5 text-[10px] text-slate-400 flex items-center px-2">
                      meetmate.local/meetings
                    </div>
                  </div>

                  {/* Fake nav */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded bg-gradient-to-br from-indigo-500 to-violet-600" />
                      <span className="text-xs font-bold text-slate-800">MeetMate</span>
                    </div>
                    <div className="flex gap-3 text-[10px] text-slate-400">
                      <span className="text-indigo-600 font-semibold">Rapat</span>
                      <span>Tugas Saya</span>
                    </div>
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[9px] text-white flex items-center justify-center font-bold">U</div>
                  </div>

                  {/* Fake content */}
                  <div className="p-5 space-y-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Selamat datang kembali 👋</p>
                        <p className="text-sm font-bold text-slate-800">Dashboard Rapat</p>
                      </div>
                      <div className="bg-indigo-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg">+ Rapat Baru</div>
                    </div>

                    {/* Fake meeting cards */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { title: "Sprint Review Q2", date: "Hari ini", color: "emerald" },
                        { title: "Stakeholder Sync", date: "Besok", color: "indigo" },
                        { title: "All-Hands June", date: "3 hari lagi", color: "amber" },
                        { title: "1:1 Engineering", date: "Minggu ini", color: "violet" },
                      ].map((m) => (
                        <div key={m.title} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                          <div className={`w-2 h-2 rounded-full bg-${m.color}-400 mb-2`} />
                          <p className="text-[11px] font-semibold text-slate-800 leading-tight">{m.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{m.date}</p>
                        </div>
                      ))}
                    </div>

                    {/* Fake processing bar */}
                    <div className="bg-white border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-medium text-slate-700">All-Hands June — AI sedang memproses</p>
                        <span className="text-[10px] text-amber-500 font-semibold">72%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full w-[72%] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1.5">Extracting summary...</p>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="animate-float absolute -top-4 -right-6 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/30">
                  ✓ Notulen Selesai
                </div>
                <div className="animate-float-delay absolute -bottom-4 -left-6 bg-white border border-slate-200 text-slate-700 text-[10px] font-medium px-3 py-1.5 rounded-full shadow-xl">
                  🎯 3 Action Items Baru
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative py-28 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3">Fitur Unggulan</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Semua yang Kamu Butuhkan, <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">dalam Satu Platform</span>
            </h2>
            <p className="text-slate-500">Fokus pada diskusi — biarkan MeetMate yang menangani dokumentasinya.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Mic size={22} />,
                gradient: "from-indigo-500 to-blue-600",
                glow: "shadow-indigo-500/20",
                title: "Transkripsi Akurat",
                desc: "Teknologi Whisper large-v3 mengonversi suara rapat menjadi teks bahasa Indonesia dengan akurasi tinggi, termasuk istilah teknis.",
              },
              {
                icon: <Sparkles size={22} />,
                gradient: "from-violet-500 to-purple-600",
                glow: "shadow-violet-500/20",
                title: "Ringkasan AI",
                desc: "Dapatkan poin penting, keputusan, dan topik yang dibahas — tanpa harus membaca seluruh transkrip.",
              },
              {
                icon: <CheckSquare size={22} />,
                gradient: "from-purple-500 to-pink-600",
                glow: "shadow-purple-500/20",
                title: "Action Items Otomatis",
                desc: "AI mendeteksi tugas, PIC, dan tenggat waktu dari percakapan — langsung terorganisir dan bisa dikelola.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group bg-white border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/10 rounded-2xl p-8 transition-all duration-300"
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white mb-6 shadow-lg ${f.glow} group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARA KERJA ── */}
      <section id="cara-kerja" className="py-28 border-t border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3">Cara Kerja</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Dari Rekaman ke Notulen <br />dalam 3 Langkah</h2>
            <p className="text-slate-500">Sederhana, cepat, dan sepenuhnya otomatis.</p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-indigo-200/0 via-indigo-300 to-indigo-200/0" />

            {[
              { step: "01", title: "Upload Rekaman", desc: "Drag & drop file audio atau video hasil rapat. MP3, WAV, M4A, MP4 — semua didukung.", icon: "🎙️" },
              { step: "02", title: "AI Memproses", desc: "Whisper transkripsi audio, diarisasi pembicara, dan LLM ekstrak ringkasan & action items.", icon: "⚡" },
              { step: "03", title: "Notulen Siap", desc: "Transkrip, ringkasan, dan action items langsung muncul di dashboard dan dikirim via email.", icon: "✅" },
            ].map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="relative inline-flex mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-2xl">
                    {s.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 text-[10px] font-black text-indigo-600 bg-white border border-indigo-200 rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                    {s.step.slice(1)}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">{s.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONI ── */}
      <section id="testimoni" className="py-28 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3">Testimoni</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Apa Kata Pengguna MeetMate?</h2>
            <p className="text-slate-500">Telah membantu tim-tim profesional menghemat jam kerja dari notulensi manual.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Aris Setiawan", role: "Project Manager · Tech Corp", initials: "AS", gradient: "from-indigo-500 to-blue-600", quote: "Bener-bener life saver buat Scrum Master kayak aku. Gak perlu lagi pusing dengerin ulang rekaman sejam buat bikin sprint review note." },
              { name: "Dewi N.", role: "Product Owner · Startup Ind", initials: "DN", gradient: "from-violet-500 to-purple-600", quote: "Akurasi transkripsi bahasa Indonesianya di luar ekspektasi. Istilah teknis bahasa Inggris pun bisa ketangkap dan terangkum rapi." },
              { name: "Riza Fahlevi", role: "Operations Lead · Agency", initials: "RF", gradient: "from-purple-500 to-pink-600", quote: "Fitur Action Items-nya juara. Gak ada lagi kejadian anggota tim lupa tugas gara-gara catatan rapat yang hilang." },
            ].map((t) => (
              <div key={t.name} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-7 flex flex-col justify-between hover:border-slate-300 transition">
                <div>
                  <div className="text-4xl font-serif text-indigo-300 leading-none mb-4">"</div>
                  <p className="text-slate-600 text-sm leading-relaxed">{t.quote}</p>
                </div>
                <div className="flex items-center gap-3 mt-7 pt-6 border-t border-slate-100">
                  <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-28 border-t border-slate-100 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-slate-500">Punya pertanyaan lain? Langsung coba aja dulu.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden transition hover:border-slate-300">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left text-sm font-medium text-slate-700 hover:text-slate-900 transition gap-4"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${activeFaq === idx ? "rotate-180 text-indigo-500" : ""}`}
                  />
                </button>
                <div className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${activeFaq === idx ? "max-h-40 pb-5" : "max-h-0"}`}>
                  <p className="text-slate-500 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-r from-indigo-100 via-violet-100 to-purple-100 rounded-3xl blur-2xl opacity-60" />
            <div className="relative bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Siap Coba MeetMate?
              </h2>
              <p className="text-slate-500 mb-8">Self-hosted, offline-first. Data kamu tetap di server kamu.</p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-semibold px-8 py-4 rounded-xl transition shadow-xl shadow-indigo-500/25 text-base"
              >
                Daftar Gratis <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Video size={13} className="text-white" />
            </div>
            <span className="font-bold text-base text-slate-900">MeetMate</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} MeetMate. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-slate-400">
            <a href="#features" className="hover:text-slate-700 transition">Fitur</a>
            <a href="#cara-kerja" className="hover:text-slate-700 transition">Cara Kerja</a>
            <a href="#faq" className="hover:text-slate-700 transition">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
