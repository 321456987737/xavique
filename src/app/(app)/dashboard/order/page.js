'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return; // wait until user email is available

    let isMounted = true;
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/admin/orders', {
          params: { email },
        });
        if (isMounted) {
          setOrders(response.data.orders || []);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        if (isMounted) setErrorMsg('Failed to load orders.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => { isMounted = false };
  }, [email]);

  if (loading || status === 'loading') {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <div className="animate-pulse bg-zinc-900 h-64 rounded-xl"></div>
      </div>
    );
  }

  if (errorMsg) {
    return <p className="text-red-500">{errorMsg}</p>;
  }

  if (!orders.length) {
    return <p className="text-gray-400">No orders found.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.map(order => (
        <div key={order._id} className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 space-y-4">
          
          {/* Order Summary */}
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <p className="text-sm text-gray-400">Order ID</p>
              <p className="font-mono">{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Date</p>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <p className="capitalize">{order.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Payment</p>
              <p>{order.paymentStatus} ({order.paymentMethod})</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total</p>
              <p className="font-bold">${order.total}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-zinc-800 p-4 rounded-lg">
            <p className="font-semibold mb-2">Customer Info</p>
            <p><span className="text-gray-400">Name:</span> {order.customer?.name}</p>
            <p><span className="text-gray-400">Email:</span> {order.customer?.email}</p>
            <p><span className="text-gray-400">Phone:</span> {order.customer?.phone}</p>
            {order.customer?.address && (
              <p><span className="text-gray-400">Address:</span> {order.customer.address.line1}, {order.customer.address.city}, {order.customer.address.country}</p>
            )}
          </div>

          {/* Items */}
          <div className="space-y-4">
            <p className="font-semibold">Items</p>
            {order.items.map(item => (
              <div key={item._id} className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-zinc-800 p-4 rounded-lg">
                {/* Product Image */}
                <img 
                  src={item.images[0]?.url} 
                  alt={item.title} 
                  className="w-24 h-24 object-cover rounded-lg border border-zinc-700"
                />

                {/* Product Details */}
                <div className="flex-1">
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-gray-400">{item.description}</p>
                  <p className="text-sm">Category: {item.category} / {item.subcategory}</p>
                  <p className="text-sm">Selected: {item.selectedOptions?.color} - {item.selectedOptions?.size}</p>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-lg font-bold">${item.discountPrice || item.price}</p>
                  <p className="text-sm text-gray-400">Qty: {item.qty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
