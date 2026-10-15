import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDemoData } from '../../../context/DemoDataContext';
import { useStaffSession } from '../../../context/StaffSessionContext';
import { PaymentMode, DemoTransaction, CustomerApplication } from '../../../types';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { PrintReceiptModal } from '../../../components/common/PrintReceiptModal';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Printer, 
  Building2,
  ShieldCheck
} from 'lucide-react';

export const CashierDisbursementsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefillRef = searchParams.get('ref') || '';
  const { applications, recordDisbursement } = useDemoData();
  const { currentStaff } = useStaffSession();
  const navigate = useNavigate();

  const [selectedRef, setSelectedRef] = useState(prefillRef);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Bank Transfer — Demo');
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('Simulated loan disbursement payout.');
  const [createdTxn, setCreatedTxn] = useState<DemoTransaction | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Eligible applications for disbursement
  const eligibleApps = applications.filter((a) => a.status === 'Awaiting Demo Disbursement');

  const selectedApp = applications.find(
    (a) => a.reference.toUpperCase() === selectedRef.toUpperCase()
  );

  useEffect(() => {
    if (prefillRef) {
      setSelectedRef(prefillRef);
    } else if (eligibleApps.length > 0 && !selectedRef) {
      setSelectedRef(eligibleApps[0].reference);
    }
  }, [prefillRef, eligibleApps]);

  useEffect(() => {
    if (selectedApp) {
      const authAmount = selectedApp.authorizedDecision?.sanctionedAmount || selectedApp.loanPreferences.requestedAmount;
      setAmount(authAmount);
    }
  }, [selectedApp]);

  const maxAllowedAmount = selectedApp?.authorizedDecision?.sanctionedAmount || selectedApp?.loanPreferences.requestedAmount || 0;
  const isAmountValid = amount > 0 && amount <= maxAllowedAmount;

  const handleDisburse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !currentStaff || !isAmountValid) return;

    try {
      const txn = recordDisbursement(
        selectedApp.reference,
        amount,
        paymentMode,
        notes,
        currentStaff
      );
      setCreatedTxn(txn);
      setReceiptModalOpen(true);
    } catch (err) {
      console.error(err);
      alert('Error recording disbursement.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#701525] font-display">
          Execute Simulated Loan Disbursement
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Issue simulated payout against Super Admin sanctioned loan applications and generate formal transaction vouchers.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2D8] shadow-xl space-y-6">
        {/* Step 1: Select Eligible Application */}
        <div className="space-y-1 text-xs">
          <label className="font-bold text-gray-700 block">Select Sanctioned Application *</label>
          {eligibleApps.length === 0 && !selectedApp ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>No applications currently eligible for disbursement. Super Admin must authorize an application first.</span>
            </div>
          ) : (
            <select
              value={selectedRef}
              onChange={(e) => setSelectedRef(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none font-mono font-bold text-xs"
            >
              {eligibleApps.map((a) => (
                <option key={a.id} value={a.reference}>
                  {a.reference} — {a.customer.fullName} ({formatCurrency(a.authorizedDecision?.sanctionedAmount || a.loanPreferences.requestedAmount)})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Selected Application Snapshot */}
        {selectedApp && (
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px]">Borrower Name</span>
              <span className="font-bold text-gray-900">{selectedApp.customer.fullName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Authorized Sanction</span>
              <span className="font-black text-emerald-800">{formatCurrency(maxAllowedAmount)}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Pledged Ornaments</span>
              <span className="text-gray-800">{selectedApp.goldDetails.itemsCount} {selectedApp.goldDetails.category}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Status</span>
              <span className="font-bold text-[#701525]">{selectedApp.status}</span>
            </div>
          </div>
        )}

        {/* Disbursement Parameters Form */}
        <form onSubmit={handleDisburse} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-gray-700">Disbursement Amount (₹) *</label>
              <input
                type="number"
                min="1000"
                max={maxAllowedAmount}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none font-black text-lg text-emerald-800"
                required
              />
              <span className="text-[10px] text-gray-400">
                Cannot exceed authorized sanction: {formatCurrency(maxAllowedAmount)}
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Simulated Payment Mode *</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none font-bold text-xs"
              >
                <option value="Bank Transfer — Demo">Bank Transfer — Demo (NEFT / RTGS)</option>
                <option value="UPI — Demo">UPI — Demo (Instant Virtual VPA)</option>
                <option value="Cash — Demo">Cash — Demo (Branch Counter Cash)</option>
              </select>
              <span className="text-[10px] text-gray-400">No real funds are transferred</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-700">Cashier Transaction Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Disbursed against valid sanction certificate."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedApp || !isAmountValid || selectedApp.status === 'Disbursed — Demo'}
            className={`w-full py-3.5 rounded-xl font-bold text-xs text-white transition-all shadow-md flex items-center justify-center gap-2 ${
              selectedApp && isAmountValid && selectedApp.status !== 'Disbursed — Demo'
                ? 'bg-[#701525] hover:bg-[#58101d]'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#FFE59E]" />
            <span>Confirm Simulated Payout & Issue Printable Receipt</span>
          </button>
        </form>
      </div>

      {/* Printable Receipt Modal */}
      {receiptModalOpen && createdTxn && (
        <PrintReceiptModal
          transaction={createdTxn}
          onClose={() => {
            setReceiptModalOpen(false);
            navigate('/staff/cashier');
          }}
        />
      )}
    </div>
  );
};
