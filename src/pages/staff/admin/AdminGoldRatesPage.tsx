import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { useStaffSession } from '../../../context/StaffSessionContext';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { 
  Scale, 
  TrendingUp, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

export const AdminGoldRatesPage: React.FC = () => {
  const { goldRates, updateGoldRates, settings } = useDemoData();
  const { currentStaff } = useStaffSession();

  const currentRateRecord = goldRates[0] || {
    rate24K: 7450,
    rate22K: 6829,
    rate20K: 6208,
    rate18K: 5588,
    effectiveDate: new Date().toISOString().split('T')[0],
  };

  const [input24K, setInput24K] = useState(currentRateRecord.rate24K);
  const [successMsg, setSuccessMsg] = useState(false);

  // Live auto-calculated derived purities
  const derived22K = Math.round((input24K * 22) / 24);
  const derived20K = Math.round((input24K * 20) / 24);
  const derived18K = Math.round((input24K * 18) / 24);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStaff) return;
    if (input24K <= 1000) {
      alert('Enter a realistic gold benchmark price per gram (e.g. ₹7,450).');
      return;
    }

    updateGoldRates(
      {
        rate24K: input24K,
        rate22K: derived22K,
        rate20K: derived20K,
        rate18K: derived18K,
      },
      currentStaff
    );

    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const setPreset = (delta: number) => {
    setInput24K((prev) => Math.max(3000, prev + delta));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#C9A45C]" />
            <h1 className="text-2xl font-black text-[#701525] font-display">
              Gold Benchmark Rates Configuration
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Configure system-wide benchmark gold rates used across appraisal calculations, loan eligibility, and customer calculators.
          </p>
        </div>
      </div>

      {/* Current Active Benchmark Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#C9A45C]/40 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#C9A45C]/10 rounded-bl-full pointer-events-none" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#701525] block">
            24 Karat Fine Gold (99.9%)
          </span>
          <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            {formatCurrency(currentRateRecord.rate24K)}
            <span className="text-xs font-normal text-gray-500"> / g</span>
          </p>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">
            Primary Base Benchmark
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
            22 Karat Standard (91.6%)
          </span>
          <p className="text-2xl sm:text-3xl font-black text-[#701525] mt-1">
            {formatCurrency(currentRateRecord.rate22K)}
            <span className="text-xs font-normal text-gray-500"> / g</span>
          </p>
          <span className="text-[10px] text-gray-400 block mt-1">
            91.67% of 24K rate
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
            20 Karat Jewellery (83.3%)
          </span>
          <p className="text-2xl sm:text-3xl font-black text-gray-800 mt-1">
            {formatCurrency(currentRateRecord.rate20K)}
            <span className="text-xs font-normal text-gray-500"> / g</span>
          </p>
          <span className="text-[10px] text-gray-400 block mt-1">
            83.33% of 24K rate
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
            18 Karat Hallmarked (75.0%)
          </span>
          <p className="text-2xl sm:text-3xl font-black text-gray-800 mt-1">
            {formatCurrency(currentRateRecord.rate18K)}
            <span className="text-xs font-normal text-gray-500"> / g</span>
          </p>
          <span className="text-[10px] text-gray-400 block mt-1">
            75.00% of 24K rate
          </span>
        </div>
      </div>

      {/* Rate Updater Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-md space-y-6">
        <div className="flex items-center justify-between border-b pb-3 border-gray-100">
          <div>
            <h3 className="text-base font-bold text-[#701525]">Update Daily Market Benchmark</h3>
            <p className="text-xs text-gray-500">
              Modifying the base 24K rate automatically recalculates all lower karat appraisal brackets.
            </p>
          </div>
          {successMsg && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Benchmark Rates Updated!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 block">
                Enter Base 24K Benchmark Rate (INR per gram)
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-3 text-gray-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={input24K}
                    onChange={(e) => setInput24K(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 text-lg font-bold text-gray-900 focus:border-[#701525] outline-none"
                    step="10"
                    min="3000"
                    max="15000"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-sm shrink-0"
                >
                  Publish New Rate
                </button>
              </div>

              {/* Quick simulation buttons */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-400 text-[11px] mr-1">Quick adjust:</span>
                <button
                  type="button"
                  onClick={() => setPreset(-50)}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px]"
                >
                  -₹50
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(-20)}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px]"
                >
                  -₹20
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(20)}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px]"
                >
                  +₹20
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(50)}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px]"
                >
                  +₹50
                </button>
              </div>
            </div>

            {/* Derived preview table */}
            <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E2D8] space-y-2 text-xs">
              <span className="font-bold text-[#701525] block text-[11px] uppercase tracking-wider">
                Instant Derived Calculation Preview
              </span>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 block">22K (91.6%)</span>
                  <span className="font-bold text-gray-900 text-sm">₹{derived22K}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 block">20K (83.3%)</span>
                  <span className="font-bold text-gray-900 text-sm">₹{derived20K}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 block">18K (75%)</span>
                  <span className="font-bold text-gray-900 text-sm">₹{derived18K}</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 pt-1">
                All future loan calculations and appraiser forms will instantly adopt these updated rates. Existing finalized loan accounts remain anchored to their agreed historical valuation terms.
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Historical Gold Benchmark Register */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Historical Rate Audit Register</h3>
            <p className="text-xs text-gray-500">Record of daily benchmark rates published by administrators</p>
          </div>
          <span className="text-xs text-gray-400 font-mono">{goldRates.length} entries recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Effective Date</th>
                <th className="py-2.5 px-3">24K Benchmark</th>
                <th className="py-2.5 px-3">22K Rate</th>
                <th className="py-2.5 px-3">20K Rate</th>
                <th className="py-2.5 px-3">18K Rate</th>
                <th className="py-2.5 px-3">Published By</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {goldRates.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/60">
                  <td className="py-3 px-3 font-mono font-bold text-gray-900">{r.effectiveDate}</td>
                  <td className="py-3 px-3 font-bold text-[#701525]">{formatCurrency(r.rate24K)}/g</td>
                  <td className="py-3 px-3 font-semibold text-gray-800">{formatCurrency(r.rate22K)}/g</td>
                  <td className="py-3 px-3 text-gray-700">{formatCurrency(r.rate20K)}/g</td>
                  <td className="py-3 px-3 text-gray-700">{formatCurrency(r.rate18K)}/g</td>
                  <td className="py-3 px-3 font-mono text-gray-600">{r.updatedBy}</td>
                  <td className="py-3 px-3 text-gray-400 text-[11px]">{formatDateTime(r.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
