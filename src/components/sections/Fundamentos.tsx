import { BookOpen, TrendingUp, Target, DollarSign, Users, Filter, PieChart, Wallet } from 'lucide-react';

const concepts = [
  {
    icon: Target,
    title: 'Punto de Equilibrio (Break-Even)',
    description: 'El punto donde los ingresos totales igualan los costos totales. No hay ganancia ni pérdida.',
    formula: 'BEP = Costos Fijos / (Precio - Costo Variable)',
    importance: 'Esencial para saber cuántas unidades mínimas debes vender para cubrir todos tus costos.',
  },
  {
    icon: DollarSign,
    title: 'CAC (Customer Acquisition Cost)',
    description: 'Costo promedio para adquirir un nuevo cliente, incluyendo marketing y ventas.',
    formula: 'CAC = Inversión Marketing Total / Clientes Adquiridos',
    importance: 'Indica qué tan eficiente es tu proceso de adquisición. Un CAC bajo significa mayor eficiencia.',
  },
  {
    icon: TrendingUp,
    title: 'LTV (Lifetime Value)',
    description: 'Valor total que un cliente genera durante toda su relación con tu empresa.',
    formula: 'LTV = Precio Promedio × Frecuencia × Vida del Cliente × Margen',
    importance: 'El ratio LTV/CAC debe ser >3:1 para un modelo de negocio sostenible.',
  },
  {
    icon: PieChart,
    title: 'ROI (Return on Investment)',
    description: 'Mide la rentabilidad de una inversión como porcentaje del capital invertido.',
    formula: 'ROI = ((Ingresos - Costos - Inversión) / Inversión) × 100',
    importance: 'ROI positivo indica que la inversión genera retornos; cuanto mayor, mejor.',
  },
  {
    icon: Filter,
    title: 'Funnel de Conversión',
    description: 'El camino que siguen los prospectos desde el primer contacto hasta convertirse en clientes.',
    formula: 'Conversión = (Etapa Actual / Etapa Anterior) × 100',
    importance: 'Identificar "puntos de fuga" permite optimizar la adquisición de clientes.',
  },
  {
    icon: Users,
    title: 'Tasa de Retención',
    description: 'Porcentaje de clientes que continúan usando tu servicio en un período dado.',
    formula: 'Retención = ((Clientes Final - Nuevos) / Clientes Inicio) × 100',
    importance: 'Alta retención = mayor LTV = menor necesidad de adquisición constante.',
  },
  {
    icon: Wallet,
    title: 'Flujo de Caja',
    description: 'Movimiento de dinero que entra y sale del negocio en un período.',
    formula: 'Flujo Neto = Ingresos - Egresos',
    importance: 'Un flujo positivo consistente es vital para la supervivencia del negocio.',
  },
];

const benchmarks = [
  { metric: 'CAC', education: 'S/20-60', saas: '$200-500', ecommerce: '$10-50' },
  { metric: 'LTV/CAC', education: '>3:1', saas: '>3:1', ecommerce: '>3:1' },
  { metric: 'Retención Anual', education: '60-75%', saas: '90-95%', ecommerce: '20-40%' },
  { metric: 'Margen Bruto', education: '50-70%', saas: '70-90%', ecommerce: '30-50%' },
  { metric: 'Conversión Funnel', education: '15-20%', saas: '5-15%', ecommerce: '2-5%' },
];

export function Fundamentos() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="section-title">
          <BookOpen className="w-7 h-7 text-primary" />
          Fundamentos de Métricas
        </h2>
        <p className="section-subtitle">
          Comprende los conceptos clave antes de usar las calculadoras
        </p>
      </div>

      {/* Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, index) => {
          const Icon = concept.icon;
          return (
            <div key={index} className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg mb-2">{concept.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{concept.description}</p>
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border mb-3">
                    <code className="text-sm font-mono text-primary">{concept.formula}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-success font-medium">💡 Importancia:</span> {concept.importance}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Benchmarks Table */}
      <div className="calculator-section">
        <h3 className="font-semibold text-foreground text-lg mb-4">📊 Benchmarks por Industria</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Métrica</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">📚 Educación</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">💻 SaaS</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">🛒 E-commerce</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((row, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="py-3 px-4 font-medium text-foreground">{row.metric}</td>
                  <td className="py-3 px-4 text-center font-mono text-primary">{row.education}</td>
                  <td className="py-3 px-4 text-center font-mono text-muted-foreground">{row.saas}</td>
                  <td className="py-3 px-4 text-center font-mono text-muted-foreground">{row.ecommerce}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <h4 className="font-semibold text-success mb-2">✅ Señales Saludables</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• LTV/CAC mayor a 3:1</li>
            <li>• Break-even en 4-6 meses</li>
            <li>• Retención mayor a 70%</li>
            <li>• Flujo de caja positivo</li>
          </ul>
        </div>
        <div className="glass-card p-5">
          <h4 className="font-semibold text-warning mb-2">⚠️ Señales de Alerta</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• LTV/CAC menor a 2:1</li>
            <li>• CAC creciente mes a mes</li>
            <li>• Churn mayor a 10% mensual</li>
            <li>• Margen bruto bajo 40%</li>
          </ul>
        </div>
        <div className="glass-card p-5">
          <h4 className="font-semibold text-primary mb-2">🎯 Prioridades</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>1. Validar unit economics</li>
            <li>2. Optimizar funnel</li>
            <li>3. Mejorar retención</li>
            <li>4. Escalar adquisición</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
