import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { BookOpen, PlusCircle, ArrowDownLeft, ArrowUpRight, Wallet, DollarSign, X } from 'lucide-react';

export const DayBookPage: React.FC = () => {
  const { dayBook, addDayBookEntry } = useFinance();

  const [isAddCashModalOpen, setIsAddCashModalOpen] = useState(false);
  const [entryType, setEntryType] = useState<'CASH_ADDED' | 'EXPENSE'>('CASH_ADDED');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const cashInTotal = dayBook
    .filter((d) => d.direction === 'IN')
    .reduce((acc, d) => acc + d.amount, 0);

  const cashOutTotal = dayBook
    .filter((d) => d.direction === 'OUT')
    .reduce((acc, d) => acc + d.amount, 0);

  const netCashInHand = cashInTotal - cashOutTotal;

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    addDayBookEntry({
      type: entryType,
      description: description.trim(),
      amount: num,
      direction: entryType === 'CASH_ADDED' ? 'IN' : 'OUT',
      paymentMethod: 'Cash',
    });

    setIsAddCashModalOpen(false);
    setAmount('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight flex items-center gap-2.5 font-heading">
            <BookOpen className="w-7 h-7 text-zinc-900" />
            <span>Daily Cash Book</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-0.5">
            Real-time counter cash drawer ledger, customer repayments, disbursements, and petty expenses.
          </p>
        </div>

        <button
          onClick={() => {
            setEntryType('CASH_ADDED');
            setIsAddCashModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-full shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Cash / Expense</span>
        </button>
      </div>

      {/* 3 Summary Cards (Finvo Modern Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase tracking-wider font-heading">
            <span>Cash in Counter Drawer</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-3 block tracking-tight font-heading">
            ₹{netCashInHand.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block font-medium">Physical cash currently available in drawer</span>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase tracking-wider font-heading">
            <span>Total Cash In Today (+)</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-3 block tracking-tight font-heading">
            ₹{cashInTotal.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block font-medium">Customer payments & morning cash float</span>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-bold uppercase tracking-wider font-heading">
            <span>Total Cash Out Today (-)</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-700 mt-3 block tracking-tight font-heading">
            ₹{cashOutTotal.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-zinc-500 mt-1 block font-medium">Loans given & verified shop expenses</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-zinc-200/80 rounded-[28px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] overflow-hidden w-full max-w-full min-w-0">
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <h3 className="font-bold text-zinc-950 text-sm font-heading">Today's Cash Ledger Entries</h3>
          <span className="text-xs text-zinc-500 font-semibold">{dayBook.length} Transactions Recorded</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] text-xs text-left">
            <thead className="bg-zinc-50 text-zinc-600 font-bold text-[11px] border-b border-zinc-200 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4 text-right">Cash In (+)</th>
                <th className="py-3.5 px-4 text-right">Cash Out (-)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {dayBook.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-zinc-400 font-medium">
                    No cash book transactions recorded yet today.
                  </td>
                </tr>
              ) : (
                dayBook.map((entry) => (
                  <tr key={entry.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 px-4 font-mono font-medium text-zinc-600">{entry.time}</td>
                    
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold border ${
                          entry.type === 'LOAN_GIVEN'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : entry.type === 'PAYMENT_RECEIVED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : entry.type === 'CASH_ADDED'
                            ? 'bg-zinc-100 text-zinc-800 border-zinc-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {entry.type === 'LOAN_GIVEN' && 'Loan Disbursed'}
                        {entry.type === 'PAYMENT_RECEIVED' && 'Payment Collected'}
                        {entry.type === 'CASH_ADDED' && 'Cash Added'}
                        {entry.type === 'EXPENSE' && 'Shop Expense'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold text-zinc-950 block font-heading">{entry.description}</span>
                      {entry.customerName && (
                        <span className="text-[11px] text-zinc-500 font-medium">
                          Customer: {entry.customerName} {entry.loanId ? `(${entry.loanId})` : ''}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 text-[10px] font-semibold">
                        {entry.paymentMethod}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      {entry.direction === 'IN' ? (
                        <span className="font-extrabold text-emerald-700 text-sm font-heading">
                          +₹{entry.amount.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      {entry.direction === 'OUT' ? (
                        <span className="font-extrabold text-rose-700 text-sm font-heading">
                          -₹{entry.amount.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Cash / Expense Modal (Finvo Modern Modal) */}
      {isAddCashModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200 text-zinc-900 rounded-[28px] w-full max-w-md overflow-hidden shadow-2xl">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <h3 className="font-bold text-base text-zinc-950 font-heading">
                {entryType === 'CASH_ADDED' ? 'Add Cash to Counter Drawer' : 'Record Shop Expense'}
              </h3>
              <button
                onClick={() => setIsAddCashModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-800 p-1.5 rounded-full hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="p-6 space-y-4 text-xs">
              
              {/* Type Switcher */}
              <div>
                <label className="block text-zinc-700 font-semibold mb-1.5">Entry Type</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-full border border-zinc-200/70">
                  <button
                    type="button"
                    onClick={() => setEntryType('CASH_ADDED')}
                    className={`py-2 rounded-full font-bold transition-all cursor-pointer ${
                      entryType === 'CASH_ADDED'
                        ? 'bg-zinc-950 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    + Cash In
                  </button>

                  <button
                    type="button"
                    onClick={() => setEntryType('EXPENSE')}
                    className={`py-2 rounded-full font-bold transition-all cursor-pointer ${
                      entryType === 'EXPENSE'
                        ? 'bg-zinc-950 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    - Expense
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Amount (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full pl-9 pr-4 py-2 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-950/5 rounded-full text-sm text-zinc-900 font-bold outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Description / Reason *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={entryType === 'CASH_ADDED' ? 'e.g. Morning counter cash float' : 'e.g. Tea & snacks / Stationeries'}
                  className="w-full px-4 py-2 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-950/5 rounded-full text-sm text-zinc-900 outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddCashModalOpen(false)}
                  className="px-5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold rounded-full text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold rounded-full text-xs transition-colors cursor-pointer shadow-xs ${
                    entryType === 'CASH_ADDED' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Save Entry
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
