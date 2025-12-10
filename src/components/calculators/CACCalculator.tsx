import { useState, useEffect, useRef } from 'react';
import { DollarSign, Calculator, TrendingUp, Plus, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateCAC, formatCurrency, formatPercent, getBenchmarkStatus, industryBenchmarks } from '@/lib/calculations';
import { CACInputs, CACResults } from '@/types/calculator';
import Chart from 'chart.js/auto';

interface Channel {
  name: string;
  investment: number;
  customers: number;
}

const defaultChannels: Channel[] = [
  { name: 'Facebook Ads', investment: 720, customers: 139 },
  { name: 'Instagram Ads', investment: 420, customers: 81 },
  { name: 'Google Ads', investment: 300, customers: 58 },
  { name: 'Orgánico', investment: 60, customers: 11 },
];

export function CACCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(1500);
  const [totalCustomers, setTotalCustomers] = useState(289);
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);
  const [results, setResults] = useState<CACResults | null>(null);
  const [useChannels, setUseChannels] = useState(true);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const handleCalculate = () => {
    const inputs: CACInputs = {
      totalMarketingInvestment: totalInvestment,
      customersAcquired: totalCustomers,
      channels: useChannels ? channels.filter(c => c.customers > 0) : undefined,
    };
    const result = calculateCAC(inputs);
    setResults(result);
  };

  const addChannel = () => {
    setChannels([...channels, { name: '', investment: 0, customers: 0 }]);
  };

  const removeChannel = (index: number) => {
    setChannels(channels.filter((_, i) => i !== index));
  };

  const updateChannel = (index: number, field: keyof Channel, value: string | number) => {
    const updated = [...channels];
    updated[index] = { ...updated[index], [field]: value };
    setChannels(updated);
  };

  const loadExample = () => {
    setTotalInvestment(1500);
    setTotalCustomers(289);
    setChannels(defaultChannels);
    setUseChannels(true);
  };

  useEffect(() => {
    if (!results?.channelCACs || !chartRef.current || !useChannels) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: results.channelCACs.map((c) => c.name),
        datasets: [
          {
            label: 'CAC por Canal',
            data: results.channelCACs.map((c) => c.cac),
            backgroundColor: [
              'hsla(199, 89%, 48%, 0.8)',
              'hsla(160, 84%, 39%, 0.8)',
              'hsla(38, 92%, 50%, 0.8)',
              'hsla(262, 83%, 58%, 0.8)',
              'hsla(0, 84%, 60%, 0.8)',
            ],
            borderColor: [
              'hsl(199, 89%, 48%)',
              'hsl(160, 84%, 39%)',
              'hsl(38, 92%, 50%)',
              'hsl(262, 83%, 58%)',
              'hsl(0, 84%, 60%)',
            ],
            borderWidth: 2,
            borderRadius: 8,
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
              label: (context) => `CAC: S/${context.parsed.y.toFixed(2)}`,
            },
          },
        },
        scales: {
          x: {
            ticks: { color: 'hsl(215, 20%, 55%)' },
            grid: { display: false },
          },
          y: {
            title: {
              display: true,
              text: 'CAC (S/)',
              color: 'hsl(215, 20%, 55%)',
            },
            ticks: {
              color: 'hsl(215, 20%, 55%)',
              callback: (value) => `S/${value}`,
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
  }, [results, useChannels]);

  const cacStatus = results ? getBenchmarkStatus(results.totalCAC, industryBenchmarks.education.cac, true) : null;
  const statusColors = {
    excellent: 'text-success',
    good: 'text-success',
    warning: 'text-warning',
    poor: 'text-destructive',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="section-title">
            <DollarSign className="w-7 h-7 text-primary" />
            CAC - Customer Acquisition Cost
          </h2>
          <p className="section-subtitle">
            Calcula el costo de adquirir cada nuevo cliente
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadExample}>
            Cargar Ejemplo
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
            <div className="grid grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Inversión Total (S/)</label>
                <input
                  type="number"
                  className="calc-input"
                  value={totalInvestment || ''}
                  onChange={(e) => setTotalInvestment(Number(e.target.value))}
                  placeholder="Ej: 1500"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Clientes Adquiridos</label>
                <input
                  type="number"
                  className="calc-input"
                  value={totalCustomers || ''}
                  onChange={(e) => setTotalCustomers(Number(e.target.value))}
                  placeholder="Ej: 289"
                />
              </div>
            </div>

            {/* Toggle channels */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUseChannels(!useChannels)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  useChannels ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${
                    useChannels ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
              <span className="text-sm text-foreground">Desglosar por canales</span>
            </div>

            {/* Channels */}
            {useChannels && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="input-label">Canales de Marketing</label>
                  <Button variant="ghost" size="sm" onClick={addChannel}>
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                </div>

                {channels.map((channel, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      className="calc-input flex-1"
                      value={channel.name}
                      onChange={(e) => updateChannel(index, 'name', e.target.value)}
                      placeholder="Nombre del canal"
                    />
                    <input
                      type="number"
                      className="calc-input w-24"
                      value={channel.investment || ''}
                      onChange={(e) => updateChannel(index, 'investment', Number(e.target.value))}
                      placeholder="S/"
                    />
                    <input
                      type="number"
                      className="calc-input w-20"
                      value={channel.customers || ''}
                      onChange={(e) => updateChannel(index, 'customers', Number(e.target.value))}
                      placeholder="#"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeChannel(index)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button onClick={handleCalculate} className="w-full" size="lg">
              <Calculator className="w-5 h-5 mr-2" />
              Calcular CAC
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
              {/* Main CAC */}
              <div className={`result-box-${cacStatus === 'excellent' || cacStatus === 'good' ? 'success' : cacStatus === 'warning' ? 'warning' : 'danger'}`}>
                <p className="text-sm text-muted-foreground mb-1">CAC Total</p>
                <p className="text-3xl font-bold font-mono">{formatCurrency(results.totalCAC)}</p>
                <p className="text-xs mt-1">por cliente</p>
              </div>

              {/* Channel breakdown */}
              {results.channelCACs && results.channelCACs.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">CAC por Canal</p>
                  {results.channelCACs.map((channel, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                    >
                      <div>
                        <p className="font-medium text-foreground">{channel.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatPercent(channel.efficiency)} del total
                        </p>
                      </div>
                      <p className="font-mono font-semibold text-primary">
                        {formatCurrency(channel.cac)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              <div className="recommendation-card">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  {cacStatus === 'excellent' || cacStatus === 'good' ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  )}
                  Recomendaciones
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {results.totalCAC < 20 && (
                    <p>✅ Excelente eficiencia de adquisición</p>
                  )}
                  {results.totalCAC >= 20 && results.totalCAC <= 60 && (
                    <p>✅ Bueno para el sector educativo (benchmark: S/20-60)</p>
                  )}
                  {results.totalCAC > 60 && (
                    <p>⚠️ Revisar estrategia de adquisición - CAC alto</p>
                  )}
                  {results.channelCACs && results.channelCACs.length > 0 && (
                    <p>
                      💡 Canal más eficiente:{' '}
                      <span className="text-primary font-medium">
                        {[...results.channelCACs].sort((a, b) => a.cac - b.cac)[0].name}
                      </span>{' '}
                      con CAC de{' '}
                      {formatCurrency([...results.channelCACs].sort((a, b) => a.cac - b.cac)[0].cac)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Ingresa los datos y haz clic en calcular</p>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {results?.channelCACs && useChannels && (
        <div className="calculator-section">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            CAC por Canal
          </h3>
          <div className="chart-container">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      )}
    </div>
  );
}
