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
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span>Daily Cash Book</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Daily cash in drawer tracking, cash collection, and cash loan disbursements
          </p>
        </div>

        <button
          onClick={() => {
            setEntryType('CASH_ADDED');
            setIsAddCashModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Cash / Expense</span>
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Cash in Drawer Right Now</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-emerald-400 mt-2 block tracking-tight">
            ₹{netCashInHand.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">Current counter physical cash balance</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Total Cash In Today (+)</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white mt-2 block tracking-tight">
            ₹{cashInTotal.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">Payments & morning cash added</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Total Cash Out Today (-)</span>
            <ArrowUpRight className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-rose-400 mt-2 block tracking-tight">
            ₹{cashOutTotal.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">Loans given & shop expenses</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Today's Cash Ledger Entries</h3>
          <span className="text-xs text-slate-400">Total {dayBook.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">Time</th>
                <th className="p-4">Type</th>
                <th className="p-4">Description</th>
                <th className="p-4">Mode</th>
                <th className="p-4 text-right">Cash In (+)</th>
                <th className="p-4 text-right">Cash Out (-)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {dayBook.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-slate-400">{entry.time}</td>
                  
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        entry.type === 'LOAN_GIVEN'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : entry.type === 'PAYMENT_RECEIVED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : entry.type === 'CASH_ADDED'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {entry.type === 'LOAN_GIVEN' && 'Loan Given'}
                      {entry.type === 'PAYMENT_RECEIVED' && 'Payment Received'}
                      {entry.type === 'CASH_ADDED' && 'Cash Added'}
                      {entry.type === 'EXPENSE' && 'Expense'}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="font-medium text-white block">{entry.description}</span>
                    {entry.loanId && (
                      <span className="text-[10px] font-mono text-amber-400">Ref: {entry.loanId}</span>
                    )}
                  </td>

                  <td className="p-4 text-slate-400">{entry.paymentMethod}</td>

                  <td className="p-4 text-right">
                    {entry.direction === 'IN' ? (
                      <span className="font-bold text-emerald-400 text-sm">
                        +₹{entry.amount.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    {entry.direction === 'OUT' ? (
                      <span className="font-bold text-rose-400 text-sm">
                        -₹{entry.amount.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Cash / Expense Modal */}
      {isAddCashModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base">Record Cash Movement</h3>
              <button
                onClick={() => setIsAddCashModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Entry Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEntryType('CASH_ADDED')}
                    className={`py-2 rounded-lg font-bold border transition-colors ${
                      entryType === 'CASH_ADDED'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    + Cash Added (In)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntryType('EXPENSE')}
                    className={`py-2 rounded-lg font-bold border transition-colors ${
                      entryType === 'EXPENSE'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    - Expense (Out)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Description / Note *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={entryType === 'CASH_ADDED' ? 'e.g. Added cash from bank' : 'e.g. Tea & stationery expense'}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCashModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
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
