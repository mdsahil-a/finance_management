export type GoldPurity = '18K' | '20K' | '22K' | '24K';

export type JewelleryCategory = 
  | 'Bangles'
  | 'Necklace'
  | 'Chain'
  | 'Earrings'
  | 'Rings'
  | 'Coins'
  | 'Other Jewellery';

export type ApplicationStatus =
  | 'Draft'
  | 'Submitted'
  | 'KYC Pending'
  | 'Awaiting Gold Assessment'
  | 'Assessment Draft'
  | 'Awaiting Credit Review'
  | 'Awaiting Final Entry' // backward compat
  | 'Awaiting Authorized Review'
  | 'Returned for Correction'
  | 'Returned for Gold Correction' // backward compat
  | 'Final Entry Draft'
  | 'Approved — Demo'
  | 'Rejected — Demo'
  | 'Custody Pending'
  | 'Awaiting Demo Disbursement'
  | 'Disbursed — Demo'
  | 'Active'
  | 'Repayment Due'
  | 'Overdue'
  | 'Settlement Pending'
  | 'Closed — Demo'
  | 'Gold Release Pending'
  | 'Gold Released'
  | 'Cancelled';

export type StaffRole = 
  | 'SUPER_ADMIN' 
  | 'BRANCH_MANAGER' 
  | 'LOAN_OFFICER'
  | 'GOLD_APPRAISER' 
  | 'GOLD_WEIGHTER' // alias for GOLD_APPRAISER
  | 'CREDIT_OFFICER'
  | 'FINAL_ENTRY_OPERATOR' // alias for CREDIT_OFFICER
  | 'CASHIER' 
  | 'CUSTODY_OFFICER'
  | 'AUDITOR';

export type PaymentMode = 
  | 'Cash — Demo' 
  | 'Bank Transfer — Demo' 
  | 'UPI — Demo'
  | 'Cheque / DD — Demo';

export type RepaymentMethod = 
  | 'Simple Interest' 
  | 'Reducing Balance EMI' 
  | 'Bullet Repayment';

export interface DemoCustomer {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  panNumber?: string;
  aadhaarNumberMasked?: string;
  address?: string;
  kycStatus?: 'Verified' | 'Pending' | 'Rejected';
  createdAt?: string;
}

export interface DemoStaffUser {
  id: string; // e.g. ADMIN001, BRANCH001, LOAN001, WEIGHT001, ENTRY001, CASH001, VAULT001, AUDIT001
  fullName: string;
  role: StaffRole;
  email: string;
  branchId: string;
  branchName: string;
  isActive: boolean;
  avatar?: string;
  designation?: string;
  department?: string;
  approvalLimitINR?: number; // max sanction amount permitted
}

// Multi-article gold item details
export interface GoldArticleItem {
  id: string;
  category: JewelleryCategory;
  description: string;
  itemsCount: number;
  grossWeight: number; // grams
  stoneWeight: number; // grams
  otherDeductions: number; // grams
  netGoldWeight: number; // grams
  purity: GoldPurity;
  purityFactor: number;
  ratePerGram: number;
  valuation: number;
  photoUrl?: string;
  photoFileName?: string;
  hallmarkNumber?: string;
}

export interface CustomerApplication {
  id: string;
  reference: string; // e.g. AGF-2026-100001
  createdAt: string;
  updatedAt: string;
  customer: {
    fullName: string;
    email: string;
    mobile: string;
    city: string;
    state: string;
    panNumber?: string;
    aadhaarMasked?: string;
  };
  goldDetails: {
    category: JewelleryCategory;
    itemsCount: number;
    declaredWeight: number; // in grams
    purity: GoldPurity;
    purpose: string;
    approximateValue?: number;
    articles?: GoldArticleItem[]; // Multi-article breakdown
  };
  loanPreferences: {
    requestedAmount: number;
    preferredTenureMonths: number;
    repaymentMethod: RepaymentMethod;
    schemeCode?: string;
  };
  assignedBranchId: string;
  assignedStaffId?: string;
  status: ApplicationStatus;
  currentStage: string;
  workflowHistory: WorkflowEvent[];
  latestActivity?: string;
  notes?: string;
  documents?: {
    idProofType?: 'Aadhaar Card' | 'PAN Card' | 'Passport' | 'Voter ID' | 'Driving License';
    idProofNumberMasked?: string;
    idProofFileName?: string;
    idProofFileUrl?: string;
    idProofFileSize?: string;
    idProofFileType?: string;
    idProofVerified?: boolean;
    jewelleryPictureFileName?: string;
    jewelleryPictureUrl?: string;
    jewelleryPictureFileSize?: string;
    jewelleryPictureFileType?: string;
    jewelleryPictureVerified?: boolean;
    addressProofType?: string;
    addressProofFileName?: string;
    addressProofFileUrl?: string;
    addressProofFileSize?: string;
    addressProofFileType?: string;
    addressProofVerified?: boolean;
    loanAgreementSigned?: boolean;
    loanAgreementUrl?: string;
    uploadedAt?: string;
    verificationNotes?: string;
  };
  // Linking to assessments and decisions
  activeAssessmentId?: string;
  finalEntryId?: string;
  authorizedDecision?: {
    decision: 'Approved' | 'Rejected';
    decidedBy: string;
    decidedByName: string;
    decidedAt: string;
    sanctionedAmount: number;
    annualInterestRate: number;
    tenureMonths: number;
    notes: string;
    schemeCode?: string;
  };
  loanAccountId?: string;
  custodyRecordId?: string;
}

