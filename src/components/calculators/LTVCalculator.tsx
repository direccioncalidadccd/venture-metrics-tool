import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Calculator, Gauge, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateLTV, formatCurrency, formatPercent, formatRatio } from '@/lib/calculations';
import { LTVInputs, LTVResults } from '@/types/calculator';
import Chart from 'chart.js/auto';

const defaultInputs: LTVInputs = {
  averagePurchasePrice: 75,
  purchaseFrequency: 4,
  retentionRate: 70,
  grossMargin: 75,
};

export function LTVCalculator() {
  const [inputs, setInputs] = useState<LTVInputs>(defaultInputs);
  const [cac, setCac] = useState<number>(5.19);
  const [results, setResults] = useState<LTVResults | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const handleCalculate = () => {
    if (inputs.retentionRate >= 100) {
      alert('La tasa de retención debe ser menor a 100%');
      return;
    }
    const result = calculateLTV(inputs, cac || undefined);
    setResults(result);
  };

  const loadExample = () => {
    setInputs(defaultInputs);
    setCac(5.19);
  };

  useEffect(() => {
    if (!results || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Generate cumulative value over time
    const periods = Math.ceil(results.customerLifespan);
    const labels = Array.from({ length: periods + 1 }, (_, i) => `Periodo ${i}`);
    const cumulativeValue = Array.from({ length: periods + 1 }, (_, i) => {
      return inputs.averagePurchasePrice * Math.min(i * inputs.purchaseFrequency / 4, results.totalPurchases);
    });

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Valor Acumulado',
            data: cumulativeValue,
            borderColor: 'hsl(160, 84%, 39%)',
            backgroundColor: 'hsla(160, 84%, 39%, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointBackgroundColor: 'hsl(160, 84%, 39%)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'hsl(222, 47%, 11%)',
            titleColor: 'hsl(210, 40%, 96%)',
            bodyColor: 'hsl(210, 40%, 96%)',
            borderColor: 'hsl(222, 47%, 18%)',
            borderWidth: 1,
            callbacks: {
              label: (context) => `Valor: ${formatCurrency(context.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            ticks: { color: 'hsl(215, 20%, 55%)' },
            grid: { color: 'hsl(222, 47%, 15%)' },
          },
          y: {
            title: {
              display: true,
              text: 'Valor (S/)',
              color: 'hsl(215, 20%, 55%)',
            },
            ticks: {
              color: 'hsl(215, 20%, 55%)',
              callback: (value) => formatCurrency(Number(value)),
            },
            grid: { color: 'hsl(222, 47%, 15%)' },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [results, inputs]);

  const ltvCacStatus = results?.ltvCacRatio
    ? results.ltvCacRatio >= 5
      ? 'excellent'
      : results.ltvCacRatio >= 3
      ? 'good'
      : results.ltvCacRatio >= 2
      ? 'warning'
      : 'poor'
    : null;

  // Gauge visualization for LTV/CAC
  const gaugePercent = results?.ltvCacRatio
    ? Math.min((results.ltvCacRatio / 10) * 100, 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="section-title">
            <TrendingUp className="w-7 h-7 text-primary" />
            LTV - Lifetime Value
          </h2>
          <p className="section-subtitle">
            Calcula el valor total que genera un cliente durante su vida útil
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadExample}>
          Cargar Ejemplo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="calculator-section">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-primary" />
            Datos de Entrada
          </h3>

          <div className="space-y-4">
            <div className="input-group">
              <label className="input-label flex items-center gap-2">
                Precio Promedio por Compra (S/)
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </label>
              <input
                type="number"
                className="calc-input"
                value={inputs.averagePurchasePrice || ''}
                onChange={(e) => setInputs({ ...inputs, averagePurchasePrice: Number(e.target.value) })}
                placeholder="Ej: 75"
              />
            </div>

            <div className="input-group">
              <label className="input-label flex items-center gap-2">
                Frecuencia de Compra (veces/año)
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </label>
              <input
                type="number"
                className="calc-input"
                value={inputs.purchaseFrequency || ''}
                onChange={(e) => setInputs({ ...inputs, purchaseFrequency: Number(e.target.value) })}
                placeholder="Ej: 4"
              />
            </div>

            <div className="input-group">
              <label className="input-label flex items-center gap-2">
                Tasa de Retención (%)
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </label>
              <input
                type="number"
                className="calc-input"
                value={inputs.retentionRate || ''}
                onChange={(e) => setInputs({ ...inputs, retentionRate: Number(e.target.value) })}
                placeholder="Ej: 70"
              />
            </div>

            <div className="input-group">
              <label className="input-label flex items-center gap-2">
                Margen Bruto (%)
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </label>
              <input
                type="number"
                className="calc-input"
                value={inputs.grossMargin || ''}
                onChange={(e) => setInputs({ ...inputs, grossMargin: Number(e.target.value) })}
                placeholder="Ej: 75"
              />
            </div>

            <div className="input-group">
              <label className="input-label flex items-center gap-2">
                CAC (S/) - Opcional
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </label>
              <input
                type="number"
                step="0.01"
                className="calc-input"
                value={cac || ''}
                onChange={(e) => setCac(Number(e.target.value))}
                placeholder="Para calcular ratio LTV/CAC"
              />
            </div>

            <Button onClick={handleCalculate} className="w-full" size="lg">
              <Calculator className="w-5 h-5 mr-2" />
              Calcular LTV
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="calculator-section">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            Resultados
          </h3>

          {results ? (
            <div className="space-y-4">
              {/* Main results */}
              <div className="grid grid-cols-2 gap-4">
                <div className="result-box-neutral">
                  <p className="text-sm text-muted-foreground mb-1">Vida del Cliente</p>
                  <p className="text-2xl font-bold font-mono">{results.customerLifespan.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground mt-1">periodos</p>
                </div>
                <div className="result-box-neutral">
                  <p className="text-sm text-muted-foreground mb-1">Compras Totales</p>
                  <p className="text-2xl font-bold font-mono">{results.totalPurchases.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground mt-1">transacciones</p>
                </div>
              </div>

              <div className="result-box-success">
                <p className="text-sm text-muted-foreground mb-1">LTV Bruto</p>
                <p className="text-3xl font-bold font-mono">{formatCurrency(results.grossLTV)}</p>
              </div>

              <div className="result-box-success">
                <p className="text-sm text-muted-foreground mb-1">LTV Neto (con margen)</p>
                <p className="text-3xl font-bold font-mono">{formatCurrency(results.netLTV)}</p>
              </div>

              {/* LTV/CAC Ratio with Gauge */}
              {results.ltvCacRatio && (
                <div className={`result-box-${ltvCacStatus === 'excellent' || ltvCacStatus === 'good' ? 'success' : ltvCacStatus === 'warning' ? 'warning' : 'danger'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ratio LTV/CAC</p>
                      <p className="text-3xl font-bold font-mono">{formatRatio(results.ltvCacRatio)}</p>
                    </div>
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-muted/30"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeDasharray={`${gaugePercent * 2.51} 251`}
                          className={
                            ltvCacStatus === 'excellent' || ltvCacStatus === 'good'
                              ? 'text-success'
                              : ltvCacStatus === 'warning'
                              ? 'text-warning'
                              : 'text-destructive'
                          }
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Gauge className="w-6 h-6 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payback period */}
              {cac > 0 && (
                <div className="result-box-neutral">
                  <p className="text-sm text-muted-foreground mb-1">Payback Period</p>
                  <p className="text-2xl font-bold font-mono">
                    {((cac / (inputs.averagePurchasePrice * (inputs.grossMargin / 100))) * 12 / inputs.purchaseFrequency).toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">meses</p>
                </div>
              )}

              {/* Recommendations */}
              <div className="recommendation-card">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  {ltvCacStatus === 'excellent' || ltvCacStatus === 'good' ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : ltvCacStatus === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  )}
                  Recomendaciones
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {results.ltvCacRatio && results.ltvCacRatio < 3 && (
                    <p>❌ Modelo no sostenible - LTV/CAC menor a 3:1</p>
                  )}
                  {results.ltvCacRatio && results.ltvCacRatio >= 3 && results.ltvCacRatio < 5 && (
                    <p>✅ Ratio saludable (3-5:1 es el benchmark)</p>
                  )}
                  {results.ltvCacRatio && results.ltvCacRatio >= 5 && (
                    <p>✅✅ Excelente ratio - modelo muy eficiente</p>
                  )}
                  <p>💡 +10% retención = +{formatPercent((1 / (1 - (inputs.retentionRate + 10) / 100) - results.customerLifespan) / results.customerLifespan * 100)} más LTV</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Ingresa los datos y haz clic en calcular</p>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {results && (
        <div className="calculator-section">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            Valor Acumulado por Cliente
          </h3>
          <div className="chart-container">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      )}
    </div>
  );
}
