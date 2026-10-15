import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { formatCurrency } from '../../../utils/formatters';
import { 
  SlidersHorizontal, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  AlertTriangle,
  Lock,
  FileCheck,
  Building2,
  Users
} from 'lucide-react';

export const AdminWorkflowConfigPage: React.FC = () => {
  const { settings, updateSettings } = useDemoData();

  const [branchLimit, setBranchLimit] = useState(settings.branchManagerApprovalLimit || 500000);
  const [custodyMandatory, setCustodyMandatory] = useState(settings.custodyHandoverMandatory ?? true);
  const [highValueDual, setHighValueDual] = useState(settings.secondApproverRequiredForHighValue ?? true);
  const [highValueThreshold, setHighValueThreshold] = useState(settings.highValueThreshold || 1000000);
  const [maxLtv, setMaxLtv] = useState(Math.round(settings.maxLtvRatio * 100));
  const [standardFee, setStandardFee] = useState(settings.standardProcessingFeePercent || 0.25);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      branchManagerApprovalLimit: Number(branchLimit),
      custodyHandoverMandatory: custodyMandatory,
      secondApproverRequiredForHighValue: highValueDual,
      highValueThreshold: Number(highValueThreshold),
      maxLtvRatio: Number(maxLtv) / 100,
      standardProcessingFeePercent: Number(standardFee),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#C9A45C]" />
            <h1 className="text-2xl font-black text-[#701525] font-display">
              Workflow Rules & Authorization Limits
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Configure approval authority ceilings, separation of duties, custody protocols, and verification stages.
          </p>
        </div>
        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Workflow Configuration Saved!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Approval Authority Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <ShieldCheck className="w-5 h-5 text-[#701525]" />
            <h3 className="text-base font-bold text-gray-900">
              Sanction Authorization & Escalation Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <label className="font-bold text-gray-700 block">
                Branch Manager Maximum Approval Ceiling (₹)
              </label>
              <input
                type="number"
                step="50000"
                value={branchLimit}
                onChange={(e) => setBranchLimit(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-gray-300 font-bold text-gray-900 focus:border-[#701525] outline-none text-base"
                required
              />
              <p className="text-[11px] text-gray-500">
                Loan applications requesting more than <strong>{formatCurrency(branchLimit)}</strong> cannot be sanctioned by Branch Managers and must automatically escalate to Super Admin review.
              </p>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-gray-700 block">
                High-Value Facility Dual Approval Threshold (₹)
              </label>
              <input
                type="number"
                step="100000"
                value={highValueThreshold}
                onChange={(e) => setHighValueThreshold(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-gray-300 font-bold text-gray-900 focus:border-[#701525] outline-none text-base"
                required
              />
              <p className="text-[11px] text-gray-500">
                Requires mandatory secondary concurrence for tickets exceeding <strong>{formatCurrency(highValueThreshold)}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Operating Sequence & Custody Governance */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Lock className="w-5 h-5 text-[#701525]" />
            <h3 className="text-base font-bold text-gray-900">
              Gold Custody & Disbursement Governance
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <label className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 hover:bg-gray-50/60 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={custodyMandatory}
                onChange={(e) => setCustodyMandatory(e.target.checked)}
                className="w-4 h-4 text-[#701525] rounded mt-0.5 accent-[#701525]"
              />
              <div>
                <p className="font-bold text-gray-900">
                  Mandatory Vault Custody Lock Before Cashier Disbursement
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  When enabled, after loan sanction approval, the application moves to "Custody Pending". The Gold Custody Officer must verify and record the sealed packet reference in the vault safe locker before the cashier is permitted to execute the disbursement payout.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 hover:bg-gray-50/60 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={highValueDual}
                onChange={(e) => setHighValueDual(e.target.checked)}
                className="w-4 h-4 text-[#701525] rounded mt-0.5 accent-[#701525]"
              />
              <div>
                <p className="font-bold text-gray-900">
                  Enforce Strict Separation of Critical Duties
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Prevents single accounts with multiple roles from approving their own loan applications or disbursing loans they personally sanctioned.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Global Policy Parameters */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Layers className="w-5 h-5 text-[#701525]" />
            <h3 className="text-base font-bold text-gray-900">
              Regulatory & Statutory Ceilings
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <label className="font-bold text-gray-700 block">
                Statutory Loan-to-Value (LTV) Cap (%)
              </label>
              <input
                type="number"
                value={maxLtv}
                onChange={(e) => setMaxLtv(Number(e.target.value))}
                max={85}
                min={50}
                className="w-full p-2.5 rounded-xl border border-gray-300 font-bold text-gray-900"
                required
              />
              <span className="text-[10px] text-gray-400">
                Industry standard maximum ceiling is 75% for retail gold loans.
              </span>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-gray-700 block">
                Standard Processing Fee Benchmark (%)
              </label>
              <input
                type="number"
                step="0.05"
                value={standardFee}
                onChange={(e) => setStandardFee(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-gray-300 font-bold text-gray-900"
                required
              />
              <span className="text-[10px] text-gray-400">
                Applied to loan schemes unless customized per scheme.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-sm"
            >
              Save Workflow Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
