export type GoldPurity = '22K' | '24K' | '18K';

export type StaffRole = 
  | 'ADMIN' 
  | 'MANAGER' 
  | 'LOAN_OFFICER' 
  | 'APPRAISER' 
  | 'CASHIER' 
  | 'CUSTODIAN';

export interface StaffUser {
  id: string; // e.g. "STAFF-01"
  name: string;
  role: StaffRole;
  phone: string;
  email?: string;
  pin: string; // 4-digit quick pin e.g. "1234"
  isActive: boolean;
  joinedDate: string;
}

export interface GoldItem {
  id: string;
  name: string; // e.g. "Gold Necklace", "2 Gold Bangles", "Gold Ring"
  grossWeight: number; // in grams
  netWeight: number; // in grams (after deducting stones/wax)
  purity: GoldPurity;
  estimatedValue: number; // in Rupees
}

export type LoanStatus = 'Active' | 'Due Soon' | 'Overdue' | 'Fully Paid';
export type SafeStatus = 'In Safe' | 'Returned to Customer';

export interface Loan {
  id: string; // e.g. "LN-1001"
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerIdProof: string; // e.g. "Aadhaar: 4892-XXXX-1024" or "Voter ID"
  goldItems: GoldItem[];
  totalWeightGrams: number;
  goldValueTotal: number;
  loanAmount: number; // original loan amount
  remainingPrincipal: number; // current principal remaining
  monthlyInterestRate: number; // e.g. 1.5% per month
  monthlyInterestAmount: number; // monthly interest in Rupees
  interestDue: number; // current unpaid interest in Rupees
  totalInterestPaid: number;
  safePacketNumber: string; // e.g. "Box-A / P-101"
  safeStatus: SafeStatus;
  loanDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  lastPaymentDate?: string;
  status: LoanStatus;
  closedDate?: string;
  returnedDate?: string;
  notes?: string;
  createdByStaffName?: string;
  appraisedByStaffName?: string;
  vaultedByStaffName?: string;
}

export type PaymentType = 'Interest Only' | 'Part Loan' | 'Full Settlement';
export type PaymentMethod = 'Cash' | 'UPI / GPay' | 'Bank Transfer';

export interface Payment {
  id: string;
  receiptNumber: string; // e.g. "REC-5021"
  loanId: string;
  customerName: string;
  customerPhone: string;
  paymentDate: string; // YYYY-MM-DD
  paymentTime: string; // HH:mm
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  remainingPrincipalAfter: number;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  notes?: string;
  receivedByStaffName?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  idProof: string;
  totalLoansCount: number;
  activeLoansCount: number;
  totalBorrowed: number;
  totalRepaid: number;
  createdAt: string;
}

export interface ShopSettings {
  shopName: string;
  shopPhone: string;
  shopAddress: string;
  receiptFooterNote: string;
  goldRate24K: number; // per gram
  goldRate22K: number; // per gram
  goldRate18K: number; // per gram
  defaultMonthlyInterest: number; // % per month (e.g. 1.5)
  maxLoanPercent: number; // % of gold value (e.g. 75)
  currency: string;
}

export interface DayBookEntry {
  id: string;
  time: string;
  type: 'LOAN_GIVEN' | 'PAYMENT_RECEIVED' | 'CASH_ADDED' | 'EXPENSE';
  description: string;
  amount: number;
  direction: 'IN' | 'OUT';
  paymentMethod: PaymentMethod | 'Cash' | 'Direct';
  loanId?: string;
  customerName?: string;
  staffName?: string;
}
