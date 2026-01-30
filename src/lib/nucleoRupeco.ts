/**
 * Definición del Núcleo Documental RUPECO
 * Basado en:
 * - Resolución ENACOM N° 3731/2019 (RUPECO - Registro Único de Personas de Comunicaciones)
 * - Decreto N° 971/2024 (Reglamento General del Silencio Administrativo Positivo - PEHAR)
 * - Ley N° 27.078 (Argentina Digital)
 * - Ley N° 26.522 (Servicios de Comunicación Audiovisual)
 * - Decreto N° 1759/72 T.O. 2017 (Reglamento de Procedimientos Administrativos)
 */

export interface DocumentoRequerido {
  id: string;
  nombre: string;
  descripcion: string;
  obligatorio: boolean;
  aplicaA: ('humana' | 'juridica')[];
  normativa: string;
  articuloEspecifico?: string;
}

export interface BloqueDocumental {
  id: string;
  nombre: string;
  descripcion: string;
  documentos: DocumentoRequerido[];
}

// Núcleo Documental Común según Res. ENACOM 3731/2019
export const NUCLEO_RUPECO: BloqueDocumental[] = [
  {
    id: 'identificacion',
    nombre: 'Identificación del Responsable',
    descripcion: 'Datos de identificación del titular del trámite - Art. 3° y 4° Res. ENACOM 3731/2019',
    documentos: [
      {
        id: 'tipo_persona',
        nombre: 'Declaración de tipo de persona',
        descripcion: 'Persona humana o jurídica',
        obligatorio: true,
        aplicaA: ['humana', 'juridica'],
        normativa: 'Res. ENACOM N° 3731/2019',
        articuloEspecifico: 'Art. 3° - Sujetos obligados a inscripción',
      },
      {
        id: 'dni_titular',
        nombre: 'DNI del titular',
        descripcion: 'Documento Nacional de Identidad vigente (ambas caras)',
        obligatorio: true,
        aplicaA: ['humana'],
        normativa: 'Res. ENACOM N° 3731/2019',
        articuloEspecifico: 'Art. 4° inc. a) - Documentación acreditante de identidad',
      },
      {
        id: 'cuit_cuil',
        nombre: 'Constancia de CUIT/CUIL',
        descripcion: 'Constancia de inscripción AFIP vigente',
        obligatorio: true,
        aplicaA: ['humana', 'juridica'],
        normativa: 'Res. ENACOM N° 3731/2019',
        articuloEspecifico: 'Art. 4° inc. b) - Clave Única de Identificación Tributaria',
      },
      {
        id: 'estatuto_contrato',
        nombre: 'Estatuto o Contrato Social',
        descripcion: 'Instrumento constitutivo con última modificación inscripta',
        obligatorio: true,
        aplicaA: ['juridica'],
        normativa: 'Res. ENACOM N° 3731/2019',
        articuloEspecifico: 'Art. 5° inc. a) - Instrumento constitutivo de persona jurídica',
      },
      {
        id: 'acta_autoridades',
        nombre: 'Acta de designación de autoridades vigentes',
        descripcion: 'Acta de asamblea/directorio con autoridades actuales',
        obligatorio: true,
        aplicaA: ['juridica'],
        normativa: 'Res. ENACOM N° 3731/2019',
        articuloEspecifico: 'Art. 5° inc. b) - Acta de designación de representantes',
      },
    ],
  },
  {
    id: 'domicilios',
    nombre: 'Domicilios y Contacto',
    descripcion: 'Información de localización y contacto - Art. 6° Res. ENACOM 3731/2019',
    documentos: [
      {
        id: 'domicilio_legal',
        nombre: 'Constitución de domicilio legal',
        descripcion: 'Domicilio legal/real constituido en jurisdicción ENACOM',
        obligatorio: true,
        aplicaA: ['humana', 'juridica'],
        normativa: 'Res. ENACOM N° 3731/2019',
        articuloEspecifico: 'Art. 6° inc. a) - Domicilio legal constituido',
      },
      {
        id: 'domicilio_servicios',
        nombre: 'Domicilio de prestación de servicios',
        descripcion: 'Ubicación donde se prestan efectivamente los servicios',
        obligatorio: false,
        aplicaA: ['humana', 'juridica'],
        normativa: 'Ley N° 27.078 (Argentina Digital)',
        articuloEspecifico: 'Art. 8° - Área de prestación del servicio',
      },
      {
        id: 'telefono_contacto',
        nombre: 'Teléfono de contacto',
        descripcion: 'Número telefónico de contacto actualizado',
        obligatorio: true,
        aplicaA: ['humana', 'juridica'],
        normativa: 'Res. ENACOM N° 3731/2019',
        articuloEspecifico: 'Art. 6° inc. b) - Datos de contacto',
      },
      {
        id: 'email_contacto',
        nombre: 'Correo electrónico',
        descripcion: 'Dirección de correo electrónico válida para notificaciones',
        obligatorio: true,
        aplicaA: ['humana', 'juridica'],
        normativa: 'Res. ENACOM N° 3731/2019',
        articuloEspecifico: 'Art. 6° inc. c) - Correo electrónico para notificaciones',
      },
    ],
  },
  {
    id: 'representacion',
    nombre: 'Representación',
    descripcion: 'Datos del representante si no actúa el titular - Art. 7° Res. ENACOM 3731/2019',
    documentos: [
      {
        id: 'poder_representacion',
        nombre: 'Poder de representación',
        descripcion: 'Instrumento que acredita la representación (poder especial o general)',
        obligatorio: false,
        aplicaA: ['humana', 'juridica'],
        normativa: 'Res. ENACOM N° 3731/2019',
        articuloEspecifico: 'Art. 7° inc. a) - Acreditación de personería',
      },
      {
        id: 'dni_representante',
        nombre: 'DNI del representante',
        descripcion: 'Documento del apoderado/representante',
        obligatorio: false,
        aplicaA: ['humana', 'juridica'],
        normativa: 'Res. ENACOM N° 3731/2019',
        articuloEspecifico: 'Art. 7° inc. b) - Identificación del representante',
      },
    ],
  },
  {
    id: 'societarios',
    nombre: 'Datos Societarios',
    descripcion: 'Información societaria para personas jurídicas - Art. 5° Res. ENACOM 3731/2019',
    documentos: [
      {
        id: 'inscripcion_igj',
        nombre: 'Inscripción IGJ/Registro Público',
        descripcion: 'Constancia de inscripción registral (IGJ, DPPJ provincial)',
        obligatorio: true,
        aplicaA: ['juridica'],
        normativa: 'Res. ENACOM N° 3731/2019',
        articuloEspecifico: 'Art. 5° inc. c) - Inscripción en registro público',
      },
      {
        id: 'certificado_vigencia',
        nombre: 'Certificado de vigencia',
        descripcion: 'Certificado de vigencia de la sociedad (no mayor a 30 días)',
        obligatorio: false,
        aplicaA: ['juridica'],
        normativa: 'Res. ENACOM N° 3731/2019',
        articuloEspecifico: 'Art. 5° inc. d) - Constancia de vigencia societaria',
      },
    ],
  },
  {
    id: 'fiscales',
    nombre: 'Obligaciones Fiscales y Previsionales',
    descripcion: 'Cumplimiento de obligaciones tributarias - Decreto 971/2024 y Ley 27.078',
    documentos: [
      {
        id: 'constancia_afip',
        nombre: 'Constancia de inscripción AFIP',
        descripcion: 'Constancia de inscripción vigente en AFIP',
        obligatorio: true,
        aplicaA: ['humana', 'juridica'],
        normativa: 'Ley N° 27.078 (Argentina Digital)',
        articuloEspecifico: 'Art. 12° - Requisitos fiscales para licenciatarios',
      },
      {
        id: 'libre_deuda_afip',
        nombre: 'Libre deuda AFIP',
        descripcion: 'Certificado de cumplimiento fiscal o plan de facilidades',
        obligatorio: false,
        aplicaA: ['humana', 'juridica'],
        normativa: 'Decreto N° 971/2024',
        articuloEspecifico: 'Anexo II - Requisitos complementarios PEHAR',
      },
      {
        id: 'constancia_iibb',
        nombre: 'Constancia Ingresos Brutos',
        descripcion: 'Inscripción en IIBB provincial o convenio multilateral',
        obligatorio: false,
        aplicaA: ['humana', 'juridica'],
        normativa: 'Ley N° 27.078 (Argentina Digital)',
        articuloEspecifico: 'Art. 12° - Cumplimiento tributario provincial',
      },
    ],
  },
];

