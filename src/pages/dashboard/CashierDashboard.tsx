import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import {
  Wallet,
  Coins,
  Clock,
  Printer,
  Search,
  CheckCircle2,
  ArrowUpRight,
  Receipt,
  CreditCard,
  Building2,
  FileText,
  User,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  X,
  Banknote
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Payment, LoanApplication, PaymentMethod } from '../../types/finance';

export const CashierDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    loans,
    payments,
    dayBook,
    applications,
    disburseLoan,
    setIsPaymentModalOpen,
    setSelectedLoanForPayment,
    setSelectedPaymentForPrint,
    setSelectedLoanForPrint,
    setActivePrintModal,
    currentStaff,
  } = useFinance();

  // Quick Loan / Customer Lookup state
  const [lookupQuery, setLookupQuery] = useState('');

  // Disbursement Modal State for Step 4
  const [selectedAppForDisburse, setSelectedAppForDisburse] = useState<LoanApplication | null>(null);
  const [disburseAmount, setDisburseAmount] = useState<string>('0');
  const [disburseMethod, setDisburseMethod] = useState<PaymentMethod>('Cash');
  const [disburseRef, setDisburseRef] = useState<string>('');
  const [disburseNotes, setDisburseNotes] = useState('');
  const [disburseError, setDisburseError] = useState<string | null>(null);
  const [disburseSuccess, setDisburseSuccess] = useState<string | null>(null);

  // Filter approved applications awaiting cashier disbursement
  const approvedQueue = applications.filter(
    (a) => a.status === 'AWAITING_DISBURSEMENT' || a.status === 'APPROVED'
  );

  // Calculations
  const todayCollections = dayBook
    .filter((d) => d.direction === 'IN')
    .reduce((sum, d) => sum + d.amount, 0);

  const todayDisbursements = dayBook
    .filter((d) => d.direction === 'OUT')
    .reduce((sum, d) => sum + d.amount, 0);

  const physicalCashDrawer = todayCollections - todayDisbursements;
  const activeLoans = loans.filter((l) => l.status !== 'Fully Paid');

  // Filtered loans for quick lookup
  const matchedLoans = lookupQuery.trim()
    ? loans.filter(
        (l) =>
          l.id.toLowerCase().includes(lookupQuery.toLowerCase()) ||
          l.customerName.toLowerCase().includes(lookupQuery.toLowerCase()) ||
          l.customerPhone.includes(lookupQuery)
      )
    : [];

  const handleOpenPayment = (loan: typeof loans[0]) => {
    setSelectedLoanForPayment(loan);
    setIsPaymentModalOpen(true);
  };

  const handleReprintReceipt = (payment: Payment) => {
    setSelectedPaymentForPrint(payment);
    setActivePrintModal('PAYMENT_RECEIPT');
  };

  // Open Disbursement Modal (Step 4)
  const handleOpenDisburseModal = (app: LoanApplication) => {
    setSelectedAppForDisburse(app);
    setDisburseError(null);
    setDisburseSuccess(null);
    const approvedAmt = app.approvalDecision?.approvedAmount || app.requestedAmount;
    setDisburseAmount(String(approvedAmt));
    setDisburseMethod('Cash');
    setDisburseRef(`TXN-${Date.now().toString().slice(-6)}`);
    setDisburseNotes(`Disbursement authorized by ${app.approvalDecision?.approvedByStaffName || 'Branch Manager'}`);
  };

  const handleConfirmDisbursement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForDisburse) return;
    setDisburseError(null);

    const numAmount = parseFloat(disburseAmount) || 0;
    const result = disburseLoan(selectedAppForDisburse.id, {
      disbursedAmount: numAmount,
      paymentMethod: disburseMethod,
      transactionReference: disburseRef,
      notes: disburseNotes,
    });

    if (!result.success || !result.loan) {
      setDisburseError(result.error || 'Failed to disburse loan.');
      return;
    }

    setDisburseSuccess(`Loan ${result.loan.id} successfully disbursed (₹${numAmount.toLocaleString('en-IN')})! Daybook debited.`);
    const createdLoan = result.loan;

    setTimeout(() => {
      setSelectedAppForDisburse(null);
      setDisburseSuccess(null);
      setSelectedLoanForPrint(createdLoan);
      setActivePrintModal('LOAN_SLIP');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="Cashier Counter & Day Book"
        subtitle="Step 4 & Step 7: Approved loan disbursement, cash drawer management, interest collections, and official receipts."
        badge={{ label: 'Counter Station #1 (Active Teller)', color: 'bg-emerald-100 text-emerald-900 border border-emerald-200' }}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span>Collect Payment (F2)</span>
            </button>
          </div>
        }
      />

      {/* 4 Summary Metrics Cards for Cashier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Awaiting Disbursement</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 font-heading">
            {approvedQueue.length} <span className="text-base font-semibold text-zinc-500">loans</span>
          </div>
          <div className="mt-2 text-xs text-zinc-500">Manager-approved sanction queue</div>
        </div>

        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Inflow</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 font-heading">
            ₹{todayCollections.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-xs text-zinc-500">Repayments & interest received</div>
        </div>

        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Disbursements</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-950 font-heading">
            ₹{todayDisbursements.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-xs text-zinc-500">Capital disbursed from drawer</div>
        </div>

        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cash Drawer Tally</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-950 font-mono">
            ₹{physicalCashDrawer.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-xs text-zinc-500">Net physical balance at counter</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: STEP 4 APPROVED LOANS AWAITING DISBURSEMENT */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-emerald-300 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-extrabold text-zinc-950 font-heading">
                Step 4 Queue: Approved Loans Awaiting Disbursement
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Sanctioned by Branch Manager. Verify approved loan amount and terms, execute payout, and issue loan voucher.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            {approvedQueue.length} Ready for Payout
          </span>
        </div>

        {approvedQueue.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 text-xs">
            No approved loans currently awaiting disbursement. Newly sanctioned loans from Step 3 will appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {approvedQueue.map((app) => (
              <div
                key={app.id}
                className="p-4 border border-zinc-200 rounded-2xl bg-zinc-50/60 hover:bg-zinc-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-black text-xs text-zinc-950 px-2 py-0.5 bg-zinc-200 rounded">
                      {app.id}
                    </span>
                    <strong className="text-sm font-bold text-zinc-900">{app.customerName}</strong>
                    <span className="text-xs text-zinc-500 font-mono">({app.customerPhone})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full">
                      Manager Approved
                    </span>
                  </div>

                  <div className="text-xs text-zinc-600 flex flex-wrap gap-x-4 gap-y-1 pt-1">
                    <span>Approved Principal: <strong className="text-emerald-800 font-mono text-sm">₹{(app.approvalDecision?.approvedAmount || app.requestedAmount).toLocaleString('en-IN')}</strong></span>
                    <span>&middot;</span>
                    <span>Monthly Rate: <strong className="text-zinc-900">{app.approvalDecision?.monthlyInterestRate || 1.5}%/mo</strong></span>
                    <span>&middot;</span>
                    <span>Collateral: <strong>{app.appraisalDetails?.totalNetWeight || 0}g net gold</strong></span>
                    <span>&middot;</span>
                    <span>Approved by: <strong>{app.approvalDecision?.approvedByStaffName || 'Branch Manager'}</strong></span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDisburseModal(app)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Disburse Loan (Step 4)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* QUICK LOAN LOOKUP & INTEREST COLLECTION (STEP 7) */}
      {/* ========================================================================= */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-zinc-950 font-heading">
              Step 7: Borrower Loan Balance Lookup & Repayment
            </h2>
            <p className="text-xs text-zinc-500">
              Type loan number (e.g. LN-1001), customer mobile, or name to calculate balance and collect payment.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="Search LN-1001, phone, name..."
              className="w-full pl-9 pr-3 py-2 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 rounded-xl text-xs outline-none font-bold"
            />
          </div>
        </div>

        {matchedLoans.length > 0 && (
          <div className="border border-zinc-200 rounded-xl divide-y divide-zinc-100 overflow-hidden">
            {matchedLoans.map((loan) => (
              <div key={loan.id} className="p-3 bg-zinc-50/50 hover:bg-zinc-100/50 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-zinc-900 mr-2">{loan.id}</span>
                  <strong className="text-zinc-950">{loan.customerName}</strong>
                  <span className="text-zinc-500 text-[11px] ml-2 font-mono">{loan.customerPhone}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-zinc-900">
                    Remaining: ₹{loan.remainingPrincipal.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => handleOpenPayment(loan)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                  >
                    Collect Payment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* RECENT COUNTER TRANSACTIONS */}
      {/* ========================================================================= */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-zinc-950 font-heading">
            Recent Counter Day Book Entries
          </h2>
          <span className="text-xs text-zinc-400">Cash book verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-600 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-2 px-3">Time</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Mode</th>
                <th className="py-2 px-3 text-right">Inflow</th>
                <th className="py-2 px-3 text-right">Outflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {dayBook.slice(0, 5).map((d) => (
                <tr key={d.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-2 px-3 text-zinc-500 font-mono">{d.time}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      d.direction === 'IN' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'
                    }`}>
                      {d.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-medium text-zinc-800">{d.description}</td>
                  <td className="py-2 px-3 text-zinc-500">{d.paymentMethod}</td>
                  <td className="py-2 px-3 text-right font-black font-mono text-emerald-700">
                    {d.direction === 'IN' ? `₹${d.amount.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="py-2 px-3 text-right font-black font-mono text-zinc-900">
                    {d.direction === 'OUT' ? `₹${d.amount.toLocaleString('en-IN')}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DISBURSEMENT EXECUTION MODAL (STEP 4) */}
      {/* ========================================================================= */}
      {selectedAppForDisburse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-zinc-200 text-zinc-900 rounded-3xl w-full max-w-lg my-8 overflow-hidden shadow-2xl flex flex-col">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Banknote className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-950">
                    Step 4: Execute Loan Disbursement
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Payout for Application <strong className="font-mono text-zinc-900">{selectedAppForDisburse.id}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppForDisburse(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {disburseError && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{disburseError}</span>
              </div>
            )}
            {disburseSuccess && (
              <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{disburseSuccess}</span>
              </div>
            )}

            <form onSubmit={handleConfirmDisbursement} className="p-6 space-y-4 text-xs">
              
              {/* Approved Terms Summary (Read-Only) */}
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Borrower:</span>
                  <strong className="text-zinc-900">{selectedAppForDisburse.customerName} ({selectedAppForDisburse.customerPhone})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Manager-Approved Limit:</span>
                  <strong className="text-emerald-800 font-mono text-sm">
                    ₹{(selectedAppForDisburse.approvalDecision?.approvedAmount || selectedAppForDisburse.requestedAmount).toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Monthly Interest Rate:</span>
                  <span className="font-bold text-zinc-900">
                    {selectedAppForDisburse.approvalDecision?.monthlyInterestRate || 1.5}% per month (Locked)
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-200/60">
                  <span>Approved By:</span>
                  <span>{selectedAppForDisburse.approvalDecision?.approvedByStaffName || 'Branch Manager'}</span>
                </div>
              </div>

              {/* Cashier input: Actual payout amount */}
              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Actual Disbursement Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    max={selectedAppForDisburse.approvalDecision?.approvedAmount || selectedAppForDisburse.requestedAmount}
                    value={disburseAmount}
                    onChange={(e) => setDisburseAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-zinc-200 rounded-xl font-mono font-black text-sm text-zinc-950 focus:border-emerald-600 outline-none"
                  />
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  Cannot exceed the manager-approved ceiling. Cashier cannot alter appraisal or loan rates.
                </span>
              </div>

              {/* Payment Mode & Reference */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Payout Method *
                  </label>
                  <select
                    value={disburseMethod}
                    onChange={(e) => setDisburseMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-bold text-xs"
                  >
                    <option value="Cash">Cash (Drawer Payout)</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="UPI / GPay">UPI / Instant Online</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Transaction / Cheque Ref # *
                  </label>
                  <input
                    type="text"
                    required
                    value={disburseRef}
                    onChange={(e) => setDisburseRef(e.target.value)}
                    placeholder="e.g. TXN-994821"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-mono font-bold text-xs"
                  />
                </div>
              </div>

              {/* Cashier Notes */}
              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Cashier Remarks
                </label>
                <input
                  type="text"
                  value={disburseNotes}
                  onChange={(e) => setDisburseNotes(e.target.value)}
                  placeholder="e.g. Customer signature verified on counter register"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                />
              </div>

              {/* Segregation Banner */}
              <div className="p-3 bg-emerald-50/60 rounded-xl text-[11px] text-emerald-900 border border-emerald-200 font-medium">
                Under financial compliance rules, successful disbursement automatically logs an immutable daybook transaction and triggers <strong>Safe Vault Packaging & Activation (Step 5)</strong>.
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setSelectedAppForDisburse(null)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-700 font-bold rounded-full cursor-pointer hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Execute Disbursement & Print Slip</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
