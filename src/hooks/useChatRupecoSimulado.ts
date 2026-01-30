import { useState, useCallback } from 'react';
import { Message } from '@/components/penelope/chat/ChatMessage';
import { RupecoEvaluationData } from '@/components/penelope/chat/RupecoEvaluation';
import { useTipoTramite } from '@/contexts/TipoTramiteContext';
import { useKillSwitch } from '@/contexts/KillSwitchContext';
import { useSecurityValidation } from '@/hooks/useSecurityValidation';

type VerificationStep = 
  | 'inicio' 
  | 'seleccion_expediente'
  | 'verificando'
  | 'resultado'
  | 'detalle';

interface ExpedienteData {
  numero?: string;
  tipoTramite?: string;
  caratula?: string;
  fechaInicio?: string;
  diasTranscurridos?: number;
  requisitosCumplidos: string[];
  requisitosFaltantes: string[];
  requisitosPendientesValidacion: string[];
  riesgoSilencioPositivo: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  diasRestantes?: number;
}

// Requisitos simulados por tipo de trámite
const REQUISITOS_POR_TRAMITE: Record<string, { obligatorios: string[]; opcionales: string[] }> = {
  'Licencia TIC - Alta': {
    obligatorios: [
      'Formulario de solicitud firmado',
      'Estatuto o contrato social',
      'Acta de designación de autoridades',
      'Constancia de inscripción AFIP',
      'Constancia de inscripción IIBB',
      'Declaración jurada de composición accionaria',
      'Plan técnico de la red',
      'Estudio de factibilidad económica',
      'Pago de tasa administrativa',
    ],
    opcionales: [
      'Certificado de habilitación municipal',
      'Estudio de impacto ambiental',
    ],
  },
  'Servicio Audiovisual - Registro': {
    obligatorios: [
      'Formulario de inscripción',
      'Documentación societaria',
      'Constancia AFIP vigente',
      'Declaración de programación',
      'Grilla de programación propuesta',
      'Comprobante de pago de tasa',
    ],
    opcionales: [
      'Convenios con productoras',
    ],
  },
  'Servicio Postal - Habilitación': {
    obligatorios: [
      'Solicitud de habilitación',
      'Estatuto social',
      'Constancia AFIP',
      'Seguro de responsabilidad civil',
      'Detalle de sucursales',
      'Plan operativo',
    ],
    opcionales: [
      'Certificaciones ISO',
    ],
  },
};

