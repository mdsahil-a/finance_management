export const STORAGE_KEYS = {
  CUSTOMER: 'aurum_enterprise_v3_customer',
  STAFF: 'aurum_enterprise_v3_staff',
  CUSTOMER_SESSION: 'aurum_enterprise_v3_customer_session',
  STAFF_SESSION: 'aurum_enterprise_v3_staff_session',
  APPLICATIONS: 'aurum_enterprise_v3_applications',
  ASSESSMENTS: 'aurum_enterprise_v3_assessments',
  FINAL_ENTRIES: 'aurum_enterprise_v3_final_entries',
  LOANS: 'aurum_enterprise_v3_loans',
  TRANSACTIONS: 'aurum_enterprise_v3_transactions',
  BRANCHES: 'aurum_enterprise_v3_branches',
  NOTIFICATIONS: 'aurum_enterprise_v3_notifications',
  ENQUIRIES: 'aurum_enterprise_v3_enquiries',
  ACTIVITY_LOGS: 'aurum_enterprise_v3_activity_logs',
  SETTINGS: 'aurum_enterprise_v3_settings',
  SCHEMES: 'aurum_enterprise_v3_schemes',
  GOLD_RATES: 'aurum_enterprise_v3_gold_rates',
  CUSTODY_RECORDS: 'aurum_enterprise_v3_custody_records',
  RECONCILIATIONS: 'aurum_enterprise_v3_reconciliations',
} as const;

// Auto-purge any stale demo storage keys from prior versions or containing old names
(function cleanStaleDemoStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('aurum_demo_v1_') || key.startsWith('aurum_demo_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Storage purge warning:', e);
  }
})();

function sanitizeString(str: string): string {
  return str
    .replace(/Jigyasha\s+Sharma/gi, 'John Doe')
    .replace(/Jigyasa\s+Sharma/gi, 'John Doe')
    .replace(/Jigyasha/gi, 'John Doe')
    .replace(/Jigyasa/gi, 'John Doe')
    .replace(/aadhaar_front_jigyasha_sharma\.jpg/gi, 'aadhaar_front_john_doe.jpg')
    .replace(/aadhaar_front_jigyasa_sharma\.jpg/gi, 'aadhaar_front_john_doe.jpg')
    .replace(/demo@aurum\.example/gi, 'john.doe@aurum.example');
}

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    // Sanitize any existing stored data on read
    if (typeof item === 'string' && /jigya/i.test(item)) {
      const cleaned = sanitizeString(item);
      localStorage.setItem(key, cleaned);
      return JSON.parse(cleaned) as T;
    }

    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Failed to read LocalStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    const jsonStr = JSON.stringify(value);
    const cleaned = sanitizeString(jsonStr);
    localStorage.setItem(key, cleaned);
    return true;
  } catch (error) {
    console.warn(`Failed to write LocalStorage key "${key}":`, error);
    return false;
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove LocalStorage key "${key}":`, error);
  }
}
