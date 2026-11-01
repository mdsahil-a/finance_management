export type GoldPurity = '22K' | '24K' | '18K';

export type AppRole = 'ADMIN' | 'BRANCH_MANAGER' | 'APPRAISER' | 'CASHIER' | 'CUSTOMER';

export type StaffRole = 
  | 'ADMIN' 
  | 'MANAGER' 
  | 'BRANCH_MANAGER'
  | 'LOAN_OFFICER' 
  | 'APPRAISER' 
  | 'CASHIER' 
  | 'CUSTODIAN'
  | 'CUSTOMER';

export interface StaffUser {
  id: string; // e.g. "STAFF-01"
  name: string;
  role: StaffRole;
  phone: string;
  email?: string;
  username?: string;
  password?: string;
  pin: string; // 4-digit quick pin e.g. "1234"
  isActive: boolean;
  joinedDate: string;
  branchId?: string;
  branchName?: string;
}

export interface BranchInfo {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  managerName: string;
  activeLoansCount: number;
  totalVaultGoldGrams: number;
  totalDisbursed: number;
  monthlyCollection: number;
  isActive: boolean;
}

export type ApplicationStatus =
  | 'APPLICATION_SUBMITTED'
  | 'AWAITING_APPRAISAL'
  | 'APPRAISED'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'RETURNED_FOR_CORRECTION'
  | 'AWAITING_DISBURSEMENT'
  | 'DISBURSED'
  | 'ACTIVATED'
  | 'CLOSED';

export interface LoanApplication {
  id: string; // e.g. "APP-1001"
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerIdProof: string;
  branchId: string;
  branchName: string;
  requestedAmount: number;
  declaredItemsDescription: string;
  status: ApplicationStatus;
  createdAt: string;
  createdByStaffName: string;
  assignedAppraiserId?: string;
  assignedAppraiserName?: string;
  appraisalId?: string;
  appraisalDetails?: {
    ornaments: Array<{
      name: string;
      grossWeight: number;
      stoneWeight: number;
      netWeight: number;
      purity: GoldPurity;
      ratePerGram: number;
      valuation: number;
    }>;
    totalGrossWeight: number;
    totalNetWeight: number;
    totalValuation: number;
    maxSanctionEligible: number;
    appraisedBy: string;
    appraisedAt: string;
    assayRemarks?: string;
  };
  approvalDecision?: {
    decision: 'APPROVED' | 'REJECTED' | 'RETURNED_FOR_CORRECTION';
    approvedAmount: number;
    monthlyInterestRate: number;
    approvedByStaffName: string;
    decidedAt: string;
    notes: string;
  };
  disbursementDetails?: {
    disbursedAmount: number;
    paymentMethod: PaymentMethod;
    transactionReference: string;
    disbursedByStaffName: string;
    disbursedAt: string;
  };
  custodyDetails?: {
    safePacketNumber: string;
    lockerLocation: string;
    securedByStaffName: string;
    securedAt: string;
  };
  linkedLoanId?: string;
}

export interface PendingApproval {
  id: string;
  type: 'LOAN_SANCTION' | 'COLLATERAL_RELEASE' | 'RATE_EXCEPTION';
  loanId?: string;
  applicationId?: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  goldWeightGrams: number;
  requestedBy: string;
  requestDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  decidedBy?: string;
  decidedDate?: string;
  decisionNotes?: string;
}

export interface AppraisalRecord {
  id: string;
  applicationId?: string;
  customerName: string;
  customerPhone: string;
  customerIdProof?: string;
  ornaments: Array<{
    name: string;
    grossWeight: number;
    stoneWeight: number;
    netWeight: number;
    purity: GoldPurity;
    ratePerGram: number;
    valuation: number;
  }>;
  totalGrossWeight: number;
  totalNetWeight: number;
  totalValuation: number;
  maxSanctionEligible: number;
  appraisedBy: string;
  date: string;
  status: 'PENDING_SANCTION' | 'SANCTIONED' | 'REJECTED';
  notes?: string;
}

export interface GoldItem {
  id: string;
  name: string; // e.g. "Gold Necklace", "2 Gold Bangles", "Gold Ring"
  grossWeight: number; // in grams
  netWeight: number; // in grams (after deducting stones/wax)
  purity: GoldPurity;
  estimatedValue: number; // in Rupees
}

export type LoanStatus = 'Active' | 'Due Soon' | 'Overdue' | 'Fully Paid' | 'Approved' | 'Disbursed' | 'Closed' | 'Settled';
export type SafeStatus = 'In Safe' | 'Returned to Customer' | 'Pending Vaulting' | 'Release Pending Approval' | 'Release Authorized';

export interface Loan {
  id: string; // e.g. "LN-1001"
  applicationId?: string;
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
  disbursedByStaffName?: string;
  disbursementMethod?: PaymentMethod;
  disbursementReference?: string;
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
  type: 'LOAN_GIVEN' | 'LOAN_DISBURSED' | 'PAYMENT_RECEIVED' | 'CASH_ADDED' | 'EXPENSE';
  description: string;
  amount: number;
  direction: 'IN' | 'OUT';
  paymentMethod: PaymentMethod | 'Cash' | 'Direct';
  loanId?: string;
  customerName?: string;
  staffName?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  role: AppRole | StaffRole;
  performedByName: string;
  performedById?: string;
  entityType: 'APPLICATION' | 'LOAN' | 'APPRAISAL' | 'APPROVAL' | 'PAYMENT' | 'CUSTODY' | 'CUSTOMER';
  entityId: string;
  details: string;
  metadata?: Record<string, unknown>;
}

export interface CustodyLogEntry {
  id: string;
  timestamp: string;
  loanId: string;
  safePacketNumber: string;
  lockerBay: string;
  action: 'PACKET_SEALED' | 'VAULT_STORED' | 'RELEASE_PENDING_APPROVAL' | 'RELEASE_AUTHORIZED' | 'RETURNED_TO_CUSTOMER';
  custodianStaffName: string;
  notes?: string;
}

