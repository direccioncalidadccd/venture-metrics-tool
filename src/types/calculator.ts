export interface BreakEvenInputs {
  fixedCosts: number;
  variableCostPerUnit: number;
  pricePerUnit: number;
  currentSales?: number;
}

export interface BreakEvenResults {
  contributionMargin: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  safetyMargin?: number;
  safetyMarginPercent?: number;
}

export interface CACInputs {
  totalMarketingInvestment: number;
  customersAcquired: number;
  channels?: {
    name: string;
    investment: number;
    customers: number;
  }[];
}

export interface CACResults {
  totalCAC: number;
  channelCACs?: {
    name: string;
    cac: number;
    efficiency: number;
  }[];
}

export interface LTVInputs {
  averagePurchasePrice: number;
  purchaseFrequency: number;
  retentionRate: number;
  grossMargin: number;
}

export interface LTVResults {
  customerLifespan: number;
  totalPurchases: number;
  grossLTV: number;
  netLTV: number;
  ltvCacRatio?: number;
}

export interface ROIInputs {
  totalInvestment: number;
  revenueGenerated: number;
  operationalCosts: number;
}

export interface ROIResults {
  netProfit: number;
  roiPercent: number;
  netMargin: number;
}

export interface SROIInputs {
  socialInvestment: number;
  directBeneficiaries: number;
  valuePerBeneficiary: number;
  deadweight: number;
  attribution: number;
}

export interface SROIResults {
  grossValue: number;
  netValue: number;
  sroi: number;
}

export interface FunnelStep {
  name: string;
  value: number;
  benchmark?: number;
}

export interface FunnelResults {
  steps: {
    name: string;
    value: number;
    conversionRate: number;
    benchmark?: number;
    performance: 'good' | 'warning' | 'poor';
  }[];
  globalConversion: number;
  leakagePoints: string[];
}

export interface MarketingChannel {
  name: string;
  investment: number;
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
}

export interface MarketingChannelResults {
  name: string;
  ctr: number;
  cpl: number;
  cac: number;
  conversionRate: number;
  roi: number;
  efficiencyScore: number;
}

export type BenchmarkStatus = 'excellent' | 'good' | 'warning' | 'poor';

export interface Benchmark {
  metric: string;
  value: number;
  status: BenchmarkStatus;
  industry: string;
  recommendation: string;
}
