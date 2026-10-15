import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { 
  Download, 
  FileText, 
  Vault, 
  History, 
  ShieldCheck 
} from 'lucide-react';

export const AuditorReportsPage: React.FC = () => {
  const { loans, transactions, custodyRecords, activityLogs } = useDemoData();

  const [activeReport, setActiveReport] = useState<'PORTFOLIO' | 'TRANSACTIONS' | 'CUSTODY' | 'LOGS'>('PORTFOLIO');

  const downloadCSV = (filename: string, rows: string[][]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPortfolio = () => {
    const rows = [
      ['Loan Account', 'Customer', 'Sanctioned Date', 'Sanctioned Amount', 'Disbursed Amount', 'Principal Outstanding', 'Accrued Interest', 'Total Remaining Balance', 'Status'],
      ...loans.map(l => [
        l.loanAccountNumber,
        `"${l.customerName}"`,
        l.sanctionedDate.split('T')[0],
        l.sanctionedAmount.toString(),
        l.disbursedAmount.toString(),
        (l.principalOutstanding || l.sanctionedAmount).toString(),
        l.totalInterestPayable.toString(),
        l.remainingBalance.toString(),
        l.status,
      ])
    ];
    downloadCSV(`Loan_Portfolio_Report_${new Date().toISOString().split('T')[0]}.csv`, rows);
  };

  const handleExportCustody = () => {
    const rows = [
      ['Custody ID', 'Packet Ref', 'Vault Locker', 'Customer Name', 'Item Count', 'Gross Weight (g)', 'Net Weight (g)', 'Purity', 'Status', 'Sealed Date', 'Sealed By'],
      ...custodyRecords.map(c => [
        c.id,
        c.packetReference,
        c.vaultLocation,
        `"${c.customerName}"`,
        c.itemCount.toString(),
        c.totalGrossWeight.toString(),
        c.totalNetWeight.toString(),
        c.purity,
        c.status,
        c.sealedAt.split('T')[0],
        `"${c.sealedByStaffName}"`,
      ])
    ];
    downloadCSV(`Vault_Custody_Inventory_${new Date().toISOString().split('T')[0]}.csv`, rows);
  };

  const handleExportTransactions = () => {
    const rows = [
      ['Txn Ref', 'Receipt No', 'Type', 'Amount', 'Payment Mode', 'Customer', 'Loan Account', 'Timestamp', 'Staff'],
      ...transactions.map(t => [
        t.transactionReference,
        t.receiptNumber || '—',
        t.type,
        t.amount.toString(),
        `"${t.paymentMode}"`,
        `"${t.customerName}"`,
        t.loanAccountNumber || '—',
        t.recordedAt,
        `"${t.processedByName}"`,
      ])
    ];
    downloadCSV(`Transactions_Audit_${new Date().toISOString().split('T')[0]}.csv`, rows);
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
            <span className="text-xs text-gray-400 font-mono">Standard Regulatory Exports</span>
          </div>
          <h1 className="text-2xl font-black text-[#701525] font-display mt-1">
            Statutory & Operational Audit Reports
          </h1>
          <p className="text-xs text-gray-500">
            Generate and export standard supervisory schedules for regulatory filings, external auditors, and internal risk committee review.
          </p>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveReport('PORTFOLIO')}
          className={`p-4 rounded-2xl border text-left transition-all shadow-sm ${
            activeReport === 'PORTFOLIO'
              ? 'bg-[#FAF8F3] border-[#701525] ring-2 ring-[#701525]/20'
              : 'bg-white border-[#E8E2D8] hover:border-[#701525]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Schedule A</span>
            <FileText className={`w-4 h-4 ${activeReport === 'PORTFOLIO' ? 'text-[#701525]' : 'text-gray-400'}`} />
          </div>
          <span className="font-bold text-xs text-gray-900 block">Loan Portfolio & Exposure</span>
          <span className="text-[10px] text-gray-500 font-mono">{loans.length} active records</span>
        </button>

        <button
          onClick={() => setActiveReport('TRANSACTIONS')}
          className={`p-4 rounded-2xl border text-left transition-all shadow-sm ${
            activeReport === 'TRANSACTIONS'
              ? 'bg-[#FAF8F3] border-[#701525] ring-2 ring-[#701525]/20'
              : 'bg-white border-[#E8E2D8] hover:border-[#701525]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Schedule B</span>
            <History className={`w-4 h-4 ${activeReport === 'TRANSACTIONS' ? 'text-[#701525]' : 'text-gray-400'}`} />
          </div>
          <span className="font-bold text-xs text-gray-900 block">Cash & Electronic Ledger</span>
          <span className="text-[10px] text-gray-500 font-mono">{transactions.length} vouchers</span>
        </button>

        <button
          onClick={() => setActiveReport('CUSTODY')}
          className={`p-4 rounded-2xl border text-left transition-all shadow-sm ${
            activeReport === 'CUSTODY'
              ? 'bg-[#FAF8F3] border-[#701525] ring-2 ring-[#701525]/20'
              : 'bg-white border-[#E8E2D8] hover:border-[#701525]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Schedule C</span>
            <Vault className={`w-4 h-4 ${activeReport === 'CUSTODY' ? 'text-[#701525]' : 'text-gray-400'}`} />
          </div>
          <span className="font-bold text-xs text-gray-900 block">Pledged Gold Inventory</span>
          <span className="text-[10px] text-gray-500 font-mono">{custodyRecords.length} vault packets</span>
        </button>

        <button
          onClick={() => setActiveReport('LOGS')}
          className={`p-4 rounded-2xl border text-left transition-all shadow-sm ${
            activeReport === 'LOGS'
              ? 'bg-[#FAF8F3] border-[#701525] ring-2 ring-[#701525]/20'
              : 'bg-white border-[#E8E2D8] hover:border-[#701525]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Schedule D</span>
            <ShieldCheck className={`w-4 h-4 ${activeReport === 'LOGS' ? 'text-[#701525]' : 'text-gray-400'}`} />
          </div>
          <span className="font-bold text-xs text-gray-900 block">Operational Audit Trail</span>
          <span className="text-[10px] text-gray-500 font-mono">{activityLogs.length} events logged</span>
        </button>
      </div>

      {/* Report Preview Panel */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {activeReport === 'PORTFOLIO' && 'Schedule A: Loan Portfolio & Exposure Summary'}
              {activeReport === 'TRANSACTIONS' && 'Schedule B: Cash & Electronic Financial Transactions'}
              {activeReport === 'CUSTODY' && 'Schedule C: Strongroom Pledged Gold Inventory Register'}
              {activeReport === 'LOGS' && 'Schedule D: Staff Operational Action Audit Trail'}
            </h2>
            <p className="text-xs text-gray-500">
              Live synchronized ledger preview for review and immediate CSV generation.
            </p>
          </div>

          <div>
            {activeReport === 'PORTFOLIO' && (
              <button
                onClick={handleExportPortfolio}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#701525] text-white hover:bg-[#58101d] text-xs font-bold transition-all shadow-md"
              >
                <Download className="w-4 h-4 text-[#FFE59E]" />
                <span>Export Portfolio Report (CSV)</span>
              </button>
            )}

            {activeReport === 'TRANSACTIONS' && (
              <button
                onClick={handleExportTransactions}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#701525] text-white hover:bg-[#58101d] text-xs font-bold transition-all shadow-md"
              >
                <Download className="w-4 h-4 text-[#FFE59E]" />
                <span>Export Transactions Ledger (CSV)</span>
              </button>
            )}

            {activeReport === 'CUSTODY' && (
              <button
                onClick={handleExportCustody}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#701525] text-white hover:bg-[#58101d] text-xs font-bold transition-all shadow-md"
              >
                <Download className="w-4 h-4 text-[#FFE59E]" />
                <span>Export Gold Inventory (CSV)</span>
              </button>
            )}

            {activeReport === 'LOGS' && (
              <button
                onClick={() => {
                  const rows = [
                    ['Timestamp', 'User', 'Role', 'Action', 'Target Ref', 'Details'],
                    ...activityLogs.map(l => [
                      l.timestamp,
                      `"${l.performedByName || l.employeeName || 'Staff'}"`,
                      l.performedByRole || l.employeeRole || 'STAFF',
                      `"${l.action || l.eventType || 'Action'}"`,
                      l.targetReference || l.applicationReference || '—',
                      `"${(typeof l.details === 'string' ? l.details : l.description || '').replace(/"/g, '""')}"`,
                    ])
                  ];
                  downloadCSV(`Activity_Audit_${new Date().toISOString().split('T')[0]}.csv`, rows);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#701525] text-white hover:bg-[#58101d] text-xs font-bold transition-all shadow-md"
              >
                <Download className="w-4 h-4 text-[#FFE59E]" />
                <span>Export Audit Trail (CSV)</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic preview table based on active report */}
        <div className="overflow-x-auto">
          {activeReport === 'PORTFOLIO' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5">Loan Account</th>
                  <th className="py-2.5">Customer Name</th>
                  <th className="py-2.5">Sanction Date</th>
                  <th className="py-2.5 text-right">Sanctioned</th>
                  <th className="py-2.5 text-right">Principal Due</th>
                  <th className="py-2.5 text-right">Total Outstanding</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loans.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50/60">
                    <td className="py-3 font-mono font-bold text-[#701525]">{l.loanAccountNumber}</td>
                    <td className="py-3 font-bold text-gray-900">{l.customerName}</td>
                    <td className="py-3 font-mono text-gray-500">{l.sanctionedDate.split('T')[0]}</td>
                    <td className="py-3 text-right font-mono text-gray-700">{formatCurrency(l.sanctionedAmount)}</td>
                    <td className="py-3 text-right font-mono text-gray-700">{formatCurrency(l.principalOutstanding || l.sanctionedAmount)}</td>
                    <td className="py-3 text-right font-mono font-black text-gray-900">{formatCurrency(l.remainingBalance)}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeReport === 'CUSTODY' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5">Packet Ref</th>
                  <th className="py-2.5">Vault Locker</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5 text-center">Items</th>
                  <th className="py-2.5 text-right">Gross (g)</th>
                  <th className="py-2.5 text-right">Net Gold (g)</th>
                  <th className="py-2.5">Custody Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {custodyRecords.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/60">
                    <td className="py-3 font-mono font-bold text-[#701525]">{c.packetReference}</td>
                    <td className="py-3 font-mono font-bold text-gray-800">{c.vaultLocation}</td>
                    <td className="py-3 text-gray-800">{c.customerName}</td>
                    <td className="py-3 text-center font-bold text-gray-700">{c.itemCount}</td>
                    <td className="py-3 text-right font-mono text-gray-600">{c.totalGrossWeight.toFixed(2)}g</td>
                    <td className="py-3 text-right font-mono font-bold text-gray-900">{c.totalNetWeight.toFixed(2)}g</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeReport === 'TRANSACTIONS' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5">Txn Ref</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Mode</th>
                  <th className="py-2.5 text-right">Amount (₹)</th>
                  <th className="py-2.5">Recorded At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50/60">
                    <td className="py-3 font-mono font-bold text-[#701525]">{t.transactionReference}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.type === 'Disbursement' ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-gray-900">{t.customerName}</td>
                    <td className="py-3 text-gray-600">{t.paymentMode}</td>
                    <td className="py-3 text-right font-mono font-bold text-gray-900">{formatCurrency(t.amount)}</td>
                    <td className="py-3 font-mono text-gray-500">{formatDateTime(t.recordedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeReport === 'LOGS' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5">Timestamp</th>
                  <th className="py-2.5">User</th>
                  <th className="py-2.5">Action</th>
                  <th className="py-2.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activityLogs.slice(0, 10).map(l => (
                  <tr key={l.id} className="hover:bg-gray-50/60">
                    <td className="py-3 font-mono text-gray-500">{formatDateTime(l.timestamp)}</td>
                    <td className="py-3 font-bold text-gray-900">{l.performedByName || l.employeeName || 'Staff'} ({l.performedByRole || l.employeeRole || 'STAFF'})</td>
                    <td className="py-3 font-semibold text-[#701525]">{l.action || l.eventType || 'Event'}</td>
                    <td className="py-3 text-gray-600 truncate max-w-md">{typeof l.details === 'string' ? l.details : l.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
