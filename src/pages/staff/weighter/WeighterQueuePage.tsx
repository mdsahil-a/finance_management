import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDemoData } from '../../../context/DemoDataContext';
import DocumentPreview from '../../../components/DocumentPreview';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency, formatDateTime, formatGrams } from '../../../utils/formatters';
import { Scale, Search, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export const WeighterQueuePage: React.FC = () => {
  const { applications, branches } = useDemoData();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);

  // Queue consists of applications that need physical appraisal
  const queueApps = applications.filter(
    (a) =>
      a.status === 'Submitted' ||
      a.status === 'Awaiting Gold Assessment' ||
      a.status === 'Assessment Draft' ||
      a.status === 'Returned for Gold Correction'
  );

  const filteredQueue = queueApps.filter(
    (a) =>
      a.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.customer.mobile.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.customer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.goldDetails.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#701525] font-display">
            Physical Gold Assessment Queue
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Pending jewellery packages awaiting digital weighment, stone deduction, and hallmarked karat inspection.
          </p>
        </div>
        <span className="text-xs font-bold bg-[#FAF3E0] text-[#701525] px-3 py-1.5 rounded-xl border border-[#E8E2D8] self-start sm:self-auto">
          {queueApps.length} Files Pending Weighing
        </span>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference, customer, phone, email, city, or jewellery..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
          />
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden">
        {filteredQueue.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Scale className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-xs text-gray-500">No applications currently pending physical weighing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
                <tr>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Borrower Name</th>
                  <th className="py-3 px-4">Declared Package</th>
                  <th className="py-3 px-4">Declared Weight</th>
                  <th className="py-3 px-4">Declared Purity</th>
                  <th className="py-3 px-4">Queue Status</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4 text-right">Appraisal Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredQueue.map((app) => (
                  <React.Fragment key={app.id}>
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#701525]">
                      {app.reference}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900">{app.customer.fullName}</p>
                      <p className="text-[10px] text-gray-400">{app.customer.city}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {app.goldDetails.itemsCount} {app.goldDetails.category}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {formatGrams(app.goldDetails.declaredWeight)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#701525]">
                      {app.goldDetails.purity}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => setExpandedApplication((current) => current === app.id ? null : app.id)}
                        aria-expanded={expandedApplication === app.id}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#701525] hover:underline"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {expandedApplication === app.id ? 'Hide Details' : 'View Details'}
                        {expandedApplication === app.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/staff/weighter/assessment/${app.reference}`}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-2xs inline-flex items-center gap-1.5"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>Perform Appraisal</span>
                      </Link>
                    </td>
                  </tr>
                  {expandedApplication === app.id && (
                    <tr key={`${app.id}-details`} className="bg-[#FAF8F3]">
                      <td colSpan={9} className="p-4 sm:p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                          <section className="space-y-1.5">
                            <h3 className="font-bold uppercase tracking-wide text-[#701525]">Customer & Application</h3>
                            <p><strong>Full name:</strong> {app.customer.fullName}</p>
                            <p><strong>Mobile:</strong> {app.customer.mobile}</p>
                            <p><strong>Email:</strong> {app.customer.email}</p>
                            <p><strong>Location:</strong> {app.customer.city}, {app.customer.state}</p>
                            <p><strong>Branch:</strong> {branches.find((branch) => branch.id === app.assignedBranchId)?.name || app.assignedBranchId}</p>
                            <p><strong>Submitted:</strong> {formatDateTime(app.createdAt)}</p>
                            <p><strong>Last updated:</strong> {formatDateTime(app.updatedAt)}</p>
                            <p><strong>Current stage:</strong> {app.currentStage}</p>
                            {app.latestActivity && <p><strong>Latest activity:</strong> {app.latestActivity}</p>}
                            {app.notes && <p><strong>Application notes:</strong> {app.notes}</p>}
                          </section>

                          <section className="space-y-1.5">
                            <h3 className="font-bold uppercase tracking-wide text-[#701525]">Jewellery & Loan Request</h3>
                            <p><strong>Category:</strong> {app.goldDetails.category}</p>
                            <p><strong>Item count:</strong> {app.goldDetails.itemsCount}</p>
                            <p><strong>Declared weight:</strong> {formatGrams(app.goldDetails.declaredWeight)}</p>
                            <p><strong>Declared purity:</strong> {app.goldDetails.purity}</p>
                            <p><strong>Purpose:</strong> {app.goldDetails.purpose}</p>
                            <p><strong>Estimated gold value:</strong> {formatCurrency(app.goldDetails.approximateValue || 0)}</p>
                            <p><strong>Requested loan:</strong> {formatCurrency(app.loanPreferences.requestedAmount)}</p>
                            <p><strong>Tenure:</strong> {app.loanPreferences.preferredTenureMonths} months · {app.loanPreferences.repaymentMethod}</p>
                          </section>

                          <section className="space-y-2">
                            <h3 className="font-bold uppercase tracking-wide text-[#701525]">Uploaded Proofs & Jewellery Photo</h3>
                            <p><strong>ID proof:</strong> {app.documents?.idProofType || 'Not provided'} · {app.documents?.idProofNumberMasked || 'Number not provided'}</p>
                            <p><strong>Address proof:</strong> {app.documents?.addressProofType || 'Not provided'}</p>
                            <div className="grid grid-cols-3 gap-2 pt-1">
                              {[
                                { label: 'Jewellery', src: app.documents?.jewelleryPictureUrl, name: app.documents?.jewelleryPictureFileName, size: app.documents?.jewelleryPictureFileSize },
                                { label: app.documents?.idProofType || 'ID Proof', src: app.documents?.idProofFileUrl, name: app.documents?.idProofFileName, size: app.documents?.idProofFileSize },
                                { label: app.documents?.addressProofType || 'Address', src: app.documents?.addressProofFileUrl, name: app.documents?.addressProofFileName, size: app.documents?.addressProofFileSize },
                              ].map((document) => (
                                <div key={document.label} className="min-w-0 text-center">
                                  {document.src ? (
                                    <DocumentPreview src={document.src} alt={document.label} fileName={document.name} className="h-20 overflow-hidden rounded-lg border border-gray-200 bg-white" />
                                  ) : (
                                    <div className="h-20 rounded-lg border border-dashed border-gray-300 bg-white flex items-center justify-center text-[9px] text-gray-400">Not uploaded</div>
                                  )}
                                  <p className="mt-1 text-[9px] text-gray-600 truncate" title={document.name || document.label}>{document.name || document.label}</p>
                                  {document.size && <p className="text-[9px] text-gray-400">{document.size}</p>}
                                </div>
                              ))}
                            </div>
                            {app.documents?.uploadedAt && (
                              <p className="text-[9px] text-gray-500">Documents received: {formatDateTime(app.documents.uploadedAt)}</p>
                            )}
                          </section>
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
