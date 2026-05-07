'use client';

interface StatusBadgeProps {
  type: 'critical' | 'warning' | 'info' | 'success' | 'risk-high' | 'risk-medium' | 'risk-low';
  label: string;
  count?: number;
}

export default function StatusBadge({ type, label, count }: StatusBadgeProps) {
  const styles = {
    critical: 'bg-red-100 text-red-800 border border-red-300',
    warning: 'bg-amber-100 text-amber-800 border border-amber-300',
    info: 'bg-blue-100 text-blue-800 border border-blue-300',
    success: 'bg-green-100 text-green-800 border border-green-300',
    'risk-high': 'bg-red-100 text-red-800 border border-red-300',
    'risk-medium': 'bg-amber-100 text-amber-800 border border-amber-300',
    'risk-low': 'bg-green-100 text-green-800 border border-green-300',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${styles[type]}`}>
      <span>{label}</span>
      {count !== undefined && <span>({count})</span>}
    </span>
  );
}

// Estado Badge para tablas
export function StateBadge({ state }: { state: string }) {
  const styles: Record<string, string> = {
    'activo': 'bg-green-100 text-green-800',
    'inactivo': 'bg-gray-100 text-gray-800',
    'bloqueado': 'bg-red-100 text-red-800',
    'critico': 'bg-red-100 text-red-800',
    'en_revision': 'bg-blue-100 text-blue-800',
    'revisión': 'bg-blue-100 text-blue-800',
    'resuelto': 'bg-green-100 text-green-800',
    'pendiente': 'bg-amber-100 text-amber-800',
    'identificado': 'bg-blue-100 text-blue-800',
    'mitigando': 'bg-amber-100 text-amber-800',
    'controlado': 'bg-green-100 text-green-800',
    'exitoso': 'bg-green-100 text-green-800',
    'fallido': 'bg-red-100 text-red-800',
    'aprobado': 'bg-green-100 text-green-800',
  };

  const style = styles[state] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${style}`}>
      {state.replace(/_/g, ' ')}
    </span>
  );
}

// Risk Level Badge
export function RiskLevelBadge({ level }: { level: 'bajo' | 'medio' | 'alto' | 'critico' }) {
  const styles = {
    'bajo': 'bg-green-100 text-green-800',
    'medio': 'bg-amber-100 text-amber-800',
    'alto': 'bg-orange-100 text-orange-800',
    'critico': 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${styles[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}
