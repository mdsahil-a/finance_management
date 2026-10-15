import React from 'react';
import { GoldLoanCalculator } from '../../components/calculator/GoldLoanCalculator';
import { Sparkles, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#701525]/10 text-[#701525] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
          <span>Real-Time Estimation Tool</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#701525] font-display">
          Gold Loan Eligibility & EMI Calculator
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Estimate your borrowing capacity and compare simple interest bullet payments against reducing balance monthly EMI schedules with zero obligation.
        </p>
      </div>

      <GoldLoanCalculator />

      {/* Educational Guide Below Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] space-y-2">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#A71930]" />
            <span>How LTV Works</span>
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            The Loan-to-Value (LTV) ratio determines the percentage of the assessed gold value you are entitled to borrow. Indian regulatory standards allow up to 75% LTV on eligible hallmarked ornaments.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] space-y-2">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#C9A45C]" />
            <span>Purity Impact</span>
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            A 22K ornament carries a 91.67% gold factor (22/24), while 18K is 75% (18/24). Higher purity unlocks a higher valuation and therefore a larger loan sanction.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] space-y-2">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Repayment Flexibility</span>
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Choose bullet repayment to service monthly interest and repay principal at maturity, or reducing EMI to steadily amortize both interest and principal over your loan tenure.
          </p>
        </div>
      </div>
    </div>
  );
};
