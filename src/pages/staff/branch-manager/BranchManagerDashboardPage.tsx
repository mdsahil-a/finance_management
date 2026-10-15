import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDemoData } from '../../../context/DemoDataContext';
import { useStaffSession } from '../../../context/StaffSessionContext';
import { StatusBadge } from '../../../components/common/StatusBadge';
import DocumentPreview from '../../../components/DocumentPreview';
import { formatCurrency, formatDateTime, formatGrams } from '../../../utils/formatters';
import { 
  Building2, 
  ClipboardList, 
  Clock3, 
  CheckCircle2, 
  ShieldCheck, 
  Check, 
  X, 
  AlertTriangle, 
  ArrowRight,
  RotateCcw,
  Scale,
  CreditCard,
  UserCheck,
  FileText,
  CheckSquare
} from 'lucide-react';

interface BranchManagerDashboardPageProps {
  showApplications?: boolean;
}

export const BranchManagerDashboardPage: React.FC<BranchManagerDashboardPageProps> = ({ showApplications = false }) => {
  const { 
    applications, 
    branches, 
    loans, 
    transactions, 
    reconciliations, 
    recordAuthorizedDecision, 
    approveCashReconciliation, 
    settings 
  } = useDemoData();
  const { currentStaff } = useStaffSession();

  const [activeTab, setActiveTab] = useState<'applications' | 'reconciliations' | 'overdue'>(
    showApplications ? 'applications' : 'applications'
  );

  // Modal for approval / rejection
  const [selectedAppRef, setSelectedAppRef] = useState<string | null>(null);
  const [decisionType, setDecisionType] = useState<'Approved' | 'Rejected'>('Approved');
  const [sanctionAmount, setSanctionAmount] = useState<number>(0);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);

  // Reconciliation review modal
  const [selectedReconId, setSelectedReconId] = useState<string | null>(null);
  const [reconRemarks, setReconRemarks] = useState('All counted till denominations verified and approved.');
  const [reconModalOpen, setReconModalOpen] = useState(false);

  const branch = branches.find((item) => item.id === currentStaff?.branchId) || branches[0];
  const branchApplications = applications
    .filter((app) => app.assignedBranchId === branch.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const branchLoans = loans.filter((l) => l.branchId === branch.id);
  const branchTxns = transactions.filter((t) => branchLoans.some((l) => l.loanAccountNumber === t.loanAccountNumber || l.applicationReference === t.applicationReference));
  const branchRecons = reconciliations.filter((r) => r.branchId === branch.id);

  const awaitingReviewApps = branchApplications.filter((a) => a.status === 'Awaiting Authorized Review');
  const activeLoans = branchLoans.filter((l) => l.status === 'Active');
  const overdueLoans = branchLoans.filter((l) => (l.overdueDays || 0) > 0 || l.status === 'Active' && l.remainingBalance > l.sanctionedAmount);

  const totalDisbursed = branchTxns
    .filter((t) => t.type === 'Disbursement')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCollected = branchTxns
    .filter((t) => t.type === 'Repayment')
    .reduce((sum, t) => sum + t.amount, 0);

  const openDecisionModal = (appRef: string, amount: number) => {
    setSelectedAppRef(appRef);
    setSanctionAmount(amount);
    setDecisionType('Approved');
    setDecisionNotes('Pledged jewellery verified with valuer and customer KYC confirmed.');
    setDecisionModalOpen(true);
  };

  const handleDecisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppRef || !currentStaff) return;

    if (decisionType === 'Approved' && sanctionAmount > settings.branchManagerApprovalLimit) {
      alert(`The requested amount ₹${sanctionAmount.toLocaleString('en-IN')} exceeds your branch manager authorization limit of ₹${settings.branchManagerApprovalLimit.toLocaleString('en-IN')}. Please escalate to Super Admin.`);
      return;
    }

    try {
      recordAuthorizedDecision(
        selectedAppRef,
        decisionType,
        sanctionAmount,
        decisionNotes,
        currentStaff
      );
      setDecisionModalOpen(false);
      alert(`Decision recorded: Application ${selectedAppRef} marked as ${decisionType}.`);
    } catch (err: any) {
      alert(err.message || 'Error recording decision.');
    }
  };

  const openReconModal = (reconId: string) => {
    setSelectedReconId(reconId);
    setReconRemarks('Cashier drawer closing balance and physical till verified. Signed off by Branch Manager.');
    setReconModalOpen(true);
  };

  const handleReconSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReconId || !currentStaff) return;
    approveCashReconciliation(selectedReconId, reconRemarks, currentStaff);
    setReconModalOpen(false);
    alert('Cash drawer reconciliation approved.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#C9A45C]" />
            <h1 className="text-2xl font-black text-[#701525] font-display">
              Branch Manager Operations Center
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            <strong>{branch.name}</strong> · Authority limit: <strong>{formatCurrency(settings.branchManagerApprovalLimit)}</strong> per facility
          </p>
        </div>

        {awaitingReviewApps.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#A71930] text-white shadow-sm animate-pulse">
            <ShieldCheck className="w-4 h-4 text-[#FFE59E]" />
            <span>{awaitingReviewApps.length} Sanction Approvals Pending</span>
          </span>
        )}
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Total Applications</span>
          <p className="text-2xl font-black text-[#701525]">{branchApplications.length}</p>
          <span className="text-[10px] text-gray-400">Branch customer requests</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-amber-500 bg-amber-50/20 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Awaiting Approval</span>
          <p className="text-2xl font-black text-amber-600">{awaitingReviewApps.length}</p>
          <span className="text-[10px] text-amber-700">Requires sanction action</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Active Loans</span>
          <p className="text-2xl font-black text-emerald-700">{activeLoans.length}</p>
          <span className="text-[10px] text-gray-400">Live credit facilities</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block">Disbursed Volume</span>
          <p className="text-2xl font-black text-gray-900">{formatCurrency(totalDisbursed)}</p>
          <span className="text-[10px] text-gray-400">Total payouts executed</span>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'border-[#701525] text-[#701525]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Branch Applications & Sanctions ({branchApplications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reconciliations')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'reconciliations'
              ? 'border-[#701525] text-[#701525]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Cashier Till Reconciliations ({branchRecons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('overdue')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'overdue'
              ? 'border-[#701525] text-[#701525]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Overdue & Watchlist ({overdueLoans.length})</span>
        </button>
      </div>

      {/* Tab 1: Applications & Approvals */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {branchApplications.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-[#E8E2D8] text-center">
              <ClipboardList className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">No applications recorded for this branch yet</p>
            </div>
          ) : (
            branchApplications.map((app) => {
              const needsApproval = app.status === 'Awaiting Authorized Review';
              const proposedAmount = app.authorizedDecision?.sanctionedAmount || app.loanPreferences.requestedAmount;
              const isOverLimit = proposedAmount > settings.branchManagerApprovalLimit;

              return (
                <article key={app.id} className={`bg-white rounded-2xl border p-5 shadow-xs space-y-4 ${needsApproval ? 'border-amber-400 bg-amber-50/10' : 'border-[#E8E2D8]'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link to={`/application/${encodeURIComponent(app.reference)}`} className="font-mono font-black text-sm text-[#701525] hover:underline">
                          {app.reference}
                        </Link>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="text-sm font-bold text-gray-900 mt-1">{app.customer.fullName} · {app.customer.mobile}</p>
                      <p className="text-xs text-gray-500">{app.customer.city}, {app.customer.state} · Created {formatDateTime(app.createdAt)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {needsApproval ? (
                        <button
                          onClick={() => openDecisionModal(app.reference, proposedAmount)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#FFE59E]" />
                          <span>Sanction Review & Decision</span>
                        </button>
                      ) : (
                        <Link
                          to={`/application/${encodeURIComponent(app.reference)}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200"
                        >
                          View Dossier
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="font-bold text-[#701525] block uppercase tracking-wider text-[10px]">Pledged Jewellery</span>
                      <p className="font-semibold text-gray-900">{app.goldDetails.itemsCount} {app.goldDetails.category} ({app.goldDetails.declaredWeight}g declared)</p>
                      <p className="text-gray-600">Purity: <strong>{app.goldDetails.purity}</strong></p>
                      <p className="text-gray-600">Purpose: {app.goldDetails.purpose}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-[#701525] block uppercase tracking-wider text-[10px]">Loan Terms</span>
                      <p className="font-bold text-gray-900">Requested: {formatCurrency(app.loanPreferences.requestedAmount)}</p>
                      <p className="text-gray-600">Tenure: {app.loanPreferences.preferredTenureMonths} Months</p>
                      <p className="text-gray-600">Method: {app.loanPreferences.repaymentMethod}</p>
                      {isOverLimit && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          Exceeds Manager Limit (₹{settings.branchManagerApprovalLimit.toLocaleString('en-IN')})
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-bold text-[#701525] block uppercase tracking-wider text-[10px]">Verified KYC & Evidence</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Jewellery', src: app.documents?.jewelleryPictureUrl, name: app.documents?.jewelleryPictureFileName },
                          { label: app.documents?.idProofType || 'ID Proof', src: app.documents?.idProofFileUrl, name: app.documents?.idProofFileName },
                          { label: 'Address', src: app.documents?.addressProofFileUrl, name: app.documents?.addressProofFileName },
                        ].map((d) => (
                          <div key={d.label} className="text-center">
                            {d.src ? (
                              <DocumentPreview src={d.src} alt={d.label} fileName={d.name} className="h-12 overflow-hidden rounded-lg border border-gray-200" />
                            ) : (
                              <div className="h-12 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-[9px] text-gray-400">None</div>
                            )}
                            <p className="text-[9px] text-gray-600 mt-0.5 truncate">{d.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Cashier Reconciliations */}
      {activeTab === 'reconciliations' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Branch Cashier Till Reconciliations</h3>
              <p className="text-xs text-gray-500">Daily verification and sign-off for cashier opening, disbursements, repayments, and physical closing count.</p>
            </div>
          </div>

          {branchRecons.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No cash reconciliation logs recorded for this branch yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Cashier</th>
                    <th className="py-2.5 px-3">Opening</th>
                    <th className="py-2.5 px-3">Received</th>
                    <th className="py-2.5 px-3">Disbursed</th>
                    <th className="py-2.5 px-3">Expected</th>
                    <th className="py-2.5 px-3">Physical Count</th>
                    <th className="py-2.5 px-3">Discrepancy</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {branchRecons.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-3 font-mono font-bold text-gray-900">{r.date}</td>
                      <td className="py-3 px-3">{r.cashierName}</td>
                      <td className="py-3 px-3">{formatCurrency(r.openingBalance)}</td>
                      <td className="py-3 px-3 text-emerald-600 font-semibold">+{formatCurrency(r.totalCashReceived)}</td>
                      <td className="py-3 px-3 text-rose-600 font-semibold">-{formatCurrency(r.totalCashDisbursed)}</td>
                      <td className="py-3 px-3 font-bold">{formatCurrency(r.expectedClosingBalance)}</td>
                      <td className="py-3 px-3 font-bold text-gray-900">{formatCurrency(r.physicalCountedBalance)}</td>
                      <td className="py-3 px-3 font-bold">
                        {r.discrepancy === 0 ? (
                          <span className="text-emerald-600">₹0 (Balanced)</span>
                        ) : (
                          <span className="text-red-600">{formatCurrency(r.discrepancy)}</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'Manager Approved' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {r.status !== 'Manager Approved' ? (
                          <button
                            onClick={() => openReconModal(r.id)}
                            className="px-2.5 py-1 rounded bg-[#701525] text-white text-[10px] font-bold hover:bg-[#58101d]"
                          >
                            Sign Off
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-400">Signed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Overdue & Watchlist */}
      {activeTab === 'overdue' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Branch Active Loans Watchlist</h3>
              <p className="text-xs text-gray-500">Monitor repayment schedules, accrued interest, and active accounts.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Loan Account</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Sanctioned</th>
                  <th className="py-2.5 px-3">Total Repaid</th>
                  <th className="py-2.5 px-3">Remaining Outstanding</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Vault Packet</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {branchLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-3 font-mono font-bold text-[#701525]">{loan.loanAccountNumber}</td>
                    <td className="py-3 px-3 font-semibold text-gray-900">{loan.customerName}</td>
                    <td className="py-3 px-3 font-bold">{formatCurrency(loan.sanctionedAmount)}</td>
                    <td className="py-3 px-3 text-emerald-600 font-semibold">{formatCurrency(loan.totalRepaid)}</td>
                    <td className="py-3 px-3 font-bold text-[#701525]">{formatCurrency(loan.remainingBalance)}</td>
                    <td className="py-3 px-3 text-gray-600">{loan.nextPaymentDueDate || 'Standard 30D'}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-gray-500">{loan.custodyPacketRef || 'Pending Vault'}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${loan.status === 'Active' ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Decision Modal */}
      {decisionModalOpen && selectedAppRef && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8E2D8] space-y-6">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#701525]" />
                <h3 className="text-lg font-bold text-[#701525]">Authorized Sanction Review</h3>
              </div>
              <button onClick={() => setDecisionModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDecisionSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E2D8] space-y-1">
                <span className="text-gray-500">Target Application:</span>
                <p className="font-mono font-bold text-gray-900 text-sm">{selectedAppRef}</p>
                <p className="text-[11px] text-gray-500">Your branch limit: <strong>{formatCurrency(settings.branchManagerApprovalLimit)}</strong></p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Sanction Decision</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecisionType('Approved')}
                    className={`py-2.5 rounded-xl border font-bold text-center transition-all ${decisionType === 'Approved' ? 'bg-emerald-700 text-white border-emerald-700' : 'border-gray-300 text-gray-700'}`}
                  >
                    ✓ Approve Sanction
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisionType('Rejected')}
                    className={`py-2.5 rounded-xl border font-bold text-center transition-all ${decisionType === 'Rejected' ? 'bg-rose-700 text-white border-rose-700' : 'border-gray-300 text-gray-700'}`}
                  >
                    ✕ Reject Application
                  </button>
                </div>
              </div>

              {decisionType === 'Approved' && (
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Sanctioned Amount (₹)</label>
                  <input
                    type="number"
                    value={sanctionAmount}
                    onChange={(e) => setSanctionAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-bold text-gray-900 text-base"
                    required
                  />
                  {sanctionAmount > settings.branchManagerApprovalLimit && (
                    <p className="text-[11px] font-bold text-red-600">
                      Amount exceeds your branch limit of ₹{settings.branchManagerApprovalLimit.toLocaleString('en-IN')}. Must be approved by Super Admin.
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-gray-700">
                  {decisionType === 'Approved' ? 'Sanction Notes / Justification' : 'Mandatory Reason for Rejection'}
                </label>
                <textarea
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  placeholder="Record formal appraisal justification or rejection reason..."
                  required
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDecisionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl font-bold text-white shadow-sm ${decisionType === 'Approved' ? 'bg-[#701525] hover:bg-[#58101d]' : 'bg-rose-700 hover:bg-rose-800'}`}
                >
                  Submit {decisionType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reconciliation Review Modal */}
      {reconModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2D8] space-y-4">
            <h3 className="text-base font-bold text-[#701525]">Approve Cashier Daily Till Reconciliation</h3>
            <form onSubmit={handleReconSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Manager Sign-Off Remarks</label>
                <textarea
                  value={reconRemarks}
                  onChange={(e) => setReconRemarks(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReconModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-[#701525] text-white hover:bg-[#58101d]"
                >
                  Confirm Sign-Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
