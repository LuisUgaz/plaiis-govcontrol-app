'use client';

import { TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { GovControlData } from '@/lib/plaiis/data-simulator';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface SustainabilityProps {
  data: GovControlData;
  onUpdate: (data: GovControlData) => void;
}

export default function Sustainability({ data, onUpdate }: SustainabilityProps) {
  const monthlyProjection = Array.from({ length: 12 }, (_, i) => ({
    mes: `M${i + 1}`,
    costo: Math.round(data.costData.costoMensual * (0.95 + Math.random() * 0.1)),
  }));

  const desgloceData = [
    { name: 'GPU', value: data.costData.costosDesglose.gpu },
    { name: 'IA Generativa', value: data.costData.costosDesglose.iaGenerativa },
    { name: 'Infraestructura', value: data.costData.costosDesglose.infraestructura },
  ];

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

  const costRiskoLevel = 
    data.costData.costoMensual > 150000 ? 'alto' :
    data.costData.costoMensual > 100000 ? 'medio' :
    'bajo';

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Alertas */}
        {costRiskoLevel === 'alto' && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-red-900">Costo Mensual Elevado</p>
              <p className="text-sm text-red-800 mt-1">
                El gasto de ${(data.costData.costoMensual / 1000).toFixed(0)}K/mes puede no ser sostenible. Requiere optimización de infraestructura.
              </p>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">COSTO MENSUAL</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              ${(data.costData.costoMensual / 1000).toFixed(0)}K
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">PROYECCIÓN ANUAL</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              ${(data.costData.proyeccionAnual / 1000000).toFixed(1)}M
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">MAYOR COSTO</p>
            <p className="text-2xl font-bold text-foreground mt-2">GPU</p>
            <p className="text-xs text-muted-foreground mt-1">
              ${(data.costData.costosDesglose.gpu / 1000).toFixed(0)}K/mes
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">RIESGO FINANCIERO</p>
            <p className={`text-2xl font-bold mt-2 ${
              data.costData.riesgoFinanciero === 'alto' ? 'text-red-600' :
              data.costData.riesgoFinanciero === 'medio' ? 'text-amber-600' :
              'text-green-600'
            }`}>
              {data.costData.riesgoFinanciero.charAt(0).toUpperCase() + data.costData.riesgoFinanciero.slice(1)}
            </p>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-4">Desglose de Costos Mensuales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={desgloceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${(value / 1000).toFixed(0)}K`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color) => (
                    <Cell key={`cell-${color}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-4">Proyección 12 Meses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyProjection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `$${((value as number) / 1000).toFixed(0)}K`} />
                <Line
                  type="monotone"
                  dataKey="costo"
                  stroke="#3b82f6"
                  dot={false}
                  name="Costo Mensual"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recomendaciones FinOps */}
        <Card className="p-6 bg-blue-50 border-l-4 border-l-blue-500">
          <div className="flex items-start gap-3 mb-4">
            <TrendingUp className="text-blue-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-bold text-foreground">Estrategia FinOps - Optimización de Costos</h3>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 rounded bg-white">
              <p className="font-semibold text-foreground mb-1">1. Autoescalamiento GPU</p>
              <p className="text-sm text-foreground">
                Implementar escalado automático de GPUs según carga. Potencial ahorro: -20% en periodos de baja demanda.
              </p>
            </div>

            <div className="p-3 rounded bg-white">
              <p className="font-semibold text-foreground mb-1">2. Apagado de Recursos Nocturnos</p>
              <p className="text-sm text-foreground">
                Desactivar infraestructura no esencial fuera de horario laboral (20:00-06:00). Ahorro: -10%.
              </p>
            </div>

            <div className="p-3 rounded bg-white">
              <p className="font-semibold text-foreground mb-1">3. Optimización de Modelos IA</p>
              <p className="text-sm text-foreground">
                Reemplazar modelos caja negra pesados por versiones destiladas. Ahorro potencial: -15% en inferencia.
              </p>
            </div>

            <div className="p-3 rounded bg-white">
              <p className="font-semibold text-foreground mb-1">4. Caché y CDN</p>
              <p className="text-sm text-foreground">
                Implementar caché distribuido para reducir llamadas API a ministerios. Ahorro: -8%.
              </p>
            </div>

            <div className="p-3 rounded bg-white">
              <p className="font-semibold text-foreground mb-1">5. Negociación de Tarifas</p>
              <p className="text-sm text-foreground">
                Renegociar contratos con proveedores de infraestructura. Potencial: -5% a -12%.
              </p>
            </div>

            <div className="p-4 rounded bg-white border border-blue-300">
              <p className="font-bold text-blue-900 mb-2">Objetivo: ${(data.costData.costoMensual * 0.7 / 1000).toFixed(0)}K/mes (30% reducción)</p>
              <p className="text-xs text-blue-800">
                Con estas optimizaciones podría reducirse de ${(data.costData.costoMensual / 1000).toFixed(0)}K a ${(data.costData.costoMensual * 0.7 / 1000).toFixed(0)}K mensuales.
              </p>
            </div>
          </div>
        </Card>

        {/* Viabilidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-4">Viabilidad Piloto (6 meses)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-foreground font-medium">Presupuesto Piloto</span>
                <span className="font-bold text-foreground">${(data.costData.costoMensual * 6 / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-foreground font-medium">Costo por Ciudadano/mes</span>
                <span className="font-bold text-foreground">${(data.costData.costoMensual / 5000).toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-foreground font-medium">Viabilidad</span>
                <span className="font-bold text-green-600">✓ Viable</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-4">Viabilidad Lanzamiento Nacional</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-foreground font-medium">Presupuesto Anual</span>
                <span className="font-bold text-foreground">${(data.costData.proyeccionAnual / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-foreground font-medium">Escalado (×10 ciudadanos)</span>
                <span className="font-bold text-foreground">${Math.round(data.costData.proyeccionAnual * 10 / 1000000)}M</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-foreground font-medium">Con FinOps (-30%)</span>
                <span className="font-bold text-amber-600">Requiere presupuesto mayor</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
