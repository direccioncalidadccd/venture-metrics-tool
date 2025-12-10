import { useState, useEffect, useRef } from 'react';
import { Megaphone, Calculator, TrendingUp, Plus, Trash2, CheckCircle, AlertTriangle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateMarketingChannels, formatCurrency, formatPercent } from '@/lib/calculations';
import { MarketingChannel, MarketingChannelResults } from '@/types/calculator';
import Chart from 'chart.js/auto';

const defaultChannels: MarketingChannel[] = [
  { name: 'Facebook Ads', investment: 720, impressions: 48000, clicks: 4800, leads: 816, conversions: 139 },
  { name: 'Instagram Ads', investment: 420, impressions: 28000, clicks: 2800, leads: 476, conversions: 81 },
  { name: 'Google Ads', investment: 300, impressions: 20000, clicks: 2000, leads: 340, conversions: 58 },
  { name: 'Orgánico', investment: 60, impressions: 4000, clicks: 400, leads: 68, conversions: 11 },
];

export function MarketingChannelsCalculator() {
  const [channels, setChannels] = useState<MarketingChannel[]>(defaultChannels);
  const [averageRevenue, setAverageRevenue] = useState(75);
  const [results, setResults] = useState<MarketingChannelResults[] | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const radarRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const radarInstance = useRef<Chart | null>(null);

  const handleCalculate = () => {
    const calculatedResults = calculateMarketingChannels(channels, averageRevenue);
    setResults(calculatedResults);
  };

  const addChannel = () => {
    setChannels([...channels, { name: '', investment: 0, impressions: 0, clicks: 0, leads: 0, conversions: 0 }]);
  };

  const removeChannel = (index: number) => {
    if (channels.length <= 1) return;
    setChannels(channels.filter((_, i) => i !== index));
  };

  const updateChannel = (index: number, field: keyof MarketingChannel, value: string | number) => {
    const updated = [...channels];
    updated[index] = { ...updated[index], [field]: value };
    setChannels(updated);
  };

  const loadExample = () => {
    setChannels(defaultChannels);
    setAverageRevenue(75);
  };

  // Bar chart for ROI
  useEffect(() => {
    if (!results || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: results.map((r) => r.name),
        datasets: [
          {
            label: 'ROI %',
            data: results.map((r) => r.roi),
            backgroundColor: 'hsla(160, 84%, 39%, 0.8)',
            borderColor: 'hsl(160, 84%, 39%)',
            borderWidth: 2,
            borderRadius: 8,
          },
          {
            label: 'CAC (S/)',
            data: results.map((r) => r.cac),
            backgroundColor: 'hsla(199, 89%, 48%, 0.8)',
            borderColor: 'hsl(199, 89%, 48%)',
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
          },
        },
        scales: {
          x: {
            ticks: { color: 'hsl(215, 20%, 55%)' },
            grid: { display: false },
          },
          y: {
            ticks: { color: 'hsl(215, 20%, 55%)' },
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
  }, [results]);

  // Radar chart
  useEffect(() => {
    if (!results || !radarRef.current) return;

    if (radarInstance.current) {
      radarInstance.current.destroy();
    }

    const ctx = radarRef.current.getContext('2d');
    if (!ctx) return;

    // Normalize values for radar (0-100 scale)
    const maxROI = Math.max(...results.map((r) => r.roi));
    const maxConv = Math.max(...results.map((r) => r.conversionRate));
    const maxCTR = Math.max(...results.map((r) => r.ctr));

    const colors = [
      { bg: 'hsla(199, 89%, 48%, 0.3)', border: 'hsl(199, 89%, 48%)' },
      { bg: 'hsla(160, 84%, 39%, 0.3)', border: 'hsl(160, 84%, 39%)' },
      { bg: 'hsla(38, 92%, 50%, 0.3)', border: 'hsl(38, 92%, 50%)' },
      { bg: 'hsla(262, 83%, 58%, 0.3)', border: 'hsl(262, 83%, 58%)' },
    ];

    radarInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['ROI', 'Conversión', 'CTR', 'Eficiencia'],
        datasets: results.map((r, i) => ({
          label: r.name,
          data: [
            (r.roi / maxROI) * 100,
            (r.conversionRate / maxConv) * 100,
            (r.ctr / maxCTR) * 100,
            r.efficiencyScore,
          ],
          backgroundColor: colors[i % colors.length].bg,
          borderColor: colors[i % colors.length].border,
          borderWidth: 2,
          pointBackgroundColor: colors[i % colors.length].border,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'hsl(210, 40%, 96%)',
              font: { family: 'Plus Jakarta Sans', size: 11 },
            },
          },
        },
        scales: {
          r: {
            angleLines: { color: 'hsl(222, 47%, 18%)' },
            grid: { color: 'hsl(222, 47%, 18%)' },
            pointLabels: { color: 'hsl(215, 20%, 65%)' },
            ticks: { display: false },
          },
        },
      },
    });

    return () => {
      if (radarInstance.current) {
        radarInstance.current.destroy();
      }
    };
  }, [results]);

  const bestROIChannel = results ? [...results].sort((a, b) => b.roi - a.roi)[0] : null;
  const bestCACChannel = results ? [...results].sort((a, b) => a.cac - b.cac)[0] : null;
  const bestConvChannel = results ? [...results].sort((a, b) => b.conversionRate - a.conversionRate)[0] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="section-title">
            <Megaphone className="w-7 h-7 text-primary" />
            Canales de Marketing
          </h2>
          <p className="section-subtitle">
            Compara el rendimiento de tus canales de adquisición
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadExample}>
          Cargar Ejemplo
        </Button>
      </div>

      {/* Input Form */}
      <div className="calculator-section">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-primary" />
          Configuración de Canales
        </h3>

        <div className="mb-4">
          <label className="input-label">Ingreso Promedio por Conversión (S/)</label>
          <input
            type="number"
            className="calc-input w-48"
            value={averageRevenue || ''}
            onChange={(e) => setAverageRevenue(Number(e.target.value))}
            placeholder="Ej: 75"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Canal</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Inversión</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Impresiones</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Clics</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Leads</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Conv.</th>
                <th className="py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {channels.map((channel, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="calc-input py-2"
                      value={channel.name}
                      onChange={(e) => updateChannel(index, 'name', e.target.value)}
                      placeholder="Nombre"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      className="calc-input py-2 w-24"
                      value={channel.investment || ''}
                      onChange={(e) => updateChannel(index, 'investment', Number(e.target.value))}
                      placeholder="S/"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      className="calc-input py-2 w-24"
                      value={channel.impressions || ''}
                      onChange={(e) => updateChannel(index, 'impressions', Number(e.target.value))}
                      placeholder="#"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      className="calc-input py-2 w-20"
                      value={channel.clicks || ''}
                      onChange={(e) => updateChannel(index, 'clicks', Number(e.target.value))}
                      placeholder="#"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      className="calc-input py-2 w-20"
                      value={channel.leads || ''}
                      onChange={(e) => updateChannel(index, 'leads', Number(e.target.value))}
                      placeholder="#"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      className="calc-input py-2 w-20"
                      value={channel.conversions || ''}
                      onChange={(e) => updateChannel(index, 'conversions', Number(e.target.value))}
                      placeholder="#"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeChannel(index)}
                      disabled={channels.length <= 1}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={addChannel}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Canal
          </Button>
          <Button onClick={handleCalculate} className="flex-1" size="lg">
            <Calculator className="w-5 h-5 mr-2" />
            Analizar Canales
          </Button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <>
          {/* Top performers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 animate-fade-in-up delay-100">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-warning" />
                <span className="text-sm text-muted-foreground">Mejor ROI</span>
              </div>
              <p className="font-semibold text-foreground">{bestROIChannel?.name}</p>
              <p className="text-2xl font-bold font-mono text-success">{formatPercent(bestROIChannel?.roi || 0)}</p>
            </div>

            <div className="glass-card p-4 animate-fade-in-up delay-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-warning" />
                <span className="text-sm text-muted-foreground">Menor CAC</span>
              </div>
              <p className="font-semibold text-foreground">{bestCACChannel?.name}</p>
              <p className="text-2xl font-bold font-mono text-success">{formatCurrency(bestCACChannel?.cac || 0)}</p>
            </div>

            <div className="glass-card p-4 animate-fade-in-up delay-300">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-warning" />
                <span className="text-sm text-muted-foreground">Mayor Conversión</span>
              </div>
              <p className="font-semibold text-foreground">{bestConvChannel?.name}</p>
              <p className="text-2xl font-bold font-mono text-success">{formatPercent(bestConvChannel?.conversionRate || 0)}</p>
            </div>
          </div>

          {/* Results Table */}
          <div className="calculator-section">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              Métricas por Canal
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Canal</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">CTR</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">CPL</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">CAC</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">Conv %</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">ROI</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="py-3 px-2 font-medium text-foreground">{result.name}</td>
                      <td className="py-3 px-2 text-right font-mono">{formatPercent(result.ctr)}</td>
                      <td className="py-3 px-2 text-right font-mono">{formatCurrency(result.cpl)}</td>
                      <td className="py-3 px-2 text-right font-mono">
                        <span className={result.cac === bestCACChannel?.cac ? 'text-success font-semibold' : ''}>
                          {formatCurrency(result.cac)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono">
                        <span className={result.conversionRate === bestConvChannel?.conversionRate ? 'text-success font-semibold' : ''}>
                          {formatPercent(result.conversionRate)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono">
                        <span className={result.roi === bestROIChannel?.roi ? 'text-success font-semibold' : ''}>
                          {formatPercent(result.roi)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${result.efficiencyScore}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs">{result.efficiencyScore.toFixed(0)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="calculator-section">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                ROI & CAC por Canal
              </h3>
              <div className="chart-container">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>

            <div className="calculator-section">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                Comparación Multi-dimensional
              </h3>
              <div className="chart-container">
                <canvas ref={radarRef}></canvas>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="calculator-section">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-success" />
              Recomendaciones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                <p className="text-sm text-foreground">
                  ✅ Canal estrella: <span className="font-semibold">{bestROIChannel?.name}</span> con ROI de{' '}
                  {formatPercent(bestROIChannel?.roi || 0)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-sm text-foreground">
                  💡 Considera redistribuir: +20% a {bestROIChannel?.name}, -10% del canal con menor score
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
