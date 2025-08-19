'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit, X } from 'lucide-react';
import axios from 'axios';

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newStatus, setNewStatus] = useState('active');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsersWithOrderData();
  }, []);

  const fetchUsersWithOrderData = async () => {
    try {
      const res = await axios.get('/api/users');
      const userList = res.data.users;

      const usersWithOrderData = await Promise.all(
        userList.map(async (user) => {
          try {
            const orderRes = await axios.post('/api/orderextradata', { email: user.email });
            return { ...user, orderData: orderRes.data };
          } catch (error) {
            console.error(`Failed to fetch order data for ${user.email}`, error);
            return { 
              ...user, 
              orderData: { lastOrderDate: null, totalSpend: 0, ordersCount: 0 } 
            };
          }
        })
      );

      setUsers(usersWithOrderData);
      setFilteredUsers(usersWithOrderData);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = users.filter((u) => 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const openEdit = (customer) => {
    setCurrentUser(customer);
    setNewStatus(customer.status || 'inactive');
    setIsEditOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      await axios.put('/api/orderextradata', { 
        email: currentUser.email, 
        status: newStatus 
      });

      // update locally without re-fetching
      const updated = users.map(u =>
        u._id === currentUser._id ? { ...u, status: newStatus } : u
      );
      setUsers(updated);
      setFilteredUsers(updated);
      setIsEditOpen(false);
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-white p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] rounded-lg border border-gray-700 shadow-lg overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Registration Date</th>
                <th className="py-3 px-4 text-left">Last Order Date</th>
                <th className="py-3 px-4 text-left">Total Spend</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-gray-800">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <td key={i} className="py-3 px-4">
                        <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                filteredUsers.map((customer) => (
                  <tr 
                    key={customer._id} 
                    className="border-b border-gray-800 last:border-0 hover:bg-[#2A2A2A] transition-colors"
                  >
                    <td className="py-3 px-4">{customer.username}</td>
                    <td className="py-3 px-4">{customer.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        customer.status === 'active' ? 'bg-green-900 text-green-300' :
                        customer.status === 'inactive' ? 'bg-red-900 text-red-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {customer.status || 'unknown'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {customer.orderData?.lastOrderDate 
                        ? new Date(customer.orderData.lastOrderDate).toLocaleDateString() 
                        : 'No Orders'}
                    </td>
                    <td className="py-3 px-4">
                      ${customer.orderData?.totalSpend?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1 hover:text-[#D4AF37] transition-colors"
                        onClick={() => openEdit(customer)}
                      >
                        <Edit size={16} />
                      </motion.button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditOpen && currentUser && (
        <div className="fixed inset-0 bg-black  bg-opacity-70 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1A1A] rounded-lg border border-gray-700 shadow-lg w-full max-w-sm p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Edit User Status</h2>
              <button onClick={() => setIsEditOpen(false)} className="hover:text-[#D4AF37]">
                <X size={20} />
              </button>
            </div>

            <p className="mb-4 text-gray-300">{currentUser.email}</p>

            <select 
              className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-[#D4AF37]"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              onClick={handleSaveStatus}
              disabled={saving}
              className="w-full bg-[#D4AF37] text-black font-bold py-2 px-4 rounded-lg hover:bg-[#b9962d] transition"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
