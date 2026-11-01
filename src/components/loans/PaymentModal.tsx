import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PaymentType, PaymentMethod } from '../../types/finance';
import { 
  X, 
  Wallet, 
  CheckCircle2, 
  User,
  Clock
} from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    selectedLoanForPayment,
    setSelectedLoanForPayment,
    loans,
    recordPayment,
    setSelectedPaymentForPrint,
    setActivePrintModal,
    currentStaff,
  } = useFinance();

  const eligibleLoans = loans.filter((l) => l.status !== 'Fully Paid');

  const [loanId, setLoanId] = useState<string>('');
  const [paymentType, setPaymentType] = useState<PaymentType>('Interest Only');
  const [customPrincipal, setCustomPrincipal] = useState<string>('0');
  const [interestAmountToPay, setInterestAmountToPay] = useState<string>('0');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');

  // Sync loan selection when modal opens
  useEffect(() => {
    if (isPaymentModalOpen) {
      if (selectedLoanForPayment) {
        setLoanId(selectedLoanForPayment.id);
        const defInterest = selectedLoanForPayment.interestDue > 0 
          ? selectedLoanForPayment.interestDue 
          : selectedLoanForPayment.monthlyInterestAmount;
        setInterestAmountToPay(defInterest.toString());
        setCustomPrincipal('0');
        setPaymentType('Interest Only');
      } else if (eligibleLoans.length > 0) {
        const first = eligibleLoans[0];
        setLoanId(first.id);
        const defInterest = first.interestDue > 0 ? first.interestDue : first.monthlyInterestAmount;
        setInterestAmountToPay(defInterest.toString());
        setCustomPrincipal('0');
        setPaymentType('Interest Only');
      }
    }
  }, [isPaymentModalOpen, selectedLoanForPayment]);

  const activeLoan = loans.find((l) => l.id === loanId);

  // Handle changing payment type
  const handlePaymentTypeChange = (newType: PaymentType) => {
    setPaymentType(newType);
    if (!activeLoan) return;

    if (newType === 'Interest Only') {
      setCustomPrincipal('0');
    } else if (newType === 'Full Settlement') {
      setCustomPrincipal(activeLoan.remainingPrincipal.toString());
    } else if (newType === 'Part Loan') {
      const defaultPart = Math.min(10000, activeLoan.remainingPrincipal);
      setCustomPrincipal(defaultPart.toString());
    }
  };

  // Handle loan change
  const handleLoanChange = (newLoanId: string) => {
    setLoanId(newLoanId);
    const target = loans.find((l) => l.id === newLoanId);
    if (target) {
      const defInterest = target.interestDue > 0 ? target.interestDue : target.monthlyInterestAmount;
      setInterestAmountToPay(defInterest.toString());
      if (paymentType === 'Full Settlement') {
        setCustomPrincipal(target.remainingPrincipal.toString());
      } else if (paymentType === 'Part Loan') {
        setCustomPrincipal(Math.min(10000, target.remainingPrincipal).toString());
      } else {
        setCustomPrincipal('0');
      }
    }
  };

  if (!isPaymentModalOpen) return null;

  const numPrincipal = parseFloat(customPrincipal) || 0;
  const numInterest = parseFloat(interestAmountToPay) || 0;
  const totalPayment = numPrincipal + numInterest;

  const remainingAfter = activeLoan 
    ? Math.max(0, activeLoan.remainingPrincipal - numPrincipal)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLoan) {
      alert('Please select an active loan');
      return;
    }
    if (totalPayment <= 0) {
      alert('Payment collection amount must be greater than zero');
      return;
    }

    const createdPayment = recordPayment({
      loanId: activeLoan.id,
      paymentType,
      principalPaid: numPrincipal,
      interestPaid: numInterest,
      paymentMethod,
      notes,
    });

    setIsPaymentModalOpen(false);
    setSelectedLoanForPayment(null);
    setSelectedPaymentForPrint(createdPayment);
    setActivePrintModal('PAYMENT_RECEIPT');
  };

  const handleClose = () => {
    setIsPaymentModalOpen(false);
    setSelectedLoanForPayment(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-zinc-200/80 text-zinc-900 rounded-3xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200/60 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-zinc-900">Record Customer Payment</h2>
              <p className="text-xs text-zinc-500">Collect monthly interest, principal repayment, or full settlement</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1 text-xs">
          
          {/* Pick Loan */}
          <div>
            <label className="block font-bold text-zinc-700 mb-1.5">
              Select Customer / Loan *
            </label>
            <select
              value={loanId}
              onChange={(e) => handleLoanChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-900 font-bold focus:bg-white focus:border-zinc-950 outline-none transition-all"
            >
              {eligibleLoans.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.id} — {l.customerName} ({l.customerPhone}) · Bal: ₹{l.remainingPrincipal.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          {activeLoan && (
            <>
              {/* Current Status Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-zinc-50/80 border border-zinc-200/80 rounded-2xl">
                <div>
                  <span className="text-zinc-500 block text-[10px] font-semibold">Borrower:</span>
                  <span className="text-xs font-extrabold text-zinc-900 block truncate">{activeLoan.customerName}</span>
                  <span className="text-[11px] text-zinc-400">{activeLoan.customerPhone}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] font-semibold">Outstanding Principal:</span>
                  <span className="text-xs font-extrabold text-zinc-900">
                    ₹{activeLoan.remainingPrincipal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-zinc-400 block">Sanctioned: ₹{activeLoan.loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] font-semibold">Monthly Interest:</span>
                  <span className="text-xs font-extrabold text-zinc-900">
                    ₹{activeLoan.monthlyInterestAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-zinc-400 block">({activeLoan.monthlyInterestRate}% / mo)</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] font-semibold">Unpaid Interest Due:</span>
                  <span className={`text-xs font-extrabold ${activeLoan.interestDue > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                    ₹{activeLoan.interestDue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-zinc-400 block">Due Date: {activeLoan.dueDate}</span>
                </div>
              </div>

              {/* 3 Payment Options */}
              <div className="space-y-2">
                <label className="block font-bold text-zinc-700 uppercase tracking-wider text-[11px]">
                  Select Payment Type:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Option 1: Pay Interest Only */}
                  <label
                    onClick={() => handlePaymentTypeChange('Interest Only')}
                    className={`flex flex-col p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentType === 'Interest Only'
                        ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-400/20 text-zinc-900 shadow-xs'
                        : 'bg-white border-zinc-200/80 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-zinc-900">Pay Interest Only</span>
                      <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                        Monthly
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                      Advances due date by 1 month. Principal unchanged.
                    </span>
                  </label>

                  {/* Option 2: Pay Part Loan */}
                  <label
                    onClick={() => handlePaymentTypeChange('Part Loan')}
                    className={`flex flex-col p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentType === 'Part Loan'
                        ? 'bg-emerald-50/60 border-emerald-400 ring-2 ring-emerald-400/20 text-zinc-900 shadow-xs'
                        : 'bg-white border-zinc-200/80 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-zinc-900">Part Repayment</span>
                      <span className="text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                        Principal + Int
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                      Reduces principal debt balance and covers interest.
                    </span>
                  </label>

                  {/* Option 3: Full Settlement */}
                  <label
                    onClick={() => handlePaymentTypeChange('Full Settlement')}
                    className={`flex flex-col p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentType === 'Full Settlement'
                        ? 'bg-blue-50/60 border-blue-400 ring-2 ring-blue-400/20 text-zinc-900 shadow-xs'
                        : 'bg-white border-zinc-200/80 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-zinc-900">Full Settlement</span>
                      <span className="text-[9px] font-extrabold uppercase bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                        Close Loan
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                      Clears loan in full. Collateral released from vault.
                    </span>
                  </label>
                </div>
              </div>

              {/* Amount Breakdown Input */}
              <div className="bg-zinc-50/80 rounded-2xl p-4.5 border border-zinc-200/80 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentType !== 'Interest Only' && (
                    <div>
                      <label className="block font-bold text-zinc-700 mb-1.5">
                        Principal Repayment (₹) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={activeLoan.remainingPrincipal}
                        value={customPrincipal}
                        onChange={(e) => setCustomPrincipal(e.target.value)}
                        disabled={paymentType === 'Full Settlement'}
                        className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-2xl text-xs text-zinc-900 font-extrabold focus:border-zinc-950 outline-none disabled:bg-zinc-100 transition-all"
                      />
                    </div>
                  )}

                  <div className={paymentType === 'Interest Only' ? 'col-span-2' : ''}>
                    <label className="block font-bold text-zinc-700 mb-1.5">
                      Interest Collected (₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={interestAmountToPay}
                      onChange={(e) => setInterestAmountToPay(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-2xl text-xs text-zinc-900 font-extrabold focus:border-zinc-950 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Total Payment Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl gap-2">
                  <div>
                    <span className="text-xs text-zinc-600 font-semibold block">Total Collection Received:</span>
                    <span className="text-2xl font-extrabold text-emerald-900 tracking-tight">
                      ₹{totalPayment.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-zinc-500 block">Remaining Loan Balance After:</span>
                    <span className="text-sm font-extrabold text-zinc-900">
                      ₹{remainingAfter.toLocaleString('en-IN')}
                    </span>
                    {remainingAfter === 0 && (
                      <span className="text-emerald-700 font-bold flex items-center justify-end gap-1 text-[11px] mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Loan will be marked as Closed & Settled!</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-900 font-bold outline-none focus:bg-white focus:border-zinc-950 transition-all"
                  >
                    <option value="Cash">Cash (Received in counter drawer)</option>
                    <option value="UPI / GPay">UPI / GPay / Instant Transfer</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5">
                    Counter Notes / Remarks (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Paid in cash at counter"
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:bg-white focus:border-zinc-950 transition-all"
                  />
                </div>
              </div>

              {/* Receiving Cashier Staff Attribution */}
              <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-medium">Counter Staff Recording Receipt:</span>
                <span className="font-bold text-zinc-900">
                  {currentStaff.name} ({currentStaff.role.replace('_', ' ')})
                </span>
              </div>
            </>
          )}

          {/* Footer Action */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-100 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-xs text-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Payment & Print Slip</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
