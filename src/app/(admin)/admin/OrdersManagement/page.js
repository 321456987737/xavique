"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RefreshCw,
  Calendar,
  User,
  CreditCard,
  Loader2,
  Filter,
  XCircle,
  Package,
  Eye,
  Edit,
  MapPin,
  Clock,
  DollarSign,
  X,
  ShoppingBag,
  Hash,
  Save,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import SearchFilters from "@/components/admin/components/SearchFilters";

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper function to get status color
const getStatusColor = (status) => {
  const statusColors = {
    pending: "bg-yellow-900/30 text-yellow-400 border-yellow-500/30",
    processing: "bg-blue-900/30 text-blue-400 border-blue-500/30",
    shipped: "bg-purple-900/30 text-purple-400 border-purple-500/30",
    completed: "bg-green-900/30 text-green-400 border-green-500/30",
    cancelled: "bg-red-900/30 text-red-400 border-red-500/30",
  };
  return (
    statusColors[status?.toLowerCase()] ||
    "bg-gray-900/30 text-gray-400 border-gray-500/30"
  );
};

// Edit Order Modal Component
const EditOrderModal = ({ order, isOpen, onClose, onSave }) => {
  const [editedOrder, setEditedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (order && isOpen) {
      setEditedOrder({
        ...order,
        items: order.items
          ? [...order.items]
          : order.products
          ? [...order.products]
          : [],
      });
      setHasChanges(false);
    }
  }, [order, isOpen]);
  if (!isOpen || !order || !editedOrder) return null;

  const customerName =
    editedOrder.customerName ||
    editedOrder.customer?.name ||
    editedOrder.customer?.firstName + " " + editedOrder.customer?.lastName ||
    "Unknown Customer";

  const handleFieldChange = (field, value) => {
    setEditedOrder((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleCustomerFieldChange = (field, value) => {
    setEditedOrder((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...editedOrder.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setEditedOrder((prev) => ({
      ...prev,
      items: newItems,
    }));
    setHasChanges(true);
  };

  const handleQuantityChange = (index, change) => {
    const newItems = [...editedOrder.items];
    const newQuantity = Math.max(1, (newItems[index].quantity || 1) + change);
    newItems[index] = {
      ...newItems[index],
      quantity: newQuantity,
    };
    setEditedOrder((prev) => ({
      ...prev,
      items: newItems,
    }));
    setHasChanges(true);
  };

  const handleRemoveItem = (index) => {
    const newItems = editedOrder.items.filter((_, i) => i !== index);
    setEditedOrder((prev) => ({
      ...prev,
      items: newItems,
    }));
    setHasChanges(true);
  };
  
  const calculateTotal = () => {
    const itemsTotal = editedOrder.items.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);
    const shipping = editedOrder.shipping || 0;
    const tax = editedOrder.tax || 0;
    return itemsTotal + shipping + tax;
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    setIsLoading(true);
    try {
      const updatedOrder = {
        ...editedOrder,
        total: calculateTotal(),
      };
      await onSave(updatedOrder);
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error("Error saving order:", error);
      // You might want to show an error message here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#1A1A1A] rounded-xl border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="border-b border-white/10 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-[#D4AF37] mb-2 flex items-center">
                  <Edit className="h-6 w-6 mr-2" />
                  Edit Order
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>
                    #{editedOrder.id || editedOrder._id?.slice(-8) || "N/A"}
                  </span>
                  <span>•</span>
                  <span>{customerName}</span>
                  <span>•</span>
                  <span>{formatDate(editedOrder.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {hasChanges && (
                  <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                    Unsaved changes
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-scroll scrollbar-none  max-h-[calc(90vh-180px)]">
            <div className="grid overflow-y-scroll scrollbar-none grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Order Info */}
              <div className="space-y-6">
                {/* Order Status */}
                <div className="bg-[#0A0A0A] rounded-lg p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Order Status
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Status
                      </label>
                      <select
                        value={editedOrder.status || ""}
                        onChange={(e) =>
                          handleFieldChange("status", e.target.value)
                        }
                        className="w-full bg-[#1A1A1A] border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Payment Status
                      </label>
                      <select
                        value={editedOrder.paymentStatus || ""}
                        onChange={(e) =>
                          handleFieldChange("paymentStatus", e.target.value)
                        }
                        className="w-full bg-[#1A1A1A] border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Payment Method
                      </label>
                      <select
                        value={editedOrder.paymentMethod || ""}
                        onChange={(e) =>
                          handleFieldChange("paymentMethod", e.target.value)
                        }
                        className="w-full bg-[#1A1A1A] border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="card">Credit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="cash_on_delivery">
                          Cash on Delivery
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-[#0A0A0A] rounded-lg p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Customer Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        value={editedOrder.customerName || ""}
                        onChange={(e) =>
                          handleFieldChange("customerName", e.target.value)
                        }
                        className="w-full bg-[#1A1A1A] border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                        placeholder="Enter customer name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editedOrder.customer?.email || ""}
                        onChange={(e) =>
                          handleCustomerFieldChange("email", e.target.value)
                        }
                        className="w-full bg-[#1A1A1A] border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                        placeholder="customer@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editedOrder.customer?.phone || ""}
                        onChange={(e) =>
                          handleCustomerFieldChange("phone", e.target.value)
                        }
                        className="w-full bg-[#1A1A1A] border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Shipping Address
                      </label>
                      <textarea
                        value={
                          typeof editedOrder.customer?.address === "string"
                            ? editedOrder.customer?.address
                            : `${
                                editedOrder.customer?.address?.street || ""
                              }, ${editedOrder.customer?.address?.city || ""}`
                        }
                        onChange={(e) =>
                          handleCustomerFieldChange("address", e.target.value)
                        }
                        className="w-full bg-[#1A1A1A] border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none h-20 resize-none"
                        placeholder="Enter shipping address"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Totals */}
                <div className="bg-[#0A0A0A] rounded-lg p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Order Totals
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Shipping Cost
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editedOrder.shipping || 0}
                        onChange={(e) =>
                          handleFieldChange(
                            "shipping",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full bg-[#1A1A1A] border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Tax
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editedOrder.tax || 0}
                        onChange={(e) =>
                          handleFieldChange(
                            "tax",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full bg-[#1A1A1A] border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">Total:</span>
                        <span className="text-[#D4AF37] text-xl font-bold">
                          {formatCurrency(calculateTotal())}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Products */}
              <div className="space-y-6">
                <div className="bg-[#0A0A0A] rounded-lg p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2 text-[#D4AF37]" />
                    Order Items ({editedOrder.items.length})
                  </h3>

                  {editedOrder.items.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="mx-auto h-12 w-12 text-gray-500 mb-3" />
                      <p className="text-gray-400">No products in this order</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {editedOrder.items.map((item, index) => (
                        <motion.div
                          key={item.id || item._id || index}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="bg-[#1A1A1A] rounded-lg p-4 border border-white/10"
                        >
                          <div className="flex items-start space-x-4">
                            {/* Product Image */}
                            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                              {item.images ? (
                                <img
                                  src={item.images[0].url }
                                  alt={
                                    item.name || item.productName || "Product"
                                  }
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="h-8 w-8 text-gray-500" />
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <input
                                  type="text"
                                  value={item.name || item.productName || ""}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  className="font-semibold text-white bg-transparent border-none outline-none flex-1 mr-2"
                                  placeholder="Product name"
                                />
                                <button
                                  onClick={() => handleRemoveItem(index)}
                                  className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                                  title="Remove item"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              {/* Price and Quantity Controls */}
                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">
                                    Price
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={item.price || 0}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "price",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">
                                    Quantity
                                  </label>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(index, -1)
                                      }
                                      className="p-1 bg-[#0A0A0A] border border-white/10 rounded hover:border-[#D4AF37] transition-colors"
                                      disabled={item.quantity <= 1}
                                    >
                                      <Minus className="h-3 w-3 text-white" />
                                    </button>
                                    <input
                                      type="number"
                                      min="1"
                                      value={item.quantity || 1}
                                      onChange={(e) =>
                                        handleItemChange(
                                          index,
                                          "quantity",
                                          parseInt(e.target.value) || 1
                                        )
                                      }
                                      className="w-12 text-center bg-[#0A0A0A] border border-white/10 rounded px-1 py-1 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                                    />
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(index, 1)
                                      }
                                      className="p-1 bg-[#0A0A0A] border border-white/10 rounded hover:border-[#D4AF37] transition-colors"
                                    >
                                      <Plus className="h-3 w-3 text-white" />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Additional Fields */}
                               
                              <div className="grid grid-cols-2 gap-4 mb-3">

                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">
                                    Category 
                                  </label>
                                  <input
                                    type="text"
                                    value={item.category || ""}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "category",
                                        e.target.value
                                      )
                                    }
                                    className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                                    placeholder="Category"
                                  />
                                </div>
                              </div>

                              {/* Subtotal */}
                              <div className="pt-2 border-t border-white/10">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-400">
                                    Subtotal:
                                  </span>
                                  <span className="text-[#D4AF37] font-semibold">
                                    {formatCurrency(
                                      (item.price || 0) * (item.quantity || 1)
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-white/10 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                {hasChanges && (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                    <span>You have unsaved changes</span>
                  </>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || isLoading}
                  className="px-6 py-2 bg-[#D4AF37] text-[#0A0A0A] rounded-lg hover:bg-[#D4AF37]/90 transition-all flex items-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Product Details Modal Component
const ProductDetailsModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;
  console.log("order", order)
  console.log("order address", order.customer.address.city)
  // console.log("order", order.cuntomer)
  const items = order.items || order.products || [];
  const customerName =
    order.customerName ||
    order.customer?.name ||
    order.customer?.firstName + " " + order.customer?.lastName ||
    "Unknown Customer";
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed  inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#1A1A1A] rounded-xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="border-b border-white/10 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-[#D4AF37] mb-2">
                  Order Details
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>#{order.id || order._id?.slice(-8) || "N/A"}</span>
                  <span>•</span>
                  <span>{customerName}</span>
                  <span>•</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-scroll scrollbar-none  max-h-[calc(90vh-120px)]">
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#0A0A0A] rounded-lg p-4 border border-white/10">
                <div className="text-gray-400 text-sm mb-1">Status</div>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                  {order.status?.charAt(0)?.toUpperCase() +
                    order.status?.slice(1) || "Unknown"}
                </div>
              </div>
              <div className="bg-[#0A0A0A] rounded-lg p-4 border border-white/10">
                <div className="text-gray-400 text-sm mb-1">Total Amount</div>
                <div className="text-[#D4AF37] text-xl font-bold">
                  {formatCurrency(order.total || order.totalAmount || 0)}
                </div>
              </div>
              <div className="bg-[#0A0A0A] rounded-lg p-4 border border-white/10">
                <div className="text-gray-400 text-sm mb-1">Payment Method</div>
                <div className="text-white font-medium capitalize">
                  {order.paymentMethod || "N/A"}
                </div>
              </div>
            </div>

            {/* Products List */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-[#D4AF37]" />
                Ordered Products ({items.length})
              </h3>

              {items.length === 0 ? (
                <div className="bg-[#0A0A0A] rounded-lg p-8 border border-white/10 text-center">
                  <Package className="mx-auto h-12 w-12 text-gray-500 mb-3" />
                  <p className="text-gray-400">
                    No products found in this order
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                     
                    <motion.div
                      key={item.id || item._id || index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-[#0A0A0A] rounded-lg p-4 border border-white/10 hover:border-[#D4AF37]/30 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.images  ? (
                            <img
                              src={item.images[0].url }
                              alt={item.name || item.productName || "Product"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-gray-500" />
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-white text-lg">
                              {item.name ||
                                item.productName ||
                                item.title ||
                                "Unknown Product"}
                            </h4>
                            <div className="text-right">
                              <div className="text-[#D4AF37] font-bold">
                                {formatCurrency(item.price || item.cost || 0)}
                              </div>
                              {item.originalPrice &&
                                item.originalPrice > (item.price || 0) && (
                                  <div className="text-gray-400 text-sm line-through">
                                    {formatCurrency(item.originalPrice)}
                                  </div>
                                )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center text-gray-300">
                              <Hash className="h-4 w-4 mr-1 text-[#D4AF37]" />
                              <span>Qty: {item.quantity || 1}</span>
                            </div>

                            {item.sku && (
                              <div className="flex items-center text-gray-300">
                                <span className="text-gray-400 mr-1">SKU:</span>
                                <span>{item.sku}</span>
                              </div>
                            )}

                            {item.category && (
                              <div className="flex items-center text-gray-300">
                                <span className="text-gray-400 mr-1">
                                  Category:
                                </span>
                                <span className="capitalize">
                                  {item.category}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded text-xs">
                                  Size: {item.selectedOptions.size}
                                </span>
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                                  Color: {item.selectedOptions.color}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded text-md">
                                Address: {order.customer.address.line1}
                              </span>
                              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-md">
                                Appartment No.: {order.customer.address.line2}
                              </span>
                              
                              <span className="px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded text-md">
                                City: {order.customer.address.city}
                              </span>
                              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-md">
                                Postal_code: {order.customer.address.postal_code}
                              </span>
                              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-md">
                                Country: {order.customer.address.country}
                              </span>

                            </div>

                            </div>

                          {/* Subtotal */}
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">
                                Subtotal:
                              </span>
                              <span className="text-white font-semibold">
                                {formatCurrency(
                                  (item.price || 0) * (item.quantity || 1)
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Order Summary Footer */}
              {items.length > 0 && (
                <div className="mt-6 p-4 bg-[#0A0A0A] rounded-lg border border-white/10">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-white">Order Total:</span>
                    <span className="text-[#D4AF37]">
                      {formatCurrency(order.total || order.totalAmount || 0)}
                    </span>
                  </div>
                  {order.shipping && (
                    <div className="flex justify-between items-center text-sm text-gray-400 mt-1">
                      <span>Shipping:</span>
                      <span>{formatCurrency(order.shipping)}</span>
                    </div>
                  )}
                  {order.tax && (
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>Tax:</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Individual Order Card Component
const OrderCard = ({ order, onClick, onViewProducts, onEditOrder }) => {
  const customerName =
    order.customerName ||
    order.customer?.name ||
    order.customer?.firstName + " " + order.customer?.lastName ||
    "Unknown Customer";

  const itemCount = Array.isArray(order.items)
    ? order.items.length
    : Array.isArray(order.products)
    ? order.products.length
    : 0;
  const totalAmount = order.total || order.totalAmount || 0;

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6 hover:border-[#D4AF37] transition-all duration-300 cursor-pointer group"
      onClick={() => onClick?.(order)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg flex items-center group-hover:text-[#D4AF37] transition-colors">
            <User className="h-5 w-5 mr-2 text-[#D4AF37]" />
            {customerName}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Order #{order.id || order._id?.slice(-8) || "N/A"}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 block">
            <Clock className="h-3 w-3 inline mr-1" />
            {formatDate(order.createdAt)}
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(
            order.status
          )}`}
        >
          <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></div>
          {order.status?.charAt(0)?.toUpperCase() + order.status?.slice(1) ||
            "Unknown"}
        </div>

        <div className="text-xs text-gray-400">
          {order.paymentStatus && (
            <span
              className={`px-2 py-1 rounded ${
                order.paymentStatus === "paid"
                  ? "bg-green-900/30 text-green-400"
                  : order.paymentStatus === "failed"
                  ? "bg-red-900/30 text-red-400"
                  : "bg-yellow-900/30 text-yellow-400"
              }`}
            >
              {order.paymentStatus}
            </span>
          )}
        </div>
      </div>

      {/* Order Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-300">
          <CreditCard className="h-4 w-4 mr-2 text-[#D4AF37]" />
          <span className="text-sm capitalize">
            {order.paymentMethod || "N/A"}
          </span>
        </div>

        <div className="flex items-center text-gray-300">
          <Package className="h-4 w-4 mr-2 text-[#D4AF37]" />
          <span className="text-sm">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </span>
        </div>

        {order.customer?.address && (
          <div className="flex items-start text-gray-300">
            <MapPin className="h-4 w-4 mr-2 text-[#D4AF37] mt-0.5" />
            <span className="text-sm line-clamp-2">
              {typeof order.customer.address === "string"
                ? order.customer.address
                : `${order.customer.address.street || ""}, ${
                    order.customer.address.city || ""
                  }`}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-white font-semibold">
            <DollarSign className="h-4 w-4 mr-1 text-[#D4AF37]" />
            {formatCurrency(totalAmount)}
          </div>

          <div className="flex space-x-2">
            <button
              className="p-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onViewProducts(order);
              }}
              title="View Products"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onEditOrder(order);
              }}
              title="Edit Order"
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Order Management Component
export default function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);

  const fetchOrders = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    setCurrentFilters(filters);

    try {
      // Clean up empty filter values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined
        )
      );

      const params = new URLSearchParams(cleanFilters).toString();
      const url = `/api/orders${params ? `?${params}` : ""}`;

      console.log("Fetching orders with URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Order fetch error:", err);
      setError(`Failed to fetch orders: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOrderClick = (order) => {
    console.log("Order clicked:", order);
    // Navigate to order details or open modal
  };

  const handleViewProducts = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setOrderToEdit(order);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setOrderToEdit(null);
  };

 const handleSaveOrder = async (updatedOrder) => {
  try {
   const response = await fetch(`/api/orders`, { // no ID in URL
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedOrder), // send full object including ID
    });
    if (!response.ok) {
      throw new Error(`Failed to update order: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          (order._id === updatedOrder._id || order.id === updatedOrder.id)
            ? result.data
            : order
        )
      );
      return result.data;
    } else {
      throw new Error(result.error || "Failed to update order");
    }
  } catch (error) {
    console.error("Error updating order:", error);
    throw error; // Propagate error to modal
  }
};

  const handleRetry = () => {
    fetchOrders(currentFilters);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-2"
        >
          Order Management
        </motion.h1>
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 mb-4"
        >
          Manage and track all customer orders
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-[#D4AF37] to-transparent rounded"
        />
      </header>

      {/* Search Filters */}
      <SearchFilters onFilterChange={fetchOrders} />

      {/* Stats Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-[#1A1A1A] rounded-lg border border-white/10 p-4">
          <div className="text-[#D4AF37] text-2xl font-bold">
            {orders.length}
          </div>
          <div className="text-gray-400 text-sm">Total Orders</div>
        </div>
        <div className="bg-[#1A1A1A] rounded-lg border border-white/10 p-4">
          <div className="text-green-400 text-2xl font-bold">
            {orders.filter((o) => o.status === "completed").length}
          </div>
          <div className="text-gray-400 text-sm">Completed</div>
        </div>
        <div className="bg-[#1A1A1A] rounded-lg border border-white/10 p-4">
          <div className="text-yellow-400 text-2xl font-bold">
            {orders.filter((o) => o.status === "pending").length}
          </div>
          <div className="text-gray-400 text-sm">Pending</div>
        </div>
        <div className="bg-[#1A1A1A] rounded-lg border border-white/10 p-4">
          <div className="text-[#D4AF37] text-2xl font-bold">
            {formatCurrency(
              orders.reduce((sum, order) => sum + (order.total || 0), 0)
            )}
          </div>
          <div className="text-gray-400 text-sm">Total Revenue</div>
        </div>
      </motion.div>

      {/* Orders Content */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="animate-spin text-[#D4AF37] h-12 w-12 mb-4" />
            <p className="text-gray-400">Loading orders...</p>
          </div>
        ) : error ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1A1A1A] rounded-xl p-8 border border-red-500/30 text-center"
          >
            <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Error Loading Orders
            </h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-[#D4AF37] text-[#0A0A0A] rounded-lg hover:bg-[#D4AF37]/90 transition-all flex items-center justify-center mx-auto font-semibold"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </button>
          </motion.div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1A1A1A] rounded-xl p-8 border border-white/10 text-center"
          >
            <Search className="mx-auto h-16 w-16 text-[#D4AF37] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-400 mb-4">
              {Object.keys(currentFilters).length > 0
                ? "Try adjusting your search filters"
                : "No orders have been placed yet"}
            </p>
            {Object.keys(currentFilters).length > 0 && (
              <button
                onClick={() => fetchOrders({})}
                className="px-4 py-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/20 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {orders.map((order) => (
                <OrderCard
                  key={order._id || order.id}
                  order={order}
                  onClick={handleOrderClick}
                  onViewProducts={handleViewProducts}
                  onEditOrder={handleEditOrder}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Edit Order Modal */}
      <EditOrderModal
        order={orderToEdit}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveOrder}
      />
       <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="h-1 bg-gradient-to-r mt-[50px] from-[#D4AF37] to-transparent rounded"
        />
    </div>
  );
}
// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Search, RefreshCw, Calendar, User, CreditCard,
//   Loader2, Filter, XCircle, Package, Eye, Edit,
//   MapPin, Clock, DollarSign, X, ShoppingBag, Hash
// } from "lucide-react";
// import SearchFilters from "@/components/admin/components/SearchFilters";

// // Helper function to format currency
// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD'
//   }).format(amount || 0);
// };

// // Helper function to format date
// const formatDate = (dateString) => {
//   return new Date(dateString).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   });
// };

// // Helper function to get status color
// const getStatusColor = (status) => {
//   const statusColors = {
//     'pending': 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
//     'processing': 'bg-blue-900/30 text-blue-400 border-blue-500/30',
//     'shipped': 'bg-purple-900/30 text-purple-400 border-purple-500/30',
//     'completed': 'bg-green-900/30 text-green-400 border-green-500/30',
//     'cancelled': 'bg-red-900/30 text-red-400 border-red-500/30'
//   };
//   return statusColors[status?.toLowerCase()] || 'bg-gray-900/30 text-gray-400 border-gray-500/30';
// };

// // Product Details Modal Component
// const ProductDetailsModal = ({ order, isOpen, onClose }) => {
//   if (!isOpen || !order) return null;

//   const items = order.items || order.products || [];
//   const customerName = order.customerName ||
//                       order.customer?.name ||
//                       order.customer?.firstName + ' ' + order.customer?.lastName ||
//                       'Unknown Customer';

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//         onClick={onClose}
//       >
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.9, opacity: 0 }}
//           className="bg-[#1A1A1A] rounded-xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Modal Header */}
//           <div className="border-b border-white/10 p-6">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h2 className="text-2xl font-bold text-[#D4AF37] mb-2">
//                   Order Details
//                 </h2>
//                 <div className="flex items-center space-x-4 text-sm text-gray-400">
//                   <span>#{order.id || order._id?.slice(-8) || 'N/A'}</span>
//                   <span>•</span>
//                   <span>{customerName}</span>
//                   <span>•</span>
//                   <span>{formatDate(order.createdAt)}</span>
//                 </div>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//               >
//                 <X className="h-6 w-6 text-gray-400" />
//               </button>
//             </div>
//           </div>

//           {/* Modal Content */}
//           <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
//             {/* Order Summary */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               <div className="bg-[#0A0A0A] rounded-lg p-4 border border-white/10">
//                 <div className="text-gray-400 text-sm mb-1">Status</div>
//                 <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-semibold ${getStatusColor(order.status)}`}>
//                   <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
//                   {order.status?.charAt(0)?.toUpperCase() + order.status?.slice(1) || 'Unknown'}
//                 </div>
//               </div>
//               <div className="bg-[#0A0A0A] rounded-lg p-4 border border-white/10">
//                 <div className="text-gray-400 text-sm mb-1">Total Amount</div>
//                 <div className="text-[#D4AF37] text-xl font-bold">
//                   {formatCurrency(order.total || order.totalAmount || 0)}
//                 </div>
//               </div>
//               <div className="bg-[#0A0A0A] rounded-lg p-4 border border-white/10">
//                 <div className="text-gray-400 text-sm mb-1">Payment Method</div>
//                 <div className="text-white font-medium capitalize">
//                   {order.paymentMethod || 'N/A'}
//                 </div>
//               </div>
//             </div>

//             {/* Products List */}
//             <div>
//               <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
//                 <ShoppingBag className="h-5 w-5 mr-2 text-[#D4AF37]" />
//                 Ordered Products ({items.length})
//               </h3>

//               {items.length === 0 ? (
//                 <div className="bg-[#0A0A0A] rounded-lg p-8 border border-white/10 text-center">
//                   <Package className="mx-auto h-12 w-12 text-gray-500 mb-3" />
//                   <p className="text-gray-400">No products found in this order</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {items.map((item, index) => (
//                     <motion.div
//                       key={item.id || item._id || index}
//                       initial={{ x: -20, opacity: 0 }}
//                       animate={{ x: 0, opacity: 1 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="bg-[#0A0A0A] rounded-lg p-4 border border-white/10 hover:border-[#D4AF37]/30 transition-colors"
//                     >
//                       <div className="flex items-start space-x-4">
//                         {/* Product Image */}
//                         <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
//                           {item.image || item.productImage ? (
//                             <img
//                               src={item.image || item.productImage}
//                               alt={item.name || item.productName || 'Product'}
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <Package className="h-8 w-8 text-gray-500" />
//                           )}
//                         </div>

//                         {/* Product Details */}
//                         <div className="flex-1">
//                           <div className="flex justify-between items-start mb-2">
//                             <h4 className="font-semibold text-white text-lg">
//                               {item.name || item.productName || item.title || 'Unknown Product'}
//                             </h4>
//                             <div className="text-right">
//                               <div className="text-[#D4AF37] font-bold">
//                                 {formatCurrency(item.price || item.cost || 0)}
//                               </div>
//                               {item.originalPrice && item.originalPrice > (item.price || 0) && (
//                                 <div className="text-gray-400 text-sm line-through">
//                                   {formatCurrency(item.originalPrice)}
//                                 </div>
//                               )}
//                             </div>
//                           </div>

//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                             <div className="flex items-center text-gray-300">
//                               <Hash className="h-4 w-4 mr-1 text-[#D4AF37]" />
//                               <span>Qty: {item.quantity || 1}</span>
//                             </div>

//                             {item.sku && (
//                               <div className="flex items-center text-gray-300">
//                                 <span className="text-gray-400 mr-1">SKU:</span>
//                                 <span>{item.sku}</span>
//                               </div>
//                             )}

//                             {item.category && (
//                               <div className="flex items-center text-gray-300">
//                                 <span className="text-gray-400 mr-1">Category:</span>
//                                 <span className="capitalize">{item.category}</span>
//                               </div>
//                             )}
//                           </div>

//                           {/* Product Options/Variants */}
//                           {/* {(item.selectedOptions || item.variant) && ( */}
//                             <div className="flex flex-wrap gap-2 mt-2">
//                                 <span className="px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded text-xs">
//                                   Size: {item.selectedOptions.size}
//                                 </span>

//                                 <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
//                                   Color: {item.selectedOptions.color}
//                                 </span>
//                             </div>
//                           {/* ) */}
//                           {/* } */}

//                           {/* Subtotal */}
//                           <div className="mt-3 pt-3 border-t border-white/10">
//                             <div className="flex justify-between items-center">
//                               <span className="text-gray-400 text-sm">Subtotal:</span>
//                               <span className="text-white font-semibold">
//                                 {formatCurrency((item.price || 0) * (item.quantity || 1))}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}

//               {/* Order Summary Footer */}
//               {items.length > 0 && (
//                 <div className="mt-6 p-4 bg-[#0A0A0A] rounded-lg border border-white/10">
//                   <div className="flex justify-between items-center text-lg font-bold">
//                     <span className="text-white">Order Total:</span>
//                     <span className="text-[#D4AF37]">
//                       {formatCurrency(order.total || order.totalAmount || 0)}
//                     </span>
//                   </div>
//                   {order.shipping && (
//                     <div className="flex justify-between items-center text-sm text-gray-400 mt-1">
//                       <span>Shipping:</span>
//                       <span>{formatCurrency(order.shipping)}</span>
//                     </div>
//                   )}
//                   {order.tax && (
//                     <div className="flex justify-between items-center text-sm text-gray-400">
//                       <span>Tax:</span>
//                       <span>{formatCurrency(order.tax)}</span>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// // Individual Order Card Component
// const OrderCard = ({ order, onClick, onViewProducts }) => {
//   const customerName = order.customerName ||
//                       order.customer?.name ||
//                       order.customer?.firstName + ' ' + order.customer?.lastName ||
//                       'Unknown Customer';

//   const itemCount = Array.isArray(order.items) ? order.items.length :
//                    Array.isArray(order.products) ? order.products.length : 0;
//   const totalAmount = order.total || order.totalAmount || 0;

//   return (
//     <motion.div
//       variants={{
//         hidden: { y: 20, opacity: 0 },
//         show: { y: 0, opacity: 1 }
//       }}
//       whileHover={{ y: -5, scale: 1.02 }}
//       className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6 hover:border-[#D4AF37] transition-all duration-300 cursor-pointer group"
//       onClick={() => onClick?.(order)}
//     >
//       {/* Header */}
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex-1">
//           <h3 className="font-bold text-white text-lg flex items-center group-hover:text-[#D4AF37] transition-colors">
//             <User className="h-5 w-5 mr-2 text-[#D4AF37]" />
//             {customerName}
//           </h3>
//           <p className="text-gray-400 text-sm mt-1">
//             Order #{order.id || order._id?.slice(-8) || 'N/A'}
//           </p>
//         </div>
//         <div className="text-right">
//           <span className="text-xs text-gray-400 block">
//             <Clock className="h-3 w-3 inline mr-1" />
//             {formatDate(order.createdAt)}
//           </span>
//         </div>
//       </div>

//       {/* Status Badge */}
//       <div className="flex items-center justify-between mb-4">
//         <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(order.status)}`}>
//           <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></div>
//           {order.status?.charAt(0)?.toUpperCase() + order.status?.slice(1) || 'Unknown'}
//         </div>

//         <div className="text-xs text-gray-400">
//           {order.paymentStatus && (
//             <span className={`px-2 py-1 rounded ${
//               order.paymentStatus === 'paid' ? 'bg-green-900/30 text-green-400' :
//               order.paymentStatus === 'failed' ? 'bg-red-900/30 text-red-400' :
//               'bg-yellow-900/30 text-yellow-400'
//             }`}>
//               {order.paymentStatus}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Order Details */}
//       <div className="space-y-2 mb-4">
//         <div className="flex items-center text-gray-300">
//           <CreditCard className="h-4 w-4 mr-2 text-[#D4AF37]" />
//           <span className="text-sm capitalize">{order.paymentMethod || 'N/A'}</span>
//         </div>

//         <div className="flex items-center text-gray-300">
//           <Package className="h-4 w-4 mr-2 text-[#D4AF37]" />
//           <span className="text-sm">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
//         </div>

//         {order.customer?.address && (
//           <div className="flex items-start text-gray-300">
//             <MapPin className="h-4 w-4 mr-2 text-[#D4AF37] mt-0.5" />
//             <span className="text-sm line-clamp-2">
//               {typeof order.customer.address === 'string'
//                 ? order.customer.address
//                 : `${order.customer.address.street || ''}, ${order.customer.address.city || ''}`
//               }
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="pt-4 border-t border-white/10">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center text-white font-semibold">
//             <DollarSign className="h-4 w-4 mr-1 text-[#D4AF37]" />
//             {formatCurrency(totalAmount)}
//           </div>

//           <div className="flex space-x-2">
//             <button
//               className="p-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/20 transition-colors"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onViewProducts(order);
//               }}
//               title="View Products"
//             >
//               <Eye className="h-4 w-4" />
//             </button>
//             <button
//               className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 // Handle edit action
//               }}
//               title="Edit Order"
//             >
//               <Edit className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Main Order Management Component
// export default function OrderManagementPage() {
//   const [orders, setOrders] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentFilters, setCurrentFilters] = useState({});
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const fetchOrders = useCallback(async (filters = {}) => {
//     setIsLoading(true);
//     setError(null);
//     setCurrentFilters(filters);

//     try {
//       // Clean up empty filter values
//       const cleanFilters = Object.fromEntries(
//         Object.entries(filters).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
//       );

//       const params = new URLSearchParams(cleanFilters).toString();
//       const url = `/api/orders${params ? `?${params}` : ''}`;

//       console.log('Fetching orders with URL:', url);

//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success) {
//         setOrders(data.orders || []);
//       } else {
//         setError(data.error || "Failed to fetch orders");
//       }
//     } catch (err) {
//       console.error("Order fetch error:", err);
//       setError(`Failed to fetch orders: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchOrders();
//   }, [fetchOrders]);

//   const handleOrderClick = (order) => {
//     console.log('Order clicked:', order);
//     // Navigate to order details or open modal
//   };

//   const handleViewProducts = (order) => {
//     setSelectedOrder(order);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedOrder(null);
//   };

//   const handleRetry = () => {
//     fetchOrders(currentFilters);
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0A0A0A] p-4 md:p-8">
//       {/* Header */}
//       <header className="mb-8">
//         <motion.h1
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-2"
//         >
//           Order Management
//         </motion.h1>
//         <motion.p
//           initial={{ y: -10, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.1 }}
//           className="text-gray-400 mb-4"
//         >
//           Manage and track all customer orders
//         </motion.p>
//         <motion.div
//           initial={{ width: 0 }}
//           animate={{ width: "100%" }}
//           transition={{ delay: 0.2, duration: 0.8 }}
//           className="h-1 bg-gradient-to-r from-[#D4AF37] to-transparent rounded"
//         />
//       </header>

//       {/* Search Filters */}
//       <SearchFilters onFilterChange={fetchOrders} />

//       {/* Stats Bar */}
//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
//       >
//         <div className="bg-[#1A1A1A] rounded-lg border border-white/10 p-4">
//           <div className="text-[#D4AF37] text-2xl font-bold">{orders.length}</div>
//           <div className="text-gray-400 text-sm">Total Orders</div>
//         </div>
//         <div className="bg-[#1A1A1A] rounded-lg border border-white/10 p-4">
//           <div className="text-green-400 text-2xl font-bold">
//             {orders.filter(o => o.status === 'completed').length}
//           </div>
//           <div className="text-gray-400 text-sm">Completed</div>
//         </div>
//         <div className="bg-[#1A1A1A] rounded-lg border border-white/10 p-4">
//           <div className="text-yellow-400 text-2xl font-bold">
//             {orders.filter(o => o.status === 'pending').length}
//           </div>
//           <div className="text-gray-400 text-sm">Pending</div>
//         </div>
//         <div className="bg-[#1A1A1A] rounded-lg border border-white/10 p-4">
//           <div className="text-[#D4AF37] text-2xl font-bold">
//             {formatCurrency(orders.reduce((sum, order) => sum + (order.total || 0), 0))}
//           </div>
//           <div className="text-gray-400 text-sm">Total Revenue</div>
//         </div>
//       </motion.div>

//       {/* Orders Content */}
//       <div className="mt-6">
//         {isLoading ? (
//           <div className="flex flex-col justify-center items-center h-64">
//             <Loader2 className="animate-spin text-[#D4AF37] h-12 w-12 mb-4" />
//             <p className="text-gray-400">Loading orders...</p>
//           </div>
//         ) : error ? (
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-[#1A1A1A] rounded-xl p-8 border border-red-500/30 text-center"
//           >
//             <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
//             <h3 className="text-xl font-semibold text-white mb-2">Error Loading Orders</h3>
//             <p className="text-gray-400 mb-4">{error}</p>
//             <button
//               onClick={handleRetry}
//               className="px-6 py-2 bg-[#D4AF37] text-[#0A0A0A] rounded-lg hover:bg-[#D4AF37]/90 transition-all flex items-center justify-center mx-auto font-semibold"
//             >
//               <RefreshCw className="mr-2 h-4 w-4" /> Try Again
//             </button>
//           </motion.div>
//         ) : orders.length === 0 ? (
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-[#1A1A1A] rounded-xl p-8 border border-white/10 text-center"
//           >
//             <Search className="mx-auto h-16 w-16 text-[#D4AF37] mb-4" />
//             <h3 className="text-xl font-semibold text-white mb-2">No Orders Found</h3>
//             <p className="text-gray-400 mb-4">
//               {Object.keys(currentFilters).length > 0
//                 ? "Try adjusting your search filters"
//                 : "No orders have been placed yet"
//               }
//             </p>
//             {Object.keys(currentFilters).length > 0 && (
//               <button
//                 onClick={() => fetchOrders({})}
//                 className="px-4 py-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/20 transition-colors"
//               >
//                 Clear Filters
//               </button>
//             )}
//           </motion.div>
//         ) : (
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="show"
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//           >
//             <AnimatePresence>
//               {orders.map((order) => (
//                 <OrderCard
//                   key={order._id || order.id}
//                   order={order}
//                   onClick={handleOrderClick}
//                   onViewProducts={handleViewProducts}
//                 />
//               ))}
//             </AnimatePresence>
//           </motion.div>
//         )}
//       </div>

//       {/* Product Details Modal */}
//       <ProductDetailsModal
//         order={selectedOrder}
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//       />
//     </div>
//   );
// }
