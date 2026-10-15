import React, { useState } from 'react';
import { GoldPurity, RepaymentMethod } from '../../types';
import { useDemoData } from '../../context/DemoDataContext';
import { calculateGoldLoanMetrics } from '../../utils/calculator';
import { formatCurrency, formatGrams } from '../../utils/formatters';
import { 
  Calculator, 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Percent
} from 'lucide-react';

interface GoldLoanCalculatorProps {
  initialWeight?: number;
  initialPurity?: GoldPurity;
  onApplyWithValues?: (values: { weight: number; purity: GoldPurity; amount: number; tenure: number; method: RepaymentMethod }) => void;
  isCompact?: boolean;
}

export const GoldLoanCalculator: React.FC<GoldLoanCalculatorProps> = ({
  initialWeight = 40,
  initialPurity = '22K',
  onApplyWithValues,
  isCompact = false,
}) => {
  const { settings } = useDemoData();

  const [weight, setWeight] = useState<number>(initialWeight);
  const [purity, setPurity] = useState<GoldPurity>(initialPurity);
  const [referencePrice, setReferencePrice] = useState<number>(settings.goldReferencePrice24K);
  const [ltvRatio, setLtvRatio] = useState<number>(settings.maxLtvRatio);
  const [annualRate, setAnnualRate] = useState<number>(settings.defaultAnnualInterestRate);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [repaymentMethod, setRepaymentMethod] = useState<RepaymentMethod>('Simple Interest');

  const purities: GoldPurity[] = ['18K', '20K', '22K', '24K'];
  const tenurePresets = [3, 6, 9, 12, 18, 24, 36];

  // Calculate live results
  const results = calculateGoldLoanMetrics({
    grossWeight: weight,
    stoneWeight: 0,
    otherNonGoldWeight: 0,
    purity,
    referencePrice24K: referencePrice,
    ltvRatio,
    tenureMonths,
    annualInterestRate: annualRate,
    repaymentMethod,
  });

  const handleReset = () => {
    setWeight(40);
    setPurity('22K');
    setReferencePrice(settings.goldReferencePrice24K);
    setLtvRatio(settings.maxLtvRatio);
    setAnnualRate(settings.defaultAnnualInterestRate);
    setTenureMonths(12);
    setRepaymentMethod('Simple Interest');
  };

  const handleFindBranch = () => {
    if (onApplyWithValues) {
      onApplyWithValues({
        weight,
        purity,
        amount: Math.round(results.estimatedEligibleAmount),
        tenure: tenureMonths,
        method: repaymentMethod,
      });
    } else {
      window.location.assign('/branches');
    }
  };

  return (
    <div className={`bg-white rounded-3xl shadow-xl border border-[#E8E2D8] overflow-hidden ${isCompact ? 'p-6' : 'p-6 sm:p-8 lg:p-10'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#E8E2D8] gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF3E0] text-[#701525] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>Interactive Financial Tool</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#701525] font-display">
            Gold Loan Eligibility & EMI Calculator
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Calculate your estimated gold valuation and loan entitlement in real time with transparent illustrative benchmarks.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#701525] px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#701525] transition-colors self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Calculator</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gold Weight */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Gold Weight (in Grams)
              </label>
              <span className="text-sm font-black text-[#701525] bg-[#FAF8F3] px-3 py-1 rounded-lg border border-[#E8E2D8]">
                {formatGrams(weight)}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="500"
              step="1"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#A71930]"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>5g</span>
              <span>100g</span>
              <span>250g</span>
              <span>500g</span>
            </div>
          </div>

          {/* Gold Purity */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">
              Gold Purity (Karat)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {purities.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPurity(p)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    purity === p
                      ? 'bg-[#701525] text-white border-[#701525] shadow-sm ring-2 ring-[#C9A45C]'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {p}
                  <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                    {p === '24K' ? '99.9%' : p === '22K' ? '91.6%' : p === '20K' ? '83.3%' : '75.0%'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Reference 24K Price & LTV (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center justify-between mb-1.5">
                <span>24K Benchmark (₹/g)</span>
                <span className="text-[10px] text-gray-400">Illustrative</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-bold">₹</span>
                <input
                  type="number"
                  value={referencePrice}
                  onChange={(e) => setReferencePrice(Math.max(1000, Number(e.target.value)))}
                  className="w-full pl-7 pr-3 py-2 text-xs font-bold text-gray-800 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#701525] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center justify-between mb-1.5">
                <span>Loan To Value (LTV)</span>
                <span className="text-[10px] text-emerald-700 font-semibold">{Math.round(ltvRatio * 100)}%</span>
              </label>
              <select
                value={ltvRatio}
                onChange={(e) => setLtvRatio(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-semibold text-gray-800 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#701525] outline-none"
              >
                <option value={0.75}>75% (Maximum Regulatory Cap)</option>
                <option value={0.70}>70% (Conservative)</option>
                <option value={0.65}>65% (Lower Interest Tier)</option>
                <option value={0.50}>50% (Lowest Interest Tier)</option>
              </select>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Loan Tenure (Months)
              </label>
              <span className="text-xs font-bold text-[#701525] bg-[#FAF8F3] px-2.5 py-1 rounded-lg border border-[#E8E2D8]">
                {tenureMonths} Months
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tenurePresets.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTenureMonths(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    tenureMonths === t
                      ? 'bg-[#A71930] text-white border-[#A71930]'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {t}M
                </button>
              ))}
            </div>
          </div>

          {/* Repayment Calculation Method */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">
              Repayment Method Illustration
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRepaymentMethod('Simple Interest')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  repaymentMethod === 'Simple Interest'
                    ? 'border-[#701525] bg-[#701525]/5 text-[#701525] ring-1 ring-[#701525]'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <p className="text-xs font-bold">Simple Interest / Bullet</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Pay monthly interest; repay principal at maturity.</p>
              </button>

              <button
                type="button"
                onClick={() => setRepaymentMethod('Reducing Balance EMI')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  repaymentMethod === 'Reducing Balance EMI'
                    ? 'border-[#701525] bg-[#701525]/5 text-[#701525] ring-1 ring-[#701525]'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <p className="text-xs font-bold">Reducing Balance EMI</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Fixed equated monthly installments (Principal + Interest).</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Panel (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#701525] via-[#500e1b] to-[#3a0812] text-white p-6 sm:p-8 shadow-xl border border-[#C9A45C]/30 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A45C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#FFE082]">
                Illustrative Loan Estimate
              </span>
              <p className="text-xs text-white/70 mt-0.5">
                Based on {formatGrams(weight)} of {purity} Gold @ {Math.round(ltvRatio * 100)}% LTV
              </p>
            </div>

            {/* Big Loan Entitlement Number */}
            <div className="p-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
              <span className="text-xs text-[#E9D6A6] block font-medium">Estimated Eligible Loan Amount</span>
              <div className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight font-display">
                {formatCurrency(results.estimatedEligibleAmount)}
              </div>
              <div className="flex items-center justify-between text-xs text-white/80 mt-2 pt-2 border-t border-white/10">
                <span>Estimated Gold Value</span>
                <span className="font-bold text-[#FFE082]">{formatCurrency(results.estimatedGoldValue)}</span>
              </div>
            </div>

            {/* Repayment Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-white/90">
                <span className="flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-[#C9A45C]" />
                  <span>Illustrative Interest Rate</span>
                </span>
                <span className="font-bold text-[#FFE082]">{annualRate}% p.a.</span>
              </div>

              {repaymentMethod === 'Simple Interest' ? (
                <>
                  <div className="flex justify-between items-center text-white/90">
                    <span>Est. Monthly Interest</span>
                    <span className="font-bold text-white">{formatCurrency(results.monthlyInterestSimple)}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/90">
                    <span>Total Interest ({tenureMonths}M)</span>
                    <span className="font-bold text-white">{formatCurrency(results.simpleInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/90 pt-2 border-t border-white/10">
                    <span className="font-semibold text-[#E9D6A6]">Total Repayment</span>
                    <span className="text-base font-black text-white">{formatCurrency(results.totalRepaymentSimple)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center text-white/90">
                    <span>Equated Monthly EMI</span>
                    <span className="font-bold text-[#FFE082] text-sm">{formatCurrency(results.reducingEmi)}/mo</span>
                  </div>
                  <div className="flex justify-between items-center text-white/90">
                    <span>Total Interest Payable</span>
                    <span className="font-bold text-white">{formatCurrency(results.totalInterestEmi)}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/90 pt-2 border-t border-white/10">
                    <span className="font-semibold text-[#E9D6A6]">Total Repayment</span>
                    <span className="text-base font-black text-white">{formatCurrency(results.totalRepaymentEmi)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-6 relative z-10 space-y-3">
            <button
              onClick={handleFindBranch}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-[#C9A45C] via-[#E0BD70] to-[#C9A45C] text-[#500e1b] hover:brightness-105 transition-all shadow-lg shadow-black/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Find a Nearby Branch</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mandatory Disclaimer */}
            <p className="text-[10px] text-white/60 text-center leading-relaxed">
              Illustrative estimate only. This calculator does not provide an actual gold appraisal, binding quote, loan approval, or guaranteed repayment amount.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
