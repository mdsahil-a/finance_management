import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { AdminDashboard } from './AdminDashboard';
import { BranchManagerDashboard } from './BranchManagerDashboard';
import { AppraiserDashboard } from './AppraiserDashboard';
import { CashierDashboard } from './CashierDashboard';
import { CustomerDashboard } from './CustomerDashboard';

export const DashboardPage: React.FC = () => {
  const { currentRole } = useFinance();

  switch (currentRole) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'BRANCH_MANAGER':
      return <BranchManagerDashboard />;
    case 'APPRAISER':
      return <AppraiserDashboard />;
    case 'CASHIER':
      return <CashierDashboard />;
    case 'CUSTOMER':
      return <CustomerDashboard />;
    default:
      return <AdminDashboard />;
  }
};
