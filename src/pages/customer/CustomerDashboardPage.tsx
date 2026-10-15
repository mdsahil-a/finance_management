import React from 'react';
import { Link } from 'react-router-dom';
import { useCustomerSession } from '../../context/CustomerSessionContext';
import { useDemoData } from '../../context/DemoDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { 
  FileText, 
  Coins, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  PlusCircle,
  Eye
} from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const { currentCustomer } = useCustomerSession();
  const { applications, loans } = useDemoData();

  // Filter applications belonging to or matching currentCustomer email or name
  const myApplications = applications.filter(
    (a) => a.customer.email === currentCustomer?.email || a.customer.fullName === currentCustomer?.fullName
  );

  // Active loans for this customer
  const myLoans = loans.filter(
    (l) => l.customerName === currentCustomer?.fullName && l.status === 'Active'
  );

  const pendingApps = myApplications.filter(
    (a) => !['Disbursed — Demo', 'Closed — Demo', 'Rejected — Demo'].includes(a.status)
  );

  const totalSanctioned = myLoans.reduce((sum, l) => sum + l.sanctionedAmount, 0);

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Total Applications
          </span>
          <div className="text-2xl font-black text-[#701525]">
            {myApplications.length}
          </div>
          <span className="text-[10px] text-gray-400">All submitted loan files</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            In Workflow Pipeline
          </span>
          <div className="text-2xl font-black text-amber-600">
            {pendingApps.length}
          </div>
          <span className="text-[10px] text-gray-400">Under appraisal or review</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Active Loan Accounts
          </span>
          <div className="text-2xl font-black text-emerald-600">
            {myLoans.length}
          </div>
          <span className="text-[10px] text-gray-400">Disbursed & active facilities</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Active Principal Borrowed
          </span>
          <div className="text-2xl font-black text-gray-900">
            {formatCurrency(totalSanctioned)}
          </div>
          <span className="text-[10px] text-gray-400">Across current active accounts</span>
        </div>
      </div>

      {/* Active Loan Account Spotlight (If any) */}
      {myLoans.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-[#701525]">Active Gold Loan Account</h3>
              <p className="text-xs text-gray-500">Account #{myLoans[0].loanAccountNumber}</p>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
              Live Facility
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-gray-500 block">Sanctioned Principal</span>
              <span className="font-bold text-gray-900 text-sm">{formatCurrency(myLoans[0].sanctionedAmount)}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Interest Rate</span>
              <span className="font-bold text-gray-900 text-sm">{myLoans[0].annualInterestRate}% p.a.</span>
            </div>
            <div>
              <span className="text-gray-500 block">Total Repaid to Date</span>
              <span className="font-bold text-emerald-600 text-sm">{formatCurrency(myLoans[0].totalRepaid)}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Remaining Outstanding</span>
              <span className="font-bold text-[#701525] text-sm">{formatCurrency(myLoans[0].remainingBalance)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Applications List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-md space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Recent Gold Loan Applications</h3>
            <p className="text-xs text-gray-500">Stored demonstration records in your browser LocalStorage</p>
          </div>
          <Link
            to="/dashboard/applications"
            className="text-xs font-bold text-[#701525] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myApplications.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <FileText className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-xs text-gray-500">You haven't submitted any gold loan applications yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-gray-700 font-bold uppercase tracking-wider text-[10px] border-y border-[#E8E2D8]">
                <tr>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Pledged Gold</th>
                  <th className="py-3 px-4">Requested Loan</th>
                  <th className="py-3 px-4">Date Logged</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myApplications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#701525]">
                      {app.reference}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {app.goldDetails.itemsCount} {app.goldDetails.category} ({app.goldDetails.declaredWeight}g)
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {formatCurrency(app.loanPreferences.requestedAmount)}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {formatDateTime(app.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        to={`/track-application?ref=${app.reference}`}
                        className="inline-flex items-center gap-1 font-bold text-[#701525] hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Track</span>
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
