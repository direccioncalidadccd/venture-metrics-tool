import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { BreakEvenCalculator } from '@/components/calculators/BreakEvenCalculator';
import { CACCalculator } from '@/components/calculators/CACCalculator';
import { LTVCalculator } from '@/components/calculators/LTVCalculator';
import { ROICalculator } from '@/components/calculators/ROICalculator';
import { FunnelCalculator } from '@/components/calculators/FunnelCalculator';
import { MarketingChannelsCalculator } from '@/components/calculators/MarketingChannelsCalculator';
import { Fundamentos } from '@/components/sections/Fundamentos';
import { CaseStudies } from '@/components/sections/CaseStudies';
import { Resources } from '@/components/sections/Resources';
import { ComingSoon } from '@/components/sections/ComingSoon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'fundamentos':
        return <Fundamentos />;
      case 'break-even':
        return <BreakEvenCalculator />;
      case 'cac':
        return <CACCalculator />;
      case 'ltv':
        return <LTVCalculator />;
      case 'roi':
        return <ROICalculator />;
      case 'funnel':
        return <FunnelCalculator />;
      case 'marketing':
        return <MarketingChannelsCalculator />;
      case 'casos':
        return <CaseStudies />;
      case 'recursos':
        return <Resources />;
      case 'proyecciones':
        return <ComingSoon title="Proyecciones de Crecimiento" description="Proyecta tus métricas a 36 meses con múltiples escenarios" />;
      case 'sensibilidad':
        return <ComingSoon title="Análisis de Sensibilidad" description="Evalúa el impacto de variables clave en tus resultados" />;
      case 'productividad':
        return <ComingSoon title="Productividad por Empleado" description="Analiza la eficiencia de tu equipo" />;
      case 'precios':
        return <ComingSoon title="Análisis de Precios" description="Encuentra el precio óptimo para tu producto" />;
      case 'flujo-caja':
        return <ComingSoon title="Flujo de Caja" description="Proyecta tu flujo de caja a 12 meses" />;
      case 'retencion':
        return <ComingSoon title="Retención de Cohortes" description="Analiza la retención de clientes por cohorte" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="lg:ml-72 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default Index;
