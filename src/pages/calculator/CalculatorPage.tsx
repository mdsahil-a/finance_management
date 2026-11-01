import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Calculator, PlusCircle, Scale, ShieldCheck } from 'lucide-react';
import { GoldPurity } from '../../types/finance';

export const CalculatorPage: React.FC = () => {
  const { settings, setIsNewLoanModalOpen } = useFinance();

  const [weight, setWeight] = useState('20');
  const [purity, setPurity] = useState<GoldPurity>('22K');
  const [customRate, setCustomRate] = useState('');
  const [maxLoanPercent, setMaxLoanPercent] = useState(settings.maxLoanPercent.toString());
  const [monthlyRate, setMonthlyRate] = useState(settings.defaultMonthlyInterest.toString());

  const numWeight = parseFloat(weight) || 0;
  const activeRate = customRate 
    ? parseFloat(customRate) || 0
    : purity === '24K' 
    ? settings.goldRate24K 
    : purity === '22K' 
    ? settings.goldRate22K 
    : settings.goldRate18K;

  const totalGoldValue = Math.round(numWeight * activeRate);
  const numLoanPct = parseFloat(maxLoanPercent) || 75;
  const maxLoanAmount = Math.round((totalGoldValue * numLoanPct) / 100);

  const numMonthlyRate = parseFloat(monthlyRate) || 1.5;
  const monthlyInterestRupees = Math.round((maxLoanAmount * numMonthlyRate) / 100);
  const sixMonthsInterest = monthlyInterestRupees * 6;
  const twelveMonthsInterest = monthlyInterestRupees * 12;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-amber-100/80 text-amber-800 flex items-center justify-center border border-amber-200/60">
            <Calculator className="w-5 h-5 text-amber-700" />
          </div>
          <span>Gold Appraisal & Loan Calculator</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Instant valuation of gold ornaments, statutory 75% loan cap estimate, and monthly interest calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Input Panel */}
        <div className="md:col-span-6 bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-600" />
              <span>Ornaments Input</span>
            </h3>
            <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-200/60">Live Rates Applied</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Net Gold Weight (in Grams) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 25"
                className="w-full px-4 py-2.5 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-900/10 rounded-2xl text-base text-zinc-900 font-extrabold outline-none transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">
                grams net
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 mt-1.5 block">Weight after deducting stones, beads, and wax.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Gold Purity Standard
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['22K', '24K', '18K'] as GoldPurity[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPurity(p)}
                  className={`py-2 px-3 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    purity === p
                      ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {p} {p === '22K' ? '(916)' : p === '24K' ? '(Pure)' : '(750)'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                Gold Rate (₹ / g)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  value={customRate || activeRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 rounded-xl text-xs font-extrabold text-zinc-900 outline-none transition-all"
                />
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">Live counter rate</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                Loan Limit (LTV %)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={maxLoanPercent}
                  onChange={(e) => setMaxLoanPercent(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 rounded-xl text-xs font-extrabold text-zinc-900 outline-none transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-bold">%</span>
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">Statutory standard 75%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Monthly Interest Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 rounded-xl text-xs font-extrabold text-zinc-900 outline-none transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-bold">% / mo</span>
            </div>
            <span className="text-[10px] text-zinc-400 mt-1 block">Annual equivalent: {(numMonthlyRate * 12).toFixed(1)}% p.a.</span>
          </div>

        </div>

        {/* Output Panel */}
        <div className="md:col-span-6 space-y-4">
          
          {/* Main Result Card */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Appraisal Summary & Recommended Loan
            </span>

            <div>
              <span className="text-xs text-zinc-500 block">Total Gold Market Value ({numWeight}g {purity}):</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                ₹{totalGoldValue.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-5 bg-gradient-to-br from-amber-50/60 via-amber-50/30 to-transparent rounded-2xl border border-amber-200/70">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-zinc-700 uppercase tracking-tight">
                  Max Safe Loan Amount ({numLoanPct}% LTV):
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                  Recommended Cap
                </span>
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-900 block mt-1 tracking-tight">
                ₹{maxLoanAmount.toLocaleString('en-IN')}
              </span>
              <p className="text-xs text-zinc-500 mt-1">
                Safe loan disbursement under statutory gold security margin.
              </p>
            </div>

            {/* Interest Breakdown */}
            <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
              <div className="p-3 bg-zinc-50/80 rounded-2xl border border-zinc-200/60">
                <span className="text-[10px] text-zinc-500 block font-semibold">1 Month Interest</span>
                <span className="font-extrabold text-emerald-700 text-sm block mt-0.5">₹{monthlyInterestRupees.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-zinc-50/80 rounded-2xl border border-zinc-200/60">
                <span className="text-[10px] text-zinc-500 block font-semibold">6 Months Interest</span>
                <span className="font-extrabold text-zinc-900 text-sm block mt-0.5">₹{sixMonthsInterest.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-zinc-50/80 rounded-2xl border border-zinc-200/60">
                <span className="text-[10px] text-zinc-500 block font-semibold">12 Months Interest</span>
                <span className="font-extrabold text-zinc-900 text-sm block mt-0.5">₹{twelveMonthsInterest.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => setIsNewLoanModalOpen(true)}
              className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-full text-xs shadow-xs transition-all flex items-center justify-center gap-2 group cursor-pointer mt-3"
            >
              <span>Give New Loan with these Values</span>
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <PlusCircle className="w-3.5 h-3.5 text-white" />
              </div>
            </button>
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 text-xs text-zinc-600 space-y-2 shadow-xs">
            <h4 className="font-bold text-zinc-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Appraiser Lending Guidelines:</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-zinc-500 text-[11px] leading-relaxed">
              <li>Always deduct stone weights and wax filling before noting net weight.</li>
              <li>Verify hallmark 916 stamping or conduct acid touchstone test for 22K.</li>
              <li>Never sanction above 75% loan-to-value to protect against gold market price dips.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
