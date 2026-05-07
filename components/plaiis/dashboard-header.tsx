'use client';

import { AlertCircle, Lock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from './status-badges';

interface DashboardHeaderProps {
  projectStatus: string;
  recommendation: string;
  isBlocked: boolean;
  onToggleBlock: () => void;
  onResetData: () => void;
}

export default function DashboardHeader({
  projectStatus,
  recommendation,
  isBlocked,
  onToggleBlock,
  onResetData,
}: DashboardHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'no_apto_lanzamiento':
        return 'red';
      case 'apto_piloto':
        return 'amber';
      case 'apto_lanzamiento':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case 'piloto_controlado':
        return 'Piloto Controlado';
      case 'esperar_mejoras':
        return 'Esperar Mejoras';
      case 'lanzamiento_nacional':
        return 'Lanzamiento Nacional';
      default:
        return rec;
    }
  };

  const statusColor = getStatusColor(projectStatus);

  return (
    <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Panel PLAIIS GovControl</h1>
          <p className="text-sm text-muted-foreground mt-1">Gobernanza Institucional - Evaluación de Readiness</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Estado Actual */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted">
          <div className={`w-3 h-3 rounded-full ${
            statusColor === 'red' ? 'bg-red-500' :
            statusColor === 'amber' ? 'bg-amber-500' :
            statusColor === 'green' ? 'bg-green-500' :
            'bg-gray-500'
          }`}></div>
          <div>
            <p className="text-xs text-muted-foreground">Estado Actual</p>
            <p className="text-sm font-semibold text-foreground">
              {getRecommendationText(recommendation)}
            </p>
          </div>
        </div>

        {/* Botón Bloqueo */}
        {isBlocked && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
            <Lock size={16} className="text-red-600" />
            <span className="text-xs font-semibold text-red-600">Lanzamiento Bloqueado</span>
          </div>
        )}

        {/* Botones de Acción */}
        <Button
          variant={isBlocked ? 'default' : 'outline'}
          size="sm"
          onClick={onToggleBlock}
          className="gap-2"
        >
          <AlertCircle size={16} />
          {isBlocked ? 'Desbloquear' : 'Bloquear'} Lanzamiento
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onResetData}
          className="gap-2"
        >
          <RotateCcw size={16} />
          Reiniciar
        </Button>
      </div>
    </div>
  );
}
