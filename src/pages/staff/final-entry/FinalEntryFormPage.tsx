import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDemoData } from '../../../context/DemoDataContext';
import { useStaffSession } from '../../../context/StaffSessionContext';
import { RepaymentMethod } from '../../../types';
import { formatCurrency, formatGrams, formatDateTime } from '../../../utils/formatters';
import DocumentPreview from '../../../components/DocumentPreview';
import { 
  CheckSquare, 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Scale, 
  UserCheck,
  ShieldAlert,
  X,
  ImageIcon,
  ShieldCheck
} from 'lucide-react';

export const FinalEntryFormPage: React.FC = () => {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();
  const { applications, assessments, finalEntries, saveFinalEntryDraft, submitFinalEntry, returnForGoldCorrection, settings, schemes } = useDemoData();
  const { currentStaff } = useStaffSession();

  const application = applications.find(
    (a) => a.reference.toUpperCase() === (reference || '').toUpperCase()
  );

  const assessment = assessments.find(
    (a) => a.applicationReference.toUpperCase() === (reference || '').toUpperCase()
  );

  const activeAssessmentVersion = assessment?.versions.find(
    (v) => v.version === assessment.activeVersion
  ) || assessment?.versions[0];

  const existingFinalEntry = finalEntries.find(
    (f) => f.applicationReference.toUpperCase() === (reference || '').toUpperCase()
  );

  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>(
    existingFinalEntry?.schemeCode || application?.loanPreferences.schemeCode || 'AGF-REGULAR'
  );

  // Form State
  const [proposedAmount, setProposedAmount] = useState<number>(
    existingFinalEntry?.proposedLoanAmount || application?.loanPreferences.requestedAmount || 150000
  );
  const [interestRate, setInterestRate] = useState<number>(
    existingFinalEntry?.annualInterestRate || settings.defaultAnnualInterestRate
  );
  const [tenureMonths, setTenureMonths] = useState<number>(
    existingFinalEntry?.tenureMonths || application?.loanPreferences.preferredTenureMonths || 12
  );
  const [repaymentMethod, setRepaymentMethod] = useState<RepaymentMethod>(
    existingFinalEntry?.repaymentMethod || application?.loanPreferences.repaymentMethod || 'Simple Interest'
  );
  const [processingFee, setProcessingFee] = useState<number>(
    existingFinalEntry?.processingFee || Math.round(proposedAmount * 0.0025)
  );
  const [operatorNotes, setOperatorNotes] = useState<string>(
    existingFinalEntry?.operatorNotes || 'Borrower contact and declared residence verified. Physical appraisal verified against hallmarking criteria.'
  );

  const handleSchemeSelect = (code: string) => {
    setSelectedSchemeCode(code);
    const matched = schemes.find(s => s.code === code);
    if (matched) {
      setInterestRate(matched.nominalInterestRate);
      setRepaymentMethod(matched.interestMethod);
      setProcessingFee(Math.round((proposedAmount * matched.processingFeePercent) / 100));
    }
  };

  // Verification checklist
  const [checkCustomer, setCheckCustomer] = useState<boolean>(existingFinalEntry?.customerDetailsVerified ?? true);
  const [checkAssessment, setCheckAssessment] = useState<boolean>(existingFinalEntry?.goldAssessmentReviewed ?? true);
  const [checkCalculation, setCheckCalculation] = useState<boolean>(existingFinalEntry?.loanCalculationReviewed ?? true);
  const [checkFields, setCheckFields] = useState<boolean>(existingFinalEntry?.requiredFieldsCompleted ?? true);
  const [checkKyc, setCheckKyc] = useState<boolean>(existingFinalEntry?.kycDocumentVerified ?? false);
  const [checkJewelleryPhoto, setCheckJewelleryPhoto] = useState<boolean>(existingFinalEntry?.jewelleryPhotoVerified ?? false);

  // Return for Correction Modal State
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  if (!application) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Application Not Found</h2>
        <p className="text-xs text-gray-500">No application matches reference {reference}</p>
        <Link to="/staff/final-entry/queue" className="text-xs font-bold text-[#701525] hover:underline">
          Return to Queue
        </Link>
      </div>
    );
  }

  const allChecksPassed = checkCustomer && checkAssessment && checkCalculation && checkFields && checkKyc && checkJewelleryPhoto;

  const handleSaveDraft = () => {
    if (!currentStaff) return;
    saveFinalEntryDraft(
      {
        applicationReference: application.reference,
        recordedBy: currentStaff.id,
        recordedByName: currentStaff.fullName,
        customerDetailsVerified: checkCustomer,
        goldAssessmentReviewed: checkAssessment,
        loanCalculationReviewed: checkCalculation,
        requiredFieldsCompleted: checkFields,
        kycDocumentVerified: checkKyc,
        jewelleryPhotoVerified: checkJewelleryPhoto,
        proposedLoanAmount: proposedAmount,
        annualInterestRate: interestRate,
        tenureMonths,
        repaymentMethod,
        processingFee,
        valuationCharge: 0,
        operatorNotes,
      },
      application.reference,
      currentStaff
    );
    alert('Final entry draft saved locally.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allChecksPassed) {
      alert('Verify the customer, gold assessment, loan calculation, required fields, ID proof, and jewellery photo before submitting final entry.');
      return;
    }
    if (!currentStaff) return;

    submitFinalEntry(
      {
        applicationReference: application.reference,
        recordedBy: currentStaff.id,
        recordedByName: currentStaff.fullName,
        customerDetailsVerified: checkCustomer,
        goldAssessmentReviewed: checkAssessment,
        loanCalculationReviewed: checkCalculation,
        requiredFieldsCompleted: checkFields,
        kycDocumentVerified: checkKyc,
        jewelleryPhotoVerified: checkJewelleryPhoto,
        proposedLoanAmount: proposedAmount,
        annualInterestRate: interestRate,
        tenureMonths,
        repaymentMethod,
        processingFee,
        valuationCharge: 0,
        operatorNotes,
      },
      application.reference,
      currentStaff
    );

    alert(`Final entry verified! Application ${application.reference} has been dispatched to Super Admin for authorized review and sanction decision.`);
    navigate('/staff/final-entry/queue');
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnReason.trim()) {
      alert('A specific correction reason is mandatory before returning the file.');
      return;
    }
    if (!currentStaff) return;

    returnForGoldCorrection(application.reference, returnReason.trim(), currentStaff);
    setReturnModalOpen(false);
    alert(`Application ${application.reference} has been returned to Gold Weighter for reassessment. Recorded reason: "${returnReason}"`);
    navigate('/staff/final-entry/queue');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/staff/final-entry/queue"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#701525]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Operator Queue</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2D8] shadow-xl space-y-8">
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl sm:text-2xl font-black text-[#701525]">
                {application.reference}
              </span>
              <span className="text-[10px] uppercase font-bold bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded border border-purple-200">
                Final Entry Verification
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Dual-Control Operator Review • Assigned to: {currentStaff?.fullName} ({currentStaff?.id})
            </p>
          </div>

          {/* Return Button */}
          <button
            type="button"
            onClick={() => setReturnModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Return for Gold Correction</span>
          </button>
        </div>

        {/* Section 1: Customer Identity Dossier (Read-only view) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#701525] flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#C9A45C]" />
            <span>1. Customer Identity & Residential Verification</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px]">Borrower Name</span>
              <span className="font-bold text-gray-900">{application.customer.fullName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Registered Phone</span>
              <span className="font-bold text-gray-900 font-mono">{application.customer.mobile}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Email</span>
              <span className="text-gray-800">{application.customer.email}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">City / State</span>
              <span className="text-gray-800">{application.customer.city}, {application.customer.state}</span>
            </div>
          </div>
        </div>

        {/* Section 1.5: KYC Document & Jewellery Photo Verification */}
        {application.documents && (application.documents.jewelleryPictureUrl || application.documents.idProofFileUrl || application.documents.addressProofFileUrl) && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#701525] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C9A45C]" />
              <span>1.5 KYC Document &amp; Jewellery Photo Verification</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gradient-to-r from-amber-50 to-blue-50 p-4 rounded-2xl border border-amber-200">
              {application.documents?.jewelleryPictureUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-amber-800 flex items-center gap-1"><ImageIcon className="w-3 h-3" />Jewellery Photo</p>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" checked={checkJewelleryPhoto} onChange={(e) => setCheckJewelleryPhoto(e.target.checked)} className="rounded text-emerald-600" />
                      <span className="text-[10px] font-bold text-emerald-700">Verified</span>
                    </label>
                  </div>
                  <DocumentPreview src={application.documents.jewelleryPictureUrl} alt="Jewellery" fileName={application.documents.jewelleryPictureFileName} className="h-28 overflow-hidden rounded-xl border-2 border-amber-200" />
                </div>
              )}
              {application.documents?.idProofFileUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-blue-800 flex items-center gap-1"><ShieldCheck className="w-3 h-3" />{application.documents.idProofType}</p>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" checked={checkKyc} onChange={(e) => setCheckKyc(e.target.checked)} className="rounded text-emerald-600" />
                      <span className="text-[10px] font-bold text-emerald-700">KYC OK</span>
                    </label>
                  </div>
                  <DocumentPreview src={application.documents.idProofFileUrl} alt="ID Proof" fileName={application.documents.idProofFileName} className="h-28 overflow-hidden rounded-xl border-2 border-blue-200" />
                  <p className="text-[9px] text-gray-500 font-mono">{application.documents.idProofNumberMasked}</p>
                </div>
              )}
              {application.documents?.addressProofFileUrl && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-emerald-800 flex items-center gap-1"><ImageIcon className="w-3 h-3" />Address Proof ({application.documents.addressProofType})</p>
                  <DocumentPreview src={application.documents.addressProofFileUrl} alt="Address" fileName={application.documents.addressProofFileName} className="h-28 overflow-hidden rounded-xl border-2 border-emerald-200" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 2: Locked Gold Assessment Record (Read-only as per specification!) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#701525] flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#C9A45C]" />
              <span>2. Locked Physical Gold Appraisal (From Gold Weighter)</span>
            </h3>
            <span className="text-[10px] font-mono text-gray-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Immutable Appraisal Record
            </span>
          </div>

          {activeAssessmentVersion ? (
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-gray-500 block text-[10px]">Certified Gross Weight</span>
                  <span className="font-bold text-gray-900">{formatGrams(activeAssessmentVersion.grossWeight)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Deductions (Stones/Alloys)</span>
                  <span className="font-bold text-rose-700">
                    -{formatGrams((activeAssessmentVersion.stoneWeight || 0) + (activeAssessmentVersion.otherNonGoldWeight || 0))}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Net Pure Gold Content</span>
                  <span className="font-black text-[#701525]">{formatGrams(activeAssessmentVersion.netGoldWeight)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Certified Karat Purity</span>
                  <span className="font-bold text-[#701525]">{activeAssessmentVersion.purity}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-amber-200/60 text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px]">Assessed Gold Value</span>
                  <span className="font-bold text-emerald-800">{formatCurrency(activeAssessmentVersion.estimatedGoldValue)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Max Eligible (75% LTV)</span>
                  <span className="font-bold text-emerald-800">{formatCurrency(activeAssessmentVersion.estimatedEligibleAmount)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Weighed By Appraiser</span>
                  <span className="font-mono text-gray-700">{activeAssessmentVersion.recordedByName} ({activeAssessmentVersion.recordedBy})</span>
                </div>
              </div>

              {activeAssessmentVersion.notes && (
                <p className="text-[11px] text-gray-600 italic pt-1 border-t border-amber-200/40">
                  Appraiser Remarks: "{activeAssessmentVersion.notes}"
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic p-3 bg-gray-50 rounded-xl">
              No physical appraisal found. The application cannot proceed without appraiser weighment.
            </p>
          )}
        </div>

        {/* Section 3: Loan Parameters & Proposed Terms */}
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#701525] flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-[#C9A45C]" />
              <span>3. Proposed Loan Structure for Super Admin Sanction</span>
            </h3>

            <div className="space-y-1 mb-3">
              <label className="font-bold text-gray-700">Selected Gold Loan Scheme</label>
              <select
                value={selectedSchemeCode}
                onChange={(e) => handleSchemeSelect(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 font-bold text-xs bg-white text-gray-800"
              >
                {schemes.map((s) => (
                  <option key={s.id} value={s.code}>
                    {s.name} ({s.code}) · {s.nominalInterestRate}% p.a. · {s.interestMethod}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Proposed Loan Amount (₹) *</label>
                <input
                  type="number"
                  value={proposedAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setProposedAmount(val);
                    setProcessingFee(Math.round(val * 0.0025));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-sm text-[#701525] outline-none focus:border-[#701525]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Annual Interest Rate (%) *</label>
                <input
                  type="number"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-sm text-gray-900 outline-none focus:border-[#701525]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Tenure (Months) *</label>
                <select
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-xs text-gray-900 outline-none focus:border-[#701525]"
                >
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={9}>9 Months</option>
                  <option value={12}>12 Months</option>
                  <option value={18}>18 Months</option>
                  <option value={24}>24 Months</option>
                  <option value={36}>36 Months</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Repayment Servicing Scheme</label>
                <select
                  value={repaymentMethod}
                  onChange={(e) => setRepaymentMethod(e.target.value as RepaymentMethod)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 font-semibold text-xs text-gray-900 outline-none"
                >
                  <option value="Simple Interest">Simple Interest / Bullet Principal at Maturity</option>
                  <option value="Reducing Balance EMI">Reducing Balance Equated Monthly Installments</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Configured Demo Processing Fee (0.25%)</label>
                <input
                  type="number"
                  value={processingFee}
                  onChange={(e) => setProcessingFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-700 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Mandatory Operator Verification Checklist */}
          <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3">
            <h4 className="font-bold text-xs text-[#701525] uppercase tracking-wider">
              Operator Verification Checklist (Required for Submission)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-purple-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkCustomer}
                  onChange={(e) => setCheckCustomer(e.target.checked)}
                  className="rounded text-[#701525] focus:ring-[#701525]"
                />
                <span className="font-medium text-gray-800">1. Customer details & contact verified</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-purple-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkAssessment}
                  onChange={(e) => setCheckAssessment(e.target.checked)}
                  className="rounded text-[#701525] focus:ring-[#701525]"
                />
                <span className="font-medium text-gray-800">2. Gold appraisal & deductions reviewed</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-purple-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkCalculation}
                  onChange={(e) => setCheckCalculation(e.target.checked)}
                  className="rounded text-[#701525] focus:ring-[#701525]"
                />
                <span className="font-medium text-gray-800">3. Loan-to-Value (LTV) limits validated</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-purple-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkFields}
                  onChange={(e) => setCheckFields(e.target.checked)}
                  className="rounded text-[#701525] focus:ring-[#701525]"
                />
                <span className="font-medium text-gray-800">4. Required demo fields verified complete</span>
              </label>
            </div>
          </div>

          {/* Section 5: Review Notes */}
          <div className="space-y-1">
            <label className="font-bold text-gray-700">Operator Final Review Notes *</label>
            <textarea
              rows={3}
              value={operatorNotes}
              onChange={(e) => setOperatorNotes(e.target.value)}
              placeholder="Record operational verification notes for Super Admin..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-[#701525] outline-none resize-none"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Final Entry Draft</span>
            </button>

            <button
              type="submit"
              disabled={!allChecksPassed}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                allChecksPassed
                  ? 'bg-[#701525] hover:bg-[#58101d]'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-[#FFE59E]" />
              <span>Submit Final Entry (Send to Admin)</span>
            </button>
          </div>
        </form>
      </div>

      {/* Return for Correction Modal */}
      {returnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-rose-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <h3 className="font-bold text-sm text-rose-800 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Return Application for Gold Correction</span>
              </h3>
              <button onClick={() => setReturnModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Returning this file will revert the application to <strong>Returned for Gold Correction</strong> status in the Gold Weighter's queue. The weighter will be prompted to re-weigh and submit an updated version.
              </p>

              <div className="space-y-1">
                <label className="font-bold text-rose-900">Mandatory Correction Reason *</label>
                <textarea
                  rows={3}
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="e.g. Stone weight deduction appears insufficient for 4 bangles. Physical tag mismatch."
                  className="w-full px-3 py-2 rounded-xl border border-rose-300 focus:border-rose-600 outline-none resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setReturnModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm"
                >
                  Confirm Return to Weighter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
