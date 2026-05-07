// Tipos de datos para PLAIIS GovControl
export interface BiometricRecord {
  id: string;
  nombre: string;
  zona: 'altoandina' | 'costa' | 'amazonia';
  idioma: 'español' | 'quechua' | 'aymara';
  resultado: 'exitoso' | 'fallido';
  confianza: number;
  beneficio: string;
  riesgo: 'alto' | 'medio' | 'bajo';
}

export interface AIModel {
  id: string;
  nombre: string;
  tipo: 'caja_blanca' | 'caja_negra';
  auditable: boolean;
  uso: string[];
  estado: 'activo' | 'bloqueado' | 'revisión';
  responsable: string;
  ultimaAuditoria: string;
}

export interface DecisionSimulation {
  id: string;
  ciudadano: string;
  beneficio: string;
  resultadoIA: string;
  confianza: number;
  explicacion: string;
  requiereRevision: boolean;
  permiteApelacion: boolean;
}

export interface ConnectedEntity {
  id: string;
  nombre: string;
  tipo: 'ministerio' | 'sistema_externo' | 'base_datos';
  tipoConexion: 'API' | 'scraping' | 'ETL';
  cargaServidor: number;
  estado: 'activo' | 'inactivo' | 'critico';
}

export interface Appeal {
  id: string;
  codigo: string;
  ciudadano: string;
  beneficio: string;
  motivo: string;
  origen: 'rechazo_ia' | 'confianza_baja' | 'otro';
  estado: 'pendiente' | 'en_revision' | 'resuelto';
  responsable: string;
  fecha: string;
  idioma: string;
}

export interface Risk {
  id: string;
  riesgo: string;
  probabilidad: 'baja' | 'media' | 'alta';
  impacto: 'bajo' | 'medio' | 'alto';
  nivel: 'bajo' | 'medio' | 'alto' | 'critico';
  responsable: string;
  respuesta: string;
  estado: 'identificado' | 'mitigando' | 'controlado';
}

export interface CostData {
  costoMensual: number;
  costosDesglose: {
    gpu: number;
    iaGenerativa: number;
    infraestructura: number;
  };
  proyeccionAnual: number;
  riesgoFinanciero: 'bajo' | 'medio' | 'alto';
}

export interface GovernanceDecision {
  id: string;
  decision: string;
  riesgosRevisados: number;
  comentarios: {
    oia: string;
    arquitecto: string;
    seguridad: string;
  };
  fecha: string;
}

export interface ApprovalCriteria {
  id: string;
  criterio: string;
  cumplido: boolean;
  evidencia: string;
}

export interface GovControlData {
  projectStatus: 'no_apto_lanzamiento' | 'apto_piloto' | 'apto_lanzamiento';
  recommendation: 'piloto_controlado' | 'esperar_mejoras' | 'lanzamiento_nacional';
  isBlocked: boolean;
  
  biometricData: BiometricRecord[];
  aiModels: AIModel[];
  decisionSimulations: DecisionSimulation[];
  connectedEntities: ConnectedEntity[];
  appeals: Appeal[];
  risks: Risk[];
  costData: CostData;
  governanceDecisions: GovernanceDecision[];
  approvalChecklist: ApprovalCriteria[];
}

