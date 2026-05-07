'use client';

import { Plus, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GovControlData } from '@/lib/plaiis/data-simulator';
import { StateBadge } from '../status-badges';
import { useState } from 'react';

interface CitizenAppealsProps {
  data: GovControlData;
  onUpdate: (data: GovControlData) => void;
}

export default function CitizenAppeals({ data, onUpdate }: CitizenAppealsProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    ciudadano: '',
    beneficio: '',
    motivo: '',
    idioma: 'español',
  });

  const pendingAppeals = data.appeals.filter(a => a.estado === 'pendiente').length;
  const resolvedAppeals = data.appeals.filter(a => a.estado === 'resuelto').length;

  const handleAddAppeal = () => {
    if (!form.ciudadano || !form.beneficio || !form.motivo) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const newAppeal = {
      id: (data.appeals.length + 1).toString(),
      codigo: `APL-2024-${String(data.appeals.length + 1).padStart(3, '0')}`,
      ciudadano: form.ciudadano,
      beneficio: form.beneficio,
      motivo: form.motivo,
      origen: 'otro' as const,
      estado: 'pendiente' as const,
      responsable: 'Asignación Pendiente',
      fecha: new Date().toISOString().split('T')[0],
      idioma: form.idioma,
    };

    const updatedData: GovControlData = {
      ...data,
      appeals: [...data.appeals, newAppeal],
    };

    onUpdate(updatedData);
    setFormOpen(false);
    setForm({ ciudadano: '', beneficio: '', motivo: '', idioma: 'español' });
    alert('Apelación registrada correctamente: ' + newAppeal.codigo);
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Alertas */}
        {pendingAppeals > 5 && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-amber-900">Alto Volumen de Apelaciones Pendientes</p>
              <p className="text-sm text-amber-800 mt-1">
                {pendingAppeals} apelaciones pendientes. Asegurar suficientes revisores.
              </p>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">TOTAL APELACIONES</p>
            <p className="text-2xl font-bold text-foreground mt-2">{data.appeals.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">PENDIENTES</p>
            <p className="text-2xl font-bold text-amber-600 mt-2">{pendingAppeals}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">EN REVISIÓN</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {data.appeals.filter(a => a.estado === 'en_revision').length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">RESUELTAS</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{resolvedAppeals}</p>
          </Card>
        </div>

        {/* Formulario Nueva Apelación */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Registrar Nueva Apelación</h3>
          </div>

          {!formOpen ? (
            <Button onClick={() => setFormOpen(true)} className="gap-2">
              <Plus size={16} />
              Nueva Apelación
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1">Nombre del Ciudadano</label>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={form.ciudadano}
                  onChange={(e) => setForm({ ...form, ciudadano: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-1">Beneficio</label>
                <select
                  value={form.beneficio}
                  onChange={(e) => setForm({ ...form, beneficio: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Selecciona un beneficio...</option>
                  <option value="Pensión 65">Pensión 65</option>
                  <option value="Bonificación Familiar">Bonificación Familiar</option>
                  <option value="Subsidio Escolar">Subsidio Escolar</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-1">Motivo de la Apelación</label>
                <textarea
                  placeholder="Describe el motivo..."
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-1">Idioma Preferido</label>
                <select
                  value={form.idioma}
                  onChange={(e) => setForm({ ...form, idioma: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="español">Español</option>
                  <option value="quechua">Quechua</option>
                  <option value="aymara">Aymara</option>
                </select>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAddAppeal} className="flex-1">
                  Registrar Apelación
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFormOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Tabla de Apelaciones */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-4">Registro de Apelaciones</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Código</th>
                  <th className="px-4 py-2 text-left font-semibold">Ciudadano</th>
                  <th className="px-4 py-2 text-left font-semibold">Beneficio</th>
                  <th className="px-4 py-2 text-left font-semibold">Motivo</th>
                  <th className="px-4 py-2 text-left font-semibold">Idioma</th>
                  <th className="px-4 py-2 text-left font-semibold">Estado</th>
                  <th className="px-4 py-2 text-left font-semibold">Responsable</th>
                  <th className="px-4 py-2 text-left font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {data.appeals.map((appeal) => (
                  <tr key={appeal.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-primary">{appeal.codigo}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{appeal.ciudadano}</td>
                    <td className="px-4 py-3 text-muted-foreground">{appeal.beneficio}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-xs truncate">
                      {appeal.motivo}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {appeal.idioma}
                    </td>
                    <td className="px-4 py-3">
                      <StateBadge state={appeal.estado} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{appeal.responsable}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{appeal.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recomendaciones */}
        <Card className="p-6 bg-blue-50 border-l-4 border-l-blue-500">
          <h3 className="font-bold text-foreground mb-3">Recomendaciones para Apelaciones</h3>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Establecer SLA: máximo 15 días hábiles para primera revisión
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Proporcionar explicaciones claras en español, quechua y aymara
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Revisor humano debe evaluar independientemente de decisión IA
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Registrar feedback de apelaciones resueltas para mejorar modelos
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Permitir apelación de segundo nivel ante comité independiente
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
