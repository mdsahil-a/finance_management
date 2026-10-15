import React, { createContext, useContext, useState, useEffect } from 'react';
import { DemoCustomer } from '../types';
import { INITIAL_CUSTOMER } from '../data/initialData';
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '../utils/storage';

interface CustomerSessionContextType {
  currentCustomer: DemoCustomer | null;
  loginCustomer: (customer?: DemoCustomer) => void;
  logoutCustomer: () => void;
  updateCustomerProfile: (updates: Partial<DemoCustomer>) => void;
}

const CustomerSessionContext = createContext<CustomerSessionContextType | undefined>(undefined);

export const CustomerSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCustomer, setCurrentCustomer] = useState<DemoCustomer | null>(() => {
    return getStorageItem<DemoCustomer | null>(STORAGE_KEYS.CUSTOMER_SESSION, null);
  });

  useEffect(() => {
    if (currentCustomer) {
      setStorageItem(STORAGE_KEYS.CUSTOMER_SESSION, currentCustomer);
      // Also update persisted customer profile
      setStorageItem(STORAGE_KEYS.CUSTOMER, currentCustomer);
    } else {
      removeStorageItem(STORAGE_KEYS.CUSTOMER_SESSION);
    }
  }, [currentCustomer]);

  const loginCustomer = (customer?: DemoCustomer) => {
    const cust = customer || getStorageItem<DemoCustomer>(STORAGE_KEYS.CUSTOMER, INITIAL_CUSTOMER);
    setCurrentCustomer(cust);
  };

  const logoutCustomer = () => {
    setCurrentCustomer(null);
  };

  const updateCustomerProfile = (updates: Partial<DemoCustomer>) => {
    if (!currentCustomer) return;
    const updated = { ...currentCustomer, ...updates };
    setCurrentCustomer(updated);
  };

  return (
    <CustomerSessionContext.Provider value={{ currentCustomer, loginCustomer, logoutCustomer, updateCustomerProfile }}>
      {children}
    </CustomerSessionContext.Provider>
  );
};

export function useCustomerSession() {
  const context = useContext(CustomerSessionContext);
  if (!context) {
    throw new Error('useCustomerSession must be used within a CustomerSessionProvider');
  }
  return context;
}
