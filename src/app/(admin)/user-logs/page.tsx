"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface UserLog {
  id: string;
  user_name: string;
  action: string;
  target: string;
  timestamp: string;
}

export default function UserLogsPage() {
  const [logs, setLogs] = useState<UserLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get("/dashboard/user-logs");
      setLogs(response.data.logs);
    } catch (error) {
      console.error("Gagal mengambil log aktivitas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      'LOGIN': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      'CREATE_REPORT': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      'LIKE_REPORT': 'bg-pink-500/15 text-pink-400 border-pink-500/30',
      'COMMENT_REPORT': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      'UPDATE_PROFILE': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    };
    return colors[action] || 'bg-[#141417] text-slate-400 border-[#27272a]';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Log Aktivitas Warga</h1>
          <p className="text-slate-400 text-sm mt-1">Pantau seluruh pergerakan dan aktivitas yang dilakukan oleh pengguna aplikasi SIMPEL.</p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg text-sm font-medium transition-all border border-indigo-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Segarkan Data
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#27272a]">
                <th className="px-5 py-4 text-slate-500 font-medium text-xs uppercase tracking-wide">Waktu</th>
                <th className="px-5 py-4 text-slate-500 font-medium text-xs uppercase tracking-wide">Nama Warga</th>
                <th className="px-5 py-4 text-slate-500 font-medium text-xs uppercase tracking-wide">Aktivitas</th>
                <th className="px-5 py-4 text-slate-500 font-medium text-xs uppercase tracking-wide">Target / Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                    Belum ada aktivitas warga yang terekam.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-5 py-4 font-medium text-white">
                      {log.user_name}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium border rounded-full ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {log.target || "-"}
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
