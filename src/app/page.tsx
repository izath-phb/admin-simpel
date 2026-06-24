"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Shield, 
  MapPin, 
  BarChart3, 
  Users, 
  Smartphone, 
  Clock, 
  Activity, 
  CheckCircle,
  FileText,
  TrendingUp
} from "lucide-react";

export default function LandingPage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 overflow-hidden relative selection:bg-indigo-500/30 selection:text-white">
      {/* Dynamic ambient grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* 1. Frosted Navigation Bar */}
      <header className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto">
        <nav className="glass rounded-2xl px-6 py-4 flex items-center justify-between shadow-lg shadow-black/20">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 shadow-md shadow-indigo-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">SIMPEL</span>
              <span className="text-xs block text-slate-500 font-medium">Smart Village Portal</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Fitur Utama</a>
            <a href="#stats" className="hover:text-white transition-colors">Statistik Desa</a>
            <a href="#citizens" className="hover:text-white transition-colors">Aplikasi Warga</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs text-slate-400 font-medium leading-none">Halo,</p>
                  <p className="text-sm font-bold text-white truncate max-w-[120px]">{user.name}</p>
                </div>
                <div className="border-l border-slate-700 h-6 mx-1" />
                {user.role === "admin" && (
                  <Link 
                    href="/dashboard" 
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors mr-1"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setUser(null);
                  }}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold transition-all cursor-pointer bg-transparent border-none"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-indigo-500/20 hover:scale-[1.02] cursor-pointer"
              >
                Masuk ke Portal
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Sistem Informasi Monitoring Desa Modern
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Mewujudkan Desa Pintar & <span className="gradient-text">Transparan</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            SIMPEL mengintegrasikan pelaporan masyarakat secara instan, pemantauan progres infrastruktur, dan administrasi pengajuan surat digital desa secara mandiri.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              user.role === "admin" ? (
                <Link 
                  href="/dashboard" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:scale-[1.02] cursor-pointer"
                >
                  Masuk Dashboard Admin <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-8 py-3.5 text-emerald-400 font-semibold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/5">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Anda Masuk Sebagai Warga Terdaftar
                </div>
              )
            ) : (
              <Link 
                href="/login" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:scale-[1.02] cursor-pointer"
              >
                Masuk ke Portal <ArrowRight className="w-5 h-5" />
              </Link>
            )}
            <a 
              href="#citizens" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <Smartphone className="w-5 h-5 text-indigo-400" /> Unduh App Warga
            </a>
          </div>
        </motion.div>

        {/* Floating Mockup Graphics */}
        <motion.div 
          className="mt-16 relative rounded-2xl border border-slate-800/80 p-2 bg-[#121216]/50 shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2 }}
        >
          <div className="rounded-xl overflow-hidden aspect-[16/9] relative bg-slate-900 border border-slate-800">
            {/* Embedded interactive graphics mimicking active panel */}
            <div className="absolute inset-0 bg-[#0c0c10] p-6 flex flex-col md:flex-row gap-6">
              {/* Left Column: Stats & Projects */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-32 bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-6 w-20 bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold">Live System</div>
                </div>
                
                {/* Visual Report Grid Mockup */}
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
                          <div className="h-2 w-24 bg-slate-800/60 rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${i === 1 ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full`} style={{ width: i === 1 ? '75%' : '40%' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dashboard Chart Representation */}
                <div className="bg-[#141418] border border-slate-800/80 p-5 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-semibold text-slate-300">Grafik Aktivitas Warga</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">7 Hari Terakhir</span>
                  </div>
                  <div className="h-28 flex items-end gap-3 justify-between px-2">
                    {[35, 60, 45, 80, 55, 90, 70].map((h, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400/80 rounded-t-sm" style={{ height: `${h}px` }} />
                        <span className="text-[8px] text-slate-600 font-semibold">Day {idx+1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live document and notification updates */}
              <div className="w-full md:w-80 bg-[#141418] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-slate-300">Status Pengajuan Surat Warga</span>
                </div>
                
                {/* Visual list of documents */}
                <div className="my-4 space-y-3 flex-1 flex flex-col justify-center">
                  <div className="bg-[#1e1e24] border border-slate-800/60 p-2.5 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-white">Surat Pengantar RT/RW</p>
                      <p className="text-[8px] text-slate-500">Diajukan: Hari ini</p>
                    </div>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">Disetujui</span>
                  </div>

                  <div className="bg-[#1e1e24] border border-slate-800/60 p-2.5 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-white">Keterangan Domisili</p>
                      <p className="text-[8px] text-slate-500">Diajukan: Kemarin</p>
                    </div>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">Diproses</span>
                  </div>

                  <div className="bg-[#1e1e24] border border-slate-800/60 p-2.5 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-white">Pernyataan Domisili</p>
                      <p className="text-[8px] text-slate-500">Diajukan: 3 hari lalu</p>
                    </div>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold">Selesai</span>
                  </div>
                </div>

                {/* Simulated live telemetry of document service */}
                <div className="bg-[#0f172a] rounded-lg p-3 font-mono text-[9px] text-emerald-400 space-y-1 border border-slate-800/60">
                  <p className="flex justify-between"><span>[16:20:41] MAIL_SERVER INIT</span><span className="text-emerald-500/70">OK</span></p>
                  <p className="flex justify-between"><span>[16:20:42] INTEGRATION ACTIVE</span><span className="text-emerald-500/70">RT/RW</span></p>
                  <p className="flex justify-between"><span>[16:20:42] SYSTEM STATUS</span><span className="text-emerald-400 font-bold">ONLINE (100%)</span></p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Village Stats Grid Section */}
      <section id="stats" className="py-20 bg-[#0d0d10] border-y border-slate-900/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold tracking-wider text-indigo-400 uppercase mb-3">Statistik SIMPEL</h2>
            <p className="text-3xl md:text-4xl font-bold text-white">Dipercaya Oleh Berbagai Desa</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, num: "1,248+", label: "Warga Terdaftar" },
              { icon: CheckCircle, num: "98.4%", label: "Laporan Terselesaikan" },
              { icon: Activity, num: "45+", label: "Proyek Terpantau" },
              { icon: Clock, num: "24/7", label: "Layanan Surat Online" },
            ].map((stat, idx) => (
              <div key={idx} className="glass p-6 rounded-2xl border border-slate-800/60 text-center hover:border-slate-700/60 transition-all duration-300 hover:scale-[1.03]">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-1.5">{stat.num}</h3>
                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-indigo-400 uppercase mb-3">Keunggulan Platform</h2>
          <p className="text-3xl md:text-4xl font-bold text-white">Layanan Desa Digital Terpadu</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FileText,
              title: "Persuratan Digital Mandiri",
              desc: "Ajukan surat pengantar RT/RW, keterangan domisili, dan dokumen kependudukan secara mandiri & instan langsung dari aplikasi."
            },
            {
              icon: MapPin,
              title: "Pelaporan Geografis (GPS)",
              desc: "Laporan insiden dilengkapi dengan geotagging koordinat lokasi persis kejadian dan foto pendukung secara real-time."
            },
            {
              icon: BarChart3,
              title: "Pemantauan Pembangunan",
              desc: "Visualisasikan kemajuan fisik pengerjaan jalan, jembatan, dan sarana publik lengkap dengan presentase status pengerjaan."
            }
          ].map((feat, idx) => (
            <div key={idx} className="glass p-8 rounded-3xl border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
                <feat.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Citizen Application Download CTA */}
      <section id="citizens" className="py-20 bg-gradient-to-b from-[#0a0a0c] to-[#0d0d10] border-t border-slate-900/60">
        <div className="max-w-5xl mx-auto px-6">
          <div className="glass rounded-3xl p-8 md:p-16 border border-slate-800/80 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Mobile Application</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">SIMPEL Aplikasi Warga Kini Tersedia</h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Laporkan kerusakan fasilitas umum, pantau pengumuman dari ketua RT/RW, dan pantau proyek pembangunan sarana publik langsung dari genggaman Anda.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a href="#" className="inline-flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl px-5 py-3 transition-colors hover:scale-[1.02] cursor-pointer">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                  <div className="text-left">
                    <span className="text-[10px] block text-slate-500 leading-none">Unduh Untuk</span>
                    <span className="text-xs font-bold text-white">Android APK</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Mobile Device Mockup */}
            <div className="w-64 aspect-[9/16] bg-[#121216] border-4 border-slate-800 rounded-[32px] p-2.5 shadow-2xl relative">
              <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-4" />
              <div className="w-full h-full bg-[#0a0a0c] rounded-[22px] overflow-hidden border border-slate-800/80 p-4 space-y-4">
                {/* Simulated mobile view dashboard */}
                <div className="flex items-center justify-between">
                  <div className="w-16 h-4 bg-slate-800 rounded animate-pulse" />
                  <div className="w-5 h-5 rounded-full bg-slate-800" />
                </div>
                <div className="w-full h-24 bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-indigo-400">Status Laporan Anda</span>
                  <div className="space-y-1">
                    <div className="h-2 w-16 bg-slate-800 rounded animate-pulse" />
                    <div className="h-3 w-28 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[8px] rounded px-1.5 py-0.5 inline-block font-semibold">Telah Diselesaikan</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-400">Pemberitahuan Terbaru</span>
                  <div className="w-full bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg space-y-1">
                    <div className="h-2 w-20 bg-slate-800 rounded" />
                    <div className="h-1.5 w-full bg-slate-800/60 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Simple Footer */}
      <footer className="py-8 text-center text-xs text-slate-600 border-t border-slate-900/60">
        <p>&copy; {new Date().getFullYear()} SIMPEL - Sistem Informasi Monitoring & Pelaporan Desa. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}
