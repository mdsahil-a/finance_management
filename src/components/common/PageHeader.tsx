import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
  to?: string;
}

interface MetricPill {
  label: string;
  value: string | number;
  subtext?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
  actions?: React.ReactNode;
  metrics?: MetricPill[];
  badge?: string | { label: string; color?: string };
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  action,
  actions,
  metrics,
  badge,
}) => {
  const effectiveAction = action || actions;
  const badgeLabel = typeof badge === 'object' ? badge.label : badge;
  const badgeClass = typeof badge === 'object' && badge.color ? badge.color : 'bg-amber-100 text-amber-900 border border-amber-200';

  return (
    <div className="space-y-4 mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-zinc-400">
          {breadcrumbs.map((b, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            const targetLink = b.href || b.to;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />}
                {targetLink && !isLast ? (
                  <Link
                    to={targetLink}
                    className="hover:text-zinc-800 transition-colors font-medium"
                  >
                    {b.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-zinc-900 font-semibold' : 'font-medium'}>
                    {b.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Main Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight font-heading">
              {title}
            </h1>
            {badgeLabel && (
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badgeClass}`}>
                {badgeLabel}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Primary Action Button */}
        {effectiveAction && (
          <div className="shrink-0 flex items-center gap-2">
            {effectiveAction}
          </div>
        )}
      </div>

      {/* Summary Metrics Row (Only when useful) */}
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-white border border-zinc-200/80 rounded-2xl p-3.5 shadow-xs"
            >
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                {m.label}
              </span>
              <span className="text-base sm:text-lg font-extrabold text-zinc-900 block mt-0.5 tracking-tight">
                {m.value}
              </span>
              {m.subtext && (
                <span className="text-[10px] text-zinc-500 mt-0.5 block truncate">
                  {m.subtext}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
