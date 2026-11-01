import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../../components/common/PageHeader';
import {
  X,
  Scale,
  CheckCircle2,
  Clock,
  Search,
  PlusCircle,
  Gem,
  Award,
  Layers,
  ChevronRight,
  Calculator,
} from 'lucide-react';
import { AppraisalRecord } from '../../types/finance';

export const AppraisalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { appraisals, settings, currentRole } = useFinance();
  const [search, setSearch] = useState('');
  const [selectedAppraisal, setSelectedAppraisal] = useState<AppraisalRecord | null>(null);

  const filteredAppraisals = appraisals.filter(
    (a) =>
      a.customerName.toLowerCase().includes(search.toLowerCase()) ||
      a.customerPhone.includes(search) ||
      a.ornaments.some((it) => it.name.toLowerCase().includes(search.toLowerCase()))
  );

  const pendingCount = appraisals.filter((a) => a.status === 'PENDING_SANCTION').length;
  const approvedCount = appraisals.filter((a) => a.status === 'SANCTIONED').length;
  const totalNetGrams = appraisals.reduce((sum, a) => sum + a.totalNetWeight, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <PageHeader
        title="Gold Appraisal & Assay Queue"
        subtitle="Hallmark verification, stone deduction records, and official valuation certificates."
        badge={{ label: 'BIS Hallmark Station', color: 'bg-amber-100 text-amber-900 border border-amber-200' }}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Appraisals' },
        ]}
        actions={
          <button
            onClick={() => navigate('/calculator')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>New Assay / Appraisal</span>
          </button>
        }
      />

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Queue Awaiting Sanction</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono">
            {pendingCount} appraisals
          </div>
          <span className="text-xs text-zinc-500 mt-1 block">Ready for loan agreement</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Certified Appraisals</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {approvedCount} packets
          </div>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">Vault custody assigned</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Net Gold Tested</span>
            <Scale className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-zinc-950 font-mono">
            {totalNetGrams.toFixed(2)} grams
          </div>
          <span className="text-xs text-zinc-500 mt-1 block">Net pure gold weight</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs space-y-4 w-full max-w-full min-w-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search customer, phone, ornament..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-amber-600 rounded-xl text-xs text-zinc-900 outline-none"
            />
          </div>
          <span className="text-xs font-bold text-zinc-500">
            Showing {filteredAppraisals.length} valuation certificates
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-600 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Appraised Ornaments</th>
                <th className="py-2.5 px-3 text-right">Gross Wt.</th>
                <th className="py-2.5 px-3 text-right">Net Gold Wt.</th>
                <th className="py-2.5 px-3 text-center">Purity</th>
                <th className="py-2.5 px-3 text-right">Market Value</th>
                <th className="py-2.5 px-3 text-right">75% Loan Limit</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredAppraisals.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedAppraisal(item)}
                  className="hover:bg-amber-50/30 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3 font-mono text-zinc-500">{item.date}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-zinc-950 block">{item.customerName}</span>
                    <span className="text-[10px] text-zinc-400">{item.customerPhone}</span>
                  </td>
                  <td className="py-3 px-3 text-zinc-700">
                    {item.ornaments.map((it, idx) => (
                      <span key={idx} className="block font-medium truncate max-w-[150px]">
                        {it.name}
                      </span>
                    ))}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-zinc-500">
                    {item.totalGrossWeight.toFixed(2)} g
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-amber-800">
                    {item.totalNetWeight.toFixed(2)} g
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {item.ornaments[0]?.purity || '22K'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-zinc-900">
                    ₹{item.totalValuation.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-emerald-700">
                    ₹{item.maxSanctionEligible.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === 'SANCTIONED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Certificate Modal */}
      {selectedAppraisal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 animate-in fade-in-50 zoom-in-95 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="font-bold text-base text-zinc-950 font-heading">Official Valuation Certificate</h3>
                <span className="text-xs font-mono text-zinc-500">{selectedAppraisal.id} &middot; Tested on {selectedAppraisal.date}</span>
              </div>
              <button
                onClick={() => setSelectedAppraisal(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-700">
              <p><strong>Customer:</strong> {selectedAppraisal.customerName} ({selectedAppraisal.customerPhone})</p>
              <p><strong>Testing Appraiser:</strong> {selectedAppraisal.appraisedBy}</p>
              {selectedAppraisal.notes && <p><strong>Assay Remarks:</strong> {selectedAppraisal.notes}</p>}

              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1.5">
                <span className="font-bold text-zinc-900 block">Weight & Purity Analysis:</span>
                <div className="grid grid-cols-2 gap-2 text-center pt-1 font-mono">
                  <div className="bg-white p-2 rounded-lg border border-zinc-100">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Gross Weight</span>
                    <span className="font-bold text-zinc-900">{selectedAppraisal.totalGrossWeight} g</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-zinc-100">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Net Pure Weight</span>
                    <span className="font-black text-amber-800">{selectedAppraisal.totalNetWeight} g</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-[10px] text-amber-900 uppercase font-bold block">Market Valuation</span>
                  <span className="text-base font-black text-zinc-950 font-mono">
                    ₹{selectedAppraisal.totalValuation.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] text-emerald-900 uppercase font-bold block">Eligible Loan (75% LTV)</span>
                  <span className="text-base font-black text-emerald-700 font-mono">
                    ₹{selectedAppraisal.maxSanctionEligible.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAppraisal(null)}
                className="px-4 py-2 bg-zinc-950 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
