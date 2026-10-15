import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Scale, 
  BadgePercent, 
  ChevronRight, 
  Building2, 
  CheckCircle2, 
  HelpCircle,
  FileCheck2,
  Lock,
  Layers
} from 'lucide-react';
import { GoldLoanCalculator } from '../../components/calculator/GoldLoanCalculator';
import { formatCurrency } from '../../utils/formatters';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative pt-6 sm:pt-12 lg:pt-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#701525]/10 border border-[#701525]/20 text-[#701525] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span>GOLD LOANS MADE SIMPLE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#701525] font-display tracking-tight leading-[1.1]">
                Turn Your Gold Into{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A71930] via-[#C9A45C] to-[#701525]">
                  Financial Possibilities
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-xl">
                Explore financing options against eligible gold jewellery with a simple application experience and transparent illustrative estimates.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/calculator"
                  className="px-6 py-4 rounded-xl font-bold text-base text-[#701525] bg-white hover:bg-[#FAF8F3] border-2 border-[#701525]/30 hover:border-[#701525] transition-all flex items-center justify-center gap-2"
                >
                  <Scale className="w-5 h-5 text-[#C9A45C]" />
                  <span>Calculate Loan Amount</span>
                </Link>
              </div>

              {/* Benefit Bullet Points */}
              <div className="pt-4 border-t border-[#E8E2D8] grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Transparent estimates</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Flexible tenure options</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Simple application experience</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual with Floating Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 group">
                <img
                  src="/images/hero-gold.jpg"
                  alt="Aurum Gold Jewellery Collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback gradient if file fails
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 text-white text-xs font-medium bg-black/40 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/20">
                  Authentic Hallmarked Gold Financing
                </div>
              </div>

              {/* Floating Illustrative Loan Estimate Card */}
              <div className="sm:absolute -bottom-8 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-[#C9A45C]/40 max-w-sm mt-4 sm:mt-0">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-[#A71930] tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C9A45C]" />
                    Illustrative Loan Snapshot
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Demo Model</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
                  <div>
                    <span className="text-gray-500 text-[11px] block">Sample Gold Value</span>
                    <span className="font-bold text-gray-900">{formatCurrency(300000)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[11px] block">Sample Eligible Loan</span>
                    <span className="font-black text-[#701525] text-sm">{formatCurrency(225000)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[11px] block">Illustrative Rate</span>
                    <span className="font-bold text-emerald-700">10.50% p.a.</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[11px] block">Sample Tenure</span>
                    <span className="font-bold text-gray-900">12 Months</span>
                  </div>
                </div>
                <p className="text-[9px] text-gray-400 mt-2.5 pt-2 border-t border-gray-100 italic">
                  *All financial figures are illustrative and subject to simulated appraisal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust and Service Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F3] rounded-3xl p-8 sm:p-12 border border-[#E8E2D8]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#701525] font-display">
              Trust, Security & Operational Transparency
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Every pledged item is protected under stringent dual-custody protocols and evaluated by certified appraisers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#701525]/10 text-[#701525] flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#A71930]" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Bank-Grade Vaults</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Pledged jewellery is sealed in tamper-evident packets and stored in high-security strongrooms with continuous monitoring.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C9A45C]/20 text-[#701525] flex items-center justify-center">
                <Scale className="w-6 h-6 text-[#C9A45C]" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Precision Appraisal</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Calibrated digital carat scales calculate exact net gold weight by deducting non-gold stones and alloys right in front of you.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <BadgePercent className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Zero Hidden Levies</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Clear rate cards, upfront processing fee schedules, and no prepayment penalties for early closure.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900">End-to-End Tracking</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                From submission and appraiser weighing to authorized sanction and payout, track every workflow milestone online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Gold Loan Calculator Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GoldLoanCalculator />
      </section>

      {/* 4. Three Fictional Gold Loan Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A71930]">
            Fictional Schemes for Demonstration
          </span>
          <h2 className="text-3xl font-black text-[#701525] font-display mt-1">
            Tailored Gold Loan Product Categories
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Select a borrowing structure aligned with your liquidity requirements and planned repayment timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Short-Term */}
          <div className="bg-white rounded-3xl p-8 border border-[#E8E2D8] shadow-lg flex flex-col justify-between hover:border-[#C9A45C] transition-all">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#FAF3E0] text-[#701525]">
                3 to 6 Months
              </span>
              <h3 className="text-xl font-bold text-gray-900">Short-Term Gold Loan</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ideal for bridging immediate cash flow gaps, medical emergencies, or urgent supplier payments with bullet repayment flexibility.
              </p>

              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Illustrative Interest</span>
                  <span className="font-bold text-[#701525]">From 9.75% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Max LTV Cap</span>
                  <span className="font-bold text-gray-900">Up to 75%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Repayment Structure</span>
                  <span className="font-bold text-gray-900">Bullet / End-of-Term</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center gap-3">
              <Link
                to="/gold-loan#short-term"
                className="flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-bold text-[#701525] bg-[#701525]/10 hover:bg-[#701525]/20 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Card 2: Flexible-Tenure */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[#701525] shadow-xl flex flex-col justify-between relative transform lg:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C9A45C] text-[#58101d] text-[10px] font-black uppercase px-4 py-1 rounded-full shadow-sm tracking-wider">
              Most Popular Demo Scheme
            </div>

            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#701525]/10 text-[#701525]">
                Up to 36 Months
              </span>
              <h3 className="text-xl font-bold text-gray-900">Flexible-Tenure Gold Loan</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Balanced structure offering choice between reducing-balance EMI installments and monthly interest serviced at your convenience.
              </p>

              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Illustrative Interest</span>
                  <span className="font-bold text-[#701525]">From 10.50% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Max LTV Cap</span>
                  <span className="font-bold text-gray-900">Up to 75%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Repayment Structure</span>
                  <span className="font-bold text-gray-900">EMI or Monthly Interest</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center gap-3">
              <Link
                to="/gold-loan#flexible"
                className="flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-bold text-[#701525] bg-[#701525]/10 hover:bg-[#701525]/20 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Card 3: Business Needs */}
          <div className="bg-white rounded-3xl p-8 border border-[#E8E2D8] shadow-lg flex flex-col justify-between hover:border-[#C9A45C] transition-all">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#FAF3E0] text-[#701525]">
                Up to ₹50 Lakhs (Demo)
              </span>
              <h3 className="text-xl font-bold text-gray-900">Business Needs Gold Loan</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tailored for merchants, MSME entrepreneurs, and traders looking to unlock working capital from pledged family gold ornaments.
              </p>

              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Illustrative Interest</span>
                  <span className="font-bold text-[#701525]">From 9.25% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Max LTV Cap</span>
                  <span className="font-bold text-gray-900">Up to 75%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Repayment Structure</span>
                  <span className="font-bold text-gray-900">Flexible Tranche Payout</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center gap-3">
              <Link
                to="/gold-loan#business"
                className="flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-bold text-[#701525] bg-[#701525]/10 hover:bg-[#701525]/20 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works: The 4 Operational Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F3] rounded-3xl p-8 sm:p-12 border border-[#E8E2D8]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#701525]">
              Simulated Journey
            </span>
            <h2 className="text-3xl font-black text-[#701525] font-display mt-1">
              How the Demo Application Journey Works
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              From online estimation to physical weighing, dual staff verification, and cashier simulated payout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] relative space-y-3">
              <span className="text-3xl font-black text-[#C9A45C] font-display">01</span>
              <h3 className="text-base font-bold text-gray-900">Submit Application</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Provide personal and gold ornament details in the multi-step online wizard to receive your tracking reference (AGF-2026-XXXX).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] relative space-y-3">
              <span className="text-3xl font-black text-[#C9A45C] font-display">02</span>
              <h3 className="text-base font-bold text-gray-900">Gold Appraiser Weighs</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Gold Weighter inspects jewellery, logs gross and net weight, karat purity, and generates an official locked appraisal record.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] relative space-y-3">
              <span className="text-3xl font-black text-[#C9A45C] font-display">03</span>
              <h3 className="text-base font-bold text-gray-900">Final Entry & Sanction</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Final Entry Operator completes verification checklist, followed by Super Admin recording the authorized sanction decision.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] relative space-y-3">
              <span className="text-3xl font-black text-[#C9A45C] font-display">04</span>
              <h3 className="text-base font-bold text-gray-900">Cashier Payout</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Cashier records simulated disbursement (Cash, Bank Transfer, or UPI) and issues an authentic printable transaction receipt.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#701525] hover:text-[#A71930]"
            >
              <span>Explore Detailed Step-by-Step Operations</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FAQ Preview */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#701525] font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Clear answers about gold valuations, eligibility, LTV guidelines, and prototype limitations.
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] space-y-1">
            <h4 className="text-sm font-bold text-gray-900">How is my gold valued during the physical appraisal?</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Gold appraisers deduct non-gold elements (stones, clasps, enamelling) from the gross weight. The resulting net weight is multiplied by the 24K daily reference benchmark and adjusted for the purity karat factor (e.g. 22K = 22/24).
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] space-y-1">
            <h4 className="text-sm font-bold text-gray-900">How does the simulated four-role staff management workflow work?</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              When an application is submitted, it flows sequentially through the Gold Weighter (appraisal), Final Entry Operator (verification), Super Admin (authorization), and Cashier (payout), all synced via LocalStorage.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] space-y-1">
            <h4 className="text-sm font-bold text-gray-900">Is any real money disbursed or are real IDs collected?</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              No. AURUM GOLD FINANCE is an executive presentation prototype. No real KYC, bank credentials, or actual monetary loans are processed.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/faqs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#701525] hover:text-[#A71930]"
          >
            <span>View All 20+ Questions & Answers</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#701525] via-[#A71930] to-[#58101d] p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl border border-[#C9A45C]/40">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
              Ready to Experience the Aurum Gold Prototype?
            </h2>
            <p className="text-xs sm:text-sm text-[#E9D6A6] leading-relaxed">
              Learn about gold loans, explore illustrative estimates, or log into the staff console to follow the simulated operational workflow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/staff/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              >
                Access Staff System (5 Roles)
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
