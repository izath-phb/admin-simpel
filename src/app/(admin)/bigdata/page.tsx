"use client";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { api } from "@/lib/api";
import { Search, Calendar, Filter, Clock } from "lucide-react";

interface BigDataStats {
  overview: {
    total_capstore: number;
    total_external: number;
    total_combined: number;
  };
  internal_bar_chart: { name: string; value: number }[];
  external_pie_chart: { name: string; value: number; color: string }[];
  line_chart: { time: string; volume: number; bmkg?: number; news?: number; weather?: number; users?: number; reports?: number }[];
}

export default function BigDataPage() {
  const [stats, setStats] = useState<BigDataStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Interactive Filters
  const [timeRange, setTimeRange] = useState("24h");
  const [showBMKG, setShowBMKG] = useState(true);
  const [showNews, setShowNews] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [showUsers, setShowUsers] = useState(true);
  const [showReports, setShowReports] = useState(true);

  // Raw Data Search States
  const [rawSource, setRawSource] = useState("news");
  const [searchQuery, setSearchQuery] = useState("");
  const [rawData, setRawData] = useState<any[]>([]);
  const [loadingRaw, setLoadingRaw] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get<{status: string, data: BigDataStats}>(`/bigdata/stats?time_range=${timeRange}`)
      .then((res) => setStats(res.data.data))
      .catch((err) => console.error("Failed to load big data stats", err))
      .finally(() => setLoading(false));
  }, [timeRange]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoadingRaw(true);
      api.get<{status: string, data: any[]}>(`/bigdata/raw?source=${rawSource}&search=${searchQuery}&limit=20`)
        .then((res) => setRawData(res.data.data))
        .catch((err) => console.error("Failed to load raw data", err))
        .finally(() => setLoadingRaw(false));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [rawSource, searchQuery]);

  if (loading && !stats) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="glass rounded-2xl p-6 text-center text-slate-400">Gagal memuat data.</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header & Global Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Big Data Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Pemantauan & Eksplorasi Data Mentah Interaktif</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-800/50 p-1.5 rounded-lg border border-slate-700/50">
          <Calendar className="w-4 h-4 text-slate-400 ml-2" />
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-transparent text-sm text-white focus:outline-none pr-2 cursor-pointer"
          >
            <option value="24h" className="bg-slate-800">24 Jam Terakhir</option>
            <option value="7d" className="bg-slate-800">7 Hari Terakhir</option>
            <option value="30d" className="bg-slate-800">30 Hari Terakhir</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
          <p className="text-slate-400 text-sm mb-1">Total Data Capstone</p>
          <p className="text-3xl font-bold text-indigo-400">{stats.overview.total_capstore.toLocaleString('id-ID')}</p>
        </div>
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
          <p className="text-slate-400 text-sm mb-1">Total Gabungan</p>
          <p className="text-4xl font-black text-white">{stats.overview.total_combined.toLocaleString('id-ID')}</p>
        </div>
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
          <p className="text-slate-400 text-sm mb-1">Total Data Eksternal</p>
          <p className="text-3xl font-bold text-emerald-400">{stats.overview.total_external.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* 4 Charts: 2 Internal, 2 External */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* INTERNAL: Line Chart */}
        <div className="glass rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-base font-semibold text-white">Tren Data Internal</h2>
            
            <div className="flex items-center gap-4 text-sm bg-slate-800/40 py-1.5 px-3 rounded-lg border border-slate-700/50">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <input type="checkbox" checked={showUsers} onChange={(e) => setShowUsers(e.target.checked)} className="accent-indigo-500" />
                <span className="text-indigo-400 font-medium">Users</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <input type="checkbox" checked={showReports} onChange={(e) => setShowReports(e.target.checked)} className="accent-purple-500" />
                <span className="text-purple-400 font-medium">Reports</span>
              </label>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.line_chart || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#141417", border: "1px solid #27272a", borderRadius: 8 }} itemStyle={{ color: "#f8fafc" }} />
              {showUsers && <Line type="monotone" dataKey="users" name="Users" stroke="#818cf8" strokeWidth={3} dot={{ r: 3, fill: "#818cf8", strokeWidth: 0 }} activeDot={{ r: 6 }} />}
              {showReports && <Line type="monotone" dataKey="reports" name="Reports" stroke="#c084fc" strokeWidth={3} dot={{ r: 3, fill: "#c084fc", strokeWidth: 0 }} activeDot={{ r: 6 }} />}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* INTERNAL: Bar Chart */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Sebaran Data Internal</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.internal_bar_chart || []} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#141417", border: "1px solid #27272a", borderRadius: 8 }} cursor={{ fill: '#27272a' }} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* EXTERNAL: Line Chart */}
        <div className="glass rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-base font-semibold text-white">Tren Data Eksternal</h2>
            
            <div className="flex items-center gap-4 text-sm bg-slate-800/40 py-1.5 px-3 rounded-lg border border-slate-700/50">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <input type="checkbox" checked={showBMKG} onChange={(e) => setShowBMKG(e.target.checked)} className="accent-amber-500" />
                <span className="text-amber-500 font-medium">BMKG</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <input type="checkbox" checked={showNews} onChange={(e) => setShowNews(e.target.checked)} className="accent-pink-500" />
                <span className="text-pink-500 font-medium">Berita</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <input type="checkbox" checked={showWeather} onChange={(e) => setShowWeather(e.target.checked)} className="accent-cyan-500" />
                <span className="text-cyan-500 font-medium">Cuaca</span>
              </label>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.line_chart || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#141417", border: "1px solid #27272a", borderRadius: 8 }} itemStyle={{ color: "#f8fafc" }} />
              {showBMKG && <Line type="monotone" dataKey="bmkg" name="Data BMKG" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3, fill: "#f59e0b", strokeWidth: 0 }} activeDot={{ r: 6 }} />}
              {showNews && <Line type="monotone" dataKey="news" name="Data Berita" stroke="#ec4899" strokeWidth={3} dot={{ r: 3, fill: "#ec4899", strokeWidth: 0 }} activeDot={{ r: 6 }} />}
              {showWeather && <Line type="monotone" dataKey="weather" name="Data Cuaca" stroke="#06b6d4" strokeWidth={3} dot={{ r: 3, fill: "#06b6d4", strokeWidth: 0 }} activeDot={{ r: 6 }} />}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* EXTERNAL: Pie Chart */}
        <div className="glass rounded-2xl p-6 flex flex-col">
          <h2 className="text-base font-semibold text-white mb-4">Sebaran Data Eksternal</h2>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.external_pie_chart || []} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                  {(stats.external_pie_chart || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#141417", border: "1px solid #27272a", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {(stats.external_pie_chart || []).map((d) => (
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
      </div>

      {/* Raw Data Search Interactive Table */}
      <div className="glass rounded-2xl p-6 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Eksplorasi Data Mentah</h2>
            <p className="text-sm text-slate-400">Pencarian *real-time* ke dalam database Big Data</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Source Selector */}
            <select 
              value={rawSource}
              onChange={(e) => setRawSource(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none"
            >
              <option value="news">Berita (News)</option>
              <option value="weather">Cuaca (Weather)</option>
              <option value="bmkg">BMKG (Wilayah)</option>
            </select>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5 outline-none placeholder-slate-500 transition-all" 
                placeholder="Cari teks, kota, judul..." 
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-700/50">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
              <tr>
                <th className="px-6 py-4">Waktu (Scraped)</th>
                {rawSource === 'news' && <th className="px-6 py-4">Sumber / Media</th>}
                {(rawSource === 'weather' || rawSource === 'bmkg') && <th className="px-6 py-4">Kota / Lokasi</th>}
                <th className="px-6 py-4 w-1/2">Detail / Konten</th>
              </tr>
            </thead>
            <tbody>
              {loadingRaw ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : rawData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada data yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                rawData.map((item, idx) => (
                  <tr key={item._id || idx} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      {item.scraped_at ? new Date(item.scraped_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : 'Unknown'}
                    </td>
                    
                    {rawSource === 'news' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-pink-500/10 text-pink-400 px-2.5 py-1 rounded-full text-xs border border-pink-500/20">
                          {item.source || 'Media'}
                        </span>
                      </td>
                    )}
                    
                    {(rawSource === 'weather' || rawSource === 'bmkg') && (
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                        {item.name || item.city || 'Unknown Location'}
                      </td>
                    )}
                    
                    <td className="px-6 py-4">
                      {rawSource === 'news' ? (
                        <div>
                          <p className="font-medium text-white mb-1 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                        </div>
                      ) : rawSource === 'weather' ? (
                        <div className="flex gap-4">
                          <div>
                            <p className="text-xs text-slate-500">Suhu</p>
                            <p className="text-white font-medium">{item.main?.temp}°C</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Kondisi</p>
                            <p className="text-white font-medium capitalize">{item.weather?.[0]?.description}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400">
                          Data mentah BMKG (JSON payload terlampir)
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
