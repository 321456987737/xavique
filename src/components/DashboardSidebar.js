'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, Heart, Settings } from 'lucide-react';

export default function DashboardSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Overview', icon: User },
    { href: '/dashboard/order', label: 'Orders', icon: Package },
    { href: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/dashboard/setting', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-zinc-900 p-4 flex flex-col">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 cursor-pointer transition ${
              active ? 'bg-yellow-500 text-black' : 'hover:bg-zinc-800'
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}