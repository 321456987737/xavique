'use client';
import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function StatsCharts() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-white text-lg">Loading charts...</div>;
  if (!stats) return <div className="text-red-500">Failed to load charts</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      
      {/* Revenue over time */}
      <div className="bg-[#1A1A1A] p-6 rounded-2xl shadow-lg border border-gray-800">
        <h3 className="text-white font-bold mb-4">Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.ordersPerDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="_id" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalRevenue" stroke="#D4AF37" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Orders count over time */}
      <div className="bg-[#1A1A1A] p-6 rounded-2xl shadow-lg border border-gray-800">
        <h3 className="text-white font-bold mb-4">Orders Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.ordersPerDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="_id" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalOrders" fill="#D4AF37" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* New users over time */}
      <div className="bg-[#1A1A1A] p-6 rounded-2xl shadow-lg border border-gray-800 lg:col-span-2">
        <h3 className="text-white font-bold mb-4">New Users Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.usersPerDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="_id" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="newUsers" stroke="#4CAF50" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
