'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { User as UserIcon, ShoppingBag, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ orders: 0, totalSpent: 0 });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchDashboardData = async () => {
      try {
        const ordersRes = await axios.get('/api/admin/orders', {
          params: { email: session?.user?.email },
        });
        if (ordersRes.data.success) {
          const ordersData = ordersRes.data.orders;
          const totalSpent = ordersData.reduce(
            (sum, order) => sum + (order.discountPrice || 0),
            0
          );
          setStats({ orders: ordersData.length, totalSpent });
        }

        const userRes = await axios.get('/api/admin/users', {
          params: { email: session.user.email },
        });
        if (userRes.data.success) setUser(userRes.data.user);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session]);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold tracking-tight">Dashboard Overview</h1>
 <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-zinc-900 p-8 rounded-2xl shadow-lg text-center"
      >
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-pulse bg-gray-700 w-24 h-24 rounded-full mb-4"></div>
            <div className="animate-pulse bg-gray-700 h-6 w-40 mb-2 rounded"></div>
            <div className="animate-pulse bg-gray-700 h-4 w-32 mb-4 rounded"></div>
            <div className="animate-pulse bg-gray-700 h-6 w-32 rounded"></div>
          </div>
        ) : user ? (
          <>
            <div className="relative w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center mx-auto overflow-hidden ring-4 ring-purple-600/30">
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={user.username} 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <UserIcon className="text-gray-400 w-12 h-12" />
              )}
              <div className="absolute bottom-0 right-0 bg-yellow-500 p-1 rounded-full animate-pulse">
                <svg width="16" height="16" fill="black"><circle cx="8" cy="8" r="8" /></svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mt-4">{user.username}</h2>
            <p className="text-gray-400">{user.email}</p>
            <span className="mt-3 inline-block bg-purple-600 px-4 py-1 rounded-full text-sm font-medium capitalize">
              {user.role}
            </span>
            <p className="mt-4 text-sm text-gray-500">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </>
        ) : (
          <p className="text-gray-400">Failed to load user data.</p>
        )}
      </motion.div>
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            label: 'Total Orders',
            value: stats.orders,
            icon: <ShoppingBag className="w-8 h-8 text-yellow-500" />,
            color: 'from-yellow-600 to-yellow-400'
          },
          {
            label: 'Total Spent',
            value: `$${stats.totalSpent.toFixed(2)}`,
            icon: <DollarSign className="w-8 h-8 text-green-500" />,
            color: 'from-green-600 to-green-400'
          }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className={`bg-zinc-900 p-6 rounded-2xl shadow-lg border border-zinc-700 hover:scale-[1.02] transition-transform`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-300">{stat.label}</h3>
                <motion.p 
                  className="text-3xl font-bold text-white"
                  key={stat.value}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {stat.value}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
     
    </div>
  );
}
