// components/dashboard/TopPerformers.jsx
'use client';
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { Calendar } from "lucide-react";

export default function TopPerformers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState("all");

  // --- CustomTooltip inside component ---
  const CustomTooltip = ({ active, payload, label, currency }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2A2A2A] p-4 rounded-lg border border-gray-700 shadow-lg">
          <p className="text-gray-300 font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {currency && '$'}{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // --- ChartContainer inside component ---
  const ChartContainer = ({ title, children, className = "" }) => (
    <div className={`bg-[#1A1A1A] p-6 rounded-2xl shadow-lg border border-gray-800 ${className}`}>
      <h3 className="text-white font-bold mb-4">{title}</h3>
      {children}
    </div>
  );

  const fetchTop = async (selectedRange) => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(`/api/admin/top?range=${selectedRange}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch top performers: ${res.status}`);
      }
      
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching top performers:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTop(range);
  }, [range]);

  if (loading) {
    // Just return nothing while loading
    return null;
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Top Performers</h2>
          <div className="flex items-center bg-[#1A1A1A] text-white border border-gray-600 rounded-lg p-2">
            <Calendar className="h-4 w-4 mr-2" />
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-transparent outline-none"
            >
              <option value="all">All Time</option>
              <option value="30d">Last 30 Days</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
        </div>
        <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-red-800/50">
          <div className="text-red-500 mb-4">Error loading top performers: {error}</div>
          <button
            onClick={() => fetchTop(range)}
            className="px-4 py-2 bg-red-900/30 text-red-300 rounded-lg hover:bg-red-900/50 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mt-8">
      {/* Filter */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Top Performers</h2>
        <div className="flex items-center bg-[#1A1A1A] text-white border border-gray-600 rounded-lg p-2">
          <Calendar className="h-4 w-4 mr-2" />
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-transparent outline-none"
          >
            <option value="all">All Time</option>
            <option value="30d">Last 30 Days</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <ChartContainer title="Top Products by Revenue">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="productName" 
                stroke="#aaa" 
                tick={{ fill: '#aaa', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#aaa" 
                tick={{ fill: '#aaa', fontSize: 12 }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip currency />} />
              <Legend />
              <Bar 
                dataKey="totalRevenue" 
                name="Revenue"
                fill="#D4AF37" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Top Customers */}
        <ChartContainer title="Top Customers by Spend">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topCustomers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="customerName" 
                stroke="#aaa" 
                tick={{ fill: '#aaa', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#aaa" 
                tick={{ fill: '#aaa', fontSize: 12 }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip currency />} />
              <Legend />
              <Bar 
                dataKey="totalSpend" 
                name="Amount Spent"
                fill="#4CAF50" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
