import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  Menu,
  Search, 
  Coins,
  Bell,
  Building2,
  Wallet,
  ArrowUpRight,
  RotateCcw,
  Shield,
  Clock,
  User,
  LogOut,
  TrendingUp,
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { 
    settings, 
    searchQuery, 
    setSearchQuery, 
    setIsNewLoanModalOpen, 
    setIsPaymentModalOpen,
    resetToDefaultData,
    currentStaff,
    currentCustomer,
    currentRole,
    approvals,
    loans,
    setMobileSidebarOpen,
    setIsProfileModalOpen,
    logout,
  } = useFinance();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');
  const overdueLoans = loans.filter(l => l.status === 'Overdue');
  const totalNotifications = pendingApprovals.length + overdueLoans.length;

  const currentDisplayName = currentRole === 'CUSTOMER' ? currentCustomer.name : currentStaff.name;
  const currentFirstName = currentDisplayName.split(' ')[0];

  return (
    <header className="bg-white border-b border-zinc-200/80 sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.03)] print:hidden w-full max-w-full overflow-x-hidden">
      <div className="w-full px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          
          {/* Left: Mobile Hamburger & Branch Identification */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Compact Branch Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-50 border border-zinc-200/80 rounded-xl text-xs shrink-0">
              <Building2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="font-bold text-zinc-900 whitespace-nowrap text-xs">
                {currentRole === 'CUSTOMER' ? 'Mumbai Fort' : 'Mumbai Fort (#101)'}
              </span>
            </div>
          </div>

          {/* Center: Live Bullion Benchmark Rates Board */}
          <div className="hidden lg:flex items-center justify-center shrink-0">
            <div className="flex items-center bg-amber-50/70 border border-amber-200/90 rounded-xl px-2.5 py-1 shadow-2xs gap-2 text-xs">
              
              {/* Live Status indicator */}
              <div className="flex items-center gap-1.5 text-amber-950 font-bold shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] tracking-wider uppercase font-black text-amber-950">LIVE GOLD</span>
              </div>

              <div className="h-3.5 w-px bg-amber-200" />

              {/* 22K (916) Rate */}
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">22K:</span>
                <span className="font-black text-zinc-950 font-mono text-xs">
                  ₹{settings.goldRate22K.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-zinc-400">/g</span>
              </div>

              <div className="h-3.5 w-px bg-amber-200" />

              {/* 24K (Pure) Rate */}
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">24K:</span>
                <span className="font-black text-zinc-950 font-mono text-xs">
                  ₹{settings.goldRate24K.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-zinc-400">/g</span>
              </div>

            </div>
          </div>

          {/* Right actions: Search, Notifications, Profile Button, Actions, Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Global Search - on wide screens */}
            {currentRole !== 'CUSTOMER' && (
              <div className="relative hidden 2xl:block w-36">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-2.5 py-1.5 bg-zinc-100/80 hover:bg-zinc-100 focus:bg-white border border-zinc-200 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 transition-all outline-none"
                />
              </div>
            )}
            
            {/* Notifications Dropdown */}
            {currentRole !== 'CUSTOMER' && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl relative transition-colors cursor-pointer"
                  title="Notifications & Alerts"
                >
                  <Bell className="w-4 h-4" />
                  {totalNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="px-4 py-2 border-b border-zinc-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900">Notifications & Alerts</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full">
                        {totalNotifications} New
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100 text-xs">
                      {pendingApprovals.map((appr) => (
                        <div key={appr.id} className="p-3 hover:bg-zinc-50 transition-colors">
                          <div className="flex items-center gap-1.5 font-bold text-zinc-900 mb-0.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pending Approval: {appr.type.replace('_', ' ')}</span>
                          </div>
                          <p className="text-[11px] text-zinc-600 truncate">{appr.customerName} - ₹{appr.amount.toLocaleString('en-IN')}</p>
                          <span className="text-[10px] text-zinc-400 block mt-1">{appr.reason}</span>
                        </div>
                      ))}
                      {overdueLoans.map((loan) => (
                        <div key={loan.id} className="p-3 hover:bg-zinc-50 transition-colors">
                          <div className="flex items-center gap-1.5 font-bold text-rose-700 mb-0.5">
                            <Shield className="w-3.5 h-3.5 text-rose-600" />
                            <span>Overdue Loan: {loan.id}</span>
                          </div>
                          <p className="text-[11px] text-zinc-600 truncate">{loan.customerName} - ₹{loan.loanAmount.toLocaleString('en-IN')}</p>
                          <span className="text-[10px] text-zinc-400 block mt-1">Due {loan.dueDate}</span>
                        </div>
                      ))}
                      {totalNotifications === 0 && (
                        <div className="p-4 text-center text-zinc-400 text-xs">
                          No pending alerts or notifications.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Button: Displays ONLY the user's name (Role is strictly displayed after clicking) */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-xl transition-all text-left cursor-pointer shadow-2xs shrink-0"
              title="Click to view profile, assigned role & permissions"
            >
              <div className="w-6 h-6 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentDisplayName.charAt(0)}
              </div>
              <div className="hidden sm:block min-w-0">
                <span className="text-xs font-bold text-zinc-900 truncate block max-w-[80px]">
                  {currentFirstName}
                </span>
              </div>
            </button>

            {/* Action Buttons (Staff roles only) */}
            {currentRole !== 'CUSTOMER' && (
              <>
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
                  title="Collect interest or loan payment"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Collect</span>
                </button>

                <button
                  onClick={() => setIsNewLoanModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
                  title="Create a new gold loan"
                >
                  <span>+ Loan</span>
                  <ArrowUpRight className="w-3 h-3 text-amber-400" />
                </button>
              </>
            )}

            {/* Customer Quick Action */}
            {currentRole === 'CUSTOMER' && (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
                title="Pay Interest / Principal Online"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Pay Online</span>
              </button>
            )}

            {/* Direct Logout Button */}
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-zinc-500 hover:text-rose-700 hover:bg-rose-50 border border-zinc-200/80 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
