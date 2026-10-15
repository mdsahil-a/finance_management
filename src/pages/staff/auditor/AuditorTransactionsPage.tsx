import React, { useState, useMemo } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { DemoTransaction } from '../../../types';
import { 
  History, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Receipt, 
  CheckCircle2, 
  X,
  CreditCard
} from 'lucide-react';

export const AuditorTransactionsPage: React.FC = () => {
  const { transactions } = useDemoData();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Disbursement' | 'Repayment'>('ALL');
  const [modeFilter, setModeFilter] = useState<string>('ALL');
  const [selectedTxn, setSelectedTxn] = useState<DemoTransaction | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = 
        t.transactionReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.loanAccountNumber && t.loanAccountNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.receiptNumber && t.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
      const matchesMode = modeFilter === 'ALL' || t.paymentMode === modeFilter;

      return matchesSearch && matchesType && matchesMode;
    });
  }, [transactions, searchQuery, typeFilter, modeFilter]);

  const totalFilteredDisbursements = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'Disbursement')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const totalFilteredRepayments = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'Repayment')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const handleExportCSV = () => {
    const rows = [
      ['Transaction Ref', 'Receipt No', 'Type', 'Amount (INR)', 'Principal Part', 'Interest Part', 'Mode', 'Customer', 'Loan Account', 'Processed By', 'Timestamp', 'Status'],
      ...filteredTransactions.map(t => [
        t.transactionReference,
        t.receiptNumber || '—',
        t.type,
        t.amount,
        t.principalComponent ?? '—',
        t.interestComponent ?? '—',
        `"${t.paymentMode}"`,
        `"${t.customerName}"`,
        t.loanAccountNumber || '—',
        `"${t.processedByName}"`,
        t.recordedAt,
        t.status,
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Transactions_Audit_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
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
            <span className="text-xs text-gray-400 font-mono">Financial Ledger</span>
          </div>
          <h1 className="text-2xl font-black text-[#701525] font-display mt-1">
            Financial Transactions Audit Ledger
          </h1>
          <p className="text-xs text-gray-500">
            Comprehensive, immutable verification of all loan disbursements, counter collections, repayments, and official vouchers.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#C9A45C] text-[#701525] hover:bg-[#FAF8F3] text-xs font-bold transition-all shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#C9A45C]" />
          <span>Export Ledger to CSV</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Filtered Transactions</span>
            <History className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl font-black text-gray-900">{filteredTransactions.length}</p>
          <span className="text-[10px] text-gray-400 mt-1 block">Out of {transactions.length} total entries</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Disbursed (Outflow)</span>
            <ArrowUpRight className="w-4 h-4 text-[#701525]" />
          </div>
          <p className="text-xl font-black text-[#701525]">{formatCurrency(totalFilteredDisbursements)}</p>
          <span className="text-[10px] text-gray-400 mt-1 block">Loan payouts to borrowers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Collected (Inflow)</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-emerald-700">{formatCurrency(totalFilteredRepayments)}</p>
          <span className="text-[10px] text-gray-400 mt-1 block">Principal & interest service</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ref, customer, loan, or receipt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#701525]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500 font-bold">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-700 outline-none focus:border-[#701525]"
            >
              <option value="ALL">All Types</option>
              <option value="Disbursement">Disbursement Only</option>
              <option value="Repayment">Repayment Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500 font-bold">Channel:</span>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-700 outline-none focus:border-[#701525]"
            >
              <option value="ALL">All Modes</option>
              <option value="Cash — Demo">Cash — Demo</option>
              <option value="UPI — Demo">UPI — Demo</option>
              <option value="Bank Transfer — Demo">Bank Transfer — Demo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F3] border-b border-[#E8E2D8] text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Customer & Account</th>
                <th className="py-3 px-4">Payment Channel</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4">Cashier</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    No transactions found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#701525]">
                      {txn.transactionReference}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600">
                      {txn.receiptNumber || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-500">
                      {formatDateTime(txn.recordedAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        txn.type === 'Disbursement'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-900 block">{txn.customerName}</span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {txn.loanAccountNumber || txn.applicationReference}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-[11px]">
                      {txn.paymentMode}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono font-black text-sm ${
                      txn.type === 'Disbursement' ? 'text-[#701525]' : 'text-emerald-700'
                    }`}>
                      {formatCurrency(txn.amount)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {txn.processedByName}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedTxn(txn)}
                        className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-700 hover:text-[#701525] hover:border-[#701525] font-bold text-[11px] transition-all"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#E8E2D8] shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#701525]" />
                <h3 className="font-bold text-base text-gray-900 font-display">
                  Transaction Audit Inspection
                </h3>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction Reference:</span>
                  <span className="font-mono font-bold text-gray-900">{selectedTxn.transactionReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Receipt Voucher #:</span>
                  <span className="font-mono font-bold text-[#701525]">{selectedTxn.receiptNumber || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Application Reference:</span>
                  <span className="font-mono text-gray-800">{selectedTxn.applicationReference}</span>
                </div>
                {selectedTxn.loanAccountNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Loan Facility Account:</span>
                    <span className="font-mono font-bold text-gray-800">{selectedTxn.loanAccountNumber}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Transaction Type</span>
                  <span className="font-bold text-gray-900">{selectedTxn.type}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Amount</span>
                  <span className="font-mono font-black text-sm text-[#701525]">{formatCurrency(selectedTxn.amount)}</span>
                </div>
              </div>

              {selectedTxn.type === 'Repayment' && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-emerald-800 block text-[10px]">Principal Component</span>
                    <span className="font-mono font-bold text-emerald-900">
                      {formatCurrency(selectedTxn.principalComponent || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-800 block text-[10px]">Interest Component</span>
                    <span className="font-mono font-bold text-amber-900">
                      {formatCurrency(selectedTxn.interestComponent || 0)}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Audit Notation</span>
                <p className="text-gray-700">{selectedTxn.notes || 'No remarks provided.'}</p>
                <div className="pt-2 text-[10px] text-gray-400 flex justify-between border-t border-gray-200 mt-2">
                  <span>Processed by: {selectedTxn.processedByName} ({selectedTxn.processedByRole})</span>
                  <span>{formatDateTime(selectedTxn.recordedAt)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedTxn(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-xs text-gray-800 transition-colors"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
