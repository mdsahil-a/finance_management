/**
 * Formats numbers into Indian currency format (e.g., ₹1,25,000)
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Formats weights in grams
 */
export function formatGrams(grams: number | null | undefined): string {
  if (grams === null || grams === undefined || isNaN(grams)) {
    return '0.00 g';
  }
  return `${Number(grams).toFixed(2)} g`;
}

/**
 * Formats percentages
 */
export function formatPercent(rate: number | null | undefined): string {
  if (rate === null || rate === undefined || isNaN(rate)) {
    return '0%';
  }
  return `${Number(rate).toFixed(2)}%`;
}

/**
 * Formats timestamps into readable Indian date/time
 */
export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Masks sensitive ID proofs such as Aadhaar (e.g., "Aadhaar: •••• •••• 1024") or PAN
 */
export function maskIdProof(idProof: string | null | undefined): string {
  if (!idProof) return 'Verified ID';
  const trimmed = idProof.trim();
  // Check if contains Aadhaar format or digits
  const parts = trimmed.split(':');
  if (parts.length > 1) {
    const label = parts[0].trim();
    const val = parts.slice(1).join(':').trim();
    const digitsOnly = val.replace(/\D/g, '');
    if (digitsOnly.length >= 4) {
      const lastFour = digitsOnly.slice(-4);
      return `${label}: •••• •••• ${lastFour}`;
    }
    return `${label}: •••• ${val.slice(-4)}`;
  }
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length >= 4) {
    return `ID: •••• •••• ${digitsOnly.slice(-4)}`;
  }
  return trimmed;
}