// Función para generar datos iniciales simulados
export function generateInitialData(): GovControlData {
  const ciudadanos = [
    { id: '1', nombre: 'Juan García López', zona: 'altoandina', idioma: 'español' },
    { id: '2', nombre: 'María Quispe Condori', zona: 'altoandina', idioma: 'quechua' },
    { id: '3', nombre: 'Carlos Rojas Mendoza', zona: 'costa', idioma: 'español' },
    { id: '4', nombre: 'Rosa Mamani Amanqui', zona: 'amazonia', idioma: 'aymara' },
    { id: '5', nombre: 'Pedro Huamán Salcedo', zona: 'altoandina', idioma: 'quechua' },
  ];

  const beneficios = [
    'Pensión 65',
    'Bonificación Familiar',
    'Subsidio Escolar',
    'Cédula de Identidad',
    'Registro Laboral'
  ];

  const biometricData: BiometricRecord[] = [
    {
      id: '1',
      nombre: ciudadanos[0].nombre,
      zona: 'altoandina',
      idioma: 'español',
      resultado: 'exitoso',
      confianza: 92,
      beneficio: beneficios[0],
      riesgo: 'bajo',
    },
    {
      id: '2',
      nombre: ciudadanos[1].nombre,
      zona: 'altoandina',
      idioma: 'quechua',
      resultado: 'fallido',
      confianza: 67,
      beneficio: beneficios[0],
      riesgo: 'alto',
    },
    {
      id: '3',
      nombre: ciudadanos[2].nombre,
      zona: 'costa',
      idioma: 'español',
      resultado: 'exitoso',
      confianza: 88,
      beneficio: beneficios[1],
      riesgo: 'bajo',
    },
    {
      id: '4',
      nombre: ciudadanos[3].nombre,
      zona: 'amazonia',
      idioma: 'aymara',
      resultado: 'exitoso',
      confianza: 85,
      beneficio: beneficios[2],
      riesgo: 'bajo',
    },
    {
      id: '5',
      nombre: ciudadanos[4].nombre,
      zona: 'altoandina',
      idioma: 'quechua',
      resultado: 'exitoso',
      confianza: 78,
      beneficio: beneficios[3],
      riesgo: 'medio',
    },
  ];

  const aiModels: AIModel[] = [
    {
      id: '1',
      nombre: 'PLAIIS Face Matching v1',
      tipo: 'caja_blanca',
      auditable: true,
      uso: ['reconocimiento_facial', 'verificacion_identidad'],
      estado: 'activo',
      responsable: 'Equipo de IA',
      ultimaAuditoria: '2024-04-15',
    },
    {
      id: '2',
      nombre: 'Beneficiary Risk Scorer',
      tipo: 'caja_negra',
      auditable: false,
      uso: ['subsidios', 'bonificaciones'],
      estado: 'bloqueado',
      responsable: 'Equipo de Seguridad',
      ultimaAuditoria: '2024-03-01',
    },
    {
      id: '3',
      nombre: 'Document Classifier',
      tipo: 'caja_blanca',
      auditable: true,
      uso: ['verificacion_documentos'],
      estado: 'activo',
      responsable: 'Equipo de IA',
      ultimaAuditoria: '2024-04-20',
    },
  ];

  const decisionSimulations: DecisionSimulation[] = [
    {
      id: '1',
      ciudadano: ciudadanos[0].nombre,
      beneficio: beneficios[0],
      resultadoIA: 'Aprobado',
      confianza: 94,
      explicacion: 'Coincidencia biométrica exitosa, documentos validados',
      requiereRevision: false,
      permiteApelacion: true,
    },
    {
      id: '2',
      ciudadano: ciudadanos[1].nombre,
      beneficio: beneficios[0],
      resultadoIA: 'Rechazado',
      confianza: 68,
      explicacion: 'Confianza biométrica baja, requiere revisión humana',
      requiereRevision: true,
      permiteApelacion: true,
    },
  ];

  const connectedEntities: ConnectedEntity[] = [
    {
      id: '1',
      nombre: 'Ministerio de Salud',
      tipo: 'ministerio',
      tipoConexion: 'API',
      cargaServidor: 45,
      estado: 'activo',
    },
    {
      id: '2',
      nombre: 'RENIEC',
      tipo: 'sistema_externo',
      tipoConexion: 'API',
      cargaServidor: 72,
      estado: 'activo',
    },
    {
      id: '3',
      nombre: 'Sistema de Subsidios',
      tipo: 'base_datos',
      tipoConexion: 'ETL',
      cargaServidor: 38,
      estado: 'activo',
    },
    {
      id: '4',
      nombre: 'Portal Legacy',
      tipo: 'sistema_externo',
      tipoConexion: 'scraping',
      cargaServidor: 15,
      estado: 'inactivo',
    },
  ];

  const appeals: Appeal[] = [
    {
      id: '1',
      codigo: 'APL-2024-001',
      ciudadano: ciudadanos[1].nombre,
      beneficio: beneficios[0],
      motivo: 'Confianza biométrica baja',
      origen: 'confianza_baja',
      estado: 'en_revision',
      responsable: 'Revisor Humano A',
      fecha: '2024-04-25',
      idioma: 'quechua',
    },
  ];

  const risks: Risk[] = [
    {
      id: '1',
      riesgo: 'Sesgo en reconocimiento facial - Zonas altoandinas',
      probabilidad: 'alta',
      impacto: 'alto',
      nivel: 'critico',
      responsable: 'Equipo de IA',
      respuesta: 'Auditoría periódica de datasets, aumento de muestras',
      estado: 'mitigando',
    },
    {
      id: '2',
      riesgo: 'Baja confianza en ciudadanos con idiomas minoritarios',
      probabilidad: 'alta',
      impacto: 'alto',
      nivel: 'critico',
      responsable: 'Equipo de IA',
      respuesta: 'Reentrenamiento con datos multilingües',
      estado: 'mitigando',
    },
    {
      id: '3',
      riesgo: 'Conectividad de sistemas externos',
      probabilidad: 'media',
      impacto: 'medio',
      nivel: 'alto',
      responsable: 'Infraestructura',
      respuesta: 'Implementar redundancias, failover automático',
      estado: 'identificado',
    },
    {
      id: '4',
      riesgo: 'Modelos de IA caja negra en decisiones de subsidios',
      probabilidad: 'alta',
      impacto: 'alto',
      nivel: 'critico',
      responsable: 'Compliance',
      respuesta: 'Bloqueo de uso hasta implementar explicabilidad',
      estado: 'controlado',
    },
    {
      id: '5',
      riesgo: 'Seguridad de datos biométricos',
      probabilidad: 'baja',
      impacto: 'alto',
      nivel: 'alto',
      responsable: 'Seguridad',
      respuesta: 'Encriptación, auditoría de acceso, cumplimiento normativo',
      estado: 'controlado',
    },
    {
      id: '6',
      riesgo: 'Escalabilidad de infraestructura',
      probabilidad: 'media',
      impacto: 'medio',
      nivel: 'medio',
      responsable: 'DevOps',
      respuesta: 'Arquitectura auto-escalable, planificación de capacidad',
      estado: 'identificado',
    },
    {
      id: '7',
      riesgo: 'Gestión de apelaciones ciudadanas',
      probabilidad: 'media',
      impacto: 'medio',
      nivel: 'medio',
      responsable: 'Operaciones',
      respuesta: 'Sistema de apelaciones estructurado, SLAs definidos',
      estado: 'mitigando',
    },
    {
      id: '8',
      riesgo: 'Mantenibilidad de código y documentación',
      probabilidad: 'baja',
      impacto: 'medio',
      nivel: 'bajo',
      responsable: 'Arquitecto',
      respuesta: 'ADRs, documentación técnica, pruebas automatizadas',
      estado: 'controlado',
    },
    {
      id: '9',
      riesgo: 'Sostenibilidad financiera del proyecto',
      probabilidad: 'media',
      impacto: 'alto',
      nivel: 'alto',
      responsable: 'PMO',
      respuesta: 'Optimización de costos, FinOps, negociación de tarifas',
      estado: 'identificado',
    },
    {
      id: '10',
      riesgo: 'Adopción y aceptación institucional',
      probabilidad: 'media',
      impacto: 'medio',
      nivel: 'medio',
      responsable: 'Dirección',
      respuesta: 'Comunicación estratégica, capacitación, piloto controlado',
      estado: 'mitigando',
    },
  ];

  const costData: CostData = {
    costoMensual: 125000,
    costosDesglose: {
      gpu: 75000,
      iaGenerativa: 35000,
      infraestructura: 15000,
    },
    proyeccionAnual: 1500000,
    riesgoFinanciero: 'medio',
  };

  const governanceDecisions: GovernanceDecision[] = [
    {
      id: '1',
      decision: 'Aprobar entrada a fase de piloto controlado',
      riesgosRevisados: 10,
      comentarios: {
        oia: 'Requiere revisión periódica de sesgo cada 30 días',
        arquitecto: 'Arquitectura es escalable y resiliente',
        seguridad: 'Implementar encriptación en tránsito y reposo',
      },
      fecha: '2024-04-20',
    },
  ];

  const approvalChecklist: ApprovalCriteria[] = [
    {
      id: '1',
      criterio: 'Auditoría técnica completada',
      cumplido: true,
      evidencia: 'Informe técnico PLAIIS aprobado',
    },
    {
      id: '2',
      criterio: 'Riesgos identificados y mitigados',
      cumplido: true,
      evidencia: '10 riesgos identificados con respuestas definidas',
    },
    {
      id: '3',
      criterio: 'Sesgo en IA documentado y controlado',
      cumplido: false,
      evidencia: 'Pendiente: auditorías mensuales',
    },
    {
      id: '4',
      criterio: 'Interoperabilidad validada',
      cumplido: true,
      evidencia: 'Conexiones con ministerios verificadas',
    },
    {
      id: '5',
      criterio: 'Apelaciones ciudadanas implementadas',
      cumplido: true,
      evidencia: 'Sistema de apelaciones operativo',
    },
    {
      id: '6',
      criterio: 'Explicabilidad de decisiones',
      cumplido: false,
      evidencia: 'Pendiente: modelos caja blanca en todos los casos',
    },
    {
      id: '7',
      criterio: 'Sostenibilidad financiera',
      cumplido: true,
      evidencia: 'Presupuesto anual aprobado',
    },
    {
      id: '8',
      criterio: 'Gobernanza institucional',
      cumplido: true,
      evidencia: 'Comité de gobernanza establecido',
    },
  ];

  return {
    projectStatus: 'no_apto_lanzamiento',
    recommendation: 'piloto_controlado',
    isBlocked: false,
    biometricData,
    aiModels,
    decisionSimulations,
    connectedEntities,
    appeals,
    risks,
    costData,
    governanceDecisions,
    approvalChecklist,
  };
}
