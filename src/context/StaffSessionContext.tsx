import React, { createContext, useContext, useState, useEffect } from 'react';
import { DemoStaffUser } from '../types';
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '../utils/storage';

interface StaffSessionContextType {
  currentStaff: DemoStaffUser | null;
  loginStaff: (user: DemoStaffUser) => void;
  logoutStaff: () => void;
  updateStaffProfile: (updates: Partial<DemoStaffUser>) => void;
}

const StaffSessionContext = createContext<StaffSessionContextType | undefined>(undefined);

export const StaffSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStaff, setCurrentStaff] = useState<DemoStaffUser | null>(() => {
    return getStorageItem<DemoStaffUser | null>(STORAGE_KEYS.STAFF_SESSION, null);
  });

  useEffect(() => {
    if (currentStaff) {
      setStorageItem(STORAGE_KEYS.STAFF_SESSION, currentStaff);
    } else {
      removeStorageItem(STORAGE_KEYS.STAFF_SESSION);
    }
  }, [currentStaff]);

  const loginStaff = (user: DemoStaffUser) => {
    setCurrentStaff(user);
  };

  const logoutStaff = () => {
    setCurrentStaff(null);
  };

  const updateStaffProfile = (updates: Partial<DemoStaffUser>) => {
    if (!currentStaff) return;
    const updated = { ...currentStaff, ...updates };
    setCurrentStaff(updated);
  };

  return (
    <StaffSessionContext.Provider value={{ currentStaff, loginStaff, logoutStaff, updateStaffProfile }}>
      {children}
    </StaffSessionContext.Provider>
  );
};

export function useStaffSession() {
  const context = useContext(StaffSessionContext);
  if (!context) {
    throw new Error('useStaffSession must be used within a StaffSessionProvider');
  }
  return context;
}
