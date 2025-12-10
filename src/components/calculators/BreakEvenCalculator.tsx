import { useState, useEffect, useRef } from 'react';
import { Target, Calculator, TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateBreakEven, formatCurrency, formatNumber, formatPercent } from '@/lib/calculations';
import { BreakEvenInputs, BreakEvenResults } from '@/types/calculator';
import Chart from 'chart.js/auto';

const defaultInputs: BreakEvenInputs = {
  fixedCosts: 14057,
  variableCostPerUnit: 13.11,
  pricePerUnit: 37.50,
  currentSales: 289,
};

export function BreakEvenCalculator() {
  const [inputs, setInputs] = useState<BreakEvenInputs>(defaultInputs);
  const [results, setResults] = useState<BreakEvenResults | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const handleCalculate = () => {
    if (inputs.pricePerUnit <= inputs.variableCostPerUnit) {
      alert('El precio debe ser mayor que el costo variable');
      return;
    }
    const result = calculateBreakEven(inputs);
    setResults(result);
  };

  const loadExample = () => {
    setInputs(defaultInputs);
  };

  const clearInputs = () => {
    setInputs({
      fixedCosts: 0,
      variableCostPerUnit: 0,
      pricePerUnit: 0,
      currentSales: undefined,
    });
    setResults(null);
  };

  useEffect(() => {
    if (!results || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const maxUnits = Math.max(results.breakEvenUnits * 1.5, inputs.currentSales || 0);
    const unitRange = Array.from({ length: 10 }, (_, i) => Math.round((maxUnits / 9) * i));

    const revenueData = unitRange.map((units) => units * inputs.pricePerUnit);
    const costData = unitRange.map(
      (units) => inputs.fixedCosts + units * inputs.variableCostPerUnit
    );

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: unitRange.map((u) => u.toString()),
        datasets: [
          {
            label: 'Ingresos',
            data: revenueData,
            borderColor: 'hsl(160, 84%, 39%)',
            backgroundColor: 'hsla(160, 84%, 39%, 0.1)',
            fill: false,
            tension: 0.1,
            pointRadius: 4,
          },
          {
            label: 'Costos Totales',
            data: costData,
            borderColor: 'hsl(0, 84%, 60%)',
            backgroundColor: 'hsla(0, 84%, 60%, 0.1)',
            fill: false,
            tension: 0.1,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'hsl(210, 40%, 96%)',
              font: { family: 'Plus Jakarta Sans' },
            },
          },
          tooltip: {
            backgroundColor: 'hsl(222, 47%, 11%)',
            titleColor: 'hsl(210, 40%, 96%)',
            bodyColor: 'hsl(210, 40%, 96%)',
            borderColor: 'hsl(222, 47%, 18%)',
            borderWidth: 1,
            callbacks: {
              label: (context) => `${context.dataset.label}: S/${context.parsed.y.toLocaleString()}`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Unidades',
              color: 'hsl(215, 20%, 55%)',
            },
            ticks: { color: 'hsl(215, 20%, 55%)' },
            grid: { color: 'hsl(222, 47%, 15%)' },
          },
          y: {
            title: {
              display: true,
              text: 'S/',
              color: 'hsl(215, 20%, 55%)',
            },
            ticks: {
              color: 'hsl(215, 20%, 55%)',
              callback: (value) => `S/${Number(value).toLocaleString()}`,
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

  const isAboveBreakEven = results && inputs.currentSales && inputs.currentSales > results.breakEvenUnits;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="section-title">
            <Target className="w-7 h-7 text-primary" />
            Punto de Equilibrio
          </h2>
          <p className="section-subtitle">
            Calcula cuántas unidades necesitas vender para cubrir tus costos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadExample}>
            Cargar Ejemplo
          </Button>
          <Button variant="ghost" size="sm" onClick={clearInputs}>
            Limpiar
          </Button>
        </div>
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
                Costos Fijos Mensuales (S/)
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </label>
              <input
                type="number"
                className="calc-input"
                value={inputs.fixedCosts || ''}
                onChange={(e) => setInputs({ ...inputs, fixedCosts: Number(e.target.value) })}
                placeholder="Ej: 14057"
              />
            </div>

            <div className="input-group">
              <label className="input-label flex items-center gap-2">
                Costo Variable por Unidad (S/)
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </label>
              <input
                type="number"
                step="0.01"
                className="calc-input"
                value={inputs.variableCostPerUnit || ''}
                onChange={(e) => setInputs({ ...inputs, variableCostPerUnit: Number(e.target.value) })}
                placeholder="Ej: 13.11"
              />
            </div>

            <div className="input-group">
              <label className="input-label flex items-center gap-2">
                Precio de Venta por Unidad (S/)
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </label>
              <input
                type="number"
                step="0.01"
                className="calc-input"
                value={inputs.pricePerUnit || ''}
                onChange={(e) => setInputs({ ...inputs, pricePerUnit: Number(e.target.value) })}
                placeholder="Ej: 37.50"
              />
            </div>

            <div className="input-group">
              <label className="input-label flex items-center gap-2">
                Ventas Actuales (unidades) - Opcional
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </label>
              <input
                type="number"
                className="calc-input"
                value={inputs.currentSales || ''}
                onChange={(e) => setInputs({ ...inputs, currentSales: Number(e.target.value) || undefined })}
                placeholder="Ej: 289"
              />
            </div>

            <Button onClick={handleCalculate} className="w-full" size="lg">
              <Calculator className="w-5 h-5 mr-2" />
              Calcular Punto de Equilibrio
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
                  <p className="text-sm text-muted-foreground mb-1">Margen de Contribución</p>
                  <p className="text-2xl font-bold font-mono">{formatCurrency(results.contributionMargin)}</p>
                  <p className="text-xs text-muted-foreground mt-1">por unidad</p>
                </div>
                <div className={isAboveBreakEven ? 'result-box-success' : 'result-box-warning'}>
                  <p className="text-sm text-muted-foreground mb-1">Punto de Equilibrio</p>
                  <p className="text-2xl font-bold font-mono">{formatNumber(results.breakEvenUnits)}</p>
                  <p className="text-xs text-muted-foreground mt-1">unidades</p>
                </div>
              </div>

              <div className="result-box-neutral">
                <p className="text-sm text-muted-foreground mb-1">Ingresos en Break-Even</p>
                <p className="text-2xl font-bold font-mono">{formatCurrency(results.breakEvenRevenue)}</p>
              </div>

              {results.safetyMargin !== undefined && (
                <div className={results.safetyMargin > 0 ? 'result-box-success' : 'result-box-danger'}>
                  <p className="text-sm text-muted-foreground mb-1">Margen de Seguridad</p>
                  <p className="text-2xl font-bold font-mono">
                    {formatNumber(Math.abs(results.safetyMargin))} unidades ({formatPercent(Math.abs(results.safetyMarginPercent || 0))})
                  </p>
                  <p className="text-xs mt-1">
                    {results.safetyMargin > 0 ? 'por encima del break-even' : 'por debajo del break-even'}
                  </p>
                </div>
              )}

              {/* Recommendations */}
              <div className="recommendation-card">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  {isAboveBreakEven ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  )}
                  Recomendaciones
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {isAboveBreakEven ? (
                    <>
                      <p>✅ Estás {formatPercent(results.safetyMarginPercent || 0)} por encima del punto de equilibrio</p>
                      <p>💡 Benchmark industria educativa: 4-6 meses para alcanzar break-even</p>
                    </>
                  ) : (
                    <>
                      <p>⚠️ Necesitas {formatNumber(Math.abs(results.safetyMargin || 0))} unidades más para alcanzar break-even</p>
                      <p>💡 Considera reducir costos fijos o aumentar el precio</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Ingresa los datos y haz clic en calcular para ver los resultados</p>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {results && (
        <div className="calculator-section">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            Gráfico: Costos vs Ingresos
          </h3>
          <div className="chart-container">
            <canvas ref={chartRef}></canvas>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-muted-foreground">Zona de Ganancia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-muted-foreground">Zona de Pérdida</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-primary border-dashed"></div>
              <span className="text-muted-foreground">Punto de Equilibrio</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
