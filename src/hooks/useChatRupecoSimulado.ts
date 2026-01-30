import { useState, useCallback, useEffect } from 'react';
import { Message } from '@/components/penelope/chat/ChatMessage';
import { RupecoEvaluationData } from '@/components/penelope/chat/RupecoEvaluation';
import { useTipoTramite } from '@/contexts/TipoTramiteContext';
import { useKillSwitch } from '@/contexts/KillSwitchContext';
import { useSecurityValidation } from '@/hooks/useSecurityValidation';
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
  | 'ingreso_recepcion'      // 1. INGRESO Y RECEPCIÓN
  | 'clasificacion_ia'       // 2. CLASIFICACIÓN ASISTIDA IA
  | 'validacion_documental'  // 3. VALIDACIÓN DOCUMENTAL
  | 'resultado'
  | 'evaluacion';

interface DocumentoDetectado {
  id: string;
  nombre: string;
  detectado: boolean;
  nivelConfianza: number;
  normativa: string;
  articuloEspecifico?: string;
  validadoPorAgente?: boolean;
  observacionAgente?: string;
}

export interface AprobacionExpediente {
  aprobado: boolean;
  agenteNombre: string;
  agenteId?: string;
  timestamp: Date;
  observaciones?: string;
}

interface ExpedienteSimulado {
  numero: string;
  caratula: string;
  tipoPersona: 'humana' | 'juridica';
  tramite: TramiteENAC | null;
  documentosDetectados: DocumentoDetectado[];
  nivelConfianzaGlobal: number;
  fechaIngreso: Date;
}

const generateId = () => Math.random().toString(36).substring(2, 9);
const generateExpedienteNum = () => `EX-2026-${Math.floor(Math.random() * 90000000 + 10000000)}-APN-ENACOM`;

const MENSAJE_INICIAL = `## 🔍 Sistema de Verificación Documental ENACOM

**Penélope** - Módulo de Admisibilidad Formal

Seleccioná el tipo de trámite para ejecutar la verificación automática del núcleo RUPECO.`;

