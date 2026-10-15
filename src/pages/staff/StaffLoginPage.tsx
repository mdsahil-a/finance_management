import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStaffSession } from '../../context/StaffSessionContext';
import { useDemoData } from '../../context/DemoDataContext';
import { Logo } from '../../components/common/Logo';
import { ROLE_LABELS, ROLE_DEFAULT_ROUTES } from '../../utils/permissions';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Users
} from 'lucide-react';

export const StaffLoginPage: React.FC = () => {
  const { loginStaff } = useStaffSession();
  const { staffUsers } = useDemoData();
  const navigate = useNavigate();

  const [staffId, setStaffId] = useState('ADMIN001');
  const [password, setPassword] = useState('Demo@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const targetUser = staffUsers.find(
      (s) => s.id.toUpperCase() === staffId.trim().toUpperCase()
    );

    if (!targetUser) {
      setError(`Staff ID "${staffId}" not found in employee records.`);
      return;
    }

    if (!targetUser.isActive) {
      setError(`Account for ${targetUser.fullName} (${targetUser.id}) has been deactivated by Super Admin.`);
      return;
    }

    if (password !== 'Demo@123') {
      setError('Invalid password. For this demo prototype, use Demo@123.');
      return;
    }

    loginStaff(targetUser);
    navigate(ROLE_DEFAULT_ROUTES[targetUser.role]);
  };

  const handleQuickSelect = (id: string) => {
    const user = staffUsers.find((s) => s.id === id);
    if (user) {
      setStaffId(user.id);
      setPassword('Demo@123');
      setError('');
    }
  };

  const rolePresets = [
    { id: 'ADMIN001', roleNumber: '1', title: 'Super Admin', subtitle: 'ADMIN001 · Full Configuration' },
    { id: 'BRANCH001', roleNumber: '2', title: 'Branch Manager', subtitle: 'BRANCH001 · Approvals & Oversight' },
    { id: 'LOAN001', roleNumber: '3', title: 'Loan Officer', subtitle: 'LOAN001 · Customer Intake & KYC' },
    { id: 'WEIGHT001', roleNumber: '4', title: 'Gold Appraiser', subtitle: 'WEIGHT001 · Gold Assay & Valuation' },
    { id: 'ENTRY001', roleNumber: '5', title: 'Credit Officer', subtitle: 'ENTRY001 · Underwriting Review' },
    { id: 'CASH001', roleNumber: '6', title: 'Cashier', subtitle: 'CASH001 · Payouts & Collections' },
    { id: 'VAULT001', roleNumber: '7', title: 'Vault Custody', subtitle: 'VAULT001 · Strongroom & Handover' },
    { id: 'AUDIT001', roleNumber: '8', title: 'Compliance Auditor', subtitle: 'AUDIT001 · Audit Logs & Reports' },
  ];

  return (
    <div className="min-h-screen bg-[#1f050b] text-[#FAF8F3] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#A71930]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-4 relative z-10">
        <Logo variant="light" size="lg" className="justify-center" />
        <h2 className="text-3xl sm:text-4xl font-black text-white font-display mt-5">
          Gold Loan Management System
        </h2>
        <p className="text-sm text-[#E9D6A6]">
          Enterprise Multi-Role Operations Console (8 Staff Roles)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="bg-white text-gray-900 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-[#C9A45C]/30 space-y-6">
          {/* Demo 1-Click Role Selector */}
          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E2D8] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#701525] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#C9A45C]" />
                Select Demo Role Account (1-Click)
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Preset Password: Demo@123</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {rolePresets.map((preset) => {
                const isSelected = staffId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleQuickSelect(preset.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#701525] bg-[#701525] text-white shadow-xs'
                        : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-bold text-[11px] leading-tight truncate">
                      {preset.roleNumber}. {preset.title}
                    </p>
                    <p className={`text-[9px] mt-0.5 truncate ${isSelected ? 'text-[#FFE59E]' : 'text-gray-500'}`}>
                      {preset.id}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-700">Employee Staff ID</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value.toUpperCase())}
                  placeholder="e.g. ADMIN001"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none font-mono uppercase"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">System Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Demo@123"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-lg shadow-[#701525]/20 flex items-center justify-center gap-2 mt-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#FFE59E]" />
              <span>Authenticate as {ROLE_LABELS[staffUsers.find(s => s.id === staffId)?.role || 'SUPER_ADMIN']}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <Link to="/" className="text-[#701525] font-semibold hover:underline">
              ← Return to Customer Website
            </Link>
            <span className="text-[10px] text-gray-400">
              Frontend Demonstration Console
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
