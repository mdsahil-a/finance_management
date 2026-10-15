import React, { useState } from 'react';
import { useDemoData } from '../../../context/DemoDataContext';
import { useStaffSession } from '../../../context/StaffSessionContext';
import { formatCurrency, formatDateTime, formatGrams } from '../../../utils/formatters';
import { 
  Vault, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Key, 
  PackageCheck, 
  Clock, 
  X, 
  UserCheck, 
  Search,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const CustodyDashboardPage: React.FC<{ initialTab?: 'inventory' | 'pending' | 'release' }> = ({ initialTab = 'inventory' }) => {
  const { 
    applications, 
    loans, 
    custodyRecords, 
    confirmGoldCustody, 
    executeGoldRelease 
  } = useDemoData();
  const { currentStaff } = useStaffSession();

  const [activeTab, setActiveTab] = useState<'inventory' | 'pending' | 'release'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');

  // Deposit Modal State
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedAppRef, setSelectedAppRef] = useState<string | null>(null);
  const [sealBarcode, setSealBarcode] = useState('');
  const [vaultRoom, setVaultRoom] = useState('Strongroom Alpha · Locker Bay A-07');
  const [depositNotes, setDepositNotes] = useState('Packet sealed in tamper-evident pouch in presence of valuer and borrower.');

  // Release Modal State
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [releaseAppRef, setReleaseAppRef] = useState<string | null>(null);
  const [customerAck, setCustomerAck] = useState('Customer physical signature and original pledge receipt verified.');

  // Applications awaiting vault deposit (Status: 'Custody Pending')
  const pendingDepositApps = applications.filter(
    (a) => a.status === 'Custody Pending' || (a.status === 'Approved — Demo' && !a.custodyRecordId)
  );

  // Loans ready for gold release (Status: 'Settlement Pending' or goldReleaseStatus: 'Release Pending Handover')
  const releasePendingLoans = loans.filter(
    (l) => l.goldReleaseStatus === 'Release Pending Handover' || l.remainingBalance === 0 && l.status !== 'Closed'
  );

  // Vault Inventory packets
  const vaultPackets = custodyRecords.filter((c) => c.status === 'In Vault');

  const openDepositModal = (appRef: string, defaultItems: number, defaultGross: number, defaultNet: number) => {
    setSelectedAppRef(appRef);
    const seq = String(custodyRecords.length + 1).padStart(4, '0');
    setSealBarcode(`SEAL-MUM-2026-${seq}`);
    setVaultRoom('Strongroom Alpha · Safe Locker B-14');
    setDepositNotes('Pledged jewellery verified against appraiser certificate and sealed.');
    setDepositModalOpen(true);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppRef || !currentStaff) return;
    const targetApp = applications.find((a) => a.reference === selectedAppRef);
    if (!targetApp) return;

    confirmGoldCustody(
      selectedAppRef,
      {
        packetReference: sealBarcode,
        vaultLocation: vaultRoom,
        itemCount: targetApp.goldDetails.itemsCount,
        totalGrossWeight: targetApp.goldDetails.declaredWeight,
        totalNetWeight: targetApp.goldDetails.declaredWeight, // approximation or from assessment
        custodyNotes: depositNotes,
      },
      currentStaff
    );

    setDepositModalOpen(false);
    alert(`Gold packet ${sealBarcode} securely deposited into ${vaultRoom}. Loan ready for cashier payout.`);
  };

  const openReleaseModal = (appRef: string) => {
    setReleaseAppRef(appRef);
    setCustomerAck('Customer physical signature and original pledge receipt verified at branch counter.');
    setReleaseModalOpen(true);
  };

  const handleReleaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!releaseAppRef || !currentStaff) return;

    executeGoldRelease(releaseAppRef, customerAck, currentStaff);
    setReleaseModalOpen(false);
    alert(`Pledged gold successfully released and handed over to customer for application ${releaseAppRef}. Loan account closed.`);
  };

  const filteredInventory = vaultPackets.filter(
    (p) =>
      p.packetReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vaultLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Vault className="w-5 h-5 text-[#C9A45C]" />
            <h1 className="text-2xl font-black text-[#701525] font-display">
              Gold Custody & Strongroom Vault Management
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tamper-evident packet sealing, secure safe locker assignments, chain-of-custody tracking, and borrower handover.
          </p>
        </div>

        {releasePendingLoans.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-[#FFE59E]" />
            <span>{releasePendingLoans.length} Pledged Gold Handover(s) Ready</span>
          </span>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Packets in Strongroom</span>
          <p className="text-2xl font-black text-[#701525]">{vaultPackets.length}</p>
          <span className="text-[10px] text-gray-400">Locked in dual-custody safes</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-amber-400 bg-amber-50/20 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Awaiting Vault Deposit</span>
          <p className="text-2xl font-black text-amber-600">{pendingDepositApps.length}</p>
          <span className="text-[10px] text-amber-700">Approved loans needing locker lock</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-400 bg-emerald-50/20 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Settled / Ready for Release</span>
          <p className="text-2xl font-black text-emerald-700">{releasePendingLoans.length}</p>
          <span className="text-[10px] text-emerald-700">Borrower pickup queue</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'inventory' ? 'border-[#701525] text-[#701525]' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Vault className="w-4 h-4" />
          <span>Active Vault Inventory ({vaultPackets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'pending' ? 'border-[#701525] text-[#701525]' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Awaiting Vault Deposit ({pendingDepositApps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('release')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'release' ? 'border-[#701525] text-[#701525]' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settled Loans & Gold Handover ({releasePendingLoans.length})</span>
        </button>
      </div>

      {/* Tab 1: Active Vault Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Strongroom Safe Locker Register</h3>
              <p className="text-xs text-gray-500">Dual-custody pledged jewellery packets securely stored in institutional safes.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by packet seal, borrower, locker..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#701525] outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Packet Seal Barcode</th>
                  <th className="py-2.5 px-3">Application Ref</th>
                  <th className="py-2.5 px-3">Borrower</th>
                  <th className="py-2.5 px-3">Vault & Locker Location</th>
                  <th className="py-2.5 px-3">Items / Weight</th>
                  <th className="py-2.5 px-3">Sealed By</th>
                  <th className="py-2.5 px-3">Sealed Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400">
                      No matching packets found in active strongroom inventory.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-3 font-mono font-bold text-[#701525]">{item.packetReference}</td>
                      <td className="py-3 px-3 font-mono text-gray-600">{item.applicationReference}</td>
                      <td className="py-3 px-3 font-semibold text-gray-900">{item.customerName}</td>
                      <td className="py-3 px-3 font-bold text-gray-800">{item.vaultLocation}</td>
                      <td className="py-3 px-3">
                        <div>{item.itemCount} items ({item.purity})</div>
                        <div className="text-[10px] text-gray-500">{formatGrams(item.totalGrossWeight)} gross</div>
                      </td>
                      <td className="py-3 px-3 text-gray-600">{item.sealedByStaffName}</td>
                      <td className="py-3 px-3 text-gray-400 text-[11px]">{formatDateTime(item.sealedAt)}</td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Awaiting Vault Deposit */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingDepositApps.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-[#E8E2D8] text-center">
              <PackageCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">No applications awaiting vault deposit</p>
              <p className="text-xs text-gray-500 mt-1">When applications receive sanction approval, they queue here for packet sealing.</p>
            </div>
          ) : (
            pendingDepositApps.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl border border-amber-300 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-[#701525]">{app.reference}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Awaiting Vault Lock
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mt-1">{app.customer.fullName} · {app.customer.mobile}</p>
                  <p className="text-xs text-gray-600">
                    Sanction Amount: <strong>{formatCurrency(app.authorizedDecision?.sanctionedAmount || app.loanPreferences.requestedAmount)}</strong> · Pledged: <strong>{app.goldDetails.itemsCount} {app.goldDetails.category} ({app.goldDetails.declaredWeight}g {app.goldDetails.purity})</strong>
                  </p>
                </div>

                <button
                  onClick={() => openDepositModal(app.reference, app.goldDetails.itemsCount, app.goldDetails.declaredWeight, app.goldDetails.declaredWeight)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-sm flex items-center gap-2 shrink-0"
                >
                  <Lock className="w-4 h-4 text-[#FFE59E]" />
                  <span>Seal & Deposit in Vault</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Settled Loans & Handover */}
      {activeTab === 'release' && (
        <div className="space-y-4">
          {releasePendingLoans.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-[#E8E2D8] text-center">
              <CheckCircle2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">No settled loans awaiting gold release</p>
              <p className="text-xs text-gray-500 mt-1">When a customer finishes full repayment, their account queues here for physical handover.</p>
            </div>
          ) : (
            releasePendingLoans.map((loan) => (
              <div key={loan.id} className="bg-white rounded-2xl border border-emerald-300 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-emerald-800">{loan.loanAccountNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Full Repayment Settled
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mt-1">{loan.customerName} · {loan.customerMobile}</p>
                  <p className="text-xs text-gray-600">
                    Packet Seal: <strong className="font-mono text-[#701525]">{loan.custodyPacketRef || 'SEAL-2026'}</strong> · Remaining Balance: <strong className="text-emerald-700">₹0 (Zero)</strong>
                  </p>
                </div>

                <button
                  onClick={() => openReleaseModal(loan.applicationReference)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-sm flex items-center gap-2 shrink-0"
                >
                  <Key className="w-4 h-4 text-[#FFE59E]" />
                  <span>Retrieve from Locker & Handover</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Deposit Modal */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2D8] space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <h3 className="text-base font-bold text-[#701525]">Lock Pledged Gold into Vault</h3>
              <button onClick={() => setDepositModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Tamper-Evident Bag Seal Barcode</label>
                <input
                  type="text"
                  value={sealBarcode}
                  onChange={(e) => setSealBarcode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-mono font-bold text-[#701525]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Strongroom Safe Locker Assignment</label>
                <input
                  type="text"
                  value={vaultRoom}
                  onChange={(e) => setVaultRoom(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-bold"
                  placeholder="e.g. Strongroom Alpha · Locker Bay B-14"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Custody Verification Notes</label>
                <textarea
                  value={depositNotes}
                  onChange={(e) => setDepositNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDepositModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-[#701525] text-white hover:bg-[#58101d]"
                >
                  Confirm Vault Lock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Release Modal */}
      {releaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2D8] space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <h3 className="text-base font-bold text-emerald-800">Physical Gold Handover to Customer</h3>
              <button onClick={() => setReleaseModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReleaseSubmit} className="space-y-4 text-xs">
              <p className="text-gray-600">
                Verify original government photo ID and obtain physical signature acknowledging complete return of pledged jewellery in pristine condition.
              </p>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Borrower Handover Acknowledgement</label>
                <textarea
                  value={customerAck}
                  onChange={(e) => setCustomerAck(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReleaseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-emerald-700 text-white hover:bg-emerald-800"
                >
                  Confirm Handover & Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
