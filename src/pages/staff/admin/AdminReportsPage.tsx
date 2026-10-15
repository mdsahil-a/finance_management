import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { formatCurrency, formatGrams, formatDateTime } from '../../../utils/formatters';
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar, 
  Building2, 
  Scale, 
  CreditCard, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { applications, assessments, transactions, loans, branches, staffUsers } = useDemoData();

  const [selectedBranchId, setSelectedBranchId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Filter applications by branch and status
  const filteredApps = applications.filter((app) => {
    const matchesBranch = selectedBranchId === 'ALL' || app.assignedBranchId === selectedBranchId;
    const matchesStatus = selectedStatus === 'ALL' || app.status === selectedStatus;
    return matchesBranch && matchesStatus;
  });

  // Calculate live aggregates
  const completedAssessmentsCount = assessments.reduce(
    (acc, a) => acc + a.versions.filter((v) => v.status === 'Submitted').length,
    0
  );

  const totalAssessedNetWeight = assessments.reduce((acc, a) => {
    const active = a.versions[a.activeVersion - 1] || a.versions[0];
    return acc + (active?.netGoldWeight || 0);
  }, 0);

  const totalAssessedGoldValue = assessments.reduce((acc, a) => {
    const active = a.versions[a.activeVersion - 1] || a.versions[0];
    return acc + (active?.estimatedGoldValue || 0);
  }, 0);

  const totalDisbursedAmount = transactions
    .filter((t) => t.type === 'Disbursement')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalRepaidAmount = transactions
    .filter((t) => t.type === 'Repayment')
    .reduce((acc, t) => acc + t.amount, 0);

  const outstandingBalance = loans.reduce((acc, l) => acc + l.remainingBalance, 0);

  // CSV Export
  const exportApplicationsCSV = () => {
    const headers = [
      'Reference',
      'Customer_Name',
      'Mobile',
      'City',
      'Gold_Category',
      'Items_Count',
      'Weight_Grams',
      'Purity',
      'Requested_Amount_INR',
      'Status',
      'Branch_ID',
      'Created_At',
    ];

    const rows = filteredApps.map((a) => [
      `"${a.reference}"`,
      `"${a.customer.fullName}"`,
      `"${a.customer.mobile}"`,
      `"${a.customer.city}"`,
      `"${a.goldDetails.category}"`,
      a.goldDetails.itemsCount,
      a.goldDetails.declaredWeight,
      `"${a.goldDetails.purity}"`,
      a.loanPreferences.requestedAmount,
      `"${a.status}"`,
      `"${a.assignedBranchId}"`,
      `"${a.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aurum_gold_applications_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#701525] font-display">
            Operational Analytics & Executive Reports
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Aggregated metrics calculated dynamically from actual LocalStorage application and ledger records.
          </p>
        </div>

        <button
          onClick={exportApplicationsCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Filtered Applications (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
          <Filter className="w-4 h-4 text-[#701525]" />
          <span>Report Filters:</span>
        </div>

        <select
          value={selectedBranchId}
          onChange={(e) => setSelectedBranchId(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white text-gray-700 outline-none w-full sm:w-auto"
        >
          <option value="ALL">All Branches ({branches.length})</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.city})
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white text-gray-700 outline-none w-full sm:w-auto"
        >
          <option value="ALL">All Lifecycle Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Awaiting Gold Assessment">Awaiting Gold Assessment</option>
          <option value="Awaiting Final Entry">Awaiting Final Entry</option>
          <option value="Awaiting Authorized Review">Awaiting Authorized Review</option>
          <option value="Awaiting Demo Disbursement">Awaiting Demo Disbursement</option>
          <option value="Disbursed — Demo">Disbursed — Demo</option>
          <option value="Closed — Demo">Closed — Demo</option>
          <option value="Rejected — Demo">Rejected — Demo</option>
        </select>
      </div>

      {/* Analytics KPI Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Assessments Done</span>
          <span className="text-2xl font-black text-[#701525]">{completedAssessmentsCount}</span>
          <span className="text-[10px] text-gray-400 block">Logged by Weighter</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Net Gold Assessed</span>
          <span className="text-2xl font-black text-amber-700">{formatGrams(totalAssessedNetWeight)}</span>
          <span className="text-[10px] text-gray-400 block">Net pure content</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Total Gold Value</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700 truncate block">{formatCurrency(totalAssessedGoldValue)}</span>
          <span className="text-[10px] text-gray-400 block">Collateral valuation</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Disbursed Payout</span>
          <span className="text-xl sm:text-2xl font-black text-purple-700 truncate block">{formatCurrency(totalDisbursedAmount)}</span>
          <span className="text-[10px] text-gray-400 block">Executed by Cashier</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">Total Repaid</span>
          <span className="text-xl sm:text-2xl font-black text-teal-700 truncate block">{formatCurrency(totalRepaidAmount)}</span>
          <span className="text-[10px] text-gray-400 block">Collections received</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Outstanding Book</span>
          <span className="text-xl sm:text-2xl font-black text-rose-700 truncate block">{formatCurrency(outstandingBalance)}</span>
          <span className="text-[10px] text-gray-400 block">Active receivables</span>
        </div>
      </div>

      {/* Aggregate Breakdowns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900">Application Pipeline Status Distribution</h3>
          <div className="space-y-2 text-xs">
            {[
              'Awaiting Gold Assessment',
              'Awaiting Final Entry',
              'Awaiting Authorized Review',
              'Awaiting Demo Disbursement',
              'Disbursed — Demo',
              'Closed — Demo',
              'Returned for Gold Correction',
              'Rejected — Demo',
            ].map((st) => {
              const count = applications.filter((a) => a.status === st).length;
              const percent = applications.length > 0 ? Math.round((count / applications.length) * 100) : 0;
              return (
                <div key={st} className="space-y-1">
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">{st}</span>
                    <span className="font-bold">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#701525] h-full rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Branch Load Distribution */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900">Branch Operational Load</h3>
          <div className="space-y-3 text-xs">
            {branches.map((b) => {
              const count = applications.filter((a) => a.assignedBranchId === b.id).length;
              return (
                <div key={b.id} className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block">{b.name}</span>
                    <span className="text-[10px] text-gray-500">{b.city}, {b.state}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#701525]">{count} Files</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
