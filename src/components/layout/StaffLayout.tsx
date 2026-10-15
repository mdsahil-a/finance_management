import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStaffSession } from '../../context/StaffSessionContext';
import { useDemoData } from '../../context/DemoDataContext';
import { Logo } from '../common/Logo';
import { canAccessRoute, ROLE_LABELS, ROLE_DEFAULT_ROUTES } from '../../utils/permissions';
import { 
  LayoutDashboard, 
  FileText, 
  Scale, 
  CheckSquare, 
  CreditCard, 
  Users, 
  Building2, 
  ClipboardList,
  BarChart3, 
  History, 
  Settings, 
  Bell, 
  LogOut, 
  ArrowLeft, 
  ShieldCheck, 
  RotateCcw,
  Receipt,
  Menu,
  X,
  UserCheck,
  Vault,
  ShieldAlert,
  Coins,
  SlidersHorizontal,
  FileCheck2,
  AlertTriangle,
  UserPlus
} from 'lucide-react';

export const StaffLayout: React.FC = () => {
  const { currentStaff, logoutStaff, loginStaff } = useStaffSession();
  const { notifications, markNotificationAsRead, staffUsers } = useDemoData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentStaff) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center p-6 text-center">
        <Logo size="lg" className="mb-6" />
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-[#E8E2D8] max-w-md w-full">
          <h2 className="text-xl font-bold text-[#701525] mb-2">Staff Authentication Required</h2>
          <p className="text-xs text-gray-600 mb-6">
            Please log into the internal Gold Loan Management System with one of the demo staff credentials.
          </p>
          <Link
            to="/staff/login"
            className="w-full inline-block py-2.5 px-4 rounded-xl font-bold text-white bg-[#701525] hover:bg-[#58101d] transition-colors"
          >
            Go to Staff Login
          </Link>
        </div>
      </div>
    );
  }

  if (!canAccessRoute(currentStaff.role, location.pathname)) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md w-full">
          <div className="w-12 h-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied (403)</h2>
          <p className="text-xs text-gray-600 mb-4">
            Your current role (<strong className="text-gray-900">{ROLE_LABELS[currentStaff.role]}</strong>) does not have operational permissions to access this screen.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(ROLE_DEFAULT_ROUTES[currentStaff.role])}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-bold text-white bg-[#701525] hover:bg-[#58101d]"
            >
              Back to My Dashboard
            </button>
            <Link
              to="/staff/login"
              className="py-2 px-3 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Switch Role
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const relevantNotifs = notifications.filter(
    n => !n.read && (n.targetRole === currentStaff.role || n.targetRole === 'ALL' || currentStaff.role === 'SUPER_ADMIN')
  );

  const getNavLinks = () => {
    switch (currentStaff.role) {
      case 'SUPER_ADMIN':
        return [
          { name: 'Dashboard Overview', path: '/staff/admin', icon: LayoutDashboard },
          { name: 'All Applications', path: '/staff/admin/applications', icon: FileText },
          { name: 'Staff Management', path: '/staff/admin/users', icon: Users },
          { name: 'Branch Management', path: '/staff/admin/branches', icon: Building2 },
          { name: 'Loan Schemes & Products', path: '/staff/admin/schemes', icon: Coins },
          { name: 'Gold Benchmark Rates', path: '/staff/admin/gold-rates', icon: Scale },
          { name: 'Workflow & Thresholds', path: '/staff/admin/workflow-config', icon: SlidersHorizontal },
          { name: 'Reports & Analytics', path: '/staff/admin/reports', icon: BarChart3 },
          { name: 'Operational Audit Trail', path: '/staff/admin/activity-logs', icon: History },
          { name: 'System Settings', path: '/staff/admin/settings', icon: Settings },
        ];
      case 'BRANCH_MANAGER':
        return [
          { name: 'Branch Dashboard', path: '/staff/branch-manager', icon: LayoutDashboard },
          { name: 'Approvals & Applications', path: '/staff/branch-manager/applications', icon: ClipboardList },
          { name: 'Cash Reconciliations', path: '/staff/branch-manager/reconciliations', icon: CheckSquare },
          { name: 'Overdue Facilities', path: '/staff/branch-manager/overdue', icon: AlertTriangle },
        ];
      case 'LOAN_OFFICER':
        return [
          { name: 'Officer Dashboard', path: '/staff/loan-officer', icon: LayoutDashboard },
          { name: 'Customer Directory & KYC', path: '/staff/loan-officer/customers', icon: Users },
          { name: 'New Loan Application', path: '/staff/loan-officer/new-application', icon: UserPlus },
          { name: 'Loan Pipeline', path: '/staff/loan-officer/applications', icon: FileText },
        ];
      case 'GOLD_APPRAISER':
      case 'GOLD_WEIGHTER':
        return [
          { name: 'Appraisal Dashboard', path: '/staff/weighter', icon: LayoutDashboard },
          { name: 'Customer Application Entry', path: '/staff/weighter/apply', icon: FileText },
          { name: 'Appraisal Queue', path: '/staff/weighter/queue', icon: Scale },
          { name: 'Appraisal History', path: '/staff/weighter/history', icon: History },
        ];
      case 'CREDIT_OFFICER':
      case 'FINAL_ENTRY_OPERATOR':
        return [
          { name: 'Underwriting Dashboard', path: '/staff/final-entry', icon: LayoutDashboard },
          { name: 'Credit Review Queue', path: '/staff/final-entry/queue', icon: FileCheck2 },
          { name: 'Completed Sanctions', path: '/staff/final-entry/completed', icon: CheckSquare },
        ];
      case 'CASHIER':
        return [
          { name: 'Cashier Dashboard', path: '/staff/cashier', icon: LayoutDashboard },
          { name: 'Pending Disbursements', path: '/staff/cashier/pending', icon: CreditCard },
          { name: 'Record Disbursement', path: '/staff/cashier/disbursements', icon: CheckSquare },
          { name: 'Repayment Collection', path: '/staff/cashier/repayments', icon: RotateCcw },
          { name: 'Daily Cash Reconciliation', path: '/staff/cashier/reconciliation', icon: SlidersHorizontal },
          { name: 'Transaction History', path: '/staff/cashier/transactions', icon: History },
          { name: 'Receipts Repository', path: '/staff/cashier/receipts', icon: Receipt },
        ];
      case 'CUSTODY_OFFICER':
        return [
          { name: 'Vault Dashboard', path: '/staff/custody', icon: LayoutDashboard },
          { name: 'Pending Vault Deposits', path: '/staff/custody/pending', icon: Vault },
          { name: 'Strongroom Inventory', path: '/staff/custody/inventory', icon: ClipboardList },
          { name: 'Release & Handover', path: '/staff/custody/release', icon: CheckSquare },
        ];
      case 'AUDITOR':
        return [
          { name: 'Audit & Compliance Desk', path: '/staff/auditor', icon: LayoutDashboard },
          { name: 'Transactions Audit', path: '/staff/auditor/transactions', icon: History },
          { name: 'Compliance & Exceptions', path: '/staff/auditor/compliance', icon: ShieldAlert },
          { name: 'Cashier Till Audit', path: '/staff/auditor/reconciliations', icon: CheckSquare },
          { name: 'Audit Reports Export', path: '/staff/auditor/reports', icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const handleRoleQuickSwitch = (targetStaffId: string) => {
    const targetUser = staffUsers.find(s => s.id === targetStaffId);
    if (targetUser && targetUser.isActive) {
      loginStaff(targetUser);
      navigate(ROLE_DEFAULT_ROUTES[targetUser.role]);
    }
  };

  const allRolePills = [
    { id: 'ADMIN001', label: 'Admin', role: 'SUPER_ADMIN' },
    { id: 'BRANCH001', label: 'Manager', role: 'BRANCH_MANAGER' },
    { id: 'LOAN001', label: 'Loan Off.', role: 'LOAN_OFFICER' },
    { id: 'WEIGHT001', label: 'Appraiser', role: 'GOLD_APPRAISER' },
    { id: 'ENTRY001', label: 'Credit Off.', role: 'CREDIT_OFFICER' },
    { id: 'CASH001', label: 'Cashier', role: 'CASHIER' },
    { id: 'VAULT001', label: 'Custody', role: 'CUSTODY_OFFICER' },
    { id: 'AUDIT001', label: 'Auditor', role: 'AUDITOR' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F4EE] flex text-[#242424] font-sans">
      {/* Sidebar Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1f050b] text-[#FAF8F3] flex flex-col border-r border-[#C9A45C]/20 shadow-2xl transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Logo variant="light" size="sm" showTagline={false} linkTo={ROLE_DEFAULT_ROUTES[currentStaff.role]} />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Staff Badge */}
        <div className="p-4 mx-4 my-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C9A45C] text-[#701525] font-black text-sm flex items-center justify-center shrink-0 shadow-inner">
              {currentStaff.id.slice(0, 2)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{currentStaff.fullName}</h4>
              <p className="text-[10px] text-[#E9D6A6] font-mono tracking-wider">{currentStaff.id}</p>
              <span className="inline-block mt-0.5 text-[9px] font-semibold uppercase px-1.5 py-0.5 bg-[#A71930] text-white rounded">
                {ROLE_LABELS[currentStaff.role]}
              </span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-300">
            <span className="truncate">{currentStaff.branchName}</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Active
            </span>
          </div>
        </div>

        {/* Role Navigation */}
        <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Operations Menu
          </p>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === ROLE_DEFAULT_ROUTES[currentStaff.role]}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#C9A45C] text-[#58101d] font-bold shadow-sm'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Role Switcher */}
        <div className="p-3 border-t border-white/10 bg-black/20">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#C9A45C] mb-2 flex items-center gap-1">
            <UserCheck className="w-3 h-3" />
            <span>Fast Role Switcher (8 Roles)</span>
          </p>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            {allRolePills.map((pill) => {
              const isCurrent = currentStaff.role === pill.role || 
                (pill.role === 'GOLD_APPRAISER' && currentStaff.role === 'GOLD_WEIGHTER') ||
                (pill.role === 'CREDIT_OFFICER' && currentStaff.role === 'FINAL_ENTRY_OPERATOR');
              return (
                <button
                  key={pill.id}
                  onClick={() => handleRoleQuickSwitch(pill.id)}
                  className={`p-1.5 rounded border text-left truncate transition-colors ${
                    isCurrent
                      ? 'bg-[#C9A45C]/30 text-white border-[#C9A45C] font-bold'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>
          <button
            onClick={() => {
              logoutStaff();
              navigate('/staff/login');
            }}
            className="flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Operational Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E2D8] px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-gray-600 hover:text-gray-900 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-semibold text-[#701525]">Staff Console</span>
                <span>/</span>
                <span className="text-gray-800 font-bold">{ROLE_LABELS[currentStaff.role]}</span>
              </div>
            </div>
          </div>

          {/* Quick Role Switcher Pills on Top */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 hidden md:inline">
              Switch Role:
            </span>
            <div className="flex items-center gap-1">
              {allRolePills.map((pill) => {
                const isCurrent = currentStaff.role === pill.role || 
                  (pill.role === 'GOLD_APPRAISER' && currentStaff.role === 'GOLD_WEIGHTER') ||
                  (pill.role === 'CREDIT_OFFICER' && currentStaff.role === 'FINAL_ENTRY_OPERATOR');
                return (
                  <button
                    key={pill.id}
                    onClick={() => handleRoleQuickSwitch(pill.id)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all shrink-0 ${
                      isCurrent
                        ? 'bg-[#701525] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Notifications Popover */}
            <div className="relative pl-2 border-l border-gray-200">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                {relevantNotifs.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#A71930] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {relevantNotifs.length}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E8E2D8] p-4 z-50">
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <h5 className="text-xs font-bold text-gray-800">Operational Alerts</h5>
                    <span className="text-[10px] text-gray-500">{relevantNotifs.length} unread</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {relevantNotifs.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">No unread notifications.</p>
                    ) : (
                      relevantNotifs.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.link) navigate(n.link);
                            setNotifDropdownOpen(false);
                          }}
                          className="p-2.5 rounded-lg bg-amber-50/50 hover:bg-amber-100/60 cursor-pointer border border-amber-100 text-xs transition-colors"
                        >
                          <p className="font-bold text-[#701525]">{n.title}</p>
                          <p className="text-[11px] text-gray-600 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Staff info avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-7 h-7 rounded-full bg-[#701525] text-[#FFE082] text-xs font-black flex items-center justify-center shrink-0">
                {currentStaff.fullName.charAt(0)}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-bold text-gray-900 leading-tight truncate max-w-[100px]">{currentStaff.fullName.split(' ')[0]}</p>
                <p className="text-[10px] text-gray-500 leading-none">{currentStaff.id}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Routed Outlet */}
        <main className="flex-1 p-5 sm:p-7 lg:p-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
