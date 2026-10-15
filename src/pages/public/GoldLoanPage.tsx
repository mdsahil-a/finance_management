import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Scale, 
  ShieldCheck, 
  FileText, 
  Coins, 
  HelpCircle,
  AlertCircle,
  Gem,
  Award
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const GoldLoanPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#701525]/10 text-[#701525] text-xs font-bold uppercase tracking-wider">
          <Coins className="w-3.5 h-3.5 text-[#C9A45C]" />
          <span>Product Overview & Terms</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#701525] font-display">
          Comprehensive Gold Loan Solutions
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Leverage the intrinsic value of your idle gold jewellery for immediate liquidity without liquidating cherished family heirlooms.
        </p>
      </div>

      {/* How Gold Borrowing Works */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E2D8] shadow-md grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-black text-[#701525] font-display">
            How Gold-Backed Borrowing Operates
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Unlike unsecured personal borrowing which scrutinizes rigid income ratios and credit scores, a gold loan is backed by tangible precious metal. The lending institution holds your hallmarked gold ornaments in institutional custody until your loan is fully settled.
          </p>
          <div className="space-y-3 text-xs sm:text-sm text-gray-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Retain Full Ownership:</strong> Your gold is safely returned to you upon final repayment with zero wear and tear.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Instant Liquidity:</strong> Fast appraisal turnaround with minimal document requirements.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Flexible Tenure:</strong> Select from short-term bullet tenures (3M) up to extended 36-month repayment programs.</span>
            </div>
          </div>
        </div>

        <div className="bg-[#FAF8F3] rounded-2xl p-6 sm:p-8 border border-[#E8E2D8] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#701525] uppercase tracking-wider">
            <Gem className="w-4 h-4 text-[#C9A45C]" />
            <span>Eligible Gold Jewellery Categories</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-gray-200">
              <p className="font-bold text-gray-900">Gold Bangles & Kadas</p>
              <p className="text-[11px] text-gray-500 mt-0.5">18K, 20K, 22K hallmarked</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-200">
              <p className="font-bold text-gray-900">Necklaces & Chokers</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Stone weights deducted</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-200">
              <p className="font-bold text-gray-900">Chains & Mangalsutras</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Non-gold beads deducted</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-gray-200">
              <p className="font-bold text-gray-900">Rings & Earrings</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Pure gold weight assessed</p>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 italic">
            *Gold coins sold by banks (up to 50g per customer) are eligible. Raw gold bars or unprocessed nuggets are excluded as per regulatory guidelines.
          </p>
        </div>
      </section>

      {/* Purity & Valuation Explained */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-[#701525] font-display">
            Purity Standards & Valuation Methodology
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Valuation is strictly determined by multiplying the net gold content by the active 24K reference benchmark.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E8E2D8] shadow-xs space-y-2">
            <span className="text-xs font-bold text-[#701525] bg-[#FAF3E0] px-2.5 py-1 rounded">24 Karat (99.9%)</span>
            <h3 className="text-base font-bold text-gray-900 mt-2">Fine Gold Coins</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              100% fine gold purity factor (24/24). Full benchmark price applied per net gram.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-[#701525] shadow-md space-y-2 relative">
            <span className="text-xs font-bold text-white bg-[#701525] px-2.5 py-1 rounded">22 Karat (91.6%)</span>
            <h3 className="text-base font-bold text-gray-900 mt-2">Standard Jewellery (BIS 916)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Traditional Indian bridal and hallmarked ornaments. 91.67% gold purity factor (22/24).
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8E2D8] shadow-xs space-y-2">
            <span className="text-xs font-bold text-[#701525] bg-[#FAF3E0] px-2.5 py-1 rounded">20 Karat (83.3%)</span>
            <h3 className="text-base font-bold text-gray-900 mt-2">Cast & Antique Jewellery</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Intricate vintage ornaments and specific casting jewellery. 83.33% gold purity factor (20/24).
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8E2D8] shadow-xs space-y-2">
            <span className="text-xs font-bold text-[#701525] bg-[#FAF3E0] px-2.5 py-1 rounded">18 Karat (75.0%)</span>
            <h3 className="text-base font-bold text-gray-900 mt-2">Diamond & Gem Studded</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              75.0% gold purity factor (18/24). Valuation is computed solely on the remaining net gold frame after deducting stones.
            </p>
          </div>
        </div>
      </section>

      {/* Eligibility & Documentation */}
      <section className="bg-[#FAF8F3] rounded-3xl p-8 sm:p-12 border border-[#E8E2D8] grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#701525] uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#C9A45C]" />
            <span>Eligibility Criteria (Illustrative)</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A71930] shrink-0" />
              <span>Indian resident aged between 18 and 75 years</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A71930] shrink-0" />
              <span>Ownership of eligible hallmarked gold jewellery</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A71930] shrink-0" />
              <span>Minimum net gold weight of 5 grams</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A71930] shrink-0" />
              <span>No mandatory formal income proof required for retail schemes</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#701525] uppercase tracking-wider">
            <FileText className="w-4 h-4 text-[#C9A45C]" />
            <span>Commonly Requested Documents</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Proof of Identity (Aadhaar, Passport, Voter ID, or Driving License)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Proof of Address (Utility bill, Aadhaar, Rental Agreement)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Two recent passport-size photographs</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Customer declaration of jewellery ownership</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Mandatory Disclaimer Box */}
      <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Prototype Disclaimer:</strong> Actual valuation, eligibility, applicable rates, charges, repayment schedules, and required documents depend on the lender's policies and applicable regulations. All product categories and financial terms shown on this platform are illustrative and for demonstration purposes only.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/calculator"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-[#701525] border-2 border-[#701525] hover:bg-[#FAF8F3] text-center"
        >
          Open Loan Calculator
        </Link>
      </div>
    </div>
  );
};
