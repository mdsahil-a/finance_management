import React, { useState } from 'react';
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
  UserCheck,
  Menu,
  X
} from 'lucide-react';

export const AppNavbar: React.FC = () => {
  const { loans, staffUsers } = useFinance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      badgeColor: 'bg-emerald-500 text-white',
    },
    {
      to: '/safe',
      label: 'Gold in Safe',
      icon: ShieldCheck,
      badge: safeItemsCount > 0 ? safeItemsCount : null,
      badgeColor: 'bg-zinc-700 text-white',
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
      badgeColor: 'bg-zinc-700 text-white',
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <nav className="bg-transparent sticky top-18 z-20 py-2.5 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop Centered Floating Nav Pills Container */}
        <div className="flex items-center justify-between">
          <div className="flex items-center p-1 bg-zinc-100/90 backdrop-blur-md border border-zinc-200/80 rounded-full shadow-xs overflow-x-auto scrollbar-none gap-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                    <span>{item.label}</span>
                    {item.badge !== null && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-zinc-800 text-white'
                            : item.badgeColor || 'bg-zinc-200 text-zinc-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-full shrink-0 ml-2 shadow-xs cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu if toggled */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200 shadow-lg space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-zinc-950 text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        )}

      </div>
    </nav>
  );
};
