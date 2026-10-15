import React from 'react';
import { AlertCircle, FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#A71930]">
          Legal & Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#701525] font-display">
          Terms of Service & Prototype Use Conditions
        </h1>
        <p className="text-xs text-gray-500">
          Last revised: October 11, 2026 • Aurum Gold Finance Ltd. Prototype
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2D8] shadow-md space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Absence of Real Financial Services:</strong> Aurum Gold Finance Ltd. is a conceptual financial platform prototype. Nothing within this interface constitutes an offer of credit, a legally binding contract, or actual gold appraisal.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#701525]">1. Illustrative Estimations Only</h2>
          <p>
            All interest rates, gold benchmark rates, Loan-to-Value formulas, processing fees, and EMI schedules displayed in the calculator or dashboards are strictly illustrative. They do not constitute guaranteed quotations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#701525]">2. Simulated Operational Workflow</h2>
          <p>
            The Gold Weighter, Final Entry Operator, Super Admin, and Cashier screens model an ideal Indian Non-Banking Financial Company (NBFC) dual-control hierarchy. All disbursements, receipts, and repayments generated are simulated vouchers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#701525]">3. Brand Identity & Intellectual Property</h2>
          <p>
            AURUM GOLD FINANCE is an original fictional brand created specifically for this prototype. It is not affiliated with or sponsored by any registered commercial gold loan NBFC or bank.
          </p>
        </section>
      </div>
    </div>
  );
};
