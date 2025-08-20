// =============================
// app/(dashboard)/roles/page.jsx
// =============================
"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, Loader2, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";

function RoleBadge({ role }) {
  const color = role === "superadmin" ? "bg-yellow-900 text-yellow-300 border-yellow-700"
    : role === "admin" ? "bg-blue-900 text-blue-300 border-blue-700"
    : "bg-gray-900 text-gray-300 border-gray-700";
  const label = role.charAt(0).toUpperCase() + role.slice(1);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {label}
    </span>
  );
}

function RoleDropdown({ value, onChange, disabled }) {
  return (
    <select
      className="border border-black/10 bg-[#0A0A0A] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] w-full transition-colors hover:border-[#D4AF37]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="customer">Customer</option>
      <option value="admin">Admin</option>
      <option value="superadmin">Superadmin</option>
    </select>
  );
}

export default function RolesPage() {
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pageCount: 1 });
  const [toast, setToast] = useState(null);

  const params = useMemo(() => ({ q, role: roleFilter, page, limit }), [q, roleFilter, page, limit]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (params.q) sp.set("q", params.q);
      if (params.role && params.role !== "all") sp.set("role", params.role);
      sp.set("page", String(params.page));
      sp.set("limit", String(params.limit));
      const { data } = await axios.get(`/api/admin/role?${sp.toString()}`);
      setUsers(data.users || []);
      setPagination(data.pagination || { total: 0, page: 1, limit: 10, pageCount: 1 });
    } catch (e) {
      setToast({ type: "error", message: "Failed to load users" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, roleFilter, page, limit]);

  const onRoleChange = async (id, newRole) => {
    const prev = users;
    setUsers((us) => us.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
    setSavingId(id);
    try {
      await axios.patch(`/api/admin/role/${id}`, { role: newRole });
      setToast({ type: "success", message: "Role updated" });
    } catch (e) {
      setUsers(prev);
      setToast({ type: "error", message: "Failed to update role" });
    } finally {
      setSavingId(null);
    }
  };

  const reset = () => {
    setQ("");
    setRoleFilter("all");
    setPage(1);
  };

  return (
    <div className="p-6 space-y-6 bg-[#0A0A0A] w-full text-white min-h-screen">
      <header className="flex items-center justify-between">
        <div className="w-full">
           <header className="mb-4 w-full">
                  <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-2"
                  >
                    User Roles Management
                  </motion.h1>
                  <motion.p
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-400 mb-4"
                  >
                    Assign roles to users. Roles: Customer, Admin, Superadmin.
                  </motion.p>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="h-1 bg-gradient-to-r from-[#D4AF37] to-transparent rounded"
                  />
                </header>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-3 items-stretch md:items-end"
      >
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-400">Search</label>
          <div className="relative">
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Search by name or email"
              className="w-full border border-black/10 bg-[#0A0A0A] text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-colors hover:border-[#D4AF37]"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="w-full md:w-56">
          <label className="text-xs font-medium text-gray-400">Filter by Role</label>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="w-full border border-black/10 bg-[#0A0A0A] text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-colors hover:border-[#D4AF37]"
          >
            <option value="all">All</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={reset} 
          className="border border-black/10 bg-[#0A0A0A] text-white rounded-xl px-3 py-2 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
        >
          Reset
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="overflow-x-auto border border-black/10 rounded-2xl"
      >
        <table className="min-w-full text-sm">
          <thead className="bg-gray-900">
            <tr className="text-left">
              <th className="p-3 font-semibold">User</th>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Current Role</th>
              <th className="p-3 font-semibold">Change Role</th>
              <th className="p-3 font-semibold w-16">Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">No users found</td>
              </tr>
            )}
            {loading && (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-3"><div className="h-4 w-40 bg-gray-800 rounded" /></td>
                  <td className="p-3"><div className="h-4 w-64 bg-gray-800 rounded" /></td>
                  <td className="p-3"><div className="h-6 w-24 bg-gray-800 rounded-full" /></td>
                  <td className="p-3"><div className="h-8 w-40 bg-gray-800 rounded" /></td>
                  <td className="p-3"><div className="h-4 w-10 bg-gray-800 rounded" /></td>
                </tr>
              ))
            )}
            {!loading && users.map((u, index) => (
              <motion.tr 
                key={u._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-t border-black/10"
              >
                <td className="p-3">
                  <div className="font-medium">{u.name || "—"}</div>
                  <div className="text-xs text-gray-400">ID: {u._id}</div>
                </td>
                <td className="p-3">{u.email}</td>
                <td className="p-3"><RoleBadge role={u.role} /></td>
                <td className="p-3 max-w-56"><RoleDropdown value={u.role} disabled={savingId===u._id} onChange={(val)=>onRoleChange(u._id, val)} /></td>
                <td className="p-3">
                  {savingId === u._id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  ) : (
                    <span className="text-xs text-gray-400">Up to date</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between"
      >
        <div className="text-sm text-gray-400">
          Showing <span className="font-medium text-white">{users.length}</span> of <span className="font-medium text-white">{pagination.total}</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "#D4AF37" }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1 border border-black/10 bg-[#0A0A0A] text-white rounded-xl px-3 py-2 disabled:opacity-50 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]" 
            onClick={() => setPage((p) => Math.max(1, p - 1))} 
            disabled={page <= 1 || loading}
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </motion.button>
          <div className="text-sm">Page {pagination.page} / {pagination.pageCount || 1}</div>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "#D4AF37" }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1 border border-black/10 bg-[#0A0A0A] text-white rounded-xl px-3 py-2 disabled:opacity-50 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]" 
            onClick={() => setPage((p) => (p < (pagination.pageCount || 1) ? p + 1 : p))} 
            disabled={page >= (pagination.pageCount || 1) || loading}
          >
            Next <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`fixed bottom-4 right-4 rounded-xl shadow-lg px-4 py-3 text-sm flex items-center gap-2 ${toast.type === "success" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />} {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}