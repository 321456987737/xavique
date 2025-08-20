"use client"
// app/admin/dashboard/page.jsx
import KPICards from "@/components/dashboard/KPICards";
import StatsCharts from "@/components/dashboard/StatsCharts";
import TopPerformers from "@/components/dashboard/TopPerformers";
import { RefreshCw } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 md:p-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Overview of your store performance</p>
        </div>
        <button onClick={()=>{window.location.reload()}} className="flex items-center px-4 py-2 bg-[#1A1A1A] text-white rounded-lg border border-gray-800 hover:border-[#D4AF37] transition-colors">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </button>
      </div>
      
      <div className="space-y-8">
        <KPICards />
        <StatsCharts />
        <TopPerformers />
      </div>
    </div>
  );
}