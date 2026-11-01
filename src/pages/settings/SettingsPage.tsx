import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Settings, Save, RotateCcw, CheckCircle2, ShieldAlert, Coins, Building, Percent } from 'lucide-react';
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
        <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-amber-100/80 text-amber-800 flex items-center justify-center border border-amber-200/60">
            <Settings className="w-5 h-5 text-amber-700" />
          </div>
          <span>Shop & Gold Rates Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Configure business details, live market gold rates per gram, and default lending rules.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Shop settings and live gold rates updated successfully across all counters!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Business Details */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3.5 border-b border-zinc-100">
            <Building className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Business & Receipt Information:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1.5">
                Shop / Business Name *
              </label>
              <input
                type="text"
                required
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-900/10 rounded-2xl text-xs text-zinc-900 font-extrabold outline-none transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1.5">
                Contact Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.shopPhone}
                onChange={(e) => setFormData({ ...formData, shopPhone: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-900/10 rounded-2xl text-xs text-zinc-900 outline-none transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-zinc-700 mb-1.5">
                Shop Address (Printed on Slips & Vouchers)
              </label>
              <input
                type="text"
                value={formData.shopAddress}
                onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-900/10 rounded-2xl text-xs text-zinc-900 outline-none transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-zinc-700 mb-1.5">
                Receipt Footer Notice / Terms of Collateral
              </label>
              <textarea
                rows={2}
                value={formData.receiptFooterNote}
                onChange={(e) => setFormData({ ...formData, receiptFooterNote: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-900/10 rounded-2xl text-xs text-zinc-900 outline-none transition-all leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Today's Gold Rates */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3.5 border-b border-zinc-100">
            <Coins className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Counter Gold Rates (₹ per gram):
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1.5">
                24K Pure Gold Rate (₹ / g)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  value={formData.goldRate24K}
                  onChange={(e) => setFormData({ ...formData, goldRate24K: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2.5 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 rounded-2xl text-xs text-zinc-900 font-extrabold outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1.5">
                22K (916) Hallmark Rate (₹ / g)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  value={formData.goldRate22K}
                  onChange={(e) => setFormData({ ...formData, goldRate22K: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2.5 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 rounded-2xl text-xs text-zinc-900 font-extrabold outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1.5">
                18K Gold Rate (₹ / g)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  value={formData.goldRate18K}
                  onChange={(e) => setFormData({ ...formData, goldRate18K: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2.5 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 rounded-2xl text-xs text-zinc-900 font-extrabold outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Default Lending Rules */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3.5 border-b border-zinc-100">
            <Percent className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Default Loan Calculation Policies:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 mb-1.5">
                Default Monthly Interest Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={formData.defaultMonthlyInterest}
                  onChange={(e) => setFormData({ ...formData, defaultMonthlyInterest: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 rounded-2xl text-xs text-zinc-900 font-extrabold outline-none transition-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs">% / mo</span>
              </div>
              <span className="text-[11px] text-zinc-400 mt-1.5 block">Standard 1.5% per month (18% p.a.)</span>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1.5">
                Maximum Loan to Value (LTV %)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.maxLoanPercent}
                  onChange={(e) => setFormData({ ...formData, maxLoanPercent: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 rounded-2xl text-xs text-zinc-900 font-extrabold outline-none transition-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs">%</span>
              </div>
              <span className="text-[11px] text-zinc-400 mt-1.5 block">Maximum 75% statutory guideline for gold loans</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-full shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>Save All Settings</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all loans, customer records, and ledger entries back to clean sample defaults?')) {
                resetToDefaultData();
                setFormData({ ...settings });
                alert('Sample records reset successfully.');
              }
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-zinc-100 hover:bg-rose-50 text-zinc-600 hover:text-rose-700 border border-zinc-200 hover:border-rose-200 rounded-full text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

      </form>

    </div>
  );
};
