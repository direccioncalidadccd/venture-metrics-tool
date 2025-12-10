import { MetricCard } from './MetricCard';
import {
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Percent,
  BarChart3,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

// Sample data - Ingenia College Pilot
const sampleMetrics = {
  totalStudents: 289,
  mrr: 10837.50,
  cac: 5.19,
  ltvCacRatio: 48.1,
  retention: 93.5,
  netMargin: 75,
  breakEvenStatus: 'achieved',
  nps: 85,
};

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="section-title">
            <BarChart3 className="w-7 h-7 text-primary" />
            Dashboard Ejecutivo
          </h2>
          <p className="section-subtitle">
            Resumen de métricas clave del negocio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Datos actualizados
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Estudiantes"
          value={sampleMetrics.totalStudents.toLocaleString()}
          subtitle="Activos este mes"
          icon={Users}
          trend={{ value: 12, label: 'vs mes anterior' }}
          status="success"
          className="delay-100"
        />
        <MetricCard
          title="MRR"
          value={`S/${sampleMetrics.mrr.toLocaleString()}`}
          subtitle="Ingresos mensuales"
          icon={DollarSign}
          trend={{ value: 8, label: 'vs mes anterior' }}
          status="success"
          className="delay-200"
        />
        <MetricCard
          title="CAC"
          value={`S/${sampleMetrics.cac.toFixed(2)}`}
          subtitle="Costo por adquisición"
          icon={Target}
          status="success"
          className="delay-300"
        />
        <MetricCard
          title="LTV/CAC"
          value={`${sampleMetrics.ltvCacRatio.toFixed(1)}:1`}
          subtitle="Ratio de valor"
          icon={TrendingUp}
          status="success"
          className="delay-400"
        />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Retención"
          value={`${sampleMetrics.retention}%`}
          subtitle="Tasa de retención"
          icon={Percent}
          status="success"
          className="delay-100"
        />
        <MetricCard
          title="Margen Neto"
          value={`${sampleMetrics.netMargin}%`}
          subtitle="Margen de utilidad"
          icon={BarChart3}
          status="success"
          className="delay-200"
        />
        <MetricCard
          title="Break-Even"
          value="Alcanzado"
          subtitle="59 estudiantes requeridos"
          icon={CheckCircle}
          status="success"
          className="delay-300"
        />
        <MetricCard
          title="NPS"
          value={sampleMetrics.nps.toString()}
          subtitle="Net Promoter Score"
          icon={Users}
          status="success"
          className="delay-400"
        />
      </div>

      {/* Quick insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5 animate-fade-in-up delay-500">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            Métricas Destacadas
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
              <span className="text-sm text-foreground">LTV/CAC Ratio</span>
              <span className="font-mono font-semibold text-success">48.1:1</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
              <span className="text-sm text-foreground">CAC vs Benchmark</span>
              <span className="font-mono font-semibold text-success">-90% mejor</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
              <span className="text-sm text-foreground">Conversión Funnel</span>
              <span className="font-mono font-semibold text-success">17%</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 animate-fade-in-up delay-500">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Áreas de Oportunidad
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
              <span className="text-sm text-foreground">Leads → Contactados</span>
              <span className="font-mono font-semibold text-warning">51% conv.</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
              <span className="text-sm text-foreground">Canal Orgánico</span>
              <span className="font-mono font-semibold text-muted-foreground">CAC +5%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
              <span className="text-sm text-foreground">Retención Día 1-7</span>
              <span className="font-mono font-semibold text-muted-foreground">Crítico</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
