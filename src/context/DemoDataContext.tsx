import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CustomerApplication,
  ApplicationStatus,
  GoldAssessment,
  GoldAssessmentVersion,
  FinalEntryRecord,
  DemoLoanAccount,
  DemoTransaction,
  DemoBranch,
  DemoStaffUser,
  ActivityLog,
  DemoNotification,
  DemoEnquiry,
  DemoSystemSettings,
  StaffRole,
  PaymentMode,
  LoanScheme,
  GoldRateRecord,
  GoldCustodyRecord,
  DailyCashReconciliation,
} from '../types';
import {
  INITIAL_CUSTOMER,
  INITIAL_APPLICATIONS,
  INITIAL_ASSESSMENTS,
  INITIAL_FINAL_ENTRIES,
  INITIAL_LOANS,
  INITIAL_TRANSACTIONS,
  INITIAL_BRANCHES,
  INITIAL_STAFF,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
  INITIAL_SCHEMES,
  INITIAL_GOLD_RATES,
  INITIAL_CUSTODY_RECORDS,
  INITIAL_RECONCILIATIONS,
} from '../data/initialData';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';

interface DemoDataContextType {
  applications: CustomerApplication[];
  assessments: GoldAssessment[];
  finalEntries: FinalEntryRecord[];
  loans: DemoLoanAccount[];
  transactions: DemoTransaction[];
  branches: DemoBranch[];
  staffUsers: DemoStaffUser[];
  activityLogs: ActivityLog[];
  notifications: DemoNotification[];
  enquiries: DemoEnquiry[];
  settings: DemoSystemSettings;
  schemes: LoanScheme[];
  goldRates: GoldRateRecord[];
  custodyRecords: GoldCustodyRecord[];
  reconciliations: DailyCashReconciliation[];

  // Workflow Actions
  submitApplication: (
    data: Omit<CustomerApplication, 'id' | 'reference' | 'createdAt' | 'updatedAt' | 'status' | 'currentStage' | 'workflowHistory'>,
    submittedBy?: DemoStaffUser
  ) => CustomerApplication;
  saveAssessmentDraft: (
    assessmentData: Omit<GoldAssessmentVersion, 'version' | 'recordedAt' | 'status'>,
    appRef: string,
    staffUser: DemoStaffUser
  ) => void;
  submitAssessment: (
    assessmentData: Omit<GoldAssessmentVersion, 'version' | 'recordedAt' | 'status'>,
    appRef: string,
    staffUser: DemoStaffUser
  ) => void;
  returnForGoldCorrection: (appRef: string, returnReason: string, staffUser: DemoStaffUser) => void;
  saveFinalEntryDraft: (
    entryData: Omit<FinalEntryRecord, 'id' | 'recordedAt' | 'status'>,
    appRef: string,
    staffUser: DemoStaffUser
  ) => void;
  submitFinalEntry: (
    entryData: Omit<FinalEntryRecord, 'id' | 'recordedAt' | 'status'>,
    appRef: string,
    staffUser: DemoStaffUser
  ) => void;
  recordAuthorizedDecision: (
    appRef: string,
    decision: 'Approved' | 'Rejected',
    sanctionedAmount: number,
    notes: string,
    staffUser: DemoStaffUser,
    schemeCode?: string
  ) => void;
  confirmGoldCustody: (
    appRef: string,
    data: {
      packetReference: string;
      vaultLocation: string;
      itemCount: number;
      totalGrossWeight: number;
      totalNetWeight: number;
      custodyNotes?: string;
    },
    staffUser: DemoStaffUser
  ) => GoldCustodyRecord;
  executeGoldRelease: (
    appRef: string,
    customerAcknowledgement: string,
    staffUser: DemoStaffUser
  ) => void;
  recordDisbursement: (
    appRef: string,
    amount: number,
    paymentMode: PaymentMode,
    notes: string,
    staffUser: DemoStaffUser
  ) => DemoTransaction;
  recordRepayment: (
    loanAccountId: string,
    amount: number,
    paymentMode: PaymentMode,
    notes: string,
    staffUser: DemoStaffUser,
    breakdown?: { principalComponent?: number; interestComponent?: number }
  ) => DemoTransaction;

  // Management Actions
  createScheme: (scheme: Omit<LoanScheme, 'id'>) => LoanScheme;
  updateScheme: (id: string, updates: Partial<LoanScheme>) => void;
  toggleSchemeActive: (id: string) => void;

  updateGoldRates: (rates: { rate24K: number; rate22K: number; rate20K: number; rate18K: number }, staffUser: DemoStaffUser) => void;

  saveCashReconciliation: (data: Omit<DailyCashReconciliation, 'id'>) => DailyCashReconciliation;
  approveCashReconciliation: (id: string, managerRemarks: string, managerUser: DemoStaffUser) => void;

  createStaffUser: (user: Omit<DemoStaffUser, 'id'>) => DemoStaffUser;
  updateStaffUser: (id: string, updates: Partial<DemoStaffUser>) => void;
  toggleStaffActive: (id: string, currentAdminId: string) => { success: boolean; message?: string };

  createBranch: (branch: Omit<DemoBranch, 'id' | 'code'>) => DemoBranch;
  updateBranch: (id: string, updates: Partial<DemoBranch>) => void;
  toggleBranchActive: (id: string) => void;

