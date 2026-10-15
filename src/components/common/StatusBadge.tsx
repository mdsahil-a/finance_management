import React from 'react';
import { ApplicationStatus } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const getBadgeStyle = (st: string) => {
    switch (st) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Awaiting Gold Assessment':
        return 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse-slow';
      case 'Assessment Draft':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Awaiting Final Entry':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Returned for Gold Correction':
        return 'bg-rose-50 text-rose-700 border-rose-300';
      case 'Final Entry Draft':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Awaiting Authorized Review':
        return 'bg-orange-50 text-orange-800 border-orange-300';
      case 'Approved — Demo':
      case 'Awaiting Demo Disbursement':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium';
      case 'Disbursed — Demo':
        return 'bg-[#701525]/10 text-[#701525] border-[#701525]/30 font-semibold';
      case 'Closed — Demo':
        return 'bg-teal-50 text-teal-800 border-teal-300';
      case 'Rejected — Demo':
        return 'bg-red-50 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs font-medium tracking-wide ${sizeClasses[size]} ${getBadgeStyle(
        status
      )} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
};
