import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { useStaffSession } from '../../../context/StaffSessionContext';
import { PaymentMode, DemoTransaction, DemoLoanAccount } from '../../../types';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { PrintReceiptModal } from '../../../components/common/PrintReceiptModal';
import { 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard,
  Receipt,
  Check
} from 'lucide-react';

export const CashierRepaymentsPage: React.FC = () => {
  const { loans, recordRepayment, transactions } = useDemoData();
  const { currentStaff } = useStaffSession();

  const [searchAccountQuery, setSearchAccountQuery] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<DemoLoanAccount | null>(loans[0] || null);
  const [repaymentAmount, setRepaymentAmount] = useState<number>(10000);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI — Demo');
  const [notes, setNotes] = useState('Customer part-repayment at branch counter.');
  const [createdTxn, setCreatedTxn] = useState<DemoTransaction | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  const activeLoans = loans.filter((l) => l.status === 'Active' || l.status === 'Awaiting Disbursement');

  const filteredLoans = activeLoans.filter(
    (l) =>
      l.loanAccountNumber.toLowerCase().includes(searchAccountQuery.toLowerCase()) ||
      l.customerName.toLowerCase().includes(searchAccountQuery.toLowerCase()) ||
      l.applicationReference.toLowerCase().includes(searchAccountQuery.toLowerCase())
  );

  const remainingBalance = selectedLoan?.remainingBalance || 0;
  const isAmountValid = repaymentAmount > 0 && repaymentAmount <= remainingBalance;

  const handleRepay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan || !currentStaff || !isAmountValid) return;

    try {
      const estimatedInterest = Math.min(
        repaymentAmount,
        Math.round((selectedLoan.sanctionedAmount * selectedLoan.annualInterestRate) / 1200)
      );
      const principalPart = Math.max(0, repaymentAmount - estimatedInterest);

      const txn = recordRepayment(
        selectedLoan.id,
        repaymentAmount,
        paymentMode,
        notes,
        currentStaff,
        {
          principalComponent: principalPart,
          interestComponent: estimatedInterest,
        }
      );
      setCreatedTxn(txn);
      setReceiptModalOpen(true);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error processing repayment.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#701525] font-display">
          Record Demo Loan Repayment
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Collect simulated loan repayments, decrement outstanding balances in real time, and generate official customer receipts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Select Loan & Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xl space-y-6">
          <div className="space-y-4">
            <div className="space-y-1 text-xs">
              <label className="font-bold text-gray-700 block">Select Active Loan Account *</label>
              <select
                value={selectedLoan?.id || ''}
                onChange={(e) => {
                  const found = loans.find((l) => l.id === e.target.value);
                  if (found) {
                    setSelectedLoan(found);
                    setRepaymentAmount(Math.min(10000, found.remainingBalance));
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono font-bold text-xs outline-none focus:border-[#701525]"
              >
                {activeLoans.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.loanAccountNumber} — {l.customerName} (Bal: {formatCurrency(l.remainingBalance)})
                  </option>
                ))}
              </select>
            </div>

            {selectedLoan && (
              <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E2D8] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Customer</span>
                  <span className="font-bold text-gray-900">{selectedLoan.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Sanctioned</span>
                  <span className="font-bold text-gray-900">{formatCurrency(selectedLoan.sanctionedAmount)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Principal Due</span>
                  <span className="font-black text-gray-800">{formatCurrency(selectedLoan.principalOutstanding || selectedLoan.remainingBalance)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Total Outstanding</span>
                  <span className="font-black text-[#701525] text-sm">{formatCurrency(selectedLoan.remainingBalance)}</span>
                </div>
              </div>
            )}

            {/* Quick Action Payment Types */}
            {selectedLoan && (
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 text-xs block">Repayment Category</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const monthlyInterest = Math.round((selectedLoan.sanctionedAmount * selectedLoan.annualInterestRate) / 1200);
                      setRepaymentAmount(Math.min(monthlyInterest, selectedLoan.remainingBalance));
                      setNotes(`Monthly interest service on ${selectedLoan.loanAccountNumber}`);
                    }}
                    className="p-2.5 rounded-xl border border-gray-200 text-center hover:border-[#701525] hover:bg-[#701525]/5 text-xs transition-all"
                  >
                    <span className="font-bold block text-gray-800">Monthly Interest</span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      ~{formatCurrency(Math.round((selectedLoan.sanctionedAmount * selectedLoan.annualInterestRate) / 1200))}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRepaymentAmount(Math.min(25000, selectedLoan.remainingBalance));
                      setNotes(`Part principal payment on ${selectedLoan.loanAccountNumber}`);
                    }}
                    className="p-2.5 rounded-xl border border-gray-200 text-center hover:border-[#701525] hover:bg-[#701525]/5 text-xs transition-all"
                  >
                    <span className="font-bold block text-gray-800">Part Principal</span>
                    <span className="text-[10px] text-gray-500">Principal reduction</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRepaymentAmount(selectedLoan.remainingBalance);
                      setNotes(`Full settlement and foreclosure of ${selectedLoan.loanAccountNumber}`);
                    }}
                    className="p-2.5 rounded-xl border border-[#C9A45C] bg-[#C9A45C]/10 text-center hover:bg-[#C9A45C]/20 text-xs transition-all"
                  >
                    <span className="font-bold block text-[#701525]">Full Foreclosure</span>
                    <span className="text-[10px] text-[#701525] font-mono font-bold">
                      {formatCurrency(selectedLoan.remainingBalance)}
                    </span>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleRepay} className="space-y-4 text-xs pt-2">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-gray-700">Repayment Collection Amount (₹) *</label>
                  <span className="text-[10px] text-gray-500">
                    Max: {formatCurrency(remainingBalance)}
                  </span>
                </div>
                <input
                  type="number"
                  min="100"
                  max={remainingBalance}
                  value={repaymentAmount}
                  onChange={(e) => setRepaymentAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-black text-xl text-[#701525] outline-none focus:border-[#701525]"
                  required
                />
              </div>

              {/* Principal vs Interest estimated breakdown */}
              {selectedLoan && repaymentAmount > 0 && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Estimated Interest Allocation</span>
                    <span className="font-bold text-amber-700">
                      {formatCurrency(Math.min(repaymentAmount, Math.round((selectedLoan.sanctionedAmount * selectedLoan.annualInterestRate) / 1200)))}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 block text-[10px]">Principal Reduction</span>
                    <span className="font-bold text-emerald-700">
                      {formatCurrency(Math.max(0, repaymentAmount - Math.min(repaymentAmount, Math.round((selectedLoan.sanctionedAmount * selectedLoan.annualInterestRate) / 1200))))}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Payment Channel / Mode *</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-xs outline-none focus:border-[#701525]"
                >
                  <option value="UPI — Demo">UPI — Demo (Virtual QR / App)</option>
                  <option value="Cash — Demo">Cash — Demo (Branch Counter)</option>
                  <option value="Bank Transfer — Demo">Bank Transfer — Demo (Direct IMPS)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Cashier Remarks & Voucher Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Received counter collection. Signed acknowledgement taken."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-[#701525]"
                />
              </div>

              {repaymentAmount === remainingBalance && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Full Settlement Trigger:</strong> This payment will settle the loan account in full and automatically initiate the Pledged Gold Release queue in the Vault Custody console.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedLoan || !isAmountValid}
                className={`w-full py-3.5 rounded-xl font-bold text-xs text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                  selectedLoan && isAmountValid
                    ? 'bg-[#701525] hover:bg-[#58101d]'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <RotateCcw className="w-4 h-4 text-[#FFE59E]" />
                <span>Record Repayment & Generate Official Voucher</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Repayments History (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Recent Repayments Vouchers
          </h3>

          <div className="space-y-2.5">
            {transactions.filter((t) => t.type === 'Repayment').length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No repayment transactions logged yet.</p>
            ) : (
              transactions
                .filter((t) => t.type === 'Repayment')
                .slice(0, 5)
                .map((txn) => (
                  <div key={txn.id} className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-gray-900">{txn.transactionReference}</span>
                      <span className="font-black text-emerald-700">{formatCurrency(txn.amount)}</span>
                    </div>
                    <p className="text-gray-600">{txn.customerName} • {txn.paymentMode}</p>
                    <span className="text-[10px] text-gray-400 font-mono block">{formatDateTime(txn.recordedAt)}</span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {receiptModalOpen && createdTxn && (
        <PrintReceiptModal
          transaction={createdTxn}
          onClose={() => setReceiptModalOpen(false)}
        />
      )}
    </div>
  );
};
