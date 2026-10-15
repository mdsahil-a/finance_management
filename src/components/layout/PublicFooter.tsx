import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { useDemoData } from '../../context/DemoDataContext';

export const PublicFooter: React.FC = () => {
  const { resetDemoData } = useDemoData();

  const handleQuickReset = () => {
    if (window.confirm('Reset all demo applications, transactions, and staff data back to initial state?')) {
      resetDemoData();
      window.location.reload();
    }
  };

  return (
    <footer className="bg-[#1f050b] text-[#FAF8F3] border-t-4 border-[#C9A45C]">
      {/* Top Value Banner */}
      <div className="border-b border-white/10 bg-[#2d0912] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C9A45C]/20 border border-[#C9A45C]/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#FFE082]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">High Security Vault Storage</h4>
              <p className="text-xs text-gray-300 mt-0.5">Dual-custody institutional vault storage for pledged gold</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C9A45C]/20 border border-[#C9A45C]/40 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-[#FFE082]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Rapid Appraisal Workflow</h4>
              <p className="text-xs text-gray-300 mt-0.5">Precision weighing & instant illustrative sanction estimates</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C9A45C]/20 border border-[#C9A45C]/40 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-[#FFE082]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Pan-India Branch Network</h4>
              <p className="text-xs text-gray-300 mt-0.5">8 demo flagship branches across major Indian metropolises</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
              AURUM GOLD FINANCE provides transparent illustrative estimates and a comprehensive four-role loan management operational prototype for Indian gold financing.
            </p>
            <div className="pt-2 text-xs text-gray-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C9A45C]" />
                <span>Aurum Tower, Fort, Mumbai 400001 (Demo HQ)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C9A45C]" />
                <span>+91 22 2200 4500 (Illustrative Demo Helpline)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C9A45C]" />
                <span>contact@aurum.example</span>
              </div>
            </div>
          </div>

          {/* Product Offerings */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#E9D6A6] tracking-wider uppercase">
              Gold Products
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link to="/gold-loan#short-term" className="hover:text-white transition-colors">
                  Short-Term Gold Loan
                </Link>
              </li>
              <li>
                <Link to="/gold-loan#flexible" className="hover:text-white transition-colors">
                  Flexible-Tenure Gold Loan
                </Link>
              </li>
              <li>
                <Link to="/gold-loan#business" className="hover:text-white transition-colors">
                  Business Needs Gold Loan
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-white transition-colors">
                  Interactive Calculator
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  Operational Journey
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support & Tools */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#E9D6A6] tracking-wider uppercase">
              Customer Services
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link to="/track-application" className="hover:text-white transition-colors">
                  Track Application Status
                </Link>
              </li>
              <li>
                <Link to="/branches" className="hover:text-white transition-colors">
                  Branch Locator (8 Cities)
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Customer Portal Login
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white transition-colors">
                  20+ FAQs & Help Guide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Internal Staff Management */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#E9D6A6] tracking-wider uppercase">
              Staff Portals
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link to="/staff/login" className="hover:text-[#FFE082] transition-colors flex items-center gap-1 font-semibold text-[#E9D6A6]">
                  <span>Staff Login Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/staff/admin" className="hover:text-white transition-colors">
                  Super Admin Console
                </Link>
              </li>
              <li>
                <Link to="/staff/cashier" className="hover:text-white transition-colors">
                  Cashier & Disbursements
                </Link>
              </li>
              <li>
                <Link to="/staff/weighter" className="hover:text-white transition-colors">
                  Gold Weighter Queue
                </Link>
              </li>
              <li>
                <Link to="/staff/final-entry" className="hover:text-white transition-colors">
                  Final Entry Operator
                </Link>
              </li>
              <li className="pt-2">
                <button
                  onClick={handleQuickReset}
                  className="inline-flex items-center gap-1 text-[11px] text-amber-300/80 hover:text-amber-300 border border-amber-300/30 px-2 py-1 rounded"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Demo Data</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Prototype Disclaimer */}
        <div className="mt-12 pt-8 border-t border-white/10 text-[11px] text-gray-400 leading-relaxed space-y-3">
          <p>
            <strong className="text-white">PROTOTYPE & DEMONSTRATION NOTICE:</strong> AURUM GOLD FINANCE is a conceptual design prototype developed strictly for executive evaluation and workflow demonstration. All brand names, branch directories, interest quotations, valuation figures, customer applications, loan accounts, receipts, and staff interactions are simulated in browser LocalStorage. No real financial loans, KYC submissions, credit checks, or currency disbursements are executed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/5 gap-4">
            <p>© {new Date().getFullYear()} Aurum Gold Finance Ltd. Prototype built for CEO Review.</p>
            <div className="flex items-center gap-6 text-xs">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/faqs" className="hover:text-white transition-colors">
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
