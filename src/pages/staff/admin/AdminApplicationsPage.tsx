import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { useStaffSession } from '../../../context/StaffSessionContext';
import { CustomerApplication } from '../../../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency, formatDateTime, formatGrams } from '../../../utils/formatters';
import DocumentPreview from '../../../components/DocumentPreview';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Scale, 
  FileText, 
  ShieldCheck, 
  Eye, 
  ArrowRight,
  X,
  ImageIcon
} from 'lucide-react';

export const AdminApplicationsPage: React.FC = () => {
  const { applications, assessments, finalEntries, recordAuthorizedDecision } = useDemoData();
  const { currentStaff } = useStaffSession();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [reviewModalApp, setReviewModalApp] = useState<CustomerApplication | null>(null);

  // Decision Modal form state
  const [decision, setDecision] = useState<'Approved' | 'Rejected'>('Approved');
  const [sanctionedAmount, setSanctionedAmount] = useState<number>(150000);
  const [decisionNotes, setDecisionNotes] = useState('Sanction authorized based on physical gold appraisal and complete operator KYC review.');
  const [submittingDecision, setSubmittingDecision] = useState(false);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.goldDetails.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openDecisionModal = (app: CustomerApplication) => {
    setReviewModalApp(app);
    setDecision('Approved');
    setSanctionedAmount(app.loanPreferences.requestedAmount);
    setDecisionNotes('Sanction authorized based on physical gold appraisal and complete operator KYC review.');
  };

  const handleRecordDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalApp || !currentStaff) return;

    setSubmittingDecision(true);
    try {
      recordAuthorizedDecision(
        reviewModalApp.reference,
        decision,
        sanctionedAmount,
        decisionNotes,
        currentStaff
      );
      setReviewModalApp(null);
    } catch (err) {
      console.error(err);
      alert('Error recording decision');
    } finally {
      setSubmittingDecision(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#701525] font-display">
            Application Pipeline & Sanction Oversight
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Super Admin master register across all branch gold loan files.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference, borrower name, or ornament..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white text-gray-700 outline-none"
          >
            <option value="ALL">All Statuses ({applications.length})</option>
            <option value="Awaiting Authorized Review">Awaiting Review (Action Required)</option>
            <option value="Awaiting Gold Assessment">Awaiting Gold Assessment</option>
            <option value="Awaiting Final Entry">Awaiting Final Entry</option>
            <option value="Awaiting Demo Disbursement">Awaiting Demo Disbursement</option>
            <option value="Disbursed — Demo">Disbursed — Demo</option>
            <option value="Closed — Demo">Closed — Demo</option>
            <option value="Rejected — Demo">Rejected — Demo</option>
          </select>
        </div>
      </div>

      {/* Applications Master Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Pledged Gold</th>
                <th className="py-3 px-4">Requested / Est.</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Logged</th>
                <th className="py-3 px-4 text-right">Super Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.map((app) => {
                const isReadyForAdminDecision = app.status === 'Awaiting Authorized Review';
                return (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#701525]">
                      {app.reference}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900">{app.customer.fullName}</p>
                      <p className="text-[10px] text-gray-400">{app.customer.mobile}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {app.goldDetails.itemsCount} {app.goldDetails.category} ({app.goldDetails.declaredWeight}g {app.goldDetails.purity})
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-900 block">
                        {formatCurrency(app.loanPreferences.requestedAmount)}
                      </span>
                      {app.goldDetails.approximateValue && (
                        <span className="text-[10px] text-gray-400 block">
                          Valued: {formatCurrency(app.goldDetails.approximateValue)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-[10px]">
                      {formatDateTime(app.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isReadyForAdminDecision ? (
                        <button
                          onClick={() => openDecisionModal(app)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#A71930] text-white hover:bg-[#701525] shadow-xs inline-flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Record Decision</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => openDecisionModal(app)}
                          className="text-[#701525] font-bold hover:underline"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Super Admin Decision Modal */}
      {reviewModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-[#E8E2D8] overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#FAF8F3]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#701525]" />
                <h3 className="font-bold text-sm text-[#701525]">
                  Super Admin Decision Console: {reviewModalApp.reference}
                </h3>
              </div>
              <button onClick={() => setReviewModalApp(null)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordDecision} className="p-6 space-y-6 text-xs">
              {/* Applicant & Gold Dossier Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div>
                  <span className="text-gray-400 block text-[10px]">Borrower</span>
                  <span className="font-bold text-gray-900">{reviewModalApp.customer.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Pledged Ornaments</span>
                  <span className="font-bold text-gray-900">
                    {reviewModalApp.goldDetails.itemsCount} {reviewModalApp.goldDetails.category} ({reviewModalApp.goldDetails.purity})
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Declared Weight</span>
                  <span className="font-bold text-gray-900">{formatGrams(reviewModalApp.goldDetails.declaredWeight)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Requested Loan</span>
                  <span className="font-bold text-[#701525]">{formatCurrency(reviewModalApp.loanPreferences.requestedAmount)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Tenure</span>
                  <span className="font-bold text-gray-900">{reviewModalApp.loanPreferences.preferredTenureMonths} Months</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Repayment Model</span>
                  <span className="font-bold text-gray-900">{reviewModalApp.loanPreferences.repaymentMethod}</span>
                </div>
              </div>

              {/* Document Thumbnails (if uploaded) */}
              {reviewModalApp.documents && (reviewModalApp.documents.jewelleryPictureUrl || reviewModalApp.documents.idProofFileUrl || reviewModalApp.documents.addressProofFileUrl) && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5 text-amber-600" />KYC Documents &amp; Jewellery Photos</p>
                  <div className="grid grid-cols-3 gap-2">
                    {reviewModalApp.documents.jewelleryPictureUrl && (
                      <div className="text-center">
                        <DocumentPreview src={reviewModalApp.documents.jewelleryPictureUrl} alt="Jewellery" fileName={reviewModalApp.documents.jewelleryPictureFileName} className="h-16 overflow-hidden rounded-lg border border-amber-300" />
                        <p className="text-[9px] text-amber-700 mt-0.5 font-bold">Jewellery Photo</p>
                      </div>
                    )}
                    {reviewModalApp.documents.idProofFileUrl && (
                      <div className="text-center">
                        <DocumentPreview src={reviewModalApp.documents.idProofFileUrl} alt="ID" fileName={reviewModalApp.documents.idProofFileName} className="h-16 overflow-hidden rounded-lg border border-blue-300" />
                        <p className="text-[9px] text-blue-700 mt-0.5 font-bold">{reviewModalApp.documents.idProofType}</p>
                      </div>
                    )}
                    {reviewModalApp.documents.addressProofFileUrl && (
                      <div className="text-center">
                        <DocumentPreview src={reviewModalApp.documents.addressProofFileUrl} alt="Address" fileName={reviewModalApp.documents.addressProofFileName} className="h-16 overflow-hidden rounded-lg border border-emerald-300" />
                        <p className="text-[9px] text-emerald-700 mt-0.5 font-bold">Address Proof</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Decision Toggle */}
              <div className="space-y-2">
                <label className="font-bold text-gray-700 uppercase tracking-wider text-[10px] block">
                  Executive Sanction Decision *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDecision('Approved')}
                    className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                      decision === 'Approved'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve — Demo (Sanction Loan)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision('Rejected')}
                    className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                      decision === 'Rejected'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject — Demo (Decline File)</span>
                  </button>
                </div>
              </div>

              {/* If Approved: Sanctioned Amount */}
              {decision === 'Approved' && (
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Authorized Sanction Amount (₹) *</label>
                  <input
                    type="number"
                    value={sanctionedAmount}
                    onChange={(e) => setSanctionedAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-sm text-emerald-800 outline-none focus:border-emerald-600"
                    required
                  />
                  <p className="text-[10px] text-gray-400">
                    This authorized amount will be dispatched directly to the Cashier queue for simulated disbursement.
                  </p>
                </div>
              )}

              {/* Decision Notes */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Audit Review Notes & Sanction Remarks *</label>
                <textarea
                  rows={3}
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="Enter explicit rationale for the audit record..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#701525] resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setReviewModalApp(null)}
                  className="px-4 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDecision}
                  className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-md transition-colors ${
                    decision === 'Approved' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-rose-700 hover:bg-rose-800'
                  }`}
                >
                  {submittingDecision ? 'Recording...' : `Confirm & Log ${decision} Decision`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
