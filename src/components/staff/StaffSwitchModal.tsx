import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, UserCheck, Shield, KeyRound, Check, Users } from 'lucide-react';
import { StaffUser } from '../../types/finance';

export const StaffSwitchModal: React.FC = () => {
  const {
    staffUsers,
    currentStaff,
    switchStaff,
    isStaffModalOpen,
    setIsStaffModalOpen,
  } = useFinance();

  const [selectedStaff, setSelectedStaff] = useState<StaffUser | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!isStaffModalOpen) return null;

  const handleSelectStaff = (staff: StaffUser) => {
    setSelectedStaff(staff);
    setPinInput('');
    setPinError(false);
  };

  const handleConfirmSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    // Check PIN (default staff PINs: 1234, 2222, 3333, etc.)
    if (selectedStaff.pin && pinInput !== selectedStaff.pin) {
      setPinError(true);
      return;
    }

    switchStaff(selectedStaff.id);
    setIsStaffModalOpen(false);
    setSelectedStaff(null);
    setPinInput('');
  };

  const handleQuickSwitch = (staff: StaffUser) => {
    // Direct switch for convenience if desired
    switchStaff(staff.id);
    setIsStaffModalOpen(false);
    setSelectedStaff(null);
  };

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    MANAGER: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    LOAN_OFFICER: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    APPRAISER: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    CASHIER: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    CUSTODIAN: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Switch Counter Staff</h3>
              <p className="text-xs text-slate-400">Select active staff member working at counter</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsStaffModalOpen(false);
              setSelectedStaff(null);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Staff List */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {staffUsers.map((staff) => {
              const isCurrent = currentStaff.id === staff.id;
              const isPicked = selectedStaff?.id === staff.id;

              return (
                <div
                  key={staff.id}
                  onClick={() => handleSelectStaff(staff)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                      : isPicked
                      ? 'bg-slate-800 border-slate-600 ring-2 ring-slate-600'
                      : 'bg-slate-850 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="font-bold text-sm text-white block">{staff.name}</span>
                      <span className="text-[11px] text-slate-400">{staff.phone}</span>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        roleColors[staff.role] || 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {staff.role.replace('_', ' ')}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickSwitch(staff);
                      }}
                      className="text-[11px] text-slate-400 hover:text-amber-300 font-semibold underline"
                    >
                      Switch &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PIN Confirmation Form if staff selected */}
          {selectedStaff && selectedStaff.id !== currentStaff.id && (
            <form onSubmit={handleConfirmSwitch} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">
                  Switching to: <strong>{selectedStaff.name}</strong> ({selectedStaff.role})
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Default PIN: {selectedStaff.pin}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="Enter 4-digit PIN..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shrink-0"
                >
                  Confirm
                </button>
              </div>

              {pinError && (
                <p className="text-[11px] text-rose-400">
                  Incorrect PIN. Please enter {selectedStaff.pin}.
                </p>
              )}
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
