"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { api, DashboardStats, Announcement } from "@/lib/api";

const STATUS_COLORS = { pending: "#f59e0b", on_progress: "#6366f1", resolved: "#10b981" };

function StatCard({ label, value, icon, color }: { label: string; value: number | string; icon: React.ReactNode; color: string }) {
  return (
    <div className="glass rounded-2xl p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

const MOCK_STATS: DashboardStats = {
  total_reports: 128,
  pending_reports: 34,
  verified_reports: 45,
  on_progress_reports: 19,
  resolved_reports: 75,
  reports_today: 7,
  total_projects: 12,
  total_budget: 4500000000,
  avg_progress: 61,
  blocked_users: 2,
  chart_data: [
    { month: "Jan", count: 18 },
    { month: "Feb", count: 22 },
    { month: "Mar", count: 15 },
    { month: "Apr", count: 30 },
    { month: "Mei", count: 25 },
    { month: "Jun", count: 18 },
  ],
  recent_logs: [
    { admin: "Admin Desa Bongkok", action: "verifikasi_laporan", target: "Jalan Rusak RT 03", timestamp: new Date().toISOString() },
    { admin: "Admin Desa Bongkok", action: "memperbarui_progres", target: "Renovasi Balai Desa", timestamp: new Date().toISOString() },
  ],
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<DashboardStats>("/dashboard/stats"),
      api.get<Announcement[]>("/announcements/")
    ])
      .then(([statsRes, announcementsRes]) => {
        setStats(statsRes.data);
        setAnnouncements(announcementsRes.data.slice(0, 3)); // Ambil 3 terbaru
      })
      .catch(() => setStats(MOCK_STATS))
      .finally(() => setLoading(false));
  }, []);

  const pieData = [
    { name: "Menunggu", value: stats.pending_reports, color: "#f59e0b" },
    { name: "Diproses", value: stats.on_progress_reports, color: "#6366f1" },
    { name: "Selesai", value: stats.resolved_reports, color: "#10b981" },
  ];

  const formatBudget = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact" }).format(val);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Ringkasan data desa hari ini</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Laporan"
          value={stats.total_reports}
          color="bg-indigo-500/20"
          icon={<svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
        <StatCard
          label="Menunggu Verifikasi"
          value={stats.pending_reports}
          color="bg-amber-500/20"
          icon={<svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Proyek Aktif"
          value={stats.total_projects}
          color="bg-violet-500/20"
          icon={<svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /></svg>}
        />
        <StatCard
          label="Total Anggaran"
          value={formatBudget(stats.total_budget)}
          color="bg-emerald-500/20"
          icon={<svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Warga Diblokir"
          value={stats.blocked_users || 0}
          color="bg-rose-500/20"
          icon={<svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-white mb-4">Laporan per Bulan</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.chart_data} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#141417", border: "1px solid #27272a", borderRadius: 8 }}
                labelStyle={{ color: "#f8fafc" }}
                itemStyle={{ color: "#818cf8" }}
              />
              <Bar dataKey="count" name="Laporan" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Status Laporan</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#141417", border: "1px solid #27272a", borderRadius: 8 }}
                itemStyle={{ color: "#f8fafc" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-slate-400">{d.name}</span>
                </div>
                <span className="font-semibold text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Progress Proyek */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Rata-rata Progres Pembangunan</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-[#27272a] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                style={{ width: `${stats.avg_progress}%` }}
              />
            </div>
            <span className="text-lg font-bold text-white w-12 text-right">{Math.round(stats.avg_progress)}%</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{stats.pending_reports}</p>
              <p className="text-xs text-slate-500 mt-1">Laporan Menunggu</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-400">{stats.on_progress_reports}</p>
              <p className="text-xs text-slate-500 mt-1">Sedang Diproses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{stats.resolved_reports}</p>
              <p className="text-xs text-slate-500 mt-1">Telah Diselesaikan</p>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Aktivitas Admin Terkini</h2>
          <div className="space-y-3">
            {stats.recent_logs?.map((log, i) => (
              <div key={i} className="flex items-center gap-3 text-xs border-b border-[#27272a] pb-2 last:border-0">
                <div className="w-8 h-8 rounded bg-[#1e1e24] flex items-center justify-center text-slate-500 shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{log.admin} <span className="text-slate-500 font-normal">melakukan</span> {log.action.replace(/_/g, ' ')}</p>
                  <p className="text-slate-500 mt-0.5">{log.target}</p>
                </div>
                <span className="text-slate-600 italic">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pengumuman Terkini */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Pengumuman Terkini</h2>
        {announcements.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">Belum ada pengumuman.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="bg-[#1e1e24] border border-[#27272a] rounded-xl overflow-hidden flex flex-col">
                <div className="aspect-video bg-[#141417] relative">
                  <img src={announcement.imageUrl || "/placeholder.png"} alt={announcement.title} className="w-full h-full object-cover" />
                  {announcement.is_carousel && (
                    <span className="absolute top-2 right-2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">Banner</span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-sm font-bold text-white line-clamp-1">{announcement.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{announcement.content}</p>
                  <p className="text-[10px] text-slate-500 mt-auto pt-3">{new Date(announcement.created_at).toLocaleDateString("id-ID")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
