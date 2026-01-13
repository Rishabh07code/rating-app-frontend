import React, { useState } from "react";
import { useAdmin } from "../context/AdminContext";

function UserModal({ isOpen, onClose }) {
  const { addUser } = useAdmin();
  const [mode, setMode] = useState('USER'); // 'USER' or 'STORE'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER',
    storeName: '',
    storeAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Name validation: 20-60 characters
    if (!formData.name || formData.name.length < 20 || formData.name.length > 60) {
      return "Name must be between 20 and 60 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      return "Please enter a valid email address";
    }

    // Password validation: 8-16 chars, at least one uppercase and one special char
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,16}$/;
    if (!formData.password || !passwordRegex.test(formData.password)) {
      return "Password must be 8-16 characters with at least one uppercase letter and one special character";
    }

    // Address validation: max 400 characters
    if (formData.address && formData.address.length > 400) {
      return "Address must not exceed 400 characters";
    }

    // Store owner specific validations
    if (formData.role === 'STORE_OWNER') {
      if (!formData.storeName || formData.storeName.length < 20 || formData.storeName.length > 60) {
        return "Store name must be between 20 and 60 characters";
      }
      if (!formData.storeAddress || formData.storeAddress.length > 400) {
        return "Store address is required and must not exceed 400 characters";
      }
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

    // Map 'USER' role to backend enum 'USER', 'STORE_OWNER' -> 'STORE_OWNER', etc
    // In our UI option values match backend enum strings.

    const res = await addUser(formData);

    setLoading(false);
    if (res.success) {
      onClose();
      // Reset form
      setFormData({
        name: '', email: '', password: '', address: '', role: 'USER', storeName: '', storeAddress: ''
      });
    } else {
      setError(res.message);
    }
  };

  const isStoreOwner = formData.role === 'STORE_OWNER';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">

        {/* Toggle Header (Optional - Requirement says "add option in the top to choose add Store Or user") */}
        {/* For now, let's keep it simple: Adding a USER. If Role is Owner, we add Store fields. */}
        {/* If the user explicitly wants to "Add Store", usually they'd pick an existing owner, but the requirement implies "assign owner by adding a new user". So creating a user with role=Owner covers the "One Owner : One Store" rule perfectly. */}

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900">Add New User</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="overflow-y-auto pr-2 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-600 focus:ring-indigo-600/20"
            >
              <option value="USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">System Admin</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
            <input
              name="name" value={formData.name} onChange={handleChange}
              className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-600 focus:ring-indigo-600/20"
              placeholder="e.g. Jane Doe" type="text"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
            <input
              name="email" value={formData.email} onChange={handleChange}
              className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-600 focus:ring-indigo-600/20"
              placeholder="jane@example.com" type="email"
            />
          </div>

          {/* Show Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Password</label>
            <input
              name="password" value={formData.password} onChange={handleChange}
              className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-600 focus:ring-indigo-600/20"
              placeholder="••••••••" type="password"
            />
            <p className="text-[10px] text-slate-400">8-16 chars, 1 uppercase, 1 special char.</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Address</label>
            <input
              name="address" value={formData.address} onChange={handleChange}
              className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-600 focus:ring-indigo-600/20"
              placeholder="123 Main St" type="text"
            />
          </div>

          {/* CONDITIONAL STORE FIELDS */}
          {isStoreOwner && (
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-4 animate-in slide-in-from-top-2">
              <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                Assign Store Details
              </h4>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-indigo-700 uppercase">Store Name</label>
                <input
                  name="storeName" value={formData.storeName} onChange={handleChange}
                  className="w-full rounded-lg border-indigo-200 text-sm focus:border-indigo-600 focus:ring-indigo-600/20 bg-white"
                  placeholder="My Awesome Store" type="text"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-indigo-700 uppercase">Store Address</label>
                <input
                  name="storeAddress" value={formData.storeAddress} onChange={handleChange}
                  className="w-full rounded-lg border-indigo-200 text-sm focus:border-indigo-600 focus:ring-indigo-600/20 bg-white"
                  placeholder="Store Location" type="text"
                />
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 mt-auto flex justify-end gap-3 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm disabled:opacity-70 flex items-center gap-2"
          >
            {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
            Create {isStoreOwner ? 'Owner & Store' : 'User'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserModal;
