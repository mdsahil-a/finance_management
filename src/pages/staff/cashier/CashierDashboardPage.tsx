import React from 'react';
import { Link } from 'react-router-dom';
import { useDemoData } from '../../../context/DemoDataContext';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { 
  CreditCard, 
  RotateCcw, 
  Receipt, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Clock,
  TrendingUp,
  History
} from 'lucide-react';

export const CashierDashboardPage: React.FC = () => {
  const { applications, transactions, loans } = useDemoData();

  const pendingDisbursements = applications.filter((a) => a.status === 'Awaiting Demo Disbursement');

  const disbursementTxns = transactions.filter((t) => t.type === 'Disbursement');
  const repaymentTxns = transactions.filter((t) => t.type === 'Repayment');

  const totalDisbursedValue = disbursementTxns.reduce((acc, t) => acc + t.amount, 0);
  const totalRepaidValue = repaymentTxns.reduce((acc, t) => acc + t.amount, 0);
  const netTurnover = totalDisbursedValue + totalRepaidValue;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#701525] font-display">
            Cashier & Payment Operations Terminal
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Simulate loan disbursements, process customer repayments, and issue formal receipts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/staff/cashier/pending"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-sm"
          >
            Disbursement Queue ({pendingDisbursements.length})
          </Link>
          <Link
            to="/staff/cashier/repayments"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Record Repayment
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-1 bg-emerald-50/20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Pending Payouts</span>
          <span className="text-2xl font-black text-emerald-700">{pendingDisbursements.length}</span>
          <span className="text-[10px] text-emerald-600 font-semibold block truncate">Sanctioned & Ready</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Demo Disbursements</span>
          <span className="text-2xl font-black text-[#701525]">{disbursementTxns.length}</span>
          <span className="text-[10px] text-gray-400 block truncate">{formatCurrency(totalDisbursedValue)} Total</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Demo Repayments</span>
          <span className="text-2xl font-black text-teal-700">{repaymentTxns.length}</span>
          <span className="text-[10px] text-gray-400 block truncate">{formatCurrency(totalRepaidValue)} Collected</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Total Transactions</span>
          <span className="text-2xl font-black text-gray-900">{transactions.length}</span>
          <span className="text-[10px] text-gray-400 block truncate">Audit-logged vouchers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Total Demo Turnover</span>
          <span className="text-xl sm:text-2xl font-black text-gray-900 truncate block">{formatCurrency(netTurnover)}</span>
          <span className="text-[10px] text-gray-400 block truncate">Disbursed + Repaid</span>
        </div>
      </div>

      {/* Grid: Pending Disbursements & Recent Vouchers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pending Eligible Disbursements (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Eligible Disbursements Queue</h3>
              <p className="text-xs text-gray-500">Sanctioned by Super Admin, ready for simulated cashier payout</p>
            </div>
            <Link to="/staff/cashier/pending" className="text-xs font-bold text-[#701525] hover:underline">
              View All ({pendingDisbursements.length}) →
            </Link>
          </div>

          {pendingDisbursements.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-xs text-gray-500">No applications pending disbursement at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingDisbursements.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-[#701525] text-sm block">{app.reference}</span>
                    <span className="font-bold text-gray-900">{app.customer.fullName}</span>
                    <span className="text-gray-500 block mt-0.5">
                      Pledged: {app.goldDetails.itemsCount} {app.goldDetails.category} ({app.goldDetails.purity})
                    </span>
                  </div>

                  <div className="text-right space-y-2">
                    <span className="text-lg font-black text-emerald-800 block">
                      {formatCurrency(app.authorizedDecision?.sanctionedAmount || app.loanPreferences.requestedAmount)}
                    </span>
                    <Link
                      to={`/staff/cashier/disbursements?ref=${app.reference}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#701525] text-white hover:bg-[#58101d] shadow-2xs"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Disburse Loan</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Cashier Transactions (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Recent Transactions</h3>
              <p className="text-xs text-gray-500">Real-time payment vouchers</p>
            </div>
            <Link to="/staff/cashier/transactions" className="text-xs font-bold text-[#701525] hover:underline">
              History →
            </Link>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 4).map((txn) => (
              <div
                key={txn.id}
                className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      txn.type === 'Disbursement' ? 'bg-purple-100 text-purple-800' : 'bg-teal-100 text-teal-800'
                    }`}>
                      {txn.type}
                    </span>
                    <span className="font-mono font-bold text-gray-900">{txn.transactionReference}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{txn.customerName}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{txn.receiptNumber} • {formatDateTime(txn.recordedAt)}</p>
                </div>

                <div className="text-right">
                  <span className="font-black text-[#701525] text-sm block">
                    {formatCurrency(txn.amount)}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">{txn.paymentMode.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
