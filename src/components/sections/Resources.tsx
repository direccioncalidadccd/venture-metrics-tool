import { Library, BookOpen, ExternalLink, FileText, Download, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

const glossary = [
  { term: 'CAC', definition: 'Customer Acquisition Cost - Costo de adquirir un cliente' },
  { term: 'LTV', definition: 'Lifetime Value - Valor total del cliente en su vida útil' },
  { term: 'MRR', definition: 'Monthly Recurring Revenue - Ingresos recurrentes mensuales' },
  { term: 'ARR', definition: 'Annual Recurring Revenue - Ingresos recurrentes anuales' },
  { term: 'Churn', definition: 'Tasa de cancelación o abandono de clientes' },
  { term: 'NPS', definition: 'Net Promoter Score - Indicador de lealtad del cliente' },
  { term: 'SROI', definition: 'Social Return on Investment - Retorno social de inversión' },
  { term: 'ROI', definition: 'Return on Investment - Retorno de inversión' },
  { term: 'Break-Even', definition: 'Punto de equilibrio entre ingresos y costos' },
  { term: 'Funnel', definition: 'Embudo de conversión de prospectos a clientes' },
  { term: 'CTR', definition: 'Click-Through Rate - Tasa de clics' },
  { term: 'CPL', definition: 'Cost Per Lead - Costo por lead' },
  { term: 'CPC', definition: 'Cost Per Click - Costo por clic' },
  { term: 'Payback Period', definition: 'Tiempo para recuperar el CAC' },
  { term: 'Gross Margin', definition: 'Margen bruto - Ingresos menos costos directos' },
  { term: 'Net Margin', definition: 'Margen neto - Utilidad sobre ingresos' },
];

const formulas = [
  { name: 'CAC', formula: 'Marketing Cost / New Customers' },
  { name: 'LTV', formula: 'ARPU × (1 / Churn Rate)' },
  { name: 'Churn', formula: 'Customers Lost / Total Customers' },
  { name: 'MRR', formula: 'Σ(Monthly Subscriptions)' },
  { name: 'Break-even', formula: 'Fixed Costs / (Price - Variable Cost)' },
  { name: 'ROI', formula: '(Gain - Cost) / Cost × 100' },
  { name: 'Payback', formula: 'CAC / (ARPU × Gross Margin)' },
  { name: 'NPS', formula: '% Promoters - % Detractors' },
];

const readings = [
  { title: 'Lean Analytics', author: 'Alistair Croll & Benjamin Yoskovitz', type: 'Libro' },
  { title: 'Traction', author: 'Gabriel Weinberg & Justin Mares', type: 'Libro' },
  { title: 'The Lean Startup', author: 'Eric Ries', type: 'Libro' },
  { title: 'Scaling Up', author: 'Verne Harnish', type: 'Libro' },
  { title: 'Zero to One', author: 'Peter Thiel', type: 'Libro' },
  { title: 'Measure What Matters', author: 'John Doerr', type: 'Libro' },
];

const tools = [
  { name: 'Google Analytics', description: 'Análisis de tráfico web', url: 'https://analytics.google.com' },
  { name: 'Mixpanel', description: 'Análisis de producto', url: 'https://mixpanel.com' },
  { name: 'HubSpot', description: 'CRM y marketing automation', url: 'https://hubspot.com' },
  { name: 'Stripe', description: 'Métricas de pagos', url: 'https://stripe.com' },
  { name: 'ChartMogul', description: 'Métricas de suscripción', url: 'https://chartmogul.com' },
  { name: 'Baremetrics', description: 'Analytics para SaaS', url: 'https://baremetrics.com' },
];

export function Resources() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="section-title">
          <Library className="w-7 h-7 text-primary" />
          Recursos y Referencias
        </h2>
        <p className="section-subtitle">
          Glosario, fórmulas, lecturas y herramientas recomendadas
        </p>
      </div>

      {/* Glossary */}
      <div className="calculator-section">
        <h3 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Glosario de Términos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {glossary.map((item, index) => (
            <div key={index} className="flex gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
              <span className="font-mono font-semibold text-primary min-w-16">{item.term}</span>
              <span className="text-sm text-muted-foreground">{item.definition}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formulas */}
      <div className="calculator-section">
        <h3 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Fórmulas de Referencia Rápida
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {formulas.map((item, index) => (
            <div key={index} className="p-4 rounded-lg bg-card border border-border">
              <p className="font-semibold text-foreground mb-2">{item.name}</p>
              <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                {item.formula}
              </code>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended readings */}
        <div className="calculator-section">
          <h3 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Lecturas Recomendadas
          </h3>
          <div className="space-y-3">
            {readings.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.author}</p>
                </div>
                <span className="badge-info">{item.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="calculator-section">
          <h3 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary" />
            Herramientas Complementarias
          </h3>
          <div className="space-y-3">
            {tools.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Templates */}
      <div className="calculator-section">
        <h3 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Templates Descargables
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border border-border bg-card">
            <FileText className="w-8 h-8 text-success mb-3" />
            <p className="font-medium text-foreground mb-1">Modelo Financiero 3 Años</p>
            <p className="text-xs text-muted-foreground mb-3">Excel con dashboard, ingresos, costos y flujo de caja</p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card">
            <FileText className="w-8 h-8 text-primary mb-3" />
            <p className="font-medium text-foreground mb-1">Tracker de Marketing</p>
            <p className="text-xs text-muted-foreground mb-3">Canales, inversión, métricas y ROI</p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card">
            <FileText className="w-8 h-8 text-warning mb-3" />
            <p className="font-medium text-foreground mb-1">Cohortes de Retención</p>
            <p className="text-xs text-muted-foreground mb-3">Template con fórmulas pre-configuradas</p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card">
            <FileText className="w-8 h-8 text-destructive mb-3" />
            <p className="font-medium text-foreground mb-1">Reporte Ejecutivo</p>
            <p className="text-xs text-muted-foreground mb-3">Plantilla PDF para board/inversores</p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
