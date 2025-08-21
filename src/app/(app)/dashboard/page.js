'use client';
import { useEffect, useState } from 'react';
import ProfileCard from '@/components/ProfileCard';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    orders: 0,
    wishlistItems: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, wishlistRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/wishlist'),
        ]);

        const ordersData = await ordersRes.json();
        const wishlistData = await wishlistRes.json();

        if (ordersData.success && wishlistData.success) {
          const totalSpent = ordersData.data.reduce(
            (sum, order) => sum + order.total,
            0
          );

          setStats({
            orders: ordersData.data.length,
            wishlistItems: wishlistData.data.reduce(
              (sum, wishlist) => sum + wishlist.items.length,
              0
            ),
            totalSpent,
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-yellow-500">{stats.orders}</p>
        </div>
        
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Wishlist Items</h3>
          <p className="text-3xl font-bold text-purple-500">{stats.wishlistItems}</p>
        </div>
        
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
          <p className="text-3xl font-bold text-green-500">${stats.totalSpent.toFixed(2)}</p>
        </div>
      </div>

      <ProfileCard />
    </div>
  );
}