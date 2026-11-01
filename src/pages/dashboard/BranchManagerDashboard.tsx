import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  MessageCircle,
  Wallet,
  ArrowUpRight,
  FileText,
  ChevronRight,
  BadgePercent,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

export const BranchManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    loans,
    payments,
    approvals,
    appraisals,
    approveRequest,
    rejectRequest,
    dayBook,
    currentStaff,
    settings,
    applications,
    setIsNewLoanModalOpen,
    setIsPaymentModalOpen,
  } = useFinance();

  // Branch Specific Metrics (Mumbai Fort Flagship)
  const activeLoans = loans.filter((l) => l.status !== 'Fully Paid');
  const branchOutstanding = activeLoans.reduce((sum, l) => sum + l.remainingPrincipal, 0);
  const branchSafeGold = loans
    .filter((l) => l.safeStatus === 'In Safe')
    .reduce((sum, l) => sum + l.totalWeightGrams, 0);
  const overdueLoans = loans.filter((l) => l.status === 'Overdue');
  const dueSoonLoans = loans.filter((l) => l.status === 'Due Soon');

  // Today's collections
  const todayCollections = dayBook
    .filter((d) => d.direction === 'IN')
    .reduce((sum, d) => sum + d.amount, 0);

  // Pending branch approvals, applications awaiting sanction, and collateral releases
  const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');
  const pendingAppraisals = appraisals.filter((a) => a.status === 'PENDING_SANCTION');
  const pendingSanctionApps = applications.filter((a) => a.status === 'AWAITING_APPROVAL');
  const pendingReleaseLoans = loans.filter((l) => l.safeStatus === 'Release Pending Approval');

  // WhatsApp reminder generator for overdue loans
  const sendWhatsAppReminder = (phone: string, name: string, loanNo: string, amount: number, dueDate: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const text = encodeURIComponent(
      `Namaste ${name} ji,\nThis is a priority notice from Aurum Gold Finance (Mumbai Fort Branch).\nYour gold loan #${loanNo} has overdue interest of ₹${amount.toLocaleString('en-IN')} (due since ${dueDate}).\nPlease clear your overdue interest at the branch counter today to protect your gold collateral.\nThank you!`
    );
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Muthoot-Style Branch Manager Page Header */}
      <PageHeader
        title="Branch Operations Desk"
        subtitle="Mumbai Fort Flagship (#101) &middot; Counter lending, overdue recovery, and dual-custody authorization."
        badge={{ label: 'Assigned Branch: BR-MUM-01', color: 'bg-blue-100 text-blue-900 border border-blue-200' }}
        actions={
          <div className="flex items-center gap-2">
            {pendingSanctionApps.length > 0 && (
              <button
                onClick={() => navigate('/approvals')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer animate-pulse"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sanction Queue ({pendingSanctionApps.length})</span>
              </button>
            )}
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

      {/* 4 Summary Metrics Cards for Branch Manager */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Branch Active Portfolio */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Branch Portfolio</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-950 font-heading">
            ₹{branchOutstanding.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
            <span className="font-bold text-blue-700">{activeLoans.length} active loans</span>
            <span className="text-zinc-300">·</span>
            <span>Target: ₹50.0L</span>
          </div>
        </div>

        {/* Card 2: Today's Branch Collections */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Collections</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 font-heading">
            ₹{todayCollections.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
            <span className="font-bold text-emerald-800">Day book verified</span>
            <span className="text-zinc-300">·</span>
            <span>Counter #1 & #2</span>
          </div>
        </div>

        {/* Card 3: Vault Locker Gold */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Branch Safe Locker</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-950 font-heading">
            {branchSafeGold.toFixed(2)} <span className="text-base font-semibold text-zinc-500">grams</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
            <span className="font-bold text-zinc-900">{loans.filter((l) => l.safeStatus === 'In Safe').length} sealed packets</span>
            <span className="text-zinc-300">·</span>
            <span className="text-amber-800 font-medium">Dual Key #A-101</span>
          </div>
        </div>

        {/* Card 4: Overdue & At-Risk Loans */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Overdue Accounts</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700 font-heading">
            {overdueLoans.length} <span className="text-base font-semibold text-zinc-500">accounts</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
            <span className="font-bold text-rose-700">{dueSoonLoans.length} due this week</span>
            <span className="text-zinc-300">·</span>
            <span>Immediate notice</span>
          </div>
        </div>

      </div>

      {/* Two-Column Grid: Overdue Follow-ups & Pending Authorizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Overdue Recovery Follow-up Table */}
        <div className="lg:col-span-7 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2 font-heading">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Overdue Loans Follow-up Register</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Borrowers requiring branch follow-up to prevent non-performing classification.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
              Recovery Action
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-600 uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-2.5 px-3">Borrower</th>
                  <th className="py-2.5 px-3">Loan #</th>
                  <th className="py-2.5 px-3 text-right">Principal</th>
                  <th className="py-2.5 px-3 text-right">Pending Int.</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {overdueLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-zinc-950 block">{loan.customerName}</span>
                      <span className="text-[10px] text-zinc-500">{loan.customerPhone}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-zinc-800">
                      {loan.id}
                      <span className="block text-[10px] text-rose-600 font-sans font-medium">Due {loan.dueDate}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-zinc-900">
                      ₹{loan.loanAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-rose-700">
                      ₹{loan.monthlyInterestAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() =>
                          sendWhatsAppReminder(
                            loan.customerPhone,
                            loan.customerName,
                            loan.id,
                            loan.monthlyInterestAmount,
                            loan.dueDate
                          )
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                        title="Send Official Notice via WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Send Notice</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {overdueLoans.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-zinc-400">
                      No overdue accounts! Branch recovery is at 100%.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Pending Managerial Approvals & Appraisals Queue */}
        <div className="lg:col-span-5 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2 font-heading">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Dual Approval Desk</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Sign-off required for loans &gt; ₹50,000 or releases.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                {pendingApprovals.length} Requests
              </span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border border-zinc-200 rounded-xl bg-zinc-50/60 hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-zinc-900">{item.customerName}</span>
                    <span className="text-xs font-mono font-black text-zinc-950">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 mb-2">{item.reason}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
                    <span className="text-[9px] text-zinc-400 font-mono">By: {item.requestedBy}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => approveRequest(item.id)}
                        className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectRequest(item.id)}
                        className="px-2 py-0.5 bg-zinc-200 hover:bg-rose-100 text-zinc-700 hover:text-rose-800 font-bold text-[10px] rounded cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {pendingApprovals.length === 0 && (
                <div className="py-8 text-center text-zinc-400 text-xs">
                  All manager approval requests have been processed.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Sanction Review Desk:</span>
              <button
                onClick={() => navigate('/approvals')}
                className="text-amber-800 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>{pendingSanctionApps.length} Applications Awaiting Decision</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {pendingReleaseLoans.length > 0 && (
              <div className="flex items-center justify-between text-emerald-800 font-bold">
                <span>Collateral Release Clearance:</span>
                <button
                  onClick={() => navigate('/approvals')}
                  className="hover:underline inline-flex items-center gap-1"
                >
                  <span>{pendingReleaseLoans.length} Loans Ready for Release</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Appraisal Queue:</span>
              <button
                onClick={() => navigate('/appraisals')}
                className="text-zinc-700 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>{pendingAppraisals.length} Appraisals to Review</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Branch Activity */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-zinc-950 font-heading">
            Recent Branch Activity & Ledger
          </h2>
          <span className="text-xs text-zinc-400">Station Counter #1 & #2</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-600 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Customer</th>
                <th className="py-2 px-3">Transaction</th>
                <th className="py-2 px-3">Mode</th>
                <th className="py-2 px-3 text-right">Amount</th>
                <th className="py-2 px-3 text-right">Receipt #</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {payments.slice(-4).reverse().map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-2 px-3 text-zinc-500 font-mono">{p.paymentDate}</td>
                  <td className="py-2 px-3 font-bold text-zinc-900">{p.customerName}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700">
                      {p.paymentType}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-zinc-600">{p.paymentMethod}</td>
                  <td className="py-2 px-3 text-right font-black text-emerald-700 font-mono">
                    ₹{p.totalPaid.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 text-right text-zinc-400 font-mono">{p.receiptNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
