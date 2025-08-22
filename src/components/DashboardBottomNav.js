'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, Heart, Settings } from 'lucide-react';

export default function DashboardBottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Overview', icon: User },
    { href: '/dashboard/order', label: 'Orders', icon: Package },
    { href: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/dashboard/setting', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden justify-around bg-zinc-900 border-t border-zinc-700 py-2">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link 
            key={href}
            href={href}
            className={`flex flex-col items-center text-xs transition ${
              active ? 'text-yellow-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon size={22} />
            <span className="mt-1">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