const EXPEDIENTES_SIMULADOS: ExpedienteData[] = [
  {
    numero: 'EX-2024-89234512-APN-ENACOM',
    tipoTramite: 'Licencia TIC - Alta',
    caratula: 'TELECOMUNICACIONES NORTE S.A. s/ Solicitud de Licencia TIC',
    fechaInicio: '15/11/2024',
    diasTranscurridos: 45,
    requisitosCumplidos: [
      'Formulario de solicitud firmado',
      'Estatuto o contrato social',
      'Acta de designación de autoridades',
      'Constancia de inscripción AFIP',
      'Pago de tasa administrativa',
    ],
    requisitosFaltantes: [
      'Plan técnico de la red',
      'Estudio de factibilidad económica',
    ],
    requisitosPendientesValidacion: [
      'Constancia de inscripción IIBB',
      'Declaración jurada de composición accionaria',
    ],
    riesgoSilencioPositivo: 'ALTO',
    diasRestantes: 15,
  },
  {
    numero: 'EX-2024-91456789-APN-ENACOM',
    tipoTramite: 'Servicio Audiovisual - Registro',
    caratula: 'PRODUCTORA VISUAL S.R.L. s/ Registro de Señal',
    fechaInicio: '01/12/2024',
    diasTranscurridos: 28,
    requisitosCumplidos: [
      'Formulario de inscripción',
      'Documentación societaria',
      'Constancia AFIP vigente',
      'Comprobante de pago de tasa',
    ],
    requisitosFaltantes: [],
    requisitosPendientesValidacion: [
      'Declaración de programación',
      'Grilla de programación propuesta',
    ],
    riesgoSilencioPositivo: 'MEDIO',
    diasRestantes: 32,
  },
  {
    numero: 'EX-2024-78123456-APN-ENACOM',
    tipoTramite: 'Licencia TIC - Alta',
    caratula: 'FIBRA CONECTA S.A.S. s/ Licencia de Servicios TIC',
    fechaInicio: '20/09/2024',
    diasTranscurridos: 92,
    requisitosCumplidos: [
      'Formulario de solicitud firmado',
      'Estatuto o contrato social',
      'Acta de designación de autoridades',
      'Constancia de inscripción AFIP',
      'Constancia de inscripción IIBB',
      'Declaración jurada de composición accionaria',
      'Plan técnico de la red',
      'Estudio de factibilidad económica',
      'Pago de tasa administrativa',
    ],
    requisitosFaltantes: [],
    requisitosPendientesValidacion: [],
    riesgoSilencioPositivo: 'CRITICO',
    diasRestantes: -2,
  },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

export function useChatRupecoSimulado() {
  const { setTipoTramite } = useTipoTramite();
  const { isSystemActive } = useKillSwitch();
  const { validateInput } = useSecurityValidation();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: `¡Hola! 👋 Soy **Penélope**, tu asistente de verificación de expedientes.

Estoy aquí para ayudarte a **verificar el estado de cumplimiento** de los requisitos en trámites alcanzados por el silencio administrativo positivo.

Puedo analizar expedientes de:
- 📡 **Licencias TIC** (Res. ENACOM 40/2020)
- 📺 **Servicios Audiovisuales** (Ley 26.522)
- 📮 **Servicios Postales** (Ley 20.216)

**¿Qué expediente querés verificar?**

Podés ingresar el número de expediente (ej: EX-2024-89234512-APN-ENACOM) o elegir uno de los ejemplos:`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<VerificationStep>('inicio');
  const [selectedExpediente, setSelectedExpediente] = useState<ExpedienteData | null>(null);
  const [evaluation, setEvaluation] = useState<RupecoEvaluationData | null>(null);

  const simulateTyping = useCallback((response: string, onComplete?: () => void) => {
    setIsLoading(true);
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
      onComplete?.();
    }, 600 + Math.random() * 500);
  }, []);

  const generateVerificationResult = useCallback((expediente: ExpedienteData): string => {
    const totalRequisitos = expediente.requisitosCumplidos.length + 
                           expediente.requisitosFaltantes.length + 
                           expediente.requisitosPendientesValidacion.length;
    const cumplidos = expediente.requisitosCumplidos.length;
    const porcentaje = Math.round((cumplidos / totalRequisitos) * 100);

    const riesgoEmoji = {
      'BAJO': '🟢',
      'MEDIO': '🟡',
      'ALTO': '🟠',
      'CRITICO': '🔴',
    };

    const riesgoTexto = {
      'BAJO': 'Bajo - El expediente tiene margen de tiempo',
      'MEDIO': 'Medio - Requiere atención en los próximos días',
      'ALTO': 'Alto - Próximo a vencer, acción urgente requerida',
      'CRITICO': 'Crítico - Plazo vencido, riesgo de silencio positivo inminente',
    };

    let response = `## 📋 Verificación de Expediente

**${expediente.numero}**
*${expediente.caratula}*

---

### Estado de Requisitos

| Cumplidos | Pendientes | Faltantes |
|:---------:|:----------:|:---------:|
| ✅ ${expediente.requisitosCumplidos.length} | ⏳ ${expediente.requisitosPendientesValidacion.length} | ❌ ${expediente.requisitosFaltantes.length} |

**Completitud:** ${porcentaje}%

---

### ${riesgoEmoji[expediente.riesgoSilencioPositivo]} Riesgo de Silencio Positivo

**${riesgoTexto[expediente.riesgoSilencioPositivo]}**

`;

    if (expediente.diasRestantes !== undefined) {
      if (expediente.diasRestantes > 0) {
        response += `⏰ **Días restantes:** ${expediente.diasRestantes} días\n\n`;
      } else {
        response += `⚠️ **Plazo excedido por:** ${Math.abs(expediente.diasRestantes)} días\n\n`;
      }
    }

    if (expediente.requisitosFaltantes.length > 0) {
      response += `### ❌ Requisitos Faltantes (Acción Requerida)\n\n`;
      expediente.requisitosFaltantes.forEach(req => {
        response += `- ${req}\n`;
      });
      response += '\n';
    }

    if (expediente.requisitosPendientesValidacion.length > 0) {
      response += `### ⏳ Pendientes de Validación\n\n`;
      expediente.requisitosPendientesValidacion.forEach(req => {
        response += `- ${req}\n`;
      });
      response += '\n';
    }

    response += `---\n\n¿Querés que genere el **informe estructurado** para este expediente? Escribí **"generar informe"** o consultá otro expediente.`;

    return response;
  }, []);

  const processUserInput = useCallback((input: string) => {
    const lowerInput = input.toLowerCase();
    let response = '';
    let nextStep: VerificationStep = currentStep;

    switch (currentStep) {
      case 'inicio':
      case 'resultado':
      case 'detalle':
        // Buscar expediente por número o seleccionar de ejemplos
        const matchedExp = EXPEDIENTES_SIMULADOS.find(exp => 
          lowerInput.includes(exp.numero?.toLowerCase() || '') ||
          lowerInput.includes('89234512') ||
          lowerInput.includes('91456789') ||
          lowerInput.includes('78123456')
        );

        if (matchedExp) {
          setSelectedExpediente(matchedExp);
          setTipoTramite(matchedExp.tipoTramite || 'Licencia TIC - Alta');
          response = generateVerificationResult(matchedExp);
          nextStep = 'resultado';
        } else if (lowerInput.includes('tic') || lowerInput.includes('licencia')) {
          // Simular expediente TIC
          const expTic = EXPEDIENTES_SIMULADOS[0];
          setSelectedExpediente(expTic);
          setTipoTramite('Licencia TIC - Alta');
          response = generateVerificationResult(expTic);
          nextStep = 'resultado';
        } else if (lowerInput.includes('audiovisual') || lowerInput.includes('señal')) {
          const expAudio = EXPEDIENTES_SIMULADOS[1];
          setSelectedExpediente(expAudio);
          setTipoTramite('Servicio Audiovisual - Registro');
          response = generateVerificationResult(expAudio);
          nextStep = 'resultado';
        } else if (lowerInput.includes('critico') || lowerInput.includes('vencido') || lowerInput.includes('urgente')) {
          const expCritico = EXPEDIENTES_SIMULADOS[2];
          setSelectedExpediente(expCritico);
          setTipoTramite('Licencia TIC - Alta');
          response = generateVerificationResult(expCritico);
          nextStep = 'resultado';
        } else if (lowerInput.includes('informe') || lowerInput.includes('generar')) {
          if (selectedExpediente) {
            nextStep = 'detalle';
            response = `✅ **Informe generado**

El informe estructurado del expediente **${selectedExpediente.numero}** está disponible a continuación.

Este informe puede utilizarse para:
- 📄 Generar providencia de intimación
- 📊 Reportar al área de control de gestión
- ⚠️ Activar alertas de silencio positivo

¿Necesitás verificar otro expediente?`;
            
            // Generar evaluación
            const totalReq = selectedExpediente.requisitosCumplidos.length + 
                            selectedExpediente.requisitosFaltantes.length + 
                            selectedExpediente.requisitosPendientesValidacion.length;
            const porcentaje = Math.round((selectedExpediente.requisitosCumplidos.length / totalReq) * 100);
            
            const evalData: RupecoEvaluationData = {
              tipoTramite: selectedExpediente.tipoTramite || 'Licencia TIC - Alta',
              tipoPersona: 'JURIDICA',
              responsable: {
                nombre: selectedExpediente.caratula?.split(' s/')[0] || 'Empresa S.A.',
                cuit: '30-71234567-9',
                domicilioLegal: 'Según constancia en expediente',
                telefono: 'Según constancia en expediente',
                email: 'Según constancia en expediente',
              },
              licenciaVinculada: selectedExpediente.numero,
              completitud: {
                porcentaje,
                camposFaltantes: [
                  ...selectedExpediente.requisitosFaltantes,
                  ...selectedExpediente.requisitosPendientesValidacion.map(r => `(Validar) ${r}`),
                ],
              },
              timestamp: new Date().toLocaleString('es-AR'),
            };
            setEvaluation(evalData);
          } else {
            response = 'Primero necesito que selecciones un expediente para generar el informe. ¿Cuál querés verificar?';
          }
        } else {
          // Input no reconocido
          response = `No encontré ese expediente. Podés probar con:

- **EX-2024-89234512-APN-ENACOM** (Licencia TIC - Riesgo Alto)
- **EX-2024-91456789-APN-ENACOM** (Audiovisual - Riesgo Medio)
- **EX-2024-78123456-APN-ENACOM** (Licencia TIC - Crítico/Vencido)

O escribí el tipo de trámite que querés simular.`;
        }
        break;

      case 'seleccion_expediente':
      case 'verificando':
        response = 'Procesando...';
        break;
    }

    setCurrentStep(nextStep);
    return response;
  }, [currentStep, selectedExpediente, setTipoTramite, generateVerificationResult]);

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
    simulateTyping(response);
  }, [isSystemActive, validateInput, processUserInput, simulateTyping]);

  const resetChat = useCallback(() => {
    setMessages([
      {
        id: generateId(),
        role: 'assistant',
        content: `¡Hola! 👋 Soy **Penélope**, tu asistente de verificación de expedientes.

Estoy aquí para ayudarte a **verificar el estado de cumplimiento** de los requisitos en trámites alcanzados por el silencio administrativo positivo.

Puedo analizar expedientes de:
- 📡 **Licencias TIC** (Res. ENACOM 40/2020)
- 📺 **Servicios Audiovisuales** (Ley 26.522)
- 📮 **Servicios Postales** (Ley 20.216)

**¿Qué expediente querés verificar?**

Podés ingresar el número de expediente (ej: EX-2024-89234512-APN-ENACOM) o elegir uno de los ejemplos:`,
        timestamp: new Date(),
      },
    ]);
    setCurrentStep('inicio');
    setSelectedExpediente(null);
    setEvaluation(null);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    resetChat,
    evaluation,
    isSystemActive,
  };
}
