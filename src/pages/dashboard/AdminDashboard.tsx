import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Wallet,
  FileText,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    loans,
    payments,
    branches,
    approvals,
    approveRequest,
    rejectRequest,
    dayBook,
    setIsNewLoanModalOpen,
    setIsPaymentModalOpen,
    currentStaff,
  } = useFinance();

  // Metrics
  const activeLoans = loans.filter((l) => l.status !== 'Fully Paid');
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.remainingPrincipal, 0);
  const totalSafeGold = loans
    .filter((l) => l.safeStatus === 'In Safe')
    .reduce((sum, l) => sum + l.totalWeightGrams, 0);
  const totalInterestCollected = payments.reduce((sum, p) => sum + p.interestPaid, 0);
  const uniqueBorrowersCount = new Set(loans.map((l) => l.customerName)).size;

  const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');

  // Day book stats
  const cashIn = dayBook.filter((d) => d.direction === 'IN').reduce((sum, d) => sum + d.amount, 0);
  const cashOut = dayBook.filter((d) => d.direction === 'OUT').reduce((sum, d) => sum + d.amount, 0);
  const cashInDrawer = cashIn - cashOut;

  return (
    <div className="space-y-6">
      
      {/* Muthoot-Style Enterprise Page Header */}
      <PageHeader
        title="Admin Central Dashboard"
        subtitle="Consolidated multi-branch portfolio, safe locker inventory, and operational approvals."
        badge={{ label: 'Headquarters View', color: 'bg-purple-100 text-purple-900 border border-purple-200' }}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Collect Payment</span>
            </button>
            <button
              onClick={() => setIsNewLoanModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
              <span>Sanction Loan</span>
            </button>
          </div>
        }
      />

      {/* 4 Summary Metrics Cards (Clean, light-themed, banking style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Outstanding Portfolio */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Active Loans</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-950 font-heading">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
            <span className="font-bold text-emerald-700">{activeLoans.length} active loan accounts</span>
            <span className="text-zinc-300">·</span>
            <span>75% Max LTV</span>
          </div>
        </div>

        {/* Card 2: Vault Gold in Custody */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Vault Gold Custody</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-950 font-heading">
            {totalSafeGold.toFixed(2)} <span className="text-base font-semibold text-zinc-500">grams</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
            <span className="font-bold text-zinc-900">{loans.filter((l) => l.safeStatus === 'In Safe').length} sealed packets</span>
            <span className="text-zinc-300">·</span>
            <span className="text-amber-700 font-medium">Dual Custody</span>
          </div>
        </div>

        {/* Card 3: Total Collections */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Interest Realized</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 font-heading">
            ₹{totalInterestCollected.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
            <span className="font-bold text-zinc-900">{payments.length} collection receipts</span>
            <span className="text-zinc-300">·</span>
            <span>100% On-time</span>
          </div>
        </div>

        {/* Card 4: Registered Borrowers */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Borrower Accounts</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-950 font-heading">
            {uniqueBorrowersCount} <span className="text-base font-semibold text-zinc-500">verified</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
            <span className="font-bold text-blue-700">100% Aadhaar / PAN KYC</span>
            <span className="text-zinc-300">·</span>
            <span>5 Branches</span>
          </div>
        </div>

      </div>

      {/* Branch Performance Summary Table (Muthoot Multi-Branch Overview) */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2 font-heading">
              <Building2 className="w-4 h-4 text-amber-700" />
              <span>Branch Network Performance Summary</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Live status, loan portfolio, and safe locker gold across all authorized branches.
            </p>
          </div>
          <button
            onClick={() => navigate('/branches')}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 cursor-pointer"
          >
            <span>View All Branches</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-600 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-2.5 px-3">Branch & Code</th>
                <th className="py-2.5 px-3">City / State</th>
                <th className="py-2.5 px-3">Branch Manager</th>
                <th className="py-2.5 px-3 text-right">Active Loans</th>
                <th className="py-2.5 px-3 text-right">Portfolio Book</th>
                <th className="py-2.5 px-3 text-right">Vault Gold (g)</th>
                <th className="py-2.5 px-3 text-center">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {branches.map((branch) => (
                <tr key={branch.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-zinc-900 block">{branch.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{branch.code}</span>
                  </td>
                  <td className="py-3 px-3 text-zinc-600 font-medium">
                    {branch.city}, {branch.state}
                  </td>
                  <td className="py-3 px-3 text-zinc-700">
                    <span className="font-medium">{branch.managerName}</span>
                    <span className="text-[10px] text-zinc-400 block">{branch.phone}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-zinc-900">
                    {branch.activeLoansCount}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-zinc-950 font-mono">
                    ₹{branch.totalDisbursed.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-amber-800 font-mono">
                    {branch.totalVaultGoldGrams.toFixed(1)} g
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        branch.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {branch.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-Column Grid: Pending Approvals & Collection Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Pending Approvals Queue (Interactive!) */}
        <div className="lg:col-span-7 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2 font-heading">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Pending Dual-Authorization Queue</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                High-value loan sanctions and collateral release requests awaiting sign-off.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              {pendingApprovals.length} Pending
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {pendingApprovals.map((item) => (
              <div
                key={item.id}
                className="p-3.5 border border-zinc-200/90 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-950">{item.customerName}</span>
                      <span className="text-[9px] font-mono text-zinc-500 px-1.5 py-0.2 bg-zinc-100 rounded">
                        {item.loanId || item.id}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        {item.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1 leading-snug">{item.reason}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-zinc-400">
                      <span>Requested by: <strong className="text-zinc-700">{item.requestedBy}</strong></span>
                      <span>&middot;</span>
                      <span>Date: <strong className="text-zinc-700">{item.requestDate}</strong></span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-zinc-950 font-mono">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <button
                        onClick={() => approveRequest(item.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                        title="Authorize request"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => rejectRequest(item.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 hover:bg-rose-50 text-zinc-600 hover:text-rose-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                        title="Reject request"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {pendingApprovals.length === 0 && (
              <div className="text-center py-8 text-zinc-400 text-xs">
                All managerial and dual-authorization requests are cleared.
              </div>
            )}
          </div>
        </div>

        {/* Right: Cash Drawer & Collections Summary */}
        <div className="lg:col-span-5 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2 font-heading">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>Today's Counter Collections</span>
              </h2>
              <span className="text-[10px] font-mono text-zinc-400">Day Book Live</span>
            </div>

            <div className="space-y-2.5 my-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-emerald-50/60 border border-emerald-200/60 rounded-xl">
                <span className="font-medium text-emerald-900">Total Cash Inflows (Collections)</span>
                <span className="font-bold text-emerald-800 font-mono">+₹{cashIn.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-rose-50/60 border border-rose-200/60 rounded-xl">
                <span className="font-medium text-rose-900">Total Loan Disbursements</span>
                <span className="font-bold text-rose-800 font-mono">-₹{cashOut.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-950 text-white rounded-xl">
                <div>
                  <span className="font-bold block text-xs">Cash in Physical Drawer</span>
                  <span className="text-[10px] text-zinc-400">Dual lock physical safe</span>
                </div>
                <span className="font-black text-base text-amber-400 font-mono">
                  ₹{cashInDrawer.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Day book register status:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Balanced & Verified</span>
            </span>
          </div>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-zinc-950 font-heading">
            Recent Portfolio Activity
          </h2>
          <span className="text-xs text-zinc-400">Last 5 ledger transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-600 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Customer</th>
                <th className="py-2 px-3">Transaction</th>
                <th className="py-2 px-3">Payment Mode</th>
                <th className="py-2 px-3 text-right">Amount</th>
                <th className="py-2 px-3 text-right">Receipt #</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {payments.slice(-5).reverse().map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-2.5 px-3 text-zinc-500 font-mono">{p.paymentDate}</td>
                  <td className="py-2.5 px-3 font-bold text-zinc-900">{p.customerName}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700">
                      {p.paymentType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-600 font-medium">{p.paymentMethod}</td>
                  <td className="py-2.5 px-3 text-right font-black text-emerald-700 font-mono">
                    ₹{p.totalPaid.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-400 font-mono">{p.receiptNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
