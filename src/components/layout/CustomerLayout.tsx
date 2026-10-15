import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useCustomerSession } from '../../context/CustomerSessionContext';
import { useDemoData } from '../../context/DemoDataContext';
import { 
  LayoutDashboard, 
  FileText, 
  User, 
  Bell, 
  LogOut, 
  ArrowLeft,
  Sparkles,
  CreditCard
} from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const { currentCustomer, logoutCustomer } = useCustomerSession();
  const { notifications } = useDemoData();
  const navigate = useNavigate();

  if (!currentCustomer) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-[#701525] mb-2">Customer Session Required</h2>
        <p className="text-xs text-gray-600 mb-6 max-w-sm">
          Please log into your demo customer account to access your applications and loan records.
        </p>
        <Link
          to="/login"
          className="py-2.5 px-6 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d]"
        >
          Sign In as Demo Customer
        </Link>
      </div>
    );
  }

  const unreadNotifs = notifications.filter(n => !n.read && (n.targetRole === 'CUSTOMER' || n.targetRole === 'ALL'));

  const navItems = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Applications', path: '/dashboard/applications', icon: FileText },
    { name: 'Repay & Statements', path: '/dashboard/repay', icon: CreditCard },
    { name: 'Customer Profile', path: '/dashboard/profile', icon: User },
    { name: 'Notifications', path: '/dashboard/notifications', icon: Bell, badge: unreadNotifs.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Customer Header Banner */}
      <div className="bg-gradient-to-br from-[#58101d] via-[#701525] to-[#921428] rounded-3xl p-7 sm:p-9 text-white flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl border border-[#C9A45C]/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#C9A45C] text-[#58101d]">
              Customer Portal
            </span>
            <span className="text-xs text-[#E9D6A6]">Welcome back</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display mt-1">
            {currentCustomer.fullName}
          </h1>
          <p className="text-xs text-white/80 mt-1">
            {currentCustomer.city}, {currentCustomer.state} • {currentCustomer.email}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              logoutCustomer();
              navigate('/');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E2D8] pb-1 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#701525] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#701525] hover:bg-[#FAF8F3]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
              {Boolean(item.badge && item.badge > 0) && (
                <span className="w-4 h-4 rounded-full bg-[#A71930] text-white text-[10px] flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Routed Customer View */}
      <Outlet />
    </div>
  );
};
