import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ShieldCheck, Search, Printer, CheckCircle2, Phone, Box } from 'lucide-react';
import { Loan } from '../../types/finance';

export const SafePage: React.FC = () => {
  const { loans, returnGold, setSelectedLoanForPrint, setActivePrintModal } = useFinance();
  const [filter, setFilter] = useState<'all' | 'in_safe' | 'returned'>('in_safe');
  const [search, setSearch] = useState('');

  const safeLoans = loans.filter((l) => {
    if (filter === 'in_safe' && l.safeStatus !== 'In Safe') return false;
    if (filter === 'returned' && l.safeStatus !== 'Returned to Customer') return false;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchPacket = l.safePacketNumber.toLowerCase().includes(q);
      const matchCustomer = l.customerName.toLowerCase().includes(q);
      const matchPhone = l.customerPhone.includes(q);
      const matchLoan = l.id.toLowerCase().includes(q);
      return matchPacket || matchCustomer || matchPhone || matchLoan;
    }

    return true;
  });

  const totalGramsInSafe = loans
    .filter((l) => l.safeStatus === 'In Safe')
    .reduce((acc, l) => acc + l.totalWeightGrams, 0);

  const totalValueInSafe = loans
    .filter((l) => l.safeStatus === 'In Safe')
    .reduce((acc, l) => acc + l.goldValueTotal, 0);

  const totalPacketsInSafe = loans.filter((l) => l.safeStatus === 'In Safe').length;
  const totalReturnedPackets = loans.filter((l) => l.safeStatus === 'Returned to Customer').length;

  const handleReturnGold = (loan: Loan) => {
    if (loan.remainingPrincipal > 0) {
      alert(`Cannot return gold. Customer has ₹${loan.remainingPrincipal.toLocaleString('en-IN')} pending balance.`);
      return;
    }
    const updated = returnGold(loan.id);
    if (updated) {
      setSelectedLoanForPrint(updated);
      setActivePrintModal('GOLD_RETURN');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <span>Gold in Safe Locker</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Physical locker inventory of all gold packets kept as loan security
          </p>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
            Total Gold in Safe
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-300 mt-1 block">
            {totalGramsInSafe.toFixed(2)} <span className="text-base font-normal text-slate-400">grams</span>
          </span>
          <span className="text-xs text-slate-500 mt-1 block">Net gold weight securely locked</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
            Locker Packets Count
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
            {totalPacketsInSafe} <span className="text-base font-normal text-slate-400">packets</span>
          </span>
          <span className="text-xs text-slate-500 mt-1 block">Currently stored in locker bays</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
            Estimated Gold Market Value
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">
            ₹{totalValueInSafe.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">Total valuation of kept gold</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('in_safe')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === 'in_safe'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            In Safe ({totalPacketsInSafe})
          </button>
          <button
            onClick={() => setFilter('returned')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === 'returned'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Returned to Customer ({totalReturnedPackets})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === 'all'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All ({loans.length})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search packet #, customer, loan..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">Packet / Locker #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Gold Ornaments</th>
                <th className="p-4 text-right">Net Weight</th>
                <th className="p-4 text-right">Gold Value</th>
                <th className="p-4">Loan Linked</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {safeLoans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No gold packets found in this view.
                  </td>
                </tr>
              ) : (
                safeLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="font-mono font-bold text-white text-sm">
                          {loan.safePacketNumber}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-white block">{loan.customerName}</span>
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {loan.customerPhone}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="text-slate-200 block font-medium">
                        {loan.goldItems.map((it) => it.name).join(', ')}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {loan.goldItems.length} item(s) · {loan.goldItems[0]?.purity || '22K'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <span className="font-black text-amber-300 text-sm">
                        {loan.totalWeightGrams.toFixed(2)} g
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <span className="font-bold text-slate-200">
                        ₹{loan.goldValueTotal.toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-mono font-semibold text-slate-300 block">{loan.id}</span>
                      <span className="text-[10px] text-slate-500">
                        {loan.remainingPrincipal === 0 ? 'Fully Paid' : `₹${loan.remainingPrincipal.toLocaleString('en-IN')} due`}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          loan.safeStatus === 'In Safe'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {loan.safeStatus}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {loan.safeStatus === 'In Safe' && loan.remainingPrincipal === 0 && (
                          <button
                            onClick={() => handleReturnGold(loan)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                            title="Return Gold to Customer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Return Gold</span>
                          </button>
                        )}

                        {loan.safeStatus === 'Returned to Customer' && (
                          <button
                            onClick={() => {
                              setSelectedLoanForPrint(loan);
                              setActivePrintModal('GOLD_RETURN');
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                            title="Print Return Slip"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Slip</span>
                          </button>
                        )}

                        {loan.safeStatus === 'In Safe' && loan.remainingPrincipal > 0 && (
                          <span className="text-[11px] text-slate-500 italic">
                            Locked (Loan active)
                          </span>
                        )}
                      </div>
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
