import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../../components/common/PageHeader';
import {
  History,
  Receipt,
  Printer,
  Calendar,
  Wallet,
  CheckCircle2,
} from 'lucide-react';
import { Payment } from '../../types/finance';

export const MyPaymentsPage: React.FC = () => {
  const { currentCustomer, payments, setSelectedPaymentForPrint, setActivePrintModal } = useFinance();

  // STRICT SECURITY FILTER
  const myPayments = payments.filter(
    (p) =>
      p.customerName.toLowerCase() === currentCustomer.name.toLowerCase() ||
      p.customerPhone === currentCustomer.phone
  );

  const totalPaid = myPayments.reduce((sum, p) => sum + p.totalPaid, 0);

  const handlePrint = (payment: Payment) => {
    setSelectedPaymentForPrint(payment);
    setActivePrintModal('PAYMENT_RECEIPT');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <PageHeader
        title="Payment History"
        subtitle="Chronological record of interest payments and principal settlements made towards your gold loans."
        badge={{ label: `${myPayments.length} Payment Receipts`, color: 'bg-teal-100 text-teal-900 border border-teal-200' }}
        breadcrumbs={[
          { label: 'My Dashboard', to: '/' },
          { label: 'Payment History' },
        ]}
      />

      {/* Summary Box */}
      <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold text-zinc-400 block tracking-wider">
            Total Payments Made
          </span>
          <div className="text-2xl font-black text-zinc-950 font-mono mt-0.5">
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>All Receipts Acknowledged</span>
        </span>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-600 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Receipt #</th>
                <th className="py-2.5 px-3">Loan #</th>
                <th className="py-2.5 px-3">Payment Type</th>
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3 text-right">Principal</th>
                <th className="py-2.5 px-3 text-right">Interest</th>
                <th className="py-2.5 px-3 text-right">Total Paid</th>
                <th className="py-2.5 px-3 text-center">Receipt Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {myPayments.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-3 font-mono text-zinc-500">{p.paymentDate}</td>
                  <td className="py-3 px-3 font-mono font-bold text-zinc-900">{p.receiptNumber}</td>
                  <td className="py-3 px-3 font-mono text-zinc-600">{p.loanId}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
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
                      onClick={() => handlePrint(p)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      <span>View Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
              {myPayments.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-zinc-400">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
