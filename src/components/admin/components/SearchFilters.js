"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Calendar, CreditCard, Filter, XCircle } from "lucide-react";

export default function SearchFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    startDate: "",
    endDate: "",
    payment: ""
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Debounce filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange(filters);
    }, 500);

    return () => clearTimeout(handler);
  }, [filters, onFilterChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    const resetFilters = { 
      name: "", 
      status: "", 
      startDate: "", 
      endDate: "", 
      payment: "" 
    };
    setFilters(resetFilters);
  };

  return (
    <motion.div 
      className="bg-[#1A1A1A] rounded-xl border border-white/10 p-4 mb-6"
      whileHover={{ borderColor: "#D4AF37" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Filter className="h-5 w-5 mr-2 text-[#D4AF37]" />
          Filter Orders
        </h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden text-[#D4AF37] p-2 hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
        >
          {isExpanded ? <XCircle size={20} /> : <Filter size={20} />}
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0 
        }}
        className="overflow-hidden md:!h-auto md:!opacity-100"
      >
        <div className={`grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 ${isExpanded ? 'block' : 'hidden md:grid'}`}>
          {/* Name/Search Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Search orders..."
              value={filters.name}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 bg-[#0A0A0A] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RefreshCw className="h-4 w-4 text-gray-400" />
            </div>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full pl-10 pr-8 py-2 bg-[#0A0A0A] rounded-lg border border-white/10 text-white appearance-none focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex gap-2 pl-10">
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
                className="w-full px-2 py-2 bg-[#0A0A0A] rounded-lg border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
              />
              <span className="text-gray-400 self-center text-sm whitespace-nowrap">to</span>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
                className="w-full px-2 py-2 bg-[#0A0A0A] rounded-lg border border-white/10 text-white focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
              />
            </div>
          </div>

          {/* Payment Method + Reset Button */}
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-4 w-4 text-gray-400" />
              </div>
              <select
                name="payment"
                value={filters.payment}
                onChange={handleChange}
                className="w-full pl-10 pr-8 py-2 bg-[#0A0A0A] rounded-lg border border-white/10 text-white appearance-none focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors cursor-pointer"
              >
                <option value="">All Payments</option>
                <option value="Card">Card</option>
                <option value="COD">Cash on Delivery</option>
                <option value="Wallet">Wallet</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            
            <button
              onClick={handleReset}
              className="p-2 bg-[#0A0A0A] rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
              title="Reset all filters"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  ); 
}