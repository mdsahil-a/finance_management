import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { LoanScheme, GoldPurity, RepaymentMethod } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import { 
  Coins, 
  Plus, 
  Edit3, 
  ToggleLeft, 
  ToggleRight, 
  ShieldCheck, 
  Percent, 
  Calendar, 
  X, 
  CheckCircle2,
  Layers,
  Sparkles
} from 'lucide-react';

export const AdminSchemesPage: React.FC = () => {
  const { schemes, createScheme, updateScheme, toggleSchemeActive } = useDemoData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<LoanScheme | null>(null);

  // Form state
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [minAmount, setMinAmount] = useState(25000);
  const [maxAmount, setMaxAmount] = useState(1500000);
  const [minTenure, setMinTenure] = useState(3);
  const [maxTenure, setMaxTenure] = useState(24);
  const [interestMethod, setInterestMethod] = useState<RepaymentMethod>('Simple Interest');
  const [rate, setRate] = useState(9.9);
  const [frequency, setFrequency] = useState<'Monthly' | 'Quarterly' | 'At Maturity'>('Monthly');
  const [feePercent, setFeePercent] = useState(0.25);
  const [valuationCharge, setValuationCharge] = useState(0);
  const [minPurity, setMinPurity] = useState<GoldPurity>('18K');
  const [ltvPercent, setLtvPercent] = useState(75);
  const [penaltyPercent, setPenaltyPercent] = useState(2.0);

  const openCreateModal = () => {
    setEditingScheme(null);
    setCode(`AGF-SCH-${Date.now().toString().slice(-3)}`);
    setName('');
    setDescription('');
    setMinAmount(25000);
    setMaxAmount(2000000);
    setMinTenure(3);
    setMaxTenure(18);
    setInterestMethod('Simple Interest');
    setRate(9.8);
    setFrequency('Monthly');
    setFeePercent(0.25);
    setValuationCharge(0);
    setMinPurity('18K');
    setLtvPercent(75);
    setPenaltyPercent(2.0);
    setModalOpen(true);
  };

  const openEditModal = (s: LoanScheme) => {
    setEditingScheme(s);
    setCode(s.code);
    setName(s.name);
    setDescription(s.description);
    setMinAmount(s.minAmount);
    setMaxAmount(s.maxAmount);
    setMinTenure(s.minTenureMonths);
    setMaxTenure(s.maxTenureMonths);
    setInterestMethod(s.interestMethod);
    setRate(s.nominalInterestRate);
    setFrequency(s.interestPaymentFrequency);
    setFeePercent(s.processingFeePercent);
    setValuationCharge(s.valuationCharge);
    setMinPurity(s.minEligiblePurity);
    setLtvPercent(s.ltvLimitPercent);
    setPenaltyPercent(s.latePaymentPenaltyPercent);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      alert('Scheme name and unique code are required.');
      return;
    }

    if (editingScheme) {
      updateScheme(editingScheme.id, {
        code,
        name,
        description,
        minAmount: Number(minAmount),
        maxAmount: Number(maxAmount),
        minTenureMonths: Number(minTenure),
        maxTenureMonths: Number(maxTenure),
        interestMethod,
        nominalInterestRate: Number(rate),
        interestPaymentFrequency: frequency,
        processingFeePercent: Number(feePercent),
        valuationCharge: Number(valuationCharge),
        minEligiblePurity: minPurity,
        ltvLimitPercent: Number(ltvPercent),
        latePaymentPenaltyPercent: Number(penaltyPercent),
      });
    } else {
      createScheme({
        code,
        name,
        description,
        minAmount: Number(minAmount),
        maxAmount: Number(maxAmount),
        minTenureMonths: Number(minTenure),
        maxTenureMonths: Number(maxTenure),
        interestMethod,
        nominalInterestRate: Number(rate),
        interestPaymentFrequency: frequency,
        processingFeePercent: Number(feePercent),
        valuationCharge: Number(valuationCharge),
        minEligiblePurity: minPurity,
        ltvLimitPercent: Number(ltvPercent),
        minInterestPeriodDays: 7,
        latePaymentPenaltyPercent: Number(penaltyPercent),
        foreclosureChargesPercent: 0,
        renewalAllowed: true,
        isActive: true,
        effectiveDate: new Date().toISOString().split('T')[0],
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#C9A45C]" />
            <h1 className="text-2xl font-black text-[#701525] font-display">
              Loan Products & Scheme Management
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Configure enterprise gold loan schemes, interest calculation rules, LTV limits, and fee structures.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 text-[#FFE59E]" />
          <span>Add New Loan Scheme</span>
        </button>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
              scheme.isActive ? 'border-[#E8E2D8]' : 'border-gray-200 opacity-60 bg-gray-50/50'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    {scheme.code}
                  </span>
                  <h3 className="text-base font-bold text-[#701525]">{scheme.name}</h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    scheme.isActive
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-gray-100 text-gray-600 border-gray-300'
                  }`}
                >
                  {scheme.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-xs text-gray-600 line-clamp-2">{scheme.description}</p>

              <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E2D8] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 block">Interest Rate</span>
                  <span className="font-black text-[#701525] text-sm">
                    {scheme.nominalInterestRate}% p.a.
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">LTV Limit</span>
                  <span className="font-black text-gray-900 text-sm">
                    {scheme.ltvLimitPercent}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Method</span>
                  <span className="font-semibold text-gray-800 text-[11px] truncate block">
                    {scheme.interestMethod}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Servicing</span>
                  <span className="font-semibold text-gray-800 text-[11px] truncate block">
                    {scheme.interestPaymentFrequency}
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">Loan Range:</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(scheme.minAmount)} – {formatCurrency(scheme.maxAmount)}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">Tenure:</span>
                  <span className="font-semibold text-gray-800">
                    {scheme.minTenureMonths} to {scheme.maxTenureMonths} Months
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2 mt-4 text-xs">
              <button
                onClick={() => toggleSchemeActive(scheme.id)}
                className="inline-flex items-center gap-1.5 font-bold text-gray-600 hover:text-gray-900 transition-colors"
              >
                {scheme.isActive ? (
                  <>
                    <ToggleRight className="w-5 h-5 text-emerald-600" />
                    <span>Deactivate</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-5 h-5 text-gray-400" />
                    <span>Activate</span>
                  </>
                )}
              </button>

              <button
                onClick={() => openEditModal(scheme)}
                className="inline-flex items-center gap-1 font-bold text-[#701525] hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Parameters</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8E2D8] max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-[#C9A45C]" />
                <h3 className="text-lg font-bold text-[#701525]">
                  {editingScheme ? 'Edit Loan Scheme' : 'Create New Loan Scheme'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Scheme Code (Unique)</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-mono"
                    placeholder="e.g. AGF-SOVEREIGN"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Scheme Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                    placeholder="e.g. Aurum Sovereign Sovereign Facility"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Product Description & Eligibility</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  placeholder="Explain borrower eligibility and interest features..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Annual Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">LTV Ratio (%)</label>
                  <input
                    type="number"
                    value={ltvPercent}
                    onChange={(e) => setLtvPercent(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                    max={85}
                    min={50}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Min Purity</label>
                  <select
                    value={minPurity}
                    onChange={(e) => setMinPurity(e.target.value as GoldPurity)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="18K">18K (75%)</option>
                    <option value="20K">20K (83.3%)</option>
                    <option value="22K">22K (91.6%)</option>
                    <option value="24K">24K (99.9%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Interest Method</label>
                  <select
                    value={interestMethod}
                    onChange={(e) => setInterestMethod(e.target.value as RepaymentMethod)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="Simple Interest">Simple Interest</option>
                    <option value="Reducing Balance EMI">Reducing Balance EMI</option>
                    <option value="Bullet Repayment">Bullet Repayment (Maturity)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Interest Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="At Maturity">At Maturity</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Min Amount (₹)</label>
                  <input
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Max Amount (₹)</label>
                  <input
                    type="number"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Min Tenure (M)</label>
                  <input
                    type="number"
                    value={minTenure}
                    onChange={(e) => setMinTenure(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Max Tenure (M)</label>
                  <input
                    type="number"
                    value={maxTenure}
                    onChange={(e) => setMaxTenure(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Processing Fee (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={feePercent}
                    onChange={(e) => setFeePercent(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Valuation Fee (₹)</label>
                  <input
                    type="number"
                    value={valuationCharge}
                    onChange={(e) => setValuationCharge(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Late Penalty (% p.a.)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={penaltyPercent}
                    onChange={(e) => setPenaltyPercent(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-[#701525] text-white hover:bg-[#58101d] shadow-sm"
                >
                  {editingScheme ? 'Update Scheme' : 'Save Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
