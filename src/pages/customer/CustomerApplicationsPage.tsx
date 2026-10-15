import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomerSession } from '../../context/CustomerSessionContext';
import { useDemoData } from '../../context/DemoDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Search, Filter, Eye, Printer, FileText } from 'lucide-react';

export const CustomerApplicationsPage: React.FC = () => {
  const { currentCustomer } = useCustomerSession();
  const { applications } = useDemoData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  // Filter applications for currentCustomer
  const myApplications = applications.filter(
    (a) => a.customer.email === currentCustomer?.email || a.customer.fullName === currentCustomer?.fullName
  );

  const filteredApps = myApplications
    .filter((a) => {
      const matchesSearch =
        a.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.goldDetails.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return b.loanPreferences.requestedAmount - a.loanPreferences.requestedAmount;
    });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Gold Loan Applications</h2>
          <p className="text-xs text-gray-500">Search and filter your active and past loan applications.</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference or ornament type..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#701525]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold bg-white text-gray-700 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Awaiting Gold Assessment">Awaiting Gold Assessment</option>
            <option value="Awaiting Final Entry">Awaiting Final Entry</option>
            <option value="Awaiting Authorized Review">Awaiting Review</option>
            <option value="Awaiting Demo Disbursement">Awaiting Disbursement</option>
            <option value="Disbursed — Demo">Disbursed — Demo</option>
            <option value="Closed — Demo">Closed — Demo</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
            className="px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold bg-white text-gray-700 outline-none"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <FileText className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-xs text-gray-500">No applications match your search criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] text-gray-700 font-bold uppercase tracking-wider text-[10px] border-y border-[#E8E2D8]">
              <tr>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Pledged Gold</th>
                <th className="py-3 px-4">Requested Amount</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#701525]">
                    {app.reference}
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {app.goldDetails.itemsCount} {app.goldDetails.category} ({app.goldDetails.declaredWeight}g {app.goldDetails.purity})
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">
                    {formatCurrency(app.loanPreferences.requestedAmount)}
                  </td>
                  <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                    {formatDateTime(app.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={app.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right space-x-3">
                    <Link
                      to={`/track-application?ref=${app.reference}`}
                      className="font-bold text-[#701525] hover:underline"
                    >
                      Track
                    </Link>
                    <Link
                      to={`/application/${app.reference}`}
                      className="text-gray-500 hover:text-gray-900 hover:underline"
                    >
                      Dossier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
