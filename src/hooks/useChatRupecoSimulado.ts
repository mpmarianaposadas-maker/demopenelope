import { useState, useCallback, useEffect } from 'react';
import { Message } from '@/components/penelope/chat/ChatMessage';
import { RupecoEvaluationData } from '@/components/penelope/chat/RupecoEvaluation';
import { AccionAgente, TipoAccion } from '@/components/penelope/chat/HistorialAcciones';
import { useTipoTramite } from '@/contexts/TipoTramiteContext';
import { useKillSwitch } from '@/contexts/KillSwitchContext';
import { useSecurityValidation } from '@/hooks/useSecurityValidation';
import { useLedger } from '@/contexts/LedgerContext';
import { useAgente } from '@/contexts/AgenteContext';
import { 
  TRAMITES_ENAC, 
  NUCLEO_RUPECO, 
  getDocumentosRequeridos,
  determinarAccionPorConfianza,
  type TramiteENAC 
} from '@/lib/nucleoRupeco';

// Estados del flujo según diagrama del documento
export type RupecoStep = 
  | 'inicio'
  | 'ingreso_recepcion'           // 1. INGRESO Y RECEPCIÓN
  | 'clasificacion_ia'            // 2. CLASIFICACIÓN ASISTIDA IA
  | 'confirmacion_clasificacion'  // 2b. CONFIRMACIÓN DEL OPERADOR
  | 'validacion_documental'       // 3. VALIDACIÓN DOCUMENTAL
  | 'resultado'
  | 'evaluacion';

// Nivel de confianza cualitativo
export type NivelConfianzaCualitativo = 'Alto' | 'Medio' | 'Bajo';

export interface ClasificacionPendiente {
  tramite: TramiteENAC;
  tipoPersona: 'humana' | 'juridica';
  nivelConfianza: NivelConfianzaCualitativo;
  nivelConfianzaNumerico: number;
  alcanzadoPorSilencioPositivo: boolean;
  plazoEstimado: number;
  fechaVencimientoEstimado: Date;
  ambiguo: boolean;
}

// Estados de detección del documento según semáforo
export type EstadoDeteccion = 'verde' | 'amarillo' | 'rojo';

interface DocumentoDetectado {
  id: string;
  nombre: string;
  detectado: boolean;
  nivelConfianza: number;
  normativa: string;
  articuloEspecifico?: string;
  validadoPorAgente?: boolean;
  observacionAgente?: string;
  estadoIA: EstadoDeteccion;
  ordenExpediente: string;
  comentarioBrief?: string;
  problemaOCR?: boolean;
}

export interface AprobacionExpediente {
  aprobado: boolean;
  rechazado?: boolean;
  agenteNombre: string;
  agenteId?: string;
  timestamp: Date;
  observaciones?: string;
  motivoRechazo?: string;
  revertido?: boolean;
  reversionData?: {
    agenteNombre: string;
    timestamp: Date;
    justificacion: string;
  };
}

interface ExpedienteSimulado {
  numero: string;
  caratula: string;
  tipoPersona: 'humana' | 'juridica';
  tramite: TramiteENAC | null;
  documentosDetectados: DocumentoDetectado[];
  nivelConfianzaGlobal: number;
  fechaIngreso: Date;
  clasificacionConfirmada: boolean;
}

const generateId = () => Math.random().toString(36).substring(2, 9);
const generateExpedienteNum = () => `EX-2026-${Math.floor(Math.random() * 90000000 + 10000000)}-APN-ENACOM`;

let ledgerSeq = 1236; // Start after demo entries PNL-2026-001234 and PNL-2026-001235
const nextPromptId = () => `PNL-2026-${String(ledgerSeq++).padStart(6, '0')}`;

const MENSAJE_INICIAL = `## Sistema de Verificación Documental ENACOM

**Penélope** — Módulo de Admisibilidad Formal

Seleccioná el tipo de trámite para ejecutar la verificación automática del núcleo RUPECO.`;

// Categorías permitidas según normativa del proyecto (enunciativo y limitado a esta demo)
const CATEGORIAS_PERMITIDAS_CODIGOS = ['ENAC00062', 'ENAC00025', 'ENAC00063', 'ENAC00064', 'ENAC00013'];

// Función para obtener nivel de confianza cualitativo
function getNivelConfianzaCualitativo(nivelNumerico: number): NivelConfianzaCualitativo {
  if (nivelNumerico >= 80) return 'Alto';
  if (nivelNumerico >= 50) return 'Medio';
  return 'Bajo';
}

