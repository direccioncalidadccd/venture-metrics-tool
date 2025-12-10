import { useState, useEffect, useRef } from 'react';
import { PieChart, Calculator, TrendingUp, CheckCircle, AlertTriangle, Info, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateROI, calculateSROI, formatCurrency, formatPercent } from '@/lib/calculations';
import { ROIInputs, ROIResults, SROIInputs, SROIResults } from '@/types/calculator';
import Chart from 'chart.js/auto';

const defaultROIInputs: ROIInputs = {
  totalInvestment: 5000,
  revenueGenerated: 21656,
  operationalCosts: 3500,
};

const defaultSROIInputs: SROIInputs = {
  socialInvestment: 5000,
  directBeneficiaries: 289,
  valuePerBeneficiary: 676,
  deadweight: 10,
  attribution: 80,
};

type TabType = 'roi' | 'sroi';

export function ROICalculator() {
  const [activeTab, setActiveTab] = useState<TabType>('roi');
  const [roiInputs, setRoiInputs] = useState<ROIInputs>(defaultROIInputs);
  const [sroiInputs, setSroiInputs] = useState<SROIInputs>(defaultSROIInputs);
  const [roiResults, setRoiResults] = useState<ROIResults | null>(null);
  const [sroiResults, setSroiResults] = useState<SROIResults | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const handleCalculateROI = () => {
    const result = calculateROI(roiInputs);
    setRoiResults(result);
  };

  const handleCalculateSROI = () => {
    const result = calculateSROI(sroiInputs);
    setSroiResults(result);
  };

  const loadExample = () => {
    if (activeTab === 'roi') {
      setRoiInputs(defaultROIInputs);
    } else {
      setSroiInputs(defaultSROIInputs);
    }
  };

  // SROI Outcomes chart
  useEffect(() => {
    if (!sroiResults || !chartRef.current || activeTab !== 'sroi') return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const outcomes = [
      { name: 'Ahorro educativo familiar', value: 99082 },
      { name: 'Mejora rendimiento académico', value: 41310 },
      { name: 'Alfabetización digital', value: 17280 },
      { name: 'Competencias siglo XXI', value: 20700 },
      { name: 'Confianza académica', value: 8687 },
      { name: 'Equidad educativa', value: 5000 },
      { name: 'Alfabetización familiar', value: 3200 },
    ];

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: outcomes.map((o) => o.name),
        datasets: [
          {
            data: outcomes.map((o) => o.value),
            backgroundColor: [
              'hsla(199, 89%, 48%, 0.8)',
              'hsla(160, 84%, 39%, 0.8)',
              'hsla(38, 92%, 50%, 0.8)',
              'hsla(262, 83%, 58%, 0.8)',
              'hsla(0, 84%, 60%, 0.8)',
              'hsla(280, 65%, 60%, 0.8)',
              'hsla(180, 70%, 45%, 0.8)',
            ],
            borderColor: 'hsl(222, 47%, 9%)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: 'hsl(210, 40%, 96%)',
              font: { family: 'Plus Jakarta Sans', size: 11 },
              padding: 12,
            },
          },
          tooltip: {
            backgroundColor: 'hsl(222, 47%, 11%)',
            titleColor: 'hsl(210, 40%, 96%)',
            bodyColor: 'hsl(210, 40%, 96%)',
            borderColor: 'hsl(222, 47%, 18%)',
            borderWidth: 1,
            callbacks: {
              label: (context) => `${context.label}: ${formatCurrency(context.parsed)}`,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [sroiResults, activeTab]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="section-title">
            <PieChart className="w-7 h-7 text-primary" />
            ROI & SROI
          </h2>
          <p className="section-subtitle">
            Calcula el retorno de inversión financiero y social
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadExample}>
          Cargar Ejemplo
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-secondary rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('roi')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'roi'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          ROI Financiero
        </button>
        <button
          onClick={() => setActiveTab('sroi')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'sroi'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Heart className="w-4 h-4 inline mr-2" />
          SROI Social
        </button>
      </div>

      {activeTab === 'roi' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ROI Input Form */}
          <div className="calculator-section">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-primary" />
              Datos de Entrada - ROI
            </h3>

            <div className="space-y-4">
              <div className="input-group">
                <label className="input-label">Inversión Total (S/)</label>
                <input
                  type="number"
                  className="calc-input"
                  value={roiInputs.totalInvestment || ''}
                  onChange={(e) => setRoiInputs({ ...roiInputs, totalInvestment: Number(e.target.value) })}
                  placeholder="Ej: 5000"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Ingresos Generados (S/)</label>
                <input
                  type="number"
                  className="calc-input"
                  value={roiInputs.revenueGenerated || ''}
                  onChange={(e) => setRoiInputs({ ...roiInputs, revenueGenerated: Number(e.target.value) })}
                  placeholder="Ej: 21656"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Costos Operativos (S/)</label>
                <input
                  type="number"
                  className="calc-input"
                  value={roiInputs.operationalCosts || ''}
                  onChange={(e) => setRoiInputs({ ...roiInputs, operationalCosts: Number(e.target.value) })}
                  placeholder="Ej: 3500"
                />
              </div>

              <Button onClick={handleCalculateROI} className="w-full" size="lg">
                <Calculator className="w-5 h-5 mr-2" />
                Calcular ROI
              </Button>
            </div>
          </div>

          {/* ROI Results */}
          <div className="calculator-section">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              Resultados ROI
            </h3>

            {roiResults ? (
              <div className="space-y-4">
                <div className="result-box-success">
                  <p className="text-sm text-muted-foreground mb-1">Utilidad Neta</p>
                  <p className="text-3xl font-bold font-mono">{formatCurrency(roiResults.netProfit)}</p>
                </div>

                <div className={`result-box-${roiResults.roiPercent >= 100 ? 'success' : roiResults.roiPercent >= 0 ? 'warning' : 'danger'}`}>
                  <p className="text-sm text-muted-foreground mb-1">ROI</p>
                  <p className="text-3xl font-bold font-mono">{formatPercent(roiResults.roiPercent)}</p>
                </div>

                <div className="result-box-neutral">
                  <p className="text-sm text-muted-foreground mb-1">Margen Neto</p>
                  <p className="text-2xl font-bold font-mono">{formatPercent(roiResults.netMargin)}</p>
                </div>

                <div className="recommendation-card">
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    {roiResults.roiPercent >= 100 ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-warning" />
                    )}
                    Análisis
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {roiResults.roiPercent >= 100 && <p>✅ ROI excepcional - inversión muy rentable</p>}
                    {roiResults.roiPercent >= 0 && roiResults.roiPercent < 100 && (
                      <p>✅ ROI positivo - la inversión genera retorno</p>
                    )}
                    {roiResults.roiPercent < 0 && <p>❌ ROI negativo - revisar estructura de costos</p>}
                    <p>💡 Por cada S/1 invertido → S/{(1 + roiResults.roiPercent / 100).toFixed(2)} de retorno</p>
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SROI Input Form */}
          <div className="calculator-section">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-primary" />
              Datos de Entrada - SROI
            </h3>

            <div className="space-y-4">
              <div className="input-group">
                <label className="input-label flex items-center gap-2">
                  Inversión Social (S/)
                  <Info className="w-4 h-4 text-muted-foreground" />
                </label>
                <input
                  type="number"
                  className="calc-input"
                  value={sroiInputs.socialInvestment || ''}
                  onChange={(e) => setSroiInputs({ ...sroiInputs, socialInvestment: Number(e.target.value) })}
                  placeholder="Ej: 5000"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Beneficiarios Directos (#)</label>
                <input
                  type="number"
                  className="calc-input"
                  value={sroiInputs.directBeneficiaries || ''}
                  onChange={(e) => setSroiInputs({ ...sroiInputs, directBeneficiaries: Number(e.target.value) })}
                  placeholder="Ej: 289"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Valor por Beneficiario (S/)</label>
                <input
                  type="number"
                  className="calc-input"
                  value={sroiInputs.valuePerBeneficiary || ''}
                  onChange={(e) => setSroiInputs({ ...sroiInputs, valuePerBeneficiary: Number(e.target.value) })}
                  placeholder="Ej: 676"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label flex items-center gap-2">
                    Deadweight (%)
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </label>
                  <input
                    type="number"
                    className="calc-input"
                    value={sroiInputs.deadweight || ''}
                    onChange={(e) => setSroiInputs({ ...sroiInputs, deadweight: Number(e.target.value) })}
                    placeholder="Ej: 10"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label flex items-center gap-2">
                    Atribución (%)
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </label>
                  <input
                    type="number"
                    className="calc-input"
                    value={sroiInputs.attribution || ''}
                    onChange={(e) => setSroiInputs({ ...sroiInputs, attribution: Number(e.target.value) })}
                    placeholder="Ej: 80"
                  />
                </div>
              </div>

              <Button onClick={handleCalculateSROI} className="w-full" size="lg">
                <Calculator className="w-5 h-5 mr-2" />
                Calcular SROI
              </Button>
            </div>
          </div>

          {/* SROI Results */}
          <div className="calculator-section">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-primary" />
              Resultados SROI
            </h3>

            {sroiResults ? (
              <div className="space-y-4">
                <div className="result-box-neutral">
                  <p className="text-sm text-muted-foreground mb-1">Valor Social Bruto</p>
                  <p className="text-2xl font-bold font-mono">{formatCurrency(sroiResults.grossValue)}</p>
                </div>

                <div className="result-box-success">
                  <p className="text-sm text-muted-foreground mb-1">Valor Social Neto</p>
                  <p className="text-3xl font-bold font-mono">{formatCurrency(sroiResults.netValue)}</p>
                </div>

                <div className={`result-box-${sroiResults.sroi >= 10 ? 'success' : sroiResults.sroi >= 3 ? 'success' : 'warning'}`}>
                  <p className="text-sm text-muted-foreground mb-1">SROI Ratio</p>
                  <p className="text-3xl font-bold font-mono">{sroiResults.sroi.toFixed(1)}:1</p>
                </div>

                <div className="recommendation-card">
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    {sroiResults.sroi >= 10 ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                    Impacto Social
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {sroiResults.sroi >= 10 && <p>✅✅✅ Impacto social excepcional</p>}
                    {sroiResults.sroi >= 3 && sroiResults.sroi < 10 && <p>✅ Impacto social significativo</p>}
                    {sroiResults.sroi < 3 && <p>⚠️ Benchmark educación: 3-5:1</p>}
                    <p>💡 Por cada S/1 invertido → S/{sroiResults.sroi.toFixed(2)} valor social</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Ingresa los datos y haz clic en calcular</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SROI Outcomes Chart */}
      {sroiResults && activeTab === 'sroi' && (
        <div className="calculator-section">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-primary" />
            Distribución de Outcomes Sociales
          </h3>
          <div className="chart-container h-80">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      )}
    </div>
  );
}
