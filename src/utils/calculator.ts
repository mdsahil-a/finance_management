import { GoldPurity, RepaymentMethod, GoldArticleItem, LoanScheme } from '../types';

export const PURITY_FACTORS: Record<GoldPurity, number> = {
  '18K': 18 / 24, // 0.75
  '20K': 20 / 24, // 0.8333...
  '22K': 22 / 24, // 0.9167...
  '24K': 1.0,     // 1.0
};

export interface GoldCalculationInput {
  grossWeight: number; // in grams
  stoneWeight?: number;
  otherNonGoldWeight?: number;
  purity: GoldPurity;
  referencePrice24K: number; // per gram in INR
  ltvRatio: number; // e.g. 0.75 for 75%
  tenureMonths: number;
  annualInterestRate: number; // in %
  repaymentMethod?: RepaymentMethod;
}

export interface GoldCalculationResult {
  netGoldWeight: number;
  purityFactor: number;
  effectiveGoldRatePerGram: number;
  estimatedGoldValue: number;
  estimatedEligibleAmount: number;
  maxEligibleAmount: number;
  simpleInterest: number;
  totalRepaymentSimple: number;
  monthlyInterestSimple: number;
  reducingEmi: number;
  totalRepaymentEmi: number;
  totalInterestEmi: number;
  bulletInterest?: number;
  bulletTotal?: number;
}

export function calculateGoldLoanMetrics(input: GoldCalculationInput): GoldCalculationResult {
  const gross = Math.max(0, Number(input.grossWeight) || 0);
  const stone = Math.max(0, Number(input.stoneWeight) || 0);
  const other = Math.max(0, Number(input.otherNonGoldWeight) || 0);
  
  const netGoldWeight = Math.max(0, gross - (stone + other));
  const purityFactor = PURITY_FACTORS[input.purity] || (22 / 24);
  const refPrice = Math.max(0, Number(input.referencePrice24K) || 7500);
  const effectiveGoldRatePerGram = refPrice * purityFactor;
  
  const estimatedGoldValue = netGoldWeight * effectiveGoldRatePerGram;
  const ltv = Math.min(0.85, Math.max(0.1, Number(input.ltvRatio) || 0.75));
  const estimatedEligibleAmount = estimatedGoldValue * ltv;
  const maxEligibleAmount = estimatedEligibleAmount;

  const principal = estimatedEligibleAmount;
  const annualRate = Math.max(0, Number(input.annualInterestRate) || 10.5);
  const tenure = Math.max(1, Number(input.tenureMonths) || 12);

  // Simple Interest (Annual interest rate: Interest = Principal * Rate * Months / 1200)
  const simpleInterest = (principal * annualRate * tenure) / 1200;
  const totalRepaymentSimple = principal + simpleInterest;
  const monthlyInterestSimple = (principal * annualRate) / 1200;

  // Reducing Balance EMI
  let reducingEmi = 0;
  let totalRepaymentEmi = principal;
  let totalInterestEmi = 0;

  if (principal > 0) {
    const monthlyRate = annualRate / 1200;
    if (monthlyRate === 0) {
      reducingEmi = principal / tenure;
      totalRepaymentEmi = principal;
      totalInterestEmi = 0;
    } else {
      const powFactor = Math.pow(1 + monthlyRate, tenure);
      reducingEmi = (principal * monthlyRate * powFactor) / (powFactor - 1);
      totalRepaymentEmi = reducingEmi * tenure;
      totalInterestEmi = Math.max(0, totalRepaymentEmi - principal);
    }
  }

  // Bullet Repayment: Principal and simple interest both payable at maturity
  const bulletInterest = (principal * annualRate * tenure) / 1200;
  const bulletTotal = principal + bulletInterest;

  return {
    netGoldWeight,
    purityFactor,
    effectiveGoldRatePerGram,
    estimatedGoldValue,
    estimatedEligibleAmount,
    maxEligibleAmount,
    simpleInterest,
    totalRepaymentSimple,
    monthlyInterestSimple,
    reducingEmi,
    totalRepaymentEmi,
    totalInterestEmi,
    bulletInterest,
    bulletTotal,
  };
}

// Multi-article gold appraisal calculation
export interface MultiArticleSummary {
  articles: GoldArticleItem[];
  totalGrossWeight: number;
  totalStoneWeight: number;
  totalOtherDeductions: number;
  totalNetGoldWeight: number;
  totalValuation: number;
  maxEligibleLoan: number;
}

