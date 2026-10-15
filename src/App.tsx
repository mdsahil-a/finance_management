import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DemoDataProvider } from './context/DemoDataContext';
import { CustomerSessionProvider } from './context/CustomerSessionContext';
import { StaffSessionProvider } from './context/StaffSessionContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { StaffLayout } from './components/layout/StaffLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { GoldLoanPage } from './pages/public/GoldLoanPage';
import { CalculatorPage } from './pages/public/CalculatorPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ApplyPage } from './pages/public/ApplyPage';
import { CustomerLoginPage } from './pages/public/CustomerLoginPage';
import { TrackApplicationPage } from './pages/public/TrackApplicationPage';
import { BranchLocatorPage } from './pages/public/BranchLocatorPage';
import { FAQsPage } from './pages/public/FAQsPage';
import { ContactPage } from './pages/public/ContactPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { TermsPage } from './pages/public/TermsPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Customer Pages
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { CustomerApplicationsPage } from './pages/customer/CustomerApplicationsPage';
import { CustomerRepayPage } from './pages/customer/CustomerRepayPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';
import { CustomerNotificationsPage } from './pages/customer/CustomerNotificationsPage';
import { ApplicationDetailsPage } from './pages/customer/ApplicationDetailsPage';

// Staff Auth & Error Pages
import { StaffLoginPage } from './pages/staff/StaffLoginPage';
import { StaffUnauthorizedPage } from './pages/staff/StaffUnauthorizedPage';

// Super Admin Pages
import { AdminDashboardPage } from './pages/staff/admin/AdminDashboardPage';
import { AdminApplicationsPage } from './pages/staff/admin/AdminApplicationsPage';
import { AdminUsersPage } from './pages/staff/admin/AdminUsersPage';
import { AdminBranchesPage } from './pages/staff/admin/AdminBranchesPage';
import { AdminReportsPage } from './pages/staff/admin/AdminReportsPage';
import { AdminActivityLogsPage } from './pages/staff/admin/AdminActivityLogsPage';
import { AdminSettingsPage } from './pages/staff/admin/AdminSettingsPage';
import { AdminSchemesPage } from './pages/staff/admin/AdminSchemesPage';
import { AdminGoldRatesPage } from './pages/staff/admin/AdminGoldRatesPage';
import { AdminWorkflowConfigPage } from './pages/staff/admin/AdminWorkflowConfigPage';

// Branch Manager Page
import { BranchManagerDashboardPage } from './pages/staff/branch-manager/BranchManagerDashboardPage';

// Loan Officer Pages
import { LoanOfficerDashboardPage } from './pages/staff/loan-officer/LoanOfficerDashboardPage';
import { LoanOfficerCustomersPage } from './pages/staff/loan-officer/LoanOfficerCustomersPage';

// Gold Weighter / Appraiser Pages
import { WeighterDashboardPage } from './pages/staff/weighter/WeighterDashboardPage';
import { WeighterQueuePage } from './pages/staff/weighter/WeighterQueuePage';
import { WeighterAssessmentFormPage } from './pages/staff/weighter/WeighterAssessmentFormPage';
import { WeighterHistoryPage } from './pages/staff/weighter/WeighterHistoryPage';

// Credit Officer / Final Entry Pages
import { FinalEntryDashboardPage } from './pages/staff/final-entry/FinalEntryDashboardPage';
import { FinalEntryQueuePage } from './pages/staff/final-entry/FinalEntryQueuePage';
import { FinalEntryFormPage } from './pages/staff/final-entry/FinalEntryFormPage';
import { FinalEntryCompletedPage } from './pages/staff/final-entry/FinalEntryCompletedPage';

// Cashier Pages
import { CashierDashboardPage } from './pages/staff/cashier/CashierDashboardPage';
import { CashierPendingPage } from './pages/staff/cashier/CashierPendingPage';
import { CashierDisbursementsPage } from './pages/staff/cashier/CashierDisbursementsPage';
import { CashierRepaymentsPage } from './pages/staff/cashier/CashierRepaymentsPage';
import { CashierReconciliationPage } from './pages/staff/cashier/CashierReconciliationPage';
import { CashierTransactionsPage } from './pages/staff/cashier/CashierTransactionsPage';
import { CashierReceiptsPage } from './pages/staff/cashier/CashierReceiptsPage';

// Custody Officer Pages
import { CustodyDashboardPage } from './pages/staff/custody/CustodyDashboardPage';

// Auditor Pages
import { AuditorDashboardPage } from './pages/staff/auditor/AuditorDashboardPage';
import { AuditorTransactionsPage } from './pages/staff/auditor/AuditorTransactionsPage';
import { AuditorCompliancePage } from './pages/staff/auditor/AuditorCompliancePage';
import { AuditorReconciliationsPage } from './pages/staff/auditor/AuditorReconciliationsPage';
import { AuditorReportsPage } from './pages/staff/auditor/AuditorReportsPage';

