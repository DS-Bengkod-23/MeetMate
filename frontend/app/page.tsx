"use client";

import { useState } from "react";
import Link from "next/link";
import { Video } from "lucide-react";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Format file apa saja yang didukung oleh MeetMate?",
      answer: "MeetMate mendukung format audio dan video populer seperti MP3, WAV, M4A, MP4, dan MKV dengan ukuran maksimal hingga 100MB per unggahan."
    },
    {
      question: "Berapa lama waktu yang dibutuhkan AI untuk memproses rapat?",
      answer: "Rata-rata proses transkripsi dan perangkuman memakan waktu sekitar 15-20% dari total durasi video/audio yang Anda unggah. Sebagai contoh, rapat berdurasi 1 jam akan selesai diproses dalam waktu 8-12 menit saja."
    },
    {
      question: "Apakah data rekaman rapat saya aman di MeetMate?",
      answer: "Sangat aman. Kami menerapkan enkripsi end-to-end untuk setiap file yang diunggah. Data rekaman dan transkrip Anda bersifat rahasia dan tidak akan pernah digunakan sebagai data pelatihan untuk model AI publik luar."
    },
    {
      question: "Apakah MeetMate bisa mendeteksi bahasa kasual atau campuran (Indish/Jaksel)?",
      answer: "Ya! Model AI kami sudah dioptimalkan untuk memahami konteks percakapan formal bahasa Indonesia maupun bahasa kasual sehari-hari, termasuk istilah-istilah bahasa Inggris yang sering terselip di dunia profesional."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* 1. NAVBAR */}
      <header className="border-b border-slate-200 sticky top-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-blue-800 flex items-center justify-center group-hover:bg-blue-700 transition">
              <Video size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-wide text-slate-900">MeetMate</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-500">
            <a href="#features" className="hover:text-blue-700 transition">Fitur</a>
            <a href="#cara-kerja" className="hover:text-blue-700 transition">Cara Kerja</a>
            <a href="#testimoni" className="hover:text-blue-700 transition">Testimoni</a>
            <a href="#faq" className="hover:text-blue-700 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition">
              Masuk
            </Link>
            <Link href="/register" className="text-sm font-medium bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition shadow-sm">
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 mb-6">
          ✨ AI-Powered Meeting Assistant
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-[1.15] mb-6 text-slate-900">
          Notulensi Rapat Jadi <span className="text-blue-700">Lebih Mudah</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Ubah rekaman rapat menjadi transkrip teks, ringkasan otomatis, dan daftar action items terstruktur dalam hitungan detik menggunakan kecerdasan buatan.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition text-base shadow-sm">
            Mulai Sekarang
          </Link>
          <a href="#cara-kerja" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-semibold transition text-base border border-slate-200">
            Lihat Cara Kerja
          </a>
        </div>
      </section>

      {/* 3. FEATURE HIGHLIGHTS */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-slate-900">Semua yang Anda Butuhkan untuk Notulensi</h2>
          <p className="text-slate-500">Fokus saja pada diskusi rapat, biar MeetMate yang mencatat dan merangkum semuanya.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-blue-300 hover:shadow-md transition group">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-blue-700 group-hover:text-white transition">📝</div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Transkrip Otomatis</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Mengonversi suara dari rekaman rapat menjadi teks bahasa Indonesia dengan akurasi tinggi.</p>
          </div>
          <div className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-blue-300 hover:shadow-md transition group">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-blue-700 group-hover:text-white transition">✨</div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Ringkasan AI</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Mendapatkan poin-poin penting dan kesimpulan rapat tanpa harus membaca seluruh transkrip.</p>
          </div>
          <div className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-blue-300 hover:shadow-md transition group">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-blue-700 group-hover:text-white transition">🎯</div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Action Items</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Mendeteksi tugas, penanggung jawab, dan tenggat waktu secara otomatis dari percakapan rapat.</p>
          </div>
        </div>
      </section>

      {/* 4. CARA KERJA */}
      <section id="cara-kerja" className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-slate-900">Cara Kerja MeetMate</h2>
            <p className="text-slate-500">Hanya butuh 3 langkah mudah sampai ringkasan rapatmu siap digunakan.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center mx-auto mb-6 font-bold">1</div>
              <h4 className="text-lg font-bold mb-2 text-slate-900">Unggah Rekaman</h4>
              <p className="text-slate-500 text-sm">Upload file audio atau video hasil rapat yang sudah selesai dilaksanakan.</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center mx-auto mb-6 font-bold">2</div>
              <h4 className="text-lg font-bold mb-2 text-slate-900">Proses Analisis AI</h4>
              <p className="text-slate-500 text-sm">AI kami bekerja mengekstrak suara, melakukan transkripsi, hingga membuat summary.</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center mx-auto mb-6 font-bold">3</div>
              <h4 className="text-lg font-bold mb-2 text-slate-900">Selesai & Bagikan</h4>
              <p className="text-slate-500 text-sm">Notulensi matang siap dibaca, diedit, atau langsung dibagikan ke tim kerja.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONI SECTION */}
      <section id="testimoni" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-slate-900">Apa Kata Mereka Tentang MeetMate?</h2>
          <p className="text-slate-500">Telah membantu ratusan profesional menghemat jam kerja mereka dari mencatat notulen manual.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-amber-400 flex gap-1 mb-4 text-sm">⭐⭐⭐⭐⭐</div>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                &ldquo;Bener-bener life saver buat Scrum Master kayak aku. Gak perlu lagi pusing dengerin ulang rekaman sejam buat bikin sprint review note. Sekali upload langsung beres!&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6 border-t border-slate-100 pt-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">AS</div>
              <div>
                <h5 className="font-bold text-sm text-slate-900">Aris Setiawan</h5>
                <p className="text-xs text-slate-400">Project Manager / Tech Corp</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-amber-400 flex gap-1 mb-4 text-sm">⭐⭐⭐⭐⭐</div>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                &ldquo;Akurasi transkripsi bahasa Indonesianya di luar ekspektasi saya, bahkan istilah teknis bahasa Inggris pun bisa ketangkap dengan pas dan otomatis terangkum rapi.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6 border-t border-slate-100 pt-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">DN</div>
              <div>
                <h5 className="font-bold text-sm text-slate-900">Dewi N.</h5>
                <p className="text-xs text-slate-400">Product Owner / Startup Ind</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-amber-400 flex gap-1 mb-4 text-sm">⭐⭐⭐⭐⭐</div>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                &ldquo;Fitur Action Items-nya juara sih. Gak ada lagi kejadian anggota tim lupa tugas atau lupa siapa PIC-nya gara-gara catatan rapat yang hilang.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6 border-t border-slate-100 pt-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">RF</div>
              <div>
                <h5 className="font-bold text-sm text-slate-900">Riza Fahlevi</h5>
                <p className="text-xs text-slate-400">Operations Lead / Agency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-slate-900">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-slate-500">Punya pertanyaan lain seputar MeetMate? Temukan jawabannya di bawah ini.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden transition">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-medium text-slate-800 hover:text-blue-700 transition"
                >
                  <span>{faq.question}</span>
                  <span className={`text-xl transform transition-transform duration-200 ${activeFaq === idx ? "rotate-45 text-blue-600" : "text-slate-400"}`}>
                    ＋
                  </span>
                </button>
                <div className={`px-6 transition-all duration-300 ease-in-out border-slate-100 overflow-hidden ${activeFaq === idx ? "max-h-40 pb-5 border-t pt-4 opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className="text-slate-500 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-blue-800 flex items-center justify-center">
              <Video size={14} className="text-white" />
            </div>
            <span className="font-bold text-base tracking-wide text-slate-900">MeetMate</span>
          </div>
          <p>© {new Date().getFullYear()} MeetMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
