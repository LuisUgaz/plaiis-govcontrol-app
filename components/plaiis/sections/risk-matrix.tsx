'use client';

import { Card } from '@/components/ui/card';
import { GovControlData } from '@/lib/plaiis/data-simulator';
import { RiskLevelBadge, StateBadge } from '../status-badges';
import { useState } from 'react';
import { Edit2, Check } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RiskMatrixProps {
  data: GovControlData;
  onUpdate: (data: GovControlData) => void;
}

export default function RiskMatrix({ data, onUpdate }: RiskMatrixProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const startEdit = (risk: any) => {
    setEditingId(risk.id);
    setEditForm({ ...risk });
  };

  const saveEdit = () => {
    if (!editForm) return;
    const updatedRisks = data.risks.map(r => r.id === editForm.id ? editForm : r);
    onUpdate({ ...data, risks: updatedRisks });
    setEditingId(null);
    setEditForm(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const criticalRisks = data.risks.filter(r => r.nivel === 'critico');
  const highRisks = data.risks.filter(r => r.nivel === 'alto');
  const totalRisks = data.risks.length;

  // Mapeo para convertir texto a números
  const probabilityMap = { baja: 1, media: 2, alta: 3 };
  const impactMap = { bajo: 1, medio: 2, alto: 3 };

  // Datos para gráfico
  const chartData = data.risks.map(risk => ({
    x: impactMap[risk.impacto as keyof typeof impactMap] || 1,
    y: probabilityMap[risk.probabilidad as keyof typeof probabilityMap] || 1,
    name: risk.riesgo,
    nivel: risk.nivel,
    fill:
      risk.nivel === 'critico'
        ? '#dc2626'
        : risk.nivel === 'alto'
          ? '#ea580c'
          : risk.nivel === 'medio'
            ? '#d97706'
            : '#16a34a',
  }));

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">TOTAL RIESGOS</p>
            <p className="text-2xl font-bold text-foreground mt-2">{totalRisks}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">CRÍTICOS</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{criticalRisks.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">ALTOS</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">{highRisks.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">CONTROLADOS</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {data.risks.filter(r => r.estado === 'controlado').length}
            </p>
          </Card>
        </div>

        {/* Gráfico de Matriz de Riesgos */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-4">Visualización de Matriz de Riesgos (Probabilidad vs Impacto)</h3>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Impacto"
                  domain={[0, 3.5]}
                  label={{ value: 'Impacto →', position: 'bottom', offset: 20 }}
                  tickFormatter={(value) => {
                    const labels: Record<number, string> = { 1: 'Bajo', 2: 'Medio', 3: 'Alto' };
                    return labels[value] || '';
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Probabilidad"
                  domain={[0, 3.5]}
                  label={{ value: '← Probabilidad', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => {
                    const labels: Record<number, string> = { 1: 'Baja', 2: 'Media', 3: 'Alta' };
                    return labels[value] || '';
                  }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || !payload[0]) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border border-border rounded p-2 text-xs">
                        <p className="font-bold">{data.name}</p>
                        <p className="text-muted-foreground">Nivel: {data.nivel}</p>
                      </div>
                    );
                  }}
                />
                <Scatter name="Riesgos" data={chartData} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span>Críticos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-600 rounded"></div>
              <span>Altos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-600 rounded"></div>
              <span>Medios</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>Bajos</span>
            </div>
          </div>
        </Card>

        {/* Matriz de Riesgos */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-4">Matriz de Riesgos Identificados (Editable)</h3>
          <p className="text-sm text-muted-foreground mb-4">Haz clic en cualquier campo para editar (inline)</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Riesgo</th>
                  <th className="px-4 py-2 text-left font-semibold">Probabilidad</th>
                  <th className="px-4 py-2 text-left font-semibold">Impacto</th>
                  <th className="px-4 py-2 text-left font-semibold">Nivel</th>
                  <th className="px-4 py-2 text-left font-semibold">Responsable</th>
                  <th className="px-4 py-2 text-left font-semibold">Respuesta</th>
                  <th className="px-4 py-2 text-left font-semibold">Estado</th>
                  <th className="px-4 py-2 text-center font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {data.risks.map((risk) => (
                  <tr key={risk.id} className="border-b border-border hover:bg-muted/50">
                    {editingId === risk.id && editForm ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editForm.riesgo}
                            onChange={(e) => setEditForm({ ...editForm, riesgo: e.target.value })}
                            className="w-full px-2 py-1 border border-border rounded bg-background text-foreground text-xs"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={editForm.probabilidad}
                            onChange={(e) => setEditForm({ ...editForm, probabilidad: e.target.value })}
                            className="w-full px-2 py-1 border border-border rounded bg-background text-foreground text-xs"
                          >
                            <option value="baja">Baja</option>
                            <option value="media">Media</option>
                            <option value="alta">Alta</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={editForm.impacto}
                            onChange={(e) => setEditForm({ ...editForm, impacto: e.target.value })}
                            className="w-full px-2 py-1 border border-border rounded bg-background text-foreground text-xs"
                          >
                            <option value="bajo">Bajo</option>
                            <option value="medio">Medio</option>
                            <option value="alto">Alto</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={editForm.nivel}
                            onChange={(e) => setEditForm({ ...editForm, nivel: e.target.value })}
                            className="w-full px-2 py-1 border border-border rounded bg-background text-foreground text-xs"
                          >
                            <option value="bajo">Bajo</option>
                            <option value="medio">Medio</option>
                            <option value="alto">Alto</option>
                            <option value="critico">Crítico</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editForm.responsable}
                            onChange={(e) => setEditForm({ ...editForm, responsable: e.target.value })}
                            className="w-full px-2 py-1 border border-border rounded bg-background text-foreground text-xs"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editForm.respuesta}
                            onChange={(e) => setEditForm({ ...editForm, respuesta: e.target.value })}
                            className="w-full px-2 py-1 border border-border rounded bg-background text-foreground text-xs"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={editForm.estado}
                            onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}
                            className="w-full px-2 py-1 border border-border rounded bg-background text-foreground text-xs"
                          >
                            <option value="identificado">Identificado</option>
                            <option value="mitigando">Mitigando</option>
                            <option value="controlado">Controlado</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={saveEdit}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                          >
                            <Check size={14} />
                            Guardar
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-medium text-foreground text-xs max-w-xs truncate">
                          {risk.riesgo}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground capitalize">
                          {risk.probabilidad}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground capitalize">
                          {risk.impacto}
                        </td>
                        <td className="px-4 py-3">
                          <RiskLevelBadge level={risk.nivel} />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {risk.responsable}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs max-w-xs truncate">
                          {risk.respuesta}
                        </td>
                        <td className="px-4 py-3">
                          <StateBadge state={risk.estado} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => startEdit(risk)}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted"
                          >
                            <Edit2 size={14} />
                            Editar
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Resumen por Nivel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-red-50 border-l-4 border-l-red-500">
            <p className="text-xs text-muted-foreground font-semibold">CRÍTICOS</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{criticalRisks.length}</p>
            <p className="text-xs text-muted-foreground mt-2">Requieren acción inmediata</p>
          </Card>

          <Card className="p-6 bg-orange-50 border-l-4 border-l-orange-500">
            <p className="text-xs text-muted-foreground font-semibold">ALTOS</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">{highRisks.length}</p>
            <p className="text-xs text-muted-foreground mt-2">En mitigación</p>
          </Card>

          <Card className="p-6 bg-amber-50 border-l-4 border-l-amber-500">
            <p className="text-xs text-muted-foreground font-semibold">MEDIOS</p>
            <p className="text-2xl font-bold text-amber-600 mt-2">
              {data.risks.filter(r => r.nivel === 'medio').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Bajo control</p>
          </Card>

          <Card className="p-6 bg-green-50 border-l-4 border-l-green-500">
            <p className="text-xs text-muted-foreground font-semibold">BAJOS</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {data.risks.filter(r => r.nivel === 'bajo').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Controlados</p>
          </Card>
        </div>

        {/* Recomendaciones */}
        <Card className="p-6 bg-blue-50 border-l-4 border-l-blue-500">
          <h3 className="font-bold text-foreground mb-3">Recomendaciones para Gestión de Riesgos</h3>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Revisar matriz mensualmente y actualizar estado de mitigación
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Riesgos críticos requieren comité semanal hasta alcanzar "controlado"
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Documentar todas las decisiones de mitigación en ADRs
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Incluir matriz actualizada en reportes mensuales de gobernanza
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
