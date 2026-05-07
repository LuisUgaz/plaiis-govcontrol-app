import { GovControlData } from './data-simulator';

export function generateHTMLReport(data: GovControlData): string {
  const getCurrentDate = () => new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const generateRiskMatrixChart = () => {
    const probabilityMap = { baja: 1, media: 2, alta: 3 };
    const impactMap = { bajo: 1, medio: 2, alto: 3 };
    
    const chartData = data.risks.map(risk => ({
      x: impactMap[risk.impacto as keyof typeof impactMap] || 1,
      y: probabilityMap[risk.probabilidad as keyof typeof probabilityMap] || 1,
      name: risk.riesgo,
      nivel: risk.nivel,
    }));

    const svgWidth = 600;
    const svgHeight = 400;
    const margin = 60;
    const plotWidth = svgWidth - margin * 2;
    const plotHeight = svgHeight - margin * 2;

    let svg = `<svg width="100%" height="400" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Fondo
    svg += `<rect width="${svgWidth}" height="${svgHeight}" fill="white"/>`;
    
    // Grid
    svg += `<g stroke="#e5e7eb" stroke-width="1">`;
    for (let i = 0; i <= 3; i++) {
      const x = margin + (plotWidth / 3) * i;
      const y = margin + (plotHeight / 3) * i;
      svg += `<line x1="${x}" y1="${margin}" x2="${x}" y2="${svgHeight - margin}" />`;
      svg += `<line x1="${margin}" y1="${y}" x2="${svgWidth - margin}" y2="${y}" />`;
    }
    svg += `</g>`;
    
    // Ejes
    svg += `<line x1="${margin}" y1="${svgHeight - margin}" x2="${svgWidth - margin}" y2="${svgHeight - margin}" stroke="black" stroke-width="2"/>`;
    svg += `<line x1="${margin}" y1="${margin}" x2="${margin}" y2="${svgHeight - margin}" stroke="black" stroke-width="2"/>`;
    
    // Etiquetas ejes
    svg += `<text x="${svgWidth - margin + 10}" y="${svgHeight - margin + 5}" font-size="12" fill="black">Impacto</text>`;
    svg += `<text x="${margin - 40}" y="${margin - 10}" font-size="12" fill="black">Probabilidad</text>`;
    
    // Zonas de riesgo (rectángulos de fondo)
    const zoneColors = [
      { x: 0, y: 0, color: '#dcfce7', label: 'Bajo' },
      { x: 1, y: 0, color: '#fef3c7', label: 'Medio' },
      { x: 2, y: 0, color: '#fed7aa', label: 'Alto' },
      { x: 2, y: 2, color: '#fee2e2', label: 'Crítico' },
    ];

    zoneColors.forEach(zone => {
      const x = margin + (plotWidth / 3) * zone.x;
      const y = svgHeight - margin - (plotHeight / 3) * (zone.y + 1);
      svg += `<rect x="${x}" y="${y}" width="${plotWidth / 3}" height="${plotHeight / 3}" fill="${zone.color}" opacity="0.3"/>`;
    });
    
    // Plotear riesgos
    chartData.forEach(risk => {
      const x = margin + (plotWidth / 3) * risk.x - 3;
      const y = svgHeight - margin - (plotHeight / 3) * risk.y - 3;
      
      const color = risk.nivel === 'critico' ? '#dc2626' : 
                   risk.nivel === 'alto' ? '#ea580c' : 
                   risk.nivel === 'medio' ? '#d97706' : '#16a34a';
      
      svg += `<circle cx="${x + 6}" cy="${y + 6}" r="6" fill="${color}" stroke="white" stroke-width="2"/>`;
      svg += `<title>${risk.name} (${risk.nivel})</title>`;
    });
    
    svg += `</svg>`;
    return svg;
  };

  const getRiskLevelColor = (nivel: string) => {
    switch(nivel) {
      case 'critico': return '#dc2626';
      case 'alto': return '#ea580c';
      case 'medio': return '#d97706';
      case 'bajo': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getStateColor = (state: string) => {
    switch(state) {
      case 'abierta': return '#ef4444';
      case 'en_revision': return '#f97316';
      case 'resuelta': return '#22c55e';
      case 'archivada': return '#9ca3af';
      default: return '#6b7280';
    }
  };

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PLAIIS GovControl - Reporte de Gobernanza</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f9fafb;
            padding: 40px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        header {
            border-bottom: 3px solid #ef4444;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        h1 {
            font-size: 32px;
            color: #1f2937;
            margin-bottom: 5px;
        }
        
        .subtitle {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 15px;
        }
        
        .report-meta {
            display: flex;
            gap: 30px;
            font-size: 14px;
            color: #6b7280;
            margin-top: 10px;
        }
        
        h2 {
            font-size: 24px;
            color: #1f2937;
            margin-top: 40px;
            margin-bottom: 20px;
            border-left: 4px solid #ef4444;
            padding-left: 15px;
        }
        
        h3 {
            font-size: 18px;
            color: #374151;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        
        .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
        }
        
        th {
            background-color: #f3f4f6;
            color: #1f2937;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #e5e7eb;
        }
        
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        tr:nth-child(even) {
            background-color: #f9fafb;
        }
        
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 12px;
            color: white;
        }
        
        .badge-critico { background-color: #dc2626; }
        .badge-alto { background-color: #ea580c; }
        .badge-medio { background-color: #d97706; }
        .badge-bajo { background-color: #16a34a; }
        
        .badge-abierta { background-color: #ef4444; }
        .badge-en_revision { background-color: #f97316; }
        .badge-resuelta { background-color: #22c55e; }
        .badge-archivada { background-color: #9ca3af; }
        
        .stat-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 15px;
            margin: 10px 0;
            display: inline-block;
            min-width: 200px;
        }
        
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #ef4444;
        }
        
        .stat-label {
            font-size: 13px;
            color: #6b7280;
            margin-top: 5px;
        }
        
        .chart-container {
            text-align: center;
            margin: 30px 0;
            page-break-inside: avoid;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .card {
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 15px;
            background-color: #f9fafb;
        }
        
        .alert {
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        
        .alert-warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            color: #92400e;
        }
        
        .alert-danger {
            background-color: #fee2e2;
            border-left: 4px solid #ef4444;
            color: #7f1d1d;
        }
        
        .alert-success {
            background-color: #dcfce7;
            border-left: 4px solid #22c55e;
            color: #15803d;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
        }
        
        @media print {
            body {
                padding: 0;
            }
            .container {
                box-shadow: none;
                padding: 0;
            }
            h2 {
                page-break-before: avoid;
                page-break-after: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>PLAIIS GovControl</h1>
            <p class="subtitle">Panel Operativo de Gobernanza Institucional</p>
            <div class="report-meta">
                <span><strong>Fecha de Reporte:</strong> ${getCurrentDate()}</span>
                <span><strong>Versión:</strong> 1.0</span>
            </div>
        </header>

        <!-- DASHBOARD DE DECISIÓN -->
        <div class="section">
            <h2>1. Dashboard de Decisión</h2>
            
            <h3>Recomendación General</h3>
            <div class="grid">
                <div class="stat-box">
                    <div class="stat-value" style="color: ${data.projectStatus === 'apto_lanzamiento' ? '#22c55e' : data.projectStatus === 'apto_piloto' ? '#f97316' : '#dc2626'}">
                        ${data.projectStatus === 'apto_lanzamiento' ? '✓ APTO' : data.projectStatus === 'apto_piloto' ? '⚠ PILOTO' : '✗ NO APTO'}
                    </div>
                    <div class="stat-label">${data.projectStatus === 'apto_lanzamiento' ? 'Lanzamiento' : data.projectStatus === 'apto_piloto' ? 'Piloto Controlado' : 'Lanzamiento'}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.isBlocked ? '🔒 BLOQUEADO' : '🔓 DESBLOQUEADO'}</div>
                    <div class="stat-label">Estado de Lanzamiento</div>
                </div>
            </div>
        </div>

        <!-- RIESGO BIOMÉTRICO -->
        <div class="section">
            <h2>2. Riesgo Biométrico</h2>
            
            <h3>Resumen de Registros Biométricos</h3>
            <div class="grid">
                <div class="stat-box">
                    <div class="stat-value">${data.biometricData.length}</div>
                    <div class="stat-label">Total Registros</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.biometricData.filter(b => b.resultado === 'exitoso').length}</div>
                    <div class="stat-label">Exitosos</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.biometricData.filter(b => b.zona === 'altoandina').length}</div>
                    <div class="stat-label">Zona Altoandina</div>
                </div>
            </div>

            <h3>Tabla de Registros</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Zona</th>
                        <th>Idioma</th>
                        <th>Confianza</th>
                        <th>Resultado</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.biometricData.slice(0, 10).map((b: any) => `
                        <tr>
                            <td>${b.nombre}</td>
                            <td>${b.zona}</td>
                            <td>${b.idioma}</td>
                            <td>${b.confianza}%</td>
                            <td><span class="badge badge-${b.riesgo}">${b.resultado === 'exitoso' ? '✓ Exitoso' : '✗ Fallido'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- VALIDACIÓN DE IA -->
        <div class="section">
            <h2>3. Validación de IA</h2>
            
            <h3>Modelos Registrados</h3>
            <table>
                <thead>
                    <tr>
                        <th>Modelo</th>
                        <th>Tipo</th>
                        <th>Auditable</th>
                        <th>Estado</th>
                        <th>Responsable</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.aiModels.map((m: any) => `
                        <tr>
                            <td>${m.nombre}</td>
                            <td><span class="badge" style="background-color: ${m.tipo === 'caja_blanca' ? '#16a34a' : '#dc2626'}">${m.tipo === 'caja_blanca' ? 'Blanca' : 'Negra'}</span></td>
                            <td>${m.auditable ? '✓ Sí' : '✗ No'}</td>
                            <td><span class="badge" style="background-color: ${m.estado === 'activo' ? '#16a34a' : m.estado === 'bloqueado' ? '#dc2626' : '#f97316'}">${m.estado}</span></td>
                            <td>${m.responsable}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- INTEROPERABILIDAD -->
        <div class="section">
            <h2>4. Interoperabilidad</h2>
            
            <h3>Entidades Conectadas</h3>
            <table>
                <thead>
                    <tr>
                        <th>Entidad</th>
                        <th>Tipo Conexión</th>
                        <th>Data Compartida</th>
                        <th>Seguridad</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.interoperability.map(e => `
                        <tr>
                            <td>${e.entity}</td>
                            <td>${e.connectionType}</td>
                            <td>${e.dataShared}</td>
                            <td><span class="badge" style="background-color: ${e.securityLevel === 'alto' ? '#16a34a' : e.securityLevel === 'medio' ? '#d97706' : '#dc2626'}">${e.securityLevel}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- APELACIONES CIUDADANAS -->
        <div class="section">
            <h2>5. Apelaciones Ciudadanas</h2>
            
            <h3>Resumen de Apelaciones</h3>
            <div class="grid">
                <div class="stat-box">
                    <div class="stat-value">${data.appeals.length}</div>
                    <div class="stat-label">Total Apelaciones</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.appeals.filter(a => a.estado === 'pendiente').length}</div>
                    <div class="stat-label">Pendientes</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.appeals.filter(a => a.estado === 'resuelta').length}</div>
                    <div class="stat-label">Resueltas</div>
                </div>
            </div>

            <h3>Últimas Apelaciones</h3>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Ciudadano</th>
                        <th>Beneficio</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.appeals.slice(0, 10).map(a => `
                        <tr>
                            <td>${a.codigo}</td>
                            <td>${a.ciudadano}</td>
                            <td>${a.beneficio}</td>
                            <td><span class="badge badge-${a.estado}">${a.estado.replace('_', ' ')}</span></td>
                            <td>${a.fecha}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- MATRIZ DE RIESGOS -->
        <div class="section">
            <h2>6. Matriz de Riesgos</h2>
            
            <h3>Visualización Probabilidad vs Impacto</h3>
            <div class="chart-container">
                ${generateRiskMatrixChart()}
            </div>

            <h3>Riesgos Identificados</h3>
            <table>
                <thead>
                    <tr>
                        <th>Riesgo</th>
                        <th>Probabilidad</th>
                        <th>Impacto</th>
                        <th>Nivel</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.risks.map(r => `
                        <tr>
                            <td>${r.riesgo}</td>
                            <td>${r.probabilidad}</td>
                            <td>${r.impacto}</td>
                            <td><span class="badge badge-${r.nivel}">${r.nivel}</span></td>
                            <td>${r.estado}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- SOSTENIBILIDAD -->
        <div class="section">
            <h2>7. Sostenibilidad</h2>
            
            <h3>Proyección Financiera Anual</h3>
            <div class="grid">
                <div class="stat-box">
                    <div class="stat-value">$${(data.costData.proyeccionAnual / 1000000).toFixed(1)}M</div>
                    <div class="stat-label">Presupuesto Anual</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">$${Math.round(data.costData.proyeccionAnual * 10 / 1000000)}M</div>
                    <div class="stat-label">Escalado (×10)</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.costData.finopsRecommendations.length}</div>
                    <div class="stat-label">Recomendaciones FinOps</div>
                </div>
            </div>

            <h3>Recomendaciones FinOps</h3>
            ${data.costData.finopsRecommendations.map(rec => `
                <div class="alert alert-warning">
                    <strong>${rec.area}</strong><br>
                    ${rec.recomendacion}
                </div>
            `).join('')}
        </div>

        <!-- COMITÉ DE GOBERNANZA -->
        <div class="section">
            <h2>8. Comité de Gobernanza</h2>
            
            <h3>Checklist de Aprobación</h3>
            <table>
                <thead>
                    <tr>
                        <th>Criterio</th>
                        <th>Estado</th>
                        <th>Responsable</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.governanceChecklist.map(c => `
                        <tr>
                            <td>${c.criterio}</td>
                            <td><span class="badge" style="background-color: ${c.cumplido ? '#22c55e' : '#ef4444'}">${c.cumplido ? '✓ Cumplido' : '✗ No Cumplido'}</span></td>
                            <td>${c.responsable}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <h3>Votación Final</h3>
            <div class="grid">
                <div class="stat-box">
                    <div class="stat-value">${data.finalVote.votosAFavor}</div>
                    <div class="stat-label">Votos a Favor</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.finalVote.votosEnContra}</div>
                    <div class="stat-label">Votos en Contra</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${data.finalVote.abstenidos}</div>
                    <div class="stat-label">Abstenciones</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Este es un reporte generado automáticamente por PLAIIS GovControl</p>
            <p>Para cambios en los datos, acceder al panel interactivo en línea</p>
        </div>
    </div>
</body>
</html>`;

  return html;
}

export function downloadHTMLReport(html: string, filename: string = 'PLAIIS-GovControl-Reporte.html') {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
