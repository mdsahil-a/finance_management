import { StaffRole } from '../types';

export const ROLE_LABELS: Record<StaffRole, string> = {
  SUPER_ADMIN: 'Super Administrator',
  BRANCH_MANAGER: 'Branch Manager',
  LOAN_OFFICER: 'Loan Officer / Customer Service',
  GOLD_APPRAISER: 'Gold Appraiser / Valuer',
  GOLD_WEIGHTER: 'Gold Appraiser / Valuer',
  CREDIT_OFFICER: 'Credit Officer / Loan Approver',
  FINAL_ENTRY_OPERATOR: 'Credit Officer / Loan Approver',
  CASHIER: 'Cashier & Disbursement Officer',
  CUSTODY_OFFICER: 'Gold Custody / Vault Officer',
  AUDITOR: 'Auditor & Compliance Officer',
};

export const ROLE_DEFAULT_ROUTES: Record<StaffRole, string> = {
  SUPER_ADMIN: '/staff/admin',
  BRANCH_MANAGER: '/staff/branch-manager',
  LOAN_OFFICER: '/staff/loan-officer',
  GOLD_APPRAISER: '/staff/weighter',
  GOLD_WEIGHTER: '/staff/weighter',
  CREDIT_OFFICER: '/staff/final-entry',
  FINAL_ENTRY_OPERATOR: '/staff/final-entry',
  CASHIER: '/staff/cashier',
  CUSTODY_OFFICER: '/staff/custody',
  AUDITOR: '/staff/auditor',
};

export function canAccessRoute(role: StaffRole | null | undefined, path: string): boolean {
  if (!role) return false;
  if (role === 'SUPER_ADMIN') return true; // Super admin can oversee all routes

  if (path.startsWith('/staff/admin')) {
    return false;
  }

  if (path.startsWith('/staff/branch-manager')) {
    return role === 'BRANCH_MANAGER';
  }

  if (path.startsWith('/staff/loan-officer')) {
    return role === 'LOAN_OFFICER';
  }

  if (path.startsWith('/staff/weighter')) {
    return role === 'GOLD_WEIGHTER' || role === 'GOLD_APPRAISER';
  }

  if (path.startsWith('/staff/final-entry')) {
    return role === 'FINAL_ENTRY_OPERATOR' || role === 'CREDIT_OFFICER';
  }

  if (path.startsWith('/staff/cashier')) {
    return role === 'CASHIER';
  }

  if (path.startsWith('/staff/custody')) {
    return role === 'CUSTODY_OFFICER';
  }

  if (path.startsWith('/staff/auditor')) {
    return role === 'AUDITOR';
  }

  return true;
}

export type StaffAction =
  | 'CREATE_APPLICATION'
  | 'SUBMIT_ASSESSMENT'
  | 'EDIT_ASSESSMENT'
  | 'SUBMIT_FINAL_ENTRY'
  | 'RETURN_ASSESSMENT'
  | 'RECORD_DEMO_DECISION'
  | 'APPROVE_LOAN'
  | 'REJECT_LOAN'
  | 'DISBURSE_LOAN'
  | 'RECORD_REPAYMENT'
  | 'CONFIRM_CUSTODY'
  | 'RELEASE_GOLD'
  | 'APPROVE_RECONCILIATION'
  | 'SUBMIT_RECONCILIATION'
  | 'MANAGE_STAFF'
  | 'MANAGE_BRANCHES'
  | 'MANAGE_SCHEMES'
  | 'MANAGE_GOLD_RATES'
  | 'VIEW_AUDIT_LOGS'
  | 'VIEW_BRANCH_REPORTS'
  | 'EDIT_SETTINGS'
  | 'RESET_DATA';

export function canPerformAction(
  role: StaffRole | null | undefined, 
  action: StaffAction,
  amount?: number
): boolean {
  if (!role) return false;

  // Super Admin can perform administrative and configuration actions
  if (role === 'SUPER_ADMIN') {
    return true;
  }

  switch (action) {
    case 'CREATE_APPLICATION':
      return role === 'LOAN_OFFICER' || role === 'GOLD_WEIGHTER' || role === 'GOLD_APPRAISER';

    case 'SUBMIT_ASSESSMENT':
    case 'EDIT_ASSESSMENT':
      return role === 'GOLD_APPRAISER' || role === 'GOLD_WEIGHTER';

    case 'SUBMIT_FINAL_ENTRY':
    case 'RETURN_ASSESSMENT':
      return role === 'CREDIT_OFFICER' || role === 'FINAL_ENTRY_OPERATOR';

    case 'RECORD_DEMO_DECISION':
    case 'APPROVE_LOAN':
    case 'REJECT_LOAN':
      // Branch Manager can approve within limit (e.g. up to 5,00,000)
      if (role === 'BRANCH_MANAGER') {
        if (amount !== undefined && amount > 500000) return false; // exceeds branch limit
        return true;
      }
      return false;

    case 'DISBURSE_LOAN':
    case 'RECORD_REPAYMENT':
    case 'SUBMIT_RECONCILIATION':
      return role === 'CASHIER';

    case 'APPROVE_RECONCILIATION':
      return role === 'BRANCH_MANAGER';

    case 'CONFIRM_CUSTODY':
    case 'RELEASE_GOLD':
      return role === 'CUSTODY_OFFICER';

    case 'VIEW_AUDIT_LOGS':
      return role === 'AUDITOR' || role === 'BRANCH_MANAGER';

    case 'VIEW_BRANCH_REPORTS':
      return role === 'BRANCH_MANAGER' || role === 'AUDITOR';

    default:
      return false;
  }
}
