'use client';

import { AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { GovControlData } from '@/lib/plaiis/data-simulator';
import { StateBadge, RiskLevelBadge } from '../status-badges';

interface InteroperabilityProps {
  data: GovControlData;
  onUpdate: (data: GovControlData) => void;
}

export default function Interoperability({ data, onUpdate }: InteroperabilityProps) {
  const criticalConnections = data.connectedEntities.filter(e => e.estado === 'critico');
  const highLoadEntities = data.connectedEntities.filter(e => e.cargaServidor > 80);
  const scrapingConnections = data.connectedEntities.filter(e => e.tipoConexion === 'scraping');

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Alertas */}
        {scrapingConnections.length > 0 && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-red-900">Conexiones por Scraping Detectadas</p>
              <p className="text-sm text-red-800 mt-1">
                {scrapingConnections.map(e => e.nombre).join(', ')} utilizan scraping. Esta práctica debe ser bloqueada - migrar a APIs oficiales.
              </p>
            </div>
          </div>
        )}

        {criticalConnections.length > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-amber-900">Conexiones en Estado Crítico</p>
              <p className="text-sm text-amber-800 mt-1">
                {criticalConnections.map(e => e.nombre).join(', ')} tienen problemas. Requieren atención urgente.
              </p>
            </div>
          </div>
        )}

        {highLoadEntities.length > 0 && (
          <div className="bg-orange-50 border border-orange-300 rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-orange-900">Carga de Servidor Elevada</p>
              <p className="text-sm text-orange-800 mt-1">
                {highLoadEntities.map(e => `${e.nombre} (${e.cargaServidor}%)`).join(', ')} tienen carga {'>'} 80%. Considerar balanceo de carga.
              </p>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">ENTIDADES CONECTADAS</p>
            <p className="text-2xl font-bold text-foreground mt-2">{data.connectedEntities.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">ACTIVAS</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {data.connectedEntities.filter(e => e.estado === 'activo').length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">PROBLEMAS</p>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {criticalConnections.length + scrapingConnections.length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground font-semibold">CARGA PROMEDIO</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {(data.connectedEntities.reduce((sum, e) => sum + e.cargaServidor, 0) / data.connectedEntities.length).toFixed(0)}%
            </p>
          </Card>
        </div>

        {/* Diagrama de Arquitectura */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-4">Arquitectura de Interoperabilidad</h3>
          <div className="bg-muted rounded-lg p-6 overflow-x-auto">
            <pre className="text-xs text-foreground font-mono whitespace-pre-wrap break-words">
{`
┌─────────────────────────────────────────────────────────────┐
│                    PLAIIS (Sistema Central)                 │
│  - Verificación biométrica                                  │
│  - Orquestación de decisiones                               │
│  - Gestión de apelaciones                                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │ API Gateway  │
                    │   (Routing)  │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐        ┌────▼────┐       ┌────▼────┐
   │  Capa de │        │  Logs &  │       │ Seguridad│
   │Interop   │        │ Audit    │       │  & Auth  │
   └────┬────┘        └────┬────┘       └────┬────┘
        │                  │                  │
   ┌────┴──────────────────┴──────────────────┴────┐
   │  Ministerios y Sistemas Externos              │
   │                                               │
   │  - RENIEC (APIs)                             │
   │  - Ministerio de Salud (APIs)                │
   │  - Sistema de Subsidios (ETL)                │
   │  - Portal Legacy (NO usar scraping)          │
   └────────────────────────────────────────────────┘
`}
            </pre>
          </div>
        </Card>

        {/* Tabla de Entidades Conectadas */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-4">Entidades Conectadas</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Entidad</th>
                  <th className="px-4 py-2 text-left font-semibold">Tipo</th>
                  <th className="px-4 py-2 text-left font-semibold">Tipo Conexión</th>
                  <th className="px-4 py-2 text-center font-semibold">Carga Servidor</th>
                  <th className="px-4 py-2 text-left font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.connectedEntities.map((entity) => (
                  <tr key={entity.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-foreground">{entity.nombre}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {entity.tipo.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        entity.tipoConexion === 'API'
                          ? 'bg-green-100 text-green-800'
                          : entity.tipoConexion === 'ETL'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {entity.tipoConexion}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              entity.cargaServidor > 80
                                ? 'bg-red-500'
                                : entity.cargaServidor > 50
                                ? 'bg-amber-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${entity.cargaServidor}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold">{entity.cargaServidor}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StateBadge state={entity.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recomendaciones */}
        <Card className="p-6 bg-blue-50 border-l-4 border-l-blue-500">
          <h3 className="font-bold text-foreground mb-3">Recomendaciones para Interoperabilidad</h3>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Eliminar conexiones por scraping - usar APIs autorizadas de ministerios
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Implementar balanceo de carga para entidades con carga {'>'}80%
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Establecer SLAs de disponibilidad (99.5% mínimo) para cada ministerio
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Monitoreo en tiempo real de latencia y pérdida de conexión
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-500">→</span>
              Pruebas mensuales de failover y recuperación ante caídas
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