  submitEnquiry: (enquiry: Omit<DemoEnquiry, 'id' | 'createdAt' | 'status'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: (role?: StaffRole | 'CUSTOMER' | 'ALL') => void;
  deleteNotification: (id: string) => void;

  updateSettings: (newSettings: Partial<DemoSystemSettings>) => void;
  resetDemoData: () => void;
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

export const DemoDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<CustomerApplication[]>(() => 
    getStorageItem(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS)
  );
  const [assessments, setAssessments] = useState<GoldAssessment[]>(() => 
    getStorageItem(STORAGE_KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS)
  );
  const [finalEntries, setFinalEntries] = useState<FinalEntryRecord[]>(() => 
    getStorageItem(STORAGE_KEYS.FINAL_ENTRIES, INITIAL_FINAL_ENTRIES)
  );
  const [loans, setLoans] = useState<DemoLoanAccount[]>(() => 
    getStorageItem(STORAGE_KEYS.LOANS, INITIAL_LOANS)
  );
  const [transactions, setTransactions] = useState<DemoTransaction[]>(() => 
    getStorageItem(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS)
  );
  const [branches, setBranches] = useState<DemoBranch[]>(() => 
    getStorageItem(STORAGE_KEYS.BRANCHES, INITIAL_BRANCHES)
  );
  const [staffUsers, setStaffUsers] = useState<DemoStaffUser[]>(() => {
    const savedStaff = getStorageItem(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    // Ensure all 8 demo staff roles exist
    const missing = INITIAL_STAFF.filter(init => !savedStaff.some(s => s.id === init.id));
    if (missing.length > 0) {
      return [...savedStaff, ...missing];
    }
    return savedStaff;
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => 
    getStorageItem(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS)
  );
  const [notifications, setNotifications] = useState<DemoNotification[]>(() => 
    getStorageItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );
  const [enquiries, setEnquiries] = useState<DemoEnquiry[]>(() => 
    getStorageItem(STORAGE_KEYS.ENQUIRIES, [])
  );
  const [settings, setSettings] = useState<DemoSystemSettings>(() => 
    getStorageItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS)
  );
  const [schemes, setSchemes] = useState<LoanScheme[]>(() =>
    getStorageItem(STORAGE_KEYS.SCHEMES, INITIAL_SCHEMES)
  );
  const [goldRates, setGoldRates] = useState<GoldRateRecord[]>(() =>
    getStorageItem(STORAGE_KEYS.GOLD_RATES, INITIAL_GOLD_RATES)
  );
  const [custodyRecords, setCustodyRecords] = useState<GoldCustodyRecord[]>(() =>
    getStorageItem(STORAGE_KEYS.CUSTODY_RECORDS, INITIAL_CUSTODY_RECORDS)
  );
  const [reconciliations, setReconciliations] = useState<DailyCashReconciliation[]>(() =>
    getStorageItem(STORAGE_KEYS.RECONCILIATIONS, INITIAL_RECONCILIATIONS)
  );

  // Sync to LocalStorage
  useEffect(() => { setStorageItem(STORAGE_KEYS.APPLICATIONS, applications); }, [applications]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.ASSESSMENTS, assessments); }, [assessments]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.FINAL_ENTRIES, finalEntries); }, [finalEntries]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.LOANS, loans); }, [loans]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.TRANSACTIONS, transactions); }, [transactions]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.BRANCHES, branches); }, [branches]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.STAFF, staffUsers); }, [staffUsers]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.ACTIVITY_LOGS, activityLogs); }, [activityLogs]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.NOTIFICATIONS, notifications); }, [notifications]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.ENQUIRIES, enquiries); }, [enquiries]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.SETTINGS, settings); }, [settings]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.SCHEMES, schemes); }, [schemes]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.GOLD_RATES, goldRates); }, [goldRates]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.CUSTODY_RECORDS, custodyRecords); }, [custodyRecords]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.RECONCILIATIONS, reconciliations); }, [reconciliations]);

  const logActivity = (
    employeeId: string,
    employeeName: string,
    employeeRole: string,
    eventType: string,
    description: string,
    applicationReference?: string,
    details?: Record<string, any>
  ) => {
    const newLog: ActivityLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      employeeId,
      employeeName,
      employeeRole,
      eventType,
      applicationReference,
      description,
      details,
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const addNotification = (notif: Omit<DemoNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: DemoNotification = {
      ...notif,
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 1. Submit Application (by Customer online or Loan Officer at branch)
  const submitApplication = (
    data: Omit<CustomerApplication, 'id' | 'reference' | 'createdAt' | 'updatedAt' | 'status' | 'currentStage' | 'workflowHistory'>,
    submittedBy?: DemoStaffUser
  ): CustomerApplication => {
    const now = new Date().toISOString();
    const nextSeq = 100000 + applications.length + 1;
    const ref = `AGF-2026-${nextSeq}`;
    const id = `APP-${nextSeq}`;

    const newApp: CustomerApplication = {
      ...data,
      id,
      reference: ref,
      createdAt: now,
      updatedAt: now,
      status: 'Awaiting Gold Assessment',
      currentStage: 'Pending Gold Appraiser Physical Valuation',
      assignedStaffId: submittedBy?.id,
      latestActivity: submittedBy
        ? `Application ${ref} registered by Loan Officer ${submittedBy.fullName}. Queued for gold appraisal.`
        : `Application ${ref} submitted online by borrower. Queued for gold appraisal.`,
      workflowHistory: [
        {
          id: `WF-${Date.now()}-1`,
          timestamp: now,
          status: 'Submitted',
          stageName: submittedBy ? 'Branch Loan Officer Registration' : 'Customer Online Submission',
          performedBy: submittedBy?.fullName || 'Customer',
          performedByRole: submittedBy?.role || 'Customer',
          description: `${submittedBy ? `${submittedBy.fullName} entered application for` : 'Customer submitted application for'} ${data.goldDetails.itemsCount} ${data.goldDetails.category} (${data.goldDetails.declaredWeight}g declared).`,
        },
        {
          id: `WF-${Date.now()}-2`,
          timestamp: now,
          status: 'Awaiting Gold Assessment',
          stageName: 'Appraisal Queue Dispatch',
          performedBy: 'System',
          performedByRole: 'Automated Dispatcher',
          description: 'Application routed to branch gold weighing and assaying queue.',
        },
      ],
    };

    setApplications(prev => [newApp, ...prev]);

    logActivity(
      submittedBy?.id || 'CUSTOMER',
      submittedBy?.fullName || data.customer.fullName,
      submittedBy?.role || 'Customer',
      'Application Submission',
      `${submittedBy ? 'Registered' : 'Submitted'} gold loan request ${ref} for ₹${data.loanPreferences.requestedAmount.toLocaleString('en-IN')}`,
      ref
    );

    addNotification({
      targetRole: 'GOLD_WEIGHTER',
      title: 'New Gold Appraisal Assigned',
      message: `${data.customer.fullName} submitted gold loan request ${ref} (${data.goldDetails.declaredWeight}g ${data.goldDetails.category}).`,
      type: 'info',
      link: '/staff/weighter/queue',
    });

    return newApp;
  };

  // 2. Gold Appraiser Saves Draft
  const saveAssessmentDraft = (
    assessmentData: Omit<GoldAssessmentVersion, 'version' | 'recordedAt' | 'status'>,
    appRef: string,
    staffUser: DemoStaffUser
  ) => {
    const now = new Date().toISOString();
    const existing = assessments.find(a => a.applicationReference === appRef);
    let nextVersionNum = 1;

    if (existing) {
      nextVersionNum = existing.versions.length;
      if (existing.versions.length > 0 && existing.versions[existing.versions.length - 1].status === 'Submitted') {
        nextVersionNum = existing.versions.length + 1;
      }
    }

    const versionRecord: GoldAssessmentVersion = {
      ...assessmentData,
      version: nextVersionNum,
      recordedAt: now,
      status: 'Draft',
    };

    if (existing) {
      const filtered = existing.versions.filter(v => v.version !== nextVersionNum);
      const updatedAssessment: GoldAssessment = {
        ...existing,
        activeVersion: nextVersionNum,
        updatedAt: now,
        versions: [...filtered, versionRecord],
      };
      setAssessments(prev => prev.map(a => a.id === existing.id ? updatedAssessment : a));
    } else {
      const newAssessment: GoldAssessment = {
        id: `ASSESS-${Date.now().toString().slice(-6)}`,
        applicationReference: appRef,
        activeVersion: 1,
        createdAt: now,
        updatedAt: now,
        versions: [versionRecord],
      };
      setAssessments(prev => [newAssessment, ...prev]);
    }

    setApplications(prev => prev.map(app => {
      if (app.reference === appRef) {
        return {
          ...app,
          status: 'Assessment Draft',
          currentStage: 'Gold Appraiser Draft Assessment in Progress',
          updatedAt: now,
          latestActivity: `Draft assessment saved by ${staffUser.fullName}.`,
        };
      }
      return app;
    }));

    logActivity(
      staffUser.id,
      staffUser.fullName,
      staffUser.role,
      'Assessment Draft Saved',
      `Saved draft appraisal v${nextVersionNum} for ${appRef}`,
      appRef
    );
  };

  // 3. Gold Appraiser Submits Assessment
  const submitAssessment = (
    assessmentData: Omit<GoldAssessmentVersion, 'version' | 'recordedAt' | 'status'>,
    appRef: string,
    staffUser: DemoStaffUser
  ) => {
    const now = new Date().toISOString();
    const existing = assessments.find(a => a.applicationReference === appRef);
    let newVersionNum = 1;

    if (existing) {
      newVersionNum = existing.versions.length + 1;
    }

    const versionRecord: GoldAssessmentVersion = {
      ...assessmentData,
      version: newVersionNum,
      recordedAt: now,
      status: 'Submitted',
    };

    const assessmentId = existing?.id || `ASSESS-${Date.now().toString().slice(-6)}`;

    if (existing) {
      const updated: GoldAssessment = {
        ...existing,
        activeVersion: newVersionNum,
        updatedAt: now,
        versions: [...existing.versions, versionRecord],
      };
      setAssessments(prev => prev.map(a => a.id === existing.id ? updated : a));
    } else {
      const newAss: GoldAssessment = {
        id: assessmentId,
        applicationReference: appRef,
        activeVersion: 1,
        createdAt: now,
        updatedAt: now,
        versions: [versionRecord],
      };
      setAssessments(prev => [newAss, ...prev]);
    }

    setApplications(prev => prev.map(app => {
      if (app.reference === appRef) {
        const wfEvent = {
          id: `WF-${Date.now()}`,
          timestamp: now,
          status: 'Awaiting Credit Review' as const,
          stageName: 'Gold Appraisal Completed',
          performedBy: staffUser.fullName,
          performedByRole: 'Gold Appraiser',
          description: `Appraisal v${newVersionNum} locked: Gross ${assessmentData.grossWeight}g, Net ${assessmentData.netGoldWeight}g ${assessmentData.purity}. Valued at ₹${Math.round(assessmentData.estimatedGoldValue).toLocaleString('en-IN')}. Eligible Loan: ₹${Math.round(assessmentData.estimatedEligibleAmount).toLocaleString('en-IN')}.`,
        };

        return {
          ...app,
          status: 'Awaiting Credit Review',
          currentStage: 'Pending Credit Officer Sanction Underwriting',
          updatedAt: now,
          activeAssessmentId: assessmentId,
          latestActivity: `Gold appraisal locked by ${staffUser.fullName}. Queued for Credit Review.`,
          workflowHistory: [...app.workflowHistory, wfEvent],
        };
      }
      return app;
    }));

    logActivity(
      staffUser.id,
      staffUser.fullName,
      staffUser.role,
      'Gold Assessment Submitted',
      `Locked appraisal v${newVersionNum} for ${appRef}: ${assessmentData.netGoldWeight}g ${assessmentData.purity}`,
      appRef
    );

    addNotification({
      targetRole: 'FINAL_ENTRY_OPERATOR',
      title: 'Appraisal Ready for Credit Review',
      message: `Application ${appRef} gold valuation completed by ${staffUser.fullName}. Ready for underwriting review.`,
      type: 'info',
      link: '/staff/final-entry/queue',
    });
  };

  // 4. Credit Officer / Approver Returns Assessment for Correction
  const returnForGoldCorrection = (appRef: string, returnReason: string, staffUser: DemoStaffUser) => {
    const now = new Date().toISOString();

    setAssessments(prev => prev.map(ass => {
      if (ass.applicationReference === appRef) {
        const updatedVersions = ass.versions.map(v => {
          if (v.version === ass.activeVersion) {
            return { ...v, status: 'Returned' as const, returnReason };
          }
          return v;
        });
        return { ...ass, versions: updatedVersions, updatedAt: now };
      }
      return ass;
    }));

    setApplications(prev => prev.map(app => {
      if (app.reference === appRef) {
        const wfEvent = {
          id: `WF-${Date.now()}`,
          timestamp: now,
          status: 'Returned for Correction' as const,
          stageName: 'Returned by Underwriter',
          performedBy: staffUser.fullName,
          performedByRole: staffUser.role,
          description: `Application returned to Gold Appraiser: ${returnReason}`,
        };

        return {
          ...app,
          status: 'Returned for Correction',
          currentStage: 'Returned to Gold Appraiser for Weighing / Valuation Correction',
          updatedAt: now,
          latestActivity: `Returned by ${staffUser.fullName}: ${returnReason}`,
          workflowHistory: [...app.workflowHistory, wfEvent],
        };
      }
      return app;
    }));

    logActivity(
      staffUser.id,
      staffUser.fullName,
      staffUser.role,
      'Assessment Returned',
      `Returned assessment for ${appRef}: ${returnReason}`,
      appRef
    );

    addNotification({
      targetRole: 'GOLD_WEIGHTER',
      title: 'Appraisal Returned for Correction',
      message: `Application ${appRef} returned by ${staffUser.fullName}. Reason: ${returnReason}`,
      type: 'warning',
      link: '/staff/weighter/queue',
    });
  };

  // 5. Credit Officer Saves Draft
  const saveFinalEntryDraft = (
    entryData: Omit<FinalEntryRecord, 'id' | 'recordedAt' | 'status'>,
    appRef: string,
    staffUser: DemoStaffUser
  ) => {
    const now = new Date().toISOString();
    const existing = finalEntries.find(f => f.applicationReference === appRef);
    const entryId = existing?.id || `FE-${Date.now().toString().slice(-6)}`;

    const newRecord: FinalEntryRecord = {
      ...entryData,
      id: entryId,
      recordedAt: now,
      status: 'Draft',
    };

    if (existing) {
      setFinalEntries(prev => prev.map(f => f.id === existing.id ? newRecord : f));
    } else {
      setFinalEntries(prev => [newRecord, ...prev]);
    }

    setApplications(prev => prev.map(app => {
      if (app.reference === appRef) {
        return {
          ...app,
          status: 'Final Entry Draft',
          currentStage: 'Credit Review Underwriting in Progress',
          updatedAt: now,
          finalEntryId: entryId,
          latestActivity: `Credit review draft saved by ${staffUser.fullName}.`,
        };
      }
      return app;
    }));

    logActivity(
      staffUser.id,
      staffUser.fullName,
      staffUser.role,
      'Credit Draft Saved',
      `Saved credit review draft for ${appRef}`,
      appRef
    );
  };

  // 6. Credit Officer Submits Review
  const submitFinalEntry = (
    entryData: Omit<FinalEntryRecord, 'id' | 'recordedAt' | 'status'>,
    appRef: string,
    staffUser: DemoStaffUser
  ) => {
    const now = new Date().toISOString();
    const existing = finalEntries.find(f => f.applicationReference === appRef);
    const entryId = existing?.id || `FE-${Date.now().toString().slice(-6)}`;

    const completedRecord: FinalEntryRecord = {
      ...entryData,
      id: entryId,
      recordedAt: now,
      status: 'Submitted',
    };

    if (existing) {
      setFinalEntries(prev => prev.map(f => f.id === existing.id ? completedRecord : f));
    } else {
      setFinalEntries(prev => [completedRecord, ...prev]);
    }

    setApplications(prev => prev.map(app => {
      if (app.reference === appRef) {
        const wfEvent = {
          id: `WF-${Date.now()}`,
          timestamp: now,
          status: 'Awaiting Authorized Review' as const,
          stageName: 'Credit Review Completed',
          performedBy: staffUser.fullName,
          performedByRole: 'Credit Officer',
          description: `All KYC & gold assessment checks verified. Proposed Sanction: ₹${entryData.proposedLoanAmount.toLocaleString('en-IN')} @ ${entryData.annualInterestRate}% p.a. for ${entryData.tenureMonths}M (${entryData.repaymentMethod}).`,
        };

        return {
          ...app,
          status: 'Awaiting Authorized Review',
          currentStage: 'Pending Branch Manager / Super Admin Sanction Approval',
          updatedAt: now,
          finalEntryId: entryId,
          latestActivity: `Credit underwriting verified by ${staffUser.fullName}. Awaiting authorized sanction.`,
          workflowHistory: [...app.workflowHistory, wfEvent],
        };
      }
      return app;
    }));

    logActivity(
      staffUser.id,
      staffUser.fullName,
      staffUser.role,
      'Credit Underwriting Completed',
      `Verified underwriting for ${appRef}. Proposed amount: ₹${entryData.proposedLoanAmount.toLocaleString('en-IN')}`,
      appRef
    );

    addNotification({
      targetRole: 'BRANCH_MANAGER',
      title: 'Application Ready for Approval',
      message: `Underwriting completed for ${appRef} by ${staffUser.fullName}. Ready for manager sanction approval.`,
      type: 'warning',
      link: '/staff/branch-manager/applications',
    });

    addNotification({
      targetRole: 'SUPER_ADMIN',
      title: 'High-Level Review Queued',
      message: `Application ${appRef} proposed for ₹${entryData.proposedLoanAmount.toLocaleString('en-IN')}.`,
      type: 'info',
      link: '/staff/admin/applications',
    });
  };

  // 7. Branch Manager or Super Admin Records Authorized Decision
  const recordAuthorizedDecision = (
    appRef: string,
    decision: 'Approved' | 'Rejected',
    sanctionedAmount: number,
    notes: string,
    staffUser: DemoStaffUser,
    schemeCode?: string
  ) => {
    const now = new Date().toISOString();
    const targetApp = applications.find(a => a.reference === appRef);
    if (!targetApp) return;

    // Separation of duties / authorization threshold validation
    if (staffUser.role === 'BRANCH_MANAGER' && sanctionedAmount > settings.branchManagerApprovalLimit) {
      throw new Error(`Sanction amount (₹${sanctionedAmount.toLocaleString('en-IN')}) exceeds Branch Manager authorization limit (₹${settings.branchManagerApprovalLimit.toLocaleString('en-IN')}). Escalate to Super Admin.`);
    }

    const nextStatus: ApplicationStatus = decision === 'Approved' 
      ? (settings.custodyHandoverMandatory ? 'Custody Pending' : 'Awaiting Demo Disbursement')
      : 'Rejected — Demo';

    const stageDesc = decision === 'Approved'
      ? `Authorized approval recorded by ${staffUser.fullName} (${staffUser.role}) for ₹${sanctionedAmount.toLocaleString('en-IN')}. ${notes}`
      : `Application rejected by ${staffUser.fullName}. Reason: ${notes}`;

    let loanAccountId: string | undefined = undefined;

    if (decision === 'Approved') {
      const loanSeq = 9000 + loans.length + 1;
      const loanNum = `AGF-LN-2026-${loanSeq}`;
      loanAccountId = `LOAN-${loanSeq}`;

      const finalEntry = finalEntries.find(f => f.applicationReference === appRef);
      const interestRate = finalEntry ? finalEntry.annualInterestRate : settings.defaultAnnualInterestRate;
      const tenure = finalEntry ? finalEntry.tenureMonths : targetApp.loanPreferences.preferredTenureMonths;
      const repaymentMethod = finalEntry ? finalEntry.repaymentMethod : targetApp.loanPreferences.repaymentMethod;
      const totalInterest = (sanctionedAmount * interestRate * tenure) / 1200;

      const matchedScheme = schemes.find(s => s.code === (schemeCode || targetApp.loanPreferences.schemeCode || finalEntry?.schemeCode));

      const newLoan: DemoLoanAccount = {
        id: loanAccountId,
        loanAccountNumber: loanNum,
        applicationReference: appRef,
        customerName: targetApp.customer.fullName,
        customerMobile: targetApp.customer.mobile,
        sanctionedAmount,
        disbursedAmount: 0,
        annualInterestRate: interestRate,
        tenureMonths: tenure,
        sanctionedDate: now,
        repaymentMethod,
        totalInterestPayable: totalInterest,
        totalPayableAmount: sanctionedAmount + totalInterest,
        totalRepaid: 0,
        remainingBalance: sanctionedAmount + totalInterest,
        principalOutstanding: sanctionedAmount,
        accruedInterest: totalInterest,
        status: 'Awaiting Disbursement',
        branchId: targetApp.assignedBranchId,
        schemeCode: matchedScheme?.code || 'AGF-REGULAR',
        schemeName: matchedScheme?.name || 'Aurum Easy Liquidity Scheme',
        goldReleaseStatus: 'Not Eligible',
      };

      setLoans(prev => [newLoan, ...prev]);

      if (settings.custodyHandoverMandatory) {
        addNotification({
          targetRole: 'CUSTODY_OFFICER',
          title: 'Gold Packet Awaiting Vault Custody',
          message: `Application ${appRef} approved for ₹${sanctionedAmount.toLocaleString('en-IN')}. Confirm packet seal & locker assignment before disbursement.`,
          type: 'warning',
          link: '/staff/custody',
        });
      } else {
        addNotification({
          targetRole: 'CASHIER',
          title: 'New Disbursement Eligible',
          message: `Application ${appRef} approved for ₹${sanctionedAmount.toLocaleString('en-IN')}. Ready in cashier queue.`,
          type: 'info',
          link: '/staff/cashier/pending',
        });
      }
    }

    setApplications(prev => prev.map(app => {
      if (app.reference === appRef) {
        const wfEvent = {
          id: `WF-${Date.now()}`,
          timestamp: now,
          status: nextStatus,
          stageName: decision === 'Approved' ? 'Sanction Approved' : 'Sanction Rejected',
          performedBy: staffUser.fullName,
          performedByRole: staffUser.role,
          description: stageDesc,
        };

        return {
          ...app,
          status: nextStatus,
          currentStage: decision === 'Approved'
            ? (settings.custodyHandoverMandatory ? 'Sanction Approved · Awaiting Gold Custody Vault Confirmation' : 'Sanction Approved · Awaiting Cashier Disbursement')
            : 'Application Rejected',
          updatedAt: now,
          loanAccountId,
          authorizedDecision: {
            decision,
            decidedBy: staffUser.id,
            decidedByName: staffUser.fullName,
            decidedAt: now,
            sanctionedAmount,
            annualInterestRate: settings.defaultAnnualInterestRate,
            tenureMonths: targetApp.loanPreferences.preferredTenureMonths,
            notes,
            schemeCode,
          },
          latestActivity: stageDesc,
          workflowHistory: [...app.workflowHistory, wfEvent],
        };
      }
      return app;
    }));

    logActivity(
      staffUser.id,
      staffUser.fullName,
      staffUser.role,
      'Sanction Decision',
      `${decision} ${appRef} (${decision === 'Approved' ? `₹${sanctionedAmount.toLocaleString('en-IN')}` : notes})`,
      appRef
    );

    addNotification({
      targetRole: 'CUSTOMER',
      title: decision === 'Approved' ? 'Gold Loan Sanction Approved!' : 'Application Decision Recorded',
      message: decision === 'Approved' 
        ? `Your gold loan application ${appRef} is approved for ₹${sanctionedAmount.toLocaleString('en-IN')}.`
        : `Your application ${appRef} was not approved during review: ${notes}`,
      type: decision === 'Approved' ? 'success' : 'alert',
      link: '/dashboard/applications',
    });
  };

  // 8. Gold Custody Officer Confirms Vault Custody
  const confirmGoldCustody = (
    appRef: string,
    data: {
      packetReference: string;
      vaultLocation: string;
      itemCount: number;
      totalGrossWeight: number;
      totalNetWeight: number;
      custodyNotes?: string;
    },
    staffUser: DemoStaffUser
  ): GoldCustodyRecord => {
    const now = new Date().toISOString();
    const app = applications.find(a => a.reference === appRef);
    if (!app) throw new Error('Application not found');

    const newCustody: GoldCustodyRecord = {
      id: `CUSTODY-${Date.now().toString().slice(-6)}`,
      applicationReference: appRef,
      loanAccountNumber: app.loanAccountId,
      customerName: app.customer.fullName,
      packetReference: data.packetReference,
      vaultLocation: data.vaultLocation,
      itemCount: data.itemCount,
      totalGrossWeight: data.totalGrossWeight,
      totalNetWeight: data.totalNetWeight,
      purity: app.goldDetails.purity,
      sealedAt: now,
      sealedByStaffId: staffUser.id,
      sealedByStaffName: staffUser.fullName,
      handedOverByStaffId: app.assignedStaffId || 'WEIGHT001',
      handedOverByStaffName: 'Gold Appraiser',
      receivedByStaffId: staffUser.id,
      receivedByStaffName: staffUser.fullName,
      status: 'In Vault',
      custodyNotes: data.custodyNotes || 'Packet sealed in presence of custody witness.',
      movements: [
        {
          id: `MOV-${Date.now()}`,
          timestamp: now,
          action: 'Initial Vault Deposit',
          performedBy: staffUser.id,
          performedByName: staffUser.fullName,
          details: `Deposited packet ${data.packetReference} (${data.itemCount} items, ${data.totalGrossWeight}g gross) into ${data.vaultLocation}.`,
        },
      ],
    };

    setCustodyRecords(prev => [newCustody, ...prev]);

    // Update application to Ready for Disbursement
    setApplications(prev => prev.map(a => {
      if (a.reference === appRef) {
        const wfEvent = {
          id: `WF-${Date.now()}`,
          timestamp: now,
          status: 'Awaiting Demo Disbursement' as const,
          stageName: 'Gold Custody Locked',
          performedBy: staffUser.fullName,
          performedByRole: 'Gold Custody Officer',
          description: `Pledged gold sealed in packet ${data.packetReference} and deposited in ${data.vaultLocation}. Loan ready for cashier payout.`,
        };

        return {
          ...a,
          status: 'Awaiting Demo Disbursement',
          currentStage: 'Pledged Gold in Vault · Awaiting Cashier Disbursement',
          updatedAt: now,
          custodyRecordId: newCustody.id,
          latestActivity: `Custody locked in ${data.vaultLocation} by ${staffUser.fullName}. Ready for disbursement.`,
          workflowHistory: [...a.workflowHistory, wfEvent],
        };
      }
      return a;
    }));

    // Update loan with custody packet ref
    setLoans(prev => prev.map(l => {
      if (l.applicationReference === appRef) {
        return {
          ...l,
          custodyPacketRef: data.packetReference,
        };
      }
      return l;
    }));

    logActivity(
      staffUser.id,
      staffUser.fullName,
      staffUser.role,
      'Vault Custody Locked',
      `Locked gold packet ${data.packetReference} into ${data.vaultLocation} for ${appRef}`,
      appRef
    );

    addNotification({
      targetRole: 'CASHIER',
      title: 'Custody Verified: Ready to Disburse',
      message: `Pledged gold for ${appRef} secured in vault (${data.packetReference}). Disburse when customer requests payout.`,
      type: 'success',
      link: '/staff/cashier/pending',
    });

    return newCustody;
  };

  // 9. Cashier Records Disbursement
  const recordDisbursement = (
    appRef: string,
    amount: number,
    paymentMode: PaymentMode,
    notes: string,
    staffUser: DemoStaffUser
  ): DemoTransaction => {
    const now = new Date().toISOString();
    const app = applications.find(a => a.reference === appRef);
    if (!app) throw new Error('Application not found');

    // Prevent duplicate disbursement
    if (app.status === 'Disbursed — Demo' || app.status === 'Active') {
      throw new Error(`Application ${appRef} is already disbursed. Duplicate disbursement is prohibited.`);
    }

    const txnSeq = 8000 + transactions.length + 1;
    const rcpSeq = 100 + transactions.length + 1;
    const txnRef = `TXN-2026-${txnSeq}`;
    const rcpNum = `RCP-2026-${rcpSeq}`;

    const newTxn: DemoTransaction = {
      id: `TXN-${Date.now()}`,
      transactionReference: txnRef,
      applicationReference: appRef,
      loanAccountNumber: app.loanAccountId,
      type: 'Disbursement',
      paymentMode,
      amount,
      principalComponent: amount,
      interestComponent: 0,
      recordedAt: now,
      processedBy: staffUser.id,
      processedByName: staffUser.fullName,
      processedByRole: 'CASHIER',
      receiptNumber: rcpNum,
      customerName: app.customer.fullName,
      notes: notes || 'Simulated loan payout to borrower.',
      status: 'Successful — Demo',
    };

    setTransactions(prev => [newTxn, ...prev]);

    // Update Loan Account
    setLoans(prev => prev.map(loan => {
      if (loan.applicationReference === appRef) {
        return {
          ...loan,
          disbursedAmount: amount,
          disbursementDate: now,
          status: 'Active',
          nextPaymentDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };
      }
      return loan;
    }));

    // Update Application
    setApplications(prev => prev.map(a => {
      if (a.reference === appRef) {
        const wfEvent = {
          id: `WF-${Date.now()}`,
          timestamp: now,
          status: 'Active' as const,
          stageName: 'Cashier Disbursement Completed',
          performedBy: staffUser.fullName,
          performedByRole: 'Cashier',
          description: `Disbursed ₹${amount.toLocaleString('en-IN')} via ${paymentMode}. Receipt: ${rcpNum}. Loan facility activated.`,
        };

        return {
          ...a,
          status: 'Active',
          currentStage: 'Active Gold Loan Facility Servicing',
          updatedAt: now,
          latestActivity: `Disbursement completed by Cashier ${staffUser.fullName}.`,
          workflowHistory: [...a.workflowHistory, wfEvent],
        };
      }
      return a;
    }));

    logActivity(
      staffUser.id,
      staffUser.fullName,
      staffUser.role,
      'Demo Disbursement',
      `Disbursed ₹${amount.toLocaleString('en-IN')} to ${app.customer.fullName} via ${paymentMode}. Ref: ${txnRef}`,
      appRef
    );

    addNotification({
      targetRole: 'CUSTOMER',
      title: 'Loan Disbursed Successfully',
      message: `Simulated payout of ₹${amount.toLocaleString('en-IN')} has been completed. Ref: ${txnRef}.`,
      type: 'success',
      link: '/dashboard/applications',
    });

    addNotification({
      targetRole: 'SUPER_ADMIN',
      title: 'Disbursement Executed',
      message: `Cashier ${staffUser.fullName} completed disbursement of ₹${amount.toLocaleString('en-IN')} for ${appRef}.`,
      type: 'info',
      link: '/staff/cashier/transactions',
    });

    return newTxn;
  };

  // 10. Cashier Records Repayment
  const recordRepayment = (
    loanAccountId: string,
    amount: number,
    paymentMode: PaymentMode,
    notes: string,
    staffUser: DemoStaffUser,
    breakdown?: { principalComponent?: number; interestComponent?: number }
  ): DemoTransaction => {
    const now = new Date().toISOString();
    const loan = loans.find(l => l.id === loanAccountId || l.loanAccountNumber === loanAccountId);
    if (!loan) throw new Error('Loan account not found');

    if (loan.remainingBalance <= 0) {
      throw new Error(`Loan ${loan.loanAccountNumber} is already fully settled.`);
    }

    const txnSeq = 8000 + transactions.length + 1;
    const rcpSeq = 100 + transactions.length + 1;
    const txnRef = `TXN-2026-${txnSeq}`;
    const rcpNum = `RCP-2026-${rcpSeq}`;

    const principalComp = breakdown?.principalComponent ?? Math.min(amount, loan.principalOutstanding || amount);
    const interestComp = breakdown?.interestComponent ?? Math.max(0, amount - principalComp);

    const newTxn: DemoTransaction = {
      id: `TXN-${Date.now()}`,
      transactionReference: txnRef,
      applicationReference: loan.applicationReference,
      loanAccountNumber: loan.loanAccountNumber,
      type: 'Repayment',
      paymentMode,
      amount,
      principalComponent: principalComp,
      interestComponent: interestComp,
      recordedAt: now,
      processedBy: staffUser.id,
      processedByName: staffUser.fullName,
      processedByRole: 'CASHIER',
      receiptNumber: rcpNum,
      customerName: loan.customerName,
      notes: notes || `Repayment: Principal ₹${principalComp.toLocaleString('en-IN')}, Interest ₹${interestComp.toLocaleString('en-IN')}`,
      status: 'Successful — Demo',
    };

    setTransactions(prev => [newTxn, ...prev]);

    const newRepaid = loan.totalRepaid + amount;
    const newRemaining = Math.max(0, loan.remainingBalance - amount);
    const newPrincipalRemaining = Math.max(0, (loan.principalOutstanding || loan.sanctionedAmount) - principalComp);
    const isClosed = newRemaining === 0;

    setLoans(prev => prev.map(l => {
      if (l.id === loan.id) {
        return {
          ...l,
          totalRepaid: newRepaid,
          remainingBalance: newRemaining,
          principalOutstanding: newPrincipalRemaining,
          status: isClosed ? 'Closed' : 'Active',
          goldReleaseStatus: isClosed ? 'Release Pending Handover' : 'Not Eligible',
        };
      }
      return l;
    }));

    // Update application stage
    if (isClosed) {
      setApplications(prev => prev.map(a => {
        if (a.reference === loan.applicationReference) {
          const wfEvent = {
            id: `WF-${Date.now()}`,
            timestamp: now,
            status: 'Settlement Pending' as const,
            stageName: 'Full Loan Settlement Received',
            performedBy: staffUser.fullName,
            performedByRole: 'Cashier',
            description: `Final repayment of ₹${amount.toLocaleString('en-IN')} received. Balance zero. Pledged jewellery queued for Vault Release.`,
          };
          return {
            ...a,
            status: 'Settlement Pending',
            currentStage: 'Full Repayment Settled · Awaiting Vault Retrieval & Customer Handover',
            updatedAt: now,
            latestActivity: 'Loan fully settled! Pledged gold eligible for handover.',
            workflowHistory: [...a.workflowHistory, wfEvent],
          };
        }
        return a;
      }));

      // Alert Vault Custody Officer
      addNotification({
        targetRole: 'CUSTODY_OFFICER',
        title: 'Gold Release Authorized',
        message: `Loan ${loan.loanAccountNumber} (${loan.customerName}) is fully repaid. Retrieve packet from vault and execute customer handover.`,
        type: 'warning',
        link: '/staff/custody',
      });
    }

    logActivity(
      staffUser.id,
      staffUser.fullName,
      staffUser.role,
      'Demo Repayment',
      `Recorded repayment of ₹${amount.toLocaleString('en-IN')} for ${loan.loanAccountNumber}. Balance left: ₹${newRemaining.toLocaleString('en-IN')}`,
      loan.applicationReference
    );

    addNotification({
      targetRole: 'CUSTOMER',
      title: isClosed ? 'Gold Loan Fully Settled!' : 'Repayment Acknowledged',
      message: isClosed 
        ? `Your gold loan ${loan.loanAccountNumber} is fully repaid! Please visit branch for pledged gold return. Receipt: ${rcpNum}.`
        : `Received repayment of ₹${amount.toLocaleString('en-IN')}. Remaining balance: ₹${newRemaining.toLocaleString('en-IN')}.`,
      type: 'success',
      link: '/dashboard/applications',
    });

    return newTxn;
  };

  // 11. Gold Custody Officer Executes Gold Release & Handover
  const executeGoldRelease = (
    appRef: string,
    customerAcknowledgement: string,
    staffUser: DemoStaffUser
  ) => {
    const now = new Date().toISOString();
    const app = applications.find(a => a.reference === appRef);
    if (!app) throw new Error('Application not found');

    // Update Custody Record
    setCustodyRecords(prev => prev.map(c => {
      if (c.applicationReference === appRef) {
        return {
          ...c,
          status: 'Released to Customer',
          releaseAuthorizedBy: staffUser.fullName,
          releasedAt: now,
          customerAcknowledgement,
          movements: [
            ...c.movements,
            {
              id: `MOV-${Date.now()}`,
              timestamp: now,
              action: 'Customer Handover',
              performedBy: staffUser.id,
              performedByName: staffUser.fullName,
              details: `Pledged gold packet ${c.packetReference} safely handed over to ${c.customerName}. Acknowledgement: ${customerAcknowledgement}`,
            },
          ],
        };
      }
      return c;
    }));

    // Update Application Status to Gold Released and Closed
    setApplications(prev => prev.map(a => {
      if (a.reference === appRef) {
        const wfEvent = {
          id: `WF-${Date.now()}`,
          timestamp: now,
          status: 'Gold Released' as const,
          stageName: 'Pledged Gold Handover Completed',
          performedBy: staffUser.fullName,
          performedByRole: 'Gold Custody Officer',
          description: `Pledged gold packet released from vault and returned to customer with verified identity. Acknowledgement: ${customerAcknowledgement}.`,
        };
        return {
          ...a,
          status: 'Gold Released',
          currentStage: 'Loan Fully Closed & Pledged Gold Released to Borrower',
          updatedAt: now,
          latestActivity: `Pledged gold returned to borrower by Custody Officer ${staffUser.fullName}.`,
          workflowHistory: [...a.workflowHistory, wfEvent],
        };
      }
      return a;
    }));

    // Update loan
    setLoans(prev => prev.map(l => {
      if (l.applicationReference === appRef) {
        return {
          ...l,
          goldReleaseStatus: 'Released',
          goldReleasedDate: now,
          status: 'Closed',
        };
      }
      return l;
    }));

    logActivity(
      staffUser.id,
      staffUser.fullName,
      staffUser.role,
      'Pledged Gold Released',
      `Executed gold handover to ${app.customer.fullName} for ${appRef}`,
      appRef
    );

    addNotification({
      targetRole: 'CUSTOMER',
      title: 'Pledged Gold Handed Over',
      message: `Your pledged jewellery for ${appRef} has been released and handed over. Thank you for choosing Aurum Gold Finance!`,
      type: 'success',
      link: '/dashboard/applications',
    });
  };

  // Scheme Management
  const createScheme = (scheme: Omit<LoanScheme, 'id'>): LoanScheme => {
    const newScheme: LoanScheme = {
      ...scheme,
      id: `SCHEME-${Date.now().toString().slice(-4)}`,
    };
    setSchemes(prev => [...prev, newScheme]);
    logActivity('SUPER_ADMIN', 'Super Admin', 'SUPER_ADMIN', 'Scheme Created', `Created loan scheme ${scheme.name} (${scheme.code})`);
    return newScheme;
  };

  const updateScheme = (id: string, updates: Partial<LoanScheme>) => {
    setSchemes(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logActivity('SUPER_ADMIN', 'Super Admin', 'SUPER_ADMIN', 'Scheme Updated', `Updated loan scheme ${id}`);
  };

  const toggleSchemeActive = (id: string) => {
    setSchemes(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    logActivity('SUPER_ADMIN', 'Super Admin', 'SUPER_ADMIN', 'Scheme Status Toggled', `Toggled active status for scheme ${id}`);
  };

  // Gold Rates Management
  const updateGoldRates = (
    rates: { rate24K: number; rate22K: number; rate20K: number; rate18K: number },
    staffUser: DemoStaffUser
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const newRecord: GoldRateRecord = {
      id: `GR-${today}-${Date.now().toString().slice(-4)}`,
      effectiveDate: today,
      ...rates,
      updatedBy: staffUser.id,
      updatedAt: new Date().toISOString(),
    };
    setGoldRates(prev => [newRecord, ...prev]);
    setSettings(prev => ({ ...prev, goldReferencePrice24K: rates.rate24K }));
    logActivity(staffUser.id, staffUser.fullName, staffUser.role, 'Gold Benchmark Updated', `Updated 24K benchmark rate to ₹${rates.rate24K.toLocaleString('en-IN')}/g`);
  };

  // Cash Reconciliation Management
  const saveCashReconciliation = (data: Omit<DailyCashReconciliation, 'id'>): DailyCashReconciliation => {
    const newRecon: DailyCashReconciliation = {
      ...data,
      id: `RECON-${Date.now()}`,
    };
    setReconciliations(prev => [newRecon, ...prev]);
    logActivity(data.cashierId, data.cashierName, 'CASHIER', 'Cash Drawer Reconciled', `Recorded daily till reconciliation for ${data.branchName}. Count: ₹${data.physicalCountedBalance.toLocaleString('en-IN')}`);
    return newRecon;
  };

  const approveCashReconciliation = (id: string, managerRemarks: string, managerUser: DemoStaffUser) => {
    setReconciliations(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'Manager Approved',
      managerRemarks,
    } : r));
    logActivity(managerUser.id, managerUser.fullName, managerUser.role, 'Cash Reconciliation Approved', `Branch Manager signed off reconciliation ${id}`);
  };

  // Staff Management
  const createStaffUser = (user: Omit<DemoStaffUser, 'id'>): DemoStaffUser => {
    const rolePrefixes: Record<StaffRole, string> = {
      SUPER_ADMIN: 'ADMIN',
      BRANCH_MANAGER: 'BRANCH',
      LOAN_OFFICER: 'LOAN',
      GOLD_APPRAISER: 'WEIGHT',
      GOLD_WEIGHTER: 'WEIGHT',
      CREDIT_OFFICER: 'ENTRY',
      FINAL_ENTRY_OPERATOR: 'ENTRY',
      CASHIER: 'CASH',
      CUSTODY_OFFICER: 'VAULT',
      AUDITOR: 'AUDIT',
    };
    const prefix = rolePrefixes[user.role] || 'STAFF';
    const seq = String(staffUsers.length + 1).padStart(3, '0');
    const id = `${prefix}${seq}`;

    const newStaff: DemoStaffUser = {
      ...user,
      id,
    };

    setStaffUsers(prev => [...prev, newStaff]);
    logActivity('SUPER_ADMIN', 'Super Admin', 'SUPER_ADMIN', 'Staff Created', `Created employee ${user.fullName} (${id}) as ${user.role}`);
    return newStaff;
  };

  const updateStaffUser = (id: string, updates: Partial<DemoStaffUser>) => {
    setStaffUsers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logActivity('SUPER_ADMIN', 'Super Admin', 'SUPER_ADMIN', 'Staff Updated', `Updated employee ${id}`);
  };

  const toggleStaffActive = (id: string, currentAdminId: string): { success: boolean; message?: string } => {
    if (id === currentAdminId) {
      return { success: false, message: 'You cannot deactivate your own active Super Admin account.' };
    }
    const target = staffUsers.find(s => s.id === id);
    if (!target) return { success: false, message: 'Staff member not found.' };

    const newStatus = !target.isActive;
    setStaffUsers(prev => prev.map(s => s.id === id ? { ...s, isActive: newStatus } : s));
    logActivity('SUPER_ADMIN', 'Super Admin', 'SUPER_ADMIN', 'Account Status Changed', `${newStatus ? 'Activated' : 'Deactivated'} staff account ${id} (${target.fullName})`);
    return { success: true };
  };

  // Branch Management
  const createBranch = (branch: Omit<DemoBranch, 'id' | 'code'>): DemoBranch => {
    const code = `B-${branch.city.slice(0, 3).toUpperCase()}-${String(branches.length + 1).padStart(2, '0')}`;
    const id = `BR-${code}`;
    const newBr: DemoBranch = {
      ...branch,
      id,
      code,
    };
    setBranches(prev => [...prev, newBr]);
    logActivity('SUPER_ADMIN', 'Super Admin', 'SUPER_ADMIN', 'Branch Created', `Created branch ${newBr.name} in ${newBr.city}`);
    return newBr;
  };

  const updateBranch = (id: string, updates: Partial<DemoBranch>) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    logActivity('SUPER_ADMIN', 'Super Admin', 'SUPER_ADMIN', 'Branch Updated', `Updated branch ${id}`);
  };

  const toggleBranchActive = (id: string) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
    logActivity('SUPER_ADMIN', 'Super Admin', 'SUPER_ADMIN', 'Branch Status Changed', `Toggled active status for branch ${id}`);
  };

  // Enquiries
  const submitEnquiry = (enquiry: Omit<DemoEnquiry, 'id' | 'createdAt' | 'status'>) => {
    const newEnq: DemoEnquiry = {
      ...enquiry,
      id: `ENQ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'New',
    };
    setEnquiries(prev => [newEnq, ...prev]);
    logActivity('SYSTEM', 'Website Visitor', 'Public', 'Contact Enquiry', `Submitted contact enquiry from ${enquiry.fullName}: ${enquiry.subject}`);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = (role?: StaffRole | 'CUSTOMER' | 'ALL') => {
    setNotifications(prev => prev.map(n => {
      if (!role || role === 'ALL' || n.targetRole === role || n.targetRole === 'ALL') {
        return { ...n, read: true };
      }
      return n;
    }));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Settings
  const updateSettings = (newSettings: Partial<DemoSystemSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
      lastUpdated: new Date().toISOString(),
    }));
    logActivity('SUPER_ADMIN', 'Super Admin', 'SUPER_ADMIN', 'Demo Settings Updated', 'Updated system loan parameters and reference gold price.');
  };

  // Reset Demo Data
  const resetDemoData = () => {
    setApplications(INITIAL_APPLICATIONS);
    setAssessments(INITIAL_ASSESSMENTS);
    setFinalEntries(INITIAL_FINAL_ENTRIES);
    setLoans(INITIAL_LOANS);
    setTransactions(INITIAL_TRANSACTIONS);
    setBranches(INITIAL_BRANCHES);
    setStaffUsers(INITIAL_STAFF);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setEnquiries([]);
    setSettings(INITIAL_SETTINGS);
    setSchemes(INITIAL_SCHEMES);
    setGoldRates(INITIAL_GOLD_RATES);
    setCustodyRecords(INITIAL_CUSTODY_RECORDS);
    setReconciliations(INITIAL_RECONCILIATIONS);

    // Save directly to storage
    setStorageItem(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    setStorageItem(STORAGE_KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
    setStorageItem(STORAGE_KEYS.FINAL_ENTRIES, INITIAL_FINAL_ENTRIES);
    setStorageItem(STORAGE_KEYS.LOANS, INITIAL_LOANS);
    setStorageItem(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    setStorageItem(STORAGE_KEYS.BRANCHES, INITIAL_BRANCHES);
    setStorageItem(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    setStorageItem(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setStorageItem(STORAGE_KEYS.ENQUIRIES, []);
    setStorageItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    setStorageItem(STORAGE_KEYS.SCHEMES, INITIAL_SCHEMES);
    setStorageItem(STORAGE_KEYS.GOLD_RATES, INITIAL_GOLD_RATES);
    setStorageItem(STORAGE_KEYS.CUSTODY_RECORDS, INITIAL_CUSTODY_RECORDS);
    setStorageItem(STORAGE_KEYS.RECONCILIATIONS, INITIAL_RECONCILIATIONS);
    setStorageItem(STORAGE_KEYS.CUSTOMER, INITIAL_CUSTOMER);
    setStorageItem(STORAGE_KEYS.CUSTOMER_SESSION, INITIAL_CUSTOMER);

    logActivity('SUPER_ADMIN', 'Super Admin', 'SUPER_ADMIN', 'Demo Data Reset', 'Reset all demo applications, assessments, transactions, schemes, and settings to factory state.');
  };

  return (
    <DemoDataContext.Provider
      value={{
        applications,
        assessments,
        finalEntries,
        loans,
        transactions,
        branches,
        staffUsers,
        activityLogs,
        notifications,
        enquiries,
        settings,
        schemes,
        goldRates,
        custodyRecords,
        reconciliations,

        submitApplication,
        saveAssessmentDraft,
        submitAssessment,
        returnForGoldCorrection,
        saveFinalEntryDraft,
        submitFinalEntry,
        recordAuthorizedDecision,
        confirmGoldCustody,
        executeGoldRelease,
        recordDisbursement,
        recordRepayment,

        createScheme,
        updateScheme,
        toggleSchemeActive,

        updateGoldRates,

        saveCashReconciliation,
        approveCashReconciliation,

        createStaffUser,
        updateStaffUser,
        toggleStaffActive,

        createBranch,
        updateBranch,
        toggleBranchActive,

        submitEnquiry,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,

        updateSettings,
        resetDemoData,
      }}
    >
      {children}
    </DemoDataContext.Provider>
  );
};

export function useDemoData() {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return context;
}
