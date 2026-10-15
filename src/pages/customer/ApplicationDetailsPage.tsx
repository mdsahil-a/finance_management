import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDemoData } from '../../context/DemoDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Logo } from '../../components/common/Logo';
import { formatCurrency, formatDateTime, formatGrams } from '../../utils/formatters';
import { 
  Printer, 
  ArrowLeft, 
  AlertCircle
} from 'lucide-react';

export const ApplicationDetailsPage: React.FC = () => {
  const { reference } = useParams<{ reference: string }>();
  const { applications, branches, assessments, finalEntries } = useDemoData();

  const application = applications.find(
    (a) => a.reference.toUpperCase() === (reference || '').toUpperCase()
  );

  if (!application) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Application Not Found</h2>
        <p className="text-xs text-gray-500">
          The reference number <span className="font-mono font-bold text-red-700">{reference}</span> does not exist in the active demo records.
        </p>
        <Link
          to="/dashboard/applications"
          className="inline-block px-5 py-2 rounded-xl text-xs font-bold bg-[#701525] text-white"
        >
          Return to My Applications
        </Link>
      </div>
    );
  }

  const branch = branches.find((b) => b.id === application.assignedBranchId);
  const assessment = assessments.find((a) => a.applicationReference === application.reference);
  const finalEntry = finalEntries.find((f) => f.applicationReference === application.reference);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Bar (Hidden in print) */}
      <div className="no-print flex items-center justify-between pb-4 border-b border-gray-200">
        <Link
          to="/dashboard/applications"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#701525]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#701525] text-white hover:bg-[#58101d] shadow-sm transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Formal Loan Dossier</span>
        </button>
      </div>

      {/* Formal Printable Dossier Paper */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E2D8] shadow-xl space-y-8 text-xs font-sans">
        {/* Header with Logo and Brand */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 border-[#C9A45C]/30 gap-4">
          <div>
            <Logo size="md" showTagline={true} linkTo="" />
            <p className="text-[11px] text-gray-500 mt-2">
              Aurum Gold Finance Limited (Demo Operations)
              <br />
              {branch?.name || 'Mumbai Fort Flagship'}, CIN: U65999MH2026PLC000000
            </p>
          </div>

          <div className="text-right sm:self-auto self-start">
            <span className="font-mono text-xl sm:text-2xl font-black text-[#701525] block">
              {application.reference}
            </span>
            <div className="mt-1">
              <StatusBadge status={application.status} size="sm" />
            </div>
            <p className="text-[10px] text-gray-400 mt-1 font-mono">
              Submitted: {formatDateTime(application.createdAt)}
            </p>
          </div>
        </div>

        {/* Section 2: Pledged Gold Ornaments */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#701525] bg-[#FAF8F3] px-3 py-1.5 rounded-lg border border-[#E8E2D8]">
            2. Collateral Gold Jewellery Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2">
            <div>
              <span className="text-gray-400 block text-[11px]">Jewellery Category</span>
              <span className="font-bold text-gray-900">{application.goldDetails.itemsCount} {application.goldDetails.category}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Declared Gross Weight</span>
              <span className="font-bold text-gray-900">{formatGrams(application.goldDetails.declaredWeight)}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Karat Purity</span>
              <span className="font-bold text-[#701525]">{application.goldDetails.purity}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Declared Loan Purpose</span>
              <span className="text-gray-800">{application.goldDetails.purpose}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Physical Appraisal Assessment (If available) */}
        {assessment && assessment.versions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#701525] bg-[#FAF8F3] px-3 py-1.5 rounded-lg border border-[#E8E2D8]">
              3. Recorded Physical Appraisal (Gold Weighter Verification)
            </h3>
            {(() => {
              const active = assessment.versions[assessment.activeVersion - 1] || assessment.versions[0];
              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2 bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                  <div>
                    <span className="text-gray-500 block text-[11px]">Assessed Gross Weight</span>
                    <span className="font-bold text-gray-900">{formatGrams(active.grossWeight)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Deductions (Stones/Alloys)</span>
                    <span className="font-bold text-rose-700">-{formatGrams((active.stoneWeight || 0) + (active.otherNonGoldWeight || 0))}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Net Gold Content</span>
                    <span className="font-black text-[#701525]">{formatGrams(active.netGoldWeight)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Assessed Gold Value</span>
                    <span className="font-bold text-emerald-800">{formatCurrency(active.estimatedGoldValue)}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Section 4: Loan Sanction Terms */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#701525] bg-[#FAF8F3] px-3 py-1.5 rounded-lg border border-[#E8E2D8]">
            4. Loan Facilities & Servicing Parameters
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2">
            <div>
              <span className="text-gray-400 block text-[11px]">Requested Loan</span>
              <span className="font-bold text-gray-900 text-sm">{formatCurrency(application.loanPreferences.requestedAmount)}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Tenure</span>
              <span className="font-bold text-gray-900">{application.loanPreferences.preferredTenureMonths} Months</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Repayment Model</span>
              <span className="font-bold text-gray-900">{application.loanPreferences.repaymentMethod}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Servicing Branch</span>
              <span className="text-gray-800">{branch?.name}</span>
            </div>
          </div>
        </div>

        {/* Section 5: Workflow Timeline Events */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#701525] bg-[#FAF8F3] px-3 py-1.5 rounded-lg border border-[#E8E2D8]">
            5. Operational Audit Trail (Sequential Events)
          </h3>
          <div className="space-y-2 px-2">
            {application.workflowHistory.map((wf) => (
              <div key={wf.id} className="flex items-start justify-between p-2.5 rounded-lg border border-gray-100 bg-gray-50/60">
                <div>
                  <span className="font-bold text-gray-900">{wf.stageName}</span>
                  <p className="text-gray-600 mt-0.5">{wf.description}</p>
                </div>
                <div className="text-right text-[10px] text-gray-400 font-mono shrink-0 ml-4">
                  <span>{formatDateTime(wf.timestamp)}</span>
                  <span className="block text-gray-500">{wf.performedByRole}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formal Seal and Disclaimer */}
        <div className="pt-8 border-t border-dashed border-gray-300 flex items-end justify-between">
          <div className="max-w-xs text-[10px] text-gray-400">
            <p>Generated by Aurum Gold Finance Prototype for CEO evaluation. All data persisted locally.</p>
          </div>
          <div className="text-center">
            <div className="w-32 border-b border-gray-400 mb-1" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Branch Operations Manager</span>
          </div>
        </div>
      </div>
    </div>
  );
};
