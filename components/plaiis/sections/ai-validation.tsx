'use client';

import { AlertCircle, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GovControlData } from '@/lib/plaiis/data-simulator';
import { StateBadge } from '../status-badges';
import { useState } from 'react';

interface AIValidationProps {
  data: GovControlData;
  onUpdate: (data: GovControlData) => void;
}

export default function AIValidation({ data, onUpdate }: AIValidationProps) {
  const [simulationOpen, setSimulationOpen] = useState(false);
  const [simForm, setSimForm] = useState({
    ciudadano: '',
    beneficio: '',
    confianza: 80,
  });

  const blockedModels = data.aiModels.filter(m => m.estado === 'bloqueado');
  const activeModels = data.aiModels.filter(m => m.estado === 'activo');

  const handleSimulation = () => {
    if (!simForm.ciudadano || !simForm.beneficio) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const requiereRevision = simForm.confianza < 80;
    alert(
      `Simulación:\n\n` +
      `Ciudadano: ${simForm.ciudadano}\n` +
      `Beneficio: ${simForm.beneficio}\n` +
      `Confianza IA: ${simForm.confianza}%\n\n` +
      `${requiereRevision ? '⚠️ REQUIERE REVISIÓN HUMANA' : '✓ Puede procesarse automáticamente'}\n\n` +
      `Ciudadano puede apelar en cualquier caso.`
    );
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Alertas */}
        {blockedModels.length > 0 && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex gap-3">
            <Lock className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-red-900">Modelos Bloqueados</p>
              <p className="text-sm text-red-800 mt-1">
                {blockedModels.map(m => m.nombre).join(', ')} están bloqueados. Requieren auditoría antes de usar en decisiones de subsidios.
              </p>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">TOTAL MODELOS</p>
            <p className="text-2xl font-bold text-foreground mt-2">{data.aiModels.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">ACTIVOS</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{activeModels.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">BLOQUEADOS</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{blockedModels.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">AUDITABLE</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {data.aiModels.filter(m => m.auditable).length}
            </p>
          </Card>
        </div>

        {/* Tabla de Modelos */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-4">Modelos de IA</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Nombre</th>
                  <th className="px-4 py-2 text-left font-semibold">Tipo</th>
                  <th className="px-4 py-2 text-center font-semibold">Auditable</th>
                  <th className="px-4 py-2 text-left font-semibold">Uso</th>
                  <th className="px-4 py-2 text-left font-semibold">Estado</th>
                  <th className="px-4 py-2 text-left font-semibold">Responsable</th>
                  <th className="px-4 py-2 text-left font-semibold">Última Auditoría</th>
                </tr>
              </thead>
              <tbody>
                {data.aiModels.map((model) => (
                  <tr key={model.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-foreground">{model.nombre}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        model.tipo === 'caja_blanca'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {model.tipo === 'caja_blanca' ? 'Caja Blanca' : 'Caja Negra'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {model.auditable ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-600 font-bold">✗</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {model.uso.join(', ')}
                    </td>
                    <td className="px-4 py-3">
                      <StateBadge state={model.estado} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{model.responsable}</td>
                    <td className="px-4 py-3 text-muted-foreground">{model.ultimaAuditoria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Simulador de Decisión */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-4">Simulador de Decisiones IA</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Simula cómo PLAIIS procesaría una solicitud de beneficio basada en confianza biométrica.
          </p>

          {!simulationOpen ? (
            <Button onClick={() => setSimulationOpen(true)} className="gap-2">
              + Nueva Simulación
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1">Ciudadano</label>
                <input
                  type="text"
                  placeholder="Nombre del ciudadano"
                  value={simForm.ciudadano}
                  onChange={(e) => setSimForm({ ...simForm, ciudadano: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-1">Beneficio</label>
                <select
                  value={simForm.beneficio}
                  onChange={(e) => setSimForm({ ...simForm, beneficio: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Selecciona un beneficio...</option>
                  <option value="Pensión 65">Pensión 65</option>
                  <option value="Bonificación Familiar">Bonificación Familiar</option>
                  <option value="Subsidio Escolar">Subsidio Escolar</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Confianza Biométrica IA: {simForm.confianza}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simForm.confianza}
                  onChange={(e) => setSimForm({ ...simForm, confianza: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="p-4 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground font-semibold mb-2">RESULTADO DE SIMULACIÓN</p>
                {simForm.confianza >= 80 ? (
                  <div className="bg-green-50 border border-green-300 rounded p-3">
                    <p className="font-semibold text-green-900">✓ Puede procesarse automáticamente</p>
                    <p className="text-sm text-green-800 mt-1">
                      Confianza suficiente ({simForm.confianza}%) para decisión automática
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-300 rounded p-3">
                    <p className="font-semibold text-red-900">⚠️ Requiere revisión humana</p>
                    <p className="text-sm text-red-800 mt-1">
                      Confianza baja ({simForm.confianza}% {'<'} 80%) - revisor debe evaluar
                    </p>
                  </div>
                )}
                <div className="mt-3 p-3 bg-background rounded border border-border">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">Explicación</p>
                  <p className="text-sm text-foreground">
                    El ciudadano puede apelar esta decisión en cualquier caso, con derecho a revisión humana dentro de 15 días hábiles.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSimulation} className="flex-1">
                  Ejecutar Simulación
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSimulationOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Decisiones Simuladas Anteriores */}
        {data.decisionSimulations.length > 0 && (
          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-4">Simulaciones Anteriores</h3>
            <div className="space-y-4">
              {data.decisionSimulations.map((sim) => (
                <div key={sim.id} className="p-4 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{sim.ciudadano}</p>
                      <p className="text-sm text-muted-foreground">{sim.beneficio}</p>
                    </div>
                    <StateBadge state={sim.resultadoIA} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Confianza</p>
                      <p className="font-semibold text-foreground">{sim.confianza}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revisión Humana</p>
                      <p className="font-semibold text-foreground">
                        {sim.requiereRevision ? 'Sí' : 'No'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {sim.explicacion}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recomendaciones */}
        <Card className="p-6 bg-blue-50 border-l-4 border-l-blue-500">
          <h3 className="font-bold text-foreground mb-3">Recomendaciones para Validación IA</h3>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Bloquear uso de modelos caja negra en decisiones de subsidios hasta implementar explicabilidad
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Auditoría mensual de sesgos en cada modelo activo
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Todos los rechazos deben incluir explicación legible para ciudadanos
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Implementar threshold mínimo de confianza (85%) para subsidios de alto impacto
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
