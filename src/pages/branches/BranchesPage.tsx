import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PageHeader } from '../../components/common/PageHeader';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  ShieldCheck,
  TrendingUp,
  PlusCircle,
  Users,
  CheckCircle2,
  Lock,
  X,
} from 'lucide-react';
import { BranchInfo } from '../../types/finance';

export const BranchesPage: React.FC = () => {
  const { branches, loans } = useFinance();
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<BranchInfo | null>(null);

  const filteredBranches = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.city.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.managerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalNetworkLoans = branches.reduce((sum, b) => sum + b.activeLoansCount, 0);
  const totalNetworkPortfolio = branches.reduce((sum, b) => sum + b.totalDisbursed, 0);
  const totalNetworkGold = branches.reduce((sum, b) => sum + b.totalVaultGoldGrams, 0);

  return (
    <div className="space-y-6">
      
      {/* Muthoot-Style Header */}
      <PageHeader
        title="Authorized Branch Network"
        subtitle="Multi-branch management, vault safe allocations, and localized portfolio surveillance."
        badge={{ label: `${branches.length} Registered Locations`, color: 'bg-purple-100 text-purple-900 border border-purple-200' }}
        breadcrumbs={[
          { label: 'Admin Central', to: '/' },
          { label: 'Branches' },
        ]}
      />

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Active Loans</span>
            <TrendingUp className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black text-zinc-950 font-mono">
            {totalNetworkLoans} accounts
          </div>
          <span className="text-xs text-zinc-500 mt-1 block">Across 5 urban hubs</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Portfolio Book</span>
            <Building2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-zinc-950 font-mono">
            ₹{totalNetworkPortfolio.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">100% Secured by Gold</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Vault Gold</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-zinc-950 font-mono">
            {totalNetworkGold.toFixed(1)} grams
          </div>
          <span className="text-xs text-zinc-500 mt-1 block">Insured safe custody</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search branch name, city, code, manager..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-purple-600 rounded-xl text-xs font-medium text-zinc-900 outline-none"
            />
          </div>
          <span className="text-xs font-bold text-zinc-500">
            Showing {filteredBranches.length} branches
          </span>
        </div>

        {/* Branch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              onClick={() => setSelectedBranch(branch)}
              className="p-5 border border-zinc-200 rounded-2xl bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-zinc-950 font-heading">{branch.name}</h3>
                    <span className="text-[10px] font-mono text-zinc-500 block">{branch.code}</span>
                  </div>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      branch.isActive
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {branch.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                <div className="text-xs text-zinc-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{branch.address}, {branch.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>Manager: <strong className="text-zinc-900">{branch.managerName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{branch.phone}</span>
                  </div>
                </div>
              </div>

              {/* Branch Financial Metrics Box */}
              <div className="pt-3 border-t border-zinc-200/70 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-zinc-100">
                  <span className="text-[9px] text-zinc-400 uppercase font-bold block">Loans</span>
                  <span className="font-bold text-zinc-900 font-mono">{branch.activeLoansCount}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-zinc-100">
                  <span className="text-[9px] text-zinc-400 uppercase font-bold block">Disbursed</span>
                  <span className="font-bold text-zinc-900 font-mono">₹{(branch.totalDisbursed / 100000).toFixed(1)}L</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-zinc-100">
                  <span className="text-[9px] text-zinc-400 uppercase font-bold block">Vault (g)</span>
                  <span className="font-bold text-amber-800 font-mono">{branch.totalVaultGoldGrams.toFixed(0)}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Branch Detail Modal */}
      {selectedBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="font-bold text-base text-zinc-950 font-heading">{selectedBranch.name}</h3>
                <span className="text-xs font-mono text-zinc-500">{selectedBranch.code}</span>
              </div>
              <button
                onClick={() => setSelectedBranch(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-4 text-xs text-zinc-700">
              <p><strong>Physical Address:</strong> {selectedBranch.address}, {selectedBranch.city}, {selectedBranch.state}</p>
              <p><strong>Branch Manager:</strong> {selectedBranch.managerName}</p>
              <p><strong>Direct Phone:</strong> {selectedBranch.phone}</p>
              <p><strong>Active Loan Accounts:</strong> {selectedBranch.activeLoansCount}</p>
              <p><strong>Total Sanctioned Portfolio:</strong> ₹{selectedBranch.totalDisbursed.toLocaleString('en-IN')}</p>
              <p><strong>Vault Gold in Safe Custody:</strong> {selectedBranch.totalVaultGoldGrams} grams</p>
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                <span className="font-bold text-zinc-900 block mb-1.5">Compliance & Safe Status</span>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>RBI Lending Guidelines Adhered</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Dual Custody Biometric Locker Grade A</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBranch(null)}
                className="px-4 py-2 bg-zinc-950 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
