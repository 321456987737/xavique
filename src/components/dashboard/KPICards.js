// components/dashboard/KPICards.jsx
'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from "lucide-react";

export default function KPICards() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- CardSkeleton inside component ---
  const CardSkeleton = () => (
    <div className="bg-[#1A1A1A] p-6 rounded-2xl shadow-lg border border-gray-800 animate-pulse">
      <div className="h-4 w-24 bg-gray-700 rounded mb-4"></div>
      <div className="h-8 w-32 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-16 bg-gray-700 rounded"></div>
    </div>
  );

  // --- Card inside component ---
  const Card = ({ label, value, change, href, icon: Icon }) => (
    <Link href={href} className="group">
      <div className="bg-[#1A1A1A] p-6 rounded-2xl shadow-lg border border-gray-800 hover:border-[#D4AF37] transition-all duration-300 group-hover:scale-[1.02]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-gray-400 text-sm font-medium">{label}</h3>
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <div className={`flex items-center text-sm ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
          {change >= 0 ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          <span>{change >= 0 ? `+${change}%` : `${change}%`} from last period</span>
        </div>
      </div>
    </Link>
  );

  const fetchMetrics = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/admin/metrics");
      
      if (!res.ok) {
        throw new Error(`Failed to fetch metrics: ${res.status}`);
      }
      
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-red-800/50">
        <div className="text-red-500 mb-4">Error loading metrics: {error}</div>
        <button
          onClick={fetchMetrics}
          className="px-4 py-2 bg-red-900/30 text-red-300 rounded-lg hover:bg-red-900/50 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const cards = [
    { 
      label: "Total Users", 
      value: metrics.totalUsers.toLocaleString(), 
      change: metrics.usersChange, 
      href: "/admin/users",
      icon: Users
    },
    { 
      label: "Total Orders", 
      value: metrics.totalOrders.toLocaleString(), 
      change: metrics.ordersChange, 
      href: "/admin/orders",
      icon: ShoppingCart
    },
    { 
      label: "Total Revenue", 
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      change: metrics.revenueChange, 
      href: "/admin/revenue",
      icon: DollarSign
    },
  ];

  return (
    <div className="grid justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <Card key={i} {...card} />
      ))}
    </div>
  );
}
