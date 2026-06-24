"use client";
import { useEffect, useState } from "react";
import { api, Announcement } from "@/lib/api";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", imageUrl: "", is_carousel: false });

  const fetchAnnouncements = () => {
    api
      .get<Announcement[]>("/announcements/")
      .then((r) => setAnnouncements(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/announcements/", form);
      fetchAnnouncements();
      setShowModal(false);
      setForm({ title: "", content: "", imageUrl: "", is_carousel: false });
    } catch {
      alert("Gagal membuat pengumuman.");
    }
  };

  const toggleCarousel = async (id: string, current: boolean) => {
    try {
      await api.patch(`/announcements/${id}`, { is_carousel: !current });
      fetchAnnouncements();
    } catch {
      alert("Gagal memperbarui status carousel.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pengumuman ini?")) return;
    try {
      await api.delete(`/announcements/${id}`);
      fetchAnnouncements();
    } catch {
      alert("Gagal menghapus.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pusat Media & Pengumuman</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola informasi desa dan banner carousel aplikasi</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Buat Pengumuman
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-500 text-center py-12 col-span-full">Memuat data...</p>
        ) : announcements.length === 0 ? (
          <p className="text-slate-500 text-center py-12 col-span-full">Belum ada pengumuman</p>
        ) : (
          announcements.map((ann) => (
            <div key={ann.id} className="glass rounded-2xl overflow-hidden flex flex-col group">
              <div className="aspect-video bg-[#1e1e24] relative overflow-hidden">
                {ann.imageUrl ? (
                  <img src={ann.imageUrl} alt={ann.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                {ann.is_carousel && (
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">
                    Carousel
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-white font-semibold mb-2 line-clamp-1">{ann.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4">{ann.content}</p>
                <div className="mt-auto pt-4 border-t border-[#27272a] flex items-center justify-between">
                  <button
                    onClick={() => toggleCarousel(ann.id, ann.is_carousel)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                      ann.is_carousel 
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                        : "text-slate-500 border-[#27272a] hover:text-white"
                    }`}
                  >
                    {ann.is_carousel ? "Hapus dari Carousel" : "Tampilkan di Carousel"}
                  </button>
                  <button onClick={() => handleDelete(ann.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-[#141417] border border-[#27272a] rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="px-6 py-5 border-b border-[#27272a] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Buat Pengumuman Baru</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Judul Pengumuman</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#1e1e24] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Isi Konten</label>
                <textarea
                  required
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full bg-[#1e1e24] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">URL Gambar (Banner)</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-[#1e1e24] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_carousel"
                  checked={form.is_carousel}
                  onChange={(e) => setForm({ ...form, is_carousel: e.target.checked })}
                  className="w-4 h-4 rounded border-[#27272a] bg-[#1e1e24] text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="is_carousel" className="text-sm text-slate-300 select-none">Tampilkan di Carousel aplikasi warga</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#27272a] flex gap-3 justify-end">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Batal</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">Publikasikan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
