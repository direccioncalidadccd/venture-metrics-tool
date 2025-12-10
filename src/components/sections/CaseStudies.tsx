import { FileText, CheckCircle, TrendingUp, Users, DollarSign, Target, Award } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/calculations';

export function CaseStudies() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="section-title">
          <FileText className="w-7 h-7 text-primary" />
          Casos Prácticos
        </h2>
        <p className="section-subtitle">
          Ejemplos reales para entender cómo aplicar las métricas
        </p>
      </div>

      {/* Case 1: Ingenia College */}
      <div className="calculator-section">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-primary/10">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Caso 1: Ingenia College</h3>
            <p className="text-muted-foreground">Startup Educativa - Piloto Enero-Mayo 2025</p>
          </div>
        </div>

        {/* Context */}
        <div className="p-4 rounded-lg bg-secondary/50 border border-border mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Contexto:</span> Ingenia College es una plataforma
            educativa digital que ofrece reforzamiento en matemáticas y ciencias para secundaria. Este caso
            analiza los resultados de su piloto inicial.
          </p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Inversión Marketing</p>
            <p className="text-xl font-bold font-mono text-foreground">S/1,500</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Leads Generados</p>
            <p className="text-xl font-bold font-mono text-foreground">1,700</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Estudiantes</p>
            <p className="text-xl font-bold font-mono text-foreground">289</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Conversión</p>
            <p className="text-xl font-bold font-mono text-success">17%</p>
          </div>
        </div>

        {/* Step by step analysis */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">📊 Análisis Paso a Paso</h4>

          {/* Step 1: CAC */}
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <h5 className="font-semibold text-foreground">CAC (Customer Acquisition Cost)</h5>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg mb-3 font-mono text-sm">
              <p className="text-muted-foreground">CAC = S/1,500 / 289 = <span className="text-success font-bold">S/5.19</span></p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Excelente (benchmark sector: S/20-60)</span>
            </div>
          </div>

          {/* Step 2: LTV */}
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <h5 className="font-semibold text-foreground">LTV (Lifetime Value)</h5>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg mb-3 font-mono text-sm space-y-1">
              <p className="text-muted-foreground">Precio ciclo: S/75</p>
              <p className="text-muted-foreground">Ciclos por año: 4</p>
              <p className="text-muted-foreground">Retención: 70%</p>
              <p className="text-muted-foreground">Vida cliente: 1/(1-0.70) = 3.33 ciclos</p>
              <p className="text-muted-foreground">LTV = S/75 × 3.33 = <span className="text-success font-bold">S/249.75</span></p>
            </div>
          </div>

          {/* Step 3: LTV/CAC */}
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <h5 className="font-semibold text-foreground">Ratio LTV/CAC</h5>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg mb-3 font-mono text-sm">
              <p className="text-muted-foreground">Ratio = S/249.75 / S/5.19 = <span className="text-success font-bold">48.1:1</span></p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Excepcional (benchmark: &gt;3:1)</span>
            </div>
          </div>

          {/* Step 4: Break-Even */}
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">4</span>
              </div>
              <h5 className="font-semibold text-foreground">Punto de Equilibrio</h5>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg mb-3 font-mono text-sm space-y-1">
              <p className="text-muted-foreground">Costos fijos: S/1,500 (marketing)</p>
              <p className="text-muted-foreground">Costo variable: S/12.11 (docente)</p>
              <p className="text-muted-foreground">Precio mensual: S/37.50</p>
              <p className="text-muted-foreground">Margen contribución: S/37.50 - S/12.11 = S/25.39</p>
              <p className="text-muted-foreground">Break-even = S/1,500 / S/25.39 = <span className="text-success font-bold">59 estudiantes</span></p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Alcanzado en semana 1 (289 estudiantes)</span>
            </div>
          </div>

          {/* Step 5: SROI */}
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">5</span>
              </div>
              <h5 className="font-semibold text-foreground">SROI (Social Return on Investment)</h5>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg mb-3 font-mono text-sm space-y-1">
              <p className="text-muted-foreground">Inversión: S/5,000</p>
              <p className="text-muted-foreground font-semibold mt-2">Outcomes:</p>
              <p className="text-muted-foreground">• Ahorro familiar: S/99,082</p>
              <p className="text-muted-foreground">• Mejora académica: S/41,310</p>
              <p className="text-muted-foreground">• Alfabetización digital: S/17,280</p>
              <p className="text-muted-foreground">• Otros: S/37,587</p>
              <p className="text-muted-foreground mt-2">Total valor social: S/195,259</p>
              <p className="text-muted-foreground">SROI = S/195,259 / S/5,000 = <span className="text-success font-bold">39:1</span></p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Excepcional (benchmark educación: 3-5:1)</span>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="mt-6 p-5 rounded-lg bg-success/10 border border-success/30">
          <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Conclusión del Caso
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            Ingenia College validó un modelo altamente eficiente y escalable. Las métricas clave superan 
            los benchmarks de industria en 2-10x, indicando un product-market fit excepcional.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">ROI Piloto</p>
              <p className="font-bold font-mono text-success">366%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">SROI</p>
              <p className="font-bold font-mono text-success">39:1</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">LTV/CAC</p>
              <p className="font-bold font-mono text-success">48:1</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Mejora Académica</p>
              <p className="font-bold font-mono text-success">+22%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional cases placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 opacity-60">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-muted">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Caso 2: E-commerce</h3>
              <p className="text-sm text-muted-foreground">Próximamente</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Análisis de métricas para un negocio de comercio electrónico con enfoque en CAC, 
            retención y valor de vida del cliente.
          </p>
        </div>

        <div className="glass-card p-6 opacity-60">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-muted">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Caso 3: SaaS B2B</h3>
              <p className="text-sm text-muted-foreground">Próximamente</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Métricas típicas de SaaS incluyendo MRR, churn, expansión y contracción de ingresos.
          </p>
        </div>
      </div>
    </div>
  );
}
