import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import {
  Wallet,
  ShieldCheck,
  Calendar,
  CreditCard,
  Receipt,
  PhoneCall,
  Clock,
  Printer,
  ChevronRight,
  Info,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Payment } from '../../types/finance';

export const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentCustomer,
    loans,
    payments,
    setIsPaymentModalOpen,
    setSelectedLoanForPayment,
    setSelectedPaymentForPrint,
    setActivePrintModal,
    settings,
  } = useFinance();

  // STRICT SECURITY & PRIVACY FILTER:
  // Customers only see their OWN loans and payment records!
  const myLoans = loans.filter(
    (l) => l.customerName === currentCustomer.name || l.customerPhone === currentCustomer.phone
  );

  const myPayments = payments.filter(
    (p) =>
      p.customerName.toLowerCase() === currentCustomer.name.toLowerCase() ||
      p.customerPhone === currentCustomer.phone
  );

  const activeLoans = myLoans.filter((l) => l.status !== 'Fully Paid');
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.remainingPrincipal, 0);
  const totalPledgedGold = myLoans.reduce((sum, l) => sum + l.totalWeightGrams, 0);

  // Next payment due
  const nextDueLoan = activeLoans[0];
  const nextDueDate = nextDueLoan?.dueDate || 'N/A';
  const nextDueAmount = nextDueLoan?.monthlyInterestAmount || 0;

  const handlePayNow = (loan: typeof myLoans[0]) => {
    setSelectedLoanForPayment(loan);
    setIsPaymentModalOpen(true);
  };

  const handlePrintSlip = (payment: Payment) => {
    setSelectedPaymentForPrint(payment);
    setActivePrintModal('PAYMENT_RECEIPT');
  };

  return (
    <div className="space-y-6">
      
      {/* Muthoot-Style Customer Greeting & Header */}
      <PageHeader
        title={`Welcome, ${currentCustomer.name}`}
        subtitle={`Borrower ID: ${currentCustomer.id} &middot; Registered Mobile: ${currentCustomer.phone}`}
        badge={{ label: 'Customer Self-Service Portal', color: 'bg-teal-100 text-teal-900 border border-teal-200' }}
        actions={
          activeLoans.length > 0 ? (
            <button
              onClick={() => handlePayNow(activeLoans[0])}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span>Pay Interest Online (₹{nextDueAmount.toLocaleString('en-IN')})</span>
            </button>
          ) : undefined
        }
      />

      {/* 4 Customer Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Outstanding Principal */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Outstanding Balance</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-950 font-heading">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
            <span className="font-bold text-teal-700">{activeLoans.length} active loan account</span>
            <span className="text-zinc-300">·</span>
            <span>Zero Overdue</span>
          </div>
        </div>

        {/* Card 2: Next Payment Due */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Next Payment Due</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 font-heading">
            ₹{nextDueAmount.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
            <span className="font-bold text-zinc-900">Due date: {nextDueDate}</span>
            <span className="text-zinc-300">·</span>
            <span className="text-emerald-700 font-medium">Monthly Interest</span>
          </div>
        </div>

        {/* Card 3: Pledged Gold Collateral */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pledged Gold in Vault</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-950 font-heading">
            {totalPledgedGold.toFixed(2)} <span className="text-base font-semibold text-zinc-500">grams</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
            <span className="font-bold text-emerald-700">Sealed Safe Custody</span>
            <span className="text-zinc-300">·</span>
            <span>100% Insured</span>
          </div>
        </div>

        {/* Card 4: Account Status */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Account Health</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 font-heading">
            Standard Pass
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
            <span className="font-bold text-zinc-900">Eligible for Top-up Loan</span>
            <span className="text-zinc-300">·</span>
            <span>KYC Verified</span>
          </div>
        </div>

      </div>

      {/* Customer Loan Accounts Details Card */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2 font-heading">
              <CreditCard className="w-4 h-4 text-teal-700" />
              <span>My Gold Loan Accounts</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Complete breakdown of sanctioned amount, remaining balance, interest rate, and due dates.
            </p>
          </div>
          <span className="text-xs font-bold text-zinc-600">
            Assigned Branch: Mumbai Fort Flagship (#101)
          </span>
        </div>

        <div className="space-y-4">
          {myLoans.map((loan) => (
            <div
              key={loan.id}
              className="p-4 sm:p-5 border border-zinc-200/80 rounded-2xl bg-zinc-50/40 hover:bg-zinc-50/70 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-200/70">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-black text-zinc-950 font-mono">
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
                    <span className="text-[10px] font-medium text-zinc-500">
                      Sanctioned: {loan.loanDate}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">
                    Gold Collateral: <strong className="text-zinc-900">{loan.totalWeightGrams} grams</strong> ({loan.goldItems.map(g => g.name).join(', ')}) &middot; Packet: <strong className="font-mono text-zinc-700">{loan.safePacketNumber}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      Remaining Principal
                    </span>
                    <span className="text-xl font-black text-zinc-950 font-mono">
                      ₹{loan.remainingPrincipal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    onClick={() => handlePayNow(loan)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Pay Interest Online
                  </button>
                </div>
              </div>

              {/* Loan Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
                <div>
                  <span className="text-zinc-400 text-[10px] uppercase block">Sanctioned Loan</span>
                  <span className="font-bold text-zinc-900 font-mono">₹{loan.loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] uppercase block">Monthly Interest Rate</span>
                  <span className="font-bold text-zinc-900 font-mono">{loan.monthlyInterestRate}% / month</span>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] uppercase block">Monthly Interest Amount</span>
                  <span className="font-bold text-teal-700 font-mono">₹{loan.monthlyInterestAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] uppercase block">Next Payment Due</span>
                  <span className="font-bold text-amber-800 font-mono">{loan.dueDate}</span>
                </div>
              </div>
            </div>
          ))}

          {myLoans.length === 0 && (
            <div className="py-8 text-center text-zinc-400 text-xs">
              No active gold loans found under this account.
            </div>
          )}
        </div>
      </div>

      {/* Two-Column Grid: Recent Payments & Customer Notice Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Repayment History & Official Slips */}
        <div className="lg:col-span-7 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2 font-heading">
                <Receipt className="w-4 h-4 text-teal-700" />
                <span>My Repayment History & Tax Slips</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Official branch payment receipts available for online verification.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {myPayments.length} Slips
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px] pr-1">
            {myPayments.map((p) => (
              <div
                key={p.id}
                className="p-3 border border-zinc-200 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 transition-colors flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-950">{p.receiptNumber}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-800">
                      {p.paymentType}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">
                    {p.paymentDate} &middot; Via {p.paymentMethod} &middot; Loan #{p.loanId}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-black font-mono text-zinc-950">
                    ₹{p.totalPaid.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => handlePrintSlip(p)}
                    className="p-1.5 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-200/70 rounded-md transition-colors cursor-pointer"
                    title="View & Print Official Receipt"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {myPayments.length === 0 && (
              <div className="py-8 text-center text-zinc-400 text-xs">
                No repayment transactions recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Right: Important Customer Notices & Branch Desk Contact */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Notice Card */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Timely Interest Rebate Scheme</span>
            </div>
            <p className="text-zinc-600 leading-relaxed text-[11px]">
              Borrowers paying monthly interest on or before the 15th of every month receive a 0.25% prompt repayment rebate on the annual interest rate.
            </p>
          </div>

          {/* Safe Custody Guarantee */}
          <div className="p-4 bg-zinc-950 text-white rounded-2xl text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Lock className="w-4 h-4" />
              <span>100% Insured Safe Vault Custody</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Your pledged gold ornaments are stored in grade-A biometric dual-custody safes insured by National Insurance Co. Ltd.
            </p>
          </div>

          {/* Branch Contact Card */}
          <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl text-xs space-y-2 shadow-xs">
            <span className="font-bold text-zinc-900 block font-heading">
              Assigned Servicing Branch
            </span>
            <div className="text-zinc-600 space-y-1 text-[11px]">
              <p><strong>Branch:</strong> Mumbai Fort Flagship (#101)</p>
              <p><strong>Address:</strong> 42, Veer Nariman Road, Fort, Mumbai - 400001</p>
              <p><strong>Phone:</strong> +91 98765 43210 &middot; <strong>Hours:</strong> 9:30 AM - 6:30 PM (Mon-Sat)</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
