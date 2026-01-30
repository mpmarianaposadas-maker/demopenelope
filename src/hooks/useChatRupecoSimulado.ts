import { useState, useCallback } from 'react';
import { Message } from '@/components/penelope/chat/ChatMessage';
import { RupecoEvaluationData } from '@/components/penelope/chat/RupecoEvaluation';
import { useTipoTramite } from '@/contexts/TipoTramiteContext';
import { useKillSwitch } from '@/contexts/KillSwitchContext';
import { useSecurityValidation } from '@/hooks/useSecurityValidation';
import { 
  TRAMITES_ENAC, 
  NUCLEO_RUPECO, 
  getDocumentosRequeridos,
  calcularNivelConfianza,
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

const MENSAJE_INICIAL = `¡Hola! 👋 Soy **Penélope**, sistema asistencial de verificación documental para ENACOM.

Mi función es **asistir en la etapa de admisibilidad formal** mediante:
- 📋 Clasificación automática de trámites
- 🔍 Extracción de información de documentos
- ✅ Validación contra el núcleo documental RUPECO
- ⏰ Control de plazos para prevenir silencio positivo

---

**PASO 1: INGRESO DEL EXPEDIENTE**

Simulá el ingreso de documentación indicando:
1. **Tipo de trámite** (TIC, Audiovisual, Postal, RUPECO)
2. **Tipo de persona** (humana o jurídica)

Por ejemplo: *"Licencia TIC nueva para persona jurídica"*`;

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

  const simulateTyping = useCallback((response: string, delay?: number) => {
    setIsLoading(true);
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: generateId(),
            role: 'assistant',
            content: response,
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
        resolve();
      }, delay || 400 + Math.random() * 300);
    });
  }, []);

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
    
    // Simular detección con probabilidades realistas
    return todosDocumentos.map(doc => {
      // Simular que algunos documentos se detectan y otros no
      const probabilidadDeteccion = Math.random();
      const detectado = probabilidadDeteccion > 0.3; // 70% de probabilidad de detección
      const nivelConfianza = detectado 
        ? 60 + Math.random() * 40 // Entre 60% y 100%
        : 0;
      
      return {
        id: doc.id,
        nombre: doc.nombre,
        detectado,
        nivelConfianza: Math.round(nivelConfianza),
      };
    });
  }, []);

  const generarInformeValidacion = useCallback((exp: ExpedienteSimulado): string => {
    const detectados = exp.documentosDetectados.filter(d => d.detectado);
    const faltantes = exp.documentosDetectados.filter(d => !d.detectado);
    const porcentaje = Math.round((detectados.length / exp.documentosDetectados.length) * 100);
    const accion = determinarAccionPorConfianza(exp.nivelConfianzaGlobal);
    
    const tramiteInfo = exp.tramite 
      ? `**${exp.tramite.nombre}** (${exp.tramite.codigo})\n*Normativa: ${exp.tramite.normativa}*`
      : 'No identificado';

    let response = `## 📋 Informe de Validación Documental

**Expediente:** ${exp.numero}
**Carátula:** ${exp.caratula}
**Tipo de persona:** ${exp.tipoPersona === 'humana' ? 'Persona Humana' : 'Persona Jurídica'}
**Trámite:** ${tramiteInfo}

---

### 🤖 Resultado de Clasificación IA

| Nivel de Confianza | Acción |
|:------------------:|:------:|
| **${exp.nivelConfianzaGlobal}%** | ${accion.descripcion} |

---

### ✅ Documentos Detectados (${detectados.length}/${exp.documentosDetectados.length})

`;

    if (detectados.length > 0) {
      detectados.forEach(doc => {
        response += `- ✅ ${doc.nombre} *(${doc.nivelConfianza}% confianza)*\n`;
      });
    } else {
      response += `*No se detectaron documentos*\n`;
    }

    response += `\n### ❌ Documentos Faltantes (${faltantes.length})\n\n`;

    if (faltantes.length > 0) {
      faltantes.forEach(doc => {
        response += `- ❌ **${doc.nombre}**\n`;
      });
      
      response += `\n---\n\n### ⚠️ Acción Requerida\n\n`;
      response += `Se requiere **intimación al administrado** para presentar la documentación faltante.\n\n`;
      
      if (exp.tramite) {
        const diasRestantes = exp.tramite.plazoSilencioPositivo;
        response += `⏰ **Plazo silencio positivo:** ${diasRestantes} días (Decreto 971/2024)\n`;
        response += `📅 **Fecha límite estimada:** ${new Date(Date.now() + diasRestantes * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR')}\n`;
      }
    } else {
      response += `*Todos los documentos requeridos han sido detectados*\n\n`;
      response += `---\n\n### ✅ Expediente Completo\n\n`;
      response += `El expediente puede pasar a la etapa de **análisis técnico-jurídico**.\n`;
    }

    response += `\n---\n\n*Escribí **"ver JSON"** para obtener la evaluación estructurada.*`;

    return response;
  }, []);

  const generarEvaluacionJSON = useCallback((exp: ExpedienteSimulado) => {
    const detectados = exp.documentosDetectados.filter(d => d.detectado);
    const faltantes = exp.documentosDetectados.filter(d => !d.detectado);
    const porcentaje = Math.round((detectados.length / exp.documentosDetectados.length) * 100);

    const json = {
      expediente: {
        numero: exp.numero,
        caratula: exp.caratula,
        fecha_ingreso: exp.fechaIngreso.toISOString(),
      },
      tramite_enac: exp.tramite ? {
        codigo: exp.tramite.codigo,
        nombre: exp.tramite.nombre,
        categoria: exp.tramite.categoria,
        normativa: exp.tramite.normativa,
        plazo_silencio_positivo: exp.tramite.plazoSilencioPositivo,
      } : null,
      clasificacion_ia: {
        nivel_confianza: exp.nivelConfianzaGlobal,
        accion: determinarAccionPorConfianza(exp.nivelConfianzaGlobal).accion,
        requiere_revision_humana: exp.nivelConfianzaGlobal < 85,
      },
      nucleo_rupeco: {
        tipo_persona: exp.tipoPersona,
        documentos_requeridos: exp.documentosDetectados.length,
        documentos_detectados: detectados.length,
        completitud_porcentaje: porcentaje,
        documentos: exp.documentosDetectados.map(d => ({
          id: d.id,
          nombre: d.nombre,
          estado: d.detectado ? 'detectado' : 'faltante',
          nivel_confianza: d.nivelConfianza,
        })),
      },
      evaluacion_global: {
        expediente_completo: faltantes.length === 0,
        documentos_faltantes: faltantes.map(d => d.nombre),
        accion_requerida: faltantes.length > 0 ? 'intimacion' : 'derivar_analisis',
        riesgo_silencio_positivo: faltantes.length > 3 ? 'ALTO' : faltantes.length > 0 ? 'MEDIO' : 'BAJO',
      },
      timestamp: new Date().toISOString(),
    };

    // Actualizar evaluación visual
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
    setEvaluation(evalData);

    return json;
  }, []);

  const processUserInput = useCallback((input: string) => {
    const lowerInput = input.toLowerCase().trim();
    let response = '';
    let nextStep: RupecoStep = currentStep;

    // Comando para ver JSON
    if (lowerInput.includes('json') || lowerInput.includes('evaluar') || lowerInput.includes('listo')) {
      if (expediente) {
        const json = generarEvaluacionJSON(expediente);
        response = '```json\n' + JSON.stringify(json, null, 2) + '\n```';
        nextStep = 'evaluacion';
        return response;
      } else {
        return 'Primero necesito que ingreses un expediente para generar la evaluación.';
      }
    }

    switch (currentStep) {
      case 'inicio':
      case 'resultado':
      case 'evaluacion': {
        const tramite = detectarTramite(input);
        const tipoPersona = detectarTipoPersona(input);
        
        if (tramite || lowerInput.includes('expediente') || lowerInput.includes('tramite') || lowerInput.includes('licencia')) {
          // Crear expediente simulado
          const numExp = generateExpedienteNum();
          const caratula = tipoPersona === 'juridica' 
            ? `EMPRESA DEMO S.A. s/ ${tramite?.nombre || 'Trámite TIC'}`
            : `PERSONA DEMO s/ ${tramite?.nombre || 'Trámite TIC'}`;
          
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
          if (tramite) {
            setTipoTramite(tramite.nombre);
          }
          
          // Simular el flujo del diagrama
          const acuseRecibo = `## 📥 1. INGRESO Y RECEPCIÓN

✅ **Validación formal: COMPLETA**
📄 **Expediente generado:** ${numExp}
⏱️ **Timestamp:** ${new Date().toLocaleString('es-AR')}

---

## 🤖 2. CLASIFICACIÓN ASISTIDA IA

*Analizando contenido semántico...*
*Identificando tipo de trámite...*
*Extrayendo datos de documentos...*

`;
          
          // Primera parte del mensaje
          simulateTyping(acuseRecibo, 500).then(() => {
            // Segunda parte con resultado de clasificación
            const informe = generarInformeValidacion(nuevoExpediente);
            simulateTyping(`## 🔍 3. VALIDACIÓN DOCUMENTAL\n\n${informe}`, 1500);
          });
          
          nextStep = 'validacion_documental';
          return null; // No agregar mensaje inmediato, se manejan con simulateTyping
        } else {
          response = `No pude identificar el tipo de trámite. Por favor indicá:

- **Licencia TIC nueva** para persona jurídica
- **Autorización Audiovisual** para empresa
- **Servicio Postal** 
- **Inscripción RUPECO**

O directamente el código ENAC (ej: ENAC00062)`;
        }
        break;
      }

      case 'ingreso_recepcion':
      case 'clasificacion_ia':
      case 'validacion_documental': {
        // Si ya hay expediente, permitir consultas
        if (expediente) {
          if (lowerInput.includes('faltante') || lowerInput.includes('documento')) {
            const faltantes = expediente.documentosDetectados.filter(d => !d.detectado);
            response = `### Documentos Faltantes\n\n`;
            faltantes.forEach(d => {
              response += `- ❌ **${d.nombre}**\n`;
            });
            response += `\nTotal: ${faltantes.length} documento(s) pendiente(s)`;
          } else if (lowerInput.includes('plazo') || lowerInput.includes('silencio')) {
            if (expediente.tramite) {
              response = `### Control de Plazos\n\n`;
              response += `⏰ **Plazo silencio positivo:** ${expediente.tramite.plazoSilencioPositivo} días\n`;
              response += `📅 **Fecha ingreso:** ${expediente.fechaIngreso.toLocaleDateString('es-AR')}\n`;
              response += `📅 **Fecha límite:** ${new Date(expediente.fechaIngreso.getTime() + expediente.tramite.plazoSilencioPositivo * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR')}\n`;
            }
          } else if (lowerInput.includes('nuevo') || lowerInput.includes('otro') || lowerInput.includes('reiniciar')) {
            setExpediente(null);
            nextStep = 'inicio';
            response = MENSAJE_INICIAL;
          } else {
            response = `El expediente **${expediente.numero}** está en proceso.

Podés consultar:
- **"ver JSON"** - Evaluación estructurada
- **"documentos faltantes"** - Lista de documentos pendientes  
- **"plazo silencio positivo"** - Control de plazos
- **"nuevo expediente"** - Iniciar otro trámite`;
          }
        }
        break;
      }

      default:
        response = MENSAJE_INICIAL;
        nextStep = 'inicio';
    }

    setCurrentStep(nextStep);
    return response;
  }, [currentStep, expediente, setTipoTramite, simularExtraccionDocumental, generarInformeValidacion, generarEvaluacionJSON, simulateTyping]);

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

    const response = processUserInput(content);
    if (response) {
      simulateTyping(response);
    }
  }, [isSystemActive, validateInput, processUserInput, simulateTyping]);

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
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    resetChat,
    evaluation,
    isSystemActive,
    currentStep,
    esPJ: expediente?.tipoPersona === 'juridica',
  };
}
