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
  UserCheck,
  User,
  ArrowRight
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

  const roleBadges: Record<string, string> = {
    ADMIN: 'bg-purple-50 text-purple-700 border-purple-200',
    MANAGER: 'bg-blue-50 text-blue-700 border-blue-200',
    LOAN_OFFICER: 'bg-amber-50 text-amber-800 border-amber-200',
    APPRAISER: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    CASHIER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CUSTODIAN: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  };

  const roleDescriptions: Record<string, string> = {
    ADMIN: 'Full counter control, gold rate revisions, staff permissions, and master reset.',
    MANAGER: 'Oversees daily collections, monitors safe vault, customer accounts, and approvals.',
    LOAN_OFFICER: 'Issues new gold loans, customer onboarding, pledges, and prints loan vouchers.',
    APPRAISER: 'Evaluates gold purity, weighs ornaments, calculates market value against rates.',
    CASHIER: 'Records payments (interest & principal), manages cash drawer, issues receipts.',
    CUSTODIAN: 'Manages physical safe locker bays, checks in packets and returns collateral upon settlement.',
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
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-100/80 text-amber-800 flex items-center justify-center border border-amber-200/60">
              <Users className="w-5 h-5 text-amber-700" />
            </div>
            <span>Staff & Counter Team</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Multi-role counter assignments, authorizations, and active staff logins.
          </p>
        </div>

        <button
          onClick={() => setIsAddStaffModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-full shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Current Active Counter Staff Banner */}
      <div className="p-6 bg-white border border-zinc-200/80 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-extrabold text-lg shadow-xs">
            {currentStaff.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-zinc-900 text-base">{currentStaff.name}</span>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${roleBadges[currentStaff.role]}`}>
                {currentStaff.role.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Active on Counter
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Phone: <strong className="text-zinc-800">{currentStaff.phone}</strong> {currentStaff.email ? `· ${currentStaff.email}` : ''}
            </p>
          </div>
        </div>

        <div className="text-xs text-zinc-600 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/70 max-w-md">
          <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Assigned Responsibility:</span>
          <p className="text-zinc-700 mt-0.5 leading-relaxed">{roleDescriptions[currentStaff.role]}</p>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffUsers.map((staff) => {
          const isCurrent = currentStaff.id === staff.id;

          return (
            <div
              key={staff.id}
              className={`p-6 rounded-3xl border shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                isCurrent
                  ? 'bg-amber-50/30 border-amber-300 ring-2 ring-amber-300/30'
                  : 'bg-white border-zinc-200/80 hover:border-zinc-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-zinc-900 text-base">{staff.name}</h3>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                      <Phone className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{staff.phone}</span>
                    </p>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shrink-0 ${roleBadges[staff.role]}`}>
                    {staff.role.replace('_', ' ')}
                  </span>
                </div>

                {staff.email && (
                  <p className="text-xs text-zinc-500 mt-2.5 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{staff.email}</span>
                  </p>
                )}

                <p className="text-xs text-zinc-600 mt-3 bg-zinc-50 p-3 rounded-2xl border border-zinc-100 leading-relaxed">
                  {roleDescriptions[staff.role]}
                </p>

                <div className="flex items-center justify-between text-xs text-zinc-500 mt-3 pt-2.5 border-t border-zinc-100">
                  <span>Joined: {staff.joinedDate}</span>
                  <span className="font-mono text-[11px] bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-700 font-bold truncate max-w-[140px]" title={staff.email || staff.username}>
                    {staff.email || staff.username}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {isCurrent ? (
                  <div className="w-full py-2 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold text-center border border-emerald-200 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Currently Active User</span>
                  </div>
                ) : (
                  <button
                    onClick={() => switchStaff(staff.id)}
                    className="w-full py-2 bg-zinc-100 hover:bg-zinc-950 hover:text-white text-zinc-800 font-bold rounded-full text-xs transition-all cursor-pointer text-center"
                  >
                    Switch Counter to {staff.name.split(' ')[0]} &rarr;
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Responsibilities Reference Card */}
      <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-zinc-900">
          Counter Role & Permissions Reference:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {Object.entries(roleDescriptions).map(([r, desc]) => (
            <div key={r} className="p-3.5 bg-zinc-50/80 rounded-2xl border border-zinc-200/60 space-y-1.5">
              <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${roleBadges[r]}`}>
                {r.replace('_', ' ')}
              </span>
              <p className="text-zinc-600 text-[11px] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200/80 text-zinc-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-zinc-100 bg-zinc-50/50">
              <h3 className="font-extrabold text-base text-zinc-900">Add New Staff Member</h3>
              <button
                onClick={() => setIsAddStaffModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-700 font-bold mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Kulkarni"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:ring-2 focus:ring-zinc-900/10 outline-none font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1.5">Role & Responsibility *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffRole)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 outline-none font-medium transition-all"
                >
                  <option value="LOAN_OFFICER">Loan Officer (New Loans & Pledges)</option>
                  <option value="CASHIER">Cashier (Collections & Cash Drawer)</option>
                  <option value="APPRAISER">Appraiser (Gold Valuation & Purity)</option>
                  <option value="CUSTODIAN">Custodian (Safe Vault & Locker Packets)</option>
                  <option value="MANAGER">Manager (Authorizations & Reports)</option>
                  <option value="ADMIN">Administrator (Full Access)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1.5">Contact Phone *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 98200 12345"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. staff@aurumgold.example"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1.5">Quick Login PIN (4 digits)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="1234"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:ring-2 focus:ring-zinc-900/10 outline-none font-mono font-bold transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-full text-xs cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-full text-xs transition-all cursor-pointer shadow-xs"
                >
                  Create Staff User
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
