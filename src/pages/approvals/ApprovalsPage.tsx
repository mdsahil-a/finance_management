import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../../components/common/PageHeader';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  RotateCcw,
  ShieldAlert,
  User,
  Scale,
  Gem,
  Coins,
  ShieldCheck,
  AlertCircle,
  X,
  FileCheck,
  ArrowRight
} from 'lucide-react';
import { LoanApplication, PendingApproval, Loan } from '../../types/finance';

export const ApprovalsPage: React.FC = () => {
  const { 
    applications, 
    reviewApplication, 
    approvals, 
    authorizeCollateralRelease, 
    loans, 
    currentRole, 
    currentStaff 
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'SANCTIONS' | 'COLLATERAL_RELEASE' | 'HISTORY'>('SANCTIONS');
  const [search, setSearch] = useState('');

  // Modal states for decision
  const [selectedAppForDecision, setSelectedAppForDecision] = useState<LoanApplication | null>(null);
  const [decisionType, setDecisionType] = useState<'APPROVED' | 'REJECTED' | 'RETURNED_FOR_CORRECTION'>('APPROVED');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [approvedAmountInput, setApprovedAmountInput] = useState<string>('0');
  const [interestRateInput, setInterestRateInput] = useState<string>('1.5');
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const [decisionSuccess, setDecisionSuccess] = useState<string | null>(null);

  // Collateral release modal
  const [selectedLoanForRelease, setSelectedLoanForRelease] = useState<Loan | null>(null);
  const [releaseNotes, setReleaseNotes] = useState('Full settlement verified. Collateral release authorized.');

  // Filtered applications awaiting review
  const pendingSanctionApps = applications.filter((a) => a.status === 'AWAITING_APPROVAL');

  // Loans settled and awaiting manager collateral release authorization
  const pendingReleaseLoans = loans.filter((l) => l.safeStatus === 'Release Pending Approval');

  const filteredSanctionApps = pendingSanctionApps.filter(
    (a) =>
      a.customerName.toLowerCase().includes(search.toLowerCase()) ||
      a.customerPhone.includes(search) ||
      a.id.toLowerCase().includes(search.toLowerCase())
  );

  const filteredReleaseLoans = pendingReleaseLoans.filter(
    (l) =>
      l.customerName.toLowerCase().includes(search.toLowerCase()) ||
      l.customerPhone.includes(search) ||
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.safePacketNumber.toLowerCase().includes(search.toLowerCase())
  );

  // Open Decision Modal
  const handleOpenDecisionModal = (app: LoanApplication, type: 'APPROVED' | 'REJECTED' | 'RETURNED_FOR_CORRECTION') => {
    setSelectedAppForDecision(app);
    setDecisionType(type);
    setDecisionError(null);
    setDecisionSuccess(null);
    const maxEligible = app.appraisalDetails?.maxSanctionEligible || app.requestedAmount;
    setApprovedAmountInput(String(Math.min(app.requestedAmount, maxEligible)));
    setInterestRateInput('1.5');
    setDecisionNotes(
      type === 'APPROVED'
        ? `75% LTV verified against ${app.appraisalDetails?.totalNetWeight || 0}g net gold. Sanction approved.`
        : type === 'REJECTED'
        ? 'Identity or ornament verification failed regulatory compliance.'
        : 'Appraiser requested to re-test stone deduction and weight.'
    );
  };

  const handleExecuteDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForDecision) return;
    setDecisionError(null);

    const result = reviewApplication(selectedAppForDecision.id, {
      decision: decisionType,
      reason: decisionNotes,
      approvedAmount: parseFloat(approvedAmountInput) || 0,
      monthlyInterestRate: parseFloat(interestRateInput) || 1.5,
    });

    if (!result.success) {
      setDecisionError(result.error || 'Failed to record decision.');
      return;
    }

    setDecisionSuccess(`Decision "${decisionType}" recorded successfully! Application updated.`);
    setTimeout(() => {
      setSelectedAppForDecision(null);
      setDecisionSuccess(null);
    }, 2000);
  };

  const handleAuthorizeRelease = (loan: Loan) => {
    const result = authorizeCollateralRelease(loan.id, releaseNotes);
    if (!result.success) {
      alert(result.error || 'Failed to authorize release.');
      return;
    }
    alert(`Collateral release for Loan #${loan.id} (${loan.customerName}) authorized! Cashier/Custodian can now physically hand over gold.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="Managerial Review & Dual-Authorization Desk"
        subtitle="Step 3: Review customer KYC, gold appraisal, 75% LTV statutory cap, sanction approval, and collateral release clearance."
        badge={{ label: `${pendingSanctionApps.length + pendingReleaseLoans.length} Action Items`, color: 'bg-rose-100 text-rose-900 border border-rose-200' }}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Approvals' },
        ]}
      />

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Sanction Queue</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono">
            {pendingSanctionApps.length} applications
          </div>
          <span className="text-xs text-zinc-500 mt-1 block">Awaiting manager sign-off</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Collateral Releases</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 font-mono">
            {pendingReleaseLoans.length} loans
          </div>
          <span className="text-xs text-zinc-500 mt-1 block">Settled loans awaiting clearance</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Approved Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {applications.filter(a => a.status === 'APPROVED' || a.status === 'AWAITING_DISBURSEMENT' || a.status === 'DISBURSED').length} loans
          </div>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">Sent to Cashier</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Value at Stake</span>
            <Coins className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-zinc-950 font-mono">
            ₹{pendingSanctionApps.reduce((sum, a) => sum + a.requestedAmount, 0).toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-zinc-500 mt-1 block">Pending sanction pipeline</span>
        </div>
      </div>

      {/* Main Tab Controls */}
      <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('SANCTIONS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'SANCTIONS'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Step 3: Loan Sanctions ({pendingSanctionApps.length})
            </button>

            <button
              onClick={() => setActiveTab('COLLATERAL_RELEASE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'COLLATERAL_RELEASE'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Step 7: Collateral Release Clearances ({pendingReleaseLoans.length})
            </button>

            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'HISTORY'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Approval History ({approvals.length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search customer, ID, mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 rounded-xl text-xs outline-none font-medium"
            />
          </div>

        </div>

        {/* ========================================================================= */}
        {/* TAB 1: STEP 3 LOAN SANCTION APPROVALS */}
        {/* ========================================================================= */}
        {activeTab === 'SANCTIONS' && (
          <div className="space-y-4 pt-1">
            {filteredSanctionApps.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-xs">
                No appraised applications currently awaiting review. All appraisals are up to date.
              </div>
            ) : (
              filteredSanctionApps.map((app) => {
                const maxSanction = app.appraisalDetails?.maxSanctionEligible || app.requestedAmount;
                const totalNetWeight = app.appraisalDetails?.totalNetWeight || 0;
                const totalValuation = app.appraisalDetails?.totalValuation || 0;

                return (
                  <div
                    key={app.id}
                    className="p-5 border-2 border-amber-200 rounded-3xl bg-amber-50/20 hover:bg-amber-50/40 transition-all space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/60 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-xs text-zinc-950 px-2 py-0.5 bg-zinc-200 rounded">
                          {app.id}
                        </span>
                        <div>
                          <strong className="text-sm font-extrabold text-zinc-950 block">{app.customerName}</strong>
                          <span className="text-[11px] text-zinc-500 font-mono">
                            {app.customerPhone} &middot; {app.customerIdProof}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Requested Principal</span>
                        <strong className="text-base font-black text-zinc-950 font-mono">
                          ₹{app.requestedAmount.toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>

                    {/* Appraisal Certificate Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3.5 rounded-2xl border border-zinc-200/80">
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Pledged Gold Ornaments</span>
                        <span className="font-bold text-zinc-800 truncate block">
                          {app.appraisalDetails?.ornaments.map(o => o.name).join(', ') || app.declaredItemsDescription}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Assayed Net Gold Wt.</span>
                        <span className="font-mono font-bold text-amber-900">{totalNetWeight.toFixed(2)} grams</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Gross Gold Market Value</span>
                        <span className="font-mono font-bold text-zinc-900">₹{totalValuation.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">75% RBI LTV Ceiling</span>
                        <strong className="font-mono font-black text-emerald-700">₹{maxSanction.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    {/* Appraiser remarks */}
                    {app.appraisalDetails?.assayRemarks && (
                      <div className="text-xs text-zinc-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 flex items-center justify-between">
                        <span>Assay Verified: <strong>{app.appraisalDetails.assayRemarks}</strong></span>
                        <span className="text-[10px] text-zinc-400">By: {app.appraisalDetails.appraisedBy} ({app.appraisalDetails.appraisedAt})</span>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <span className="text-xs text-zinc-500 font-medium">
                        Only approved applications advance to <strong>Cashier Disbursement (Step 4)</strong>.
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenDecisionModal(app, 'APPROVED')}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sanction Loan</span>
                        </button>

                        <button
                          onClick={() => handleOpenDecisionModal(app, 'RETURNED_FOR_CORRECTION')}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-100 hover:bg-amber-100 text-zinc-700 hover:text-amber-900 font-bold text-xs rounded-xl transition-all cursor-pointer border border-zinc-200"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                          <span>Return for Correction</span>
                        </button>

                        <button
                          onClick={() => handleOpenDecisionModal(app, 'REJECTED')}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-100 hover:bg-rose-100 text-zinc-700 hover:text-rose-800 font-bold text-xs rounded-xl transition-all cursor-pointer border border-zinc-200"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: STEP 7 COLLATERAL RELEASE CLEARANCE */}
        {/* ========================================================================= */}
        {activeTab === 'COLLATERAL_RELEASE' && (
          <div className="space-y-4 pt-1">
            {filteredReleaseLoans.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-xs">
                No fully-settled loans currently pending collateral release clearance.
              </div>
            ) : (
              filteredReleaseLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-5 border-2 border-blue-200 rounded-3xl bg-blue-50/20 hover:bg-blue-50/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-xs text-zinc-950 px-2 py-0.5 bg-zinc-200 rounded">
                        {loan.id}
                      </span>
                      <strong className="text-sm font-extrabold text-zinc-900">{loan.customerName}</strong>
                      <span className="text-xs text-zinc-500 font-mono">({loan.customerPhone})</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full">
                        100% Settled (Balance: ₹0)
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 pt-1">
                      Pledged Gold Packet: <strong className="font-mono text-zinc-900">{loan.safePacketNumber}</strong> ({loan.totalWeightGrams}g gold &middot; {loan.goldItems.map(g => g.name).join(', ')}).
                    </p>
                    <span className="text-[10px] text-zinc-400 block">
                      Disbursed on {loan.loanDate} &middot; Fully paid on {loan.lastPaymentDate || 'Today'}.
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => handleAuthorizeRelease(loan)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize Gold Release (Step 7)</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: APPROVAL HISTORY */}
        {/* ========================================================================= */}
        {activeTab === 'HISTORY' && (
          <div className="space-y-3 pt-1">
            {approvals.map((req) => (
              <div
                key={req.id}
                className="p-4 border border-zinc-200 rounded-2xl bg-zinc-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="text-zinc-900 font-bold">{req.customerName}</strong>
                    {req.applicationId && <span className="font-mono text-[10px] px-1.5 py-0.5 bg-zinc-200 rounded">{req.applicationId}</span>}
                    {req.loanId && <span className="font-mono text-[10px] px-1.5 py-0.5 bg-zinc-200 rounded">{req.loanId}</span>}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-900' : req.status === 'REJECTED' ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-zinc-600">{req.reason}</p>
                  <span className="text-[10px] text-zinc-400 mt-1 block">Requested by: {req.requestedBy} &middot; {req.requestDate}</span>
                </div>

                <div className="text-right">
                  <div className="font-mono font-black text-sm text-zinc-950">
                    ₹{req.amount.toLocaleString('en-IN')}
                  </div>
                  {req.decidedBy && (
                    <span className="text-[10px] text-emerald-800 font-medium block">
                      Decided by {req.decidedBy}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* DECISION MODAL: SANCTION / REJECT / RETURN */}
      {/* ========================================================================= */}
      {selectedAppForDecision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-zinc-200 text-zinc-900 rounded-3xl w-full max-w-lg my-8 overflow-hidden shadow-2xl flex flex-col">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  decisionType === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : decisionType === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {decisionType === 'APPROVED' ? <CheckCircle2 className="w-4 h-4" /> : decisionType === 'REJECTED' ? <XCircle className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                </div>
                <h3 className="font-extrabold text-base text-zinc-900">
                  {decisionType === 'APPROVED' ? 'Confirm Loan Sanction' : decisionType === 'REJECTED' ? 'Reject Loan Application' : 'Return Application for Correction'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppForDecision(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {decisionError && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{decisionError}</span>
              </div>
            )}
            {decisionSuccess && (
              <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{decisionSuccess}</span>
              </div>
            )}

            <form onSubmit={handleExecuteDecision} className="p-6 space-y-4 text-xs">
              
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Borrower:</span>
                  <strong className="text-zinc-900">{selectedAppForDecision.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Max 75% LTV Cap:</span>
                  <strong className="text-emerald-700 font-mono">₹{(selectedAppForDecision.appraisalDetails?.maxSanctionEligible || 0).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {decisionType === 'APPROVED' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">
                      Approved Principal (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={approvedAmountInput}
                      onChange={(e) => setApprovedAmountInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">
                      Monthly Interest (%) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={interestRateInput}
                      onChange={(e) => setInterestRateInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-bold text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Manager Decision Notes & Audit Rationale *
                </label>
                <textarea
                  required
                  rows={3}
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="Enter manager remarks or reason..."
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-zinc-950"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setSelectedAppForDecision(null)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-700 font-bold rounded-full cursor-pointer hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold rounded-full shadow-xs cursor-pointer ${
                    decisionType === 'APPROVED' ? 'bg-emerald-600 hover:bg-emerald-700' : decisionType === 'REJECTED' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  Confirm Decision
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
