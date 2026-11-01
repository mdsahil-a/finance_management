import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  ShieldCheck,
  Search,
  Printer,
  CheckCircle2,
  Phone,
  Box,
  Lock,
  History,
  AlertTriangle,
  Clock,
  KeyRound,
  FileCheck2,
  X,
  BadgeCheck,
} from 'lucide-react';
import { Loan } from '../../types/finance';

export const SafePage: React.FC = () => {
  const {
    loans,
    custodyLogs,
    currentRole,
    secureGoldAndActivateLoan,
    releaseGoldToCustomer,
    setSelectedLoanForPrint,
    setActivePrintModal,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'in_safe' | 'pending_vault' | 'release_ready' | 'returned' | 'custody_logs'>('in_safe');
  const [search, setSearch] = useState('');

  // Modals state
  const [vaultModalLoan, setVaultModalLoan] = useState<Loan | null>(null);
  const [packetNumberInput, setPacketNumberInput] = useState('');
  const [lockerBayInput, setLockerBayInput] = useState('Locker Bay 01 / Shelf B');
  const [vaultNotesInput, setVaultNotesInput] = useState('Sealed in tamper-proof security pouch in presence of appraiser and borrower.');

  const [releaseModalLoan, setReleaseModalLoan] = useState<Loan | null>(null);
  const [releaseNotesInput, setReleaseNotesInput] = useState('Borrower Aadhaar card verified at counter. Ornaments inspected and intact.');

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filtered loans
  const pendingVaultLoans = loans.filter((l) => l.safeStatus === 'Pending Vaulting');
  const releaseReadyLoans = loans.filter((l) => l.safeStatus === 'Release Authorized');
  const inSafeLoans = loans.filter((l) => l.safeStatus === 'In Safe');
  const returnedLoans = loans.filter((l) => l.safeStatus === 'Returned to Customer');

  const filteredLoans = loans.filter((l) => {
    if (activeTab === 'in_safe' && l.safeStatus !== 'In Safe') return false;
    if (activeTab === 'pending_vault' && l.safeStatus !== 'Pending Vaulting') return false;
    if (activeTab === 'release_ready' && l.safeStatus !== 'Release Authorized') return false;
    if (activeTab === 'returned' && l.safeStatus !== 'Returned to Customer') return false;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchPacket = (l.safePacketNumber || '').toLowerCase().includes(q);
      const matchCustomer = l.customerName.toLowerCase().includes(q);
      const matchPhone = l.customerPhone.includes(q);
      const matchLoan = l.id.toLowerCase().includes(q);
      return matchPacket || matchCustomer || matchPhone || matchLoan;
    }

    return true;
  });

  const filteredCustodyLogs = custodyLogs.filter((log) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      log.loanId.toLowerCase().includes(q) ||
      log.safePacketNumber.toLowerCase().includes(q) ||
      log.lockerBay.toLowerCase().includes(q) ||
      log.custodianStaffName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q)
    );
  });

  // Aggregated metrics
  const totalGramsInSafe = inSafeLoans.reduce((acc, l) => acc + l.totalWeightGrams, 0);
  const totalValueInSafe = inSafeLoans.reduce((acc, l) => acc + l.goldValueTotal, 0);

  // Open Vaulting Modal
  const openVaultModal = (loan: Loan) => {
    setActionError(null);
    setActionSuccess(null);
    setVaultModalLoan(loan);
    setPacketNumberInput(loan.safePacketNumber || `PKT-2026-${loan.id.replace('LN-', '')}`);
    setLockerBayInput('Locker Bay 02 / Tier A');
    setVaultNotesInput('Inspected, weighed, and sealed in dual-custody safe vault pouch.');
  };

  const handleConfirmVaulting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaultModalLoan) return;

    const res = secureGoldAndActivateLoan(vaultModalLoan.id, {
      safePacketNumber: packetNumberInput,
      lockerBay: lockerBayInput,
      notes: vaultNotesInput,
    });

    if (res.success) {
      setActionSuccess(`Gold packet "${packetNumberInput}" secured in ${lockerBayInput}. Loan ${vaultModalLoan.id} activated!`);
      setVaultModalLoan(null);
    } else {
      setActionError(res.error || 'Failed to secure packet');
    }
  };

  // Open Handover Modal
  const openReleaseModal = (loan: Loan) => {
    setActionError(null);
    setActionSuccess(null);
    setReleaseModalLoan(loan);
    setReleaseNotesInput(`Physical ornaments handed over to ${loan.customerName}. Identity verified against original KYC document.`);
  };

  const handleConfirmHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!releaseModalLoan) return;

    const res = releaseGoldToCustomer(releaseModalLoan.id, {
      notes: releaseNotesInput,
    });

    if (res.success && res.loan) {
      setActionSuccess(`Gold packet returned to customer ${releaseModalLoan.customerName}. Loan closed.`);
      setSelectedLoanForPrint(res.loan);
      setActivePrintModal('GOLD_RETURN');
      setReleaseModalLoan(null);
    } else {
      setActionError(res.error || 'Failed to complete handover');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight flex items-center gap-2.5 font-heading">
            <ShieldCheck className="w-7 h-7 text-zinc-900" />
            <span>Gold Safe & Locker Vault</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-0.5">
            Physical dual-custody locker tracking, tamper-evident packet sealing, and authorized collateral releases.
          </p>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2">
          {pendingVaultLoans.length > 0 && (
            <button
              onClick={() => setActiveTab('pending_vault')}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center gap-1.5 shadow-xs animate-pulse cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingVaultLoans.length} Vaulting Pending</span>
            </button>
          )}

          {releaseReadyLoans.length > 0 && (
            <button
              onClick={() => setActiveTab('release_ready')}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{releaseReadyLoans.length} Ready for Release</span>
            </button>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-950 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-700 hover:text-rose-950 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block font-heading">
              Gold in Vault
            </span>
            <div className="w-8 h-8 rounded-2xl bg-zinc-100 text-zinc-900 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-zinc-800" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-zinc-950 mt-2 block tracking-tight font-heading">
            {totalGramsInSafe.toFixed(2)} <span className="text-sm font-normal text-zinc-400">g</span>
          </span>
          <span className="text-xs text-zinc-500 mt-0.5 block font-medium">Net weight secured</span>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block font-heading">
              Active Packets
            </span>
            <div className="w-8 h-8 rounded-2xl bg-zinc-100 text-zinc-900 flex items-center justify-center">
              <Box className="w-4 h-4 text-zinc-800" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-zinc-950 mt-2 block tracking-tight font-heading">
            {inSafeLoans.length} <span className="text-sm font-normal text-zinc-400">packets</span>
          </span>
          <span className="text-xs text-zinc-500 mt-0.5 block font-medium">Locked in locker bays</span>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block font-heading">
              Awaiting Vaulting
            </span>
            <div className="w-8 h-8 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-amber-700 mt-2 block tracking-tight font-heading">
            {pendingVaultLoans.length} <span className="text-sm font-normal text-zinc-400">disbursed</span>
          </span>
          <span className="text-xs text-zinc-500 mt-0.5 block font-medium">Requires bay assignment</span>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block font-heading">
              Collateral Valuation
            </span>
            <div className="w-8 h-8 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="font-extrabold text-xs">₹</span>
            </div>
          </div>
          <span className="text-2xl font-extrabold text-emerald-700 mt-2 block tracking-tight font-heading">
            ₹{totalValueInSafe.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-zinc-500 mt-0.5 block font-medium">Assayed market worth</span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-zinc-200/80 p-3 rounded-2xl shadow-xs">
        <div className="flex items-center p-1 bg-zinc-100/90 rounded-full border border-zinc-200/60 overflow-x-auto scrollbar-none gap-1">
          <button
            onClick={() => setActiveTab('in_safe')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'in_safe'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/80'
            }`}
          >
            In Safe Locker ({inSafeLoans.length})
          </button>

          <button
            onClick={() => setActiveTab('pending_vault')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pending_vault'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-800 hover:text-zinc-950 hover:bg-amber-100/60'
            }`}
          >
            <span>Awaiting Vaulting</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 text-amber-950">
              {pendingVaultLoans.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('release_ready')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'release_ready'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-emerald-800 hover:text-zinc-950 hover:bg-emerald-100/60'
            }`}
          >
            <span>Release Authorized</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-200 text-emerald-950">
              {releaseReadyLoans.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('returned')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'returned'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/80'
            }`}
          >
            Returned History ({returnedLoans.length})
          </button>

          <button
            onClick={() => setActiveTab('custody_logs')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'custody_logs'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/80'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Custody Audit Trail ({custodyLogs.length})</span>
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search packet, customer, loan, bay..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 hover:bg-zinc-100 focus:bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-950/5 rounded-full text-xs text-zinc-900 placeholder-zinc-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'custody_logs' ? (
        /* Custody Audit Trail Table */
        <div className="bg-white border border-zinc-200/80 rounded-[28px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-700" />
              <span>Official Gold Custody Movement Log</span>
            </h3>
            <span className="text-xs text-zinc-500">Immutable dual-custody safe registry</span>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[700px] text-xs text-left">
              <thead className="bg-zinc-50 text-zinc-600 font-bold text-[11px] border-b border-zinc-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Loan Account</th>
                  <th className="py-3.5 px-4">Safe Packet #</th>
                  <th className="py-3.5 px-4">Locker Bay</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Custodian Staff</th>
                  <th className="py-3.5 px-4">Verification Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {filteredCustodyLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-zinc-400 font-medium">
                      No custody movement logs recorded matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCustodyLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-zinc-900">
                        {log.loanId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded text-[11px]">
                          {log.safePacketNumber}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-zinc-700">
                        {log.lockerBay}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            log.action === 'VAULT_STORED'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : log.action === 'RELEASE_AUTHORIZED'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-zinc-900">
                        {log.custodianStaffName}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-600 text-[11px]">
                        {log.notes}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Inventory Table for in_safe / pending_vault / release_ready / returned */
        <div className="bg-white border border-zinc-200/80 rounded-[28px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] overflow-hidden w-full max-w-full min-w-0">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[700px] text-xs text-left">
              <thead className="bg-zinc-50 text-zinc-600 font-bold text-[11px] border-b border-zinc-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Packet / Locker #</th>
                  <th className="py-3.5 px-4">Borrower Customer</th>
                  <th className="py-3.5 px-4">Pledged Gold Ornaments</th>
                  <th className="py-3.5 px-4 text-right">Net Weight</th>
                  <th className="py-3.5 px-4 text-right">Valuation</th>
                  <th className="py-3.5 px-4">Linked Loan</th>
                  <th className="py-3.5 px-4 text-center">Custody Status</th>
                  <th className="py-3.5 px-4 text-center">Operation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {filteredLoans.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-zinc-400 font-medium">
                      No gold packets found in this view.
                    </td>
                  </tr>
                ) : (
                  filteredLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Box className="w-4 h-4 text-zinc-800 shrink-0" />
                          <div>
                            <span className="font-mono font-bold text-zinc-900 text-xs block">
                              {loan.safePacketNumber || 'Awaiting Packet ID'}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-medium">
                              Locker Bay: {loan.vaultedByStaffName ? 'Bay 02 / Tier A' : 'Pending Vault'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-zinc-950 block text-sm font-heading">{loan.customerName}</span>
                        <span className="text-zinc-500 flex items-center gap-1 text-[11px] mt-0.5 font-medium">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          {loan.customerPhone}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-zinc-800 block font-semibold">
                          {loan.goldItems.map((it) => it.name).join(', ')}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {loan.goldItems.length} item(s) · {loan.goldItems[0]?.purity || '22K'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <span className="font-extrabold text-zinc-950 text-sm font-heading">
                          {loan.totalWeightGrams.toFixed(2)} g
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <span className="font-semibold text-zinc-800">
                          ₹{loan.goldValueTotal.toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-zinc-900 bg-zinc-100 border border-zinc-200/80 px-2 py-0.5 rounded-full text-[11px] block w-fit">
                          {loan.id}
                        </span>
                        <span className="text-[11px] text-zinc-500 block mt-0.5 font-medium">
                          {loan.remainingPrincipal === 0 ? (
                            <span className="text-emerald-700 font-bold">100% Settled</span>
                          ) : (
                            `₹${loan.remainingPrincipal.toLocaleString('en-IN')} balance`
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold border ${
                            loan.safeStatus === 'In Safe'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : loan.safeStatus === 'Pending Vaulting'
                              ? 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse'
                              : loan.safeStatus === 'Release Authorized'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                          }`}
                        >
                          {loan.safeStatus}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Step 5 Action: Vault Disbursed Loan */}
                          {loan.safeStatus === 'Pending Vaulting' && (
                            <button
                              onClick={() => openVaultModal(loan)}
                              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold transition-colors cursor-pointer shadow-xs"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                              <span>Vault & Activate</span>
                            </button>
                          )}

                          {/* Step 7 Action: Release Authorized Collateral to Customer */}
                          {loan.safeStatus === 'Release Authorized' && (
                            <button
                              onClick={() => openReleaseModal(loan)}
                              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold transition-colors cursor-pointer shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Hand Over Gold</span>
                            </button>
                          )}

                          {/* Locked in vault indicator */}
                          {loan.safeStatus === 'In Safe' && loan.remainingPrincipal > 0 && (
                            <span className="text-[11px] text-zinc-400 font-medium italic flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Locked in Vault</span>
                            </span>
                          )}

                          {/* Loan settled but awaiting manager clearance */}
                          {loan.safeStatus === 'In Safe' && loan.remainingPrincipal === 0 && (
                            <span className="text-[11px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              Requires Manager Clearance
                            </span>
                          )}

                          {/* Returned to Customer: Print Slip */}
                          {loan.safeStatus === 'Returned to Customer' && (
                            <button
                              onClick={() => {
                                setSelectedLoanForPrint(loan);
                                setActivePrintModal('GOLD_RETURN');
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                              title="Print Return Slip"
                            >
                              <Printer className="w-3.5 h-3.5 text-zinc-500" />
                              <span>Return Slip</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Step 5: Vault & Activate Loan Modal */}
      {vaultModalLoan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3 border-zinc-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-zinc-950 font-heading">
                  Gold Security Vaulting & Loan Activation
                </h3>
              </div>
              <button
                onClick={() => setVaultModalLoan(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmVaulting} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900">{vaultModalLoan.customerName}</span>
                  <span className="font-mono font-bold text-zinc-900">{vaultModalLoan.id}</span>
                </div>
                <div className="text-zinc-600">
                  Disbursed: <strong>₹{vaultModalLoan.loanAmount.toLocaleString('en-IN')}</strong> · Net Weight:{' '}
                  <strong>{vaultModalLoan.totalWeightGrams.toFixed(2)}g</strong>
                </div>
                <div className="text-zinc-500 text-[11px]">
                  Ornaments: {vaultModalLoan.goldItems.map((i) => i.name).join(', ')}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-800">Unique Safe Packet / Pouch Serial # *</label>
                <input
                  type="text"
                  value={packetNumberInput}
                  onChange={(e) => setPacketNumberInput(e.target.value)}
                  placeholder="e.g. PKT-2026-1045"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 font-mono font-bold text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-800">Locker Bay / Safe Shelf Location *</label>
                <input
                  type="text"
                  value={lockerBayInput}
                  onChange={(e) => setLockerBayInput(e.target.value)}
                  placeholder="e.g. Locker Bay 02 / Tier A"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 text-xs font-semibold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-800">Dual-Custody Sealing Notes *</label>
                <textarea
                  value={vaultNotesInput}
                  onChange={(e) => setVaultNotesInput(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-800"
                  required
                />
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVaultModalLoan(null)}
                  className="px-4 py-2 rounded-xl text-zinc-600 bg-zinc-100 hover:bg-zinc-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-zinc-950 hover:bg-zinc-800 shadow-xs flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lock in Safe & Activate Loan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Step 7: Collateral Physical Handover Modal */}
      {releaseModalLoan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3 border-zinc-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-zinc-950 font-heading">
                  Physical Collateral Release & Handover
                </h3>
              </div>
              <button
                onClick={() => setReleaseModalLoan(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmHandover} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900">{releaseModalLoan.customerName}</span>
                  <span className="font-mono font-bold text-emerald-800">
                    Remaining: ₹{releaseModalLoan.remainingPrincipal}
                  </span>
                </div>
                <div className="text-zinc-600">
                  Packet: <strong>{releaseModalLoan.safePacketNumber}</strong> · Net Weight:{' '}
                  <strong>{releaseModalLoan.totalWeightGrams.toFixed(2)}g</strong>
                </div>
                <div className="text-emerald-900 font-semibold text-[11px] pt-1">
                  ✓ Manager Release Authorization Verified & Approved
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-800">Borrower Identity & Handover Verification Notes</label>
                <textarea
                  value={releaseNotesInput}
                  onChange={(e) => setReleaseNotesInput(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-800"
                  required
                />
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReleaseModalLoan(null)}
                  className="px-4 py-2 rounded-xl text-zinc-600 bg-zinc-100 hover:bg-zinc-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs flex items-center gap-1.5"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Hand Over & Generate Release Slip</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
