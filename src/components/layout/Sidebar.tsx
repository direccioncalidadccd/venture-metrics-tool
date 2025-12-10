import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calculator,
  Target,
  Users,
  TrendingUp,
  DollarSign,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Wallet,
  UserCheck,
  Megaphone,
  BookOpen,
  FileText,
  Library,
  Menu,
  X,
  Search,
  Download,
  FileDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'fundamentos', label: 'Fundamentos', icon: BookOpen },
  { id: 'break-even', label: 'Punto de Equilibrio', icon: Target },
  { id: 'cac', label: 'CAC', icon: DollarSign },
  { id: 'ltv', label: 'LTV', icon: TrendingUp },
  { id: 'roi', label: 'ROI & SROI', icon: PieChart },
  { id: 'proyecciones', label: 'Proyecciones', icon: LineChart },
  { id: 'sensibilidad', label: 'Sensibilidad', icon: BarChart3 },
  { id: 'funnel', label: 'Funnel', icon: Filter },
  { id: 'productividad', label: 'Productividad', icon: Users },
  { id: 'precios', label: 'Análisis de Precios', icon: Calculator },
  { id: 'flujo-caja', label: 'Flujo de Caja', icon: Wallet },
  { id: 'retencion', label: 'Retención Cohortes', icon: UserCheck },
  { id: 'marketing', label: 'Canales Marketing', icon: Megaphone },
  { id: 'casos', label: 'Casos Prácticos', icon: FileText },
  { id: 'recursos', label: 'Recursos', icon: Library },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border border-border"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-72 bg-sidebar border-r border-sidebar-border z-40',
          'transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">Métricas</h1>
                <p className="text-xs text-muted-foreground">Guía Empresarial</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                         placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionChange(item.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'nav-link w-full text-left',
                      isActive && 'nav-link-active'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Export buttons */}
          <div className="p-4 border-t border-sidebar-border space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <FileDown className="w-4 h-4 mr-2" />
              Generar PDF
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
