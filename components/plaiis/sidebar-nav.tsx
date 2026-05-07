'use client';

import { ChevronLeft, ChevronRight, BarChart3, AlertTriangle, Brain, GitBranch, MessageSquare, Grid3x3, Coins, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarNavProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const sections = [
  {
    id: 'decision',
    label: 'Dashboard Decisión',
    icon: BarChart3,
  },
  {
    id: 'biometric',
    label: 'Riesgo Biométrico',
    icon: AlertTriangle,
  },
  {
    id: 'ai-validation',
    label: 'Validación IA',
    icon: Brain,
  },
  {
    id: 'interoperability',
    label: 'Interoperabilidad',
    icon: GitBranch,
  },
  {
    id: 'appeals',
    label: 'Apelaciones',
    icon: MessageSquare,
  },
  {
    id: 'risk-matrix',
    label: 'Matriz Riesgos',
    icon: Grid3x3,
  },
  {
    id: 'sustainability',
    label: 'Sostenibilidad',
    icon: Coins,
  },
  {
    id: 'governance',
    label: 'Comité Gobernanza',
    icon: Users,
  },
];

export default function SidebarNav({
  activeSection,
  onSectionChange,
  isOpen,
  onToggle,
}: SidebarNavProps) {
  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-card border-r border-border transition-all duration-300 flex flex-col h-screen`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {isOpen && (
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">PG</span>
            </div>
            <span className="font-bold text-sm text-foreground">PLAIIS Gov</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isOpen && <span className="text-sm font-medium text-left">{section.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {isOpen && (
          <div className="text-xs text-muted-foreground">
            <p>Versión 1.0</p>
            <p>PLAIIS GovControl</p>
          </div>
        )}
      </div>
    </div>
  );
}
