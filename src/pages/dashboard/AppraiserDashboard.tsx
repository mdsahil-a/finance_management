import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PlusCircle,
  Calculator,
  ArrowRight,
  Gem,
  Award,
  Layers,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { GoldPurity, LoanApplication } from '../../types/finance';

export const AppraiserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    appraisals,
    addAppraisal,
    applications,
    submitAppraisal,
    settings,
    customers,
    currentStaff,
  } = useFinance();

  // Applications awaiting appraisal in Appraiser queue
  const pendingApplications = applications.filter(
    (a) => a.status === 'AWAITING_APPRAISAL' || a.status === 'RETURNED_FOR_CORRECTION'
  );

  // Modal / Active appraisal state for an application
  const [activeAppToAppraise, setActiveAppToAppraise] = useState<LoanApplication | null>(null);

  // Ornament items for the active application
  const [assayItems, setAssayItems] = useState<Array<{
    name: string;
    grossWeight: number;
    stoneWeight: number;
    purity: GoldPurity;
  }>>([
    { name: '2 Gold Bangles', grossWeight: 24.5, stoneWeight: 1.0, purity: '22K' },
  ]);
  const [assayRemarks, setAssayRemarks] = useState('Electronic karatmeter tested positive for 916 hallmarked gold.');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Metric counts
  const pendingQueue = appraisals.filter((a) => a.status === 'PENDING_SANCTION');
  const totalAssessedGrams = appraisals.reduce((sum, a) => sum + a.totalNetWeight, 0);

  // Quick Standalone Assay Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [standaloneItemName, setStandaloneItemName] = useState('');
  const [standalonePurity, setStandalonePurity] = useState<GoldPurity>('22K');
  const [standaloneGross, setStandaloneGross] = useState<number>(15.0);
  const [standaloneStone, setStandaloneStone] = useState<number>(0.8);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  // Open appraisal for an assigned application
  const handleOpenAppraisalModal = (app: LoanApplication) => {
    setActiveAppToAppraise(app);
    setActionError(null);
    setActionSuccess(null);
    setAssayItems([
      { name: app.declaredItemsDescription || 'Pledged Gold Ornaments', grossWeight: 20.0, stoneWeight: 0.5, purity: '22K' }
    ]);
  };

  const addAssayItem = () => {
    setAssayItems([...assayItems, { name: 'Gold Ring / Ornament', grossWeight: 5.0, stoneWeight: 0.0, purity: '22K' }]);
  };

  const removeAssayItem = (idx: number) => {
    if (assayItems.length > 1) {
      setAssayItems(assayItems.filter((_, i) => i !== idx));
    }
  };

  const updateAssayItem = (idx: number, field: string, val: any) => {
    setAssayItems(assayItems.map((item, i) => (i === idx ? { ...item, [field]: val } : item)));
  };

  // Compute live valuation for modal items
  const calculatedModalItems = assayItems.map((item) => {
    const net = Math.max(0, Number((item.grossWeight - item.stoneWeight).toFixed(3)));
    const rate = item.purity === '24K' 
      ? settings.goldRate24K 
      : item.purity === '22K' 
      ? settings.goldRate22K 
      : Math.round((settings.goldRate24K * 18) / 24);
    const valuation = Math.round(net * rate);
    return {
      ...item,
      netWeight: net,
      ratePerGram: rate,
      valuation,
    };
  });

  const modalTotalGross = calculatedModalItems.reduce((sum, it) => sum + it.grossWeight, 0);
  const modalTotalNet = calculatedModalItems.reduce((sum, it) => sum + it.netWeight, 0);
  const modalTotalValuation = calculatedModalItems.reduce((sum, it) => sum + it.valuation, 0);
  const modalMaxEligible = Math.round((modalTotalValuation * settings.maxLoanPercent) / 100);

  const handleSubmitApplicationAppraisal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppToAppraise) return;
    setActionError(null);

    const result = submitAppraisal(activeAppToAppraise.id, {
      ornaments: calculatedModalItems,
      assayRemarks,
    });

    if (!result.success) {
      setActionError(result.error || 'Failed to submit appraisal.');
      return;
    }

    setActionSuccess(`Appraisal certificate successfully generated and submitted for Manager Sanction!`);
    setTimeout(() => {
      setActiveAppToAppraise(null);
      setActionSuccess(null);
    }, 2500);
  };

  // Standalone submission handler
  const handleCreateStandaloneAppraisal = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
    const net = Math.max(0, Number((standaloneGross - standaloneStone).toFixed(3)));
    const rate = standalonePurity === '24K' ? settings.goldRate24K : standalonePurity === '22K' ? settings.goldRate22K : Math.round((settings.goldRate24K * 18) / 24);
    const valuation = Math.round(net * rate);
    const maxSanction = Math.round(valuation * (settings.maxLoanPercent / 100));

    addAppraisal({
      customerName: customer.name,
      customerPhone: customer.phone,
      customerIdProof: customer.idProof,
      ornaments: [
        {
          name: standaloneItemName || `${standalonePurity} Ornament`,
          grossWeight: standaloneGross,
          stoneWeight: standaloneStone,
          netWeight: net,
          purity: standalonePurity,
          ratePerGram: rate,
          valuation,
        },
      ],
      totalGrossWeight: standaloneGross,
      totalNetWeight: net,
      totalValuation: valuation,
      maxSanctionEligible: maxSanction,
      status: 'PENDING_SANCTION',
      appraisedBy: currentStaff.name,
      notes: 'Direct counter appraisal assay.',
    });

    setIsSuccessMessage(true);
    setTimeout(() => setIsSuccessMessage(false), 4000);
    setStandaloneItemName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <PageHeader
        title="Gold Appraisal & Assay Station"
        subtitle="Precision karatmeter analysis, stone deduction calculation, and RBI 75% LTV valuation."
        badge={{ label: 'BIS Hallmark Station', color: 'bg-amber-100 text-amber-900 border border-amber-200' }}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/calculator')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Full Gold Calculator</span>
            </button>
          </div>
        }
      />

      {/* 4 Summary Metrics Cards for Appraiser */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Awaiting Appraisal</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 font-heading">
            {pendingApplications.length} <span className="text-base font-semibold text-zinc-500">requests</span>
          </div>
          <div className="mt-2 text-xs text-zinc-500">Assigned loan applications</div>
        </div>

        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Assayed Collateral</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-950 font-heading">
            {totalAssessedGrams.toFixed(1)} <span className="text-base font-normal text-zinc-400">grams</span>
          </div>
          <div className="mt-2 text-xs text-zinc-500">Net certified pure gold</div>
        </div>

        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Benchmark 22K (916)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Gem className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-800 font-mono">
            ₹{settings.goldRate22K.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-xs text-zinc-500">Per gram market valuation</div>
        </div>

        <div className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Statutory Cap</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-900 font-mono">
            {settings.maxLoanPercent}% LTV
          </div>
          <div className="mt-2 text-xs text-zinc-500">Strict RBI regulatory ceiling</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: STEP 2 ASSIGNED PENDING APPRAISAL QUEUE */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-base font-extrabold text-zinc-950 font-heading">
                Step 2 Queue: Assigned Pending Loan Appraisals
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Applications registered in Step 1 awaiting physical karat assay, stone deductions, and valuation.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            {pendingApplications.length} Pending Appraisal Tasks
          </span>
        </div>

        {pendingApplications.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 text-xs">
            No loan applications currently awaiting appraisal. New applications registered in Step 1 will appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingApplications.map((app) => (
              <div
                key={app.id}
                className="p-4 border border-zinc-200 rounded-2xl bg-zinc-50/60 hover:bg-zinc-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-black text-xs text-zinc-950 px-2 py-0.5 bg-zinc-200 rounded">
                      {app.id}
                    </span>
                    <strong className="text-sm font-bold text-zinc-900">{app.customerName}</strong>
                    <span className="text-xs text-zinc-400 font-mono">({app.customerPhone})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                      {app.status === 'RETURNED_FOR_CORRECTION' ? 'Correction Requested' : 'Awaiting Assay'}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-600 flex flex-wrap gap-x-4 gap-y-1 pt-1">
                    <span>Declared Ornaments: <strong className="text-zinc-800">{app.declaredItemsDescription}</strong></span>
                    <span>&middot;</span>
                    <span>Requested Loan: <strong className="text-emerald-800 font-mono">₹{app.requestedAmount.toLocaleString('en-IN')}</strong></span>
                    <span>&middot;</span>
                    <span>Branch: <strong>{app.branchName}</strong></span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAppraisalModal(app)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    <span>Perform Assay & Valuation</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: PERFORM ASSAY & SUBMIT VALUATION CERTIFICATE (STEP 2) */}
      {/* ========================================================================= */}
      {activeAppToAppraise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-zinc-200 text-zinc-900 rounded-3xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200">
                  <Scale className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-900">
                    Step 2: Gold Assay & Valuation Certificate
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Testing gold ornaments for Application <strong className="font-mono text-zinc-800">{activeAppToAppraise.id}</strong> ({activeAppToAppraise.customerName})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveAppToAppraise(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error or Success notice */}
            {actionError && (
              <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-800 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}
            {actionSuccess && (
              <div className="mx-6 mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Modal Body */}
            <form onSubmit={handleSubmitApplicationAppraisal} className="overflow-y-auto p-6 space-y-5 flex-1 text-xs">
              
              {/* Linked Application Summary */}
              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Borrower</span>
                  <strong className="text-zinc-900 text-sm">{activeAppToAppraise.customerName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Mobile / ID</span>
                  <span className="font-mono text-zinc-700">{activeAppToAppraise.customerPhone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Requested Loan</span>
                  <strong className="font-mono text-emerald-800 text-sm">₹{activeAppToAppraise.requestedAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Declared Collateral</span>
                  <span className="text-zinc-700 truncate block">{activeAppToAppraise.declaredItemsDescription}</span>
                </div>
              </div>

              {/* Ornaments Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                    <Gem className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ornament Scale & Deduction Breakdown</span>
                  </h4>
                  <button
                    type="button"
                    onClick={addAssayItem}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-900 hover:text-amber-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Ornament Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {assayItems.map((item, idx) => {
                    const net = Math.max(0, Number((item.grossWeight - item.stoneWeight).toFixed(3)));
                    return (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
                        <div className="col-span-4">
                          <label className="block text-[10px] font-bold text-zinc-500 mb-0.5">Description</label>
                          <input
                            type="text"
                            required
                            value={item.name}
                            onChange={(e) => updateAssayItem(idx, 'name', e.target.value)}
                            placeholder="e.g. 2 Bangles"
                            className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold outline-none"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-zinc-500 mb-0.5 text-right">Gross (g)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0.1"
                            required
                            value={item.grossWeight}
                            onChange={(e) => updateAssayItem(idx, 'grossWeight', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-mono font-bold text-right outline-none"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold text-zinc-500 mb-0.5 text-right">Stone (g)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.stoneWeight}
                            onChange={(e) => updateAssayItem(idx, 'stoneWeight', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-mono font-bold text-right outline-none text-rose-700"
                          />
                        </div>

                        <div className="col-span-3">
                          <label className="block text-[10px] font-bold text-zinc-500 mb-0.5">Purity</label>
                          <select
                            value={item.purity}
                            onChange={(e) => updateAssayItem(idx, 'purity', e.target.value as GoldPurity)}
                            className="w-full px-2 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold outline-none"
                          >
                            <option value="22K">22K (916 Hallmark)</option>
                            <option value="24K">24K (Pure Bullion)</option>
                            <option value="18K">18K (750 Jewelry)</option>
                          </select>
                        </div>

                        <div className="col-span-1 text-center pt-3">
                          <button
                            type="button"
                            onClick={() => removeAssayItem(idx)}
                            className="text-zinc-400 hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Calculated Valuation Banner */}
              <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-300 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Total Gross Wt.</span>
                  <span className="font-mono text-zinc-800 text-sm font-extrabold">{modalTotalGross.toFixed(2)} g</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-900 uppercase font-bold block">Net Pure Gold Wt.</span>
                  <span className="font-mono text-amber-950 text-sm font-black">{modalTotalNet.toFixed(2)} g</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Gold Market Value</span>
                  <span className="font-mono text-zinc-950 text-sm font-black">₹{modalTotalValuation.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-900 uppercase font-bold block">Max 75% LTV Eligible</span>
                  <span className="font-mono text-emerald-700 text-sm font-black">₹{modalMaxEligible.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Appraiser Assay Remarks & Test Verification *
                </label>
                <input
                  type="text"
                  required
                  value={assayRemarks}
                  onChange={(e) => setAssayRemarks(e.target.value)}
                  placeholder="e.g. Acid test positive, electronic karatmeter 91.6% purity verified. No hollow cavity."
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-medium text-zinc-900 outline-none focus:bg-white focus:border-amber-600"
                />
              </div>

              {/* Regulatory segregation notice */}
              <div className="p-3 bg-zinc-100 rounded-xl text-[11px] text-zinc-600 border border-zinc-200">
                <p>
                  <strong>Role Segregation Rule:</strong> As certified Appraiser ({currentStaff.name}), you are submitting this technical assay certificate. Under RBI NBFC norms, you cannot sanction or disburse this loan. It will be sent to the <strong>Branch Manager</strong> for approval.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setActiveAppToAppraise(null)}
                  className="px-5 py-2.5 rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-full shadow-xs text-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Submit Appraisal for Manager Sanction (Step 2 &rarr; Step 3)</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Standalone Assay Card (Existing Tool) */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 font-heading">
              Ad-Hoc Counter Assay Station
            </h3>
            <p className="text-xs text-zinc-500">
              Quick karat testing for walk-in counter consultations and valuation inquiries.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg border border-amber-200">
            22K: ₹{settings.goldRate22K.toLocaleString('en-IN')}/g
          </span>
        </div>

        {isSuccessMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Ad-hoc appraisal record successfully saved!</span>
          </div>
        )}

        <form onSubmit={handleCreateStandaloneAppraisal} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 mb-1">Customer</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 mb-1">Gross Wt. (g)</label>
            <input
              type="number"
              step="0.1"
              value={standaloneGross}
              onChange={(e) => setStandaloneGross(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-right"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 mb-1">Stone Wt. (g)</label>
            <input
              type="number"
              step="0.1"
              value={standaloneStone}
              onChange={(e) => setStandaloneStone(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-right text-rose-700"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 mb-1">Purity</label>
            <select
              value={standalonePurity}
              onChange={(e) => setStandalonePurity(e.target.value as GoldPurity)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold"
            >
              <option value="22K">22K (916)</option>
              <option value="24K">24K (Pure)</option>
              <option value="18K">18K (750)</option>
            </select>
          </div>

          <div className="sm:col-span-4 flex items-center justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Save Ad-hoc Certificate
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
