import React, { useState, useMemo } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { useStaffSession } from '../../../context/StaffSessionContext';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { 
  DollarSign, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Coins, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface DenominationRow {
  label: string;
  value: number;
  count: number;
}

export const CashierReconciliationPage: React.FC = () => {
  const { transactions, reconciliations, saveCashReconciliation, branches } = useDemoData();
  const { currentStaff } = useStaffSession();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [openingBalance, setOpeningBalance] = useState<number>(50000);
  const [notes, setNotes] = useState<string>('Daily drawer count performed at close of business.');
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // Denomination counter state
  const [denominations, setDenominations] = useState<DenominationRow[]>([
    { label: '₹2,000', value: 2000, count: 0 },
    { label: '₹500', value: 500, count: 0 },
    { label: '₹200', value: 200, count: 0 },
    { label: '₹100', value: 100, count: 0 },
    { label: '₹50', value: 50, count: 0 },
    { label: '₹20', value: 20, count: 0 },
    { label: '₹10', value: 10, count: 0 },
    { label: 'Coins', value: 1, count: 0 },
  ]);

  // Filter transactions for chosen date and Cash payment mode
  const dayTransactions = useMemo(() => {
    return transactions.filter(t => {
      const txnDate = t.recordedAt.split('T')[0];
      return txnDate === selectedDate && t.paymentMode === 'Cash — Demo';
    });
  }, [transactions, selectedDate]);

  const cashRepayments = useMemo(() => {
    return dayTransactions
      .filter(t => t.type === 'Repayment')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [dayTransactions]);

  const cashDisbursements = useMemo(() => {
    return dayTransactions
      .filter(t => t.type === 'Disbursement')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [dayTransactions]);

  const expectedClosing = openingBalance + cashRepayments - cashDisbursements;

  const countedTotalFromDenominations = useMemo(() => {
    return denominations.reduce((sum, d) => sum + d.value * d.count, 0);
  }, [denominations]);

  const [useCustomTotal, setUseCustomTotal] = useState<boolean>(false);
  const [manualCountedTotal, setManualCountedTotal] = useState<number>(0);

  const physicalCounted = useCustomTotal ? manualCountedTotal : countedTotalFromDenominations;
  const discrepancy = physicalCounted - expectedClosing;

  const handleDenomChange = (index: number, val: number) => {
    const updated = [...denominations];
    updated[index].count = Math.max(0, Math.floor(val || 0));
    setDenominations(updated);
  };

  const handleQuickPresetBalanced = () => {
    setUseCustomTotal(true);
    setManualCountedTotal(expectedClosing);
  };

  const handleSubmitReconciliation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStaff) return;

    const branch = branches.find(b => b.id === currentStaff.branchId) || {
      id: currentStaff.branchId || 'BR001',
      name: currentStaff.branchName || 'Central Branch',
    };

    const status = discrepancy === 0 ? 'Balanced' : 'Discrepancy Pending Review';

    saveCashReconciliation({
      date: selectedDate,
      branchId: branch.id,
      branchName: branch.name,
      cashierId: currentStaff.id,
      cashierName: currentStaff.fullName,
      openingBalance,
      totalCashReceived: cashRepayments,
      totalCashDisbursed: cashDisbursements,
      expectedClosingBalance: expectedClosing,
      physicalCountedBalance: physicalCounted,
      discrepancy,
      status,
      notes: `${notes} [Denominations counted: ${physicalCounted}]`,
      closedAt: new Date().toISOString(),
    });

    setSubmissionSuccess(true);
    setTimeout(() => setSubmissionSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#701525]/10 text-[#701525]">
              Daily Operations
            </span>
            <span className="text-xs text-gray-400 font-mono">End of Day Till Balance</span>
          </div>
          <h1 className="text-2xl font-black text-[#701525] font-display mt-1">
            Cashier Till & Cash Drawer Reconciliation
          </h1>
          <p className="text-xs text-gray-500">
            Reconcile physical branch vault cash with electronic loan disbursements and repayments before daily sign-off.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-600">Reconciliation Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-mono font-bold text-gray-800 outline-none focus:border-[#701525]"
          />
        </div>
      </div>

      {submissionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold block">Till Reconciliation Submitted Successfully</span>
              <span>The record has been forwarded to the Branch Manager for official evening sign-off.</span>
            </div>
          </div>
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Opening Drawer</span>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <input
              type="number"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(Number(e.target.value) || 0)}
              className="font-black text-xl text-gray-900 border-b border-dashed border-gray-300 w-32 focus:outline-none focus:border-[#701525]"
            />
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">Editable opening till base</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Cash Repayments</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-emerald-700">{formatCurrency(cashRepayments)}</p>
          <span className="text-[10px] text-gray-400 mt-1 block">Cash collections today</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Cash Disbursed</span>
            <ArrowUpRight className="w-4 h-4 text-[#701525]" />
          </div>
          <p className="text-xl font-black text-[#701525]">{formatCurrency(cashDisbursements)}</p>
          <span className="text-[10px] text-gray-400 mt-1 block">Cash payouts today</span>
        </div>

        <div className="bg-gradient-to-br from-[#FAF8F3] to-[#F3EFE6] p-5 rounded-2xl border border-[#C9A45C]/40 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Expected Closing</span>
            <Calculator className="w-4 h-4 text-[#C9A45C]" />
          </div>
          <p className="text-xl font-black text-gray-900">{formatCurrency(expectedClosing)}</p>
          <span className="text-[10px] text-gray-500 mt-1 block font-mono">Opening + Inflow - Outflow</span>
        </div>
      </div>

      {/* Main Reconciliation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Denomination Counter (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#C9A45C]" />
                Physical Currency Note Count
              </h2>
              <p className="text-xs text-gray-500">Itemize the currency notes in the cashier drawer.</p>
            </div>
            <button
              type="button"
              onClick={handleQuickPresetBalanced}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#C9A45C] text-[#701525] font-bold hover:bg-[#FAF8F3] transition-colors"
            >
              Preset to Exact Balance
            </button>
          </div>

          {!useCustomTotal ? (
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-[11px] font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-100">
                <span className="col-span-4">Denomination</span>
                <span className="col-span-4 text-center">Note Count</span>
                <span className="col-span-4 text-right">Subtotal (₹)</span>
              </div>

              {denominations.map((d, idx) => (
                <div key={d.label} className="grid grid-cols-12 items-center text-xs py-1.5 hover:bg-gray-50/60 rounded-lg px-1">
                  <span className="col-span-4 font-mono font-bold text-gray-800">{d.label}</span>
                  <div className="col-span-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={d.count === 0 ? '' : d.count}
                      placeholder="0"
                      onChange={(e) => handleDenomChange(idx, Number(e.target.value))}
                      className="w-20 px-2.5 py-1 text-center font-mono font-bold border border-gray-200 rounded-lg outline-none focus:border-[#701525]"
                    />
                  </div>
                  <span className="col-span-4 text-right font-mono font-bold text-gray-900">
                    {formatCurrency(d.value * d.count)}
                  </span>
                </div>
              ))}

              <div className="pt-3 border-t border-gray-200 flex justify-between items-center font-bold text-xs">
                <span className="text-gray-700">Total Counted via Denominations:</span>
                <span className="font-mono text-base font-black text-[#701525]">
                  {formatCurrency(countedTotalFromDenominations)}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-900">Manual Direct Cash Count</span>
                <button
                  type="button"
                  onClick={() => setUseCustomTotal(false)}
                  className="text-[11px] text-[#701525] underline font-bold"
                >
                  Switch back to denomination breakdown
                </button>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600 block">Total Physical Cash in Drawer (₹):</label>
                <input
                  type="number"
                  value={manualCountedTotal}
                  onChange={(e) => setManualCountedTotal(Number(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-mono font-black text-xl text-gray-900 outline-none focus:border-[#701525]"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setUseCustomTotal(!useCustomTotal)}
              className="text-xs text-gray-500 hover:text-gray-800 underline block"
            >
              {useCustomTotal ? 'Itemize by note denominations' : 'Enter direct manual lump-sum total instead'}
            </button>
          </div>
        </div>

        {/* Right: Discrepancy & Submission (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Closing Status Verification</h2>

            {/* Live discrepancy badge */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              discrepancy === 0
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : discrepancy > 0
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-3">
                {discrepancy === 0 ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-xs block">
                    {discrepancy === 0
                      ? 'Till Perfectly Balanced'
                      : discrepancy > 0
                      ? `Cash Surplus Detected (+${formatCurrency(discrepancy)})`
                      : `Cash Shortage Detected (${formatCurrency(discrepancy)})`}
                  </span>
                  <span className="text-[11px] opacity-80">
                    {discrepancy === 0
                      ? 'Physical cash matches system transactions.'
                      : 'Variance must be justified with remarks for Branch Manager review.'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">System Expected Cash:</span>
                <span className="font-mono font-bold text-gray-900">{formatCurrency(expectedClosing)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Physical Counted Cash:</span>
                <span className="font-mono font-bold text-[#701525]">{formatCurrency(physicalCounted)}</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold">
                <span className="text-gray-700">Variance / Discrepancy:</span>
                <span className={`font-mono ${discrepancy === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {discrepancy >= 0 ? `+${formatCurrency(discrepancy)}` : formatCurrency(discrepancy)}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmitReconciliation} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Cashier Closing Remarks *</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Explain discrepancies or note operational details..."
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#701525]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-[#701525] hover:bg-[#58101d] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#FFE59E]" />
                <span>Submit Daily Till to Branch Manager</span>
              </button>
            </form>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-[11px] text-gray-500 space-y-1">
            <span className="font-bold text-gray-700 block">Auditing & Compliance Policy:</span>
            <p>
              Branch Manager countersignature is required before end-of-day system lock. Any variance beyond ₹50 requires mandatory investigation and notation in the compliance ledger.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Reconciliations Register */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#701525]" />
          Reconciliation Register & Manager Sign-Off History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Branch</th>
                <th className="py-2.5">Cashier</th>
                <th className="py-2.5 text-right">Expected</th>
                <th className="py-2.5 text-right">Physical Count</th>
                <th className="py-2.5 text-right">Discrepancy</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5">Manager Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reconciliations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No past till reconciliations on record.
                  </td>
                </tr>
              ) : (
                reconciliations.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 font-mono font-bold text-gray-900">{rec.date}</td>
                    <td className="py-3 text-gray-700">{rec.branchName}</td>
                    <td className="py-3 text-gray-600">{rec.cashierName}</td>
                    <td className="py-3 text-right font-mono text-gray-700">{formatCurrency(rec.expectedClosingBalance)}</td>
                    <td className="py-3 text-right font-mono font-bold text-gray-900">{formatCurrency(rec.physicalCountedBalance)}</td>
                    <td className={`py-3 text-right font-mono font-bold ${
                      rec.discrepancy === 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      {rec.discrepancy >= 0 ? `+${formatCurrency(rec.discrepancy)}` : formatCurrency(rec.discrepancy)}
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.status === 'Manager Approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : rec.status === 'Balanced'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-[11px] max-w-xs truncate">
                      {rec.managerRemarks || rec.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
