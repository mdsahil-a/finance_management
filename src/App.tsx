import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { LoansPage } from './pages/loans/LoansPage';
import { SafePage } from './pages/safe/SafePage';
import { CustomersPage } from './pages/customers/CustomersPage';
import { DayBookPage } from './pages/daybook/DayBookPage';
import { CalculatorPage } from './pages/calculator/CalculatorPage';
import { StaffPage } from './pages/staff/StaffPage';
import { SettingsPage } from './pages/settings/SettingsPage';

export function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="loans" element={<LoansPage />} />
            <Route path="safe" element={<SafePage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="daybook" element={<DayBookPage />} />
            <Route path="calculator" element={<CalculatorPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FinanceProvider>
  );
}

export default App;
