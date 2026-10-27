import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Calculator, PlusCircle, Coins, Sparkles, ArrowRight } from 'lucide-react';
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
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Calculator className="w-6 h-6 text-amber-400" />
          <span>Gold Loan Value Calculator</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Quickly calculate gold market value, recommended loan amount, and monthly interest
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Input Panel */}
        <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Enter Gold Details:
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Net Gold Weight (in Grams)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 25"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-base text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                grams
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Gold Purity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['22K', '24K', '18K'] as GoldPurity[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPurity(p)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    purity === p
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {p} {p === '22K' ? '(916)' : p === '24K' ? '(Pure)' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Gold Rate (₹ / g)
              </label>
              <input
                type="number"
                value={customRate || activeRate}
                onChange={(e) => setCustomRate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Live shop rate applied</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Max Loan Allowed (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={maxLoanPercent}
                  onChange={(e) => setMaxLoanPercent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">%</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Standard 75% limit</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Monthly Interest Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">% / month</span>
            </div>
          </div>

        </div>

        {/* Results Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Calculation Results:</span>
            </h3>

            {/* Total Gold Value */}
            <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-400 block">Total Gold Value Today:</span>
              <span className="text-2xl font-black text-white tracking-tight">
                ₹{totalGoldValue.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {numWeight}g × ₹{activeRate.toLocaleString('en-IN')}/g ({purity})
              </span>
            </div>

            {/* Recommended Loan */}
            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <span className="text-xs text-emerald-300 font-bold block">
                Recommended Max Loan ({numLoanPct}%):
              </span>
              <span className="text-3xl font-black text-emerald-400 tracking-tight">
                ₹{maxLoanAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-300 mt-1 block">
                Maximum safe amount to lend customer
              </span>
            </div>

            {/* Monthly Interest Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-800/50 rounded-lg">
                <span className="text-slate-400">Monthly Interest:</span>
                <span className="font-bold text-amber-300">
                  ₹{monthlyInterestRupees.toLocaleString('en-IN')} / month
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-800/50 rounded-lg">
                <span className="text-slate-400">6 Months Total Interest:</span>
                <span className="font-bold text-slate-200">
                  ₹{sixMonthsInterest.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-800/50 rounded-lg">
                <span className="text-slate-400">12 Months Total Interest:</span>
                <span className="font-bold text-slate-200">
                  ₹{twelveMonthsInterest.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={() => setIsNewLoanModalOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Give Loan with this Gold</span>
          </button>
        </div>

      </div>

    </div>
  );
};
