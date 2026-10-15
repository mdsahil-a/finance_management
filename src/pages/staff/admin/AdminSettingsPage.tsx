import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { formatCurrency, formatPercent } from '../../../utils/formatters';
import { 
  Settings, 
  RotateCcw, 
  Save, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles,
  X
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoData } = useDemoData();

  const [goldPrice, setGoldPrice] = useState(settings.goldReferencePrice24K);
  const [interestRate, setInterestRate] = useState(settings.defaultAnnualInterestRate);
  const [ltvRatio, setLtvRatio] = useState(settings.maxLtvRatio);
  const [processingFee, setProcessingFee] = useState(settings.standardProcessingFeePercent);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      goldReferencePrice24K: Number(goldPrice),
      defaultAnnualInterestRate: Number(interestRate),
      maxLtvRatio: Number(ltvRatio),
      standardProcessingFeePercent: Number(processingFee),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setResetModalOpen(false);
    alert('Demo data has been successfully reset to initial factory state.');
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#701525] font-display">
          System Parameters & Demonstration Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Adjust illustrative loan formulas, daily reference bullion benchmarks, and manage sandbox state.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>System configuration updated and synced across all customer calculators and appraisal screens!</span>
        </div>
      )}

      {/* Settings Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2D8] shadow-sm space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-base font-bold text-gray-900">Illustrative Financial Parameters</h2>
          <p className="text-xs text-gray-500">These parameters directly drive the public calculator and appraiser valuations.</p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-gray-700">24K Reference Benchmark (₹ per gram)</label>
              <input
                type="number"
                min="1000"
                max="20000"
                value={goldPrice}
                onChange={(e) => setGoldPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-[#701525] font-bold text-sm"
                required
              />
              <span className="text-[10px] text-gray-400">Current active reference: {formatCurrency(goldPrice)}/g</span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Default Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.25"
                min="5"
                max="30"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-[#701525] font-bold text-sm"
                required
              />
              <span className="text-[10px] text-gray-400">Benchmark rate for illustrative repayments: {interestRate}% p.a.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-gray-700">Maximum Loan-to-Value (LTV)</label>
              <select
                value={ltvRatio}
                onChange={(e) => setLtvRatio(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-[#701525] font-bold"
              >
                <option value={0.75}>0.75 (75% - Maximum Regulatory Limit)</option>
                <option value={0.70}>0.70 (70% - Conservative)</option>
                <option value={0.65}>0.65 (65% - Lower Risk)</option>
                <option value={0.50}>0.50 (50% - Sovereign Conservative)</option>
              </select>
              <span className="text-[10px] text-gray-400">Applies to live eligible loan calculation</span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Standard Processing Fee (%)</label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="5"
                value={processingFee}
                onChange={(e) => setProcessingFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-[#701525] font-bold"
              />
              <span className="text-[10px] text-gray-400">Calculated on principal amount</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-md flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-4 h-4" />
            <span>Save System Parameters</span>
          </button>
        </form>
      </div>

      {/* Danger Zone: Reset Demo Data */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-200 shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Reset Prototype Demo Data</span>
            </h3>
            <p className="text-xs text-gray-600 mt-1 max-w-lg leading-relaxed">
              Restores sample customer applications for all five staff roles, reinstates default demo staff logins (ADMIN001, CASH001, WEIGHT001, ENTRY001, BRANCH001), resets transaction history, and clears testing records.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data to Initial State</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-[#E8E2D8] p-6 space-y-4 text-xs">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-gray-900">Are you sure you want to reset demo data?</h3>
              <p className="text-gray-500 leading-relaxed">
                This will erase any newly submitted test applications, custom assessments, and simulated disbursements recorded during this session, restoring the pristine seed state.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-5 py-2 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700"
              >
                Yes, Reset All Demo Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
