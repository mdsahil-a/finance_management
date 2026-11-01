import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, UserCheck, Shield, KeyRound, Check, Users, User } from 'lucide-react';
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
    switchStaff(staff.id);
    setIsStaffModalOpen(false);
    setSelectedStaff(null);
  };

  const roleBadges: Record<string, string> = {
    ADMIN: 'bg-purple-50 text-purple-700 border-purple-200',
    MANAGER: 'bg-blue-50 text-blue-700 border-blue-200',
    LOAN_OFFICER: 'bg-amber-50 text-amber-800 border-amber-200',
    APPRAISER: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    CASHIER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CUSTODIAN: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
      <div className="bg-white border border-zinc-200/80 text-zinc-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100/80 text-amber-800 flex items-center justify-center border border-amber-200/60">
              <Users className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-zinc-900">Switch Counter Staff</h3>
              <p className="text-xs text-zinc-500">Select active employee user currently operating this station</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsStaffModalOpen(false);
              setSelectedStaff(null);
            }}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Staff List */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {staffUsers.map((staff) => {
              const isCurrent = currentStaff.id === staff.id;
              const isPicked = selectedStaff?.id === staff.id;

              return (
                <div
                  key={staff.id}
                  onClick={() => handleSelectStaff(staff)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-300/30'
                      : isPicked
                      ? 'bg-zinc-100 border-zinc-300 ring-2 ring-zinc-300'
                      : 'bg-white border-zinc-200/80 hover:bg-zinc-50 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="font-extrabold text-sm text-zinc-900 block">{staff.name}</span>
                      <span className="text-[11px] text-zinc-500">{staff.phone}</span>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-zinc-950 text-white shadow-xs">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="mt-3.5 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        roleBadges[staff.role] || 'bg-zinc-100 text-zinc-700'
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
                      className="text-[11px] text-zinc-900 hover:text-zinc-700 font-extrabold hover:underline cursor-pointer"
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
            <form onSubmit={handleConfirmSwitch} className="p-4.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-3 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-800 font-bold">
                  Switching to: <strong>{selectedStaff.name}</strong> ({selectedStaff.role.replace('_', ' ')})
                </span>
                <span className="text-[11px] text-zinc-500 font-mono font-bold bg-white px-2.5 py-0.5 rounded-full border border-zinc-200">
                  PIN: {selectedStaff.pin}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="Enter 4-digit PIN..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-full text-xs text-zinc-900 font-mono font-bold focus:border-zinc-950 focus:ring-2 focus:ring-zinc-900/10 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-full text-xs transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  Confirm Switch
                </button>
              </div>

              {pinError && (
                <p className="text-[11px] text-rose-700 font-bold">
                  Incorrect PIN entered. Hint: default PIN for this staff is {selectedStaff.pin}.
                </p>
              )}
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
