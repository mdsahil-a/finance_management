import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { PrintReceiptModal } from '../../../components/common/PrintReceiptModal';
import { DemoTransaction } from '../../../types';
import { History, Search, Filter, Printer, Download } from 'lucide-react';

export const CashierTransactionsPage: React.FC = () => {
  const { transactions } = useDemoData();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedTxn, setSelectedTxn] = useState<DemoTransaction | null>(null);

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      t.transactionReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.applicationReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#701525] font-display">
            Transaction Ledger & Vouchers
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Complete simulated ledger of disbursements, repayments, payment channels, and receipt links.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions by reference, customer name, receipt #..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white text-gray-700 outline-none w-full sm:w-auto"
        >
          <option value="ALL">All Types ({transactions.length})</option>
          <option value="Disbursement">Disbursements Only</option>
          <option value="Repayment">Repayments Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Application</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTxns.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#701525]">
                    {txn.transactionReference}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-gray-700">
                    {txn.receiptNumber}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-600">
                    {txn.applicationReference}
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">
                    {txn.customerName}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      txn.type === 'Disbursement' ? 'bg-purple-100 text-purple-800' : 'bg-teal-100 text-teal-800'
                    }`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-mono text-[11px]">
                    {txn.paymentMode}
                  </td>
                  <td className="py-3 px-4 font-black text-gray-900">
                    {formatCurrency(txn.amount)}
                  </td>
                  <td className="py-3 px-4 text-gray-400 font-mono text-[10px]">
                    {formatDateTime(txn.recordedAt)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedTxn(txn)}
                      className="inline-flex items-center gap-1 font-bold text-[#701525] hover:underline"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedTxn && (
        <PrintReceiptModal
          transaction={selectedTxn}
          onClose={() => setSelectedTxn(null)}
        />
      )}
    </div>
  );
};
