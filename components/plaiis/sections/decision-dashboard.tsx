'use client';

import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GovControlData } from '@/lib/plaiis/data-simulator';

interface DecisionDashboardProps {
  data: GovControlData;
  onUpdate: (data: GovControlData) => void;
}

export default function DecisionDashboard({ data, onUpdate }: DecisionDashboardProps) {
  const risksSummary = {
    critical: data.risks.filter(r => r.nivel === 'critico').length,
    high: data.risks.filter(r => r.nivel === 'alto').length,
    medium: data.risks.filter(r => r.nivel === 'medio').length,
    low: data.risks.filter(r => r.nivel === 'bajo').length,
  };

  const failedBiometrics = data.biometricData.filter(b => b.resultado === 'fallido').length;
  const highRiskBiometrics = data.biometricData.filter(b => b.riesgo === 'alto').length;

  const unmetCriteria = data.approvalChecklist.filter(c => !c.cumplido).length;

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Resumen Ejecutivo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-l-4 border-l-red-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold">ESTADO ACTUAL</p>
                <p className="text-2xl font-bold text-foreground mt-2">No Apto para Lanzamiento Nacional</p>
                <p className="text-sm text-muted-foreground mt-2">Revisión en progreso</p>
              </div>
              <AlertCircle className="text-red-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-amber-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold">RECOMENDACIÓN</p>
                <p className="text-2xl font-bold text-foreground mt-2">Piloto Controlado</p>
                <p className="text-sm text-muted-foreground mt-2">Con supervisión intensiva</p>
              </div>
              <Info className="text-amber-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold">CRITERIOS PENDIENTES</p>
                <p className="text-2xl font-bold text-foreground mt-2">{unmetCriteria} de 8</p>
                <p className="text-sm text-muted-foreground mt-2">Deben completarse</p>
              </div>
              <CheckCircle2 className="text-blue-500" size={32} />
            </div>
          </Card>
        </div>

        {/* Indicadores de Riesgo */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Semáforos de Riesgo</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="flex flex-col items-center p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-lg mb-2">
                {risksSummary.critical}
              </div>
              <p className="text-xs text-center text-foreground font-semibold">Riesgos Críticos</p>
              <p className="text-xs text-muted-foreground mt-1">Requieren acción</p>
            </div>

            <div className="flex flex-col items-center p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg mb-2">
                {risksSummary.high}
              </div>
              <p className="text-xs text-center text-foreground font-semibold">Riesgos Altos</p>
              <p className="text-xs text-muted-foreground mt-1">En mitigación</p>
            </div>

            <div className="flex flex-col items-center p-4 rounded-lg bg-amber-50 border border-amber-200">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-lg mb-2">
                {risksSummary.medium}
              </div>
              <p className="text-xs text-center text-foreground font-semibold">Riesgos Medios</p>
              <p className="text-xs text-muted-foreground mt-1">Bajo control</p>
            </div>

            <div className="flex flex-col items-center p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg mb-2">
                {risksSummary.low}
              </div>
              <p className="text-xs text-center text-foreground font-semibold">Riesgos Bajos</p>
              <p className="text-xs text-muted-foreground mt-1">Controlados</p>
            </div>

            <div className="flex flex-col items-center p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-lg mb-2">
                {failedBiometrics}
              </div>
              <p className="text-xs text-center text-foreground font-semibold">Fallos Biométricos</p>
              <p className="text-xs text-muted-foreground mt-1">Requieren revisión</p>
            </div>

            <div className="flex flex-col items-center p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-lg mb-2">
                {highRiskBiometrics}
              </div>
              <p className="text-xs text-center text-foreground font-semibold">Riesgo Biométrico Alto</p>
              <p className="text-xs text-muted-foreground mt-1">Altoandina</p>
            </div>
          </div>
        </Card>

        {/* Recomendaciones */}
        <Card className="p-6 bg-blue-50 border-l-4 border-l-blue-500">
          <h3 className="font-bold text-foreground mb-3">Recomendaciones Inmediatas</h3>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Auditoría urgente de modelos de IA caja negra en decisiones de subsidios
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Implementar explicabilidad en todos los rechazos automáticos
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Reentrenamiento de modelos con datos multiculturales (quechua, aymara)
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Establecer SLAs para apelaciones ciudadanas (máx 15 días)
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Auditorías mensuales de sesgo biométrico en zonas altoandinas
            </li>
          </ul>
        </Card>

        {/* Próximos Pasos */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-4">Próximos Pasos para Lanzamiento Nacional</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded bg-muted">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-semibold text-foreground">Completar sesgo - Auditorías Mensuales</p>
                <p className="text-xs text-muted-foreground mt-1">Implementar pruebas de sesgo en datos altoandinos</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded bg-muted">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-semibold text-foreground">Implementar Explicabilidad Total</p>
                <p className="text-xs text-muted-foreground mt-1">Reemplazar modelos caja negra por versiones auditable</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded bg-muted">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-semibold text-foreground">Validar Interoperabilidad</p>
                <p className="text-xs text-muted-foreground mt-1">Pruebas de carga y failover con ministerios</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
