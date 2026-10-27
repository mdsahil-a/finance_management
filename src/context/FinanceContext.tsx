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
  StaffRole,
} from '../types/finance';
import {
  INITIAL_SHOP_SETTINGS,
  INITIAL_CUSTOMERS,
  INITIAL_LOANS,
  INITIAL_PAYMENTS,
  INITIAL_DAYBOOK,
  INITIAL_STAFF,
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

interface FinanceContextType {
  loans: Loan[];
  payments: Payment[];
  customers: Customer[];
  settings: ShopSettings;
  dayBook: DayBookEntry[];
  staffUsers: StaffUser[];
  currentStaff: StaffUser;

  // Global search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Actions
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
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
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

  const [searchQuery, setSearchQuery] = useState('');

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
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOANS, JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DAYBOOK, JSON.stringify(dayBook));
  }, [dayBook]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(staffUsers));
  }, [staffUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CURRENT_STAFF, JSON.stringify(currentStaff));
  }, [currentStaff]);

  // Switch Staff
  const switchStaff = (staffId: string) => {
    const target = staffUsers.find((s) => s.id === staffId);
    if (target) {
      setCurrentStaff(target);
    }
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

  // Give New Loan
  const giveNewLoan = (input: GiveLoanInput): Loan => {
    const nextLoanNum = 1000 + loans.length + 1;
    const loanId = `LN-${nextLoanNum}`;
    const today = input.loanDate || new Date().toISOString().split('T')[0];

    // Due date (1 month from today for monthly interest)
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

    // Update or add customer
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

    // Add to daybook
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
    const staffSignature = `${currentStaff.name} (${currentStaff.role})`;

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

    // Update Loan
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id !== loan.id) return l;

        const isFullySettled = remainingPrincipalAfter === 0;
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
          status: isFullySettled ? 'Fully Paid' : 'Active',
          closedDate: isFullySettled ? today : undefined,
        };
      })
    );

    // Update customer stats
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.phone.replace(/\D/g, '') === loan.customerPhone.replace(/\D/g, '')) {
          const isFullySettled = remainingPrincipalAfter === 0;
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

    return newPayment;
  };

  // Return Gold
  const returnGold = (loanId: string): Loan | null => {
    let updatedLoan: Loan | null = null;
    const today = new Date().toISOString().split('T')[0];
    const staffSignature = `${currentStaff.name} (${currentStaff.role})`;

    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          updatedLoan = {
            ...l,
            safeStatus: 'Returned to Customer',
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
    if (window.confirm('Reset all loans and data to default sample?')) {
      localStorage.removeItem(STORAGE_KEY_LOANS);
      localStorage.removeItem(STORAGE_KEY_PAYMENTS);
      localStorage.removeItem(STORAGE_KEY_CUSTOMERS);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      localStorage.removeItem(STORAGE_KEY_DAYBOOK);
      localStorage.removeItem(STORAGE_KEY_STAFF);
      localStorage.removeItem(STORAGE_KEY_CURRENT_STAFF);
      setLoans(INITIAL_LOANS);
      setPayments(INITIAL_PAYMENTS);
      setCustomers(INITIAL_CUSTOMERS);
      setSettings(INITIAL_SHOP_SETTINGS);
      setDayBook(INITIAL_DAYBOOK);
      setStaffUsers(INITIAL_STAFF);
      setCurrentStaff(INITIAL_STAFF[0]);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        loans,
        payments,
        customers,
        settings,
        dayBook,
        staffUsers,
        currentStaff,
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
