import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../../components/common/PageHeader';
import {
  ShieldCheck,
  Lock,
  Scale,
  Award,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

export const MyGoldPage: React.FC = () => {
  const { currentCustomer, loans } = useFinance();

  // STRICT SECURITY FILTER
  const myLoans = loans.filter(
    (l) => l.customerName === currentCustomer.name || l.customerPhone === currentCustomer.phone
  );

  const totalGoldGrams = myLoans.reduce((sum, l) => sum + l.totalWeightGrams, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <PageHeader
        title="My Pledged Gold & Safe Custody"
        subtitle="Verification of your pledged ornaments safely stored in grade-A biometric dual-custody safes."
        badge={{ label: 'Dual-Custody Vault Locked', color: 'bg-amber-100 text-amber-900 border border-amber-200' }}
        breadcrumbs={[
          { label: 'My Dashboard', to: '/' },
          { label: 'My Gold' },
        ]}
      />

      {/* 3 Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Pledged Gold</span>
            <Scale className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-zinc-950 font-mono">
            {totalGoldGrams.toFixed(2)} grams
          </div>
          <span className="text-xs text-zinc-500 mt-1 block">Certified 22K (916) Hallmark</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Safe Vault Status</span>
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            Grade-A Secure
          </div>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">Dual-Key Sealed</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Insurance Coverage</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-700 font-mono">
            100% Insured
          </div>
          <span className="text-xs text-zinc-500 mt-1 block">National Insurance Policy</span>
        </div>
      </div>

      {/* Pledged Ornaments List */}
      <div className="space-y-4">
        {myLoans.map((loan) => (
          <div
            key={loan.id}
            className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-sm text-zinc-950">{loan.goldItems.map(g => g.name).join(', ')}</span>
                <span className="text-[10px] font-mono font-bold text-amber-800 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full">
                  Packet #{loan.safePacketNumber}
                </span>
              </div>
              <span className="text-xs text-zinc-500">
                Pledged for Loan #{loan.id}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Net Pure Weight</span>
                <span className="font-mono font-black text-amber-800 text-sm">{loan.totalWeightGrams} grams</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Assayed Purity</span>
                <span className="font-mono font-bold text-zinc-900 text-sm">22 Karat (916)</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Packet Seal</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">Tamper-Evident</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Custody Location</span>
                <span className="font-mono font-bold text-zinc-900 text-sm">Mumbai Fort Vault</span>
              </div>
            </div>

            <div className="text-[11px] text-zinc-500 flex items-center gap-2 pt-1">
              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Items can be redeemed immediately upon clearing remaining loan balance of ₹{loan.remainingPrincipal.toLocaleString('en-IN')}.</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