export function App() {
  return (
    <DemoDataProvider>
      <CustomerSessionProvider>
        <StaffSessionProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Website Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/gold-loan" element={<GoldLoanPage />} />
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/apply" element={<ApplyPage />} />
                <Route path="/login" element={<CustomerLoginPage />} />
                <Route path="/track-application" element={<TrackApplicationPage />} />
                <Route path="/branches" element={<BranchLocatorPage />} />
                <Route path="/faqs" element={<FAQsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/application/:reference" element={<ApplicationDetailsPage />} />

                {/* Customer Dashboard Nested in Public Layout */}
                <Route path="/dashboard" element={<CustomerLayout />}>
                  <Route index element={<CustomerDashboardPage />} />
                  <Route path="applications" element={<CustomerApplicationsPage />} />
                  <Route path="repay" element={<CustomerRepayPage />} />
                  <Route path="profile" element={<CustomerProfilePage />} />
                  <Route path="notifications" element={<CustomerNotificationsPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Staff Authentication & Unauthorized Routes */}
              <Route path="/staff/login" element={<StaffLoginPage />} />
              <Route path="/staff/unauthorized" element={<StaffUnauthorizedPage />} />

              {/* Internal Staff Management Layout & Role Routes */}
              <Route path="/staff" element={<StaffLayout />}>
                {/* Default redirect to admin */}
                <Route index element={<Navigate to="/staff/admin" replace />} />

                {/* Role 1: Super Admin */}
                <Route path="admin" element={<AdminDashboardPage />} />
                <Route path="admin/applications" element={<AdminApplicationsPage />} />
                <Route path="admin/users" element={<AdminUsersPage />} />
                <Route path="admin/branches" element={<AdminBranchesPage />} />
                <Route path="admin/schemes" element={<AdminSchemesPage />} />
                <Route path="admin/gold-rates" element={<AdminGoldRatesPage />} />
                <Route path="admin/workflow-config" element={<AdminWorkflowConfigPage />} />
                <Route path="admin/reports" element={<AdminReportsPage />} />
                <Route path="admin/activity-logs" element={<AdminActivityLogsPage />} />
                <Route path="admin/settings" element={<AdminSettingsPage />} />

                {/* Role 2: Branch Manager */}
                <Route path="branch-manager" element={<BranchManagerDashboardPage />} />
                <Route path="branch-manager/applications" element={<BranchManagerDashboardPage showApplications />} />

                {/* Role 3: Loan Officer */}
                <Route path="loan-officer" element={<LoanOfficerDashboardPage />} />
                <Route path="loan-officer/customers" element={<LoanOfficerCustomersPage />} />
                <Route path="loan-officer/new-application" element={<ApplyPage />} />
                <Route path="loan-officer/applications" element={<AdminApplicationsPage />} />

                {/* Role 4: Gold Appraiser / Weighter */}
                <Route path="weighter" element={<WeighterDashboardPage />} />
                <Route path="weighter/apply" element={<ApplyPage />} />
                <Route path="weighter/queue" element={<WeighterQueuePage />} />
                <Route path="weighter/assessment/:reference" element={<WeighterAssessmentFormPage />} />
                <Route path="weighter/history" element={<WeighterHistoryPage />} />

                {/* Role 5: Credit Officer / Final Entry Operator */}
                <Route path="final-entry" element={<FinalEntryDashboardPage />} />
                <Route path="final-entry/queue" element={<FinalEntryQueuePage />} />
                <Route path="final-entry/form/:reference" element={<FinalEntryFormPage />} />
                <Route path="final-entry/completed" element={<FinalEntryCompletedPage />} />

                {/* Role 6: Cashier */}
                <Route path="cashier" element={<CashierDashboardPage />} />
                <Route path="cashier/pending" element={<CashierPendingPage />} />
                <Route path="cashier/disbursements" element={<CashierDisbursementsPage />} />
                <Route path="cashier/repayments" element={<CashierRepaymentsPage />} />
                <Route path="cashier/reconciliation" element={<CashierReconciliationPage />} />
                <Route path="cashier/transactions" element={<CashierTransactionsPage />} />
                <Route path="cashier/receipts" element={<CashierReceiptsPage />} />

                {/* Role 7: Gold Custody Officer */}
                <Route path="custody" element={<CustodyDashboardPage initialTab="inventory" />} />
                <Route path="custody/pending" element={<CustodyDashboardPage initialTab="pending" />} />
                <Route path="custody/inventory" element={<CustodyDashboardPage initialTab="inventory" />} />
                <Route path="custody/release" element={<CustodyDashboardPage initialTab="release" />} />

                {/* Role 8: Auditor & Compliance */}
                <Route path="auditor" element={<AuditorDashboardPage />} />
                <Route path="auditor/transactions" element={<AuditorTransactionsPage />} />
                <Route path="auditor/compliance" element={<AuditorCompliancePage />} />
                <Route path="auditor/reconciliations" element={<AuditorReconciliationsPage />} />
                <Route path="auditor/reports" element={<AuditorReportsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </StaffSessionProvider>
      </CustomerSessionProvider>
    </DemoDataProvider>
  );
}

export default App;
