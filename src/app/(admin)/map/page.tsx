"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { api, Report } from "@/lib/api";

// Dynamically import map to avoid SSR issues
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false, loading: () => (
  <div className="w-full h-full flex items-center justify-center bg-[#141417] rounded-2xl">
    <p className="text-slate-500">Memuat peta...</p>
  </div>
) });

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Menunggu", color: "#f59e0b" },
  on_progress: { label: "Diproses", color: "#6366f1" },
  resolved: { label: "Selesai", color: "#10b981" },
};

const MOCK_REPORTS: Report[] = [
  { id: "1", title: "Jalan Rusak RT 03", description: "Jalan berlubang besar.", category: "Infrastruktur", coordinates: [-6.200, 106.816], status: "pending", created_at: new Date().toISOString(), logs: [] },
  { id: "2", title: "Lampu Jalan Mati", description: "Tidak menyala sejak 2 hari lalu.", category: "Penerangan", coordinates: [-6.202, 106.820], status: "on_progress", created_at: new Date().toISOString(), logs: [] },
  { id: "3", title: "Got Mampet RW 02", description: "Saluran air tertutup sampah.", category: "Kebersihan", coordinates: [-6.198, 106.812], status: "resolved", created_at: new Date().toISOString(), logs: [] },
  { id: "4", title: "Pohon Tumbang", description: "Menutup jalan gang melati.", category: "Lingkungan", coordinates: [-6.204, 106.818], status: "pending", created_at: new Date().toISOString(), logs: [] },
];

export default function MapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Report | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api
      .get<Report[]>("/reports/")
      .then((r) => setReports(r.data))
      .catch(() => setReports(MOCK_REPORTS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? reports : reports.filter((r) => r.status === filter);

  return (
    <div className="p-6 space-y-4 h-screen flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Peta Sebaran Laporan</h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} laporan dipetakan</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "on_progress", "resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filter === s ? "bg-indigo-600 text-white border-indigo-600" : "bg-[#141417] text-slate-400 border-[#27272a] hover:text-white"
              }`}
            >
              {s === "all" ? "Semua" : STATUS_LABELS[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        {Object.entries(STATUS_LABELS).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-3 h-3 rounded-full" style={{ background: val.color }} />
            {val.label}
          </div>
        ))}
      </div>

      {/* Map + Side panel */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Map */}
        <div className="flex-1 rounded-2xl overflow-hidden border border-[#27272a]">
          {!loading && (
            <MapView
              reports={filtered}
              onSelect={setSelected}
              selected={selected}
            />
          )}
        </div>

        {/* Side panel */}
        <div className="w-72 flex flex-col gap-3 overflow-y-auto">
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className={`text-left glass rounded-xl p-4 transition-all ${selected?.id === r.id ? "ring-2 ring-indigo-500" : "hover:ring-1 hover:ring-white/10"}`}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                  style={{ background: STATUS_LABELS[r.status]?.color || "#94a3b8" }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{r.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{r.category}</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {r.coordinates?.[0]?.toFixed(4) ?? "0.0000"}, {r.coordinates?.[1]?.toFixed(4) ?? "0.0000"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
