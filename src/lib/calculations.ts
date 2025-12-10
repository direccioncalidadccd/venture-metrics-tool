import {
  BreakEvenInputs,
  BreakEvenResults,
  CACInputs,
  CACResults,
  LTVInputs,
  LTVResults,
  ROIInputs,
  ROIResults,
  SROIInputs,
  SROIResults,
  FunnelStep,
  FunnelResults,
  MarketingChannel,
  MarketingChannelResults,
  BenchmarkStatus,
} from '@/types/calculator';

// Break-Even Calculator
export function calculateBreakEven(inputs: BreakEvenInputs): BreakEvenResults {
  const contributionMargin = inputs.pricePerUnit - inputs.variableCostPerUnit;
  const breakEvenUnits = inputs.fixedCosts / contributionMargin;
  const breakEvenRevenue = breakEvenUnits * inputs.pricePerUnit;

  let safetyMargin: number | undefined;
  let safetyMarginPercent: number | undefined;

  if (inputs.currentSales) {
    safetyMargin = inputs.currentSales - breakEvenUnits;
    safetyMarginPercent = ((inputs.currentSales - breakEvenUnits) / inputs.currentSales) * 100;
  }

  return {
    contributionMargin,
    breakEvenUnits: Math.ceil(breakEvenUnits),
    breakEvenRevenue,
    safetyMargin,
    safetyMarginPercent,
  };
}

// CAC Calculator
export function calculateCAC(inputs: CACInputs): CACResults {
  const totalCAC = inputs.totalMarketingInvestment / inputs.customersAcquired;

  const channelCACs = inputs.channels?.map((channel) => ({
    name: channel.name,
    cac: channel.investment / channel.customers,
    efficiency: (channel.customers / inputs.customersAcquired) * 100,
  }));

  return {
    totalCAC,
    channelCACs,
  };
}

// LTV Calculator
export function calculateLTV(inputs: LTVInputs, cac?: number): LTVResults {
  const customerLifespan = 1 / (1 - inputs.retentionRate / 100);
  const totalPurchases = customerLifespan * inputs.purchaseFrequency;
  const grossLTV = inputs.averagePurchasePrice * totalPurchases;
  const netLTV = grossLTV * (inputs.grossMargin / 100);
  const ltvCacRatio = cac ? netLTV / cac : undefined;

  return {
    customerLifespan,
    totalPurchases,
    grossLTV,
    netLTV,
    ltvCacRatio,
  };
}

// ROI Calculator
export function calculateROI(inputs: ROIInputs): ROIResults {
  const netProfit = inputs.revenueGenerated - inputs.operationalCosts;
  const roiPercent = ((netProfit - inputs.totalInvestment) / inputs.totalInvestment) * 100;
  const netMargin = (netProfit / inputs.revenueGenerated) * 100;

  return {
    netProfit,
    roiPercent,
    netMargin,
  };
}

// SROI Calculator
export function calculateSROI(inputs: SROIInputs): SROIResults {
  const grossValue = inputs.directBeneficiaries * inputs.valuePerBeneficiary;
  const netValue = grossValue * (1 - inputs.deadweight / 100) * (inputs.attribution / 100);
  const sroi = netValue / inputs.socialInvestment;

  return {
    grossValue,
    netValue,
    sroi,
  };
}

// Funnel Calculator
export function calculateFunnel(steps: FunnelStep[]): FunnelResults {
  const processedSteps = steps.map((step, index) => {
    const prevValue = index === 0 ? step.value : steps[index - 1].value;
    const conversionRate = index === 0 ? 100 : (step.value / prevValue) * 100;
    
    let performance: 'good' | 'warning' | 'poor' = 'good';
    if (step.benchmark) {
      if (conversionRate >= step.benchmark) {
        performance = 'good';
      } else if (conversionRate >= step.benchmark * 0.8) {
        performance = 'warning';
      } else {
        performance = 'poor';
      }
    } else if (conversionRate < 50) {
      performance = conversionRate < 30 ? 'poor' : 'warning';
    }

    return {
      name: step.name,
      value: step.value,
      conversionRate,
      benchmark: step.benchmark,
      performance,
    };
  });

  const globalConversion = steps.length > 1 
    ? (steps[steps.length - 1].value / steps[0].value) * 100 
    : 100;

  const leakagePoints = processedSteps
    .filter((step) => step.performance === 'poor')
    .map((step) => step.name);

  return {
    steps: processedSteps,
    globalConversion,
    leakagePoints,
  };
}

// Marketing Channel Calculator
export function calculateMarketingChannels(
  channels: MarketingChannel[],
  averageRevenue: number
): MarketingChannelResults[] {
  return channels.map((channel) => {
    const ctr = (channel.clicks / channel.impressions) * 100;
    const cpl = channel.investment / channel.leads;
    const cac = channel.investment / channel.conversions;
    const conversionRate = (channel.conversions / channel.leads) * 100;
    const revenue = channel.conversions * averageRevenue;
    const roi = ((revenue - channel.investment) / channel.investment) * 100;
    
    // Efficiency score (weighted average of normalized metrics)
    const efficiencyScore = (
      (100 - Math.min(cac, 100)) * 0.4 +
      conversionRate * 0.3 +
      Math.min(roi / 10, 100) * 0.3
    );

    return {
      name: channel.name,
      ctr,
      cpl,
      cac,
      conversionRate,
      roi,
      efficiencyScore,
    };
  });
}

// Benchmark utilities
export function getBenchmarkStatus(
  value: number,
  benchmarks: { excellent: number; good: number; warning: number },
  inverse: boolean = false
): BenchmarkStatus {
  if (inverse) {
    if (value <= benchmarks.excellent) return 'excellent';
    if (value <= benchmarks.good) return 'good';
    if (value <= benchmarks.warning) return 'warning';
    return 'poor';
  }
  
  if (value >= benchmarks.excellent) return 'excellent';
  if (value >= benchmarks.good) return 'good';
  if (value >= benchmarks.warning) return 'warning';
  return 'poor';
}

// Industry benchmarks
export const industryBenchmarks = {
  education: {
    cac: { excellent: 20, good: 40, warning: 60 },
    ltvCacRatio: { excellent: 5, good: 3, warning: 2 },
    retention: { excellent: 75, good: 65, warning: 50 },
    grossMargin: { excellent: 70, good: 60, warning: 50 },
  },
  saas: {
    cac: { excellent: 200, good: 350, warning: 500 },
    ltvCacRatio: { excellent: 5, good: 3, warning: 2 },
    retention: { excellent: 95, good: 90, warning: 85 },
    grossMargin: { excellent: 85, good: 75, warning: 65 },
  },
  ecommerce: {
    cac: { excellent: 15, good: 30, warning: 50 },
    ltvCacRatio: { excellent: 4, good: 3, warning: 2 },
    retention: { excellent: 40, good: 30, warning: 20 },
    grossMargin: { excellent: 45, good: 35, warning: 25 },
  },
};

// Format utilities
export function formatCurrency(value: number, currency: string = 'S/'): string {
  return `${currency}${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('es-PE', { maximumFractionDigits: 0 });
}

export function formatRatio(value: number): string {
  return `${value.toFixed(1)}:1`;
}
