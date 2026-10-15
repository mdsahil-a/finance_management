import React from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinalEntryCompletedPage: React.FC = () => {
  const { finalEntries, applications } = useDemoData();

  const completedEntries = finalEntries.filter((f) => f.status === 'Submitted');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#701525] font-display">
            Completed Final Entries Register
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Dossiers successfully verified by operator and dispatched to Super Admin for authorized review.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden">
        {completedEntries.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-xs text-gray-500">No completed final entries recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
                <tr>
                  <th className="py-3 px-4">Application Ref</th>
                  <th className="py-3 px-4">Proposed Loan</th>
                  <th className="py-3 px-4">Tenure</th>
                  <th className="py-3 px-4">Rate (%)</th>
                  <th className="py-3 px-4">Verified By Operator</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {completedEntries.map((fe) => (
                  <tr key={fe.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#701525]">
                      {fe.applicationReference}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {formatCurrency(fe.proposedLoanAmount)}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {fe.tenureMonths} Months
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-700">
                      {fe.annualInterestRate}% p.a.
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {fe.recordedByName} ({fe.recordedBy})
                    </td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                      {formatDateTime(fe.recordedAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/staff/final-entry/form/${fe.applicationReference}`}
                        className="font-bold text-[#701525] hover:underline"
                      >
                        Inspect Dossier
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
