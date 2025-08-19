// app/(dashboard)/categories/CategoryModal.jsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderPlus, Edit3 } from "lucide-react";

export default function CategoryModal({ 
  open, 
  onClose, 
  onSuccess, 
  category, 
  parentId,
  categories
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("active");
  const [selectedParent, setSelectedParent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setStatus(category.status);
      setSelectedParent(category.parent || null);
    } else {
      setName("");
      setSlug("");
      setStatus("active");
      setSelectedParent(parentId || null);
    }
  }, [category, parentId, open]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    if (!category && !slug) {
      setSlug(generateSlug(newName));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const categoryData = {
      name,
      slug,
      status,
      parent: selectedParent === "root" ? null : selectedParent
    };

    try {
      const url = category 
        ? `/api/categories/${category._id}`
        : "/api/categories";
      
      const method = category ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Operation failed:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative bg-[#121212] text-white rounded-2xl shadow-2xl w-full max-w-md border border-white/10"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 p-5">
              <h2 className="text-lg font-semibold flex items-center space-x-2 text-[#D4AF37]">
                {category ? (
                  <>
                    <Edit3 className="w-5 h-5" />
                    <span>Edit Category</span>
                  </>
                ) : (
                  <>
                    <FolderPlus className="w-5 h-5" />
                    <span>Add New Category</span>
                  </>
                )}
              </h2>
              <button 
                onClick={onClose} 
                className="p-1 rounded hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded border border-red-600/40">
                  {error}
                </div>
              )}

              {/* Category Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                  required
                />
              </div>

              {/* Slug */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                  required
                />
              </div>

              {/* Parent Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Parent Category
                </label>
                <select
                  value={selectedParent || "root"}
                  onChange={(e) => setSelectedParent(e.target.value === "root" ? null : e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                >
                  <option value="root">Root (Top Level)</option>
                  {categories
                    .filter(cat => !category || cat._id !== category._id)
                    .map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Status */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#c19d2d] disabled:opacity-50 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Processing..." : (category ? "Update" : "Create")}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
