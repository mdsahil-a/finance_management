import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useCustomerSession } from '../../context/CustomerSessionContext';
import { useDemoData } from '../../context/DemoDataContext';
import { 
  Search, 
  User, 
  Menu, 
  X, 
  ArrowRight, 
  ShieldAlert, 
  Building2, 
  Calculator, 
  HelpCircle,
} from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentCustomer, logoutCustomer } = useCustomerSession();
  const { branches, applications } = useDemoData();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gold Loans', path: '/gold-loan' },
    { name: 'Loan Calculator', path: '/calculator' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Branch Locator', path: '/branches' },
    { name: 'Track Loan', path: '/track-application' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Contact', path: '/contact' },
  ];

  // Quick search results
  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.city.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  const filteredApps = applications.filter(a => 
    a.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 2);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (searchQuery.toUpperCase().startsWith('AGF-')) {
      navigate(`/track-application?ref=${encodeURIComponent(searchQuery.trim().toUpperCase())}`);
    } else {
      navigate(`/branches?search=${encodeURIComponent(searchQuery.trim())}`);
    }
    setSearchModalOpen(false);
  };

  return (
    <>
      {/* Top Banner: CEO / Executive Demo Mode Notice */}
      <div className="bg-[#701525] text-white text-xs py-1.5 px-4 border-b border-[#C9A45C]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A45C] text-[#701525]">
              CEO DEMO PROTOTYPE
            </span>
            <span className="hidden sm:inline text-[#E9D6A6]">
              All valuations and workflows are simulated.
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              to="/staff/login"
              className="inline-flex items-center gap-1.5 text-[#E9D6A6] hover:text-white transition-colors bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span>Staff Management Portal (8 Roles)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D8] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-20 py-2">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                      isActive
                        ? 'text-[#701525] bg-[#701525]/5 border-b-2 border-[#A71930]'
                        : 'text-gray-700 hover:text-[#701525] hover:bg-[#FAF8F3]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Search Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2.5 rounded-xl text-gray-500 hover:text-[#701525] hover:bg-[#FAF8F3] transition-colors border border-transparent hover:border-[#E8E2D8]"
                title="Search website, branches & applications"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Customer Account */}
              {currentCustomer ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#701525] bg-[#701525]/5 border border-[#701525]/20 hover:bg-[#701525]/10 transition-colors"
                  >
                    <User className="w-4 h-4 text-[#A71930]" />
                    <span>{currentCustomer.fullName.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={logoutCustomer}
                    className="text-xs text-gray-500 hover:text-red-600 px-2 py-1"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-700 hover:text-[#701525] hover:bg-[#FAF8F3] border border-[#E8E2D8] transition-colors"
                >
                  <User className="w-4 h-4 text-[#C9A45C]" />
                  <span>Customer Login</span>
                </Link>
              )}

            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-gray-600 hover:text-[#701525]"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-[#701525] rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#E8E2D8] px-4 pt-2 pb-6 space-y-2 shadow-xl">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-semibold ${
                    isActive
                      ? 'bg-[#701525]/10 text-[#701525] font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              {currentCustomer ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-bold text-[#701525] bg-[#701525]/5"
                >
                  Go to Dashboard ({currentCustomer.fullName})
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-bold text-gray-700 border border-[#E8E2D8]"
                >
                  Customer Login
                </Link>
              )}
              <Link
                to="/staff/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl font-semibold text-xs text-[#701525] bg-amber-50 border border-amber-200"
              >
                Staff Portal (4 Internal Roles)
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Interactive Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-[#E8E2D8] overflow-hidden">
            <form onSubmit={handleSearchSubmit} className="p-4 border-b border-gray-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search branches, application ref (e.g. AGF-2026-100001), or FAQs..."
                className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            <div className="p-4 max-h-96 overflow-y-auto space-y-4">
              {/* Quick links */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Quick Shortcuts
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    to="/calculator"
                    onClick={() => setSearchModalOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#FAF8F3] text-gray-700 font-medium"
                  >
                    <Calculator className="w-4 h-4 text-[#C9A45C]" />
                    <span>Gold Loan Calculator</span>
                  </Link>
                  <Link
                    to="/track-application"
                    onClick={() => setSearchModalOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#FAF8F3] text-gray-700 font-medium"
                  >
                    <ArrowRight className="w-4 h-4 text-[#A71930]" />
                    <span>Track Application Status</span>
                  </Link>
                  <Link
                    to="/branches"
                    onClick={() => setSearchModalOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#FAF8F3] text-gray-700 font-medium"
                  >
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>Find Nearest Branch</span>
                  </Link>
                  <Link
                    to="/faqs"
                    onClick={() => setSearchModalOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#FAF8F3] text-gray-700 font-medium"
                  >
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    <span>Browse 20+ FAQs</span>
                  </Link>
                </div>
              </div>

              {/* Matching Branches */}
              {searchQuery && filteredBranches.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Matching Branches
                  </p>
                  <div className="space-y-1">
                    {filteredBranches.map(b => (
                      <Link
                        key={b.id}
                        to={`/branches?search=${encodeURIComponent(b.city)}`}
                        onClick={() => setSearchModalOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 text-xs text-gray-800"
                      >
                        <span className="font-semibold">{b.name}</span>
                        <span className="text-gray-500">{b.city}, {b.state}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Applications */}
              {searchQuery && filteredApps.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Matching Applications
                  </p>
                  <div className="space-y-1">
                    {filteredApps.map(a => (
                      <Link
                        key={a.id}
                        to={`/track-application?ref=${encodeURIComponent(a.reference)}`}
                        onClick={() => setSearchModalOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 text-xs text-gray-800"
                      >
                        <span className="font-mono font-bold text-[#701525]">{a.reference}</span>
                        <span className="text-gray-500">{a.customer.fullName} • {a.status}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
