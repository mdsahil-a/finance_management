import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../../components/common/PageHeader';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const MyProfilePage: React.FC = () => {
  const { currentCustomer } = useFinance();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <PageHeader
        title="My Borrower Profile & KYC"
        subtitle="Verified personal identification, registered address, and regulatory KYC records."
        badge={{ label: 'KYC Verified (Tier-1)', color: 'bg-emerald-100 text-emerald-900 border border-emerald-200' }}
        breadcrumbs={[
          { label: 'My Dashboard', to: '/' },
          { label: 'My Profile' },
        ]}
      />

      {/* Main Profile Card */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        
        {/* User Identity Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-zinc-100">
          <div className="w-16 h-16 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-2xl font-heading shadow-xs">
            {currentCustomer.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-black text-zinc-950 font-heading">{currentCustomer.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-zinc-500">
              <span>Customer ID: <strong className="font-mono text-zinc-800">{currentCustomer.id}</strong></span>
              <span>&middot;</span>
              <span>Registered Mobile: <strong className="font-mono text-zinc-800">{currentCustomer.phone}</strong></span>
              <span>&middot;</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active Borrower</span>
              </span>
            </div>
          </div>
        </div>

        {/* KYC Verification Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-zinc-600">Aadhaar Card (UIDAI)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm font-mono font-bold text-zinc-950">XXXX-XXXX-4589</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Biometric verified</span>
          </div>

          <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-zinc-600">Permanent Account # (PAN)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm font-mono font-bold text-zinc-950">ABCPS1234K</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Income Tax Dept verified</span>
          </div>

          <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-zinc-600">Servicing Branch</span>
              <Building2 className="w-4 h-4 text-amber-700" />
            </div>
            <span className="text-sm font-bold text-zinc-950 truncate block">Mumbai Fort Flagship</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Branch Code: BR-MUM-01</span>
          </div>
        </div>

        {/* Contact & Residential Details */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-zinc-950 font-heading">
            Registered Communication Address
          </h3>

          <div className="p-4 bg-zinc-50/60 border border-zinc-200/60 rounded-2xl space-y-2 text-xs text-zinc-700">
            <p><strong>Street Address:</strong> {currentCustomer.address || '42, Veer Nariman Road, Fort'}</p>
            <p><strong>City / State:</strong> Mumbai, Maharashtra - 400001</p>
            <p><strong>Primary Contact:</strong> +91 {currentCustomer.phone}</p>
            <p><strong>Registered Nominee:</strong> Sunita Sharma (Spouse) &middot; Nominee Share: 100%</p>
          </div>
        </div>

        {/* Security & Privacy Notice */}
        <div className="p-4 bg-teal-50/60 border border-teal-200/70 rounded-2xl flex items-start gap-3 text-xs text-zinc-600">
          <Lock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-teal-950 block">Data Privacy Guarantee</span>
            <p className="text-[11px] text-teal-900/80 mt-0.5 leading-relaxed">
              Your personal data and loan records are strictly confidential and protected under Indian Data Protection norms. Only authorized officers at your assigned branch have access to verify collateral.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
