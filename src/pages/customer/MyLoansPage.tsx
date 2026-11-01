import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../../components/common/PageHeader';
import {
  CreditCard,
  Wallet,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Info,
} from 'lucide-react';

export const MyLoansPage: React.FC = () => {
  const { currentCustomer, loans, applications, setIsPaymentModalOpen, setSelectedLoanForPayment } = useFinance();

  // STRICT SECURITY FILTER: Only own loans and applications
  const myLoans = loans.filter(
    (l) => l.customerName === currentCustomer.name || l.customerPhone === currentCustomer.phone
  );

  const myApplications = applications.filter(
    (a) => a.customerName === currentCustomer.name || a.customerPhone === currentCustomer.phone
  );

  const activeLoans = myLoans.filter((l) => l.status !== 'Fully Paid');
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.remainingPrincipal, 0);

  const handlePay = (loan: typeof myLoans[0]) => {
    setSelectedLoanForPayment(loan);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <PageHeader
        title="My Gold Loans"
        subtitle="Active and settled loan accounts, principal balances, monthly interest, and repayment options."
        badge={{ label: `${myLoans.length} Loan Accounts`, color: 'bg-teal-100 text-teal-900 border border-teal-200' }}
        breadcrumbs={[
          { label: 'My Dashboard', to: '/' },
          { label: 'My Loans' },
        ]}
      />

      {/* Summary Box */}
      <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-zinc-400 block tracking-wider">
            Total Outstanding Principal
          </span>
          <div className="text-3xl font-black text-zinc-950 font-mono mt-0.5">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-zinc-500 mt-1 block">
            Across {activeLoans.length} active gold loan account(s)
          </span>
        </div>

        {activeLoans.length > 0 && (
          <button
            onClick={() => handlePay(activeLoans[0])}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 shrink-0"
          >
            <Wallet className="w-4 h-4" />
            <span>Pay Monthly Interest (₹{activeLoans[0].monthlyInterestAmount.toLocaleString('en-IN')})</span>
          </button>
        )}
      </div>

      {/* Applications in Progress */}
      {myApplications.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Loan Applications in Progress ({myApplications.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-amber-200/80 rounded-2xl p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <div>
                    <span className="font-mono font-bold text-zinc-950 text-xs block">{app.id}</span>
                    <span className="text-[11px] text-zinc-500">Requested: ₹{app.requestedAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    app.status === 'ACTIVATED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : app.status === 'DISBURSED'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : app.status === 'AWAITING_APPROVAL'
                      ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                      : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                  }`}>
                    {app.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-xs text-zinc-600 space-y-1">
                  <p><strong>Declared Collateral:</strong> {app.declaredItemsDescription}</p>
                  {app.appraisalDetails && (
                    <p className="text-emerald-800 font-semibold">
                      ✓ Assayed: {app.appraisalDetails.totalNetWeight}g · Valuation: ₹{app.appraisalDetails.totalValuation.toLocaleString('en-IN')}
                    </p>
                  )}
                  {app.approvalDecision && (
                    <p className="text-zinc-700">
                      Sanction Decision: <strong>{app.approvalDecision.decision}</strong> (₹{app.approvalDecision.approvedAmount.toLocaleString('en-IN')})
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Loan Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-900">Active & Historical Loan Facilities</h3>
        {myLoans.map((loan) => (
          <div
            key={loan.id}
            className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs space-y-4"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <span className="text-base font-black text-zinc-950 font-mono">
                  {loan.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    loan.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-900'
                      : loan.status === 'Due Soon'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {loan.status}
                </span>
              </div>

              <div className="text-xs text-zinc-500">
                Disbursement Date: <strong className="text-zinc-800">{loan.loanDate}</strong>
              </div>
            </div>

            {/* Financial Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-zinc-50/70 border border-zinc-200/70 rounded-2xl">
              <div>
                <span className="text-zinc-400 text-[10px] uppercase font-bold block">Sanctioned Amount</span>
                <span className="text-base font-black text-zinc-950 font-mono">
                  ₹{loan.loanAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] uppercase font-bold block">Outstanding Principal</span>
                <span className="text-base font-black text-zinc-950 font-mono">
                  ₹{loan.remainingPrincipal.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] uppercase font-bold block">Monthly Interest Rate</span>
                <span className="text-base font-black text-teal-700 font-mono">
                  {loan.monthlyInterestRate}% / mo
                </span>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] uppercase font-bold block">Next Due Date</span>
                <span className="text-base font-black text-amber-800 font-mono">
                  {loan.dueDate}
                </span>
              </div>
            </div>

            {/* Collateral Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-700 pt-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Pledged Collateral: <strong>{loan.totalWeightGrams} grams</strong> ({loan.goldItems.map(g => g.name).join(', ')}) &middot; Packet ID: <strong className="font-mono">{loan.safePacketNumber}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePay(loan)}
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        ))}

        {myLoans.length === 0 && (
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-12 text-center text-zinc-400 text-xs">
            No loans found under this account.
          </div>
        )}
      </div>

    </div>
  );
};
