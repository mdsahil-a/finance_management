import React from 'react';
import { Link } from 'react-router-dom';
import { useDemoData } from '../../../context/DemoDataContext';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency, formatDateTime, formatGrams } from '../../../utils/formatters';
import { 
  Scale, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  FileText,
  Layers,
  Sparkles
} from 'lucide-react';

export const WeighterDashboardPage: React.FC = () => {
  const { applications, assessments } = useDemoData();

  const awaitingQueue = applications.filter(
    (a) => a.status === 'Submitted' || a.status === 'Awaiting Gold Assessment'
  );

  const returnedQueue = applications.filter(
    (a) => a.status === 'Returned for Gold Correction'
  );

  const completedToday = assessments.reduce(
    (sum, a) => sum + a.versions.filter((v) => v.status === 'Submitted').length,
    0
  );

  const draftsCount = assessments.reduce(
    (sum, a) => sum + a.versions.filter((v) => v.status === 'Draft').length,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#701525] font-display">
            Gold Appraiser & Weighter Workbench
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Conduct precision physical weighment, deduct stone & non-gold inclusions, and certify hallmarked karat purities.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 self-start sm:self-auto">
          <Link
            to="/staff/weighter/apply"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-sm"
          >
            Apply for Gold Loan
          </Link>
          <Link
            to="/staff/weighter/queue"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-sm"
          >
            Open Weighing Queue ({awaitingQueue.length + returnedQueue.length})
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Awaiting Physical Weighing
          </span>
          <div className="text-2xl font-black text-amber-600">
            {awaitingQueue.length}
          </div>
          <span className="text-[10px] text-gray-400">Fresh customer files</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-rose-300 shadow-sm space-y-1 bg-rose-50/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
            Returned for Correction
          </span>
          <div className="text-2xl font-black text-rose-700">
            {returnedQueue.length}
          </div>
          <span className="text-[10px] text-rose-600 font-semibold">Priority reassessment</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Assessments Completed
          </span>
          <div className="text-2xl font-black text-emerald-700">
            {completedToday}
          </div>
          <span className="text-[10px] text-gray-400">Locked appraisal records</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Saved Drafts
          </span>
          <div className="text-2xl font-black text-gray-800">
            {draftsCount}
          </div>
          <span className="text-[10px] text-gray-400">Unsubmitted assessments</span>
        </div>
      </div>

      {/* Visual Workspace Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-md grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
            <Scale className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>Dual-Verification Dual Scale Protocol</span>
          </div>
          <h2 className="text-xl font-bold text-[#701525]">
            Certified Appraisal Standards (Role 2 / 4)
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            As the designated Gold Weighter, you establish the immutable baseline for the entire lending transaction. When you lock and submit an appraisal, versioning is preserved and the record becomes visible immediately in the Final Entry Operator's queue.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <Link
              to="/staff/weighter/queue"
              className="px-4 py-2 rounded-xl font-bold bg-[#701525] text-white hover:bg-[#58101d]"
            >
              Go to Weighing Queue
            </Link>
            <Link
              to="/staff/weighter/history"
              className="px-4 py-2 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              View Appraisal History
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-2xl overflow-hidden border border-gray-200 shadow-sm aspect-4/3">
          <img
            src="/images/weighing-scale.jpg"
            alt="Gold Weighing Workbench"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Queue Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Current Appraisal Queue</h3>
            <p className="text-xs text-gray-500">Applications ready for physical ornament weighing</p>
          </div>
          <Link to="/staff/weighter/queue" className="text-xs font-bold text-[#701525] hover:underline">
            View All ({awaitingQueue.length + returnedQueue.length}) →
          </Link>
        </div>

        {awaitingQueue.length + returnedQueue.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-xs text-gray-500">Your weighing queue is completely clear!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Borrower</th>
                  <th className="py-2.5 px-3">Declared Items</th>
                  <th className="py-2.5 px-3">Declared Weight</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...returnedQueue, ...awaitingQueue].map((app) => (
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
                    <td className="py-2.5 px-3 font-mono text-gray-800">
                      {formatGrams(app.goldDetails.declaredWeight)} ({app.goldDetails.purity})
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        to={`/staff/weighter/assessment/${app.reference}`}
                        className="inline-flex items-center gap-1 font-bold text-[#701525] hover:underline"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>Perform Appraisal</span>
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
