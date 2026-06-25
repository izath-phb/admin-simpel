"use client";
import { useEffect, useState } from "react";
import { api, Report } from "@/lib/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  pending: { label: "Menunggu", class: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  on_progress: { label: "Diproses", class: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" },
  resolved: { label: "Selesai", class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  rejected: { label: "Ditolak", class: "bg-red-500/15 text-red-400 border-red-500/30" },
};

const MOCK_REPORTS: Report[] = [
  { id: "1", title: "Jalan Rusak RT 03", description: "Jalan berlubang di depan SD Negeri 1.", category: "Infrastruktur", coordinates: [-6.2, 106.816], status: "pending", created_at: new Date().toISOString(), logs: [] },
  { id: "2", title: "Lampu Jalan Mati", description: "Lampu jalan gang mawar tidak menyala.", category: "Penerangan", coordinates: [-6.201, 106.817], status: "on_progress", created_at: new Date().toISOString(), logs: [] },
  { id: "3", title: "Got Mampet RW 02", description: "Saluran air tertutup sampah.", category: "Kebersihan", coordinates: [-6.202, 106.815], status: "resolved", created_at: new Date().toISOString(), logs: [] },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchReports = () => {
    api
      .get<Report[]>("/reports/")
      .then((r) => setReports(r.data))
      .catch(() => setReports(MOCK_REPORTS))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, []);

  const filtered = reports.filter((r) => {
    const matchStatus = filter === "all" || r.status === filter;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const isUrgent = (date: string) => {
    const diff = (new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24);
    return diff > 3;
  };

  const handleUpdate = async () => {
    if (!selectedReport) return;
    if (!adminNote.trim()) return alert("Catatan tindak lanjut wajib diisi.");
    
    setUpdating(true);
    try {
      await api.patch(`/reports/${selectedReport.id}`, { 
        status: updateStatus, 
        note: adminNote,
        afterImageUrl: afterImageUrl // State baru
      });
      fetchReports();
      setSelectedReport(null);
      setAfterImageUrl("");
    } catch {
      alert("Gagal memperbarui laporan.");
    } finally {
      setUpdating(false);
    }
  };

  const [afterImageUrl, setAfterImageUrl] = useState("");

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Masyarakat - SIMPEL", 14, 15);
    const tableData = filtered.map((r) => [
      r.title,
      r.category || "-",
      STATUS_LABELS[r.status]?.label,
      new Date(r.created_at).toLocaleDateString("id-ID"),
    ]);
    autoTable(doc, {
      head: [["Judul", "Kategori", "Status", "Tanggal"]],
      body: tableData,
      startY: 20,
    });
    doc.save(`Laporan_SIMPEL_${new Date().getTime()}.pdf`);
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filtered.map((r) => ({
        Judul: r.title,
        Kategori: r.category,
        Status: STATUS_LABELS[r.status]?.label,
        Tanggal: new Date(r.created_at).toLocaleDateString("id-ID"),
        Deskripsi: r.description,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    XLSX.writeFile(workbook, `Laporan_SIMPEL_${new Date().getTime()}.xlsx`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Laporan</h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} laporan ditemukan</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg text-sm font-medium transition-colors border border-rose-500/30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            PDF
          </button>
          <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm font-medium transition-colors border border-emerald-500/30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            placeholder="Cari laporan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#141417] border border-[#27272a] rounded-lg px-4 py-2.5 pl-10 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
          <svg className="w-4 h-4 text-slate-600 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div className="flex gap-2">
          {["all", "pending", "on_progress", "resolved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                filter === s
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-[#141417] text-slate-400 border-[#27272a] hover:text-white"
              }`}
            >
              {s === "all" ? "Semua" : STATUS_LABELS[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#27272a]">
                {["Judul", "Kategori", "Status", "Tanggal", "Aksi"].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-slate-500 font-medium text-xs uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">Tidak ada laporan</td></tr>
              ) : (
                filtered.map((report) => (
                  <tr key={report.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{report.title}</p>
                        {report.status !== 'resolved' && isUrgent(report.created_at) && (
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" title="Lama tidak ditangani" />
                        )}
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{report.description}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{report.category || "-"}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_LABELS[report.status]?.class}`}>
                        {STATUS_LABELS[report.status]?.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">
                      {new Date(report.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setUpdateStatus(report.status);
                          setAdminNote("");
                          setAfterImageUrl(report.afterImageUrl || "");
                        }}
                        className="px-3 py-1.5 bg-indigo-600/10 group-hover:bg-indigo-600 text-indigo-400 group-hover:text-white rounded-lg text-xs font-medium transition-all border border-indigo-500/20"
                      >
                        Kelola
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#141417] border border-[#27272a] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#27272a] flex justify-between items-start shrink-0">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{selectedReport.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_LABELS[selectedReport.status]?.class}`}>
                    {STATUS_LABELS[selectedReport.status]?.label}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-1">Dibuat pada {new Date(selectedReport.created_at).toLocaleString("id-ID")}</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 bg-[#1e1e24] hover:bg-[#27272a] rounded-xl text-slate-500 hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Images Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Foto Kejadian (Sebelum)</label>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-[#1e1e24] border border-[#27272a]">
                    <img src={selectedReport.imageUrl || "/placeholder.png"} className="w-full h-full object-cover" alt="Sebelum" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Foto Perbaikan (Sesudah)</label>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-[#1e1e24] border border-[#27272a] flex items-center justify-center">
                    {updateStatus === 'resolved' || selectedReport.afterImageUrl ? (
                      <img src={afterImageUrl || selectedReport.afterImageUrl || "/placeholder.png"} className="w-full h-full object-cover" alt="Sesudah" />
                    ) : (
                      <span className="text-slate-600 text-xs italic">Belum ada foto perbaikan</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Deskripsi Laporan</label>
                    <p className="text-sm text-slate-300 leading-relaxed bg-[#1c1c21] p-4 rounded-2xl border border-[#27272a]">
                      {selectedReport.description}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Status & Tindak Lanjut</label>
                    <div className="space-y-3">
                      <select
                        value={updateStatus}
                        onChange={(e) => setUpdateStatus(e.target.value)}
                        className="w-full bg-[#1e1e24] border border-[#27272a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                      >
                        <option value="pending">Menunggu</option>
                        <option value="on_progress">Sedang Diproses</option>
                        <option value="resolved">Selesai</option>
                        <option value="rejected">Ditolak (Spam / Tidak Valid)</option>
                      </select>
                      
                      {updateStatus === 'resolved' && (
                        <input
                          type="text"
                          placeholder="URL Foto Perbaikan (Sesudah)..."
                          value={afterImageUrl}
                          onChange={(e) => setAfterImageUrl(e.target.value)}
                          className="w-full bg-[#1e1e24] border border-[#27272a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                        />
                      )}

                      <textarea
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        rows={3}
                        placeholder="Wajib: Masukkan catatan progres terbaru untuk warga..."
                        className="w-full bg-[#1e1e24] border border-[#27272a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Riwayat Garis Waktu</label>
                  <div className="bg-[#1c1c21] rounded-2xl p-4 border border-[#27272a] space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
                    {selectedReport.logs.map((log, i) => (
                      <div key={i} className="relative pl-6 border-l border-[#27272a] pb-4 last:pb-0">
                        <div className={`absolute -left-1.5 top-0.5 w-3 h-3 rounded-full border-2 border-[#1c1c21] ${STATUS_LABELS[log.status]?.class.split(' ')[1].replace('text-', 'bg-')}`} />
                        <p className="text-[10px] text-slate-500 font-bold mb-1">{new Date(log.timestamp).toLocaleString("id-ID")}</p>
                        <p className="text-xs text-white font-medium mb-0.5">{STATUS_LABELS[log.status]?.label}</p>
                        <p className="text-[11px] text-slate-400 italic">"{log.note}"</p>
                      </div>
                    ))}
                  </div>

                  {selectedReport.comments && selectedReport.comments.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Komentar Warga</label>
                      <div className="bg-[#1c1c21] rounded-2xl p-4 border border-[#27272a] space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                        {selectedReport.comments.map((comment, i) => (
                          <div key={i} className="bg-[#1e1e24] p-3 rounded-xl border border-[#27272a]">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-sm font-bold text-white">{comment.user_name}</span>
                              <span className="text-[10px] text-slate-500">{new Date(comment.created_at).toLocaleString("id-ID")}</span>
                            </div>
                            <p className="text-xs text-slate-300">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#27272a] flex flex-col sm:flex-row gap-3 justify-between shrink-0 bg-[#1c1c21]/50">
              <button
                onClick={async () => {
                  if (confirm("Yakin ingin menghapus laporan ini? Laporan yang dihapus tidak dapat dikembalikan.")) {
                    setUpdating(true);
                    try {
                      await api.delete(`/reports/${selectedReport.id}`);
                      fetchReports();
                      setSelectedReport(null);
                    } catch {
                      alert("Gagal menghapus laporan.");
                    } finally {
                      setUpdating(false);
                    }
                  }
                }}
                disabled={updating}
                className="px-5 py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-sm font-medium transition-colors border border-red-500/20"
              >
                Hapus Laporan
              </button>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setSelectedReport(null)} className="px-5 py-2.5 text-slate-400 hover:text-white text-sm font-medium transition-colors">Batal</button>
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
                >
                  {updating ? "Memproses..." : "Update Laporan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
