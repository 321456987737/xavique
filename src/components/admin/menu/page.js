"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderKanban,
  Users,
  BarChart3,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    href: "/admin/OrdersManagement",
  },
  {
    label: "Products",
    icon: Package,
    href: "/admin/ProductsManagement",
  },
  {
    label: "Categories",
    icon: FolderKanban,
    href: "/admin/CategoriesCollections",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/admin/Customers",
  },
  {
    label: "Auth & Roles",
    icon: ShieldCheck,
    href: "/admin/AuthenticationAuthorization",
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-[#0A0A0A] border border-[#D4AF37] text-[#D4AF37] rounded"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar for md+ */}
      <aside className="hidden md:flex h-screen w-[280px] bg-[#0A0A0A] text-white border-r border-[#D4AF37] p-6 flex-col justify-between">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Sidebar for mobile using Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
            />

            {/* Sidebar */}
            <motion.aside
              className="fixed top-0 left-0 h-full w-[260px] bg-[#0A0A0A] border-r border-[#D4AF37] text-white z-50 p-6 flex flex-col justify-between"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween" }}
            >
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-[#D4AF37]">Admin Panel</h2>
                  <button onClick={closeSidebar}>
                    <X className="text-[#D4AF37]" size={24} />
                  </button>
                </div>
                <SidebarContent pathname={pathname} onClick={closeSidebar} />
              </div>

              <p className="text-xs text-gray-500 mt-8">© 2025 Xavique Inc.</p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarContent = ({ pathname, onClick }) => {
  return (
    <nav className="flex flex-col gap-3">
      {menuItems.map((item) => {
        const isActive =
          pathname === item.href || (item.href === "/admin" && pathname === "/admin");

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClick}
            className={`group flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all duration-200 ${
              isActive
                ? "bg-[#1A1A1A] text-[#D4AF37]"
                : "hover:bg-[#1A1A1A] hover:text-[#D4AF37] text-white"
            }`}
          >
            <item.icon className="text-[#D4AF37]" size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminSidebar;