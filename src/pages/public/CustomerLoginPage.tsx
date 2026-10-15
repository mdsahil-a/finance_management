import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomerSession } from '../../context/CustomerSessionContext';
import { useDemoData } from '../../context/DemoDataContext';
import { INITIAL_CUSTOMER } from '../../data/initialData';
import { Logo } from '../../components/common/Logo';
import { DemoCustomer } from '../../types';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';

export const CustomerLoginPage: React.FC = () => {
  const { loginCustomer } = useCustomerSession();
  const { applications } = useDemoData();
  const navigate = useNavigate();

  // Inputs start completely empty - User MUST enter credentials
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const customerList: Array<{ name: string; email: string; mobile: string }> = [
    { name: 'John Doe', email: 'john.doe@aurum.example', mobile: '+91 98765 43210' },
    { name: 'Rajesh Mehra', email: 'rajesh.m@example.com', mobile: '+91 98201 12345' },
    { name: 'Deepika Sen', email: 'deepika.s@example.com', mobile: '+91 97112 34567' },
    { name: 'Venkatesh Naidu', email: 'venkat.n@example.com', mobile: '+91 94401 98765' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanInput = identifier.trim();
    if (!cleanInput) {
      setError('Please enter your registered email address or mobile number.');
      return;
    }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    const isPasswordValid = password === 'Customer@123' || password === 'Demo@123';
    if (!isPasswordValid) {
      setError('Invalid password. Please check your password and try again.');
      return;
    }

    // Find customer in list or applications or initial customer
    const matchedAccount = customerList.find(
      (c) =>
        c.email.toLowerCase() === cleanInput.toLowerCase() ||
        c.mobile.replace(/\s+/g, '') === cleanInput.replace(/\s+/g, '') ||
        c.mobile.replace(/[^0-9]/g, '').slice(-10) === cleanInput.replace(/[^0-9]/g, '').slice(-10)
    );

    let customerToLogin: DemoCustomer;

    if (matchedAccount) {
      const matchedApp = applications.find(
        (a) => a.customer.email.toLowerCase() === matchedAccount.email.toLowerCase()
      );

      customerToLogin = {
        id: matchedApp ? `CUST-${matchedApp.id}` : INITIAL_CUSTOMER.id,
        fullName: matchedAccount.name,
        email: matchedAccount.email,
        mobile: matchedAccount.mobile,
        city: matchedApp?.customer.city || 'Mumbai',
        state: matchedApp?.customer.state || 'Maharashtra',
        kycStatus: 'Verified',
        createdAt: '2026-09-15T10:00:00Z',
      };
    } else {
      if (!cleanInput.includes('@') && cleanInput.replace(/[^0-9]/g, '').length < 10) {
        setError('Please enter a valid email address or 10-digit mobile number.');
        return;
      }

      customerToLogin = {
        id: `CUST-${Date.now().toString().slice(-6)}`,
        fullName: cleanInput.includes('@') ? cleanInput.split('@')[0].replace(/[._]/g, ' ') : 'Demo Customer',
        email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@aurum.example`,
        mobile: cleanInput.includes('@') ? '+91 98765 43210' : cleanInput,
        city: 'Mumbai',
        state: 'Maharashtra',
        kycStatus: 'Verified',
        createdAt: new Date().toISOString(),
      };
    }

    // Login successful
    loginCustomer(customerToLogin);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Logo size="lg" className="justify-center" />
        <h2 className="text-2xl font-black text-[#701525] font-display">
          Customer Portal Login
        </h2>
        <p className="text-xs text-gray-500">
          Access your submitted gold loan applications, active accounts, repayments, and live status.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#E8E2D8] shadow-xl space-y-6">
          <div className="border-b border-gray-100 pb-3 text-center sm:text-left">
            <h3 className="text-sm font-bold text-gray-900">Sign In to Your Account</h3>
            <p className="text-[11px] text-gray-500">Enter your registered email address or mobile number.</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Login Error:</span>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-700 block">
                Registered Email or Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. john.doe@aurum.example or 9876543210"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] focus:ring-1 focus:ring-[#701525] outline-none text-xs transition-colors"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700 block">
                Password <span className="text-red-500">*</span>
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
                  placeholder="Enter your account password"
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
              className="w-full py-3 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              <span>Sign In to Customer Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 text-center space-y-2">
            <p className="text-[11px] text-gray-500">
              Need to access the internal staff operations portal?
            </p>
            <Link
              to="/staff/login"
              className="text-xs font-bold text-[#701525] hover:underline block"
            >
              Go to Internal Staff Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
