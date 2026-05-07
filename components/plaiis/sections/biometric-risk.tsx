'use client';

import { AlertCircle, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GovControlData } from '@/lib/plaiis/data-simulator';
import { StateBadge, RiskLevelBadge } from '../status-badges';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BiometricRiskProps {
  data: GovControlData;
  onUpdate: (data: GovControlData) => void;
}

export default function BiometricRisk({ data, onUpdate }: BiometricRiskProps) {
  const failedCount = data.biometricData.filter(b => b.resultado === 'fallido').length;
  const highRiskCount = data.biometricData.filter(b => b.riesgo === 'alto').length;
  const altoAndinaData = data.biometricData.filter(b => b.zona === 'altoandina');
  const lowConfidenceAltoAndina = altoAndinaData.filter(b => b.confianza < 90).length;

  // Datos para gráficos
  const resultadoData = [
    { name: 'Exitoso', value: data.biometricData.filter(b => b.resultado === 'exitoso').length },
    { name: 'Fallido', value: failedCount },
  ];

  const riesgoData = [
    { name: 'Bajo', value: data.biometricData.filter(b => b.riesgo === 'bajo').length },
    { name: 'Medio', value: data.biometricData.filter(b => b.riesgo === 'medio').length },
    { name: 'Alto', value: highRiskCount },
  ];

  const zonaData = [
    {
      zona: 'Altoandina',
      promConfianza: (
        altoAndinaData.reduce((sum, b) => sum + b.confianza, 0) / altoAndinaData.length || 0
      ).toFixed(1),
      cantidad: altoAndinaData.length,
    },
    {
      zona: 'Costa',
      promConfianza: (
        data.biometricData
          .filter(b => b.zona === 'costa')
          .reduce((sum, b) => sum + b.confianza, 0) / data.biometricData.filter(b => b.zona === 'costa').length || 0
      ).toFixed(1),
      cantidad: data.biometricData.filter(b => b.zona === 'costa').length,
    },
    {
      zona: 'Amazonía',
      promConfianza: (
        data.biometricData
          .filter(b => b.zona === 'amazonia')
          .reduce((sum, b) => sum + b.confianza, 0) / data.biometricData.filter(b => b.zona === 'amazonia').length || 0
      ).toFixed(1),
      cantidad: data.biometricData.filter(b => b.zona === 'amazonia').length,
    },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Alertas */}
        {lowConfidenceAltoAndina > 0 && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-red-900">Alerta: Zona Altoandina</p>
              <p className="text-sm text-red-800 mt-1">
                {lowConfidenceAltoAndina} ciudadano(s) con confianza {'<'} 90% detectados. Requieren revisión especial.
              </p>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">TOTAL REGISTROS</p>
            <p className="text-2xl font-bold text-foreground mt-2">{data.biometricData.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">TASA ÉXITO</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {((data.biometricData.filter(b => b.resultado === 'exitoso').length / data.biometricData.length) * 100).toFixed(1)}%
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">FALLOS</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{failedCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">RIESGO ALTO</p>
            <p className="text-2xl font-bold text-amber-600 mt-2">{highRiskCount}</p>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-4">Distribución de Resultados</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resultadoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-4">Niveles de Riesgo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riesgoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
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

          <Card className="p-6 md:col-span-2">
            <h3 className="font-bold text-foreground mb-4">Confianza por Zona Geográfica</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={zonaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zona" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="promConfianza" fill="#3b82f6" name="Promedio Confianza (%)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Tabla de Ciudadanos */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-4">Registro de Ciudadanos</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Nombre</th>
                  <th className="px-4 py-2 text-left font-semibold">Zona</th>
                  <th className="px-4 py-2 text-left font-semibold">Idioma</th>
                  <th className="px-4 py-2 text-left font-semibold">Resultado</th>
                  <th className="px-4 py-2 text-center font-semibold">Confianza</th>
                  <th className="px-4 py-2 text-left font-semibold">Riesgo</th>
                  <th className="px-4 py-2 text-left font-semibold">Beneficio</th>
                  <th className="px-4 py-2 text-center font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {data.biometricData.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-foreground">{record.nombre}</td>
                    <td className="px-4 py-3 text-muted-foreground">{record.zona.replace('amazonia', 'Amazonía').replace('altoandina', 'Altoandina').replace('costa', 'Costa')}</td>
                    <td className="px-4 py-3 text-muted-foreground">{record.idioma}</td>
                    <td className="px-4 py-3">
                      <StateBadge state={record.resultado} />
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{record.confianza}%</td>
                    <td className="px-4 py-3">
                      <RiskLevelBadge level={record.riesgo} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{record.beneficio}</td>
                    <td className="px-4 py-3 text-center">
                      {record.resultado === 'fallido' && (
                        <Button size="sm" variant="outline" className="gap-1 text-xs">
                          <Send size={12} />
                          Revisar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recomendaciones */}
        <Card className="p-6 bg-blue-50 border-l-4 border-l-blue-500">
          <h3 className="font-bold text-foreground mb-3">Recomendaciones para Riesgo Biométrico</h3>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Auditorías mensuales de sesgo en ciudadanos altoandinos y usuarios quechua/aymara
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Aumentar dataset de entrenamiento con {lowConfidenceAltoAndina}+ muestras de baja confianza
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Revisión humana obligatoria para confianza {'<'} 85% en zonas altoandinas
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              SLA de respuesta: máximo 5 días para apelaciones de falsos rechazos
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
