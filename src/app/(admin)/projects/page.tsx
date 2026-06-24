"use client";
import { useEffect, useState } from "react";
import { api, Project } from "@/lib/api";

const MOCK_PROJECTS: Project[] = [
  { id: "1", title: "Renovasi Balai Desa", description: "Perbaikan atap dan cat ulang gedung balai desa.", budget: 150000000, progress: 75, status: "on_progress", created_at: new Date().toISOString() },
  { id: "2", title: "Pembangunan Pos Kamling", description: "Membangun pos keamanan lingkungan di 5 titik.", budget: 50000000, progress: 100, status: "selesai", created_at: new Date().toISOString() },
  { id: "3", title: "Perbaikan Jalan Desa", description: "Pengaspalan ulang jalan utama RT 01-04.", budget: 300000000, progress: 30, status: "perencanaan", created_at: new Date().toISOString() },
  { id: "4", title: "Pembangunan Drainase", description: "Pembuatan saluran drainase sepanjang 500m.", budget: 200000000, progress: 0, status: "perencanaan", created_at: new Date().toISOString() },
];

function ProjectModal({
  project,
  onClose,
  onSave,
}: {
  project: Project | null;
  onClose: () => void;
  onSave: (data: Partial<Project>) => void;
}) {
  const [form, setForm] = useState({
    title: project?.title || "",
    description: project?.description || "",
    budget: project?.budget || 0,
    progress: project?.progress || 0,
    status: project?.status || "perencanaan",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#141417] border border-[#27272a] rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="px-6 py-5 border-b border-[#27272a] flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">{project?.id ? "Edit Proyek" : "Tambah Proyek"}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "Nama Proyek", name: "title", type: "text" },
            { label: "Anggaran (Rp)", name: "budget", type: "number" },
            { label: "Progress (%)", name: "progress", type: "number" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name as keyof typeof form]}
                onChange={handleChange}
                min={f.name === "progress" ? 0 : undefined}
                max={f.name === "progress" ? 100 : undefined}
                className="w-full bg-[#1e1e24] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Deskripsi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#1e1e24] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-[#1e1e24] border border-[#27272a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="perencanaan">Perencanaan</option>
              <option value="on_progress">Sedang Berjalan</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#27272a] flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Batal</button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

const STATUS_STYLE: Record<string, string> = {
  perencanaan: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  on_progress: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  selesai: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const fetchProjects = () => {
    api
      .get<Project[]>("/projects/")
      .then((r) => setProjects(r.data))
      .catch(() => setProjects(MOCK_PROJECTS))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSave = async (data: Partial<Project>) => {
    try {
      if (editProject?.id) {
        await api.patch(`/projects/${editProject.id}`, data);
      } else {
        await api.post("/projects/", data);
      }
      fetchProjects();
    } catch {
      // use mock silently
    }
    setShowModal(false);
    setEditProject(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus proyek ini?")) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Proyek Pembangunan</h1>
          <p className="text-slate-400 text-sm mt-1">{projects.length} proyek terdaftar</p>
        </div>
        <button
          onClick={() => { setEditProject(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Tambah Proyek
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500 text-center py-16">Memuat data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="glass rounded-2xl p-5 flex flex-col gap-4 hover:border-indigo-500/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-white leading-tight">{project.title}</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${STATUS_STYLE[project.status] || STATUS_STYLE["perencanaan"]}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-slate-400 text-sm line-clamp-2">{project.description}</p>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Progres</span>
                  <span className="font-medium text-white">{project.progress}%</span>
                </div>
                <div className="h-2 bg-[#27272a] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Anggaran</p>
                  <p className="text-sm font-semibold text-emerald-400">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact" }).format(project.budget)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditProject(project); setShowModal(true); }}
                    className="p-2 bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-400 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 bg-red-500/15 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ProjectModal
          project={editProject}
          onClose={() => { setShowModal(false); setEditProject(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
