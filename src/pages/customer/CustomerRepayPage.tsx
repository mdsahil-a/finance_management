import React, { useState } from 'react';
import { useCustomerSession } from '../../context/CustomerSessionContext';
import { useDemoData } from '../../context/DemoDataContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { PaymentMode, DemoTransaction } from '../../types';
import { PrintReceiptModal } from '../../components/common/PrintReceiptModal';
import { 
  CreditCard, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Receipt, 
  ShieldCheck, 
  Vault, 
  Download,
  Calendar,
  Sparkles,
  Check
} from 'lucide-react';

export const CustomerRepayPage: React.FC = () => {
  const { currentCustomer } = useCustomerSession();
  const { loans, recordRepayment, transactions, custodyRecords, staffUsers } = useDemoData();

  // Find customer's loans
  const customerLoans = loans.filter(
    (l) => l.customerName === currentCustomer?.fullName
  );

  const activeLoans = customerLoans.filter(
    (l) => l.status === 'Active' || l.status === 'Awaiting Disbursement'
  );

  const [selectedLoanId, setSelectedLoanId] = useState<string>(activeLoans[0]?.id || customerLoans[0]?.id || '');
  const selectedLoan = loans.find(l => l.id === selectedLoanId) || activeLoans[0] || customerLoans[0];

  const [paymentType, setPaymentType] = useState<'INTEREST' | 'PARTIAL' | 'FULL'>('INTEREST');
  const [customAmount, setCustomAmount] = useState<number>(5000);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI — Demo');
  const [createdTxn, setCreatedTxn] = useState<DemoTransaction | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!currentCustomer) {
    return null;
  }

  const principal = selectedLoan?.principalOutstanding || selectedLoan?.sanctionedAmount || 0;
  const annualRate = selectedLoan?.annualInterestRate || 10.5;
  const monthlyInterest = Math.round((principal * annualRate) / 1200);
  const remainingBal = selectedLoan?.remainingBalance || 0;

  // Compute amount based on selected payment type
  const effectiveAmount = 
    paymentType === 'INTEREST' 
      ? Math.min(monthlyInterest, remainingBal)
      : paymentType === 'FULL'
      ? remainingBal
      : customAmount;

  // Custody record for this loan
  const custody = custodyRecords.find(c => c.loanAccountNumber === selectedLoan?.loanAccountNumber || c.applicationReference === selectedLoan?.applicationReference);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan || effectiveAmount <= 0) return;

    // Simulated cashier staff for customer self-service payments
    const cashierStaff = staffUsers.find(s => s.role === 'CASHIER') || {
      id: 'SELF_SERVICE',
      fullName: 'Online Customer Portal Gateway',
      role: 'CASHIER' as const,
      email: 'gateway@aurumgold.internal',
      branchId: selectedLoan.branchId,
      branchName: 'Digital Portal',
      isActive: true,
      lastActive: new Date().toISOString(),
    };

    try {
      const estimatedInterest = Math.min(effectiveAmount, monthlyInterest);
      const principalPart = Math.max(0, effectiveAmount - estimatedInterest);

      const txn = recordRepayment(
        selectedLoan.id,
        effectiveAmount,
        paymentMode,
        `Customer online payment via ${paymentMode} (${paymentType === 'FULL' ? 'Full Settlement' : paymentType === 'INTEREST' ? 'Monthly Interest' : 'Part Payment'})`,
        cashierStaff,
        {
          principalComponent: principalPart,
          interestComponent: estimatedInterest,
        }
      );

      setCreatedTxn(txn);
      setShowReceiptModal(true);
      setSuccessMessage(
        paymentType === 'FULL' || effectiveAmount === remainingBal
          ? `Loan account ${selectedLoan.loanAccountNumber} is now FULLY SETTLED! Your pledged gold is queued for release.`
          : `Simulated repayment of ${formatCurrency(effectiveAmount)} was recorded successfully.`
      );
    } catch (err: any) {
      alert(err.message || 'Error processing online payment.');
    }
  };

  // Transactions for this loan
  const loanTxns = transactions.filter(t => 
    t.loanAccountNumber === selectedLoan?.loanAccountNumber ||
    t.customerName === currentCustomer.fullName
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-[#701525] font-display">
          Online Loan Servicing & Repayment
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Service monthly interest, make partial principal repayments, or execute full loan settlement to retrieve your pledged gold.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block">Payment Processed Successfully</span>
              <span>{successMessage}</span>
            </div>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {customerLoans.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E2D8] shadow-sm space-y-3">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-700">No Active Gold Loans Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Once your loan application is sanctioned and disbursed, you can track balances and make repayments here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Repayment Action Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Account Selector */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Select Loan Account</label>
                <select
                  value={selectedLoan?.id || ''}
                  onChange={(e) => {
                    setSelectedLoanId(e.target.value);
                    setSuccessMessage(null);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono font-bold text-sm text-gray-900 outline-none focus:border-[#701525]"
                >
                  {customerLoans.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.loanAccountNumber} — {l.schemeName || 'Gold Loan'} ({l.status} • Bal: {formatCurrency(l.remainingBalance)})
                    </option>
                  ))}
                </select>
              </div>

              {selectedLoan && (
                <div className="p-5 rounded-2xl bg-[#FAF8F3] border border-[#E8E2D8] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 block uppercase tracking-wider">Facility Status</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        selectedLoan.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : selectedLoan.status === 'Closed'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {selectedLoan.status}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-gray-400 block uppercase tracking-wider">Custody Status</span>
                      <span className="text-xs font-bold text-[#701525] flex items-center gap-1 justify-end">
                        <Vault className="w-3.5 h-3.5" />
                        {custody ? `${custody.status} (${custody.vaultLocation})` : 'Pledged in Branch Vault'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Sanctioned</span>
                      <span className="font-bold text-gray-900">{formatCurrency(selectedLoan.sanctionedAmount)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Interest Rate</span>
                      <span className="font-bold text-gray-900">{selectedLoan.annualInterestRate}% p.a.</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Principal Due</span>
                      <span className="font-bold text-gray-800">{formatCurrency(principal)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Remaining</span>
                      <span className="font-black text-[#701525] text-sm">{formatCurrency(remainingBal)}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedLoan && selectedLoan.remainingBalance > 0 ? (
                <form onSubmit={handlePay} className="space-y-5 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 block">Choose Payment Option</label>
                    <div className="grid grid-cols-3 gap-2.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setPaymentType('INTEREST')}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          paymentType === 'INTEREST'
                            ? 'bg-[#701525] text-white border-[#701525] shadow-md'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-[#701525]'
                        }`}
                      >
                        <span className="font-bold block text-xs">Monthly Interest</span>
                        <span className={`text-[10px] block mt-0.5 font-mono ${paymentType === 'INTEREST' ? 'text-[#FFE59E]' : 'text-gray-500'}`}>
                          {formatCurrency(monthlyInterest)}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentType('PARTIAL');
                          setCustomAmount(Math.min(10000, remainingBal));
                        }}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          paymentType === 'PARTIAL'
                            ? 'bg-[#701525] text-white border-[#701525] shadow-md'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-[#701525]'
                        }`}
                      >
                        <span className="font-bold block text-xs">Part Principal</span>
                        <span className={`text-[10px] block mt-0.5 ${paymentType === 'PARTIAL' ? 'text-[#FFE59E]' : 'text-gray-500'}`}>
                          Custom Amount
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentType('FULL')}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          paymentType === 'FULL'
                            ? 'bg-[#C9A45C] text-[#58101d] border-[#C9A45C] font-black shadow-md'
                            : 'bg-[#C9A45C]/10 border-[#C9A45C]/40 text-[#701525] hover:bg-[#C9A45C]/20'
                        }`}
                      >
                        <span className="font-bold block text-xs">Full Settlement</span>
                        <span className="text-[10px] block mt-0.5 font-mono font-bold">
                          {formatCurrency(remainingBal)}
                        </span>
                      </button>
                    </div>
                  </div>

                  {paymentType === 'PARTIAL' && (
                    <div className="space-y-1 text-xs">
                      <label className="font-bold text-gray-700 block">Enter Custom Repayment Amount (₹) *</label>
                      <input
                        type="number"
                        min="100"
                        max={remainingBal}
                        value={customAmount}
                        onChange={(e) => setCustomAmount(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-mono font-black text-lg text-[#701525] outline-none focus:border-[#701525]"
                        required
                      />
                      <span className="text-[10px] text-gray-400">
                        Remaining balance limit: {formatCurrency(remainingBal)}
                      </span>
                    </div>
                  )}

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-gray-700 block">Payment Method *</label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-xs outline-none focus:border-[#701525]"
                    >
                      <option value="UPI — Demo">Simulated UPI (Google Pay, PhonePe, Paytm)</option>
                      <option value="Bank Transfer — Demo">Simulated Net Banking / IMPS</option>
                      <option value="Cash — Demo">Simulated Counter Cash Receipt</option>
                    </select>
                  </div>

                  {/* Summary of what will happen */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payable Today:</span>
                      <span className="font-mono font-black text-[#701525] text-base">{formatCurrency(effectiveAmount)}</span>
                    </div>
                    {paymentType === 'FULL' && (
                      <p className="text-[11px] text-emerald-800 flex items-center gap-1.5 pt-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Gold Retrieval Guarantee:</strong> Once settled, your gold articles will be released by the Vault Custody Officer upon presenting your settlement receipt at the branch counter.</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-[#701525] hover:bg-[#58101d] transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-[#FFE59E]" />
                    <span>Pay {formatCurrency(effectiveAmount)} (Simulated Gateway)</span>
                  </button>
                </form>
              ) : (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-sm">Loan Account Fully Settled!</h4>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                    Outstanding balance is ₹0. Your pledged jewellery packet is ready for collection at the branch counter.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Statement & Repayment History (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#701525]" />
                Customer Statement of Transactions
              </h3>

              <div className="space-y-3">
                {loanTxns.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">No transactions logged for this account yet.</p>
                ) : (
                  loanTxns.map((txn) => (
                    <div key={txn.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-gray-900">{txn.transactionReference}</span>
                        <span className={`font-mono font-black ${
                          txn.type === 'Disbursement' ? 'text-[#701525]' : 'text-emerald-700'
                        }`}>
                          {txn.type === 'Disbursement' ? '+' : '-'}{formatCurrency(txn.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>{txn.type} via {txn.paymentMode}</span>
                        <span className="font-mono">{formatDateTime(txn.recordedAt)}</span>
                      </div>
                      {txn.receiptNumber && (
                        <div className="pt-1 flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-200 mt-1">
                          <span>Receipt: {txn.receiptNumber}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setCreatedTxn(txn);
                              setShowReceiptModal(true);
                            }}
                            className="font-bold text-[#701525] hover:underline"
                          >
                            View Voucher
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && createdTxn && (
        <PrintReceiptModal
          transaction={createdTxn}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};
