import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import { Customer, Loan } from '../../types/finance';
import { maskIdProof } from '../../utils/formatters';
import { 
  Users, 
  Search, 
  Phone, 
  MessageCircle, 
  PlusCircle, 
  FileText, 
  MapPin, 
  Eye, 
  LayoutGrid, 
  List, 
  X, 
  Wallet,
  ShieldCheck,
  User,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    customers, 
    loans, 
    settings, 
    setSearchQuery, 
    setIsNewLoanModalOpen, 
    setSelectedLoanForPayment,
    setIsPaymentModalOpen 
  } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.address.toLowerCase().includes(q);
  });

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const shop = settings.shopName || 'Aurum Gold Finance';
    const text = encodeURIComponent(`Hello ${name} ji, greetings from ${shop}.`);
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
  };

  // Get loans for selected customer
  const customerLoans = selectedCustomer
    ? loans.filter((l) => l.customerPhone.replace(/\D/g, '') === selectedCustomer.phone.replace(/\D/g, '') || l.customerName.toLowerCase() === selectedCustomer.name.toLowerCase())
    : [];

  return (
    <div className="space-y-6">
      
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight flex items-center gap-2.5 font-heading">
            <Users className="w-7 h-7 text-zinc-900" />
            <span>Customers Directory</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-0.5">
            Customer KYC records, borrowing history, active collateral, and quick communication.
          </p>
        </div>

        <button
          onClick={() => setIsNewLoanModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm rounded-full shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto cursor-pointer"
        >
          <span>+ Give Loan</span>
          <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <ArrowUpRight className="w-3 h-3 text-white" />
          </div>
        </button>
      </div>

      {/* Search Bar & View Toggle (Finvo Pill Style) */}
      <div className="bg-white border border-zinc-200/80 p-3 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer by name, mobile, address..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 hover:bg-zinc-100 focus:bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-950/5 rounded-full text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 hidden sm:inline font-semibold">
            Total <strong>{filteredCustomers.length}</strong> Registered Customers
          </span>

          <div className="flex items-center bg-zinc-100 p-1 rounded-full border border-zinc-200/70">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Render View: Grid or Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-4 transition-all hover:translate-y-[-2px]"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center font-bold text-zinc-900 font-heading shrink-0">
                      {cust.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-extrabold text-zinc-950 tracking-tight truncate font-heading">{cust.name}</h3>
                      <p className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{cust.phone}</span>
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                    cust.activeLoansCount > 0 
                      ? 'bg-amber-50 text-amber-800 border-amber-200' 
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                  }`}>
                    {cust.activeLoansCount} Active
                  </span>
                </div>

                {cust.address && (
                  <p className="text-xs text-zinc-500 mt-3 flex items-start gap-1.5 line-clamp-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span>{cust.address}</span>
                  </p>
                )}

                <p className="text-[11px] text-zinc-400 mt-1 font-medium">
                  {maskIdProof(cust.idProof)}
                </p>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-zinc-50 rounded-2xl border border-zinc-100 text-xs">
                  <div>
                    <span className="text-zinc-500 text-[10px] block font-semibold uppercase">Borrowed:</span>
                    <span className="font-extrabold text-zinc-950 text-sm font-heading">₹{cust.totalBorrowed.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] block font-semibold uppercase">Repaid:</span>
                    <span className="font-extrabold text-emerald-700 text-sm font-heading">₹{cust.totalRepaid.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Quick Action Pills */}
              <div className="flex items-center gap-2 pt-3 border-t border-zinc-100">
                <button
                  onClick={() => openWhatsApp(cust.phone, cust.name)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => setSelectedCustomer(cust)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Profile & Loans</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-zinc-200/80 rounded-[28px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] overflow-hidden w-full max-w-full min-w-0">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[700px] text-xs text-left">
              <thead className="bg-zinc-50 text-zinc-600 font-bold text-[11px] border-b border-zinc-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4">Identification</th>
                  <th className="py-3.5 px-4 text-center">Active Loans</th>
                  <th className="py-3.5 px-4 text-right">Total Borrowed</th>
                  <th className="py-3.5 px-4 text-right">Total Repaid</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-zinc-950 text-sm font-heading">{cust.name}</td>
                    <td className="py-4 px-4 font-semibold text-zinc-700">{cust.phone}</td>
                    <td className="py-4 px-4 text-zinc-500 max-w-[200px] truncate">{cust.address || '—'}</td>
                    <td className="py-4 px-4 text-zinc-500 font-medium">{maskIdProof(cust.idProof)}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                        cust.activeLoansCount > 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                      }`}>
                        {cust.activeLoansCount} Active
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-extrabold text-zinc-950">
                      ₹{cust.totalBorrowed.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-right font-extrabold text-emerald-700">
                      ₹{cust.totalRepaid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openWhatsApp(cust.phone, cust.name)}
                          className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full transition-colors cursor-pointer"
                          title="WhatsApp Message"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Full Detail & Loan History Modal (Finvo Modern Modal) */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-zinc-200 text-zinc-900 rounded-[28px] w-full max-w-2xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-zinc-950 font-heading">
                  Customer Profile & Loans: {selectedCustomer.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-zinc-400 hover:text-zinc-800 p-1.5 rounded-full hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* Profile Card */}
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-zinc-500 text-[10px] block font-semibold uppercase">Customer Name:</span>
                  <span className="font-extrabold text-zinc-950 text-base font-heading">{selectedCustomer.name}</span>
                  <span className="text-zinc-600 flex items-center gap-1 mt-1 font-medium">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    {selectedCustomer.phone}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block font-semibold uppercase">Identification:</span>
                  <span className="font-bold text-zinc-900 block">{selectedCustomer.idProof}</span>
                  <span className="text-zinc-500 block mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span>{selectedCustomer.address || 'Address not registered'}</span>
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                  <span className="text-zinc-500 text-[10px] block font-semibold uppercase">Active Loans:</span>
                  <span className="font-extrabold text-zinc-950 text-base font-heading">{selectedCustomer.activeLoansCount}</span>
                </div>
                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                  <span className="text-zinc-500 text-[10px] block font-semibold uppercase">Total Borrowed:</span>
                  <span className="font-extrabold text-zinc-950 text-base font-heading">₹{selectedCustomer.totalBorrowed.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                  <span className="text-zinc-500 text-[10px] block font-semibold uppercase">Total Repaid:</span>
                  <span className="font-extrabold text-emerald-700 text-base font-heading">₹{selectedCustomer.totalRepaid.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Loan History of this customer */}
              <div>
                <h4 className="font-bold text-zinc-900 text-xs mb-2 uppercase tracking-wider font-heading">
                  Loans Linked to this Profile ({customerLoans.length}):
                </h4>
                {customerLoans.length === 0 ? (
                  <p className="p-6 bg-zinc-50 rounded-2xl text-zinc-400 text-center border border-zinc-200">
                    No active loan records currently associated with this profile.
                  </p>
                ) : (
                  <div className="border border-zinc-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-zinc-50 text-zinc-600 font-bold border-b border-zinc-200">
                        <tr>
                          <th className="p-3 text-left">Loan #</th>
                          <th className="p-3 text-left">Date</th>
                          <th className="p-3 text-right">Principal</th>
                          <th className="p-3 text-right">Remaining</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 text-zinc-700">
                        {customerLoans.map((l) => (
                          <tr key={l.id} className="hover:bg-zinc-50/80">
                            <td className="p-3 font-mono font-bold text-zinc-900">{l.id}</td>
                            <td className="p-3 text-zinc-500">{l.loanDate}</td>
                            <td className="p-3 text-right font-semibold text-zinc-700">₹{l.loanAmount.toLocaleString('en-IN')}</td>
                            <td className="p-3 text-right font-extrabold text-zinc-950">₹{l.remainingPrincipal.toLocaleString('en-IN')}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                l.status === 'Fully Paid' ? 'bg-zinc-100 text-zinc-600 border-zinc-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}>
                                {l.status}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              {l.status !== 'Fully Paid' && (
                                <button
                                  onClick={() => {
                                    setSelectedCustomer(null);
                                    setSelectedLoanForPayment(l);
                                    setIsPaymentModalOpen(true);
                                  }}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  Collect
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-white hover:bg-zinc-100 text-zinc-700 font-semibold rounded-full border border-zinc-300 text-xs transition-colors cursor-pointer shadow-xs"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openWhatsApp(selectedCustomer.phone, selectedCustomer.name)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-full text-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    setSearchQuery(selectedCustomer.name);
                    setSelectedCustomer(null);
                    navigate('/loans');
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-full text-xs transition-colors cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>Go to Loans Ledger</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
