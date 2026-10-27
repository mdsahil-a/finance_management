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
  AlertCircle
} from 'lucide-react';

export const ROLE_PASSWORDS: Record<string, string> = {
  ADMIN001: 'Admin@123',
  BRANCH001: 'Manager@123',
  LOAN001: 'Loan@123',
  WEIGHT001: 'Weight@123',
  ENTRY001: 'Credit@123',
  CASH001: 'Cashier@123',
  VAULT001: 'Vault@123',
  AUDIT001: 'Auditor@123',
};

export const StaffLoginPage: React.FC = () => {
  const { loginStaff } = useStaffSession();
  const { staffUsers } = useDemoData();
  const navigate = useNavigate();

  // Inputs start completely empty - User MUST enter credentials
  const [staffIdentifier, setStaffIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanInput = staffIdentifier.trim();
    if (!cleanInput) {
      setError('Please enter your Employee Staff ID or Official Email.');
      return;
    }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    // Match by either Staff ID (case-insensitive) or Email (case-insensitive)
    const targetUser = staffUsers.find(
      (s) =>
        s.id.toUpperCase() === cleanInput.toUpperCase() ||
        s.email.toLowerCase() === cleanInput.toLowerCase()
    );

    if (!targetUser) {
      setError(`No staff record found matching "${cleanInput}". Please verify your Staff ID or official email.`);
      return;
    }

    if (!targetUser.isActive) {
      setError(`Account for ${targetUser.fullName} (${targetUser.id}) has been deactivated by Super Admin.`);
      return;
    }

    const expectedPassword = ROLE_PASSWORDS[targetUser.id] || 'Demo@123';
    const isPasswordValid = password === expectedPassword || password === 'Demo@123';

    if (!isPasswordValid) {
      setError(`Incorrect password for ${targetUser.fullName} (${targetUser.id}). Please check your password and try again.`);
      return;
    }

    // Successfully authenticated
    loginStaff(targetUser);
    navigate(ROLE_DEFAULT_ROUTES[targetUser.role]);
  };

  return (
    <div className="min-h-screen bg-[#1f050b] text-[#FAF8F3] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#A71930]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 relative z-10">
        <Logo variant="light" size="lg" className="justify-center" />
        <h2 className="text-2xl sm:text-3xl font-black text-white font-display mt-4">
          Gold Loan Management System
        </h2>
        <p className="text-xs text-[#E9D6A6]">
          Internal Staff Authentication Gateway
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white text-gray-900 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-[#C9A45C]/30 space-y-6">
          <div className="text-center border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-[#701525] font-display">Staff Member Sign In</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter your assigned Staff ID or official email and password to access the operational console.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Authentication Failed:</span>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-700 block">
                Employee Staff ID or Official Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={staffIdentifier}
                  onChange={(e) => {
                    setStaffIdentifier(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. ADMIN001 or admin@aurum.example"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] focus:ring-1 focus:ring-[#701525] outline-none text-xs transition-colors"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700 block">
                System Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your system password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] focus:ring-1 focus:ring-[#701525] outline-none text-xs transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-all shadow-lg shadow-[#701525]/20 flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#FFE59E]" />
              <span>Authenticate & Sign In</span>
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <Link to="/" className="text-[#701525] font-semibold hover:underline">
              ← Public Website
            </Link>
            <Link to="/login" className="text-gray-600 hover:text-[#701525]">
              Customer Portal Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
