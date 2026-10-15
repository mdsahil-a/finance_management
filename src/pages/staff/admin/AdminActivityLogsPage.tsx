import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { formatDateTime } from '../../../utils/formatters';
import { History, Search, Filter, ShieldAlert, Download } from 'lucide-react';

export const AdminActivityLogsPage: React.FC = () => {
  const { activityLogs } = useDemoData();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.applicationReference && log.applicationReference.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || log.employeeRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#701525] font-display">
            Operational Audit Trail & Activity Logs
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Chronological audit log tracking every customer submission, physical weighing, operator check, sanction decision, and cashier transaction.
          </p>
        </div>
      </div>

      {/* Tamper Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>Audit Notice:</strong> These audit trail logs are generated in browser LocalStorage for executive prototype simulation. In production banking environments, audit logs are streamed to tamper-proof append-only compliance storage.
        </span>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by actor, application reference, or event..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white text-gray-700 outline-none w-full sm:w-auto"
        >
          <option value="ALL">All Roles</option>
          <option value="SUPER_ADMIN">Super Administrator</option>
          <option value="CASHIER">Cashier</option>
          <option value="GOLD_WEIGHTER">Gold Weighter</option>
          <option value="FINAL_ENTRY_OPERATOR">Final Entry Operator</option>
          <option value="BRANCH_MANAGER">Branch Manager</option>
          <option value="Customer">Customer</option>
        </select>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Employee / Actor</th>
                <th className="py-3 px-4">Event Classification</th>
                <th className="py-3 px-4">Related Reference</th>
                <th className="py-3 px-4">Action Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-gray-500">
                    {log.id}
                  </td>
                  <td className="py-3 px-4 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-gray-900">{log.employeeName}</p>
                    <p className="text-[10px] text-gray-400">{log.employeeRole}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF3E0] text-[#701525] border border-[#E8E2D8]">
                      {log.eventType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#701525]">
                    {log.applicationReference || '—'}
                  </td>
                  <td className="py-3 px-4 text-gray-700 leading-relaxed max-w-md">
                    {log.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
