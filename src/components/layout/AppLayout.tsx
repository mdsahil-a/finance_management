import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { AppNavbar } from './AppNavbar';
import { NewLoanModal } from '../loans/NewLoanModal';
import { PaymentModal } from '../loans/PaymentModal';
import { PrintReceiptModal } from '../loans/PrintReceiptModal';
import { StaffSwitchModal } from '../staff/StaffSwitchModal';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Header */}
      <AppHeader />

      {/* Main Navigation Bar */}
      <AppNavbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>Gold Finance Management Portal · Built for multi-counter lending operations</p>
      </footer>

      {/* Global Modals */}
      <NewLoanModal />
      <PaymentModal />
      <PrintReceiptModal />
      <StaffSwitchModal />

    </div>
  );
};
