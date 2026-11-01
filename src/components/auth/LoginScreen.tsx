import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useFinance();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error || 'Authentication failed. Please verify your email and password.');
      }
    } catch {
      setError('An unexpected error occurred during sign-in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100/90 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-amber-200 selection:text-amber-950">
      
      {/* Centered Banking Portal Card */}
      <div className="max-w-md w-full bg-white border border-zinc-200/90 rounded-3xl p-7 sm:p-9 shadow-xl relative overflow-hidden">
        
        {/* Subtle decorative gold top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber-600 via-amber-400 to-amber-600" />

        {/* Brand Emblem & Heading */}
        <div className="flex items-center gap-3.5 mb-7">
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center shadow-xs shrink-0">
            <div className="flex items-end gap-1 h-5.5">
              <div className="w-1.5 h-3 bg-amber-400 rounded-full"></div>
              <div className="w-1.5 h-4.5 bg-amber-500 rounded-full"></div>
              <div className="w-1.5 h-5.5 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-zinc-950 tracking-tight font-heading">
              Aurum Gold Finance
            </h1>
            <span className="text-[10px] font-bold text-amber-700 tracking-wider uppercase block">
              Enterprise Gold Loan Management
            </span>
          </div>
        </div>

        {/* Portal Greeting */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-zinc-950 font-heading">
            Sign In to Station
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Enter your official email and password to access your role dashboard.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 font-medium animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4.5">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                required
                autoComplete="email"
                placeholder="e.g. admin@aurumgold.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50/70 hover:bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 focus:ring-3 focus:ring-zinc-950/5 rounded-xl text-xs font-medium text-zinc-900 outline-none transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full pl-10 pr-10 py-2.5 bg-zinc-50/70 hover:bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-zinc-950 focus:ring-3 focus:ring-zinc-950/5 rounded-xl text-xs font-medium text-zinc-900 outline-none transition-all placeholder:text-zinc-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </form>

        {/* Security & Regulatory Badges */}
        <div className="mt-7 pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </span>
          <span className="flex items-center gap-1 text-zinc-600 font-medium">
            <Building2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Mumbai Fort (#101)</span>
          </span>
        </div>

      </div>

      {/* Subtle footer notice */}
      <p className="text-[11px] text-zinc-400 mt-6 text-center max-w-sm">
        Aurum Gold Finance &middot; Regulated under RBI Gold Loan NBFC Directives. Authorized personnel & verified borrowers only.
      </p>

    </div>
  );
};
