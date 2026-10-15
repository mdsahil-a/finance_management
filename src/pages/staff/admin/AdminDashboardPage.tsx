import React from 'react';
import { Link } from 'react-router-dom';
import { useDemoData } from '../../../context/DemoDataContext';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { 
  FileText, 
  Scale, 
  UserCheck, 
  CreditCard, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  AlertCircle,
  TrendingUp,
  Receipt,
  Layers
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { applications, transactions, staffUsers, assessments, activityLogs } = useDemoData();

  // Metrics calculated directly from actual shared records
  const totalApps = applications.length;
  const awaitingAssessment = applications.filter(
    (a) => a.status === 'Submitted' || a.status === 'Awaiting Gold Assessment' || a.status === 'Returned for Gold Correction'
  ).length;
  const awaitingFinalEntry = applications.filter((a) => a.status === 'Awaiting Final Entry').length;
  const awaitingReview = applications.filter((a) => a.status === 'Awaiting Authorized Review').length;
  const pendingDisbursements = applications.filter((a) => a.status === 'Awaiting Demo Disbursement').length;
  const totalTxns = transactions.length;
  const activeStaffCount = staffUsers.filter((s) => s.isActive).length;

  const totalDisbursedValue = transactions
    .filter((t) => t.type === 'Disbursement')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#701525] font-display">
            Super Administrator Command Center
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Complete executive oversight across physical gold appraisals, operator entries, sanctions, and cashier payouts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/staff/admin/applications"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-sm"
          >
            Review Applications Queue ({awaitingReview})
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid (7 Key Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Total Apps</span>
          <span className="text-2xl font-black text-[#701525]">{totalApps}</span>
          <span className="text-[10px] text-gray-400 block truncate">All registered files</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Weighing Queue</span>
          <span className="text-2xl font-black text-amber-600">{awaitingAssessment}</span>
          <span className="text-[10px] text-gray-400 block truncate">At Gold Weighter</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Final Entry</span>
          <span className="text-2xl font-black text-purple-700">{awaitingFinalEntry}</span>
          <span className="text-[10px] text-gray-400 block truncate">At Operator</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-[#A71930] shadow-sm space-y-1 bg-rose-50/20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A71930] block">Awaiting Review</span>
          <span className="text-2xl font-black text-[#A71930]">{awaitingReview}</span>
          <span className="text-[10px] text-[#A71930] font-semibold block truncate">Requires Sanction</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Pending Payout</span>
          <span className="text-2xl font-black text-emerald-700">{pendingDisbursements}</span>
          <span className="text-[10px] text-gray-400 block truncate">In Cashier queue</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block">Transactions</span>
          <span className="text-2xl font-black text-gray-900">{totalTxns}</span>
          <span className="text-[10px] text-gray-400 block truncate">Total payouts/receipts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Active Staff</span>
          <span className="text-2xl font-black text-blue-700">{activeStaffCount}</span>
          <span className="text-[10px] text-gray-400 block truncate">Across 4 roles</span>
        </div>
      </div>

      {/* Operational Pipeline Progress Visualizer */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-gray-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#701525] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C9A45C]" />
            <span>End-to-End Operational Pipeline Distribution</span>
          </h3>
          <span className="text-xs text-gray-500 font-mono">Real-time sync</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-xs text-amber-900 font-bold block">1. Gold Appraisal</span>
            <div className="text-xl font-black text-amber-700 mt-1">{awaitingAssessment} files</div>
            <p className="text-[11px] text-amber-800/80 mt-1">Pending physical gross & net weighing by Gold Weighter.</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <span className="text-xs text-purple-900 font-bold block">2. Final Entry Verification</span>
            <div className="text-xl font-black text-purple-700 mt-1">{awaitingFinalEntry} files</div>
            <p className="text-[11px] text-purple-800/80 mt-1">Gold appraisal locked; operator checks customer checklist.</p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-xs text-rose-900 font-bold block">3. Authorized Sanction Decision</span>
            <div className="text-xl font-black text-[#A71930] mt-1">{awaitingReview} files</div>
            <p className="text-[11px] text-rose-800/80 mt-1">Super Admin approval decision required for loan sanction.</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs text-emerald-900 font-bold block">4. Cashier Disbursement</span>
            <div className="text-xl font-black text-emerald-700 mt-1">{pendingDisbursements} files</div>
            <p className="text-[11px] text-emerald-800/80 mt-1">Sanctioned files eligible for simulated payout & receipt.</p>
          </div>
        </div>
      </div>

      {/* Grid: Recent Applications & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Applications Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Recent Customer Applications</h3>
              <p className="text-xs text-gray-500">Live synchronization with customer portal</p>
            </div>
            <Link
              to="/staff/admin/applications"
              className="text-xs font-bold text-[#701525] hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Borrower</th>
                  <th className="py-2.5 px-3">Requested</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#701525]">
                      {app.reference}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-gray-900">
                      {app.customer.fullName}
                    </td>
                    <td className="py-2.5 px-3 text-gray-700">
                      {formatCurrency(app.loanPreferences.requestedAmount)}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        to="/staff/admin/applications"
                        className="text-[#701525] font-bold hover:underline"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Cashier Transactions & Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Cashier Transactions</h3>
              <span className="text-xs font-bold text-emerald-700">
                {formatCurrency(totalDisbursedValue)} Disbursed
              </span>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {transactions.slice(0, 4).map((txn) => (
                <div
                  key={txn.id}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-gray-900 block">{txn.transactionReference}</span>
                    <span className="text-[11px] text-gray-500">
                      {txn.type} • {txn.customerName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#701525] block">{formatCurrency(txn.amount)}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{txn.paymentMode.split(' ')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log Snippet */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Recent Audit Trail Activity
              </h3>
              <Link to="/staff/admin/activity-logs" className="text-xs font-bold text-[#701525] hover:underline">
                Full Log
              </Link>
            </div>

            <div className="space-y-2">
              {activityLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="text-xs border-b border-gray-100 pb-2">
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                    <span>{log.employeeName} ({log.employeeRole})</span>
                    <span>{formatDateTime(log.timestamp)}</span>
                  </div>
                  <p className="text-gray-700 mt-0.5">{log.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
