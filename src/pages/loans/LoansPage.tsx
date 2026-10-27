import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import { Loan } from '../../types/finance';
import {
  FileText,
  Search,
  PlusCircle,
  Wallet,
  Printer,
  ShieldCheck,
  Phone,
  Eye,
  X
} from 'lucide-react';

export const LoansPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';

  const {
    loans,
    searchQuery,
    setSearchQuery,
    setIsNewLoanModalOpen,
    setIsPaymentModalOpen,
    setSelectedLoanForPayment,
    setSelectedLoanForPrint,
    setActivePrintModal,
    returnGold,
  } = useFinance();

  const [statusFilter, setStatusFilter] = useState<string>(initialFilter);
  const [selectedLoanForView, setSelectedLoanForView] = useState<Loan | null>(null);

  // Filter loans
  const filteredLoans = loans.filter((loan) => {
    // Status filter
    if (statusFilter === 'active' && loan.status === 'Fully Paid') return false;
    if (statusFilter === 'due' && loan.status !== 'Due Soon' && loan.status !== 'Overdue') return false;
    if (statusFilter === 'closed' && loan.status !== 'Fully Paid') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = loan.customerName.toLowerCase().includes(q);
      const matchPhone = loan.customerPhone.includes(q);
      const matchId = loan.id.toLowerCase().includes(q);
      const matchPacket = loan.safePacketNumber.toLowerCase().includes(q);
      const matchItems = loan.goldItems.some((it) => it.name.toLowerCase().includes(q));
      return matchName || matchPhone || matchId || matchPacket || matchItems;
    }

    return true;
  });

  const activeCount = loans.filter((l) => l.status !== 'Fully Paid').length;
  const dueCount = loans.filter((l) => l.status === 'Due Soon' || l.status === 'Overdue').length;
  const closedCount = loans.filter((l) => l.status === 'Fully Paid').length;

  const handleReturnGoldClick = (loan: Loan) => {
    if (loan.remainingPrincipal > 0) {
      alert('Cannot return gold while loan balance is pending. Please collect payment first.');
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
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            <span>All Loans Book</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            View all customer gold loans, collect payments, and return gold
          </p>
        </div>

        <button
          onClick={() => setIsNewLoanModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Give New Loan</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Loans ({loans.length})
          </button>

          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              statusFilter === 'active'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Active ({activeCount})
          </button>

          <button
            onClick={() => setStatusFilter('due')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              statusFilter === 'due'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Due / Overdue ({dueCount})
          </button>

          <button
            onClick={() => setStatusFilter('closed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              statusFilter === 'closed'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Closed ({closedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, loan #..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">Loan # & Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Gold Ornaments</th>
                <th className="p-4 text-right">Loan Amount</th>
                <th className="p-4 text-right">Remaining Principal</th>
                <th className="p-4 text-right">Monthly Interest</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No loans found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Loan # & Date */}
                    <td className="p-4">
                      <span className="font-mono font-bold text-amber-400 block text-sm">{loan.id}</span>
                      <span className="text-[11px] text-slate-400">{loan.loanDate}</span>
                      <span className="text-[10px] text-slate-500 block">Due: {loan.dueDate}</span>
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <span className="font-bold text-white block text-sm">{loan.customerName}</span>
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {loan.customerPhone}
                      </span>
                      {loan.customerAddress && (
                        <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">
                          {loan.customerAddress}
                        </span>
                      )}
                    </td>

                    {/* Gold Ornaments */}
                    <td className="p-4">
                      <span className="font-bold text-slate-200 block">
                        {loan.totalWeightGrams.toFixed(2)} grams net
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {loan.goldItems.map((i) => i.name).join(', ')}
                      </span>
                      <span className="text-[10px] text-amber-400/90 font-medium block">
                        {loan.safePacketNumber} ({loan.safeStatus})
                      </span>
                    </td>

                    {/* Loan Amount */}
                    <td className="p-4 text-right">
                      <span className="font-bold text-slate-300">
                        ₹{loan.loanAmount.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Remaining Principal */}
                    <td className="p-4 text-right">
                      <span className={`font-black text-sm ${loan.remainingPrincipal === 0 ? 'text-slate-500 line-through' : 'text-white'}`}>
                        ₹{loan.remainingPrincipal.toLocaleString('en-IN')}
                      </span>
                      {loan.interestDue > 0 && (
                        <span className="text-[10px] text-rose-400 block font-semibold">
                          +₹{loan.interestDue.toLocaleString('en-IN')} due
                        </span>
                      )}
                    </td>

                    {/* Monthly Interest */}
                    <td className="p-4 text-right">
                      <span className="font-semibold text-emerald-400 block">
                        ₹{loan.monthlyInterestAmount.toLocaleString('en-IN')} / mo
                      </span>
                      <span className="text-[10px] text-slate-500">
                        ({loan.monthlyInterestRate}%)
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          loan.status === 'Fully Paid'
                            ? 'bg-slate-700/60 text-slate-400 border border-slate-600'
                            : loan.status === 'Overdue'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : loan.status === 'Due Soon'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Collect Payment */}
                        {loan.status !== 'Fully Paid' && (
                          <button
                            onClick={() => {
                              setSelectedLoanForPayment(loan);
                              setIsPaymentModalOpen(true);
                            }}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                            title="Collect payment"
                          >
                            <Wallet className="w-4 h-4" />
                          </button>
                        )}

                        {/* Return Gold */}
                        {loan.status === 'Fully Paid' && loan.safeStatus === 'In Safe' && (
                          <button
                            onClick={() => handleReturnGoldClick(loan)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
                            title="Return Gold to Customer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Return Gold</span>
                          </button>
                        )}

                        {/* Print Loan Slip */}
                        <button
                          onClick={() => {
                            setSelectedLoanForPrint(loan);
                            setActivePrintModal('LOAN_SLIP');
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                          title="Print Loan Voucher"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* View Full Details */}
                        <button
                          onClick={() => setSelectedLoanForView(loan)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                          title="View loan details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loan Details Modal */}
      {selectedLoanForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg">Loan Details: {selectedLoanForView.id}</h3>
              </div>
              <button
                onClick={() => setSelectedLoanForView(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* Customer Info Card */}
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Customer Name:</span>
                  <span className="text-sm font-bold text-white">{selectedLoanForView.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Mobile Phone:</span>
                  <span className="text-sm font-bold text-white">{selectedLoanForView.customerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Address:</span>
                  <span className="text-slate-200">{selectedLoanForView.customerAddress || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">ID Proof:</span>
                  <span className="text-slate-200">{selectedLoanForView.customerIdProof || 'Verified'}</span>
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <div>
                  <span className="text-slate-400 block text-[11px]">Original Loan:</span>
                  <span className="text-base font-bold text-white">
                    ₹{selectedLoanForView.loanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Remaining Principal:</span>
                  <span className="text-base font-black text-amber-400">
                    ₹{selectedLoanForView.remainingPrincipal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Monthly Interest:</span>
                  <span className="text-base font-bold text-emerald-400">
                    ₹{selectedLoanForView.monthlyInterestAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400">({selectedLoanForView.monthlyInterestRate}%)</span>
                </div>
              </div>

              {/* Gold Ornaments */}
              <div>
                <h4 className="font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Gold Ornaments Held ({selectedLoanForView.totalWeightGrams.toFixed(2)}g net)
                </h4>
                <div className="bg-slate-800/60 rounded-xl border border-slate-700/60 divide-y divide-slate-700/60">
                  {selectedLoanForView.goldItems.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">{item.name}</span>
                        <span className="text-slate-400 text-[11px]">
                          Purity: {item.purity} · Gross: {item.grossWeight}g · Net: {item.netWeight}g
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white">₹{item.estimatedValue.toLocaleString('en-IN')}</span>
                        <span className="text-slate-400 text-[10px] block">Market Value</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safe & Timeline */}
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Safe Packet:</span>
                  <span className="font-bold text-white">{selectedLoanForView.safePacketNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Safe Status:</span>
                  <span className={`font-bold ${selectedLoanForView.safeStatus === 'In Safe' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {selectedLoanForView.safeStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Loan Date:</span>
                  <span className="text-slate-200">{selectedLoanForView.loanDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Due Date:</span>
                  <span className="text-slate-200">{selectedLoanForView.dueDate}</span>
                </div>
                {selectedLoanForView.notes && (
                  <div className="pt-2 border-t border-slate-700/60">
                    <span className="text-slate-400 block text-[11px]">Notes:</span>
                    <span className="text-slate-300">{selectedLoanForView.notes}</span>
                  </div>
                )}
              </div>

            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end gap-2 bg-slate-900/90">
              <button
                onClick={() => {
                  setSelectedLoanForPrint(selectedLoanForView);
                  setActivePrintModal('LOAN_SLIP');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Loan Voucher</span>
              </button>
              <button
                onClick={() => setSelectedLoanForView(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
