'use client';

import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GovControlData } from '@/lib/plaiis/data-simulator';
import { useState } from 'react';

interface GovernanceCommitteeProps {
  data: GovControlData;
  onUpdate: (data: GovControlData) => void;
}

export default function GovernanceCommittee({ data, onUpdate }: GovernanceCommitteeProps) {
  const [showApprovalForm, setShowApprovalForm] = useState(false);

  const completedCriteria = data.approvalChecklist.filter(c => c.cumplido).length;
  const totalCriteria = data.approvalChecklist.length;
  const allMet = completedCriteria === totalCriteria;

  const handleToggleCriteria = (id: string) => {
    const updated = data.approvalChecklist.map(c =>
      c.id === id ? { ...c, cumplido: !c.cumplido } : c
    );
    onUpdate({ ...data, approvalChecklist: updated });
  };

  const handleApprove = () => {
    if (!allMet) {
      alert('No se puede aprobar lanzamiento. Todos los criterios deben estar cumplidos.');
      return;
    }

    if (data.isBlocked) {
      alert('No se puede aprobar lanzamiento. El sistema está bloqueado.');
      return;
    }

    alert('✓ Aprobación registrada.\n\nLanzamiento nacional puede proceder con supervisión de comité de gobernanza.');
    setShowApprovalForm(false);
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Alertas */}
        {!allMet && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-amber-900">Criterios Pendientes</p>
              <p className="text-sm text-amber-800 mt-1">
                {totalCriteria - completedCriteria} de {totalCriteria} criterios de aprobación aún no están cumplidos. El lanzamiento no puede proceder.
              </p>
            </div>
          </div>
        )}

        {data.isBlocked && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-red-900">Lanzamiento Bloqueado</p>
              <p className="text-sm text-red-800 mt-1">
                El lanzamiento ha sido bloqueado por el comité. Desbloquear en Dashboard de Decisión antes de proceder.
              </p>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">CRITERIOS CUMPLIDOS</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {completedCriteria}/{totalCriteria}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">PORCENTAJE</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {Math.round((completedCriteria / totalCriteria) * 100)}%
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">ESTADO APROBACIÓN</p>
            <p className={`text-2xl font-bold mt-2 ${allMet ? 'text-green-600' : 'text-amber-600'}`}>
              {allMet ? 'Lista' : 'Incompleta'}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">SISTEMA BLOQUEADO</p>
            <p className={`text-2xl font-bold mt-2 ${data.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
              {data.isBlocked ? 'Sí' : 'No'}
            </p>
          </Card>
        </div>

        {/* Checklist de Aprobación */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-4">Checklist de Aprobación para Lanzamiento</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Todos los criterios deben estar cumplidos para proceder al lanzamiento nacional.
          </p>

          <div className="space-y-3">
            {data.approvalChecklist.map((criteria) => (
              <div
                key={criteria.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  criteria.cumplido
                    ? 'bg-green-50 border-green-300'
                    : 'bg-amber-50 border-amber-300'
                }`}
                onClick={() => handleToggleCriteria(criteria.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {criteria.cumplido ? (
                      <CheckCircle2 className="text-green-600" size={24} />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-amber-400"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${criteria.cumplido ? 'text-green-900' : 'text-amber-900'}`}>
                      {criteria.criterio}
                    </p>
                    <p className={`text-sm mt-1 ${criteria.cumplido ? 'text-green-800' : 'text-amber-800'}`}>
                      {criteria.evidencia}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Panel de Decisiones del Comité */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-4">Decisiones del Comité de Gobernanza</h3>
          
          {data.governanceDecisions.length > 0 ? (
            <div className="space-y-4">
              {data.governanceDecisions.map((decision) => (
                <div key={decision.id} className="p-4 rounded-lg border border-border bg-muted">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{decision.decision}</p>
                      <p className="text-xs text-muted-foreground mt-1">{decision.fecha}</p>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                      Registrada
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Riesgos Revisados</p>
                      <p className="text-sm text-foreground">{decision.riesgosRevisados} riesgos evaluados</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 rounded bg-background">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Comentario OIA</p>
                        <p className="text-sm text-foreground">{decision.comentarios.oia}</p>
                      </div>
                      <div className="p-3 rounded bg-background">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Comentario Arquitecto</p>
                        <p className="text-sm text-foreground">{decision.comentarios.arquitecto}</p>
                      </div>
                      <div className="p-3 rounded bg-background">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Comentario Seguridad</p>
                        <p className="text-sm text-foreground">{decision.comentarios.seguridad}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No hay decisiones registradas aún.</p>
          )}
        </Card>

        {/* Votación y Aprobación Final */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
          <h3 className="font-bold text-foreground mb-4">Votación Final - Lanzamiento Nacional</h3>
          
          <div className="mb-6 p-4 rounded-lg bg-white border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-foreground">Estado de Votación</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                allMet && !data.isBlocked
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {allMet && !data.isBlocked ? 'Listo para Votar' : 'No Apto'}
              </span>
            </div>

            {!allMet && (
              <p className="text-sm text-red-800 mb-3">
                ⚠️ {totalCriteria - completedCriteria} criterio(s) pendiente(s) - Complete antes de votar
              </p>
            )}

            {data.isBlocked && (
              <p className="text-sm text-red-800 mb-3">
                ⚠️ Sistema bloqueado - Desbloquear desde Dashboard
              </p>
            )}

            <div className="space-y-2 text-sm text-foreground">
              <p><strong>Miembros del Comité:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>✓ Oficina de IA (OIA)</li>
                <li>✓ Arquitecto de Sistemas</li>
                <li>✓ Jefe Seguridad Informática</li>
                <li>✓ PMO (Project Manager)</li>
              </ul>
            </div>
          </div>

          {!showApprovalForm ? (
            <Button
              onClick={() => setShowApprovalForm(true)}
              disabled={!allMet || data.isBlocked}
              className="w-full gap-2"
            >
              <CheckCircle2 size={18} />
              Proceder a Votación
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-white border-2 border-blue-300">
                <p className="font-semibold text-foreground mb-2">Confirmación Final</p>
                <p className="text-sm text-foreground mb-4">
                  ¿Aprueba el comité el lanzamiento nacional de PLAIIS?
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleApprove}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    ✓ Aprobar Lanzamiento
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowApprovalForm(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Recomendaciones Finales */}
        <Card className="p-6 bg-blue-50 border-l-4 border-l-blue-500">
          <h3 className="font-bold text-foreground mb-3">Recomendaciones Finales del Comité</h3>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Supervisión mensual de sesgo en ciudadanos altoandinos (mín. 3 meses)
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Reporte quincenal de tasa de apelaciones y causas
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Comité semanal si críticos detectados en monitoreo
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Auditoría independiente a 6 meses del lanzamiento
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Plan de rollback definido en caso de problemas críticos
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
