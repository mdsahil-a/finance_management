import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../../components/common/PageHeader';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  Receipt,
  FileCheck,
} from 'lucide-react';

export const MyStatementsPage: React.FC = () => {
  const { currentCustomer, loans, payments } = useFinance();

  const myLoans = loans.filter(
    (l) => l.customerName === currentCustomer.name || l.customerPhone === currentCustomer.phone
  );
  const myPayments = payments.filter(
    (p) =>
      p.customerName.toLowerCase() === currentCustomer.name.toLowerCase() ||
      p.customerPhone === currentCustomer.phone
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <PageHeader
        title="Statements & Tax Receipts"
        subtitle="Official financial statements, annual interest certificates, and tax compliance records."
        badge={{ label: 'Customer Documents', color: 'bg-teal-100 text-teal-900 border border-teal-200' }}
        breadcrumbs={[
          { label: 'My Dashboard', to: '/' },
          { label: 'Statements' },
        ]}
      />

      {/* Available Statements Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Annual Loan Account Statement */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-teal-700" />
              <h3 className="font-bold text-sm text-zinc-950 font-heading">
                Annual Loan Account Statement (FY 2026-27)
              </h3>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Consolidated statement of all disbursements, repayments, interest debits, and remaining balance for all active and settled loan accounts.
            </p>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-mono">PDF &middot; Certified</span>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Statement</span>
            </button>
          </div>
        </div>

        {/* Card 2: Interest Certificate */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-5 h-5 text-amber-700" />
              <h3 className="font-bold text-sm text-zinc-950 font-heading">
                Interest Paid Certificate for Income Tax (ITR)
              </h3>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Official certificate stating total interest paid during the financial year for tax accounting and verification purposes.
            </p>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-mono">Form 16 Certificate</span>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Certificate</span>
            </button>
          </div>
        </div>

      </div>

      {/* Account Statement Table View */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-zinc-950 font-heading">
          Ledger Transactions Summary
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-600 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Loan Account</th>
                <th className="py-2.5 px-3 text-right">Debit (Disbursed)</th>
                <th className="py-2.5 px-3 text-right">Credit (Paid)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {myPayments.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-zinc-500">{p.paymentDate}</td>
                  <td className="py-2.5 px-3 font-medium text-zinc-900">{p.paymentType} via {p.paymentMethod}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-600">{p.loanId}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-zinc-400">-</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">₹{p.totalPaid.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
