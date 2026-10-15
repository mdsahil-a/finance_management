import React from 'react';
import { Link } from 'react-router-dom';
import { useDemoData } from '../../../context/DemoDataContext';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  FileCheck2, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const FinalEntryDashboardPage: React.FC = () => {
  const { applications, finalEntries } = useDemoData();

  const pendingQueue = applications.filter((a) => a.status === 'Awaiting Final Entry');
  const draftsCount = finalEntries.filter((f) => f.status === 'Draft').length;
  const returnedCount = applications.filter((a) => a.status === 'Returned for Gold Correction').length;
  const completedCount = finalEntries.filter((f) => f.status === 'Submitted').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#701525] font-display">
            Final Entry Operator Console
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Conduct multi-point KYC verification, audit appraiser weighing reports, and prepare the loan sanction package.
          </p>
        </div>
        <Link
          to="/staff/final-entry/queue"
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-sm self-start sm:self-auto"
        >
          Review Pending Queue ({pendingQueue.length})
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border-2 border-purple-300 shadow-sm space-y-1 bg-purple-50/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
            Awaiting Final Entry
          </span>
          <div className="text-2xl font-black text-purple-700">
            {pendingQueue.length}
          </div>
          <span className="text-[10px] text-purple-600 font-semibold">Gold appraisal locked</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Saved Operator Drafts
          </span>
          <div className="text-2xl font-black text-gray-800">
            {draftsCount}
          </div>
          <span className="text-[10px] text-gray-400">In-progress checks</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
            Returned for Correction
          </span>
          <div className="text-2xl font-black text-rose-700">
            {returnedCount}
          </div>
          <span className="text-[10px] text-gray-400">Back with Weighter</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Completed Final Entries
          </span>
          <div className="text-2xl font-black text-emerald-700">
            {completedCount}
          </div>
          <span className="text-[10px] text-gray-400">Passed to Super Admin</span>
        </div>
      </div>

      {/* Role Notice & Duties */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-[11px] font-bold border border-purple-200">
          <CheckSquare className="w-3.5 h-3.5 text-purple-700" />
          <span>Operational Boundary Rules (Role 3 / 4)</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          Dual-Control Verification Authority
        </h2>
        <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
          The Final Entry Operator acts as the critical compliance firewall. You verify the borrower's identity and evaluate the locked gold appraisal from the Gold Weighter. If deductions or descriptions appear erroneous, you <strong>Return for Gold Correction</strong> with mandatory audit notes. When you complete verification, the application advances to the Super Admin's queue for authorized sanction.
        </p>
      </div>

      {/* Pending Queue Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Pending Operator Queue</h3>
            <p className="text-xs text-gray-500">Applications with submitted gold appraisal ready for review</p>
          </div>
          <Link to="/staff/final-entry/queue" className="text-xs font-bold text-[#701525] hover:underline">
            View All ({pendingQueue.length}) →
          </Link>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-xs text-gray-500">No applications currently waiting for operator verification.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Borrower</th>
                  <th className="py-2.5 px-3">Pledged Category</th>
                  <th className="py-2.5 px-3">Requested Loan</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingQueue.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#701525]">
                      {app.reference}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-gray-900">
                      {app.customer.fullName}
                    </td>
                    <td className="py-2.5 px-3 text-gray-700">
                      {app.goldDetails.itemsCount} {app.goldDetails.category}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-gray-900">
                      {formatCurrency(app.loanPreferences.requestedAmount)}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        to={`/staff/final-entry/form/${app.reference}`}
                        className="inline-flex items-center gap-1 font-bold text-[#701525] hover:underline"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Review & Verify</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