// Requisitos específicos por tipo de trámite (Tabla 1 del documento)
export interface TramiteENAC {
  codigo: string;
  nombre: string;
  categoria: 'TIC' | 'audiovisual' | 'postal' | 'rupeco';
  normativa: string;
  documentosObligatorios: number;
  overlapRupeco: number; // Porcentaje de coincidencia con RUPECO
  documentosAdicionales: DocumentoRequerido[];
  plazoSilencioPositivo: number; // días
}

export const TRAMITES_ENAC: TramiteENAC[] = [
  {
    codigo: 'ENAC00062',
    nombre: 'Licencia TIC - Alta nueva',
    categoria: 'TIC',
    normativa: 'Ley 27.078, Res. ENACOM 3731/2019 (RUPECO)',
    documentosObligatorios: 12,
    overlapRupeco: 75,
    plazoSilencioPositivo: 60,
    documentosAdicionales: [
      {
        id: 'plan_tecnico',
        nombre: 'Plan Técnico de Red',
        descripcion: 'Descripción técnica de la infraestructura',
        obligatorio: true,
        aplicaA: ['humana', 'juridica'],
        normativa: 'Ley 27.078 - Consultar normativa específica en www.enacom.gob.ar/tramites',
      },
      {
        id: 'factibilidad_economica',
        nombre: 'Estudio de factibilidad económica',
        descripcion: 'Análisis de viabilidad del proyecto',
        obligatorio: true,
        aplicaA: ['juridica'],
        normativa: 'Ley 27.078 - Consultar normativa específica en www.enacom.gob.ar/tramites',
      },
      {
        id: 'tasa_administrativa',
        nombre: 'Comprobante de pago de tasa',
        descripcion: 'Pago de tasa administrativa',
        obligatorio: true,
        aplicaA: ['humana', 'juridica'],
        normativa: 'Ley 27.078 - Consultar normativa específica en www.enacom.gob.ar/tramites',
      },
    ],
  },
  {
    codigo: 'ENAC00063',
    nombre: 'Licencia TIC - Modificación',
    categoria: 'TIC',
    normativa: 'Ley 27.078, Res. ENACOM 3731/19',
    documentosObligatorios: 8,
    overlapRupeco: 88,
    plazoSilencioPositivo: 60,
    documentosAdicionales: [
      {
        id: 'justificacion_modificacion',
        nombre: 'Nota justificando la modificación',
        descripcion: 'Fundamentación del cambio solicitado',
        obligatorio: true,
        aplicaA: ['humana', 'juridica'],
        normativa: 'Res. ENACOM 3731/19, Art. 12',
      },
    ],
  },
  {
    codigo: 'ENAC00025',
    nombre: 'Autorización Audiovisual',
    categoria: 'audiovisual',
    normativa: 'Ley 26.522, DNU 267/15',
    documentosObligatorios: 14,
    overlapRupeco: 71,
    plazoSilencioPositivo: 90,
    documentosAdicionales: [
      {
        id: 'grilla_programacion',
        nombre: 'Grilla de programación',
        descripcion: 'Propuesta de programación',
        obligatorio: true,
        aplicaA: ['juridica'],
        normativa: 'Ley 26.522, Art. 25',
      },
      {
        id: 'declaracion_programacion',
        nombre: 'Declaración jurada de programación',
        descripcion: 'Compromiso de contenidos',
        obligatorio: true,
        aplicaA: ['juridica'],
        normativa: 'Ley 26.522, Art. 25',
      },
      {
        id: 'estudio_tecnico_audiovisual',
        nombre: 'Estudio técnico de cobertura',
        descripcion: 'Análisis de área de cobertura',
        obligatorio: true,
        aplicaA: ['juridica'],
        normativa: 'DNU 267/15, Art. 8',
      },
    ],
  },
  {
    codigo: 'ENAC00013',
    nombre: 'Habilitación Servicio Postal',
    categoria: 'postal',
    normativa: 'Ley 20.216, Decreto 1187/93',
    documentosObligatorios: 11,
    overlapRupeco: 82,
    plazoSilencioPositivo: 60,
    documentosAdicionales: [
      {
        id: 'seguro_rc',
        nombre: 'Seguro de responsabilidad civil',
        descripcion: 'Póliza de seguro vigente',
        obligatorio: true,
        aplicaA: ['humana', 'juridica'],
        normativa: 'Decreto 1187/93, Art. 15',
      },
      {
        id: 'detalle_sucursales',
        nombre: 'Detalle de sucursales',
        descripcion: 'Listado de puntos de atención',
        obligatorio: true,
        aplicaA: ['juridica'],
        normativa: 'Decreto 1187/93, Art. 18',
      },
    ],
  },
  {
    codigo: 'ENAC00078',
    nombre: 'Inscripción RUPECO',
    categoria: 'rupeco',
    normativa: 'Res. ENACOM 3731/19',
    documentosObligatorios: 9,
    overlapRupeco: 100,
    plazoSilencioPositivo: 30,
    documentosAdicionales: [],
  },
];

