'use client';
import { useEffect, useState } from 'react';

export default function ProfileCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setUser(data.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="bg-zinc-900 p-6 rounded-xl flex flex-col items-center text-center">
        <div className="animate-pulse bg-gray-700 w-24 h-24 rounded-full mb-4"></div>
        <div className="animate-pulse bg-gray-700 h-6 w-40 mb-2 rounded"></div>
        <div className="animate-pulse bg-gray-700 h-4 w-32 mb-4 rounded"></div>
        <div className="animate-pulse bg-gray-700 h-6 w-32 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-xl flex flex-col items-center text-center">
      <div className="relative w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-4">
        <span className="text-sm text-gray-400">No Img</span>
        <div className="absolute bottom-0 right-0 bg-yellow-500 p-1 rounded-full">
          <svg width="16" height="16" fill="black">
            <circle cx="8" cy="8" r="8" />
          </svg>
        </div>
      </div>
      <h2 className="text-xl font-bold">{user.username}</h2>
      <p className="text-gray-400 text-sm">{user.email}</p>
      <span className="mt-2 bg-purple-600 px-3 py-1 rounded-full text-xs font-medium capitalize">
        {user.role}
      </span>
    </div>
  );
}