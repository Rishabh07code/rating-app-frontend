import React, { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";

function StoreModal({ isOpen, onClose }) {
  const { addStore, availableOwners = [], fetchAvailableOwners } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch available owners when modal opens
  useEffect(() => {
    if (isOpen && fetchAvailableOwners) {
      fetchAvailableOwners();
    }
  }, [isOpen, fetchAvailableOwners]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Name validation: 20-60 characters
    if (!formData.name || formData.name.length < 20 || formData.name.length > 60) {
      return "Store name must be between 20 and 60 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      return "Please enter a valid email address";
    }

    // Address validation: max 400 characters, required
    if (!formData.address) {
      return "Address is required";
    }
    if (formData.address.length > 400) {
      return "Address must not exceed 400 characters";
    }

    // Owner validation
    if (!formData.ownerId) {
      return "Please select a store owner";
    }

    return null;
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const res = await addStore(formData);

    setLoading(false);
    if (res.success) {
      onClose();
      // Reset form
      setFormData({
        name: '', email: '', address: '', ownerId: ''
      });
    } else {
      setError(res.message);
    }
  };

  // Use the availableOwners from context (no need to filter here)
  const owners = availableOwners || [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900">Add New Store</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="overflow-y-auto pr-2 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Store Name</label>
            <input
              name="name" value={formData.name} onChange={handleChange}
              className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-600 focus:ring-indigo-600/20"
              placeholder="e.g. My Awesome Store Name Here" type="text"
            />
            <p className="text-[10px] text-slate-400">20-60 characters required</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Store Email (Optional)</label>
            <input
              name="email" value={formData.email} onChange={handleChange}
              className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-600 focus:ring-indigo-600/20"
              placeholder="store@example.com" type="email"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Store Address</label>
            <textarea
              name="address" value={formData.address} onChange={handleChange}
              className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-600 focus:ring-indigo-600/20"
              placeholder="123 Main St, City, State, ZIP" 
              rows="3"
            />
            <p className="text-[10px] text-slate-400">Max 400 characters</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Store Owner</label>
            <select
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-600 focus:ring-indigo-600/20"
            >
              <option value="">Select a store owner</option>
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
            {owners.length === 0 && (
              <p className="text-xs text-amber-600">No available store owners. Please create a Store Owner user first.</p>
            )}
          </div>
        </div>

        <div className="pt-4 mt-auto flex justify-end gap-3 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={loading || owners.length === 0}
            className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm disabled:opacity-70 flex items-center gap-2"
          >
            {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
            Create Store
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoreModal;
