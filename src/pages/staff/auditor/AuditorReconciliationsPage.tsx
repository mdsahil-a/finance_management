import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { 
  CheckSquare, 
  Search, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Building2 
} from 'lucide-react';

export const AuditorReconciliationsPage: React.FC = () => {
  const { reconciliations, branches } = useDemoData();

  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [filterDiscrepanciesOnly, setFilterDiscrepanciesOnly] = useState<boolean>(false);

  const filteredReconciliations = reconciliations.filter(r => {
    const matchesBranch = selectedBranch === 'ALL' || r.branchId === selectedBranch;
    const matchesDisc = !filterDiscrepanciesOnly || r.discrepancy !== 0;
    return matchesBranch && matchesDisc;
  });

  const totalVariances = reconciliations.filter(r => r.discrepancy !== 0).length;

  const handleExportCSV = () => {
    const rows = [
      ['Date', 'Branch', 'Cashier', 'Opening (INR)', 'Received (INR)', 'Disbursed (INR)', 'Expected (INR)', 'Physical Counted (INR)', 'Discrepancy (INR)', 'Status', 'Manager Remarks'],
      ...filteredReconciliations.map(r => [
        r.date,
        `"${r.branchName}"`,
        `"${r.cashierName}"`,
        r.openingBalance,
        r.totalCashReceived,
        r.totalCashDisbursed,
        r.expectedClosingBalance,
        r.physicalCountedBalance,
        r.discrepancy,
        r.status,
        `"${(r.managerRemarks || r.notes || '').replace(/"/g, '""')}"`,
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Cashier_Till_Audit_${new Date().toISOString().split('T')[0]}.csv`);
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
            <span className="text-xs text-gray-400 font-mono">Cash Vault Oversight</span>
          </div>
          <h1 className="text-2xl font-black text-[#701525] font-display mt-1">
            Cashier Till & Physical Drawer Reconciliation Audit
          </h1>
          <p className="text-xs text-gray-500">
            Independent audit verification of daily cashier till balancing, physical note counts, discrepancies, and Branch Manager sign-offs.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#C9A45C] text-[#701525] hover:bg-[#FAF8F3] text-xs font-bold transition-all shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#C9A45C]" />
          <span>Export Reconciliations (CSV)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Reconciliations</span>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl font-black text-gray-900">{reconciliations.length}</p>
          <span className="text-[10px] text-gray-400 mt-1 block">Historical daily till counts logged</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Manager Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-emerald-700">
            {reconciliations.filter(r => r.status === 'Manager Approved').length}
          </p>
          <span className="text-[10px] text-gray-400 mt-1 block">Verified by Branch Managers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Recorded Variances</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-amber-800">{totalVariances}</p>
          <span className="text-[10px] text-amber-700 mt-1 block">Tills with physical vs expected discrepancy</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500 font-bold">Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-700 outline-none focus:border-[#701525]"
            >
              <option value="ALL">All Branches</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterDiscrepanciesOnly}
              onChange={(e) => setFilterDiscrepanciesOnly(e.target.checked)}
              className="rounded text-[#701525] focus:ring-[#701525]"
            />
            <span>Show Discrepancies Only</span>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F3] border-b border-[#E8E2D8] text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Cashier</th>
                <th className="py-3 px-4 text-right">Opening (₹)</th>
                <th className="py-3 px-4 text-right">Inflow (₹)</th>
                <th className="py-3 px-4 text-right">Outflow (₹)</th>
                <th className="py-3 px-4 text-right">Expected (₹)</th>
                <th className="py-3 px-4 text-right">Physical Count</th>
                <th className="py-3 px-4 text-right">Variance</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-4">Manager Sign-Off Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReconciliations.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-gray-400">
                    No till records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReconciliations.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{rec.date}</td>
                    <td className="py-3 px-4 text-gray-700">{rec.branchName}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{rec.cashierName}</td>
                    <td className="py-3 px-4 text-right font-mono text-gray-600">{formatCurrency(rec.openingBalance)}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700">+{formatCurrency(rec.totalCashReceived)}</td>
                    <td className="py-3 px-4 text-right font-mono text-[#701525]">-{formatCurrency(rec.totalCashDisbursed)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">{formatCurrency(rec.expectedClosingBalance)}</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-gray-900">{formatCurrency(rec.physicalCountedBalance)}</td>
                    <td className={`py-3 px-4 text-right font-mono font-black ${
                      rec.discrepancy === 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      {rec.discrepancy >= 0 ? `+${formatCurrency(rec.discrepancy)}` : formatCurrency(rec.discrepancy)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.status === 'Manager Approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : rec.status === 'Balanced'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-[11px] max-w-xs truncate">
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
