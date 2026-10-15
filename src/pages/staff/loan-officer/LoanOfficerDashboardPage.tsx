import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDemoData } from '../../../context/DemoDataContext';
import { useStaffSession } from '../../../context/StaffSessionContext';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Scale, 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  Clock3
} from 'lucide-react';

export const LoanOfficerDashboardPage: React.FC = () => {
  const { applications, branches } = useDemoData();
  const { currentStaff } = useStaffSession();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');

  const myBranchApplications = applications.filter(
    (a) => a.assignedBranchId === (currentStaff?.branchId || 'BR-MUM-01')
  );

  const awaitingAppraisalCount = myBranchApplications.filter(
    (a) => a.status === 'Submitted' || a.status === 'Awaiting Gold Assessment'
  ).length;

  const returnedCount = myBranchApplications.filter(
    (a) => a.status === 'Returned for Correction' || a.status === 'Returned for Gold Correction'
  ).length;

  const activeCount = myBranchApplications.filter(
    (a) => a.status === 'Active' || a.status === 'Disbursed — Demo'
  ).length;

  const filteredApps = myBranchApplications.filter(
    (a) => 
      a.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.customer.mobile.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#C9A45C]" />
            <h1 className="text-2xl font-black text-[#701525] font-display">
              Loan Officer & Customer Service Desk
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Customer registration, KYC document verification, application creation, and pipeline tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/staff/loan-officer/customers"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-gray-800 border border-[#E8E2D8] hover:bg-gray-50 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-[#C9A45C]" />
            <span>Customer Directory</span>
          </Link>
          <Link
            to="/staff/loan-officer/new-application"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-sm flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4 text-[#FFE59E]" />
            <span>New Loan Application</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Total Files</span>
          <p className="text-2xl font-black text-[#701525]">{myBranchApplications.length}</p>
          <span className="text-[10px] text-gray-400">Branch registrations</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">At Valuer Desk</span>
          <p className="text-2xl font-black text-amber-600">{awaitingAppraisalCount}</p>
          <span className="text-[10px] text-gray-400">Pending gold assay</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-red-300 bg-red-50/20 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">Returned Files</span>
          <p className="text-2xl font-black text-red-600">{returnedCount}</p>
          <span className="text-[10px] text-red-500">Requires correction</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Disbursed / Active</span>
          <p className="text-2xl font-black text-emerald-700">{activeCount}</p>
          <span className="text-[10px] text-gray-400">Successfully closed</span>
        </div>
      </div>

      {/* Search & Applications Pipeline */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Branch Customer Applications</h3>
            <p className="text-xs text-gray-500">Search by customer name, phone number, or application reference.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer, mobile, ref..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#701525] outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Reference</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Gold Details</th>
                <th className="py-2.5 px-3">Requested Loan</th>
                <th className="py-2.5 px-3">Scheme</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Submitted</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No matching applications found.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/60">
                    <td className="py-3 px-3 font-mono font-bold text-[#701525]">
                      <Link to={`/application/${encodeURIComponent(app.reference)}`} className="hover:underline">
                        {app.reference}
                      </Link>
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-900">
                      <div>{app.customer.fullName}</div>
                      <div className="text-[10px] text-gray-400">{app.customer.mobile}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div>{app.goldDetails.itemsCount} {app.goldDetails.category}</div>
                      <div className="text-[10px] text-gray-500">{app.goldDetails.declaredWeight}g · {app.goldDetails.purity}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-gray-900">
                      {formatCurrency(app.loanPreferences.requestedAmount)}
                    </td>
                    <td className="py-3 px-3 text-[11px] font-mono text-gray-600">
                      {app.loanPreferences.schemeCode || 'AGF-REGULAR'}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 px-3 text-gray-400 text-[11px]">
                      {formatDateTime(app.createdAt)}
                    </td>
                    <td className="py-3 px-3">
                      <Link
                        to={`/application/${encodeURIComponent(app.reference)}`}
                        className="text-[11px] font-bold text-[#701525] hover:underline"
                      >
                        Details →
                      </Link>
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
