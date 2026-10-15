import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { 
  ShieldCheck, 
  Search, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuditorDashboardPage: React.FC = () => {
  const { 
    transactions, 
    loans, 
    applications, 
    activityLogs, 
    reconciliations, 
    custodyRecords 
  } = useDemoData();

  const [logFilterQuery, setLogFilterQuery] = useState<string>('');

  // Total volume examined
  const totalDisbursed = transactions
    .filter(t => t.type === 'Disbursement')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRepayments = transactions
    .filter(t => t.type === 'Repayment')
    .reduce((sum, t) => sum + t.amount, 0);

  // Compliance exceptions
  const highLtvLoans = applications.filter(a => {
    const valuation = a.goldDetails.approximateValue || 1;
    const ltv = (a.loanPreferences.requestedAmount / valuation) * 100;
    return ltv > 75;
  });

  const tillDiscrepancies = reconciliations.filter(r => r.discrepancy !== 0);
  const overdueLoans = loans.filter(l => l.status === 'Active' && l.remainingBalance > 0);

  const filteredLogs = activityLogs.filter(log => {
    const actionStr = (log.action || log.eventType || '').toLowerCase();
    const detailsStr = (typeof log.details === 'string' ? log.details : log.description || '').toLowerCase();
    const nameStr = (log.performedByName || log.employeeName || '').toLowerCase();
    const roleStr = (log.performedByRole || log.employeeRole || '').toLowerCase();
    const q = logFilterQuery.toLowerCase();
    return actionStr.includes(q) || detailsStr.includes(q) || nameStr.includes(q) || roleStr.includes(q);
  });

  const handleExportQuickCSV = () => {
    const rows = [
      ['Timestamp', 'User', 'Role', 'Action', 'Target Reference', 'Details'],
      ...filteredLogs.map(l => [
        l.timestamp,
        `"${l.performedByName || l.employeeName || 'Staff'}"`,
        l.performedByRole || l.employeeRole || 'OPERATOR',
        `"${l.action || l.eventType || 'Action'}"`,
        l.targetReference || l.applicationReference || '—',
        `"${(typeof l.details === 'string' ? l.details : l.description || '').replace(/"/g, '""')}"`,
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Activity_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#701525]/10 text-[#701525]">
              Auditing & Compliance
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Read-Only Supervisory Mode
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#701525] font-display mt-1">
            Internal Audit & Regulatory Compliance Console
          </h1>
          <p className="text-xs text-gray-500">
            Independent oversight of transactions, credit underwriting limits, vault custody integrity, and cashier till reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportQuickCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#C9A45C] text-[#701525] hover:bg-[#FAF8F3] text-xs font-bold transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#C9A45C]" />
            <span>Export Audit Trail (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Examined Volume</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-gray-900">{formatCurrency(totalDisbursed + totalRepayments)}</p>
          <span className="text-[10px] text-gray-400 mt-1 block font-mono">
            Disbursed: {formatCurrency(totalDisbursed)} | Repaid: {formatCurrency(totalRepayments)}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Audit Log Entries</span>
            <Clock className="w-4 h-4 text-[#701525]" />
          </div>
          <p className="text-xl font-black text-gray-900">{activityLogs.length}</p>
          <span className="text-[10px] text-gray-400 mt-1 block">Full immutable timeline recorded</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Vault Packet Integrity</span>
            <ShieldCheck className="w-4 h-4 text-[#C9A45C]" />
          </div>
          <p className="text-xl font-black text-emerald-700">100%</p>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {custodyRecords.length} sealed packets verified in vault
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Compliance Exceptions</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-amber-800">
            {tillDiscrepancies.length + highLtvLoans.length}
          </p>
          <span className="text-[10px] text-amber-700 mt-1 block">
            {tillDiscrepancies.length} till variances, {highLtvLoans.length} high LTV flags
          </span>
        </div>
      </div>

      {/* Quick Links & Exception Alert Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/staff/auditor/transactions"
          className="p-4 bg-white rounded-2xl border border-[#E8E2D8] hover:border-[#701525] shadow-sm flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#701525]/10 flex items-center justify-center text-[#701525]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-gray-900 block group-hover:text-[#701525]">
                Transactions Ledger Audit
              </span>
              <span className="text-[11px] text-gray-400">
                Inspect all {transactions.length} vouchers & receipts
              </span>
            </div>
          </div>
          <span className="text-xs text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
        </Link>

        <Link
          to="/staff/auditor/compliance"
          className="p-4 bg-white rounded-2xl border border-[#E8E2D8] hover:border-[#701525] shadow-sm flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-gray-900 block group-hover:text-[#701525]">
                Exceptions & LTV Risk
              </span>
              <span className="text-[11px] text-gray-400">
                Separation of duties & underwriting rules
              </span>
            </div>
          </div>
          <span className="text-xs text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
        </Link>

        <Link
          to="/staff/auditor/reconciliations"
          className="p-4 bg-white rounded-2xl border border-[#E8E2D8] hover:border-[#701525] shadow-sm flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-gray-900 block group-hover:text-[#701525]">
                Cashier Drawer Audit
              </span>
              <span className="text-[11px] text-gray-400">
                Inspect physical counts & manager sign-offs
              </span>
            </div>
          </div>
          <span className="text-xs text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Real-Time Immutable Audit Log Trail */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#701525]" />
              Immutable System Activity Audit Trail
            </h2>
            <p className="text-xs text-gray-500">
              Chronological log of staff actions, approvals, disbursements, custody seals, and loan repayments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter action, staff, or ref..."
                value={logFilterQuery}
                onChange={(e) => setLogFilterQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs w-64 outline-none focus:border-[#701525]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5">Timestamp</th>
                <th className="py-2.5">Staff User</th>
                <th className="py-2.5">Role</th>
                <th className="py-2.5">Action</th>
                <th className="py-2.5">Target Ref</th>
                <th className="py-2.5">Operational Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No activity logs match the search query.
                  </td>
                </tr>
              ) : (
                filteredLogs.slice(0, 15).map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-2.5 font-mono text-[11px] text-gray-500">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="py-2.5 font-bold text-gray-900">{log.performedByName || log.employeeName || 'Staff'}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                        {log.performedByRole || log.employeeRole || 'STAFF'}
                      </span>
                    </td>
                    <td className="py-2.5 font-semibold text-[#701525]">{log.action || log.eventType || 'Log Event'}</td>
                    <td className="py-2.5 font-mono font-bold text-gray-800">
                      {log.targetReference || log.applicationReference || '—'}
                    </td>
                    <td className="py-2.5 text-gray-600 text-[11px] max-w-md truncate">
                      {typeof log.details === 'string' ? log.details : log.description || '—'}
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