export function calculateMultiArticleSummary(
  articles: Array<Omit<GoldArticleItem, 'netGoldWeight' | 'purityFactor' | 'ratePerGram' | 'valuation'> & {
    netGoldWeight?: number;
    purityFactor?: number;
    ratePerGram?: number;
    valuation?: number;
  }>,
  reference24KPrice: number,
  ltvRatio: number = 0.75
): MultiArticleSummary {
  let totalGross = 0;
  let totalStone = 0;
  let totalOther = 0;
  let totalNet = 0;
  let totalVal = 0;

  const processedArticles: GoldArticleItem[] = articles.map((item, idx) => {
    const gross = Math.max(0, Number(item.grossWeight) || 0);
    const stone = Math.max(0, Number(item.stoneWeight) || 0);
    const other = Math.max(0, Number(item.otherDeductions) || 0);
    const net = Math.max(0, gross - (stone + other));
    const factor = PURITY_FACTORS[item.purity] || (22 / 24);
    const rate = reference24KPrice * factor;
    const valuation = net * rate;

    totalGross += gross;
    totalStone += stone;
    totalOther += other;
    totalNet += net;
    totalVal += valuation;

    return {
      id: item.id || `ARTICLE-${idx + 1}`,
      category: item.category,
      description: item.description || `${item.purity} ${item.category}`,
      itemsCount: Math.max(1, Number(item.itemsCount) || 1),
      grossWeight: gross,
      stoneWeight: stone,
      otherDeductions: other,
      netGoldWeight: net,
      purity: item.purity,
      purityFactor: factor,
      ratePerGram: rate,
      valuation,
      photoUrl: item.photoUrl,
      photoFileName: item.photoFileName,
      hallmarkNumber: item.hallmarkNumber,
    };
  });

  return {
    articles: processedArticles,
    totalGrossWeight: totalGross,
    totalStoneWeight: totalStone,
    totalOtherDeductions: totalOther,
    totalNetGoldWeight: totalNet,
    totalValuation: totalVal,
    maxEligibleLoan: totalVal * ltvRatio,
  };
}

// Scheme-based loan breakdown
export interface SchemeLoanBreakdown {
  schemeCode: string;
  schemeName: string;
  sanctionedAmount: number;
  tenureMonths: number;
  annualInterestRate: number;
  repaymentMethod: RepaymentMethod;
  processingFee: number;
  valuationCharge: number;
  netDisbursementAmount: number;
  totalInterestEstimate: number;
  monthlyRepaymentEstimate: number;
  totalPayableAmount: number;
}

export function calculateLoanWithScheme(
  amount: number,
  scheme: LoanScheme,
  tenureMonths?: number
): SchemeLoanBreakdown {
  const principal = Math.max(0, amount);
  const tenure = tenureMonths || scheme.minTenureMonths || 12;
  const rate = scheme.nominalInterestRate;

  const processingFee = (principal * scheme.processingFeePercent) / 100;
  const valuationCharge = scheme.valuationCharge || 0;
  const netDisbursement = Math.max(0, principal - (processingFee + valuationCharge));

  let totalInterest = 0;
  let monthlyEstimate = 0;

  if (scheme.interestMethod === 'Reducing Balance EMI') {
    const monthlyRate = rate / 1200;
    if (monthlyRate === 0) {
      monthlyEstimate = principal / tenure;
      totalInterest = 0;
    } else {
      const pow = Math.pow(1 + monthlyRate, tenure);
      monthlyEstimate = (principal * monthlyRate * pow) / (pow - 1);
      totalInterest = (monthlyEstimate * tenure) - principal;
    }
  } else if (scheme.interestMethod === 'Bullet Repayment') {
    totalInterest = (principal * rate * tenure) / 1200;
    monthlyEstimate = 0; // all paid at end
  } else {
    // Simple Interest
    totalInterest = (principal * rate * tenure) / 1200;
    monthlyEstimate = (principal * rate) / 1200; // monthly interest servicing
  }

  return {
    schemeCode: scheme.code,
    schemeName: scheme.name,
    sanctionedAmount: principal,
    tenureMonths: tenure,
    annualInterestRate: rate,
    repaymentMethod: scheme.interestMethod,
    processingFee,
    valuationCharge,
    netDisbursementAmount: netDisbursement,
    totalInterestEstimate: totalInterest,
    monthlyRepaymentEstimate: monthlyEstimate,
    totalPayableAmount: principal + totalInterest,
  };
}

// Accrued interest for active loan servicing (Daily basis: Principal * Rate * Days / 365)
export function calculateAccruedInterest(
  principal: number,
  annualInterestRate: number,
  daysElapsed: number
): number {
  if (principal <= 0 || daysElapsed <= 0) return 0;
  return (principal * annualInterestRate * daysElapsed) / 36500;
}

// Full settlement / foreclosure quote
export interface ForeclosureQuote {
  principalRemaining: number;
  accruedInterest: number;
  overduePenalties: number;
  totalSettlementAmount: number;
  foreclosureRebate: number;
}

export function calculateForeclosureQuote(
  remainingBalance: number,
  sanctionedAmount: number,
  annualInterestRate: number,
  daysActive: number,
  overdueDays: number = 0
): ForeclosureQuote {
  // Approximate principal portion vs interest
  const principalRemaining = Math.min(remainingBalance, sanctionedAmount);
  const accruedInterest = calculateAccruedInterest(principalRemaining, annualInterestRate, Math.max(1, daysActive % 30));
  const overduePenalties = overdueDays > 0 ? (principalRemaining * 0.02 * overdueDays) / 365 : 0;
  const foreclosureRebate = 0; // Zero penalty in customer friendly demo
  const totalSettlementAmount = principalRemaining + accruedInterest + overduePenalties - foreclosureRebate;

  return {
    principalRemaining,
    accruedInterest,
    overduePenalties,
    totalSettlementAmount: Math.round(totalSettlementAmount),
    foreclosureRebate,
  };
}
