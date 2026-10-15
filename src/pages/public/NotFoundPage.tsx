import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { ArrowLeft, Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <Logo size="lg" className="justify-center" />

      <div className="space-y-2">
        <span className="font-mono text-5xl font-black text-[#A71930] block">404</span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
          Page or Route Not Found
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          The requested page is not part of the Aurum Gold Finance prototype. Explore our customer services or staff management portal.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#701525] text-white hover:bg-[#58101d] transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/calculator"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <span>Gold Loan Calculator</span>
        </Link>
        <Link
          to="/staff/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors"
        >
          <span>Staff Management Console</span>
        </Link>
      </div>
    </div>
  );
};