export function useChatRupecoSimulado() {
  const { setTipoTramite } = useTipoTramite();
  const { isSystemActive } = useKillSwitch();
  const { validateInput } = useSecurityValidation();
  
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

  const detectarTramite = (input: string): TramiteENAC | null => {
    const lower = input.toLowerCase();
    
    // Buscar por código ENAC
    for (const tramite of TRAMITES_ENAC) {
      if (lower.includes(tramite.codigo.toLowerCase())) {
        return tramite;
      }
    }
    
    // Buscar por palabras clave
    if (lower.includes('tic') && (lower.includes('nueva') || lower.includes('alta'))) {
      return TRAMITES_ENAC.find(t => t.codigo === 'ENAC00062') || null;
    }
    if (lower.includes('tic') && lower.includes('modific')) {
      return TRAMITES_ENAC.find(t => t.codigo === 'ENAC00063') || null;
    }
    if (lower.includes('audiovisual') || lower.includes('televisión') || lower.includes('radio')) {
      return TRAMITES_ENAC.find(t => t.codigo === 'ENAC00025') || null;
    }
    if (lower.includes('postal') || lower.includes('correo')) {
      return TRAMITES_ENAC.find(t => t.codigo === 'ENAC00013') || null;
    }
    if (lower.includes('rupeco') || lower.includes('inscripción') || lower.includes('registro')) {
      return TRAMITES_ENAC.find(t => t.codigo === 'ENAC00078') || null;
    }
    
    // Default a TIC nueva
    if (lower.includes('tic') || lower.includes('licencia')) {
      return TRAMITES_ENAC.find(t => t.codigo === 'ENAC00062') || null;
    }
    
    return null;
  };

  const detectarTipoPersona = (input: string): 'humana' | 'juridica' => {
    const lower = input.toLowerCase();
    if (lower.includes('humana') || lower.includes('física') || lower.includes('fisico') || lower.includes('particular')) {
      return 'humana';
    }
    return 'juridica'; // Default a jurídica
  };

  const simularExtraccionDocumental = useCallback((
    tipoPersona: 'humana' | 'juridica',
    tramite: TramiteENAC | null
  ): DocumentoDetectado[] => {
    const { rupeco, adicionales } = getDocumentosRequeridos(tipoPersona, tramite?.codigo);
    const todosDocumentos = [...rupeco, ...adicionales];
    
    // Obtener info completa del documento
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
    
    // Simular detección con probabilidades realistas
    return todosDocumentos.map(doc => {
      const probabilidadDeteccion = Math.random();
      const detectado = probabilidadDeteccion > 0.3; // 70% de probabilidad de detección
      const nivelConfianza = detectado 
        ? 60 + Math.random() * 40 // Entre 60% y 100%
        : 0;
      
      const docInfo = getDocInfo(doc.id);
      
      return {
        id: doc.id,
        nombre: doc.nombre,
        detectado,
        nivelConfianza: Math.round(nivelConfianza),
        normativa: docInfo.normativa,
        articuloEspecifico: docInfo.articuloEspecifico,
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

  // Ejecutar verificación automática del expediente
  const ejecutarVerificacion = useCallback((input: string) => {
    const tramite = detectarTramite(input);
    const tipoPersona = detectarTipoPersona(input);
    
    if (!tramite) {
      return;
    }

    setIsLoading(true);
    setCurrentStep('ingreso_recepcion');

    // Fase 1: Ingreso
    const numExp = generateExpedienteNum();
    const caratula = tipoPersona === 'juridica' 
      ? `EMPRESA DEMO S.A. s/ ${tramite.nombre}`
      : `PERSONA DEMO s/ ${tramite.nombre}`;

    // Simular procesamiento en etapas
    setTimeout(() => {
      setCurrentStep('clasificacion_ia');
      
      setTimeout(() => {
        setCurrentStep('validacion_documental');
        
        const documentosDetectados = simularExtraccionDocumental(tipoPersona, tramite);
        const docsConDeteccion = documentosDetectados.filter(d => d.detectado);
        const nivelConfianzaGlobal = docsConDeteccion.length > 0
          ? Math.round(docsConDeteccion.reduce((acc, d) => acc + d.nivelConfianza, 0) / docsConDeteccion.length)
          : Math.round(30 + Math.random() * 30);

        const nuevoExpediente: ExpedienteSimulado = {
          numero: numExp,
          caratula,
          tipoPersona,
          tramite,
          documentosDetectados,
          nivelConfianzaGlobal,
          fechaIngreso: new Date(),
        };

        setExpediente(nuevoExpediente);
        setTipoTramite(tramite.nombre);

        setTimeout(() => {
          setCurrentStep('resultado');
          
          // Generar informe de resultado
          const detectados = documentosDetectados.filter(d => d.detectado);
          const faltantes = documentosDetectados.filter(d => !d.detectado);
          const porcentaje = Math.round((detectados.length / documentosDetectados.length) * 100);
          const accion = determinarAccionPorConfianza(nivelConfianzaGlobal);

          let informe = `## 📋 INFORME DE VERIFICACIÓN AUTOMÁTICA

---

### Datos del Expediente
| Campo | Valor |
|:------|:------|
| **Expediente** | ${numExp} |
| **Carátula** | ${caratula} |
| **Tipo de persona** | ${tipoPersona === 'humana' ? 'Persona Humana' : 'Persona Jurídica'} |
| **Trámite** | ${tramite.nombre} (${tramite.codigo}) |
| **Normativa aplicable** | ${tramite.normativa} |

---

### Resultado de Clasificación IA

| Parámetro | Valor |
|:----------|:------|
| **Nivel de confianza** | ${nivelConfianzaGlobal}% |
| **Acción sugerida** | ${accion.descripcion} |
| **Completitud documental** | ${porcentaje}% (${detectados.length}/${documentosDetectados.length}) |

---

### ✅ Requisitos Cumplidos

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

          informe += `\n---\n\n### ❌ Requisitos Faltantes\n\n`;

          if (faltantes.length > 0) {
            faltantes.forEach(doc => {
              informe += `- **${doc.nombre}**\n`;
              if (doc.articuloEspecifico) {
                informe += `  - Exigido por: ${doc.normativa} - ${doc.articuloEspecifico}\n`;
              } else {
                informe += `  - Exigido por: ${doc.normativa}\n`;
              }
            });

            informe += `\n---\n\n### ⚠️ ACCIÓN AUTOMÁTICA: Generación de Borrador de Intimación\n\n`;
            informe += `El sistema ha detectado **${faltantes.length} documento(s) faltante(s)** y ha generado automáticamente un borrador de Providencia de Intimación.\n\n`;
            informe += `> 📝 **El borrador requiere validación y firma del agente** antes de su notificación al administrado.\n\n`;
            
            const diasRestantes = tramite.plazoSilencioPositivo;
            informe += `⏰ **Control de plazos (Decreto N° 971/2024 - PEHAR)**\n`;
            informe += `- Plazo silencio positivo: ${diasRestantes} días hábiles\n`;
            informe += `- Fecha límite estimada: ${new Date(Date.now() + diasRestantes * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR')}\n`;
          } else {
            informe += `*Todos los documentos requeridos han sido detectados*\n\n`;
            informe += `---\n\n### ✅ EXPEDIENTE COMPLETO\n\n`;
            informe += `El expediente cumple con todos los requisitos del núcleo RUPECO y puede derivarse a la etapa de **análisis técnico-jurídico**.\n`;
            informe += `> No se requiere intimación al administrado.\n`;
          }

          // Agregar mensaje con el informe
          setMessages(prev => [
            ...prev,
            {
              id: generateId(),
              role: 'assistant',
              content: informe,
              timestamp: new Date(),
            },
          ]);

          // Generar evaluación
          const evalData = generarEvaluacionJSON(nuevoExpediente);
          setEvaluation(evalData);

          setCurrentStep('evaluacion');
          setIsLoading(false);
        }, 600);
      }, 600);
    }, 400);
  }, [setTipoTramite, simularExtraccionDocumental, generarEvaluacionJSON]);

  const sendMessage = useCallback((content: string) => {
    if (!isSystemActive) {
      return;
    }

    const validation = validateInput(content);
    if (!validation.isValid) {
      return;
    }

    // Agregar mensaje del usuario (selección de trámite)
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: validation.sanitizedValue || content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Ejecutar verificación automática
    ejecutarVerificacion(content);
  }, [isSystemActive, validateInput, ejecutarVerificacion]);

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
  }, []);

  // Función para aprobar el expediente completo
  const aprobarExpediente = useCallback((agenteNombre: string, observaciones?: string) => {
    if (!expediente) return;
    
    const nuevaAprobacion: AprobacionExpediente = {
      aprobado: true,
      agenteNombre,
      timestamp: new Date(),
      observaciones,
    };
    
    setAprobacion(nuevaAprobacion);
    
    // Agregar mensaje de confirmación
    setMessages(prev => [
      ...prev,
      {
        id: generateId(),
        role: 'assistant',
        content: `## ✅ EXPEDIENTE APROBADO

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
  }, [expediente]);

  // Función para validar un requisito individual
  const validarRequisito = useCallback((requisitoId: string, validado: boolean, observacion?: string) => {
    if (!expediente) return;
    
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
  }, [expediente]);

  // Datos de requisitos para verificación
  const requisitosData = expediente ? {
    requisitos: expediente.documentosDetectados.map(d => ({
      id: d.id,
      nombre: d.nombre,
      normativa: d.normativa,
      articuloEspecifico: d.articuloEspecifico,
      detectado: d.detectado,
      nivelConfianza: d.nivelConfianza,
      validadoPorAgente: d.validadoPorAgente,
      observacionAgente: d.observacionAgente,
    })),
    tipoPersona: expediente.tipoPersona,
    tramiteNombre: expediente.tramite?.nombre || 'Trámite ENACOM',
  } : null;

  // Datos para la providencia de intimación
  const providenciaData = expediente && expediente.documentosDetectados.some(d => !d.detectado) ? {
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
  const todosRequisitosValidados = expediente 
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
    aprobacion,
    todosRequisitosValidados,
  };
}
