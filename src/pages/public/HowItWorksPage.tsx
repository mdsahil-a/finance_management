import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Scale, 
  UserCheck, 
  ShieldCheck, 
  CreditCard, 
  Search, 
  ArrowRight, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      role: 'Customer',
      title: 'Enter Customer Information',
      desc: 'Fill out your name, contact phone number, email address, city, and state in the secure application form.',
      icon: FileText,
      badge: 'Public Portal',
    },
    {
      num: '02',
      role: 'Customer',
      title: 'Enter Gold Jewellery Details',
      desc: 'Declare the number of jewellery items, ornament category (bangles, necklace, chain, etc.), gross weight, and karat purity.',
      icon: Scale,
      badge: 'Public Portal',
    },
    {
      num: '03',
      role: 'Customer',
      title: 'Review Illustrative Valuation',
      desc: 'The interactive system computes immediate estimated gold value and eligible loan borrowing limit based on benchmark rates.',
      icon: Sparkles,
      badge: 'Instant Estimate',
    },
    {
      num: '04',
      role: 'Customer',
      title: 'Submit Demo Application',
      desc: 'Receive your unique permanent tracking reference (e.g. AGF-2026-100001) generated and saved directly in LocalStorage.',
      icon: FileText,
      badge: 'Reference Issued',
    },
    {
      num: '05',
      role: 'Staff Role: Gold Weighter',
      title: 'Gold Weighter Records Assessment',
      desc: 'The physical appraisal is logged by the Gold Weighter with gross weight, stone deductions, and net gold weight calculations.',
      icon: Scale,
      badge: 'Role 1: Weighter',
    },
    {
      num: '06',
      role: 'Staff Role: Final Entry Operator',
      title: 'Final Entry Operator Review',
      desc: 'The operator verifies customer details, locks the gold appraisal version, checks calculations, or returns for clarification.',
      icon: UserCheck,
      badge: 'Role 2: Operator',
    },
    {
      num: '07',
      role: 'Staff Role: Super Admin',
      title: 'Authorized Demo Decision',
      desc: 'The Super Admin reviews the completed dossier and records an explicit audit-logged Sanction Decision (Approved or Rejected).',
      icon: ShieldCheck,
      badge: 'Role 3: Super Admin',
    },
    {
      num: '08',
      role: 'Staff Role: Cashier',
      title: 'Cashier Simulated Payout',
      desc: 'Once approved, the Cashier executes simulated disbursement via Cash, Bank Transfer, or UPI and generates a printable official receipt.',
      icon: CreditCard,
      badge: 'Role 4: Cashier',
    },
    {
      num: '09',
      role: 'Customer / Public',
      title: 'Real-Time Application Tracking',
      desc: 'At any point, the customer can view their live workflow milestone timeline, next steps, and recorded receipts using their tracking number.',
      icon: Search,
      badge: 'Public Tracking',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#701525]/10 text-[#701525] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
          <span>Complete Lifecycle Walkthrough</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#701525] font-display">
          How the Aurum Operational Workflow Works
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Explore the synchronized end-to-end journey from online customer application to internal appraisal, dual-operator verification, admin sanction, and cashier disbursement.
        </p>
      </div>

      {/* Steps Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-white rounded-3xl p-7 border border-[#E8E2D8] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-[#C9A45C] font-display">
                    {step.num}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF3E0] text-[#701525] border border-[#E8E2D8]">
                    {step.badge}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#701525]/10 text-[#701525] flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#A71930]" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#701525] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <span>Actor: {step.role}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prototype Notice */}
      <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Simulated Operations Notice:</strong> All staff operations depicted above (weighing, operator check, admin sanction, cashier disbursement, and repayment) are simulated locally within the browser application. They do not constitute actual legal contracts or banking transactions.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/staff/login"
          className="px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-[#701525] border-2 border-[#701525] hover:bg-[#FAF8F3] transition-colors"
        >
          <span>Test as Staff (Login to System)</span>
        </Link>
      </div>
    </div>
  );
};