export interface WorkflowEvent {
  id: string;
  timestamp: string;
  status: ApplicationStatus;
  stageName: string;
  performedBy: string; // Employee ID or 'Customer' or 'System'
  performedByRole: string;
  description: string;
  remarks?: string;
}

export interface GoldAssessmentVersion {
  version: number;
  recordedAt: string;
  recordedBy: string;
  recordedByName: string;
  jewelleryCategory: JewelleryCategory;
  itemsCount: number;
  grossWeight: number;
  stoneWeight: number;
  otherNonGoldWeight: number;
  netGoldWeight: number;
  purity: GoldPurity;
  referencePricePerGram: number; // 24K price
  purityFactor: number;
  purityGoldRate: number;
  estimatedGoldValue: number;
  estimatedEligibleAmount: number;
  ltvRatioPercent: number;
  articles?: GoldArticleItem[]; // Multi-article gold pieces
  acidTestPassed?: boolean;
  touchstoneTestPassed?: boolean;
  hallmarkVerified?: boolean;
  notes?: string;
  jewelleryPhotoUrl?: string;
  jewelleryPhotoFileName?: string;
  scalePhotoUrl?: string;
  scalePhotoFileName?: string;
  status: 'Draft' | 'Submitted' | 'Returned';
  returnReason?: string;
}

