import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  Users, 
  PlusCircle, 
  ShieldCheck, 
  Phone, 
  Mail, 
  KeyRound, 
  CheckCircle2, 
  X,
  UserCheck
} from 'lucide-react';
import { StaffRole, StaffUser } from '../../types/finance';

export const StaffPage: React.FC = () => {
  const { staffUsers, currentStaff, addStaffUser, updateStaffUser, switchStaff } = useFinance();

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('LOAN_OFFICER');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('1234');

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    MANAGER: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    LOAN_OFFICER: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    APPRAISER: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    CASHIER: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    CUSTODIAN: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  };

  const roleDescriptions: Record<string, string> = {
    ADMIN: 'Full access to all modules, gold rates, daily cash book, and staff management.',
    MANAGER: 'Approves loans, oversees cash book, monitors safe and customer portfolio.',
    LOAN_OFFICER: 'Issues new gold loans, customer onboarding, prints loan vouchers.',
    APPRAISER: 'Tests gold purity, checks weight of ornaments, uses gold calculator.',
    CASHIER: 'Receives payments (interest & principal), manages cash drawer, prints receipts.',
    CUSTODIAN: 'Manages physical safe locker bays, receives and returns gold packets.',
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter staff name');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter staff phone');
      return;
    }

    addStaffUser({
      name: name.trim(),
      role,
      phone: phone.trim(),
      email: email.trim() || undefined,
      pin: pin.trim() || '1234',
      isActive: true,
    });

    setIsAddStaffModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setPin('1234');
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <span>Staff & Team Management</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage multi-staff counter roles, permissions, and active logins
          </p>
        </div>

        <button
          onClick={() => setIsAddStaffModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Staff Member</span>
        </button>
      </div>

      {/* Current Active Counter Staff Banner */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-850 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
            {currentStaff.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm sm:text-base">{currentStaff.name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleColors[currentStaff.role]}`}>
                {currentStaff.role.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Currently signed in on this counter · Phone: {currentStaff.phone}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Role Permission: <strong className="text-white">{roleDescriptions[currentStaff.role]}</strong>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffUsers.map((staff) => {
          const isCurrent = currentStaff.id === staff.id;

          return (
            <div
              key={staff.id}
              className={`p-5 rounded-2xl border shadow-lg flex flex-col justify-between space-y-4 transition-all ${
                isCurrent
                  ? 'bg-slate-900 border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-white text-base">{staff.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{staff.phone}</span>
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      roleColors[staff.role]
                    }`}
                  >
                    {staff.role.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-3">
                  {roleDescriptions[staff.role]}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1 font-mono">
                    <KeyRound className="w-3.5 h-3.5" />
                    PIN: <strong>{staff.pin}</strong>
                  </span>
                  <span className="text-slate-500">
                    Joined: {staff.joinedDate}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                {!isCurrent ? (
                  <button
                    onClick={() => switchStaff(staff.id)}
                    className="flex-1 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-colors"
                  >
                    Switch to this User
                  </button>
                ) : (
                  <span className="flex-1 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold text-center">
                    ✓ Currently Active
                  </span>
                )}

                <button
                  onClick={() => updateStaffUser(staff.id, { isActive: !staff.isActive })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    staff.isActive
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {staff.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Role Explanations Guide Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Role Responsibilities & Access Reference</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {Object.entries(roleDescriptions).map(([r, desc]) => (
            <div key={r} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1.5 ${roleColors[r]}`}>
                {r.replace('_', ' ')}
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base">Add New Staff Member</h3>
              <button
                onClick={() => setIsAddStaffModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amit Kulkarni"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Role / Designation *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffRole)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white"
                >
                  <option value="LOAN_OFFICER">Loan Officer (Counter Lending)</option>
                  <option value="CASHIER">Cashier (Payments & Drawer Cash)</option>
                  <option value="APPRAISER">Gold Appraiser (Testing & Purity)</option>
                  <option value="CUSTODIAN">Safe Custodian (Locker Inventory)</option>
                  <option value="MANAGER">Branch Manager (Approvals)</option>
                  <option value="ADMIN">Admin / Owner (Full Control)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Mobile Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 98200 12345"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">4-Digit Login PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="1234"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
