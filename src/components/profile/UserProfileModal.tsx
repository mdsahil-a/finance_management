import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  User,
  Shield,
  Building2,
  Phone,
  Mail,
  LogOut,
  X,
  CheckCircle2,
  Calendar,
  Lock,
} from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    currentRole,
    currentStaff,
    currentCustomer,
    logout,
  } = useFinance();

  if (!isProfileModalOpen) return null;

  const isCustomer = currentRole === 'CUSTOMER';
  const displayName = isCustomer ? currentCustomer.name : currentStaff.name;
  const displayId = isCustomer ? currentCustomer.id : currentStaff.id;
  const displayPhone = isCustomer ? currentCustomer.phone : currentStaff.phone;
  const displayEmail = isCustomer
    ? 'customer@aurumgold.com'
    : currentStaff.email || `${currentStaff.name.toLowerCase().replace(/\s+/g, '.')}@aurumgold.com`;

  const roleDetailsMap: Record<
    string,
    { title: string; desc: string; badgeClass: string; permissions: string[] }
  > = {
    ADMIN: {
      title: 'System Administrator',
      desc: 'Central headquarters administration & enterprise-wide portfolio management',
      badgeClass: 'bg-purple-100 text-purple-900 border border-purple-200',
      permissions: [
        'Multi-branch oversight & vault surveillance',
        'Staff user management & role provisioning',
        'Dual-custody authorization for high-value loans (> ₹50,000)',
        'Consolidated regulatory audit & financial reports',
      ],
    },
    BRANCH_MANAGER: {
      title: 'Branch Manager',
      desc: 'Branch operational head & dual-custody loan authorization desk',
      badgeClass: 'bg-blue-100 text-blue-900 border border-blue-200',
      permissions: [
        'Assigned branch lending & collections surveillance',
        'Dual-approval sign-off for loan sanctions and collateral release',
        'Overdue recovery register & borrower WhatsApp follow-ups',
        'Daily cash drawer tally & branch audit reports',
      ],
    },
    APPRAISER: {
      title: 'Gold Appraiser & Assay Officer',
      desc: 'Physical assay, karat testing, and collateral valuation station',
      badgeClass: 'bg-amber-100 text-amber-900 border border-amber-200',
      permissions: [
        'Electronic karatmeter testing & acid assay verification',
        'Gross weight & stone deduction recording',
        'RBI 75% LTV valuation certificate issuance',
        'Safe packet allocation & tamper-evident pouch sealing',
      ],
    },
    CASHIER: {
      title: 'Counter Cashier',
      desc: 'Physical cash drawer management & transaction receipt issuance',
      badgeClass: 'bg-emerald-100 text-emerald-900 border border-emerald-200',
      permissions: [
        'Fast borrower loan balance search & interest collection',
        'Computer-generated tax receipt slip printing',
        'Real-time cash in drawer register maintenance',
        'Cash book & day book entry verification',
      ],
    },
    CUSTOMER: {
      title: 'Registered Gold Loan Borrower',
      desc: 'Authorized customer portal self-service desk',
      badgeClass: 'bg-teal-100 text-teal-900 border border-teal-200',
      permissions: [
        'Personal gold loan account review & balance checking',
        'Online interest & principal payment processing',
        'Pledged gold vault custody status verification',
        'Download official payment receipts & annual ITR certificates',
      ],
    },
  };

  const roleMeta = roleDetailsMap[currentRole] || roleDetailsMap.ADMIN;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
            User Profile & Role Verification
          </span>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Identity Card */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-black text-xl font-heading shadow-xs shrink-0">
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-zinc-950 font-heading truncate">
                {displayName}
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${roleMeta.badgeClass}`}>
                  {roleMeta.title}
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono block mt-0.5">
                ID: {displayId}
              </span>
            </div>
          </div>

          {/* Role Description */}
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 text-xs text-zinc-600 leading-relaxed">
            {roleMeta.desc}
          </div>

          {/* Contact & Branch Meta */}
          <div className="space-y-2 text-xs text-zinc-700">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Branch: <strong>Mumbai Fort Flagship (#101)</strong>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Registered Mobile: <strong className="font-mono">{displayPhone}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Official Email: <strong className="font-mono">{displayEmail}</strong></span>
            </div>
          </div>

          {/* Authorized Permissions */}
          <div className="space-y-2 pt-2 border-t border-zinc-100">
            <span className="text-[11px] uppercase font-bold text-zinc-400 tracking-wider block">
              Active Access Permissions
            </span>
            <div className="space-y-1.5">
              {roleMeta.permissions.map((perm, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-3">
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="px-4 py-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            title="Log out from active session"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
