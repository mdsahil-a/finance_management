import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Loan,
  Payment,
  Customer,
  ShopSettings,
  DayBookEntry,
  GoldItem,
  PaymentType,
  PaymentMethod,
  StaffUser,
  AppRole,
  BranchInfo,
  PendingApproval,
  AppraisalRecord,
  LoanApplication,
  AuditLogEntry,
  CustodyLogEntry,
  GoldPurity,
} from '../types/finance';
import {
  INITIAL_SHOP_SETTINGS,
  INITIAL_CUSTOMERS,
  INITIAL_LOANS,
  INITIAL_PAYMENTS,
  INITIAL_DAYBOOK,
  INITIAL_STAFF,
  INITIAL_BRANCHES,
  INITIAL_APPROVALS,
  INITIAL_APPRAISALS,
  INITIAL_APPLICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CUSTODY_LOGS,
} from '../data/initialFinanceData';

interface GiveLoanInput {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerIdProof?: string;
  goldItems: GoldItem[];
  loanAmount: number;
  monthlyInterestRate: number;
  safePacketNumber: string;
  loanDate?: string;
  notes?: string;
  paymentMethod?: PaymentMethod;
  appraiserStaffName?: string;
}

interface RecordPaymentInput {
  loanId: string;
  paymentType: PaymentType;
  principalPaid: number;
  interestPaid: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

interface CreateApplicationInput {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerIdProof: string;
  requestedAmount: number;
  declaredItemsDescription: string;
  assignedAppraiserId?: string;
}

interface SubmitAppraisalInput {
  ornaments: Array<{
    name: string;
    grossWeight: number;
    stoneWeight: number;
    netWeight: number;
    purity: GoldPurity;
    ratePerGram: number;
    valuation: number;
  }>;
  assayRemarks?: string;
}

interface ReviewApplicationInput {
  decision: 'APPROVED' | 'REJECTED' | 'RETURNED_FOR_CORRECTION';
  reason: string;
  approvedAmount?: number;
  monthlyInterestRate?: number;
}

interface DisburseLoanInput {
  disbursedAmount: number;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  notes?: string;
}

interface VaultSecurityInput {
  safePacketNumber: string;
  lockerBay: string;
  notes?: string;
}

interface FinanceContextType {
  // Core Entities (filtered strictly if currentRole === 'CUSTOMER')
  loans: Loan[];
  rawLoans: Loan[];
  payments: Payment[];
  customers: Customer[];
  settings: ShopSettings;
  dayBook: DayBookEntry[];
  staffUsers: StaffUser[];
  currentStaff: StaffUser;

  // 5 Role System (Admin, Branch Manager, Appraiser, Cashier, Customer)
  currentRole: AppRole;
  setCurrentRole: (role: AppRole) => void;
  currentCustomer: Customer;
  setCurrentCustomer: (customer: Customer) => void;

  // Sidebar navigation state
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  // Branches & Approvals
  branches: BranchInfo[];
  approvals: PendingApproval[];
  approveRequest: (approvalId: string) => void;
  rejectRequest: (approvalId: string) => void;

  // Gold Appraisals Queue & Submissions
  appraisals: AppraisalRecord[];
  addAppraisal: (record: Omit<AppraisalRecord, 'id' | 'date'>) => AppraisalRecord;

  // Comprehensive 5-Stage Loan Workflow
  applications: LoanApplication[];
  auditLogs: AuditLogEntry[];
  custodyLogs: CustodyLogEntry[];

  createLoanApplication: (input: CreateApplicationInput) => { success: boolean; application?: LoanApplication; error?: string };
  submitAppraisal: (applicationId: string, input: SubmitAppraisalInput) => { success: boolean; application?: LoanApplication; error?: string };
  reviewApplication: (applicationId: string, input: ReviewApplicationInput) => { success: boolean; application?: LoanApplication; error?: string };
  disburseLoan: (applicationId: string, input: DisburseLoanInput) => { success: boolean; loan?: Loan; error?: string };
  secureGoldAndActivateLoan: (loanId: string, input: VaultSecurityInput) => { success: boolean; loan?: Loan; error?: string };
  authorizeCollateralRelease: (loanId: string, reason?: string) => { success: boolean; error?: string };
  releaseGoldToCustomer: (loanId: string, input?: { notes?: string }) => { success: boolean; loan?: Loan; error?: string };

  // Global search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Authentication & Session
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;

  // Legacy & Direct Actions
  giveNewLoan: (input: GiveLoanInput) => Loan;
  recordPayment: (input: RecordPaymentInput) => Payment;
  returnGold: (loanId: string) => Loan | null;
  updateSettings: (newSettings: ShopSettings) => void;
  addDayBookEntry: (entry: Omit<DayBookEntry, 'id' | 'time'>) => void;
  resetToDefaultData: () => void;

  // Staff Management Actions
  switchStaff: (staffId: string) => void;
  addStaffUser: (staff: Omit<StaffUser, 'id' | 'joinedDate'>) => StaffUser;
  updateStaffUser: (id: string, updates: Partial<StaffUser>) => void;
  isStaffModalOpen: boolean;
  setIsStaffModalOpen: (open: boolean) => void;

  // Modal controls
  isNewLoanModalOpen: boolean;
  setIsNewLoanModalOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  selectedLoanForPayment: Loan | null;
  setSelectedLoanForPayment: (loan: Loan | null) => void;

