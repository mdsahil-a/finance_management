import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import {
  Coins,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  PlusCircle,
  Wallet,
  MessageCircle,
  Printer,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Calculator
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    loans,
    payments,
    settings,
    dayBook,
    setIsNewLoanModalOpen,
    setIsPaymentModalOpen,
    setSelectedLoanForPayment,
    setSelectedPaymentForPrint,
  } = useFinance();

  // Key Calculations
  const activeLoans = loans.filter((l) => l.status !== 'Fully Paid');
  const totalLoanMoneyGiven = activeLoans.reduce((acc, l) => acc + l.remainingPrincipal, 0);
  const totalInterestCollected = payments.reduce((acc, p) => acc + p.interestPaid, 0);

  const safeLoans = loans.filter((l) => l.safeStatus === 'In Safe');
  const totalGoldGramsInSafe = safeLoans.reduce((acc, l) => acc + l.totalWeightGrams, 0);
  const totalPacketsInSafe = safeLoans.length;

  const dueLoans = loans.filter((l) => l.status === 'Due Soon' || l.status === 'Overdue');

  // Today's Day Book Cash
  const cashInToday = dayBook
    .filter((d) => d.direction === 'IN')
    .reduce((acc, d) => acc + d.amount, 0);
  const cashOutToday = dayBook
    .filter((d) => d.direction === 'OUT')
    .reduce((acc, d) => acc + d.amount, 0);
  const currentCashInDrawer = cashInToday - cashOutToday;

  // WhatsApp Reminder Generator
  const sendWhatsAppReminder = (phone: string, name: string, loanId: string, interestAmt: number, dueDate: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const text = encodeURIComponent(
      `Namaste ${name} ji,\nThis is a reminder from ${settings.shopName}.\nYour monthly gold loan interest of ₹${interestAmt.toLocaleString('en-IN')} for loan #${loanId} is due on ${dueDate}.\nPlease visit the shop or pay via UPI to keep your gold loan active.\nThank you!`
    );
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Finance Counter</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Gold Loan Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Issue loans, collect interest, manage gold safe, and print instant slips.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNewLoanModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Give New Loan</span>
            </button>

            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Wallet className="w-4 h-4" />
              <span>Collect Payment</span>
            </button>

            <button
              onClick={() => navigate('/calculator')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Calculator</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Money Given */}
        <div 
          onClick={() => navigate('/loans')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Loan Money Given
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ₹{totalLoanMoneyGiven.toLocaleString('en-IN')}
            </span>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              <span><strong>{activeLoans.length}</strong> Active Loans open right now</span>
            </p>
          </div>
        </div>

        {/* Card 2: Interest Collected (Profit) */}
        <div 
          onClick={() => navigate('/daybook')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Interest Collected
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              ₹{totalInterestCollected.toLocaleString('en-IN')}
            </span>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span>Earnings from monthly interest payments</span>
            </p>
          </div>
        </div>

        {/* Card 3: Gold in Safe */}
        <div 
          onClick={() => navigate('/safe')}
          className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-5 shadow-lg cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Gold in Safe Locker
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {totalGoldGramsInSafe.toFixed(1)} <span className="text-base font-normal text-slate-400">grams</span>
            </span>
            <p className="text-xs text-slate-400 mt-1">
              <strong>{totalPacketsInSafe}</strong> packets locked safely in safe
            </p>
          </div>
        </div>

        {/* Card 4: Payments Due */}
        <div 
          onClick={() => navigate('/loans?filter=due')}
          className="bg-slate-900 border border-slate-800 hover:border-rose-500/40 rounded-2xl p-5 shadow-lg cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Interest Due / Overdue
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className={`text-2xl sm:text-3xl font-black tracking-tight ${dueLoans.length > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
              {dueLoans.length} <span className="text-base font-normal text-slate-400">loans</span>
            </span>
            <p className="text-xs text-slate-400 mt-1">
              Need customer reminder or follow-up
            </p>
          </div>
        </div>

      </div>

      {/* 2-Column Section: Due Payment Reminders & Today's Cash Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Loans Needing Attention / Payment Due */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Payment Due Reminders</h3>
              <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                {dueLoans.length} Customers
              </span>
            </div>
            <button
              onClick={() => navigate('/loans')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View All Loans</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {dueLoans.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              All active loans are up to date! No pending dues.
            </div>
          ) : (
            <div className="space-y-3">
              {dueLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/60 gap-3 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{loan.id}</span>
                      <span className="font-bold text-sm text-white truncate">{loan.customerName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        loan.status === 'Overdue' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {loan.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                      <span>Phone: <strong className="text-slate-200">{loan.customerPhone}</strong></span>
                      <span className="text-slate-600">·</span>
                      <span>Principal: <strong>₹{loan.remainingPrincipal.toLocaleString('en-IN')}</strong></span>
                      <span className="text-slate-600">·</span>
                      <span>Interest Due: <strong className="text-rose-400">₹{(loan.interestDue || loan.monthlyInterestAmount).toLocaleString('en-IN')}</strong></span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* WhatsApp Reminder Button */}
                    <button
                      onClick={() =>
                        sendWhatsAppReminder(
                          loan.customerPhone,
                          loan.customerName,
                          loan.id,
                          loan.interestDue || loan.monthlyInterestAmount,
                          loan.dueDate
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-colors"
                      title="Send WhatsApp Reminder"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    {/* Collect Payment Button */}
                    <button
                      onClick={() => {
                        setSelectedLoanForPayment(loan);
                        setIsPaymentModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      <span>Collect</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Today's Cash Box / Drawer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Today's Cash Box</h3>
              </div>
              <button
                onClick={() => navigate('/daybook')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300"
              >
                Day Book
              </button>
            </div>

            <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <span className="text-xs text-slate-300 block">Cash in Counter Right Now:</span>
              <span className="text-3xl font-black text-emerald-400 tracking-tight">
                ₹{currentCashInDrawer.toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Based on today's cash in & cash out transactions</p>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-lg">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                  Cash Received Today (+):
                </span>
                <span className="font-bold text-emerald-400">₹{cashInToday.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-lg">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ArrowUpRight className="w-4 h-4 text-rose-400" />
                  Loans Given Today (-):
                </span>
                <span className="font-bold text-rose-400">₹{cashOutToday.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/daybook')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition-colors text-center"
            >
              Open Full Daily Cash Book &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* Recent Payments & Slips Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Recent Payments & Slips</h3>
          </div>
          <span className="text-xs text-slate-400">Click any receipt to reprint slip</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-800/60 text-slate-400 text-left">
              <tr>
                <th className="p-3 font-semibold">Receipt #</th>
                <th className="p-3 font-semibold">Date & Time</th>
                <th className="p-3 font-semibold">Customer</th>
                <th className="p-3 font-semibold">Loan #</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold text-right">Amount Paid</th>
                <th className="p-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {payments.slice(0, 5).map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-amber-400">{payment.receiptNumber}</td>
                  <td className="p-3 text-slate-400">{payment.paymentDate} · {payment.paymentTime}</td>
                  <td className="p-3 font-bold text-white">{payment.customerName}</td>
                  <td className="p-3 font-mono text-slate-300">{payment.loanId}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {payment.paymentType}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-white">
                    ₹{payment.totalPaid.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedPaymentForPrint(payment);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
                      title="Reprint receipt"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Slip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
