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
  AlertCircle, 
  Scale, 
  User, 
  Phone,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';

export const NewLoanModal: React.FC = () => {
  const { 
    isNewLoanModalOpen, 
    setIsNewLoanModalOpen, 
    settings, 
    giveNewLoan,
    createLoanApplication,
    setSelectedLoanForPrint,
    setActivePrintModal,
    customers,
    currentStaff,
    currentRole,
    staffUsers,
    loans
  } = useFinance();

  const [modalMode, setModalMode] = useState<'APPLICATION' | 'DIRECT'>('APPLICATION');

  // Customer KYC Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerIdProof, setCustomerIdProof] = useState('');
  const [appraiserStaffName, setAppraiserStaffName] = useState('Rameshwar Patil (Appraiser)');
  const [declaredDescription, setDeclaredDescription] = useState('2 Gold Bangles and 1 Gold Chain');
  
  // Ornaments items (for direct mode or declared valuation)
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
  const [safePacketNumber, setSafePacketNumber] = useState<string>(`Safe-A / Packet #${101 + loans.length}`);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');

  // Submission feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successAppId, setSuccessAppId] = useState<string | null>(null);

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

  const totalNetWeight = calculatedItems.reduce((acc, it) => acc + it.netWeight, 0);
  const totalGoldMarketValue = calculatedItems.reduce((acc, it) => acc + it.estimatedValue, 0);
  const maxSafeLoan = Math.round((totalGoldMarketValue * settings.maxLoanPercent) / 100);

  const numLoanAmount = parseFloat(loanAmount) || 0;
  const numRate = parseFloat(monthlyInterestRate) || settings.defaultMonthlyInterest;
  const monthlyInterestRupees = Math.round((numLoanAmount * numRate) / 100);

  const isLoanOverLimit = numLoanAmount > maxSafeLoan && maxSafeLoan > 0;

  // Handle Standard Application Workflow (Step 1)
  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = createLoanApplication({
      customerName,
      customerPhone,
      customerAddress,
      customerIdProof,
      requestedAmount: numLoanAmount,
      declaredItemsDescription: declaredDescription || goldItems.map(g => `${g.name} (${g.grossWeight}g)`).join(', '),
    });

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to register loan application.');
      return;
    }

    setSuccessAppId(result.application?.id || 'APP-CREATED');
  };

  // Handle Direct Fast-track Sanction
  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Please enter customer name');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage('Please enter customer phone number');
      return;
    }
    if (numLoanAmount <= 0) {
      setErrorMessage('Please enter a valid loan amount');
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
      safePacketNumber: safePacketNumber || `Safe-A / Packet #${100 + loans.length + 1}`,
      paymentMethod,
      notes,
      appraiserStaffName,
    });

    setIsNewLoanModalOpen(false);
    setSelectedLoanForPrint(createdLoan);
    setActivePrintModal('LOAN_SLIP');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-zinc-200/80 text-zinc-900 rounded-3xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100/80 text-amber-800 border border-amber-200/60 flex items-center justify-center">
              <Coins className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-zinc-900">
                {modalMode === 'APPLICATION' ? 'Step 1: New Gold Loan Application' : 'Direct Counter Loan Sanction'}
              </h2>
              <p className="text-xs text-zinc-500">
                {modalMode === 'APPLICATION'
                  ? 'Register customer, verify KYC, record loan request, and assign to Appraiser queue'
                  : 'Fast-track counter sanction for manager dual-sign authorization'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsNewLoanModalOpen(false);
              setSuccessAppId(null);
              setErrorMessage(null);
            }}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Mode Selector Tab */}
        <div className="flex items-center border-b border-zinc-200 px-6 pt-3 gap-2 bg-zinc-50/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setModalMode('APPLICATION'); setSuccessAppId(null); setErrorMessage(null); }}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              modalMode === 'APPLICATION'
                ? 'border-zinc-950 text-zinc-950 font-black'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Standard 5-Stage Loan Application (Recommended)</span>
          </button>

          <button
            type="button"
            onClick={() => { setModalMode('DIRECT'); setSuccessAppId(null); setErrorMessage(null); }}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              modalMode === 'DIRECT'
                ? 'border-zinc-950 text-zinc-950 font-black'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Direct Counter Pawn (Admin Override)</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Screen after Application creation */}
        {successAppId ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-zinc-950">Loan Application Submitted!</h3>
            <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
              Application <strong className="font-mono text-zinc-950 text-sm">{successAppId}</strong> has been registered and forwarded to the <strong>Gold Appraiser & Assay Queue</strong>.
            </p>
            <div className="p-4 bg-zinc-50 rounded-2xl max-w-sm mx-auto text-xs text-zinc-500 text-left border border-zinc-200/80 space-y-1">
              <div className="flex justify-between">
                <span>Borrower:</span>
                <strong className="text-zinc-900">{customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Requested Amount:</span>
                <strong className="text-zinc-900">₹{numLoanAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span>Next Station:</span>
                <span className="text-amber-800 font-bold">Appraiser Queue (Step 2)</span>
              </div>
            </div>
            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsNewLoanModalOpen(false);
                  setSuccessAppId(null);
                }}
                className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-full shadow-xs cursor-pointer"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={modalMode === 'APPLICATION' ? handleApplicationSubmit : handleDirectSubmit} className="overflow-y-auto p-6 space-y-5 flex-1 text-xs">
            
            {/* Section 1: Customer Details */}
            <div className="bg-zinc-50/70 rounded-2xl p-4.5 border border-zinc-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>Borrower Information & KYC</span>
                </h3>
                <span className="text-[10px] text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded-full font-bold">
                  {customers.some(c => c.phone.replace(/\D/g, '') === customerPhone.replace(/\D/g, '')) ? 'Existing Customer Found' : 'New Customer Registration'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar Sharma"
                    className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-2xl text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-900/10 outline-none font-bold transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="e.g. 98765 43210"
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-2xl text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-900/10 outline-none font-bold transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5">
                    Residential Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="e.g. Dadar West, Mumbai 400028"
                    className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-2xl text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5">
                    ID Proof (Aadhaar / Voter ID / PAN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerIdProof}
                    onChange={(e) => setCustomerIdProof(e.target.value)}
                    placeholder="e.g. Aadhaar: 4892-XXXX-1024"
                    className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-2xl text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Loan Requirements */}
            <div className="bg-zinc-50/70 rounded-2xl p-4.5 border border-zinc-200/80 space-y-3">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>Requested Loan Terms & Assignment</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5">
                    Requested Loan Amount (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      required
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 bg-white border border-zinc-200 rounded-2xl text-xs text-zinc-900 font-extrabold focus:border-zinc-950 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all"
                    />
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-1 block">Subject to 75% LTV test in Step 2 appraisal.</span>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5">
                    Declared Ornaments Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={declaredDescription}
                    onChange={(e) => setDeclaredDescription(e.target.value)}
                    placeholder="e.g. 2 Gold Bangles and 1 Gold Chain"
                    className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-2xl text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-950 outline-none transition-all"
                  />
                  <span className="text-[11px] text-zinc-400 mt-1 block">Physical assay will verify exact weights & purity.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-200/60">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5">
                    Assigned Lending Branch
                  </label>
                  <div className="px-3.5 py-2.5 bg-white border border-zinc-200 rounded-2xl text-xs text-zinc-900 font-bold flex items-center justify-between">
                    <span>Mumbai Fort Flagship (#101)</span>
                    <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                      BR-MUM-01
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1.5">
                    Assigned Appraiser Station
                  </label>
                  <div className="px-3.5 py-2.5 bg-white border border-zinc-200 rounded-2xl text-xs text-zinc-900 font-bold flex items-center justify-between">
                    <span>Rameshwar Patil (Appraiser)</span>
                    <span className="text-[10px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full font-bold">
                      Assay Desk #1
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Mode Extra Fields */}
            {modalMode === 'DIRECT' && (
              <div className="bg-zinc-50/70 rounded-2xl p-4.5 border border-zinc-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ornaments Assay & Gold Evaluation</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-900 hover:text-amber-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {goldItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded-2xl border border-zinc-200">
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(idx, 'name', e.target.value)}
                          placeholder="Ornament Name"
                          className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.1"
                          value={item.grossWeight}
                          onChange={(e) => updateItem(idx, 'grossWeight', e.target.value)}
                          placeholder="Gross"
                          className="w-full px-2 py-1.5 border border-zinc-200 rounded-xl text-xs font-bold text-right outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.1"
                          value={item.netWeight}
                          onChange={(e) => updateItem(idx, 'netWeight', e.target.value)}
                          placeholder="Net"
                          className="w-full px-2 py-1.5 border border-zinc-200 rounded-xl text-xs font-bold text-right outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <select
                          value={item.purity}
                          onChange={(e) => updateItem(idx, 'purity', e.target.value)}
                          className="w-full px-2 py-1.5 border border-zinc-200 rounded-xl text-xs font-bold outline-none"
                        >
                          <option value="22K">22K (916)</option>
                          <option value="24K">24K (Pure)</option>
                          <option value="18K">18K (750)</option>
                        </select>
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-zinc-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs font-bold text-amber-950">
                  <span>Net Weight: <strong>{totalNetWeight.toFixed(1)}g</strong></span>
                  <span>Gold Valuation: <strong>₹{totalGoldMarketValue.toLocaleString('en-IN')}</strong></span>
                  <span>Max 75% LTV: <strong>₹{maxSafeLoan.toLocaleString('en-IN')}</strong></span>
                </div>
              </div>
            )}

            {/* Submit Bar */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => {
                  setIsNewLoanModalOpen(false);
                  setErrorMessage(null);
                }}
                className="px-5 py-2.5 rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-100 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-full shadow-xs text-xs transition-all cursor-pointer"
              >
                {modalMode === 'APPLICATION' ? (
                  <>
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Create & Queue to Appraiser (Step 1)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Confirm & Sanction Direct Loan</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