  // Printing Slips
  activePrintModal: 'LOAN_SLIP' | 'PAYMENT_RECEIPT' | 'GOLD_RETURN' | null;
  setActivePrintModal: (modal: 'LOAN_SLIP' | 'PAYMENT_RECEIPT' | 'GOLD_RETURN' | null) => void;
  selectedLoanForPrint: Loan | null;
  setSelectedLoanForPrint: (loan: Loan | null) => void;
  selectedPaymentForPrint: Payment | null;
  setSelectedPaymentForPrint: (payment: Payment | null) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEY_LOANS = 'finance_loans_v2';
const STORAGE_KEY_PAYMENTS = 'finance_payments_v2';
const STORAGE_KEY_CUSTOMERS = 'finance_customers_v2';
const STORAGE_KEY_SETTINGS = 'finance_settings_v2';
const STORAGE_KEY_DAYBOOK = 'finance_daybook_v2';
const STORAGE_KEY_STAFF = 'finance_staff_v2';
const STORAGE_KEY_CURRENT_STAFF = 'finance_current_staff_v2';
const STORAGE_KEY_BRANCHES = 'finance_branches_v2';
const STORAGE_KEY_APPROVALS = 'finance_approvals_v2';
const STORAGE_KEY_APPRAISALS = 'finance_appraisals_v2';
const STORAGE_KEY_ROLE = 'finance_current_role_v2';
const STORAGE_KEY_CUSTOMER = 'finance_current_customer_v2';
const STORAGE_KEY_SIDEBAR = 'finance_sidebar_collapsed_v2';
const STORAGE_KEY_APPLICATIONS = 'finance_applications_v2';
const STORAGE_KEY_AUDIT_LOGS = 'finance_audit_logs_v2';
const STORAGE_KEY_CUSTODY_LOGS = 'finance_custody_logs_v2';

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LOANS);
    return saved ? JSON.parse(saved) : INITIAL_LOANS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PAYMENTS);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [settings, setSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SHOP_SETTINGS;
  });

  const [dayBook, setDayBook] = useState<DayBookEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DAYBOOK);
    return saved ? JSON.parse(saved) : INITIAL_DAYBOOK;
  });

  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STAFF);
    if (!saved) return INITIAL_STAFF;
    try {
      const parsed: StaffUser[] = JSON.parse(saved);
      const merged: StaffUser[] = INITIAL_STAFF.map((def) => {
        const stored = parsed.find((p) => p.id === def.id || p.username === def.username);
        return {
          ...def,
          ...(stored || {}),
          username: def.username,
          password: def.password,
          pin: def.pin,
          email: def.email,
          role: def.role,
        };
      });
      for (const p of parsed) {
        if (!merged.some((m) => m.id === p.id)) {
          merged.push(p);
        }
      }
      return merged;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [currentStaff, setCurrentStaff] = useState<StaffUser>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENT_STAFF);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_STAFF[0]; // Admin by default
  });

  // 5-Role System: Admin, Branch Manager, Appraiser, Cashier, Customer
  const [currentRole, setCurrentRoleState] = useState<AppRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ROLE) as AppRole | null;
    if (saved && ['ADMIN', 'BRANCH_MANAGER', 'APPRAISER', 'CASHIER', 'CUSTOMER'].includes(saved)) {
      return saved;
    }
    return 'ADMIN';
  });

  const [currentCustomer, setCurrentCustomer] = useState<Customer>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOMER);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS[0];
  });

  // Sidebar Layout state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SIDEBAR);
    return saved ? JSON.parse(saved) : false;
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Branches, Approvals & Appraisals
  const [branches, setBranches] = useState<BranchInfo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BRANCHES);
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [approvals, setApprovals] = useState<PendingApproval[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_APPROVALS);
    return saved ? JSON.parse(saved) : INITIAL_APPROVALS;
  });

  const [appraisals, setAppraisals] = useState<AppraisalRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_APPRAISALS);
    return saved ? JSON.parse(saved) : INITIAL_APPRAISALS;
  });

  // Comprehensive 5-Stage Loan Workflow
  const [applications, setApplications] = useState<LoanApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [custodyLogs, setCustodyLogs] = useState<CustodyLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTODY_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTODY_LOGS;
  });

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('finance_auth_session_v2');
    return saved !== null ? saved === 'true' : true;
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Modals state
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLoanForPayment, setSelectedLoanForPayment] = useState<Loan | null>(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  // Printing
  const [activePrintModal, setActivePrintModal] = useState<'LOAN_SLIP' | 'PAYMENT_RECEIPT' | 'GOLD_RETURN' | null>(null);
  const [selectedLoanForPrint, setSelectedLoanForPrint] = useState<Loan | null>(null);
  const [selectedPaymentForPrint, setSelectedPaymentForPrint] = useState<Payment | null>(null);

  // Sync to local storage
  useEffect(() => { localStorage.setItem(STORAGE_KEY_LOANS, JSON.stringify(loans)); }, [loans]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_DAYBOOK, JSON.stringify(dayBook)); }, [dayBook]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(staffUsers)); }, [staffUsers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_CURRENT_STAFF, JSON.stringify(currentStaff)); }, [currentStaff]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_ROLE, currentRole); }, [currentRole]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_CUSTOMER, JSON.stringify(currentCustomer)); }, [currentCustomer]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_SIDEBAR, JSON.stringify(isSidebarCollapsed)); }, [isSidebarCollapsed]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_BRANCHES, JSON.stringify(branches)); }, [branches]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_APPROVALS, JSON.stringify(approvals)); }, [approvals]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_APPRAISALS, JSON.stringify(appraisals)); }, [appraisals]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_CUSTODY_LOGS, JSON.stringify(custodyLogs)); }, [custodyLogs]);
  useEffect(() => { localStorage.setItem('finance_auth_session_v2', String(isAuthenticated)); }, [isAuthenticated]);

  // Immutable Audit Logging Helper
  const logAudit = (
    action: string,
    entityType: 'APPLICATION' | 'LOAN' | 'APPRAISAL' | 'APPROVAL' | 'PAYMENT' | 'CUSTODY' | 'CUSTOMER',
    entityId: string,
    details: string,
    metadata?: Record<string, unknown>
  ) => {
    const entry: AuditLogEntry = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action,
      role: currentRole,
      performedByName: currentRole === 'CUSTOMER' ? currentCustomer.name : currentStaff.name,
      performedById: currentRole === 'CUSTOMER' ? currentCustomer.id : currentStaff.id,
      entityType,
      entityId,
      details,
      metadata,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // Direct Email & Password Login
  const login = (emailInput: string, passwordInput: string): { success: boolean; error?: string } => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Please enter both your email address and password.' };
    }

    const allUsers: StaffUser[] = [...INITIAL_STAFF];
    for (const u of staffUsers) {
      const idx = allUsers.findIndex((a) => a.id === u.id || (u.email && a.email?.toLowerCase() === u.email.toLowerCase()));
      if (idx >= 0) {
        allUsers[idx] = {
          ...allUsers[idx],
          ...u,
          email: allUsers[idx].email || u.email,
          password: allUsers[idx].password || u.password,
        };
      } else {
        allUsers.push(u);
      }
    }

    const matchedStaff = allUsers.find((s) => {
      const emailMatch = s.email?.toLowerCase() === cleanEmail;
      const usernameMatch = s.username?.toLowerCase() === cleanEmail;
      return emailMatch || usernameMatch;
    });

    if (!matchedStaff) {
      return { success: false, error: 'Invalid email address. No registered account found with this email.' };
    }

    const refUser = INITIAL_STAFF.find((i) => i.id === matchedStaff.id || i.email?.toLowerCase() === matchedStaff.email?.toLowerCase());
    const validPassword = matchedStaff.password || refUser?.password || '';

    const passwordMatch =
      Boolean(validPassword && validPassword === cleanPassword) ||
      Boolean(validPassword && validPassword.toLowerCase() === cleanPassword.toLowerCase());

    if (!passwordMatch) {
      return { success: false, error: 'Invalid password. Please verify and try again.' };
    }

    setCurrentStaff(matchedStaff);

    let newRole: AppRole = 'ADMIN';
    if (matchedStaff.role === 'BRANCH_MANAGER') newRole = 'BRANCH_MANAGER';
    else if (matchedStaff.role === 'APPRAISER') newRole = 'APPRAISER';
    else if (matchedStaff.role === 'CASHIER') newRole = 'CASHIER';
    else if (matchedStaff.role === 'CUSTOMER') newRole = 'CUSTOMER';
    else newRole = 'ADMIN';

    setCurrentRoleState(newRole);

    if (newRole === 'CUSTOMER') {
      const cust = customers.find(
        (c) =>
          c.name.toLowerCase() === matchedStaff.name.toLowerCase() ||
          c.phone.replace(/[\s+-]/g, '') === matchedStaff.phone.replace(/[\s+-]/g, '')
      ) || customers[0];
      setCurrentCustomer(cust);
    }

    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsProfileModalOpen(false);
  };

  // Role Switcher
  const setCurrentRole = (newRole: AppRole) => {
    setCurrentRoleState(newRole);
    if (newRole === 'ADMIN') {
      const adminStaff = staffUsers.find((s) => s.role === 'ADMIN') || staffUsers[0];
      setCurrentStaff(adminStaff);
    } else if (newRole === 'BRANCH_MANAGER') {
      const mgrStaff = staffUsers.find((s) => s.role === 'BRANCH_MANAGER' || s.role === 'MANAGER') || staffUsers[1];
      setCurrentStaff(mgrStaff);
    } else if (newRole === 'APPRAISER') {
      const appraiser = staffUsers.find((s) => s.role === 'APPRAISER') || staffUsers[3];
      setCurrentStaff(appraiser);
    } else if (newRole === 'CASHIER') {
      const cashier = staffUsers.find((s) => s.role === 'CASHIER') || staffUsers[4];
      setCurrentStaff(cashier);
    } else if (newRole === 'CUSTOMER') {
      const custStaff = staffUsers.find((s) => s.role === 'CUSTOMER') || staffUsers[staffUsers.length - 1];
      setCurrentStaff(custStaff);
      if (customers.length > 0 && (!currentCustomer || currentCustomer.name !== 'Rajesh Sharma')) {
        setCurrentCustomer(customers[0]);
      }
    }
  };

  const switchStaff = (staffId: string) => {
    const target = staffUsers.find((s) => s.id === staffId);
    if (target) {
      setCurrentStaff(target);
      if (target.role === 'ADMIN') setCurrentRoleState('ADMIN');
      else if (target.role === 'BRANCH_MANAGER' || target.role === 'MANAGER') setCurrentRoleState('BRANCH_MANAGER');
      else if (target.role === 'APPRAISER') setCurrentRoleState('APPRAISER');
      else if (target.role === 'CASHIER') setCurrentRoleState('CASHIER');
      else if (target.role === 'CUSTOMER') setCurrentRoleState('CUSTOMER');
    }
  };

  const approveRequest = (approvalId: string) => {
    setApprovals((prev) =>
      prev.map((app) => (app.id === approvalId ? { ...app, status: 'APPROVED' as const } : app))
    );
  };

  const rejectRequest = (approvalId: string) => {
    setApprovals((prev) =>
      prev.map((app) => (app.id === approvalId ? { ...app, status: 'REJECTED' as const } : app))
    );
  };

  const addAppraisal = (record: Omit<AppraisalRecord, 'id' | 'date'>): AppraisalRecord => {
    const nextId = `VAL-${400 + appraisals.length + 1}`;
    const today = new Date().toISOString().split('T')[0];
    const newRecord: AppraisalRecord = {
      ...record,
      id: nextId,
      date: today,
    };
    setAppraisals((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const addStaffUser = (staff: Omit<StaffUser, 'id' | 'joinedDate'>): StaffUser => {
    const nextId = `STAFF-0${staffUsers.length + 1}`;
    const today = new Date().toISOString().split('T')[0];
    const newStaff: StaffUser = {
      ...staff,
      id: nextId,
      joinedDate: today,
    };
    setStaffUsers((prev) => [...prev, newStaff]);
    return newStaff;
  };

  const updateStaffUser = (id: string, updates: Partial<StaffUser>) => {
    setStaffUsers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    if (currentStaff.id === id) {
      setCurrentStaff((prev) => ({ ...prev, ...updates }));
    }
  };

  // =========================================================================
  // WORKFLOW STEP 1: Customer Registration & Loan Application Creation
  // Role: Branch Manager, Loan Officer, or Admin
  // =========================================================================
  const createLoanApplication = (input: CreateApplicationInput): { success: boolean; application?: LoanApplication; error?: string } => {
    if (currentRole !== 'ADMIN' && currentRole !== 'BRANCH_MANAGER') {
      return { success: false, error: 'Unauthorized: Only Branch Managers or Authorized Staff can register loan applications.' };
    }

    if (!input.customerName.trim()) return { success: false, error: 'Customer full name is required.' };
    if (!input.customerPhone.trim()) return { success: false, error: 'Customer mobile number is required.' };
    if (!input.customerIdProof.trim()) return { success: false, error: 'Valid identity proof (Aadhaar/PAN/Voter ID) is mandatory.' };
    if (Number(input.requestedAmount) <= 0) return { success: false, error: 'Requested loan amount must be greater than zero.' };

    const cleanPhone = input.customerPhone.replace(/\D/g, '');
    const activePendingApp = applications.find(
      (a) =>
        a.customerPhone.replace(/\D/g, '') === cleanPhone &&
        ['AWAITING_APPRAISAL', 'APPRAISED', 'AWAITING_APPROVAL', 'APPROVED'].includes(a.status)
    );
    if (activePendingApp) {
      return {
        success: false,
        error: `Duplicate application prevented: Customer already has a pending application (${activePendingApp.id}) in status "${activePendingApp.status.replace(/_/g, ' ')}".`,
      };
    }

    let customerId = `CUST-${customers.length + 101}`;
    const existingCust = customers.find((c) => c.phone.replace(/\D/g, '') === cleanPhone);
    if (existingCust) {
      customerId = existingCust.id;
    } else {
      const newCust: Customer = {
        id: customerId,
        name: input.customerName.trim(),
        phone: input.customerPhone.trim(),
        address: input.customerAddress?.trim() || '',
        idProof: input.customerIdProof.trim(),
        totalLoansCount: 0,
        activeLoansCount: 0,
        totalBorrowed: 0,
        totalRepaid: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCustomers((prev) => [newCust, ...prev]);
    }

    const appId = `APP-${1000 + applications.length + 1}`;
    const today = new Date().toISOString().split('T')[0];
    const staffSignature = `${currentStaff.name} (${currentStaff.role})`;

    const appraiser = staffUsers.find((s) => s.role === 'APPRAISER') || {
      id: 'STAFF-04',
      name: 'Rameshwar Patil (Appraiser)',
    };

    const newApp: LoanApplication = {
      id: appId,
      customerId,
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      customerAddress: input.customerAddress?.trim() || '',
      customerIdProof: input.customerIdProof.trim(),
      branchId: currentStaff.branchId || 'BR-MUM-01',
      branchName: currentStaff.branchName || 'Mumbai Fort Flagship Branch',
      requestedAmount: Number(input.requestedAmount),
      declaredItemsDescription: input.declaredItemsDescription.trim() || 'Gold Jewellery items declared by borrower',
      status: 'AWAITING_APPRAISAL',
      createdAt: today,
      createdByStaffName: staffSignature,
      assignedAppraiserId: input.assignedAppraiserId || appraiser.id,
      assignedAppraiserName: appraiser.name,
    };

    setApplications((prev) => [newApp, ...prev]);

    logAudit(
      'APPLICATION_CREATED',
      'APPLICATION',
      appId,
      `New gold loan application created for ${newApp.customerName} (₹${newApp.requestedAmount.toLocaleString('en-IN')}). Queued to Appraiser.`,
      { requestedAmount: newApp.requestedAmount, branch: newApp.branchName }
    );

    return { success: true, application: newApp };
  };

  // =========================================================================
  // WORKFLOW STEP 2: Gold Appraisal & Assay
  // Role: Appraiser or Admin (Appraiser CANNOT approve or disburse their own appraisal)
  // =========================================================================
  const submitAppraisal = (applicationId: string, input: SubmitAppraisalInput): { success: boolean; application?: LoanApplication; error?: string } => {
    if (currentRole !== 'ADMIN' && currentRole !== 'APPRAISER') {
      return { success: false, error: 'Unauthorized: Only certified Gold Appraisers can record assay and valuation.' };
    }

    const app = applications.find((a) => a.id === applicationId);
    if (!app) return { success: false, error: 'Loan application not found.' };

    if (app.status !== 'AWAITING_APPRAISAL' && app.status !== 'RETURNED_FOR_CORRECTION') {
      return { success: false, error: `Invalid transition: Application status is "${app.status}". Only pending applications can be appraised.` };
    }

    if (!input.ornaments || input.ornaments.length === 0) {
      return { success: false, error: 'At least one gold ornament item must be assayed.' };
    }

    const totalGross = input.ornaments.reduce((acc, it) => acc + (Number(it.grossWeight) || 0), 0);
    const totalNet = input.ornaments.reduce((acc, it) => acc + (Number(it.netWeight) || 0), 0);
    const totalValuation = input.ornaments.reduce((acc, it) => acc + (Number(it.valuation) || 0), 0);

    if (totalNet <= 0 || totalValuation <= 0) {
      return { success: false, error: 'Total net weight and gold valuation must be greater than zero.' };
    }

    const maxSanctionEligible = Math.round((totalValuation * settings.maxLoanPercent) / 100);
    const valId = `VAL-${400 + appraisals.length + 1}`;
    const today = new Date().toISOString().split('T')[0];
    const appraiserSignature = `${currentStaff.name} (${currentStaff.role})`;

    const appraisalRecord: AppraisalRecord = {
      id: valId,
      applicationId: app.id,
      customerName: app.customerName,
      customerPhone: app.customerPhone,
      customerIdProof: app.customerIdProof,
      ornaments: input.ornaments,
      totalGrossWeight: Math.round(totalGross * 100) / 100,
      totalNetWeight: Math.round(totalNet * 100) / 100,
      totalValuation,
      maxSanctionEligible,
      appraisedBy: appraiserSignature,
      date: today,
      status: 'PENDING_SANCTION',
      notes: input.assayRemarks || 'Assay verified on karatmeter.',
    };

    setAppraisals((prev) => [appraisalRecord, ...prev]);

    const updatedApp: LoanApplication = {
      ...app,
      status: 'AWAITING_APPROVAL',
      appraisalId: valId,
      appraisalDetails: {
        ornaments: input.ornaments,
        totalGrossWeight: Math.round(totalGross * 100) / 100,
        totalNetWeight: Math.round(totalNet * 100) / 100,
        totalValuation,
        maxSanctionEligible,
        appraisedBy: appraiserSignature,
        appraisedAt: today,
        assayRemarks: input.assayRemarks || 'BIS Hallmark & karat tested.',
      },
    };

    setApplications((prev) => prev.map((a) => (a.id === app.id ? updatedApp : a)));

    // Create or update PendingApproval item for Branch Manager
    const approvalId = `APPV-${100 + approvals.length + 1}`;
    const newApproval: PendingApproval = {
      id: approvalId,
      type: 'LOAN_SANCTION',
      applicationId: app.id,
      customerName: app.customerName,
      customerPhone: app.customerPhone,
      amount: Math.min(app.requestedAmount, maxSanctionEligible),
      goldWeightGrams: Math.round(totalNet * 100) / 100,
      requestedBy: appraiserSignature,
      requestDate: today,
      reason: `Assay completed (${totalNet.toFixed(1)}g net gold, ₹${totalValuation.toLocaleString('en-IN')} value). 75% LTV cap ₹${maxSanctionEligible.toLocaleString('en-IN')}.`,
      status: 'PENDING',
    };
    setApprovals((prev) => [newApproval, ...prev]);

    logAudit(
      'APPRAISAL_SUBMITTED',
      'APPRAISAL',
      valId,
      `Appraisal completed for ${app.id} (${totalNet.toFixed(1)}g net gold, ₹${totalValuation.toLocaleString('en-IN')} valuation). Max eligible ₹${maxSanctionEligible.toLocaleString('en-IN')}. Forwarded to Branch Manager.`,
      { totalNetWeight: totalNet, totalValuation, maxSanctionEligible }
    );

    return { success: true, application: updatedApp };
  };

  // =========================================================================
  // WORKFLOW STEP 3: Loan Review & Approval / Rejection
  // Role: Branch Manager or Admin
  // =========================================================================
  const reviewApplication = (applicationId: string, input: ReviewApplicationInput): { success: boolean; application?: LoanApplication; error?: string } => {
    if (currentRole !== 'ADMIN' && currentRole !== 'BRANCH_MANAGER') {
      return { success: false, error: 'Unauthorized: Only Branch Managers and Administrators are permitted to sanction or reject loans.' };
    }

    const app = applications.find((a) => a.id === applicationId);
    if (!app) return { success: false, error: 'Loan application not found.' };

    if (app.status !== 'AWAITING_APPROVAL') {
      return { success: false, error: `Invalid transition: Application status is "${app.status}". Only applications awaiting approval can be reviewed.` };
    }

    if (!input.reason.trim()) {
      return { success: false, error: 'A valid review reason or manager notes is required for this decision.' };
    }

    const today = new Date().toISOString().split('T')[0];
    const managerSignature = `${currentStaff.name} (${currentStaff.role})`;

    let newStatus: LoanApplication['status'] = 'AWAITING_DISBURSEMENT';
    let sanctionedAmount = app.requestedAmount;
    const monthlyRate = Number(input.monthlyInterestRate) || settings.defaultMonthlyInterest;

    if (input.decision === 'APPROVED') {
      newStatus = 'AWAITING_DISBURSEMENT';
      const maxEligible = app.appraisalDetails?.maxSanctionEligible || app.requestedAmount;
      sanctionedAmount = Number(input.approvedAmount) || Math.min(app.requestedAmount, maxEligible);

      if (sanctionedAmount <= 0) {
        return { success: false, error: 'Sanctioned loan amount must be greater than zero.' };
      }
      if (sanctionedAmount > maxEligible) {
        return { success: false, error: `Approved amount ₹${sanctionedAmount.toLocaleString('en-IN')} exceeds 75% LTV ceiling of ₹${maxEligible.toLocaleString('en-IN')}.` };
      }
    } else if (input.decision === 'REJECTED') {
      newStatus = 'REJECTED';
    } else if (input.decision === 'RETURNED_FOR_CORRECTION') {
      newStatus = 'RETURNED_FOR_CORRECTION';
    }

    const updatedApp: LoanApplication = {
      ...app,
      status: newStatus,
      approvalDecision: {
        decision: input.decision,
        approvedAmount: sanctionedAmount,
        monthlyInterestRate: monthlyRate,
        approvedByStaffName: managerSignature,
        decidedAt: today,
        notes: input.reason.trim(),
      },
    };

    setApplications((prev) => prev.map((a) => (a.id === app.id ? updatedApp : a)));

    // Update PendingApproval status
    setApprovals((prev) =>
      prev.map((a) =>
        a.applicationId === app.id
          ? {
              ...a,
              status: input.decision === 'APPROVED' ? ('APPROVED' as const) : ('REJECTED' as const),
              decidedBy: managerSignature,
              decidedDate: today,
              decisionNotes: input.reason.trim(),
            }
          : a
      )
    );

    // Update Appraisal Record status
    if (app.appraisalId) {
      setAppraisals((prev) =>
        prev.map((val) =>
          val.id === app.appraisalId
            ? { ...val, status: input.decision === 'APPROVED' ? ('SANCTIONED' as const) : ('REJECTED' as const) }
            : val
        )
      );
    }

    logAudit(
      `LOAN_${input.decision}`,
      'APPROVAL',
      app.id,
      `Manager decision: ${input.decision} for ${app.id} (${app.customerName}). Reason: ${input.reason}. Approved amount: ₹${sanctionedAmount.toLocaleString('en-IN')}.`,
      { decision: input.decision, sanctionedAmount, manager: managerSignature }
    );

    return { success: true, application: updatedApp };
  };

  // =========================================================================
  // WORKFLOW STEP 4: Loan Disbursement
  // Role: Cashier or Admin (Cashier CANNOT modify approved appraisal or terms)
  // =========================================================================
  const disburseLoan = (applicationId: string, input: DisburseLoanInput): { success: boolean; loan?: Loan; error?: string } => {
    if (currentRole !== 'ADMIN' && currentRole !== 'CASHIER') {
      return { success: false, error: 'Unauthorized: Only Cashiers and counter tellers are authorized to disburse funds.' };
    }

    const app = applications.find((a) => a.id === applicationId);
    if (!app) return { success: false, error: 'Loan application not found.' };

    if (app.status !== 'AWAITING_DISBURSEMENT' && app.status !== 'APPROVED') {
      return { success: false, error: `Disbursement blocked: Application status is "${app.status}". Only approved loans can be disbursed.` };
    }

    if (!app.approvalDecision || app.approvalDecision.decision !== 'APPROVED') {
      return { success: false, error: 'Disbursement blocked: Application has not been officially approved by the Branch Manager.' };
    }

    const approvedAmount = app.approvalDecision.approvedAmount;
    const disburseAmount = Number(input.disbursedAmount);

    if (disburseAmount <= 0) {
      return { success: false, error: 'Disbursement amount must be greater than zero.' };
    }
    if (disburseAmount > approvedAmount) {
      return { success: false, error: `Disbursement blocked: Disbursing ₹${disburseAmount.toLocaleString('en-IN')} exceeds the manager-approved limit of ₹${approvedAmount.toLocaleString('en-IN')}.` };
    }

    if (!input.paymentMethod) {
      return { success: false, error: 'Payment method is required for disbursement audit.' };
    }

    const today = new Date().toISOString().split('T')[0];
    const nextLoanNum = 1000 + loans.length + 1;
    const loanId = `LN-${nextLoanNum}`;
    const cashierSignature = `${currentStaff.name} (${currentStaff.role})`;

    // Monthly interest calculation
    const monthlyRate = app.approvalDecision.monthlyInterestRate || settings.defaultMonthlyInterest;
    const monthlyInterestAmt = Math.round((disburseAmount * monthlyRate) / 100);

    const d = new Date(today);
    d.setMonth(d.getMonth() + 1);
    const dueDate = d.toISOString().split('T')[0];

    // Convert appraisal ornaments into GoldItems
    const goldItems: GoldItem[] = (app.appraisalDetails?.ornaments || []).map((orn, idx) => ({
      id: `ITEM-${idx + 1}`,
      name: orn.name,
      grossWeight: orn.grossWeight,
      netWeight: orn.netWeight,
      purity: orn.purity,
      estimatedValue: orn.valuation,
    }));

    const totalWeight = app.appraisalDetails?.totalNetWeight || 0;
    const totalGoldValue = app.appraisalDetails?.totalValuation || 0;

    const newLoan: Loan = {
      id: loanId,
      applicationId: app.id,
      customerName: app.customerName,
      customerPhone: app.customerPhone,
      customerAddress: app.customerAddress,
      customerIdProof: app.customerIdProof,
      goldItems,
      totalWeightGrams: totalWeight,
      goldValueTotal: totalGoldValue,
      loanAmount: disburseAmount,
      remainingPrincipal: disburseAmount,
      monthlyInterestRate: monthlyRate,
      monthlyInterestAmount: monthlyInterestAmt,
      interestDue: 0,
      totalInterestPaid: 0,
      safePacketNumber: `Safe-A / Packet #${nextLoanNum}`,
      safeStatus: 'Pending Vaulting', // Must be confirmed and locked in safe vault in Step 5
      loanDate: today,
      dueDate,
      status: 'Disbursed',
      notes: input.notes || `Disbursed via ${input.paymentMethod} (Ref: ${input.transactionReference || 'N/A'})`,
      createdByStaffName: app.createdByStaffName,
      appraisedByStaffName: app.appraisalDetails?.appraisedBy || 'Rameshwar Patil (Appraiser)',
      disbursedByStaffName: cashierSignature,
      disbursementMethod: input.paymentMethod,
      disbursementReference: input.transactionReference,
    };

    // Transactional updates: Loan created, Application updated, DayBook debited, Customer stats updated
    setLoans((prev) => [newLoan, ...prev]);

    const updatedApp: LoanApplication = {
      ...app,
      status: 'DISBURSED',
      linkedLoanId: loanId,
      disbursementDetails: {
        disbursedAmount: disburseAmount,
        paymentMethod: input.paymentMethod,
        transactionReference: input.transactionReference || `TXN-${Date.now()}`,
        disbursedByStaffName: cashierSignature,
        disbursedAt: today,
      },
    };
    setApplications((prev) => prev.map((a) => (a.id === app.id ? updatedApp : a)));

    // Daybook cash/bank outflow
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dayBookEntry: DayBookEntry = {
      id: `DB-${Date.now()}`,
      time: timeStr,
      type: 'LOAN_DISBURSED',
      description: `Loan Disbursed to ${app.customerName} (${totalWeight.toFixed(1)}g gold) - Ref: ${input.transactionReference || 'Counter Cash'}`,
      amount: disburseAmount,
      direction: 'OUT',
      paymentMethod: input.paymentMethod,
      loanId,
      customerName: app.customerName,
      staffName: cashierSignature,
    };
    setDayBook((prev) => [dayBookEntry, ...prev]);

    // Update Customer statistics
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.phone.replace(/\D/g, '') === app.customerPhone.replace(/\D/g, '')) {
          return {
            ...c,
            totalLoansCount: c.totalLoansCount + 1,
            activeLoansCount: c.activeLoansCount + 1,
            totalBorrowed: c.totalBorrowed + disburseAmount,
          };
        }
        return c;
      })
    );

    logAudit(
      'LOAN_DISBURSED',
      'LOAN',
      loanId,
      `Disbursed ₹${disburseAmount.toLocaleString('en-IN')} to ${app.customerName} via ${input.paymentMethod}. Daybook debited. Awaiting safe vault placement.`,
      { amount: disburseAmount, method: input.paymentMethod, ref: input.transactionReference }
    );

    return { success: true, loan: newLoan };
  };

  // =========================================================================
  // WORKFLOW STEP 5: Gold Security & Loan Activation
  // Role: Authorized safe/locker staff or Branch Manager
  // =========================================================================
  const secureGoldAndActivateLoan = (loanId: string, input: VaultSecurityInput): { success: boolean; loan?: Loan; error?: string } => {
    if (currentRole === 'CUSTOMER' || currentRole === 'APPRAISER') {
      return { success: false, error: 'Unauthorized: Safe vault access and dual-custody verification restricted to authorized vault staff and managers.' };
    }

    const targetLoan = loans.find((l) => l.id === loanId);
    if (!targetLoan) return { success: false, error: 'Loan record not found.' };

    if (!input.safePacketNumber.trim()) return { success: false, error: 'Unique safe packet identifier is required.' };
    if (!input.lockerBay.trim()) return { success: false, error: 'Locker bay location is mandatory.' };

    const today = new Date().toISOString().split('T')[0];
    const custodianSignature = `${currentStaff.name} (${currentStaff.role})`;

    const updatedLoan: Loan = {
      ...targetLoan,
      safePacketNumber: input.safePacketNumber.trim(),
      safeStatus: 'In Safe',
      status: 'Active', // Fully activated after both disbursement & vault lock
      vaultedByStaffName: custodianSignature,
    };

    setLoans((prev) => prev.map((l) => (l.id === loanId ? updatedLoan : l)));

    // Update linked application to ACTIVATED
    if (targetLoan.applicationId) {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === targetLoan.applicationId
            ? {
                ...a,
                status: 'ACTIVATED',
                custodyDetails: {
                  safePacketNumber: input.safePacketNumber.trim(),
                  lockerLocation: input.lockerBay.trim(),
                  securedByStaffName: custodianSignature,
                  securedAt: today,
                },
              }
            : a
        )
      );
    }

    // Record custody movement
    const custodyEntry: CustodyLogEntry = {
      id: `CUST-L-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      loanId,
      safePacketNumber: input.safePacketNumber.trim(),
      lockerBay: input.lockerBay.trim(),
      action: 'VAULT_STORED',
      custodianStaffName: custodianSignature,
      notes: input.notes || 'Pouch inspected, sealed, and locked in dual-custody safe.',
    };
    setCustodyLogs((prev) => [custodyEntry, ...prev]);

    logAudit(
      'GOLD_VAULTED_AND_ACTIVATED',
      'CUSTODY',
      loanId,
      `Pledged gold packet "${input.safePacketNumber}" securely locked in ${input.lockerBay}. Loan ${loanId} is now officially Active.`,
      { packet: input.safePacketNumber, bay: input.lockerBay, custodian: custodianSignature }
    );

    return { success: true, loan: updatedLoan };
  };

  // =========================================================================
  // WORKFLOW STEP 7: Repayments & Loan Closure (with Manager Collateral Clearance)
  // Role: Cashier for payments; Manager for release clearance; Cashier for handover
  // =========================================================================
  const authorizeCollateralRelease = (loanId: string, reason?: string): { success: boolean; error?: string } => {
    if (currentRole !== 'ADMIN' && currentRole !== 'BRANCH_MANAGER') {
      return { success: false, error: 'Unauthorized: Collateral release authorization strictly requires Branch Manager sign-off.' };
    }

    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return { success: false, error: 'Loan not found.' };

    if (loan.remainingPrincipal > 0) {
      return { success: false, error: `Authorization blocked: Loan balance of ₹${loan.remainingPrincipal.toLocaleString('en-IN')} is still pending.` };
    }

    const managerSignature = `${currentStaff.name} (${currentStaff.role})`;
    const today = new Date().toISOString().split('T')[0];

    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, safeStatus: 'Release Authorized' as const } : l))
    );

    // Update approvals
    setApprovals((prev) =>
      prev.map((app) =>
        app.loanId === loanId && app.type === 'COLLATERAL_RELEASE'
          ? { ...app, status: 'APPROVED' as const, decidedBy: managerSignature, decidedDate: today }
          : app
      )
    );

    // Record custody movement
    const custodyEntry: CustodyLogEntry = {
      id: `CUST-L-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      loanId,
      safePacketNumber: loan.safePacketNumber,
      lockerBay: 'Vault',
      action: 'RELEASE_AUTHORIZED',
      custodianStaffName: managerSignature,
      notes: reason || 'Managerial clearance verified: 100% principal & interest cleared.',
    };
    setCustodyLogs((prev) => [custodyEntry, ...prev]);

    logAudit(
      'COLLATERAL_RELEASE_AUTHORIZED',
      'APPROVAL',
      loanId,
      `Branch Manager authorized physical collateral release for ${loan.id} (${loan.customerName}).`,
      { manager: managerSignature, packet: loan.safePacketNumber }
    );

    return { success: true };
  };

  const releaseGoldToCustomer = (loanId: string, input?: { notes?: string }): { success: boolean; loan?: Loan; error?: string } => {
    if (currentRole === 'CUSTOMER') {
      return { success: false, error: 'Unauthorized: Physical collateral handover must be executed by counter staff.' };
    }

    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return { success: false, error: 'Loan not found.' };

    if (loan.remainingPrincipal > 0) {
      return { success: false, error: `Cannot return gold: Loan has ₹${loan.remainingPrincipal.toLocaleString('en-IN')} remaining balance.` };
    }

    if (loan.safeStatus !== 'Release Authorized') {
      return {
        success: false,
        error: 'Collateral release blocked: Branch Manager authorization is required before opening safe vault and releasing gold.',
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const staffSignature = `${currentStaff.name} (${currentStaff.role})`;

    const updatedLoan: Loan = {
      ...loan,
      safeStatus: 'Returned to Customer',
      status: 'Closed',
      returnedDate: today,
      vaultedByStaffName: `Released by ${staffSignature}`,
    };

    setLoans((prev) => prev.map((l) => (l.id === loanId ? updatedLoan : l)));

    // Record custody movement
    const custodyEntry: CustodyLogEntry = {
      id: `CUST-L-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      loanId,
      safePacketNumber: loan.safePacketNumber,
      lockerBay: 'Handover Counter',
      action: 'RETURNED_TO_CUSTOMER',
      custodianStaffName: staffSignature,
      notes: input?.notes || 'Customer identity verified, gold weighed, acknowledged, and returned.',
    };
    setCustodyLogs((prev) => [custodyEntry, ...prev]);

    logAudit(
      'GOLD_RETURNED_TO_CUSTOMER',
      'CUSTODY',
      loanId,
      `Pledged gold packet ${loan.safePacketNumber} (${loan.totalWeightGrams}g) returned to ${loan.customerName}. Loan officially Closed.`,
      { packet: loan.safePacketNumber, staff: staffSignature }
    );

    return { success: true, loan: updatedLoan };
  };

  // Direct Give New Loan (Legacy fallback with complete audit)
  const giveNewLoan = (input: GiveLoanInput): Loan => {
    const nextLoanNum = 1000 + loans.length + 1;
    const loanId = `LN-${nextLoanNum}`;
    const today = input.loanDate || new Date().toISOString().split('T')[0];

    const d = new Date(today);
    d.setMonth(d.getMonth() + 1);
    const dueDate = d.toISOString().split('T')[0];

    const totalWeight = input.goldItems.reduce((acc, it) => acc + (Number(it.netWeight) || 0), 0);
    const totalGoldValue = input.goldItems.reduce((acc, it) => acc + (Number(it.estimatedValue) || 0), 0);
    const monthlyRate = Number(input.monthlyInterestRate) || settings.defaultMonthlyInterest;
    const monthlyInterestAmt = Math.round((input.loanAmount * monthlyRate) / 100);

    const staffSignature = `${currentStaff.name} (${currentStaff.role})`;

    const newLoan: Loan = {
      id: loanId,
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      customerAddress: input.customerAddress?.trim() || '',
      customerIdProof: input.customerIdProof?.trim() || 'Aadhaar / ID Verified',
      goldItems: input.goldItems,
      totalWeightGrams: Math.round(totalWeight * 100) / 100,
      goldValueTotal: totalGoldValue,
      loanAmount: input.loanAmount,
      remainingPrincipal: input.loanAmount,
      monthlyInterestRate: monthlyRate,
      monthlyInterestAmount: monthlyInterestAmt,
      interestDue: 0,
      totalInterestPaid: 0,
      safePacketNumber: input.safePacketNumber.trim() || `Safe-A / P-${nextLoanNum}`,
      safeStatus: 'In Safe',
      loanDate: today,
      dueDate: dueDate,
      status: 'Active',
      notes: input.notes || '',
      createdByStaffName: staffSignature,
      appraisedByStaffName: input.appraiserStaffName || 'Rameshwar Patil (Appraiser)',
      vaultedByStaffName: 'Suresh Menon (Custodian)',
    };

    setLoans((prev) => [newLoan, ...prev]);

    setCustomers((prev) => {
      const existing = prev.find(
        (c) => c.phone.replace(/\D/g, '') === input.customerPhone.replace(/\D/g, '')
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalLoansCount: c.totalLoansCount + 1,
                activeLoansCount: c.activeLoansCount + 1,
                totalBorrowed: c.totalBorrowed + input.loanAmount,
              }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `CUST-${prev.length + 101}`,
          name: input.customerName.trim(),
          phone: input.customerPhone.trim(),
          address: input.customerAddress?.trim() || '',
          idProof: input.customerIdProof?.trim() || 'ID Verified',
          totalLoansCount: 1,
          activeLoansCount: 1,
          totalBorrowed: input.loanAmount,
          totalRepaid: 0,
          createdAt: today,
        };
        return [newCust, ...prev];
      }
    });

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dayBookEntry: DayBookEntry = {
      id: `DB-${Date.now()}`,
      time: timeStr,
      type: 'LOAN_GIVEN',
      description: `Loan Given to ${input.customerName} (${totalWeight.toFixed(1)}g gold)`,
      amount: input.loanAmount,
      direction: 'OUT',
      paymentMethod: input.paymentMethod || 'Cash',
      loanId: loanId,
      customerName: input.customerName,
      staffName: staffSignature,
    };
    setDayBook((prev) => [dayBookEntry, ...prev]);

    logAudit(
      'DIRECT_LOAN_GIVEN',
      'LOAN',
      loanId,
      `Direct loan sanctioned to ${input.customerName} (₹${input.loanAmount.toLocaleString('en-IN')}).`,
      { amount: input.loanAmount }
    );

    return newLoan;
  };

  // Record Payment
  const recordPayment = (input: RecordPaymentInput): Payment => {
    const loan = loans.find((l) => l.id === input.loanId);
    if (!loan) throw new Error('Loan not found');

    const totalPaid = Number(input.principalPaid || 0) + Number(input.interestPaid || 0);
    const remainingPrincipalAfter = Math.max(0, loan.remainingPrincipal - Number(input.principalPaid || 0));
    const nextReceiptNum = 1000 + payments.length + 1;
    const receiptNumber = `REC-${nextReceiptNum}`;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const staffSignature = currentRole === 'CUSTOMER' ? 'Online Customer Portal' : `${currentStaff.name} (${currentStaff.role})`;

    const newPayment: Payment = {
      id: `PAY-${Date.now()}`,
      receiptNumber: receiptNumber,
      loanId: loan.id,
      customerName: loan.customerName,
      customerPhone: loan.customerPhone,
      paymentDate: today,
      paymentTime: timeStr,
      principalPaid: Number(input.principalPaid || 0),
      interestPaid: Number(input.interestPaid || 0),
      totalPaid: totalPaid,
      remainingPrincipalAfter: remainingPrincipalAfter,
      paymentType: input.paymentType,
      paymentMethod: input.paymentMethod,
      notes: input.notes || '',
      receivedByStaffName: staffSignature,
    };

    setPayments((prev) => [newPayment, ...prev]);

    const isFullySettled = remainingPrincipalAfter === 0;

    // Update Loan
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id !== loan.id) return l;

        const updatedInterestDue = Math.max(0, l.interestDue - Number(input.interestPaid || 0));
        const updatedMonthlyInterestAmt = Math.round((remainingPrincipalAfter * l.monthlyInterestRate) / 100);

        let updatedDueDate = l.dueDate;
        if (Number(input.interestPaid) >= l.monthlyInterestAmount && l.monthlyInterestAmount > 0) {
          const d = new Date(l.dueDate);
          d.setMonth(d.getMonth() + 1);
          updatedDueDate = d.toISOString().split('T')[0];
        }

        return {
          ...l,
          remainingPrincipal: remainingPrincipalAfter,
          monthlyInterestAmount: updatedMonthlyInterestAmt,
          interestDue: updatedInterestDue,
          totalInterestPaid: l.totalInterestPaid + Number(input.interestPaid || 0),
          lastPaymentDate: today,
          dueDate: updatedDueDate,
          status: isFullySettled ? 'Fully Paid' : l.status === 'Disbursed' ? 'Active' : l.status,
          safeStatus: isFullySettled ? 'Release Pending Approval' : l.safeStatus,
          closedDate: isFullySettled ? today : undefined,
        };
      })
    );

    // If fully settled, automatically trigger Collateral Release approval for Branch Manager
    if (isFullySettled) {
      const releaseApproval: PendingApproval = {
        id: `APPV-REL-${Date.now()}`,
        type: 'COLLATERAL_RELEASE',
        loanId: loan.id,
        customerName: loan.customerName,
        customerPhone: loan.customerPhone,
        amount: 0,
        goldWeightGrams: loan.totalWeightGrams,
        requestedBy: staffSignature,
        requestDate: today,
        reason: `Full settlement paid via receipt ${receiptNumber}. Managerial authorization requested to release gold packet "${loan.safePacketNumber}".`,
        status: 'PENDING',
      };
      setApprovals((prev) => [releaseApproval, ...prev]);
    }

    // Update customer stats
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.phone.replace(/\D/g, '') === loan.customerPhone.replace(/\D/g, '')) {
          return {
            ...c,
            activeLoansCount: isFullySettled ? Math.max(0, c.activeLoansCount - 1) : c.activeLoansCount,
            totalRepaid: c.totalRepaid + Number(input.principalPaid || 0),
          };
        }
        return c;
      })
    );

    // Record in daybook
    const dayBookEntry: DayBookEntry = {
      id: `DB-${Date.now()}`,
      time: timeStr,
      type: 'PAYMENT_RECEIVED',
      description: `Payment received for ${loan.id} (${loan.customerName}) - ${input.paymentType}`,
      amount: totalPaid,
      direction: 'IN',
      paymentMethod: input.paymentMethod,
      loanId: loan.id,
      customerName: loan.customerName,
      staffName: staffSignature,
    };
    setDayBook((prev) => [dayBookEntry, ...prev]);

    logAudit(
      'PAYMENT_RECORDED',
      'PAYMENT',
      receiptNumber,
      `Payment of ₹${totalPaid.toLocaleString('en-IN')} received for ${loan.id} (${input.paymentType}). Remaining balance: ₹${remainingPrincipalAfter.toLocaleString('en-IN')}.`,
      { totalPaid, principal: input.principalPaid, interest: input.interestPaid, remaining: remainingPrincipalAfter }
    );

    return newPayment;
  };

  const returnGold = (loanId: string): Loan | null => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return null;
    if (loan.remainingPrincipal > 0) return null;

    const today = new Date().toISOString().split('T')[0];
    const staffSignature = `${currentStaff.name} (${currentStaff.role})`;

    let updatedLoan: Loan | null = null;
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          updatedLoan = {
            ...l,
            safeStatus: 'Returned to Customer',
            status: 'Closed',
            returnedDate: today,
            vaultedByStaffName: `Released by ${staffSignature}`,
          };
          return updatedLoan;
        }
        return l;
      })
    );

    return updatedLoan;
  };

  const updateSettings = (newSettings: ShopSettings) => {
    setSettings(newSettings);
  };

  const addDayBookEntry = (entry: Omit<DayBookEntry, 'id' | 'time'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fullEntry: DayBookEntry = {
      ...entry,
      id: `DB-${Date.now()}`,
      time: timeStr,
      staffName: `${currentStaff.name} (${currentStaff.role})`,
    };
    setDayBook((prev) => [fullEntry, ...prev]);
  };

  const resetToDefaultData = () => {
    if (window.confirm('Reset all loans, applications, and settings to default factory state?')) {
      localStorage.removeItem(STORAGE_KEY_LOANS);
      localStorage.removeItem(STORAGE_KEY_PAYMENTS);
      localStorage.removeItem(STORAGE_KEY_CUSTOMERS);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      localStorage.removeItem(STORAGE_KEY_DAYBOOK);
      localStorage.removeItem(STORAGE_KEY_STAFF);
      localStorage.removeItem(STORAGE_KEY_CURRENT_STAFF);
      localStorage.removeItem(STORAGE_KEY_BRANCHES);
      localStorage.removeItem(STORAGE_KEY_APPROVALS);
      localStorage.removeItem(STORAGE_KEY_APPRAISALS);
      localStorage.removeItem(STORAGE_KEY_ROLE);
      localStorage.removeItem(STORAGE_KEY_CUSTOMER);
      localStorage.removeItem(STORAGE_KEY_SIDEBAR);
      localStorage.removeItem(STORAGE_KEY_APPLICATIONS);
      localStorage.removeItem(STORAGE_KEY_AUDIT_LOGS);
      localStorage.removeItem(STORAGE_KEY_CUSTODY_LOGS);

      setLoans(INITIAL_LOANS);
      setPayments(INITIAL_PAYMENTS);
      setCustomers(INITIAL_CUSTOMERS);
      setSettings(INITIAL_SHOP_SETTINGS);
      setDayBook(INITIAL_DAYBOOK);
      setStaffUsers(INITIAL_STAFF);
      setCurrentStaff(INITIAL_STAFF[0]);
      setBranches(INITIAL_BRANCHES);
      setApprovals(INITIAL_APPROVALS);
      setAppraisals(INITIAL_APPRAISALS);
      setApplications(INITIAL_APPLICATIONS);
      setAuditLogs(INITIAL_AUDIT_LOGS);
      setCustodyLogs(INITIAL_CUSTODY_LOGS);
      setCurrentRoleState('ADMIN');
      setCurrentCustomer(INITIAL_CUSTOMERS[0]);
      setIsSidebarCollapsed(false);
    }
  };

  // =========================================================================
  // STRICT CUSTOMER-LEVEL DATA ISOLATION
  // Customers cannot query or inspect other customers' records
  // =========================================================================
  const isCustomerSession = currentRole === 'CUSTOMER';
  const cleanCurrentCustPhone = currentCustomer?.phone ? currentCustomer.phone.replace(/\D/g, '') : '';
  const currentCustNameLower = currentCustomer?.name ? currentCustomer.name.toLowerCase() : '';

  const visibleLoans = isCustomerSession
    ? loans.filter(
        (l) =>
          (cleanCurrentCustPhone && l.customerPhone.replace(/\D/g, '') === cleanCurrentCustPhone) ||
          (currentCustNameLower && l.customerName.toLowerCase() === currentCustNameLower)
      )
    : loans;

  const visibleApplications = isCustomerSession
    ? applications.filter(
        (a) =>
          (cleanCurrentCustPhone && a.customerPhone.replace(/\D/g, '') === cleanCurrentCustPhone) ||
          (currentCustNameLower && a.customerName.toLowerCase() === currentCustNameLower)
      )
    : applications;

  const visiblePayments = isCustomerSession
    ? payments.filter(
        (p) =>
          (cleanCurrentCustPhone && p.customerPhone.replace(/\D/g, '') === cleanCurrentCustPhone) ||
          (currentCustNameLower && p.customerName.toLowerCase() === currentCustNameLower)
      )
    : payments;

  const visibleApprovals = isCustomerSession ? [] : approvals;
  const visibleAuditLogs = isCustomerSession ? [] : auditLogs;
  const visibleCustodyLogs = isCustomerSession ? [] : custodyLogs;

  return (
    <FinanceContext.Provider
      value={{
        loans: visibleLoans,
        rawLoans: loans,
        payments: visiblePayments,
        customers,
        settings,
        dayBook,
        staffUsers,
        currentStaff,
        currentRole,
        setCurrentRole,
        currentCustomer,
        setCurrentCustomer,
        isAuthenticated,
        login,
        logout,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        branches,
        approvals: visibleApprovals,
        approveRequest,
        rejectRequest,
        appraisals,
        addAppraisal,
        applications: visibleApplications,
        auditLogs: visibleAuditLogs,
        custodyLogs: visibleCustodyLogs,
        createLoanApplication,
        submitAppraisal,
        reviewApplication,
        disburseLoan,
        secureGoldAndActivateLoan,
        authorizeCollateralRelease,
        releaseGoldToCustomer,
        searchQuery,
        setSearchQuery,
        giveNewLoan,
        recordPayment,
        returnGold,
        updateSettings,
        addDayBookEntry,
        resetToDefaultData,
        switchStaff,
        addStaffUser,
        updateStaffUser,
        isStaffModalOpen,
        setIsStaffModalOpen,
        isNewLoanModalOpen,
        setIsNewLoanModalOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        selectedLoanForPayment,
        setSelectedLoanForPayment,
        activePrintModal,
        setActivePrintModal,
        selectedLoanForPrint,
        setSelectedLoanForPrint,
        selectedPaymentForPrint,
        setSelectedPaymentForPrint,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
