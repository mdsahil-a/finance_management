import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import { Users, Search, Phone, MessageCircle, PlusCircle, FileText, MapPin } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const { customers, setSearchQuery, setIsNewLoanModalOpen } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.address.toLowerCase().includes(q);
  });

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const text = encodeURIComponent(`Hello ${name} ji, greeting from Sri Balaji Gold Finance.`);
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <span>Customers Book</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Customer contact directory, loan track record, and quick communication
          </p>
        </div>

        <button
          onClick={() => setIsNewLoanModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Give Loan</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer by name, mobile, address..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Total <strong>{filteredCustomers.length}</strong> Customers
        </span>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{cust.name}</h3>
                  <p className="text-xs text-amber-400 font-medium flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{cust.phone}</span>
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {cust.activeLoansCount} Active Loan(s)
                </span>
              </div>

              {cust.address && (
                <p className="text-xs text-slate-400 mt-2 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span className="truncate">{cust.address}</span>
                </p>
              )}

              {cust.idProof && (
                <p className="text-[11px] text-slate-500 mt-1">
                  ID: {cust.idProof}
                </p>
              )}

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-2 mt-4 p-2.5 bg-slate-800/60 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Total Borrowed:</span>
                  <span className="font-bold text-white">₹{cust.totalBorrowed.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Total Repaid:</span>
                  <span className="font-bold text-emerald-400">₹{cust.totalRepaid.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => openWhatsApp(cust.phone, cust.name)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  setSearchQuery(cust.name);
                  navigate('/loans');
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Loans</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
