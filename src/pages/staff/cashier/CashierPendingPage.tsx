import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDemoData } from '../../../context/DemoDataContext';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { CreditCard, Search, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CashierPendingPage: React.FC = () => {
  const { applications } = useDemoData();
  const [searchQuery, setSearchQuery] = useState('');

  const pendingApps = applications.filter((a) => a.status === 'Awaiting Demo Disbursement');

  const filtered = pendingApps.filter(
    (a) =>
      a.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.goldDetails.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#701525] font-display">
            Pending Demo Disbursements Queue
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Applications sanctioned by Super Admin awaiting payout execution and receipt issuance.
          </p>
        </div>
        <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
          {pendingApps.length} Files Ready for Payout
        </span>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pending disbursements by reference, borrower, or ornament..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-xs text-gray-500">No applications waiting for disbursement.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
                <tr>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Borrower Name</th>
                  <th className="py-3 px-4">Authorized Sanction</th>
                  <th className="py-3 px-4">Pledged Gold Summary</th>
                  <th className="py-3 px-4">Sanctioned By</th>
                  <th className="py-3 px-4 text-right">Cashier Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#701525]">
                      {app.reference}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900">{app.customer.fullName}</p>
                      <p className="text-[10px] text-gray-400">{app.customer.mobile}</p>
                    </td>
                    <td className="py-3 px-4 font-black text-emerald-800 text-sm">
                      {formatCurrency(app.authorizedDecision?.sanctionedAmount || app.loanPreferences.requestedAmount)}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {app.goldDetails.itemsCount} {app.goldDetails.category} ({app.goldDetails.declaredWeight}g {app.goldDetails.purity})
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {app.authorizedDecision?.decidedByName || 'Super Admin'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/staff/cashier/disbursements?ref=${app.reference}`}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-2xs inline-flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Disburse Funds</span>
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
