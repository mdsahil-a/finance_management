import React, { useState } from 'react';
import { useCustomerSession } from '../../context/CustomerSessionContext';
import { User, Mail, Phone, MapPin, Check, Save } from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const { currentCustomer, updateCustomerProfile } = useCustomerSession();

  const [fullName, setFullName] = useState(currentCustomer?.fullName || '');
  const [email, setEmail] = useState(currentCustomer?.email || '');
  const [mobile, setMobile] = useState(currentCustomer?.mobile || '');
  const [city, setCity] = useState(currentCustomer?.city || '');
  const [state, setState] = useState(currentCustomer?.state || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
      fullName,
      email,
      mobile,
      city,
      state,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2D8] shadow-md max-w-2xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900">Demo Customer Profile</h2>
        <p className="text-xs text-gray-500">Edit your simulation profile details. Changes are persisted in browser LocalStorage.</p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile information updated and saved in LocalStorage!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-gray-700">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-700">Mobile Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-gray-700">City</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-700">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-md flex items-center justify-center gap-2 mt-4"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>
      </form>
    </div>
  );
};
