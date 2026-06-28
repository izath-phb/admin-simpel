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
import { api } from "@/lib/api";

interface BigDataStats {
  overview: {
    total_capstore: number;
    total_external: number;
    total_combined: number;
  };
  bar_chart: { name: string; value: number }[];
  pie_chart: { name: string; value: number; color: string }[];
  line_chart: { time: string; volume: number; bmkg?: number; news?: number; weather?: number }[];
}

export default function BigDataPage() {
  const [stats, setStats] = useState<BigDataStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We assume backend is running at http://localhost:5005 or configured in api
    api.get<{status: string, data: BigDataStats}>("/bigdata/stats")
      .then((res) => {
        setStats(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to load big data stats", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Big Data Dashboard</h1>
        <div className="glass rounded-2xl p-6 text-center text-slate-400">
          Gagal memuat data. Pastikan service backend dan database terhubung.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Big Data Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Otomatisasi pemantauan sumber data setiap jam</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 flex flex-col items-center text-center justify-center">
          <p className="text-slate-400 text-sm mb-1">Total Data Capstore</p>
          <p className="text-3xl font-bold text-indigo-400">{stats.overview.total_capstore.toLocaleString('id-ID')}</p>
        </div>
        <div className="glass rounded-2xl p-6 flex flex-col items-center text-center justify-center border border-indigo-500/30">
          <p className="text-slate-400 text-sm mb-1">Total Gabungan</p>
          <p className="text-4xl font-black text-white">{stats.overview.total_combined.toLocaleString('id-ID')}</p>
          <p className="text-xs text-indigo-300 mt-2">Ditarik dari big_data_logs</p>
        </div>
        <div className="glass rounded-2xl p-6 flex flex-col items-center text-center justify-center">
          <p className="text-slate-400 text-sm mb-1">Total Data Eksternal (BMKG dll)</p>
          <p className="text-3xl font-bold text-emerald-400">{stats.overview.total_external.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line Chart */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-white mb-4">Tren Volume Agregasi (Otomatisasi per Jam)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.line_chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#141417", border: "1px solid #27272a", borderRadius: 8 }}
                itemStyle={{ color: "#818cf8" }}
              />
              <Line type="monotone" dataKey="volume" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: "#818cf8" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Detail External Line Chart */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-white mb-4">Tren Data Eksternal (BMKG, Berita, Cuaca) per Jam</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.line_chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#141417", border: "1px solid #27272a", borderRadius: 8 }}
                itemStyle={{ color: "#f8fafc" }}
              />
              <Line type="monotone" dataKey="bmkg" name="Data BMKG" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: "#f59e0b" }} />
              <Line type="monotone" dataKey="news" name="Data Berita" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, fill: "#ec4899" }} />
              <Line type="monotone" dataKey="weather" name="Data Cuaca" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: "#06b6d4" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass rounded-2xl p-6 flex flex-col">
          <h2 className="text-base font-semibold text-white mb-4">Proporsi Sumber Data</h2>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.pie_chart} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                  {stats.pie_chart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#141417", border: "1px solid #27272a", borderRadius: 8 }}
                  itemStyle={{ color: "#f8fafc" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {stats.pie_chart.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-slate-300">{d.name}</span>
                </div>
                <span className="font-semibold text-white">{d.value.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Sebaran Big Data per Entitas</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.bar_chart} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#141417", border: "1px solid #27272a", borderRadius: 8 }}
                itemStyle={{ color: "#f8fafc" }}
                cursor={{ fill: '#27272a' }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