export interface GoldAssessment {
  id: string;
  applicationReference: string;
  activeVersion: number;
  versions: GoldAssessmentVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface FinalEntryRecord {
  id: string;
  applicationReference: string;
  recordedAt: string;
  recordedBy: string;
  recordedByName: string;
  customerDetailsVerified: boolean;
  goldAssessmentReviewed: boolean;
  loanCalculationReviewed: boolean;
  requiredFieldsCompleted: boolean;
  kycDocumentVerified?: boolean;
  jewelleryPhotoVerified?: boolean;
  addressProofVerified?: boolean;
  scannedKycDocUrl?: string;
  scannedKycDocName?: string;
  proposedLoanAmount: number;
  annualInterestRate: number;
  tenureMonths: number;
  repaymentMethod: RepaymentMethod;
  processingFee: number;
  valuationCharge: number;
  schemeCode?: string;
  operatorNotes: string;
  status: 'Draft' | 'Submitted';
}

export interface DemoLoanAccount {
  id: string;
  loanAccountNumber: string; // e.g. AGF-LN-2026-9001
  applicationReference: string;
  customerName: string;
  customerMobile: string;
  sanctionedAmount: number;
  disbursedAmount: number;
  annualInterestRate: number;
  tenureMonths: number;
  sanctionedDate: string;
  disbursementDate?: string;
  repaymentMethod: RepaymentMethod;
  totalInterestPayable: number;
  totalPayableAmount: number;
  totalRepaid: number;
  remainingBalance: number;
  principalOutstanding?: number;
  accruedInterest?: number;
  nextPaymentDueDate?: string;
  overdueDays?: number;
  overdueAmount?: number;
  schemeCode?: string;
  schemeName?: string;
  status: 'Awaiting Disbursement' | 'Active' | 'Closed';
  branchId: string;
  custodyPacketRef?: string;
  goldReleaseStatus?: 'Not Eligible' | 'Release Pending Handover' | 'Released';
  goldReleasedDate?: string;
}

export interface DemoTransaction {
  id: string;
  transactionReference: string; // e.g. TXN-2026-8001
  applicationReference: string;
  loanAccountNumber?: string;
  type: 'Disbursement' | 'Repayment';
  paymentMode: PaymentMode;
  amount: number;
  principalComponent?: number;
  interestComponent?: number;
  penaltyComponent?: number;
  recordedAt: string;
  processedBy: string;
  processedByName: string;
  processedByRole: StaffRole;
  receiptNumber: string;
  notes?: string;
  disbursementReceiptUrl?: string;
  disbursementReceiptName?: string;
  customerName: string;
  status: 'Successful — Demo';
}

export interface DemoBranch {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  operatingHours: string;
  isActive: boolean;
  managerName: string;
}

// Configurable Loan Schemes
export interface LoanScheme {
  id: string;
  code: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  interestMethod: RepaymentMethod;
  nominalInterestRate: number; // in % p.a.
  interestPaymentFrequency: 'Monthly' | 'Quarterly' | 'At Maturity';
  processingFeePercent: number;
  valuationCharge: number;
  minEligiblePurity: GoldPurity;
  ltvLimitPercent: number; // e.g. 75
  minInterestPeriodDays: number; // e.g. 7
  latePaymentPenaltyPercent: number; // e.g. 2
  foreclosureChargesPercent: number; // e.g. 0
  renewalAllowed: boolean;
  isActive: boolean;
  effectiveDate: string;
  expiryDate?: string;
  // Aliases for convenience
  annualInterestRate?: number;
  maxLtvRatio?: number;
  minLoanAmount?: number;
  maxLoanAmount?: number;
  interestCalculationMethod?: RepaymentMethod;
}

// Daily Gold Benchmark Rate Record
export interface GoldRateRecord {
  id: string;
  effectiveDate: string; // YYYY-MM-DD
  rate24K: number; // per gram in INR
  rate22K: number;
  rate20K: number;
  rate18K: number;
  updatedBy: string;
  updatedAt: string;
}

// Vault & Pledged Gold Custody Record
export interface CustodyMovement {
  id: string;
  timestamp: string;
  action: 'Initial Vault Deposit' | 'Audit Inspection' | 'Locker Transfer' | 'Settlement Retrieval' | 'Customer Handover';
  performedBy: string;
  performedByName: string;
  details: string;
}

export interface GoldCustodyRecord {
  id: string;
  applicationReference: string;
  loanAccountNumber?: string;
  customerName: string;
  packetReference: string; // e.g. SEAL-MUM-2026-0042
  vaultLocation: string; // e.g. Vault Room 1, Safe Locker B-12
  itemCount: number;
  totalGrossWeight: number;
  totalNetWeight: number;
  purity: GoldPurity;
  sealedAt: string;
  sealedByStaffId: string;
  sealedByStaffName: string;
  handedOverByStaffId?: string;
  handedOverByStaffName?: string;
  receivedByStaffId: string;
  receivedByStaffName: string;
  status: 'In Vault' | 'Retrieved for Audit' | 'Retrieved for Release' | 'Released to Customer';
  releaseAuthorizedBy?: string;
  releasedAt?: string;
  customerAcknowledgement?: string;
  custodyNotes?: string;
  movements: CustodyMovement[];
}

// Daily Cashier Drawer & Cash Reconciliation
export interface DailyCashReconciliation {
  id: string;
  date: string; // YYYY-MM-DD
  branchId: string;
  branchName: string;
  cashierId: string;
  cashierName: string;
  openingBalance: number;
  totalCashReceived: number;
  totalCashDisbursed: number;
  expectedClosingBalance: number;
  physicalCountedBalance: number;
  discrepancy: number; // physical - expected
  status: 'Balanced' | 'Discrepancy Pending Review' | 'Manager Approved';
  notes?: string;
  managerRemarks?: string;
  closedAt?: string;
}

export interface DemoNotification {
  id: string;
  targetRole?: StaffRole | 'ALL' | 'CUSTOMER';
  targetUserId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

export interface DemoEnquiry {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Replied';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  employeeId?: string;
  employeeName: string;
  employeeRole: string;
  eventType: string;
  applicationReference?: string;
  description: string;
  details?: any;
  performedByName?: string;
  performedByRole?: string;
  action?: string;
  targetReference?: string;
}

export interface DemoSystemSettings {
  goldReferencePrice24K: number; // e.g. 7450 per gram
  defaultAnnualInterestRate: number; // e.g. 10.5%
  maxLtvRatio: number; // e.g. 0.75 (75%)
  minTenureMonths: number;
  maxTenureMonths: number;
  standardProcessingFeePercent: number; // 0.5%
  branchManagerApprovalLimit: number; // e.g. 500000 (loans above this require Super Admin)
  custodyHandoverMandatory: boolean; // require vault confirmation before disbursement
  secondApproverRequiredForHighValue: boolean;
  highValueThreshold: number; // e.g. 1000000
  demoModeEnabled: boolean;
  lastUpdated: string;
}

export interface FAQItem {
  id: string;
  category: 'Basics' | 'Purity & Valuation' | 'Interest & Charges' | 'Repayment' | 'Application & Tracking' | 'Privacy & Demo';
  question: string;
  answer: string;
}
