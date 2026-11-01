import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import { Loan } from '../../types/finance';
import { maskIdProof } from '../../utils/formatters';
import {
  FileText,
  Search,
  PlusCircle,
  Wallet,
  Printer,
  ShieldCheck,
  Phone,
  Eye,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowRight
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
      alert(`Cannot return gold while loan balance is pending. Customer has ₹${loan.remainingPrincipal.toLocaleString('en-IN')} remaining balance.`);
      return;
    }
    if (window.confirm(`Confirm return of gold packet "${loan.safePacketNumber}" (${loan.totalWeightGrams}g) to ${loan.customerName}?`)) {
      const updated = returnGold(loan.id);
      if (updated) {
        setSelectedLoanForPrint(updated);
        setActivePrintModal('GOLD_RETURN');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight flex items-center gap-2.5 font-heading">
            <FileText className="w-7 h-7 text-zinc-900" />
            <span>All Loans Ledger</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-0.5">
            Real-time portfolio records, collateral pawn details, collections, and gold release.
          </p>
        </div>

        <button
          onClick={() => setIsNewLoanModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm rounded-full shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto cursor-pointer"
        >
          <span>+ Give New Loan</span>
          <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <ArrowUpRight className="w-3 h-3 text-white" />
          </div>
        </button>
      </div>

      {/* Filter Pills & Search Bar (Finvo Rounded Styling) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-zinc-200/80 p-3 rounded-2xl shadow-xs">
        
        {/* Pills container */}
        <div className="flex items-center p-1 bg-zinc-100/90 rounded-full border border-zinc-200/60 overflow-x-auto scrollbar-none gap-0.5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/80'
            }`}
          >
            All Loans ({loans.length})
          </button>

          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/80'
            }`}
          >
            Active ({activeCount})
          </button>

          <button
            onClick={() => setStatusFilter('due')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === 'due'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/80'
            }`}
          >
            Due / Overdue ({dueCount})
          </button>

          <button
            onClick={() => setStatusFilter('closed')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === 'closed'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/80'
            }`}
          >
            Settled ({closedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, loan #, packet..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 hover:bg-zinc-100 focus:bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-950/5 rounded-full text-xs text-zinc-900 placeholder-zinc-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white border border-zinc-200/80 rounded-[28px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] overflow-hidden w-full max-w-full min-w-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[750px] text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-600 font-bold text-[11px] border-b border-zinc-200 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Loan # & Date</th>
                <th className="py-3.5 px-4">Borrower Customer</th>
                <th className="py-3.5 px-4">Gold Pledged</th>
                <th className="py-3.5 px-4 text-right">Sanctioned</th>
                <th className="py-3.5 px-4 text-right">Outstanding Principal</th>
                <th className="py-3.5 px-4 text-right">Monthly Interest</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-zinc-400 font-medium">
                    No loans found matching the selected filter or search query.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-zinc-50/80 transition-colors">
                    
                    {/* Loan # & Date */}
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-zinc-900 bg-zinc-100 border border-zinc-200/80 px-2 py-0.5 rounded-full text-xs block w-fit">
                        {loan.id}
                      </span>
                      <span className="text-[11px] text-zinc-500 block mt-1 font-semibold">{loan.loanDate}</span>
                      <span className="text-[10px] text-zinc-400 block font-medium">Due: {loan.dueDate}</span>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-zinc-950 block text-sm font-heading">{loan.customerName}</span>
                      <span className="text-zinc-500 flex items-center gap-1 text-[11px] mt-0.5 font-medium">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {loan.customerPhone}
                      </span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        {maskIdProof(loan.customerIdProof)}
                      </span>
                    </td>

                    {/* Gold Ornaments */}
                    <td className="py-4 px-4">
                      <span className="font-extrabold text-zinc-900 block font-heading">
                        {loan.totalWeightGrams.toFixed(2)} g net
                      </span>
                      <span className="text-[11px] text-zinc-500 block truncate max-w-[170px]" title={loan.goldItems.map((i) => i.name).join(', ')}>
                        {loan.goldItems.map((i) => i.name).join(', ')}
                      </span>
                      <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
                        {loan.safePacketNumber} · {loan.safeStatus}
                      </span>
                    </td>

                    {/* Loan Amount */}
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-zinc-600">
                        ₹{loan.loanAmount.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Remaining Principal */}
                    <td className="py-4 px-4 text-right">
                      <span className={`font-extrabold text-sm font-heading ${loan.remainingPrincipal === 0 ? 'text-zinc-400 line-through' : 'text-zinc-950'}`}>
                        ₹{loan.remainingPrincipal.toLocaleString('en-IN')}
                      </span>
                      {loan.interestDue > 0 && (
                        <span className="text-[10px] text-rose-600 block font-bold">
                          +₹{loan.interestDue.toLocaleString('en-IN')} due
                        </span>
                      )}
                    </td>

                    {/* Monthly Interest */}
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-emerald-700 block">
                        ₹{loan.monthlyInterestAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        ({loan.monthlyInterestRate}% / mo)
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold border ${
                          loan.status === 'Fully Paid'
                            ? 'bg-zinc-100 text-zinc-600 border-zinc-200'
                            : loan.status === 'Overdue'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : loan.status === 'Due Soon'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Collect Payment */}
                        {loan.status !== 'Fully Paid' && (
                          <button
                            onClick={() => {
                              setSelectedLoanForPayment(loan);
                              setIsPaymentModalOpen(true);
                            }}
                            className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors cursor-pointer shadow-xs"
                            title="Collect payment"
                          >
                            <Wallet className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Return Gold */}
                        {loan.status === 'Fully Paid' && loan.safeStatus === 'In Safe' && (
                          <button
                            onClick={() => handleReturnGoldClick(loan)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full text-xs font-bold transition-colors cursor-pointer shadow-xs"
                            title="Return Gold to Customer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Return</span>
                          </button>
                        )}

                        {/* Print Loan Slip */}
                        <button
                          onClick={() => {
                            setSelectedLoanForPrint(loan);
                            setActivePrintModal('LOAN_SLIP');
                          }}
                          className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors cursor-pointer"
                          title="Print Loan Voucher"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* View Full Details */}
                        <button
                          onClick={() => setSelectedLoanForView(loan)}
                          className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors cursor-pointer"
                          title="View loan details"
                        >
                          <Eye className="w-3.5 h-3.5" />
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

      {/* Loan Details Modal (Finvo Modern Modal) */}
      {selectedLoanForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-zinc-200 text-zinc-900 rounded-[28px] w-full max-w-2xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-zinc-950 font-heading">
                  Loan Record: <span className="font-mono text-zinc-900">{selectedLoanForView.id}</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedLoanForView(null)}
                className="text-zinc-400 hover:text-zinc-800 p-1.5 rounded-full hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* Customer Info Card */}
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-zinc-500 text-[11px] block font-semibold">Borrower Profile:</span>
                  <span className="font-extrabold text-zinc-950 text-base font-heading">{selectedLoanForView.customerName}</span>
                  <span className="text-zinc-600 block mt-0.5 flex items-center gap-1 font-medium">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    {selectedLoanForView.customerPhone}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[11px] block font-semibold">Verified Identification:</span>
                  <span className="font-bold text-zinc-900 block">{selectedLoanForView.customerIdProof}</span>
                  <span className="text-zinc-500 block truncate mt-0.5">{selectedLoanForView.customerAddress || 'No address registered'}</span>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                  <span className="text-zinc-500 text-[10px] block font-semibold uppercase">Sanctioned:</span>
                  <span className="font-extrabold text-zinc-950 text-base font-heading">₹{selectedLoanForView.loanAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                  <span className="text-zinc-500 text-[10px] block font-semibold uppercase">Balance:</span>
                  <span className={`font-extrabold text-base font-heading ${selectedLoanForView.remainingPrincipal === 0 ? 'text-emerald-700' : 'text-zinc-950'}`}>
                    ₹{selectedLoanForView.remainingPrincipal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                  <span className="text-zinc-500 text-[10px] block font-semibold uppercase">Monthly Interest:</span>
                  <span className="font-bold text-emerald-700 text-sm">₹{selectedLoanForView.monthlyInterestAmount.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-zinc-400">({selectedLoanForView.monthlyInterestRate}%)</span>
                </div>

                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                  <span className="text-zinc-500 text-[10px] block font-semibold uppercase">Interest Paid:</span>
                  <span className="font-bold text-zinc-900 text-sm">₹{selectedLoanForView.totalInterestPaid.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Pledged Gold Ornaments Table */}
              <div>
                <h4 className="font-bold text-zinc-900 text-xs mb-2 uppercase tracking-wider font-heading">
                  Pledged Gold Ornaments ({selectedLoanForView.goldItems.length} items):
                </h4>
                <div className="border border-zinc-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-zinc-50 text-zinc-600 font-bold border-b border-zinc-200">
                      <tr>
                        <th className="p-2.5 text-left">Item Description</th>
                        <th className="p-2.5 text-center">Purity</th>
                        <th className="p-2.5 text-right">Gross Wt</th>
                        <th className="p-2.5 text-right">Net Wt</th>
                        <th className="p-2.5 text-right">Valuation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-700">
                      {selectedLoanForView.goldItems.map((item) => (
                        <tr key={item.id}>
                          <td className="p-2.5 font-semibold text-zinc-900">{item.name}</td>
                          <td className="p-2.5 text-center">
                            <span className="px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200 text-[10px]">
                              {item.purity}
                            </span>
                          </td>
                          <td className="p-2.5 text-right">{item.grossWeight.toFixed(2)} g</td>
                          <td className="p-2.5 text-right font-bold text-zinc-900">{item.netWeight.toFixed(2)} g</td>
                          <td className="p-2.5 text-right font-semibold text-zinc-800">₹{item.estimatedValue.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-zinc-50 font-bold border-t border-zinc-200 text-zinc-900">
                      <tr>
                        <td colSpan={3} className="p-2.5 text-right">Totals:</td>
                        <td className="p-2.5 text-right text-zinc-950 font-extrabold">{selectedLoanForView.totalWeightGrams.toFixed(2)} g</td>
                        <td className="p-2.5 text-right">₹{selectedLoanForView.goldValueTotal.toLocaleString('en-IN')}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Safe & Dates Card */}
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-zinc-500 text-[10px] block font-medium">Safe Locker Packet:</span>
                  <span className="font-mono font-bold text-zinc-900">{selectedLoanForView.safePacketNumber}</span>
                  <span className="text-[11px] text-zinc-600 block mt-0.5">Status: <strong>{selectedLoanForView.safeStatus}</strong></span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block font-medium">Loan Date & Due Date:</span>
                  <span className="font-semibold text-zinc-900 block">{selectedLoanForView.loanDate}</span>
                  <span className="text-[11px] text-zinc-500 block">Due: {selectedLoanForView.dueDate}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block font-medium">Issued / Appraised By:</span>
                  <span className="font-semibold text-zinc-900 block">{selectedLoanForView.createdByStaffName || 'Counter Staff'}</span>
                  {selectedLoanForView.appraisedByStaffName && (
                    <span className="text-[10px] text-zinc-500 block">Valuer: {selectedLoanForView.appraisedByStaffName}</span>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedLoanForView(null)}
                className="px-5 py-2 bg-white hover:bg-zinc-100 text-zinc-700 font-semibold rounded-full border border-zinc-300 transition-colors text-xs cursor-pointer shadow-xs"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedLoanForPrint(selectedLoanForView);
                    setActivePrintModal('LOAN_SLIP');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold rounded-full text-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-zinc-600" />
                  <span>Print Slip</span>
                </button>

                {selectedLoanForView.status !== 'Fully Paid' && (
                  <button
                    onClick={() => {
                      const l = selectedLoanForView;
                      setSelectedLoanForView(null);
                      setSelectedLoanForPayment(l);
                      setIsPaymentModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Collect Payment</span>
                  </button>
                )}

                {selectedLoanForView.status === 'Fully Paid' && selectedLoanForView.safeStatus === 'In Safe' && (
                  <button
                    onClick={() => {
                      const l = selectedLoanForView;
                      setSelectedLoanForView(null);
                      handleReturnGoldClick(l);
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-full text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Return Gold</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
