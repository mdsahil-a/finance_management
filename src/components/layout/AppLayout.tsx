import React from 'react';
import { Outlet } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { LoginScreen } from '../auth/LoginScreen';
import { UserProfileModal } from '../profile/UserProfileModal';
import { NewLoanModal } from '../loans/NewLoanModal';
import { PaymentModal } from '../loans/PaymentModal';
import { PrintReceiptModal } from '../loans/PrintReceiptModal';
import { StaffSwitchModal } from '../staff/StaffSwitchModal';

export const AppLayout: React.FC = () => {
  const { isAuthenticated } = useFinance();

  // If user is logged out, render secure authentication screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="h-screen w-full max-w-full overflow-hidden flex bg-zinc-50 text-zinc-900 selection:bg-amber-200 selection:text-amber-950 font-sans">
      
      {/* Primary Left Navigation Sidebar (Desktop fixed h-screen & Mobile drawer) */}
      <AppSidebar />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header - Permanently fixed, never scrolls */}
        <AppHeader />

        {/* Scrollable Page Body: Only this inner container scrolls vertically */}
        <div id="main-scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col scroll-smooth">
          <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 min-w-0">
            <Outlet />
          </main>

          {/* Banking Grade Footer */}
          <footer className="border-t border-zinc-200/80 bg-white py-4 text-center text-xs text-zinc-500 print:hidden mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="font-semibold text-zinc-600">
                Aurum Gold Finance &middot; Gold Loan & Asset Custody Management System
              </p>
              <p className="text-zinc-400">
                RBI Compliance Standard &middot; Dual Biometric Safe Custody &middot; 75% LTV Strict Cap
              </p>
            </div>
          </footer>
        </div>

      </div>

      {/* Global Modals & User Profile Verification */}
      <UserProfileModal />
      <NewLoanModal />
      <PaymentModal />
      <PrintReceiptModal />
      <StaffSwitchModal />

    </div>
  );
};
