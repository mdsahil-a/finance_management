import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PaymentType, PaymentMethod } from '../../types/finance';
import { 
  X, 
  Wallet, 
  CheckCircle2, 
  Sparkles
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
  const [customPrincipal, setCustomPrincipal] = useState<string>('');
  const [interestAmountToPay, setInterestAmountToPay] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');

  // Sync loan selection
  useEffect(() => {
    if (selectedLoanForPayment) {
      setLoanId(selectedLoanForPayment.id);
    } else if (eligibleLoans.length > 0 && !loanId) {
      setLoanId(eligibleLoans[0].id);
    }
  }, [selectedLoanForPayment, eligibleLoans]);

  const activeLoan = loans.find((l) => l.id === loanId);

  // When active loan or paymentType changes, pre-fill defaults
  useEffect(() => {
    if (activeLoan) {
      const defaultInterest = activeLoan.interestDue > 0 ? activeLoan.interestDue : activeLoan.monthlyInterestAmount;
      setInterestAmountToPay(defaultInterest.toString());

      if (paymentType === 'Full Settlement') {
        setCustomPrincipal(activeLoan.remainingPrincipal.toString());
      } else if (paymentType === 'Interest Only') {
        setCustomPrincipal('0');
      } else {
        // Part loan
        if (!customPrincipal || customPrincipal === '0' || parseFloat(customPrincipal) === activeLoan.remainingPrincipal) {
          setCustomPrincipal(Math.min(10000, activeLoan.remainingPrincipal).toString());
        }
      }
    }
  }, [activeLoan, paymentType]);

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
      alert('Please select a loan');
      return;
    }
    if (totalPayment <= 0) {
      alert('Payment amount must be greater than 0');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Collect Payment</h2>
              <p className="text-xs text-slate-400">Record customer interest or loan settlement in 2 clicks</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* Pick Loan */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Select Loan / Customer *
            </label>
            <select
              value={loanId}
              onChange={(e) => setLoanId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {eligibleLoans.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.id} — {l.customerName} ({l.customerPhone}) · Remaining: ₹{l.remainingPrincipal.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          {activeLoan && (
            <>
              {/* Current Status Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Customer:</span>
                  <span className="text-sm font-bold text-white">{activeLoan.customerName}</span>
                  <span className="text-[11px] text-slate-400 block">{activeLoan.customerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Remaining Loan:</span>
                  <span className="text-sm font-bold text-amber-300">
                    ₹{activeLoan.remainingPrincipal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-slate-400 block">Original: ₹{activeLoan.loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Monthly Interest:</span>
                  <span className="text-sm font-bold text-white">
                    ₹{activeLoan.monthlyInterestAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-slate-400 block">({activeLoan.monthlyInterestRate}% / mo)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Unpaid Interest Due:</span>
                  <span className={`text-sm font-bold ${activeLoan.interestDue > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ₹{activeLoan.interestDue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-slate-400 block">Status: {activeLoan.status}</span>
                </div>
              </div>

              {/* 3 Payment Options */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Payment Type:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Option 1: Pay Interest Only */}
                  <label
                    className={`flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentType === 'Interest Only'
                        ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 text-white'
                        : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <input
                        type="radio"
                        name="paymentType"
                        value="Interest Only"
                        checked={paymentType === 'Interest Only'}
                        onChange={() => setPaymentType('Interest Only')}
                        className="text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                        Regular
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white">Pay Interest Only</span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      Keeps loan active. Advances due date by 1 month.
                    </span>
                  </label>

                  {/* Option 2: Pay Part Loan */}
                  <label
                    className={`flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentType === 'Part Loan'
                        ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30 text-white'
                        : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <input
                        type="radio"
                        name="paymentType"
                        value="Part Loan"
                        checked={paymentType === 'Part Loan'}
                        onChange={() => setPaymentType('Part Loan')}
                        className="text-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <span className="text-sm font-bold text-white">Pay Part of Loan</span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      Reduces principal loan balance and pays interest.
                    </span>
                  </label>

                  {/* Option 3: Full Settlement */}
                  <label
                    className={`flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentType === 'Full Settlement'
                        ? 'bg-blue-500/10 border-blue-500 ring-2 ring-blue-500/30 text-white'
                        : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <input
                        type="radio"
                        name="paymentType"
                        value="Full Settlement"
                        checked={paymentType === 'Full Settlement'}
                        onChange={() => setPaymentType('Full Settlement')}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <span className="text-sm font-bold text-white">Full Settlement</span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      Closes loan completely. Ready to return gold!
                    </span>
                  </label>
                </div>
              </div>

              {/* Amount Breakdown Input */}
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paymentType !== 'Interest Only' && (
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Principal Loan Amount to Pay (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={activeLoan.remainingPrincipal}
                        value={customPrincipal}
                        onChange={(e) => setCustomPrincipal(e.target.value)}
                        disabled={paymentType === 'Full Settlement'}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-75"
                      />
                    </div>
                  )}

                  <div className={paymentType === 'Interest Only' ? 'col-span-2' : ''}>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Interest Amount to Pay (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={interestAmountToPay}
                      onChange={(e) => setInterestAmountToPay(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Total Payment Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl gap-2">
                  <div>
                    <span className="text-xs text-slate-300 block">Total Amount Paid Right Now:</span>
                    <span className="text-2xl font-black text-emerald-400">
                      ₹{totalPayment.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-slate-400 block">Remaining Balance After:</span>
                    <span className="text-base font-bold text-white">
                      ₹{remainingAfter.toLocaleString('en-IN')}
                    </span>
                    {remainingAfter === 0 && (
                      <span className="text-emerald-400 font-bold block text-[11px]">
                        ✓ Loan will be marked as Closed & Settled!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Payment Received Via
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white"
                  >
                    <option value="Cash">Cash (Received in counter)</option>
                    <option value="UPI / GPay">UPI / GPay / PhonePe</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Payment Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Paid in full"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Receiving Cashier Staff Attribution */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">Payment Being Received By (Counter Staff):</span>
                <span className="font-bold text-amber-300">
                  {currentStaff.name} ({currentStaff.role.replace('_', ' ')})
                </span>
              </div>
            </>
          )}

          {/* Footer Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-950 text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Payment & Print Slip</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
