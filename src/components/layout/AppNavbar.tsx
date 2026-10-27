import React from 'react';
import { NavLink } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  Users,
  BookOpen,
  Calculator,
  Settings,
  UserCheck
} from 'lucide-react';

export const AppNavbar: React.FC = () => {
  const { loans, staffUsers } = useFinance();

  const activeLoansCount = loans.filter((l) => l.status === 'Active' || l.status === 'Due Soon' || l.status === 'Overdue').length;
  const safeItemsCount = loans.filter((l) => l.safeStatus === 'In Safe').length;

  const navItems = [
    {
      to: '/',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/loans',
      label: 'All Loans',
      icon: FileText,
      badge: activeLoansCount > 0 ? activeLoansCount : null,
      badgeColor: 'bg-amber-500 text-slate-950',
    },
    {
      to: '/safe',
      label: 'Gold in Safe',
      icon: ShieldCheck,
      badge: safeItemsCount > 0 ? safeItemsCount : null,
      badgeColor: 'bg-slate-700 text-slate-200',
    },
    {
      to: '/customers',
      label: 'Customers',
      icon: Users,
      badge: null,
    },
    {
      to: '/daybook',
      label: 'Day Book (Cash)',
      icon: BookOpen,
      badge: null,
    },
    {
      to: '/calculator',
      label: 'Gold Calculator',
      icon: Calculator,
      badge: null,
    },
    {
      to: '/staff',
      label: 'Staff & Team',
      icon: UserCheck,
      badge: staffUsers.length > 0 ? staffUsers.length : null,
      badgeColor: 'bg-slate-700 text-slate-300',
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <nav className="bg-slate-800/90 backdrop-blur border-b border-slate-700/80 sticky top-16 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {item.badge !== null && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-700 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
