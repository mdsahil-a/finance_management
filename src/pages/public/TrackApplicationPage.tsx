import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDemoData } from '../../context/DemoDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDateTime, formatGrams } from '../../utils/formatters';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  Scale, 
  ShieldCheck, 
  CreditCard,
  FileText,
  User,
  Printer
} from 'lucide-react';

export const TrackApplicationPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';
  const [searchInput, setSearchInput] = useState(initialRef);
  const [searchedRef, setSearchedRef] = useState(initialRef);
  const { applications } = useDemoData();

  useEffect(() => {
    if (initialRef) {
      setSearchInput(initialRef);
      setSearchedRef(initialRef);
    }
  }, [initialRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchInput.trim().toUpperCase();
    setSearchedRef(clean);
    setSearchParams({ ref: clean });
  };

  const currentApp = applications.find(
    (a) => a.reference.toUpperCase() === searchedRef.toUpperCase()
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#A71930]">
          Live Operational Tracking
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#701525] font-display">
          Track Your Gold Loan Application
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
          Enter your unique application reference (e.g. AGF-2026-100001) to view the live multi-stage lifecycle and operational milestones.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-lg">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter reference number (e.g. AGF-2026-100001)"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-sm font-mono uppercase"
              required
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span>Track Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Sample Links */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-[11px] text-gray-500">
          <span className="font-semibold text-gray-700">Sample Live Demo Refs:</span>
          {applications.slice(0, 3).map((a) => (
            <button
              key={a.reference}
              type="button"
              onClick={() => {
                setSearchInput(a.reference);
                setSearchedRef(a.reference);
                setSearchParams({ ref: a.reference });
              }}
              className="font-mono text-[#701525] hover:underline bg-[#701525]/5 px-2 py-0.5 rounded border border-[#701525]/20"
            >
              {a.reference} ({a.status.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Area */}
      {searchedRef && !currentApp && (
        <div className="bg-white rounded-3xl p-10 text-center border border-red-200 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">Application Reference Not Found</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              No record matches reference <span className="font-mono font-bold text-red-700">{searchedRef}</span> in the shared database. Please verify the reference or contact your branch for assistance.
            </p>
          </div>
        </div>
      )}

      {currentApp && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2D8] shadow-xl space-y-8">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl sm:text-2xl font-black text-[#701525]">
                  {currentApp.reference}
                </span>
                <StatusBadge status={currentApp.status} size="md" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Submitted on {formatDateTime(currentApp.createdAt)} • Borrower: {currentApp.customer.fullName}
              </p>
            </div>

            <div className="text-right sm:self-auto self-start">
              <span className="text-[11px] text-gray-500 block">Requested Loan Amount</span>
              <span className="text-xl sm:text-2xl font-black text-gray-900">
                {formatCurrency(currentApp.loanPreferences.requestedAmount)}
              </span>
            </div>
          </div>

          {/* Current Stage Highlight */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
              Current Operational Stage
            </span>
            <p className="text-sm font-bold text-gray-900">
              {currentApp.currentStage}
            </p>
            {currentApp.latestActivity && (
              <p className="text-xs text-gray-600">
                Latest Activity: {currentApp.latestActivity}
              </p>
            )}
          </div>

          {/* Application Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-gray-500 block">Pledged Category</span>
              <span className="font-bold text-gray-900 mt-0.5 block">
                {currentApp.goldDetails.itemsCount} {currentApp.goldDetails.category}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-gray-500 block">Declared Weight & Purity</span>
              <span className="font-bold text-gray-900 mt-0.5 block">
                {formatGrams(currentApp.goldDetails.declaredWeight)} ({currentApp.goldDetails.purity})
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-gray-500 block">Preferred Tenure</span>
              <span className="font-bold text-gray-900 mt-0.5 block">
                {currentApp.loanPreferences.preferredTenureMonths} Months
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-gray-500 block">Servicing Method</span>
              <span className="font-bold text-gray-900 mt-0.5 block">
                {currentApp.loanPreferences.repaymentMethod}
              </span>
            </div>
          </div>

          {/* Workflow Timeline */}
          <div>
            <h4 className="text-sm font-bold text-[#701525] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C9A45C]" />
              <span>Audit-Logged Workflow Timeline</span>
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E2D8]">
              {currentApp.workflowHistory.map((event, index) => (
                <div key={event.id || index} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-[#701525] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#701525]" />
                  </div>

                  <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#E8E2D8] space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                      <span className="font-bold text-gray-900">{event.stageName}</span>
                      <span className="text-[11px] text-gray-500 font-mono">
                        {formatDateTime(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{event.description}</p>
                    <span className="text-[10px] text-gray-400 block">
                      Actor: {event.performedBy} ({event.performedByRole})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Print / View Slip Button */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <Link
              to={`/application/${currentApp.reference}`}
              className="text-xs font-bold text-[#701525] hover:underline"
            >
              Open Full Printable Dossier →
            </Link>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Status Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