export function useChatRupecoSimulado() {
  const { setTipoTramite } = useTipoTramite();
  const { isSystemActive } = useKillSwitch();
  const { validateInput } = useSecurityValidation();
  const { agregarEntrada } = useLedger();
  const { agenteNombre } = useAgente();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: MENSAJE_INICIAL,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<RupecoStep>('inicio');
  const [expediente, setExpediente] = useState<ExpedienteSimulado | null>(null);
  const [evaluation, setEvaluation] = useState<RupecoEvaluationData | null>(null);
  const [aprobacion, setAprobacion] = useState<AprobacionExpediente | null>(null);
  const [historialAcciones, setHistorialAcciones] = useState<AccionAgente[]>([]);
  const [clasificacionPendiente, setClasificacionPendiente] = useState<ClasificacionPendiente | null>(null);
  const [scrollToTopCounter, setScrollToTopCounter] = useState(0);
  const triggerScrollToTop = useCallback(() => setScrollToTopCounter(c => c + 1), []);

  // Helper to add a ledger entry
  const registrarLedger = useCallback((
    caseId: string,
    taskType: 'VERIFICACION_VIGENCIA' | 'CLASIFICACION_PRELIMINAR' | 'GENERACION_PROVIDENCIA' | 'DETECCION_FALTANTES' | 'CONTROL_PLAZOS',
    outputIA: string,
    estado: 'convalidado' | 'corregido' | 'rechazado' | 'sistema' = 'convalidado',
  ) => {
    agregarEntrada({
      caseId,
      promptId: nextPromptId(),
      taskType,
      inputHash: `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
      outputIA,
      validadorId: agenteNombre ? `AGT-${agenteNombre}` : 'AGT-Pendiente validación',
      timestamp: new Date(),
      estado,
    });
  }, [agregarEntrada, agenteNombre]);

  // Función para agregar una acción al historial
  const agregarAccion = useCallback((
    tipo: TipoAccion,
    descripcion: string,
    agenteNombre?: string,
    detalles?: string,
    requisitoId?: string,
    requisitoNombre?: string
  ) => {
    const nuevaAccion: AccionAgente = {
      id: generateId(),
      tipo,
      timestamp: new Date(),
      agenteNombre,
      descripcion,
      detalles,
      requisitoId,
      requisitoNombre,
    };
    setHistorialAcciones(prev => [...prev, nuevaAccion]);
  }, []);

  const detectarTramite = (input: string): { tramite: TramiteENAC | null; ambiguo: boolean; confianza: number } => {
    const lower = input.toLowerCase();
    let tramiteDetectado: TramiteENAC | null = null;
    let ambiguo = false;
    let confianza = 0;
    
    for (const tramite of TRAMITES_ENAC) {
      if (lower.includes(tramite.codigo.toLowerCase())) {
        tramiteDetectado = tramite;
        confianza = 95;
        break;
      }
    }
    
    if (!tramiteDetectado) {
      if (lower.includes('tic') && (lower.includes('nueva') || lower.includes('alta'))) {
        tramiteDetectado = TRAMITES_ENAC.find(t => t.codigo === 'ENAC00062') || null;
        confianza = 85;
      }
      else if (lower.includes('tic') && (lower.includes('modific') || lower.includes('societar'))) {
        tramiteDetectado = TRAMITES_ENAC.find(t => t.codigo === 'ENAC00063') || null;
        confianza = 80;
      }
      else if (lower.includes('rupeco') || (lower.includes('actualiz') && lower.includes('dato'))) {
        tramiteDetectado = {
          codigo: 'ENAC00064',
          nombre: 'Actualización de datos RUPECO',
          categoria: 'TIC',
          normativa: 'Res. ENACOM 3731/2019 (RUPECO)',
          documentosObligatorios: 6,
          overlapRupeco: 95,
          plazoSilencioPositivo: 30,
          documentosAdicionales: [],
        };
        confianza = 85;
      }
      else if (lower.includes('audiovisual') || lower.includes('televisión') || lower.includes('radio')) {
        tramiteDetectado = TRAMITES_ENAC.find(t => t.codigo === 'ENAC00025') || null;
        confianza = 80;
      }
      else if (lower.includes('postal') || lower.includes('correo')) {
        tramiteDetectado = TRAMITES_ENAC.find(t => t.codigo === 'ENAC00013') || null;
        confianza = 85;
      }
      else if (lower.includes('licencia') || lower.includes('tic')) {
        tramiteDetectado = TRAMITES_ENAC.find(t => t.codigo === 'ENAC00062') || null;
        confianza = 55;
        ambiguo = true;
      }
      else if (lower.includes('rupeco') || lower.includes('inscripción') || lower.includes('registro')) {
        tramiteDetectado = TRAMITES_ENAC.find(t => t.codigo === 'ENAC00062') || null;
        confianza = 40;
        ambiguo = true;
      }
    }
    
    if (!tramiteDetectado) {
      tramiteDetectado = TRAMITES_ENAC.find(t => t.codigo === 'ENAC00062') || null;
      confianza = 30;
      ambiguo = true;
    }

    return { tramite: tramiteDetectado, ambiguo, confianza };
  };

  const detectarTipoPersona = (input: string): 'humana' | 'juridica' => {
    const lower = input.toLowerCase();
    if (lower.includes('humana') || lower.includes('física') || lower.includes('fisico') || lower.includes('particular')) {
      return 'humana';
    }
    return 'juridica';
  };

  const simularExtraccionDocumental = useCallback((
    tipoPersona: 'humana' | 'juridica',
    tramite: TramiteENAC | null
  ): DocumentoDetectado[] => {
    const { rupeco, adicionales } = getDocumentosRequeridos(tipoPersona, tramite?.codigo);
    const todosDocumentos = [...rupeco, ...adicionales];
    
    const getDocInfo = (docId: string) => {
      const docRupeco = NUCLEO_RUPECO.flatMap(b => b.documentos).find(d => d.id === docId);
      if (docRupeco) {
        return {
          normativa: docRupeco.normativa,
          articuloEspecifico: docRupeco.articuloEspecifico,
        };
      }
      const docAdicional = tramite?.documentosAdicionales.find(d => d.id === docId);
      return {
        normativa: docAdicional?.normativa || 'Normativa vigente',
        articuloEspecifico: undefined,
      };
    };

    const generarOrdenExpediente = (index: number, detectado: boolean): string => {
      if (!detectado) return 'No localizado';
      const ordenNum = index + 1;
      const numIF = String(ordenNum).padStart(5, '0');
      return `Orden N° ${ordenNum} · IF-2026-${numIF}-APN-ENACOM`;
    };

    const generarComentarioBrief = (estadoIA: EstadoDeteccion, problemaOCR: boolean): string => {
      if (estadoIA === 'verde') {
        const comentarios = [
          'Datos coherentes con registro tributario.',
          'Documento legible y completo.',
          'Validación automática satisfactoria.',
          'Firma y sello verificados.',
        ];
        return comentarios[Math.floor(Math.random() * comentarios.length)];
      } else if (estadoIA === 'amarillo') {
        const comentarios = [
          'OCR parcial, revisar páginas finales.',
          'Baja resolución en algunas secciones.',
          'Posible falta de páginas.',
          'Firma poco legible.',
        ];
        return comentarios[Math.floor(Math.random() * comentarios.length)];
      } else {
        return 'No se halló documento equivalente.';
      }
    };
    
    return todosDocumentos.map((doc, index) => {
      const probabilidadDeteccion = Math.random();
      const detectado = probabilidadDeteccion > 0.3;
      const nivelConfianza = detectado 
        ? 60 + Math.random() * 40
        : 0;
      
      const docInfo = getDocInfo(doc.id);
      
      let estadoIA: EstadoDeteccion;
      let problemaOCR = false;
      
      if (!detectado) {
        estadoIA = 'rojo';
      } else if (nivelConfianza >= 85) {
        estadoIA = 'verde';
      } else {
        estadoIA = 'amarillo';
        problemaOCR = Math.random() > 0.5;
      }
      
      const ordenExpediente = generarOrdenExpediente(index, detectado);
      const comentarioBrief = generarComentarioBrief(estadoIA, problemaOCR);
      
      return {
        id: doc.id,
        nombre: doc.nombre,
        detectado,
        nivelConfianza: Math.round(nivelConfianza),
        normativa: docInfo.normativa,
        articuloEspecifico: docInfo.articuloEspecifico,
        estadoIA,
        ordenExpediente,
        comentarioBrief,
        problemaOCR,
      };
    });
  }, []);

  const generarEvaluacionJSON = useCallback((exp: ExpedienteSimulado): RupecoEvaluationData => {
    const detectados = exp.documentosDetectados.filter(d => d.detectado);
    const faltantes = exp.documentosDetectados.filter(d => !d.detectado);
    const porcentaje = Math.round((detectados.length / exp.documentosDetectados.length) * 100);

    const evalData: RupecoEvaluationData = {
      tipoTramite: exp.tramite?.nombre || 'Sin especificar',
      tipoPersona: exp.tipoPersona === 'humana' ? 'HUMANA' : 'JURIDICA',
      responsable: {
        nombre: exp.caratula.split(' s/')[0] || 'Según expediente',
        cuit: 'Según constancia en expediente',
        domicilioLegal: 'Según constancia en expediente',
        telefono: 'Según constancia en expediente',
        email: 'Según constancia en expediente',
      },
      licenciaVinculada: exp.numero,
      completitud: {
        porcentaje,
        camposFaltantes: faltantes.map(d => d.nombre),
      },
      timestamp: new Date().toLocaleString('es-AR'),
    };

    return evalData;
  }, []);

  // Iniciar el proceso de clasificación (antes de confirmar)
  const iniciarClasificacion = useCallback((input: string) => {
    const { tramite, ambiguo, confianza } = detectarTramite(input);
    const tipoPersona = detectarTipoPersona(input);
    
    if (!tramite) {
      return;
    }

    setIsLoading(true);
    setCurrentStep('ingreso_recepcion');

    const numExp = generateExpedienteNum();
    const caratula = tipoPersona === 'juridica' 
      ? `EMPRESA DEMO S.A. s/ ${tramite.nombre}`
      : `PERSONA DEMO s/ ${tramite.nombre}`;

    // Registrar inicio de verificación en historial
    agregarAccion(
      'inicio_verificacion',
      `Clasificación asistida iniciada`,
      undefined,
      `Expediente: ${numExp} | Tipo: ${tipoPersona === 'humana' ? 'Persona Humana' : 'Persona Jurídica'}`,
    );

    // Ledger: selección de trámite
    registrarLedger(
      numExp,
      'CLASIFICACION_PRELIMINAR',
      `Trámite seleccionado: ${tramite.nombre} (${tramite.codigo}). Tipo persona: ${tipoPersona === 'humana' ? 'Humana' : 'Jurídica'}.`,
      'sistema',
    );

    // Simular procesamiento en etapas
    setTimeout(() => {
      setCurrentStep('clasificacion_ia');
      
      setTimeout(() => {
        const nivelConfianzaCualitativo = getNivelConfianzaCualitativo(confianza);
        const alcanzadoPorSilencioPositivo = tramite.plazoSilencioPositivo > 0;
        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(fechaVencimiento.getDate() + tramite.plazoSilencioPositivo);

        const expPreliminar: ExpedienteSimulado = {
          numero: numExp,
          caratula,
          tipoPersona,
          tramite,
          documentosDetectados: [],
          nivelConfianzaGlobal: confianza,
          fechaIngreso: new Date(),
          clasificacionConfirmada: false,
        };
        setExpediente(expPreliminar);

        const clasificacion: ClasificacionPendiente = {
          tramite,
          tipoPersona,
          nivelConfianza: nivelConfianzaCualitativo,
          nivelConfianzaNumerico: confianza,
          alcanzadoPorSilencioPositivo,
          plazoEstimado: tramite.plazoSilencioPositivo,
          fechaVencimientoEstimado: fechaVencimiento,
          ambiguo,
        };
        setClasificacionPendiente(clasificacion);

        let mensajeClasificacion: string;
        
        if (!ambiguo) {
          mensajeClasificacion = `Trámite clasificado como **${tramite.nombre}** (confianza: ${nivelConfianzaCualitativo}). ${alcanzadoPorSilencioPositivo ? 'Alcanzado por silencio positivo.' : 'No alcanzado por silencio positivo.'} Plazo estimado: ${tramite.plazoSilencioPositivo} días hábiles. Vencimiento tentativo: ${fechaVencimiento.toLocaleDateString('es-AR')}. Revisando el detalle a continuación.`;
        } else {
          mensajeClasificacion = `No fue posible clasificar el trámite con suficiente claridad. La evidencia documental es ambigua. El operador debe seleccionar la categoría correspondiente.`;
        }

        setMessages(prev => [
          ...prev,
          {
            id: generateId(),
            role: 'assistant',
            content: mensajeClasificacion,
            timestamp: new Date(),
          },
        ]);

        setCurrentStep('confirmacion_clasificacion');
        setIsLoading(false);
      }, 600);
    }, 400);
  }, [agregarAccion, registrarLedger]);

  // Confirmar la clasificación y continuar con validación documental
  const confirmarClasificacion = useCallback((tramiteConfirmado: TramiteENAC) => {
    if (!expediente || !clasificacionPendiente) return;

    setIsLoading(true);
    setClasificacionPendiente(null);

    agregarAccion(
      'clasificacion_confirmada' as TipoAccion,
      `Clasificación confirmada: ${tramiteConfirmado.nombre}`,
      undefined,
      `Tipo original detectado: ${clasificacionPendiente.tramite.nombre} | Confianza: ${clasificacionPendiente.nivelConfianza}`,
    );

    // Ledger: clasificación confirmada
    registrarLedger(
      expediente.numero,
      'CLASIFICACION_PRELIMINAR',
      `Clasificación confirmada por operador: ${tramiteConfirmado.nombre}. Confianza IA: ${clasificacionPendiente.nivelConfianza}.`,
    );

    setMessages(prev => [
      ...prev,
      {
        id: generateId(),
        role: 'assistant',
        content: `## Clasificación Confirmada\n\n**Trámite:** ${tramiteConfirmado.nombre}\n\nProcediendo con la verificación documental...`,
        timestamp: new Date(),
      },
    ]);
    triggerScrollToTop();

    setCurrentStep('validacion_documental');
    setTipoTramite(tramiteConfirmado.nombre);

    // Continuar con la extracción documental
    setTimeout(() => {
      const documentosDetectados = simularExtraccionDocumental(expediente.tipoPersona, tramiteConfirmado);
      const docsConDeteccion = documentosDetectados.filter(d => d.detectado);
      const nivelConfianzaGlobal = docsConDeteccion.length > 0
        ? Math.round(docsConDeteccion.reduce((acc, d) => acc + d.nivelConfianza, 0) / docsConDeteccion.length)
        : Math.round(30 + Math.random() * 30);

      const expedienteActualizado: ExpedienteSimulado = {
        ...expediente,
        tramite: tramiteConfirmado,
        caratula: expediente.tipoPersona === 'juridica' 
          ? `EMPRESA DEMO S.A. s/ ${tramiteConfirmado.nombre}`
          : `PERSONA DEMO s/ ${tramiteConfirmado.nombre}`,
        documentosDetectados,
        nivelConfianzaGlobal,
        clasificacionConfirmada: true,
      };

      setExpediente(expedienteActualizado);

      // Ledger: verificación documental completada
      const detectados = documentosDetectados.filter(d => d.detectado);
      const faltantes = documentosDetectados.filter(d => !d.detectado);
      registrarLedger(
        expediente.numero,
        'VERIFICACION_VIGENCIA',
        `Verificación documental: ${detectados.length}/${documentosDetectados.length} documentos detectados. Confianza global: ${nivelConfianzaGlobal}%.`,
        'sistema',
      );

      if (faltantes.length > 0) {
        registrarLedger(
          expediente.numero,
          'DETECCION_FALTANTES',
          `Faltantes detectados: ${faltantes.map(f => f.nombre).join(', ')}.`,
          'sistema',
        );
      }

      setTimeout(() => {
        setCurrentStep('resultado');
        
        const porcentaje = Math.round((detectados.length / documentosDetectados.length) * 100);
        const accion = determinarAccionPorConfianza(nivelConfianzaGlobal);

        let informe = `## INFORME DE VERIFICACIÓN AUTOMÁTICA

---

**Expediente:** ${expedienteActualizado.numero} | **Carátula:** ${expedienteActualizado.caratula}

**Tipo de persona:** ${expedienteActualizado.tipoPersona === 'humana' ? 'Persona Humana' : 'Persona Jurídica'} | **Trámite:** ${tramiteConfirmado.nombre} (${tramiteConfirmado.codigo})

**Normativa aplicable:** ${tramiteConfirmado.normativa}

---

### Resultado de Validación Documental

**Nivel de confianza:** ${nivelConfianzaGlobal}% | **Acción sugerida:** ${accion.descripcion} | **Completitud:** ${porcentaje}% (${detectados.length}/${documentosDetectados.length})

---

### Requisitos Cumplidos

`;

        if (detectados.length > 0) {
          detectados.forEach(doc => {
            informe += `- **${doc.nombre}** *(${doc.nivelConfianza}% confianza)*\n`;
            if (doc.articuloEspecifico) {
              informe += `  - Fundamento: ${doc.normativa} - ${doc.articuloEspecifico}\n`;
            } else {
              informe += `  - Fundamento: ${doc.normativa}\n`;
            }
          });
        } else {
          informe += `*No se detectaron documentos válidos*\n`;
        }

        informe += `\n---\n\n### Requisitos Faltantes\n\n`;

        if (faltantes.length > 0) {
          faltantes.forEach(doc => {
            informe += `- **${doc.nombre}**\n`;
            if (doc.articuloEspecifico) {
              informe += `  - Exigido por: ${doc.normativa} - ${doc.articuloEspecifico}\n`;
            } else {
              informe += `  - Exigido por: ${doc.normativa}\n`;
            }
          });

          const fechaHoy = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
          const nombreTitular = expedienteActualizado.tipoPersona === 'juridica' ? 'EMPRESA DEMO S.A.' : 'PERSONA FÍSICA DEMO';
          const filasFaltantes = faltantes.map((doc, i) => {
            const base = doc.articuloEspecifico ? `${doc.normativa} - ${doc.articuloEspecifico}` : doc.normativa;
            return `| ${i + 1} | ${doc.nombre} | ${base} |`;
          }).join('\n');

          informe += `

***

### 📄 BORRADOR — NOTA DE SOLICITUD DE DOCUMENTACIÓN FALTANTE U OBSERVADA FORMALMENTE

\`\`\`
═══════════════════════════════════════════════════════════════════
          ENTE NACIONAL DE COMUNICACIONES - ENACOM
          NOTA DE SOLICITUD DE DOCUMENTACIÓN FALTANTE U OBSERVADA FORMALMENTE
═══════════════════════════════════════════════════════════════════

Número de Nota: [ Campo a completar por el agente ]
Expediente: ${expedienteActualizado.numero}
Fecha: ${fechaHoy}

Destinatario: ${nombreTitular}
Domicilio constituido: [ Campo a completar por el agente ]

Ref.: Solicitud de documentación EX [ Completar con el número otorgado por el Sistema TAD ]

De mi consideración:

Me dirijo a Ud. en relación al expediente de referencia, tramitado ante
este Ente Nacional de Comunicaciones en el cual solicita
[ Completar con motivo de solicitud: ${tramiteConfirmado.nombre} ].

Del análisis formal de la documentación aportada mediante Trámites a
Distancia (TAD), se ha detectado la falta de documentación necesaria
para la continuidad de su petición.

══════════════════════════════════════════════════════════════════
                    DOCUMENTACIÓN FALTANTE
══════════════════════════════════════════════════════════════════

| N° | Documento Requerido                      | Base Normativa          |
|----|------------------------------------------|-------------------------|
${filasFaltantes}

══════════════════════════════════════════════════════════════════

⚑ Campo a completar por el agente una vez comprobados que son recaudos
ausentes o carentes de algún aspecto formal exigido por el Reglamento
de aplicación.

La documentación requerida deberá ser presentada a través del sistema
de Trámites a Distancia (TAD), citando el número de expediente.

La presentación oportuna de la documentación solicitada posibilitará
la continuación de su pedido en tiempo y forma.

Sin otro particular, saludo a Ud. atentamente.

[ Firma del agente — Cargo y dependencia ]
[ conforme registro del Sistema GDE, de la persona con facultades
  para suscribir el requerimiento ]
\`\`\`

> ⚠️ **El borrador requiere validación y firma del agente** antes de su notificación al administrado. Para carga en GDE.
`;
          
          const diasRestantes = tramiteConfirmado.plazoSilencioPositivo;
          informe += `\n**Control de plazos (Decreto N° 971/2024 — PEHAR)**\n`;
          informe += `- Plazo silencio positivo: ${diasRestantes} días hábiles\n`;
          informe += `- Fecha límite estimada: ${new Date(Date.now() + diasRestantes * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR')}\n`;

          // Ledger: generación de borrador de intimación
          registrarLedger(
            expediente.numero,
            'GENERACION_PROVIDENCIA',
            `Borrador de intimación generado. ${faltantes.length} documento(s) faltante(s). Plazo: ${diasRestantes} días hábiles.`,
            'sistema',
          );
        } else {
          informe += `*Todos los documentos requeridos han sido detectados*\n\n`;
          informe += `---\n\n### EXPEDIENTE COMPLETO\n\n`;
          informe += `El expediente cumple con todos los requisitos del núcleo RUPECO y puede derivarse a la etapa de **análisis técnico-jurídico**.\n`;
          informe += `> No se requiere intimación al administrado.\n`;
        }

        setMessages(prev => [
          ...prev,
          {
            id: generateId(),
            role: 'assistant',
            content: informe,
            timestamp: new Date(),
          },
        ]);

        const evalData = generarEvaluacionJSON(expedienteActualizado);
        setEvaluation(evalData);

        setCurrentStep('evaluacion');
        setIsLoading(false);
        triggerScrollToTop();
      }, 600);
    }, 600);
  }, [expediente, clasificacionPendiente, setTipoTramite, simularExtraccionDocumental, generarEvaluacionJSON, agregarAccion, registrarLedger, triggerScrollToTop]);

  // Cancelar la clasificación
  const cancelarClasificacion = useCallback(() => {
    setClasificacionPendiente(null);
    setExpediente(null);
    setCurrentStep('inicio');
    setIsLoading(false);
    
    setMessages(prev => [
      ...prev,
      {
        id: generateId(),
        role: 'assistant',
        content: `## Verificación Cancelada\n\nLa clasificación ha sido cancelada. Puede iniciar una nueva verificación seleccionando otro tipo de trámite.`,
        timestamp: new Date(),
      },
    ]);
    triggerScrollToTop();
  }, [triggerScrollToTop]);

  const sendMessage = useCallback((content: string) => {
    if (!isSystemActive) {
      return;
    }

    const validation = validateInput(content);
    if (!validation.isValid) {
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: validation.sanitizedValue || content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    iniciarClasificacion(content);
  }, [isSystemActive, validateInput, iniciarClasificacion]);

  const resetChat = useCallback(() => {
    setMessages([
      {
        id: generateId(),
        role: 'assistant',
        content: MENSAJE_INICIAL,
        timestamp: new Date(),
      },
    ]);
    setCurrentStep('inicio');
    setExpediente(null);
    setEvaluation(null);
    setAprobacion(null);
    setHistorialAcciones([]);
    setClasificacionPendiente(null);
  }, []);

  // Función para aprobar el expediente completo
  const aprobarExpediente = useCallback((agenteNombre: string, observaciones?: string) => {
    if (!expediente) return;
    
    const nuevaAprobacion: AprobacionExpediente = {
      aprobado: true,
      rechazado: false,
      agenteNombre,
      timestamp: new Date(),
      observaciones,
    };
    
    agregarAccion(
      'aprobar_expediente',
      `Expediente ${expediente.numero} aprobado`,
      agenteNombre,
      observaciones,
    );

    // Ledger: aprobación
    registrarLedger(
      expediente.numero,
      'CONTROL_PLAZOS',
      `Expediente aprobado por ${agenteNombre}. Derivado a análisis técnico-jurídico.${observaciones ? ` Obs: ${observaciones}` : ''}`,
    );

    setAprobacion(nuevaAprobacion);
    
    setMessages(prev => [
      ...prev,
      {
        id: generateId(),
        role: 'assistant',
        content: `## EXPEDIENTE APROBADO

---

| Campo | Valor |
|:------|:------|
| **Expediente** | ${expediente.numero} |
| **Agente validador** | ${agenteNombre} |
| **Fecha y hora** | ${nuevaAprobacion.timestamp.toLocaleString('es-AR')} |
${observaciones ? `| **Observaciones** | ${observaciones} |` : ''}

---

> El expediente ha sido verificado y aprobado para continuar a la etapa de **análisis técnico-jurídico**.`,
        timestamp: new Date(),
      },
    ]);
    triggerScrollToTop();
  }, [expediente, agregarAccion, registrarLedger, triggerScrollToTop]);

  // Función para rechazar el expediente completo
  const rechazarExpediente = useCallback((agenteNombre: string, motivoRechazo: string) => {
    if (!expediente) return;
    
    const nuevoRechazo: AprobacionExpediente = {
      aprobado: false,
      rechazado: true,
      agenteNombre,
      timestamp: new Date(),
      motivoRechazo,
    };
    
    agregarAccion(
      'rechazar_expediente',
      `Expediente ${expediente.numero} rechazado`,
      agenteNombre,
      motivoRechazo,
    );

    // Ledger: rechazo
    registrarLedger(
      expediente.numero,
      'CONTROL_PLAZOS',
      `Expediente rechazado por ${agenteNombre}. Motivo: ${motivoRechazo}.`,
      'corregido',
    );
    
    setAprobacion(nuevoRechazo);
    
    setMessages(prev => [
      ...prev,
      {
        id: generateId(),
        role: 'assistant',
        content: `## EXPEDIENTE RECHAZADO

---

| Campo | Valor |
|:------|:------|
| **Expediente** | ${expediente.numero} |
| **Agente** | ${agenteNombre} |
| **Fecha y hora** | ${nuevoRechazo.timestamp.toLocaleString('es-AR')} |
| **Motivo de rechazo** | ${motivoRechazo} |

---

> El expediente ha sido **rechazado** y no puede continuar al análisis técnico-jurídico. Se debe notificar al administrado el motivo del rechazo.`,
        timestamp: new Date(),
      },
    ]);
    triggerScrollToTop();
  }, [expediente, agregarAccion, registrarLedger, triggerScrollToTop]);

  // Función para revertir la decisión
  const revertirDecision = useCallback((agenteNombre: string, justificacion: string) => {
    if (!expediente || !aprobacion) return;
    
    const decisionOriginal = aprobacion.aprobado ? 'APROBACIÓN' : 'RECHAZO';
    
    agregarAccion(
      'revertir_decision',
      `Decisión de ${decisionOriginal.toLowerCase()} revertida`,
      agenteNombre,
      justificacion,
    );

    // Ledger: reversión
    registrarLedger(
      expediente.numero,
      'CONTROL_PLAZOS',
      `Decisión de ${decisionOriginal.toLowerCase()} revertida por ${agenteNombre}. Justificación: ${justificacion}.`,
      'corregido',
    );
    
    setAprobacion(prev => prev ? {
      ...prev,
      revertido: true,
      reversionData: {
        agenteNombre,
        timestamp: new Date(),
        justificacion,
      }
    } : null);
    
    setMessages(prev => [
      ...prev,
      {
        id: generateId(),
        role: 'assistant',
        content: `## DECISIÓN REVERTIDA

---

| Campo | Valor |
|:------|:------|
| **Expediente** | ${expediente.numero} |
| **Decisión original** | ${decisionOriginal} |
| **Agente original** | ${aprobacion.agenteNombre} |
| **Fecha original** | ${aprobacion.timestamp.toLocaleString('es-AR')} |

---

### Datos de la Reversión

| Campo | Valor |
|:------|:------|
| **Agente que revierte** | ${agenteNombre} |
| **Fecha de reversión** | ${new Date().toLocaleString('es-AR')} |
| **Justificación** | ${justificacion} |

---

> La decisión anterior ha sido **revertida**. El expediente requiere una nueva evaluación y resolución.`,
        timestamp: new Date(),
      },
    ]);
    
    triggerScrollToTop();
    setTimeout(() => {
      setAprobacion(null);
    }, 100);
  }, [expediente, aprobacion, agregarAccion, registrarLedger, triggerScrollToTop]);

  // Función para validar un requisito individual
  const validarRequisito = useCallback((requisitoId: string, validado: boolean, observacion?: string) => {
    if (!expediente) return;
    
    const requisito = expediente.documentosDetectados.find(d => d.id === requisitoId);
    const tipoAccion: TipoAccion = requisito?.detectado 
      ? (validado ? 'validar_requisito' : 'rechazar_requisito')
      : 'subsanar_requisito';
    
    agregarAccion(
      tipoAccion,
      validado 
        ? (requisito?.detectado ? 'Requisito validado por agente' : 'Requisito marcado como subsanado')
        : 'Requisito rechazado por agente',
      undefined,
      observacion,
      requisitoId,
      requisito?.nombre,
    );
    
    setExpediente(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        documentosDetectados: prev.documentosDetectados.map(doc => 
          doc.id === requisitoId 
            ? { ...doc, validadoPorAgente: validado, observacionAgente: observacion }
            : doc
        ),
      };
    });
  }, [expediente, agregarAccion]);

  // Datos de requisitos para verificación
  const requisitosData = expediente && expediente.clasificacionConfirmada ? {
    requisitos: expediente.documentosDetectados.map(d => ({
      id: d.id,
      nombre: d.nombre,
      normativa: d.normativa,
      articuloEspecifico: d.articuloEspecifico,
      detectado: d.detectado,
      nivelConfianza: d.nivelConfianza,
      validadoPorAgente: d.validadoPorAgente,
      observacionAgente: d.observacionAgente,
      estadoIA: d.estadoIA,
      ordenExpediente: d.ordenExpediente,
      comentarioBrief: d.comentarioBrief,
      problemaOCR: d.problemaOCR,
    })),
    tipoPersona: expediente.tipoPersona,
    tramiteNombre: expediente.tramite?.nombre || 'Trámite ENACOM',
  } : null;

  // Datos para la providencia de intimación
  const providenciaData = expediente && expediente.clasificacionConfirmada && expediente.documentosDetectados.some(d => !d.detectado) ? {
    expediente: {
      numero: expediente.numero,
      caratula: expediente.caratula,
      tipoPersona: expediente.tipoPersona,
      tramiteNombre: expediente.tramite?.nombre || 'Trámite ENACOM',
      tramiteCodigo: expediente.tramite?.codigo || 'N/A',
      tramiteNormativa: expediente.tramite?.normativa || 'Normativa aplicable',
      plazoSilencioPositivo: expediente.tramite?.plazoSilencioPositivo || 60,
      fechaIngreso: expediente.fechaIngreso,
    },
    documentosFaltantes: expediente.documentosDetectados
      .filter(d => !d.detectado)
      .map(d => ({
        nombre: d.nombre,
        normativa: d.articuloEspecifico 
          ? `${d.normativa} - ${d.articuloEspecifico}`
          : d.normativa,
      })),
  } : null;

  // Verificar si todos los requisitos están validados
  const todosRequisitosValidados = expediente && expediente.clasificacionConfirmada
    ? expediente.documentosDetectados.every(d => 
        d.validadoPorAgente !== undefined
      )
    : false;

  return {
    messages,
    isLoading,
    sendMessage,
    resetChat,
    evaluation,
    isSystemActive,
    currentStep,
    esPJ: expediente?.tipoPersona === 'juridica',
    providenciaData,
    requisitosData,
    validarRequisito,
    aprobarExpediente,
    rechazarExpediente,
    revertirDecision,
    aprobacion,
    todosRequisitosValidados,
    historialAcciones,
    expedienteNumero: expediente?.numero,
    clasificacionPendiente,
    confirmarClasificacion,
    cancelarClasificacion,
    scrollToTopCounter,
  };
}
