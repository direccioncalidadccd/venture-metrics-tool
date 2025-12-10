import { useState } from 'react';
import { Filter, Calculator, TrendingUp, Plus, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateFunnel, formatPercent, formatNumber } from '@/lib/calculations';
import { FunnelStep, FunnelResults } from '@/types/calculator';

const defaultSteps: FunnelStep[] = [
  { name: 'Leads', value: 1700, benchmark: undefined },
  { name: 'Contactados', value: 870, benchmark: 60 },
  { name: 'Interesados', value: 510, benchmark: 60 },
  { name: 'Matriculados', value: 289, benchmark: 50 },
];

export function FunnelCalculator() {
  const [steps, setSteps] = useState<FunnelStep[]>(defaultSteps);
  const [results, setResults] = useState<FunnelResults | null>(null);

  const handleCalculate = () => {
    const result = calculateFunnel(steps);
    setResults(result);
  };

  const addStep = () => {
    setSteps([...steps, { name: '', value: 0 }]);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 2) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof FunnelStep, value: string | number) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const loadExample = () => {
    setSteps(defaultSteps);
    setResults(null);
  };

  const getStepColor = (performance: string) => {
    switch (performance) {
      case 'good':
        return 'bg-success/20 border-success/40 text-success';
      case 'warning':
        return 'bg-warning/20 border-warning/40 text-warning';
      case 'poor':
        return 'bg-destructive/20 border-destructive/40 text-destructive';
      default:
        return 'bg-primary/20 border-primary/40 text-primary';
    }
  };

  const getStepBgGradient = (performance: string, index: number) => {
    const opacity = 0.8 - index * 0.15;
    switch (performance) {
      case 'good':
        return `rgba(16, 185, 129, ${opacity})`;
      case 'warning':
        return `rgba(245, 158, 11, ${opacity})`;
      case 'poor':
        return `rgba(239, 68, 68, ${opacity})`;
      default:
        return `rgba(6, 182, 212, ${opacity})`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="section-title">
            <Filter className="w-7 h-7 text-primary" />
            Funnel de Conversión
          </h2>
          <p className="section-subtitle">
            Analiza cada etapa de tu embudo de ventas
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
            Etapas del Funnel
          </h3>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  className="calc-input flex-1"
                  value={step.name}
                  onChange={(e) => updateStep(index, 'name', e.target.value)}
                  placeholder={`Etapa ${index + 1}`}
                />
                <input
                  type="number"
                  className="calc-input w-28"
                  value={step.value || ''}
                  onChange={(e) => updateStep(index, 'value', Number(e.target.value))}
                  placeholder="Cantidad"
                />
                <input
                  type="number"
                  className="calc-input w-24"
                  value={step.benchmark || ''}
                  onChange={(e) => updateStep(index, 'benchmark', Number(e.target.value) || undefined)}
                  placeholder="Bench %"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStep(index)}
                  disabled={steps.length <= 2}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}

            <Button variant="outline" onClick={addStep} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Etapa
            </Button>

            <Button onClick={handleCalculate} className="w-full" size="lg">
              <Calculator className="w-5 h-5 mr-2" />
              Calcular Funnel
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
              {/* Global conversion */}
              <div className="result-box-neutral">
                <p className="text-sm text-muted-foreground mb-1">Conversión Global</p>
                <p className="text-3xl font-bold font-mono">{formatPercent(results.globalConversion)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  De {formatNumber(results.steps[0].value)} a {formatNumber(results.steps[results.steps.length - 1].value)}
                </p>
              </div>

              {/* Step by step results */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Conversión por Etapa</p>
                {results.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${getStepColor(step.performance)}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{step.name}</span>
                      <span className="badge-info">{formatNumber(step.value)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {index > 0 && (
                        <span className="font-mono font-semibold">{formatPercent(step.conversionRate)}</span>
                      )}
                      {step.benchmark && (
                        <span className="text-xs text-muted-foreground">(bench: {step.benchmark}%)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Leakage points */}
              {results.leakagePoints.length > 0 && (
                <div className="recommendation-card border-destructive/30 bg-destructive/5">
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    Puntos de Fuga Críticos
                  </h4>
                  <div className="space-y-1 text-sm">
                    {results.leakagePoints.map((point, index) => (
                      <p key={index} className="text-muted-foreground">
                        ⚠️ {point} - Conversión bajo benchmark
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="recommendation-card">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Recomendaciones
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {results.leakagePoints.length > 0 && (
                    <p>
                      🎯 Optimizar etapa "{results.leakagePoints[0]}": +10% aquí ={' '}
                      +{Math.round(results.steps[results.steps.length - 1].value * 0.1)} clientes finales
                    </p>
                  )}
                  <p>💡 Conversión global benchmark educación: 15-20%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Ingresa las etapas y haz clic en calcular</p>
            </div>
          )}
        </div>
      </div>

      {/* Visual Funnel */}
      {results && (
        <div className="calculator-section">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            Visualización del Embudo
          </h3>
          <div className="flex flex-col items-center space-y-2">
            {results.steps.map((step, index) => {
              const widthPercent = ((step.value / results.steps[0].value) * 100);
              const minWidth = 30;
              const actualWidth = Math.max(minWidth, widthPercent);
              
              return (
                <div
                  key={index}
                  className="funnel-step rounded-lg border transition-all duration-500"
                  style={{
                    width: `${actualWidth}%`,
                    backgroundColor: getStepBgGradient(step.performance, index),
                    borderColor: step.performance === 'good' 
                      ? 'rgba(16, 185, 129, 0.5)' 
                      : step.performance === 'warning' 
                      ? 'rgba(245, 158, 11, 0.5)' 
                      : 'rgba(239, 68, 68, 0.5)',
                  }}
                >
                  <div className="flex flex-col md:flex-row items-center justify-between w-full px-4 gap-2">
                    <span className="font-medium text-foreground text-sm md:text-base">{step.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-foreground font-bold">{formatNumber(step.value)}</span>
                      {index > 0 && (
                        <span className="text-xs text-foreground/80">({formatPercent(step.conversionRate)})</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-muted-foreground">Bueno (≥ benchmark)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span className="text-muted-foreground">Atención (80-100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-muted-foreground">Crítico (&lt;80%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
