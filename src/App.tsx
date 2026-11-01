import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import { AppLayout } from './components/layout/AppLayout';

function ScrollToTopAndClamp() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ left: 0, top: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
    const scrollContainer = document.getElementById('main-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
      scrollContainer.scrollLeft = 0;
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const clampHorizontalScroll = () => {
      if (window.scrollX > 0) {
        window.scrollTo(0, window.scrollY);
      }
      if (document.documentElement.scrollLeft > 0) {
        document.documentElement.scrollLeft = 0;
      }
      if (document.body.scrollLeft > 0) {
        document.body.scrollLeft = 0;
      }
      const scrollContainer = document.getElementById('main-scroll-container');
      if (scrollContainer && scrollContainer.scrollLeft > 0) {
        scrollContainer.scrollLeft = 0;
      }
    };

    window.addEventListener('scroll', clampHorizontalScroll, { passive: true });
    window.addEventListener('resize', clampHorizontalScroll, { passive: true });
    clampHorizontalScroll();

    return () => {
      window.removeEventListener('scroll', clampHorizontalScroll);
      window.removeEventListener('resize', clampHorizontalScroll);
    };
  }, []);

  return null;
}

// Core Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { LoansPage } from './pages/loans/LoansPage';
import { SafePage } from './pages/safe/SafePage';
import { CustomersPage } from './pages/customers/CustomersPage';
import { DayBookPage } from './pages/daybook/DayBookPage';
import { CalculatorPage } from './pages/calculator/CalculatorPage';
import { StaffPage } from './pages/staff/StaffPage';
import { SettingsPage } from './pages/settings/SettingsPage';

// Role-Specific Pages
import { BranchesPage } from './pages/branches/BranchesPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { ApprovalsPage } from './pages/approvals/ApprovalsPage';
import { AppraisalsPage } from './pages/appraisals/AppraisalsPage';
import { ReceiptsPage } from './pages/receipts/ReceiptsPage';

// Customer Portal Pages
import { MyLoansPage } from './pages/customer/MyLoansPage';
import { MyPaymentsPage } from './pages/customer/MyPaymentsPage';
import { MyGoldPage } from './pages/customer/MyGoldPage';
import { MyStatementsPage } from './pages/customer/MyStatementsPage';
import { MyProfilePage } from './pages/customer/MyProfilePage';
import { MyHelpPage } from './pages/customer/MyHelpPage';

export function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <ScrollToTopAndClamp />
        <Routes>
          <Route element={<AppLayout />}>
            {/* Dynamic Dashboard (Switches per Role) */}
            <Route index element={<DashboardPage />} />
            
            {/* Core Operations */}
            <Route path="loans" element={<LoansPage />} />
            <Route path="safe" element={<SafePage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="daybook" element={<DayBookPage />} />
            <Route path="calculator" element={<CalculatorPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* Admin & Branch Management */}
            <Route path="branches" element={<BranchesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="approvals" element={<ApprovalsPage />} />
            <Route path="appraisals" element={<AppraisalsPage />} />
            <Route path="receipts" element={<ReceiptsPage />} />

            {/* Customer Self-Service Portal */}
            <Route path="my-loans" element={<MyLoansPage />} />
            <Route path="my-payments" element={<MyPaymentsPage />} />
            <Route path="my-gold" element={<MyGoldPage />} />
            <Route path="my-statements" element={<MyStatementsPage />} />
            <Route path="my-profile" element={<MyProfilePage />} />
            <Route path="my-help" element={<MyHelpPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FinanceProvider>
  );
}

export default App;
