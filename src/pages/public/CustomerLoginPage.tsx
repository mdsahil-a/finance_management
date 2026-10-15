import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomerSession } from '../../context/CustomerSessionContext';
import { Logo } from '../../components/common/Logo';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const CustomerLoginPage: React.FC = () => {
  const { loginCustomer } = useCustomerSession();
  const navigate = useNavigate();

  const [email, setEmail] = useState('john.doe@aurum.example');
  const [password, setPassword] = useState('Demo@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your demo email and password.');
      return;
    }

    if (password !== 'Demo@123') {
      setError('Invalid password. For this demo, please use Demo@123.');
      return;
    }

    // Login successful
    loginCustomer();
    navigate('/dashboard');
  };

  const fillDemoCredentials = () => {
    setEmail('john.doe@aurum.example');
    setPassword('Demo@123');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Logo size="lg" className="justify-center" />
        <h2 className="text-2xl font-black text-[#701525] font-display">
          Customer Portal Login
        </h2>
        <p className="text-xs text-gray-500">
          Access your submitted gold loan applications, active accounts, and track status.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#E8E2D8] shadow-xl space-y-6">
          {/* Quick 1-click Demo Fill Box */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-[#701525]">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
                Demo Credentials Preset
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[10px] font-bold uppercase bg-[#701525] text-white px-2 py-0.5 rounded hover:bg-[#58101d]"
              >
                Auto Fill
              </button>
            </div>
            <p className="text-[11px] text-gray-600">
              Email: <code className="font-bold text-[#701525]">john.doe@aurum.example</code><br />
              Password: <code className="font-bold text-[#701525]">Demo@123</code>
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-700">Email Address</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@aurum.example"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Demo@123"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-xs"
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
              className="w-full py-3 rounded-xl font-bold text-xs bg-[#701525] text-white hover:bg-[#58101d] transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <span>Sign In to Customer Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 text-center space-y-2">
            <p className="text-[11px] text-gray-500">
              Need to test staff roles instead?
            </p>
            <Link
              to="/staff/login"
              className="text-xs font-bold text-[#701525] hover:underline block"
            >
              Go to Internal Staff Portal (5 Roles) →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
