import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { PrintReceiptModal } from '../../../components/common/PrintReceiptModal';
import { DemoTransaction } from '../../../types';
import { Receipt, Printer, Search } from 'lucide-react';

export const CashierReceiptsPage: React.FC = () => {
  const { transactions } = useDemoData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<DemoTransaction | null>(null);

  const filtered = transactions.filter(
    (t) =>
      t.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.applicationReference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#701525] font-display">
            Official Receipts & Vouchers Repository
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Browse and reprint certified simulated receipts for borrower loan payouts and collections.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by receipt number (e.g. RCP-2026-0041), customer, or reference..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((txn) => (
          <div
            key={txn.id}
            className="bg-white rounded-2xl p-5 border border-[#E8E2D8] shadow-sm hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs bg-[#FAF8F3] text-[#701525] px-2.5 py-0.5 rounded border border-[#E8E2D8]">
                  {txn.receiptNumber}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  txn.type === 'Disbursement' ? 'bg-purple-50 text-purple-700' : 'bg-teal-50 text-teal-700'
                }`}>
                  {txn.type}
                </span>
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-sm font-bold text-gray-900">{txn.customerName}</p>
                <p className="text-xs text-gray-500 font-mono">Ref: {txn.applicationReference}</p>
                <p className="text-xs text-gray-600 font-mono">Txn: {txn.transactionReference}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">{txn.paymentMode}</span>
                <span className="text-base font-black text-[#701525]">
                  {formatCurrency(txn.amount)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedTxn(txn)}
                className="w-full py-2 rounded-xl text-xs font-bold bg-[#FAF8F3] hover:bg-[#701525] text-[#701525] hover:text-white border border-[#E8E2D8] transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View & Print Receipt</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTxn && (
        <PrintReceiptModal
          transaction={selectedTxn}
          onClose={() => setSelectedTxn(null)}
        />
      )}
    </div>
  );
};
