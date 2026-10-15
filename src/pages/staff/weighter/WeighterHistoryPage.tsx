import React from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { formatCurrency, formatDateTime, formatGrams } from '../../../utils/formatters';
import { History, Scale, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WeighterHistoryPage: React.FC = () => {
  const { assessments, applications } = useDemoData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#701525] font-display">
            Gold Appraisal Record History
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Historical digital appraisal log, locked versions, and net gold weight certifications.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden">
        {assessments.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Scale className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-xs text-gray-500">No assessments logged yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
                <tr>
                  <th className="py-3 px-4">Application Ref</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Gross Weight</th>
                  <th className="py-3 px-4">Deductions</th>
                  <th className="py-3 px-4">Net Gold Weight</th>
                  <th className="py-3 px-4">Purity</th>
                  <th className="py-3 px-4">Assessed Value</th>
                  <th className="py-3 px-4">Appraiser ID</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assessments.map((a) => {
                  const active = a.versions[a.activeVersion - 1] || a.versions[0];
                  return (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#701525]">
                        {a.applicationReference}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-700">
                        v{active.version} ({a.versions.length} total)
                      </td>
                      <td className="py-3 px-4 text-gray-800">
                        {formatGrams(active.grossWeight)}
                      </td>
                      <td className="py-3 px-4 text-rose-700 font-medium">
                        -{formatGrams((active.stoneWeight || 0) + (active.otherNonGoldWeight || 0))}
                      </td>
                      <td className="py-3 px-4 font-black text-gray-900">
                        {formatGrams(active.netGoldWeight)}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#701525]">
                        {active.purity}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-800">
                        {formatCurrency(active.estimatedGoldValue)}
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                        {active.recordedBy}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/staff/weighter/assessment/${a.applicationReference}`}
                          className="font-bold text-[#701525] hover:underline"
                        >
                          View Form
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
