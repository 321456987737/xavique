'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit, X, Filter, User, Mail, Calendar, DollarSign, Hash } from 'lucide-react';
import axios from 'axios';

function UserSearchBar({ onUserSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('/api/orderextradata', {
          params: { q: searchTerm }
        });
        setResults(res.data.users || []);
        setShowDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSelect = (user) => {
    onUserSelect(user);
    setSearchTerm(user.email);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full md:w-80">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
      </div>

      {showDropdown && (
        <div className="absolute z-10 mt-2 w-full rounded-lg bg-[#1A1A1A] border border-gray-700 shadow-lg max-h-60 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D4AF37] mx-auto"></div>
            </div>
          )}
          {!isLoading && results.length === 0 && (
            <div className="p-4 text-center text-gray-400">No users found</div>
          )}
          {!isLoading && results.map((user) => (
            <div
              key={user._id}
              className="p-3 cursor-pointer hover:bg-[#2A2A2A] transition-colors border-b border-gray-800 last:border-0"
              onClick={() => handleSelect(user)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#D4AF37] rounded-full p-2">
                  <User size={16} className="text-black" />
                </div>
                <div>
                  <div className="text-sm font-medium">{user.username || 'No name'}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newStatus, setNewStatus] = useState('active');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsersWithOrderData();
  }, []);

  const fetchUsersWithOrderData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/users');
      const userList = res.data.users ?? [];

      const usersWithOrderData = await Promise.all(
        userList.map(async (user) => {
          try {
            const orderRes = await axios.post('/api/orderextradata', { email: user.email });
            return { ...user, orderData: orderRes.data };
          } catch (error) {
            console.error(`Failed to fetch order data for ${user.email}`, error);
            return {
              ...user,
              orderData: { lastOrderDate: null, totalSpend: 0, ordersCount: 0 },
            };
          }
        })
      );

      setUsers(usersWithOrderData);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // search and filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter(
      (u) =>
        (u.username || '').toLowerCase().includes(term) ||
        (u.email || '').toLowerCase().includes(term)
    ).filter(user => 
      statusFilter === 'all' || user.status === statusFilter
    );
    
    setFilteredUsers(filtered);
  }, [searchTerm, users, statusFilter]);

  const openEdit = (customer) => {
    setCurrentUser(customer);
    setNewStatus(customer.status === 'inactive' ? 'inactive' : 'active');
    setIsEditOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      await axios.put('/api/orderextradata', {
        email: currentUser.email,
        status: newStatus,
      });

      setUsers((prev) =>
        prev.map((u) => (u._id === currentUser._id ? { ...u, status: newStatus } : u))
      );

      setIsEditOpen(false);
      setCurrentUser(null);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUserSelect = (user) => {
    setSearchTerm(user.email);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-white p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-gray-400 mt-1">Manage your customers and their orders</p>
        </div>
        <UserSearchBar onUserSelect={handleUserSelect} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-lg px-4 py-2 border border-gray-700">
          <Filter size={18} className="text-gray-400" />
          <select 
            className="bg-transparent text-white focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-lg px-4 py-2 border border-gray-700">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Filter customers..."
            className="bg-transparent text-white focus:outline-none placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={clearFilters}
          className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-lg px-4 py-2 border border-gray-700 transition-colors"
        >
          <X size={18} />
          Clear Filters
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900/30 p-2 rounded-full">
              <User className="text-blue-400" size={20} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{users.length}</h3>
              <p className="text-gray-400 text-sm">Total Customers</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-green-900/30 p-2 rounded-full">
              <User className="text-green-400" size={20} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</h3>
              <p className="text-gray-400 text-sm">Active Customers</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-red-900/30 p-2 rounded-full">
              <User className="text-red-400" size={20} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{users.filter(u => u.status === 'inactive').length}</h3>
              <p className="text-gray-400 text-sm">Inactive Customers</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-amber-900/30 p-2 rounded-full">
              <DollarSign className="text-amber-400" size={20} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">
                ${users.reduce((sum, user) => sum + (user.orderData?.totalSpend || 0), 0).toFixed(2)}
              </h3>
              <p className="text-gray-400 text-sm">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] rounded-lg border border-gray-700 shadow-lg overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Registration Date</th>
                <th className="py-3 px-4 text-left">Last Order</th>
                <th className="py-3 px-4 text-left">Total Spend</th>
                <th className="py-3 px-4 text-left">Orders</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-gray-800">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <td key={i} className="py-3 px-4">
                          <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                : filteredUsers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="border-b border-gray-800 last:border-0 hover:bg-[#2A2A2A] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#D4AF37] rounded-full p-2">
                            <User size={16} className="text-black" />
                          </div>
                          <div>
                            <div className="font-medium">{customer.username || 'No name'}</div>
                            <div className="text-sm text-gray-400">{customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            customer.status === 'active'
                              ? 'bg-green-900 text-green-300'
                              : customer.status === 'inactive'
                              ? 'bg-red-900 text-red-300'
                              : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {customer.status || 'unknown'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString()
                          : '-'}
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
                        <div className="flex items-center gap-1">
                          <Hash size={14} className="text-gray-400" />
                          {customer.orderData?.ordersCount || 0}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                          onClick={() => openEdit(customer)}
                          aria-label="Edit status"
                        >
                          <Edit size={16} />
                        </motion.button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          
          {!isLoading && filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              <User size={48} className="mx-auto mb-4 opacity-50" />
              <p>No customers found</p>
              <p className="text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Status Modal */}
      {isEditOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl border border-gray-700 bg-[#1A1A1A] p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit Customer Status</h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="rounded-lg p-1 hover:text-[#D4AF37]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6 p-3 bg-[#2A2A2A] rounded-lg">
              <div className="bg-[#D4AF37] rounded-full p-2">
                <User size={20} className="text-black" />
              </div>
              <div>
                <div className="font-medium">{currentUser.username || 'No name'}</div>
                <div className="text-sm text-gray-400">{currentUser.email}</div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm text-gray-300">Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="active"
                    checked={newStatus === 'active'}
                    onChange={() => setNewStatus('active')}
                    className="text-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Active
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="inactive"
                    checked={newStatus === 'inactive'}
                    onChange={() => setNewStatus('inactive')}
                    className="text-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Inactive
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="flex-1 rounded-lg bg-[#2A2A2A] px-4 py-2 font-medium transition hover:bg-[#3A3A3A]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                disabled={saving}
                className="flex-1 rounded-lg bg-[#D4AF37] px-4 py-2 font-semibold text-black transition hover:bg-[#b9962d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Search, Edit, X, Filter, User, Mail, Calendar, DollarSign, Hash } from 'lucide-react';
// import axios from 'axios';

// function UserSearchBar({ onUserSelect }) {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [results, setResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);

//   useEffect(() => {
//     if (!searchTerm) {
//       setResults([]);
//       setShowDropdown(false);
//       return;
//     }

//     const handler = setTimeout(async () => {
//       try {
//         setIsLoading(true);
//         const res = await axios.get('/api/orderextradata', {
//           params: { q: searchTerm }
//         });
//         setResults(res.data.users || []);
//         setShowDropdown(true);
//       } catch (err) {
//         console.error('Search error:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     }, 500);

//     return () => clearTimeout(handler);
//   }, [searchTerm]);

//   const handleSelect = (user) => {
//     onUserSelect(user);
//     setSearchTerm(user.email);
//     setShowDropdown(false);
//   };

//   return (
//     <div className="relative w-full md:w-80">
//       <div className="relative">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
//         <input
//           type="text"
//           placeholder="Search users by name or email..."
//           className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onFocus={() => searchTerm && setShowDropdown(true)}
//         />
//       </div>

//       {showDropdown && (
//         <div className="absolute z-10 mt-2 w-full rounded-lg bg-[#1A1A1A] border border-gray-700 shadow-lg max-h-60 overflow-y-auto">
//           {isLoading && (
//             <div className="p-4 text-center text-gray-400">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D4AF37] mx-auto"></div>
//             </div>
//           )}
//           {!isLoading && results.length === 0 && (
//             <div className="p-4 text-center text-gray-400">No users found</div>
//           )}
//           {!isLoading && results.map((user) => (
//             <div
//               key={user._id}
//               className="p-3 cursor-pointer hover:bg-[#2A2A2A] transition-colors border-b border-gray-800 last:border-0"
//               onClick={() => handleSelect(user)}
//             >
//               <div className="flex items-center gap-3">
//                 <div className="bg-[#D4AF37] rounded-full p-2">
//                   <User size={16} className="text-black" />
//                 </div>
//                 <div>
//                   <div className="text-sm font-medium">{user.username || 'No name'}</div>
//                   <div className="text-xs text-gray-400">{user.email}</div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function CustomersPage() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState('all');

//   // edit modal state
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [newStatus, setNewStatus] = useState('active');
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     fetchUsersWithOrderData();
//   }, []);

//   const fetchUsersWithOrderData = async () => {
//     try {
//       setIsLoading(true);
//       const res = await axios.get('/api/users');
//       const userList = res.data.users ?? [];

//       const usersWithOrderData = await Promise.all(
//         userList.map(async (user) => {
//           try {
//             const orderRes = await axios.post('/api/orderextradata', { email: user.email });
//             return { ...user, orderData: orderRes.data };
//           } catch (error) {
//             console.error(`Failed to fetch order data for ${user.email}`, error);
//             return {
//               ...user,
//               orderData: { lastOrderDate: null, totalSpend: 0, ordersCount: 0 },
//             };
//           }
//         })
//       );

//       setUsers(usersWithOrderData);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // search and filter
//   useEffect(() => {
//     const term = searchTerm.toLowerCase();
//     const filtered = users.filter(
//       (u) =>
//         (u.username || '').toLowerCase().includes(term) ||
//         (u.email || '').toLowerCase().includes(term)
//     ).filter(user => 
//       statusFilter === 'all' || user.status === statusFilter
//     );
    
//     setFilteredUsers(filtered);
//   }, [searchTerm, users, statusFilter]);

//   const openEdit = (customer) => {
//     setCurrentUser(customer);
//     setNewStatus(customer.status === 'inactive' ? 'inactive' : 'active');
//     setIsEditOpen(true);
//   };

//   const handleSaveStatus = async () => {
//     if (!currentUser) return;
//     setSaving(true);
//     try {
//       await axios.put('/api/orderextradata', {
//         email: currentUser.email,
//         status: newStatus,
//       });

//       setUsers((prev) =>
//         prev.map((u) => (u._id === currentUser._id ? { ...u, status: newStatus } : u))
//       );

//       setIsEditOpen(false);
//       setCurrentUser(null);
//     } catch (err) {
//       console.error('Error updating status:', err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleUserSelect = (user) => {
//     setSearchTerm(user.email);
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setStatusFilter('all');
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#0A0A0A] text-white p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-2xl font-bold">Customer Management</h1>
//           <p className="text-gray-400 mt-1">Manage your customers and their orders</p>
//         </div>
//         <UserSearchBar onUserSelect={handleUserSelect} />
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-lg px-4 py-2 border border-gray-700">
//           <Filter size={18} className="text-gray-400" />
//           <select 
//             className="bg-transparent text-white focus:outline-none"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="all">All Statuses</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         </div>
        
//         <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-lg px-4 py-2 border border-gray-700">
//           <Search size={18} className="text-gray-400" />
//           <input
//             type="text"
//             placeholder="Filter customers..."
//             className="bg-transparent text-white focus:outline-none placeholder-gray-500"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
        
//         <button 
//           onClick={clearFilters}
//           className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-lg px-4 py-2 border border-gray-700 transition-colors"
//         >
//           <X size={18} />
//           Clear Filters
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-700">
//           <div className="flex items-center gap-3">
//             <div className="bg-blue-900/30 p-2 rounded-full">
//               <User className="text-blue-400" size={20} />
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold">{users.length}</h3>
//               <p className="text-gray-400 text-sm">Total Customers</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-700">
//           <div className="flex items-center gap-3">
//             <div className="bg-green-900/30 p-2 rounded-full">
//               <User className="text-green-400" size={20} />
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</h3>
//               <p className="text-gray-400 text-sm">Active Customers</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-700">
//           <div className="flex items-center gap-3">
//             <div className="bg-red-900/30 p-2 rounded-full">
//               <User className="text-red-400" size={20} />
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold">{users.filter(u => u.status === 'inactive').length}</h3>
//               <p className="text-gray-400 text-sm">Inactive Customers</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-700">
//           <div className="flex items-center gap-3">
//             <div className="bg-amber-900/30 p-2 rounded-full">
//               <DollarSign className="text-amber-400" size={20} />
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold">
//                 ${users.reduce((sum, user) => sum + (user.orderData?.totalSpend || 0), 0).toFixed(2)}
//               </h3>
//               <p className="text-gray-400 text-sm">Total Revenue</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-[#1A1A1A] rounded-lg border border-gray-700 shadow-lg overflow-hidden w-full">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-700">
//                 <th className="py-3 px-4 text-left">Customer</th>
//                 <th className="py-3 px-4 text-left">Status</th>
//                 <th className="py-3 px-4 text-left">Registration Date</th>
//                 <th className="py-3 px-4 text-left">Last Order</th>
//                 <th className="py-3 px-4 text-left">Total Spend</th>
//                 <th className="py-3 px-4 text-left">Orders</th>
//                 <th className="py-3 px-4 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading
//                 ? Array.from({ length: 6 }).map((_, idx) => (
//                     <tr key={idx} className="border-b border-gray-800">
//                       {Array.from({ length: 7 }).map((_, i) => (
//                         <td key={i} className="py-3 px-4">
//                           <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
//                         </td>
//                       ))}
//                     </tr>
//                   ))
//                 : filteredUsers.map((customer) => (
//                     <tr
//                       key={customer._id}
//                       className="border-b border-gray-800 last:border-0 hover:bg-[#2A2A2A] transition-colors"
//                     >
//                       <td className="py-3 px-4">
//                         <div className="flex items-center gap-3">
//                           <div className="bg-[#D4AF37] rounded-full p-2">
//                             <User size={16} className="text-black" />
//                           </div>
//                           <div>
//                             <div className="font-medium">{customer.username || 'No name'}</div>
//                             <div className="text-sm text-gray-400">{customer.email}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-3 px-4">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs ${
//                             customer.status === 'active'
//                               ? 'bg-green-900 text-green-300'
//                               : customer.status === 'inactive'
//                               ? 'bg-red-900 text-red-300'
//                               : 'bg-gray-700 text-gray-300'
//                           }`}
//                         >
//                           {customer.status || 'unknown'}
//                         </span>
//                       </td>
//                       <td className="py-3 px-4">
//                         {customer.createdAt
//                           ? new Date(customer.createdAt).toLocaleDateString()
//                           : '-'}
//                       </td>
//                       <td className="py-3 px-4">
//                         {customer.orderData?.lastOrderDate
//                           ? new Date(customer.orderData.lastOrderDate).toLocaleDateString()
//                           : 'No Orders'}
//                       </td>
//                       <td className="py-3 px-4">
//                         ${customer.orderData?.totalSpend?.toFixed(2) || '0.00'}
//                       </td>
//                       <td className="py-3 px-4">
//                         <div className="flex items-center gap-1">
//                           <Hash size={14} className="text-gray-400" />
//                           {customer.orderData?.ordersCount || 0}
//                         </div>
//                       </td>
//                       <td className="py-3 px-4">
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.95 }}
//                           className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
//                           onClick={() => openEdit(customer)}
//                           aria-label="Edit status"
//                         >
//                           <Edit size={16} />
//                         </motion.button>
//                       </td>
//                     </tr>
//                   ))}
//             </tbody>
//           </table>
          
//           {!isLoading && filteredUsers.length === 0 && (
//             <div className="p-8 text-center text-gray-400">
//               <User size={48} className="mx-auto mb-4 opacity-50" />
//               <p>No customers found</p>
//               <p className="text-sm mt-2">Try adjusting your search or filters</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Edit Status Modal */}
//       {isEditOpen && currentUser && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="w-full max-w-md rounded-2xl border border-gray-700 bg-[#1A1A1A] p-6 shadow-xl"
//           >
//             <div className="mb-4 flex items-center justify-between">
//               <h2 className="text-lg font-semibold">Edit Customer Status</h2>
//               <button
//                 onClick={() => setIsEditOpen(false)}
//                 className="rounded-lg p-1 hover:text-[#D4AF37]"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="flex items-center gap-3 mb-6 p-3 bg-[#2A2A2A] rounded-lg">
//               <div className="bg-[#D4AF37] rounded-full p-2">
//                 <User size={20} className="text-black" />
//               </div>
//               <div>
//                 <div className="font-medium">{currentUser.username || 'No name'}</div>
//                 <div className="text-sm text-gray-400">{currentUser.email}</div>
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="block mb-2 text-sm text-gray-300">Status</label>
//               <div className="flex gap-4">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     value="active"
//                     checked={newStatus === 'active'}
//                     onChange={() => setNewStatus('active')}
//                     className="text-[#D4AF37] focus:ring-[#D4AF37]"
//                   />
//                   <span className="flex items-center gap-1">
//                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
//                     Active
//                   </span>
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     value="inactive"
//                     checked={newStatus === 'inactive'}
//                     onChange={() => setNewStatus('inactive')}
//                     className="text-[#D4AF37] focus:ring-[#D4AF37]"
//                   />
//                   <span className="flex items-center gap-1">
//                     <div className="w-2 h-2 rounded-full bg-red-500"></div>
//                     Inactive
//                   </span>
//                 </label>
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setIsEditOpen(false)}
//                 className="flex-1 rounded-lg bg-[#2A2A2A] px-4 py-2 font-medium transition hover:bg-[#3A3A3A]"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveStatus}
//                 disabled={saving}
//                 className="flex-1 rounded-lg bg-[#D4AF37] px-4 py-2 font-semibold text-black transition hover:bg-[#b9962d] disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {saving ? 'Saving...' : 'Save Changes'}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// }