// Función para obtener documentos requeridos según tipo de persona y trámite
export function getDocumentosRequeridos(
  tipoPersona: 'humana' | 'juridica',
  codigoTramite?: string
): { rupeco: DocumentoRequerido[]; adicionales: DocumentoRequerido[] } {
  const docsRupeco: DocumentoRequerido[] = [];
  
  NUCLEO_RUPECO.forEach(bloque => {
    bloque.documentos.forEach(doc => {
      if (doc.aplicaA.includes(tipoPersona) && doc.obligatorio) {
        docsRupeco.push(doc);
      }
    });
  });

  let docsAdicionales: DocumentoRequerido[] = [];
  
  if (codigoTramite) {
    const tramite = TRAMITES_ENAC.find(t => t.codigo === codigoTramite);
    if (tramite) {
      docsAdicionales = tramite.documentosAdicionales.filter(
        doc => doc.aplicaA.includes(tipoPersona) && doc.obligatorio
      );
    }
  }

  return { rupeco: docsRupeco, adicionales: docsAdicionales };
}

// Función para calcular nivel de confianza simulado
export function calcularNivelConfianza(datosExtraidos: Record<string, boolean>): number {
  const totalCampos = Object.keys(datosExtraidos).length;
  if (totalCampos === 0) return 0;
  
  const camposCompletos = Object.values(datosExtraidos).filter(v => v).length;
  const baseConfianza = (camposCompletos / totalCampos) * 100;
  
  // Agregar variación simulada para demo
  const variacion = (Math.random() * 10) - 5;
  return Math.min(100, Math.max(0, baseConfianza + variacion));
}

// Función para determinar acción según nivel de confianza (diagrama del documento)
export function determinarAccionPorConfianza(nivelConfianza: number): {
  accion: 'automatico' | 'revision_humana' | 'manual_obligatorio';
  descripcion: string;
  color: string;
} {
  if (nivelConfianza >= 85) {
    return {
      accion: 'automatico',
      descripcion: 'Clasificación aceptada automáticamente',
      color: 'green',
    };
  } else if (nivelConfianza >= 60) {
    return {
      accion: 'revision_humana',
      descripcion: 'Requiere revisión humana (Cola de Revisión)',
      color: 'yellow',
    };
  } else {
    return {
      accion: 'manual_obligatorio',
      descripcion: 'Clasificación manual obligatoria',
      color: 'red',
    };
  }
}
