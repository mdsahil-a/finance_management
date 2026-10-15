import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDemoData } from '../../context/DemoDataContext';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Search, 
  Filter, 
  X,
  ShieldAlert
} from 'lucide-react';

export const BranchLocatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const { branches } = useDemoData();

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedState, setSelectedState] = useState<string>('ALL');

  // Extract unique states
  const states = Array.from(new Set(branches.map((b) => b.state)));

  const filteredBranches = branches.filter((b) => {
    const matchesQuery =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'ALL' || b.state === selectedState;
    return matchesQuery && matchesState;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedState('ALL');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#701525]/10 text-[#701525] text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5 text-[#C9A45C]" />
          <span>Pan-India Presence</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#701525] font-display">
          Find Your Nearest Aurum Branch
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
          Explore our network of 8 demonstration flagship branches across tier-1 Indian metropolises equipped with certified valuation vaults.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-md flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by branch name, city, or address..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#701525] outline-none text-xs font-semibold bg-white text-gray-700"
          >
            <option value="ALL">All States ({branches.length})</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {(searchQuery || selectedState !== 'ALL') && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-[#701525] bg-gray-100 hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Branches Grid */}
      {filteredBranches.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E2D8] space-y-3">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">No Branches Match Your Query</h3>
          <p className="text-xs text-gray-500">
            Try adjusting your search query or state filter to view other flagship branches.
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#701525] text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                    {branch.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    branch.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {branch.isActive ? 'Active Branch' : 'Inactive'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#701525] leading-snug">
                  {branch.name}
                </h3>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#C9A45C] shrink-0" />
                    <span className="font-mono">{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C9A45C] shrink-0" />
                    <span>{branch.operatingHours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Manager: {branch.managerName}</span>
                <span className="font-bold text-[#701525]">{branch.city}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fictional Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E2D8] flex items-center justify-center gap-2 text-xs text-gray-500 text-center">
        <ShieldAlert className="w-4 h-4 text-[#C9A45C] shrink-0" />
        <span>All branch locations, addresses, and phone numbers are fictional demonstration data.</span>
      </div>
    </div>
  );
};
