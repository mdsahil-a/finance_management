import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  PlusCircle, 
  Wallet, 
  Search, 
  Phone, 
  RotateCcw,
  Sparkles,
  Coins,
  User,
  ChevronDown
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
    setIsStaffModalOpen,
  } = useFinance();

  const todayDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    MANAGER: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    LOAN_OFFICER: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    APPRAISER: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    CASHIER: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    CUSTODIAN: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Shop Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-900/30 shrink-0">
              <Coins className="w-6 h-6 text-slate-950" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate flex items-center gap-2">
                <span>{settings.shopName}</span>
              </h1>
              <p className="text-xs text-slate-400 truncate flex items-center gap-2">
                <span>{todayDate}</span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Phone className="w-3 h-3 text-amber-400" />
                  {settings.shopPhone}
                </span>
              </p>
            </div>
          </div>

          {/* Today's Gold Rates */}
          <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gold Rate:</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-slate-200">
              <span>22K: <strong className="text-white">₹{settings.goldRate22K.toLocaleString('en-IN')}</strong>/g</span>
              <span className="text-slate-600">|</span>
              <span>24K: <strong className="text-white">₹{settings.goldRate24K.toLocaleString('en-IN')}</strong>/g</span>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs relative hidden lg:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, phone, loan #..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800/90 border border-slate-700 rounded-lg text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Active Staff Pill & Switcher */}
          <button
            onClick={() => setIsStaffModalOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all hover:border-slate-600 shrink-0 text-left"
            title="Click to switch staff user"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
              <User className="w-4 h-4 text-amber-400" />
            </div>
            <div className="hidden sm:block min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate max-w-[120px]">{currentStaff.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border ${roleColors[currentStaff.role]}`}>
                {currentStaff.role.replace('_', ' ')}
              </span>
            </div>
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Collect Payment */}
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Collect interest or loan payment"
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Collect</span>
            </button>

            {/* Give New Loan */}
            <button
              onClick={() => setIsNewLoanModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-md shadow-amber-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Create a new gold loan"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Give Loan</span>
            </button>

            {/* Reset */}
            <button
              onClick={resetToDefaultData}
              title="Reset Sample Data"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
