import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../../components/common/PageHeader';
import {
  Receipt,
  Search,
  Printer,
  Calendar,
  Wallet,
  Coins,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Payment } from '../../types/finance';

export const ReceiptsPage: React.FC = () => {
  const { payments, setSelectedPaymentForPrint, setActivePrintModal } = useFinance();
  const [search, setSearch] = useState('');

  const filteredPayments = payments.filter(
    (p) =>
      p.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.loanId.toLowerCase().includes(search.toLowerCase())
  );

  const totalCollected = payments.reduce((sum, p) => sum + p.totalPaid, 0);
  const totalPrincipal = payments.reduce((sum, p) => sum + p.principalPaid, 0);
  const totalInterest = payments.reduce((sum, p) => sum + p.interestPaid, 0);

  const handlePrintSlip = (payment: Payment) => {
    setSelectedPaymentForPrint(payment);
    setActivePrintModal('PAYMENT_RECEIPT');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <PageHeader
        title="Counter Receipts & Tax Slips"
        subtitle="Historical repository of generated payment receipts and customer disbursement acknowledgements."
        badge={{ label: 'Official Audit Register', color: 'bg-emerald-100 text-emerald-900 border border-emerald-200' }}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Receipts' },
        ]}
      />

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Inflows Captured</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-zinc-500 mt-1 block">Across {payments.length} receipts</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Interest Realized</span>
            <Coins className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-800 font-mono">
            ₹{totalInterest.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-zinc-500 mt-1 block">Earnings on loan portfolio</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Principal Returned</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-zinc-950 font-mono">
            ₹{totalPrincipal.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-zinc-500 mt-1 block">Reduces loan exposure</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search receipt #, borrower, loan #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-emerald-600 rounded-xl text-xs text-zinc-900 outline-none"
            />
          </div>
          <span className="text-xs font-bold text-zinc-500">
            Showing {filteredPayments.length} receipts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-600 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-2.5 px-3">Receipt #</th>
                <th className="py-2.5 px-3">Payment Date</th>
                <th className="py-2.5 px-3">Borrower</th>
                <th className="py-2.5 px-3">Loan Account</th>
                <th className="py-2.5 px-3">Transaction</th>
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3 text-right">Principal</th>
                <th className="py-2.5 px-3 text-right">Interest</th>
                <th className="py-2.5 px-3 text-right">Total Paid</th>
                <th className="py-2.5 px-3 text-center">Print Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-zinc-900">{p.receiptNumber}</td>
                  <td className="py-3 px-3 font-mono text-zinc-500">{p.paymentDate}</td>
                  <td className="py-3 px-3 font-bold text-zinc-950">{p.customerName}</td>
                  <td className="py-3 px-3 font-mono text-zinc-600">{p.loanId}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700">
                      {p.paymentType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-600 font-medium">{p.paymentMethod}</td>
                  <td className="py-3 px-3 text-right font-mono text-zinc-600">
                    ₹{p.principalPaid.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-amber-800">
                    ₹{p.interestPaid.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-emerald-700">
                    ₹{p.totalPaid.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handlePrintSlip(p)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                      title="Reprint Computer Generated Receipt"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Slip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
