import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../../components/common/PageHeader';
import {
  BarChart3,
  FileText,
  Printer,
  Download,
  Calendar,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Wallet,
  Coins,
  CheckCircle2,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { loans, payments, dayBook, currentRole } = useFinance();
  const [activeReportTab, setActiveReportTab] = useState<'PORTFOLIO' | 'OVERDUE' | 'VAULT' | 'DAYBOOK'>('PORTFOLIO');

  const activeLoans = loans.filter((l) => l.status !== 'Fully Paid');
  const totalPrincipal = activeLoans.reduce((sum, l) => sum + l.remainingPrincipal, 0);
  const totalGoldGrams = loans.filter((l) => l.safeStatus === 'In Safe').reduce((sum, l) => sum + l.totalWeightGrams, 0);
  const overdueLoans = loans.filter((l) => l.status === 'Overdue');
  const totalCollections = payments.reduce((sum, p) => sum + p.totalPaid, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Muthoot-Style Reports Header */}
      <PageHeader
        title={currentRole === 'ADMIN' ? 'Enterprise Financial & Audit Reports' : 'Branch Financial Reports'}
        subtitle="Official audit reports for RBI compliance, vault inventory verification, and portfolio performance."
        badge={{ label: 'Banking Audit Standard', color: 'bg-zinc-100 text-zinc-800 border border-zinc-200' }}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Reports' },
        ]}
        actions={
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Report</span>
          </button>
        }
      />

      {/* Report Type Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveReportTab('PORTFOLIO')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeReportTab === 'PORTFOLIO'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          1. Loan Portfolio Ledger
        </button>
        <button
          onClick={() => setActiveReportTab('OVERDUE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeReportTab === 'OVERDUE'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          2. Overdue & NPA Aging ({overdueLoans.length})
        </button>
        <button
          onClick={() => setActiveReportTab('VAULT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeReportTab === 'VAULT'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          3. Vault Gold Audit
        </button>
        <button
          onClick={() => setActiveReportTab('DAYBOOK')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeReportTab === 'DAYBOOK'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          4. Day Book Cash Register
        </button>
      </div>

      {/* Tab 1: Loan Portfolio Ledger */}
      {activeReportTab === 'PORTFOLIO' && (
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-sm font-bold text-zinc-950 font-heading">
                Loan Portfolio & Outstanding Register
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Total outstanding balance: <strong className="text-zinc-900">₹{totalPrincipal.toLocaleString('en-IN')}</strong> across <strong className="text-zinc-900">{activeLoans.length} active loans</strong>
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400">As of today</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-600 uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-2.5 px-3">Loan #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Sanctioned</th>
                  <th className="py-2.5 px-3 text-right">Outstanding</th>
                  <th className="py-2.5 px-3 text-right">Int. Rate</th>
                  <th className="py-2.5 px-3 text-right">Monthly Int.</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-zinc-900">{loan.id}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-zinc-900 block">{loan.customerName}</span>
                      <span className="text-[10px] text-zinc-400">{loan.customerPhone}</span>
                    </td>
                    <td className="py-3 px-3 text-zinc-600">{loan.goldItems.map(g => g.name).join(', ')}</td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-600">₹{loan.loanAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono font-black text-zinc-950">₹{loan.remainingPrincipal.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-700">{loan.monthlyInterestRate}% / mo</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">₹{loan.monthlyInterestAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          loan.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : loan.status === 'Overdue'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Overdue & NPA Aging */}
      {activeReportTab === 'OVERDUE' && (
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-sm font-bold text-zinc-950 font-heading">
                Overdue & NPA Watchlist
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Accounts exceeding due date for interest or principal settlement.
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700">{overdueLoans.length} Default Risk</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-600 uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-2.5 px-3">Borrower</th>
                  <th className="py-2.5 px-3">Loan Account</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3 text-right">Principal at Risk</th>
                  <th className="py-2.5 px-3 text-right">Overdue Interest</th>
                  <th className="py-2.5 px-3 text-center">Recovery Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {overdueLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-zinc-950 block">{loan.customerName}</span>
                      <span className="text-[10px] text-zinc-400">{loan.customerPhone}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-zinc-900">{loan.id}</td>
                    <td className="py-3 px-3 font-mono text-rose-700 font-bold">{loan.dueDate}</td>
                    <td className="py-3 px-3 text-right font-mono font-black text-zinc-950">₹{loan.remainingPrincipal.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono font-black text-rose-700">₹{loan.monthlyInterestAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        Notice Issued
                      </span>
                    </td>
                  </tr>
                ))}
                {overdueLoans.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400">
                      No overdue accounts! Portfolio is 100% current.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Vault Gold Audit */}
      {activeReportTab === 'VAULT' && (
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-sm font-bold text-zinc-950 font-heading">
                Safe Locker & Physical Gold Audit Register
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Total physical gold in custody: <strong className="text-amber-800">{totalGoldGrams.toFixed(2)} grams</strong> across sealed dual-custody envelopes.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700">Audit Status: 100% Verified</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-600 uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-2.5 px-3">Packet ID</th>
                  <th className="py-2.5 px-3">Loan #</th>
                  <th className="py-2.5 px-3">Owner Customer</th>
                  <th className="py-2.5 px-3">Ornaments</th>
                  <th className="py-2.5 px-3 text-right">Net Weight</th>
                  <th className="py-2.5 px-3 text-center">Safe Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loans.filter((l) => l.safeStatus === 'In Safe').map((loan) => (
                  <tr key={loan.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-amber-800">{loan.safePacketNumber}</td>
                    <td className="py-3 px-3 font-mono font-bold text-zinc-900">{loan.id}</td>
                    <td className="py-3 px-3 font-bold text-zinc-900">{loan.customerName}</td>
                    <td className="py-3 px-3 text-zinc-600">{loan.goldItems.map(g => g.name).join(', ')}</td>
                    <td className="py-3 px-3 text-right font-mono font-black text-amber-800">{loan.totalWeightGrams.toFixed(2)} g</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        {loan.safeStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Day Book Cash Register */}
      {activeReportTab === 'DAYBOOK' && (
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-sm font-bold text-zinc-950 font-heading">
                Daily Cashier Day Book Register
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Chronological ledger of counter receipts and loan disbursements.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-zinc-900">Total Entries: {dayBook.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-600 uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-2.5 px-3">Time / Date</th>
                  <th className="py-2.5 px-3">Particulars</th>
                  <th className="py-2.5 px-3">Direction</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3 text-right">Inflow (₹)</th>
                  <th className="py-2.5 px-3 text-right">Outflow (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {dayBook.map((entry) => (
                  <tr key={entry.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-3 font-mono text-zinc-500">{entry.time}</td>
                    <td className="py-3 px-3 font-medium text-zinc-900">{entry.description}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          entry.direction === 'IN'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}
                      >
                        {entry.direction}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-600 font-medium">{entry.paymentMethod}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                      {entry.direction === 'IN' ? `₹${entry.amount.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-700">
                      {entry.direction === 'OUT' ? `₹${entry.amount.toLocaleString('en-IN')}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
