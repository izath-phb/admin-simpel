"use client";
import { useEffect, useState } from "react";
import { api, User } from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = () => {
    api
      .get<User[]>("/auth/users")
      .then((r) => setUsers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleStatusChange = async (userId: string, status: boolean) => {
    const action = status ? "mengaktifkan" : "memblokir";
    if (!confirm(`Apakah Anda yakin ingin ${action} akun ini?`)) return;

    try {
      await api.patch(`/auth/users/${userId}`, { is_verified: status });
      fetchUsers();
    } catch {
      alert(`Gagal ${action} akun.`);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.rt?.includes(search) ?? false) || (u.rw?.includes(search) ?? false)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Daftar Warga</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola warga dan moderasi akun yang melanggar aturan</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari warga..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1c1c21] border border-[#27272a] text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600 transition-all pl-10"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#27272a]">
                {["Nama", "Email", "Wilayah", "Status", "Aksi"].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-slate-500 font-medium text-xs uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">Memuat data...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">Tidak ada warga ditemukan</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.photo_url ? (
                          <img src={user.photo_url} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-[#27272a]" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                            {user.name[0].toUpperCase()}
                          </div>
                        )}
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{user.email}</td>
                    <td className="px-5 py-4 text-slate-400">RT {user.rt} / RW {user.rw}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.is_verified 
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                          : "bg-red-500/15 text-red-400 border-red-500/30"
                      }`}>
                        {user.is_verified ? "Aktif" : "Diblokir"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleStatusChange(user.id, !user.is_verified)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                          user.is_verified
                            ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
                            : "bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border-indigo-600/20"
                        }`}
                      >
                        {user.is_verified ? "Blokir" : "Aktifkan"}
                      </button>
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
