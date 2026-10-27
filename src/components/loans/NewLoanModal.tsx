import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { GoldItem, GoldPurity, PaymentMethod } from '../../types/finance';
import { 
  X, 
  Plus, 
  Trash2, 
  Coins, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const NewLoanModal: React.FC = () => {
  const { 
    isNewLoanModalOpen, 
    setIsNewLoanModalOpen, 
    settings, 
    giveNewLoan,
    setSelectedLoanForPrint,
    setActivePrintModal,
    customers,
    currentStaff,
    staffUsers,
  } = useFinance();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerIdProof, setCustomerIdProof] = useState('');
  const [appraiserStaffName, setAppraiserStaffName] = useState('Rameshwar Patil (Appraiser)');
  
  const [goldItems, setGoldItems] = useState<Array<{
    name: string;
    grossWeight: string;
    netWeight: string;
    purity: GoldPurity;
  }>>([
    { name: 'Gold Chain', grossWeight: '15.5', netWeight: '15.0', purity: '22K' },
  ]);

  const [loanAmount, setLoanAmount] = useState<string>('60000');
  const [monthlyInterestRate, setMonthlyInterestRate] = useState<string>(
    settings.defaultMonthlyInterest.toString()
  );
  const [safePacketNumber, setSafePacketNumber] = useState<string>('Safe-A / Packet #105');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');

  if (!isNewLoanModalOpen) return null;

  // Auto-fill if phone matches existing customer
  const handlePhoneChange = (phoneVal: string) => {
    setCustomerPhone(phoneVal);
    const clean = phoneVal.replace(/\D/g, '');
    if (clean.length >= 5) {
      const found = customers.find((c) => c.phone.replace(/\D/g, '').includes(clean));
      if (found) {
        if (!customerName) setCustomerName(found.name);
        if (!customerAddress) setCustomerAddress(found.address);
        if (!customerIdProof) setCustomerIdProof(found.idProof);
      }
    }
  };

  const addItem = () => {
    setGoldItems([
      ...goldItems,
      { name: 'Gold Ring', grossWeight: '5.0', netWeight: '5.0', purity: '22K' },
    ]);
  };

  const removeItem = (idx: number) => {
    if (goldItems.length > 1) {
      setGoldItems(goldItems.filter((_, i) => i !== idx));
    }
  };

  const updateItem = (idx: number, field: string, value: string) => {
    setGoldItems(
      goldItems.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  // Calculations
  const calculatedItems: GoldItem[] = goldItems.map((item, idx) => {
    const gross = parseFloat(item.grossWeight) || 0;
    const net = parseFloat(item.netWeight) || 0;
    const rate = item.purity === '24K' 
      ? settings.goldRate24K 
      : item.purity === '22K' 
      ? settings.goldRate22K 
      : settings.goldRate18K;
    const estVal = Math.round(net * rate);

    return {
      id: `ITEM-${idx + 1}`,
      name: item.name || 'Gold Ornament',
      grossWeight: gross,
      netWeight: net,
      purity: item.purity,
      estimatedValue: estVal,
    };
  });

  const totalGrossWeight = calculatedItems.reduce((acc, it) => acc + it.grossWeight, 0);
  const totalNetWeight = calculatedItems.reduce((acc, it) => acc + it.netWeight, 0);
  const totalGoldMarketValue = calculatedItems.reduce((acc, it) => acc + it.estimatedValue, 0);
  const maxSafeLoan = Math.round((totalGoldMarketValue * settings.maxLoanPercent) / 100);

  const numLoanAmount = parseFloat(loanAmount) || 0;
  const numRate = parseFloat(monthlyInterestRate) || settings.defaultMonthlyInterest;
  const monthlyInterestRupees = Math.round((numLoanAmount * numRate) / 100);

  const isLoanOverLimit = numLoanAmount > maxSafeLoan && maxSafeLoan > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Please enter customer phone number');
      return;
    }
    if (numLoanAmount <= 0) {
      alert('Please enter a valid loan amount');
      return;
    }

    const createdLoan = giveNewLoan({
      customerName,
      customerPhone,
      customerAddress,
      customerIdProof,
      goldItems: calculatedItems,
      loanAmount: numLoanAmount,
      monthlyInterestRate: numRate,
      safePacketNumber: safePacketNumber || `Safe-A / Packet #${Math.floor(100 + Math.random() * 900)}`,
      paymentMethod,
      notes,
      appraiserStaffName,
    });

    setIsNewLoanModalOpen(false);
    setSelectedLoanForPrint(createdLoan);
    setActivePrintModal('LOAN_SLIP');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Give New Gold Loan</h2>
              <p className="text-xs text-slate-400">Fill customer and gold details to issue loan slip</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewLoanModalOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* Section 1: Customer Details */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Step 1: Customer Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="e.g. 98765 43210"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Address / City (Optional)
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="e.g. Dadar West, Mumbai"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  ID Proof (Optional)
                </label>
                <input
                  type="text"
                  value={customerIdProof}
                  onChange={(e) => setCustomerIdProof(e.target.value)}
                  placeholder="e.g. Aadhaar 4892-XXXX-1024"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Gold Items */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Step 2: Gold Ornaments Kept
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Another Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {goldItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="grid grid-cols-12 gap-2 sm:gap-3 items-center bg-slate-900/80 p-3 rounded-lg border border-slate-700/60"
                >
                  <div className="col-span-12 sm:col-span-4">
                    <label className="block text-[10px] text-slate-400 mb-1">Ornament Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(idx, 'name', e.target.value)}
                      placeholder="e.g. Gold Chain"
                      className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-xs text-white"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <label className="block text-[10px] text-slate-400 mb-1">Purity</label>
                    <select
                      value={item.purity}
                      onChange={(e) => updateItem(idx, 'purity', e.target.value as GoldPurity)}
                      className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-xs text-white"
                    >
                      <option value="22K">22K (916)</option>
                      <option value="24K">24K (Pure)</option>
                      <option value="18K">18K</option>
                    </select>
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <label className="block text-[10px] text-slate-400 mb-1">Gross (g)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.grossWeight}
                      onChange={(e) => updateItem(idx, 'grossWeight', e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-xs text-white"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-3">
                    <label className="block text-[10px] text-slate-400 mb-1">Net Gold (g)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.netWeight}
                      onChange={(e) => updateItem(idx, 'netWeight', e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-xs text-white"
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-1 flex justify-end">
                    {goldItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Gold Value Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block">Total Net Gold:</span>
                <span className="text-sm font-bold text-amber-300">{totalNetWeight.toFixed(2)} grams</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Gold Value:</span>
                <span className="text-sm font-bold text-white">₹{totalGoldMarketValue.toLocaleString('en-IN')}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Max Safe Loan ({settings.maxLoanPercent}%):</span>
                <span className="text-sm font-bold text-emerald-400">
                  ₹{maxSafeLoan.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 block">Recommended max loan you can safely give</span>
              </div>
            </div>
          </div>

          {/* Section 3: Loan Amount & Safe Box */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Step 3: Loan Money & Interest
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Loan Amount Given (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                {isLoanOverLimit && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Loan is higher than 75% max gold value
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Monthly Interest Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={monthlyInterestRate}
                    onChange={(e) => setMonthlyInterestRate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">% / month</span>
                </div>
                <p className="text-[11px] text-amber-300 font-medium mt-1">
                  = ₹{monthlyInterestRupees.toLocaleString('en-IN')} every month
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Safe Locker / Packet #
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={safePacketNumber}
                    onChange={(e) => setSafePacketNumber(e.target.value)}
                    placeholder="Safe-A / Packet #105"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Payment Given via
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white"
                >
                  <option value="Cash">Cash (Handed over)</option>
                  <option value="UPI / GPay">UPI / GPay / PhonePe</option>
                  <option value="Bank Transfer">Bank Transfer / NEFT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Regular customer, promised to return next month"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-700/60">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Loan Issued By (Current Staff)
                </label>
                <div className="px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-amber-300 font-semibold flex items-center justify-between">
                  <span>{currentStaff.name}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                    {currentStaff.role.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Gold Tested & Appraised By
                </label>
                <select
                  value={appraiserStaffName}
                  onChange={(e) => setAppraiserStaffName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                >
                  {staffUsers.map((s) => (
                    <option key={s.id} value={`${s.name} (${s.role.replace('_', ' ')})`}>
                      {s.name} ({s.role.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsNewLoanModalOpen(false)}
              className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg shadow-lg shadow-amber-900/30 text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Give Loan</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
