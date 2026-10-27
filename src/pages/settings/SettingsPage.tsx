import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Settings, Save, RotateCcw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ShopSettings } from '../../types/finance';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetToDefaultData } = useFinance();

  const [formData, setFormData] = useState<ShopSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...formData,
      goldRate24K: Number(formData.goldRate24K) || 7450,
      goldRate22K: Number(formData.goldRate22K) || 6850,
      goldRate18K: Number(formData.goldRate18K) || 5600,
      defaultMonthlyInterest: Number(formData.defaultMonthlyInterest) || 1.5,
      maxLoanPercent: Number(formData.maxLoanPercent) || 75,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          <span>Shop & Gold Rates Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure business details, live gold rates per gram, and default interest rules
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Business Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Business & Receipt Information:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Shop / Business Name *
              </label>
              <input
                type="text"
                required
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Contact Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.shopPhone}
                onChange={(e) => setFormData({ ...formData, shopPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Shop Address (Printed on Slips)
              </label>
              <input
                type="text"
                value={formData.shopAddress}
                onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Receipt Footer Notice / Terms
              </label>
              <textarea
                rows={2}
                value={formData.receiptFooterNote}
                onChange={(e) => setFormData({ ...formData, receiptFooterNote: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Today's Gold Rates */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Today's Gold Rates (₹ per gram):
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                24K Pure Gold Rate (₹ / g)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={formData.goldRate24K}
                  onChange={(e) => setFormData({ ...formData, goldRate24K: Number(e.target.value) })}
                  className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                22K (916) Gold Rate (₹ / g)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={formData.goldRate22K}
                  onChange={(e) => setFormData({ ...formData, goldRate22K: Number(e.target.value) })}
                  className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                18K Gold Rate (₹ / g)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={formData.goldRate18K}
                  onChange={(e) => setFormData({ ...formData, goldRate18K: Number(e.target.value) })}
                  className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Loan Rules */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Loan Interest & Lending Rules:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Default Monthly Interest Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formData.defaultMonthlyInterest}
                  onChange={(e) => setFormData({ ...formData, defaultMonthlyInterest: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  % / month
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Usually 1.5% or 2% per month</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Max Loan Allowed Against Gold (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.maxLoanPercent}
                  onChange={(e) => setFormData({ ...formData, maxLoanPercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  %
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Standard safety limit is 75%</span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          {savedSuccess ? (
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Settings successfully saved!
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              Changes apply instantly across all new loans & receipts
            </span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

        {/* Danger Zone: Reset Demo Data */}
        <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-rose-300">Reset Demo Data</h4>
              <p className="text-[11px] text-slate-400">
                Clear all loans, payments, and restored default sample dataset
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetToDefaultData}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

      </form>

    </div>
  );
};
