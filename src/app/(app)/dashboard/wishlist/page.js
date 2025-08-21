'use client';
import { useEffect, useState } from 'react';

export default function WishlistPage() {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const response = await fetch('/api/admin/wishlist');
        const data = await response.json();
        
        if (data.success) {
          setWishlists(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch wishlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Wishlist</h1>
        <div className="animate-pulse bg-zinc-900 h-64 rounded-xl"></div>
      </div>
    );
  }

  const allItems = wishlists.reduce((items, wishlist) => {
    return items.concat(wishlist.items);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Wishlist</h1>
      
      {allItems.length === 0 ? (
        <p className="text-gray-400">Your saved items will appear here.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allItems.map((item, index) => (
            <div key={index} className="bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800 transition">
              <div className="h-40 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
              <p className="text-yellow-500 font-medium">${item.price.toFixed(2)}</p>
              <p className="text-gray-400 text-sm mt-2">
                Added on {new Date(item.addedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}