import React from 'react';
import { NavLink } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  ShieldCheck,
  BookOpen,
  BarChart3,
  UserCheck,
  Settings,
  Scale,
  CheckSquare,
  Receipt,
  CreditCard,
  History,
  PhoneCall,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Coins,
  Shield,
  FileCheck,
} from 'lucide-react';
import { AppRole } from '../../types/finance';

interface NavItemConfig {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | null;
  badgeColor?: string;
}

export const AppSidebar: React.FC = () => {
  const {
    currentRole,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    loans,
    approvals,
    appraisals,
    currentStaff,
    currentCustomer,
    setIsProfileModalOpen,
  } = useFinance();

  const activeLoansCount = loans.filter((l) => l.status === 'Active' || l.status === 'Due Soon' || l.status === 'Overdue').length;
  const safeItemsCount = loans.filter((l) => l.safeStatus === 'In Safe').length;
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'PENDING').length;
  const pendingAppraisalsCount = appraisals.filter((a) => a.status === 'PENDING_SANCTION').length;

  // Role-specific navigation items
  const getNavItems = (role: AppRole): NavItemConfig[] => {
    switch (role) {
      case 'ADMIN':
        return [
          { to: '/', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/branches', label: 'Branches', icon: Building2 },
          { to: '/customers', label: 'Customers', icon: Users },
          { to: '/loans', label: 'Loans', icon: FileText, badge: activeLoansCount },
          { to: '/safe', label: 'Gold Inventory / Safe', icon: ShieldCheck, badge: safeItemsCount },
          { to: '/daybook', label: 'Payments & Collections', icon: BookOpen },
          { to: '/reports', label: 'Reports', icon: BarChart3 },
          { to: '/staff', label: 'Staff & Users', icon: UserCheck },
          { to: '/settings', label: 'Settings', icon: Settings },
        ];

      case 'BRANCH_MANAGER':
        return [
          { to: '/', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/customers', label: 'Customers', icon: Users },
          { to: '/loans', label: 'Loans', icon: FileText, badge: activeLoansCount },
          { to: '/safe', label: 'Gold Inventory', icon: ShieldCheck, badge: safeItemsCount },
          { to: '/daybook', label: 'Collections', icon: BookOpen },
          { to: '/appraisals', label: 'Appraisals', icon: FileCheck, badge: pendingAppraisalsCount, badgeColor: 'bg-amber-600 text-white' },
          { to: '/approvals', label: 'Approvals', icon: CheckSquare, badge: pendingApprovalsCount, badgeColor: 'bg-rose-600 text-white' },
          { to: '/reports', label: 'Branch Reports', icon: BarChart3 },
        ];

      case 'APPRAISER':
        return [
          { to: '/', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/calculator', label: 'New Appraisal', icon: Scale },
          { to: '/appraisals', label: 'Appraisal Queue', icon: CheckSquare, badge: pendingAppraisalsCount, badgeColor: 'bg-amber-600 text-white' },
          { to: '/customers', label: 'Customers', icon: Users },
          { to: '/safe', label: 'Gold Inventory', icon: ShieldCheck },
          { to: '/appraisals', label: 'Appraisal History', icon: History },
        ];

      case 'CASHIER':
        return [
          { to: '/', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/customers', label: 'Customers', icon: Users },
          { to: '/loans', label: 'Loan Payments', icon: CreditCard },
          { to: '/daybook', label: 'Collections', icon: BookOpen },
          { to: '/receipts', label: 'Receipts', icon: Receipt },
          { to: '/daybook', label: 'Day Book / Cash Book', icon: Coins },
        ];

      case 'CUSTOMER':
        return [
          { to: '/', label: 'My Dashboard', icon: LayoutDashboard },
          { to: '/my-loans', label: 'My Loans', icon: FileText, badge: 1 },
          { to: '/my-payments', label: 'Payment History', icon: History },
          { to: '/my-gold', label: 'My Gold / Pledged Items', icon: ShieldCheck },
          { to: '/my-statements', label: 'Statements & Receipts', icon: Receipt },
          { to: '/my-profile', label: 'My Profile', icon: User },
          { to: '/my-help', label: 'Help / Contact Branch', icon: PhoneCall },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems(currentRole);
  const currentDisplayName = currentRole === 'CUSTOMER' ? currentCustomer.name : currentStaff.name;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-zinc-200/80 text-zinc-900 select-none">
      
      {/* Brand Header */}
      <div className={`p-4 border-b border-zinc-100 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} gap-2 h-16 shrink-0`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 flex items-center justify-center shadow-xs shrink-0">
            {/* Muthoot / Gold Bar Emblem */}
            <div className="flex items-end gap-1 h-4">
              <div className="w-1.5 h-2 bg-amber-400 rounded-full"></div>
              <div className="w-1.5 h-3 bg-amber-500 rounded-full"></div>
              <div className="w-1.5 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <span className="text-sm font-extrabold text-zinc-950 tracking-tight block leading-tight font-heading truncate">
                Aurum Gold
              </span>
              <span className="text-[10px] font-bold text-amber-700 tracking-wider uppercase block">
                Finance Management
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 scrollbar-none">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={() => setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              `group flex items-center ${
                isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'
              } py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
              }`
            }
            title={isSidebarCollapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-amber-400' : 'text-zinc-400 group-hover:text-zinc-700'
                    }`}
                  />
                  {!isSidebarCollapsed && (
                    <span className="truncate tracking-tight font-medium">{item.label}</span>
                  )}
                </div>

                {!isSidebarCollapsed && item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-zinc-800 text-white'
                        : item.badgeColor || 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Safe Custody Note (Expanded only) */}
      {!isSidebarCollapsed && (
        <div className="p-3 mx-3 mb-2 bg-zinc-50 border border-zinc-200/70 rounded-xl text-[11px] text-zinc-600 shrink-0">
          <div className="flex items-center gap-1.5 text-zinc-900 font-bold mb-0.5">
            <Shield className="w-3.5 h-3.5 text-amber-700" />
            <span>Dual-Custody Safe</span>
          </div>
          <span className="text-[10px] text-zinc-500 block leading-tight">
            Vault Grade-A &middot; Biometric Logged
          </span>
        </div>
      )}

      {/* User Mini Profile & Collapse Toggle */}
      <div className="p-3 border-t border-zinc-100 flex items-center justify-between gap-2 shrink-0 bg-zinc-50/50">
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className={`flex items-center ${isSidebarCollapsed ? 'justify-center w-full' : 'gap-2.5 min-w-0'} text-left hover:opacity-80 transition-opacity cursor-pointer`}
          title="Click to view profile & designated role"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            {currentDisplayName.charAt(0)}
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <span className="text-xs font-bold text-zinc-900 block truncate">
                {currentDisplayName}
              </span>
              <span className="text-[10px] text-zinc-400 block truncate font-medium">
                View Account
              </span>
            </div>
          )}
        </button>

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="hidden md:flex p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/70 rounded-lg transition-colors cursor-pointer shrink-0"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sticky Left Sidebar */}
      <aside
        className={`hidden md:block sticky top-0 h-screen shrink-0 transition-all duration-200 z-30 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Off-Canvas Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer sheet */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
