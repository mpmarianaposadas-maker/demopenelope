import { useState, useCallback } from 'react';
import { Message } from '@/components/penelope/chat/ChatMessage';
import { RupecoEvaluationData } from '@/components/penelope/chat/RupecoEvaluation';
import { useTipoTramite } from '@/contexts/TipoTramiteContext';
import { useKillSwitch } from '@/contexts/KillSwitchContext';
import { useSecurityValidation } from '@/hooks/useSecurityValidation';

type ConversationStep = 
  | 'inicio' 
  | 'tipo_tramite' 
  | 'tipo_persona' 
  | 'identificacion' 
  | 'domicilio' 
  | 'contacto'
  | 'representacion'
  | 'societarios'
  | 'licencia'
  | 'confirmacion'
  | 'evaluacion';

interface CollectedData {
  tipoTramite?: string;
  tipoPersona?: 'HUMANA' | 'JURIDICA';
  nombre?: string;
  cuit?: string;
  domicilioLegal?: string;
  domicilioReal?: string;
  telefono?: string;
  email?: string;
  representante?: {
    nombre: string;
    dni: string;
    caracter: string;
  };
  datosSocietarios?: {
    tipoSociedad: string;
    fechaConstitucion: string;
    inscripcion: string;
  };
  licenciaVinculada?: string;
}

const SIMULATED_RESPONSES: Record<ConversationStep, string> = {
  inicio: `¡Hola! 👋 Soy el **Asistente RUPECO** del sistema Penélope.

Estoy aquí para guiarte en la recolección de datos para trámites ante ENACOM. Puedo ayudarte con:

- 📡 **Licencias TIC** (Altas, Bajas, Modificaciones)
- 📺 **Servicios Audiovisuales**
- 📮 **Servicios Postales**
- 📋 **Consultas RUPECO**

¿Qué tipo de trámite necesitás realizar hoy?`,

  tipo_tramite: `Perfecto, registré el tipo de trámite. 📝

Ahora necesito saber: ¿el responsable del trámite es una **persona humana** o una **persona jurídica** (empresa/sociedad)?`,

  tipo_persona: `Entendido. Ahora vamos a recolectar los datos de identificación.

Por favor, indicá:
- **Nombre completo** o **Razón social**
- **CUIT/CUIL**`,

  identificacion: `Excelente, tengo los datos de identificación. ✅

Ahora necesito el **domicilio legal** (el que figura en el estatuto o DNI) y opcionalmente el **domicilio real** si es diferente.

Formato sugerido: *Calle N°, Piso, Depto, Ciudad, Provincia, CP*`,

  domicilio: `Domicilio registrado correctamente. 📍

Ahora los datos de contacto:
- **Teléfono** (con código de área)
- **Email** de contacto`,

  contacto: `Contacto registrado. 📞📧

¿Existe un **representante legal o apoderado** que actúe en nombre del responsable?

Respondé **"Sí"** e indicá sus datos, o **"No"** si el responsable actúa por sí mismo.`,

  representacion: `Representación registrada. ✅

¿El trámite está vinculado a alguna **licencia o servicio** ya registrado en RUPECO?

Si es así, indicá el número de licencia o el nombre del servicio. Si no, escribí **"No"** o **"Nueva licencia"**.`,

  societarios: `Datos societarios registrados. 🏢

¿El trámite está vinculado a alguna **licencia o servicio** ya registrado en RUPECO?

Si es así, indicá el número de licencia. Si no, escribí **"Nueva licencia"**.`,

  licencia: `¡Muy bien! Ya tengo toda la información necesaria. 📋

Voy a generar un resumen de los datos recolectados para tu revisión. 

Escribí **"evaluar"** o **"listo"** para ver el resultado estructurado.`,

  confirmacion: `Generando evaluación estructurada de los datos RUPECO recolectados...`,

  evaluacion: `✅ **Evaluación completada**

Los datos han sido estructurados según el formato RUPECO. Este resumen puede ser utilizado para:

- Pre-cargar formularios de TAD
- Validar documentación contra RUPECO
- Iniciar el flujo de verificación automática

¿Necesitás iniciar otro trámite o tenés alguna consulta adicional?`,
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export function useChatRupecoSimulado() {
  const { setTipoTramite } = useTipoTramite();
  const { isSystemActive } = useKillSwitch();
  const { validateInput } = useSecurityValidation();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: SIMULATED_RESPONSES.inicio,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<ConversationStep>('inicio');
  const [collectedData, setCollectedData] = useState<CollectedData>({});
  const [evaluation, setEvaluation] = useState<RupecoEvaluationData | null>(null);

  const simulateTyping = useCallback((response: string, onComplete: () => void) => {
    setIsLoading(true);
    // Simular delay de "pensamiento"
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
      onComplete();
    }, 800 + Math.random() * 700);
  }, []);

  const processUserInput = useCallback((input: string) => {
    const lowerInput = input.toLowerCase();
    const newData = { ...collectedData };
    let nextStep: ConversationStep = currentStep;
    let response = '';

    switch (currentStep) {
      case 'inicio':
        // Detectar tipo de trámite
        if (lowerInput.includes('tic') || lowerInput.includes('licencia')) {
          newData.tipoTramite = 'Licencia TIC - Alta';
          setTipoTramite('Licencia TIC - Alta');
        } else if (lowerInput.includes('audiovisual') || lowerInput.includes('television')) {
          newData.tipoTramite = 'Servicio Audiovisual - Registro';
          setTipoTramite('Servicio Audiovisual - Registro');
        } else if (lowerInput.includes('postal') || lowerInput.includes('correo')) {
          newData.tipoTramite = 'Servicio Postal - Habilitación';
          setTipoTramite('Servicio Postal - Habilitación');
        } else if (lowerInput.includes('rupeco') || lowerInput.includes('consulta')) {
          newData.tipoTramite = 'Consulta RUPECO';
          setTipoTramite('Consulta RUPECO');
        } else {
          newData.tipoTramite = 'Licencia TIC - Alta';
          setTipoTramite('Licencia TIC - Alta');
        }
        nextStep = 'tipo_tramite';
        response = SIMULATED_RESPONSES.tipo_tramite;
        break;

      case 'tipo_tramite':
        if (lowerInput.includes('humana') || lowerInput.includes('fisica') || lowerInput.includes('persona')) {
          newData.tipoPersona = 'HUMANA';
        } else if (lowerInput.includes('juridica') || lowerInput.includes('empresa') || lowerInput.includes('sociedad')) {
          newData.tipoPersona = 'JURIDICA';
        } else {
          newData.tipoPersona = 'JURIDICA';
        }
        nextStep = 'tipo_persona';
        response = SIMULATED_RESPONSES.tipo_persona;
        break;

      case 'tipo_persona':
        // Extraer nombre y CUIT del input
        newData.nombre = input.split('\n')[0] || 'Empresa Demo S.A.';
        const cuitMatch = input.match(/\d{2}-?\d{8}-?\d/);
        newData.cuit = cuitMatch ? cuitMatch[0] : '30-12345678-9';
        nextStep = 'identificacion';
        response = SIMULATED_RESPONSES.identificacion;
        break;

      case 'identificacion':
        newData.domicilioLegal = input || 'Av. Corrientes 1234, Piso 5, CABA';
        nextStep = 'domicilio';
        response = SIMULATED_RESPONSES.domicilio;
        break;

      case 'domicilio':
        const lines = input.split('\n');
        newData.telefono = lines.find(l => l.match(/\d{2,4}[\s-]?\d{6,8}/)) || '011-4555-1234';
        newData.email = lines.find(l => l.includes('@')) || 'contacto@empresa.com.ar';
        nextStep = 'contacto';
        response = SIMULATED_RESPONSES.contacto;
        break;

      case 'contacto':
        if (lowerInput.includes('no')) {
          nextStep = newData.tipoPersona === 'JURIDICA' ? 'societarios' : 'representacion';
          response = newData.tipoPersona === 'JURIDICA' 
            ? `Entendido. Como es una persona jurídica, necesito algunos datos societarios:

- **Tipo de sociedad** (SA, SRL, SAS, etc.)
- **Fecha de constitución**
- **Datos de inscripción** (IGJ/Registro Provincial)`
            : SIMULATED_RESPONSES.representacion;
        } else {
          newData.representante = {
            nombre: 'Dr. Juan Pérez',
            dni: '25.123.456',
            caracter: 'Apoderado General',
          };
          nextStep = newData.tipoPersona === 'JURIDICA' ? 'societarios' : 'representacion';
          response = newData.tipoPersona === 'JURIDICA'
            ? `Representante registrado. ✅

Ahora necesito los datos societarios:
- **Tipo de sociedad** (SA, SRL, SAS, etc.)
- **Fecha de constitución**`
            : SIMULATED_RESPONSES.representacion;
        }
        break;

      case 'representacion':
        newData.licenciaVinculada = lowerInput.includes('no') || lowerInput.includes('nueva') 
          ? 'Nueva solicitud' 
          : input;
        nextStep = 'licencia';
        response = SIMULATED_RESPONSES.licencia;
        break;

      case 'societarios':
        newData.datosSocietarios = {
          tipoSociedad: input.match(/S\.?A\.?S?\.?|SRL|S\.?A\./i)?.[0]?.toUpperCase() || 'S.A.',
          fechaConstitucion: input.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)?.[0] || '15/03/2020',
          inscripcion: 'IGJ Matrícula 12345',
        };
        nextStep = 'licencia';
        response = SIMULATED_RESPONSES.societarios;
        break;

      case 'licencia':
        newData.licenciaVinculada = lowerInput.includes('no') || lowerInput.includes('nueva')
          ? 'Nueva solicitud'
          : input;
        if (lowerInput.includes('evaluar') || lowerInput.includes('listo')) {
          nextStep = 'evaluacion';
          response = SIMULATED_RESPONSES.evaluacion;
        } else {
          nextStep = 'confirmacion';
          response = SIMULATED_RESPONSES.licencia;
        }
        break;

      case 'confirmacion':
        nextStep = 'evaluacion';
        response = SIMULATED_RESPONSES.evaluacion;
        // Generar evaluación
        const evalData: RupecoEvaluationData = {
          tipoTramite: newData.tipoTramite || 'Licencia TIC - Alta',
          tipoPersona: newData.tipoPersona || 'JURIDICA',
          responsable: {
            nombre: newData.nombre || 'Empresa Demo S.A.',
            cuit: newData.cuit || '30-12345678-9',
            domicilioLegal: newData.domicilioLegal || 'Av. Corrientes 1234, CABA',
            telefono: newData.telefono || '011-4555-1234',
            email: newData.email || 'contacto@empresa.com.ar',
          },
          representante: newData.representante,
          datosSocietarios: newData.datosSocietarios,
          licenciaVinculada: newData.licenciaVinculada,
          completitud: {
            porcentaje: 85,
            camposFaltantes: ['Constancia AFIP actualizada', 'Estatuto certificado'],
          },
          timestamp: new Date().toLocaleString('es-AR'),
        };
        setEvaluation(evalData);
        break;

      case 'evaluacion':
        // Reiniciar conversación
        if (lowerInput.includes('nuevo') || lowerInput.includes('otro')) {
          nextStep = 'inicio';
          response = SIMULATED_RESPONSES.inicio;
          setEvaluation(null);
          setCollectedData({});
        } else {
          response = '¿Puedo ayudarte con algo más? Escribí **"nuevo trámite"** para comenzar de nuevo o hacé tu consulta.';
        }
        break;
    }

    setCollectedData(newData);
    setCurrentStep(nextStep);
    return response;
  }, [currentStep, collectedData, setTipoTramite]);

  const sendMessage = useCallback((content: string) => {
    if (!isSystemActive) {
      return;
    }

    // Validar seguridad
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
    simulateTyping(response, () => {
      // Check if we should show evaluation after this response
      if (currentStep === 'confirmacion' || 
          (currentStep === 'licencia' && content.toLowerCase().includes('evaluar'))) {
        const evalData: RupecoEvaluationData = {
          tipoTramite: collectedData.tipoTramite || 'Licencia TIC - Alta',
          tipoPersona: collectedData.tipoPersona || 'JURIDICA',
          responsable: {
            nombre: collectedData.nombre || 'Empresa Demo S.A.',
            cuit: collectedData.cuit || '30-12345678-9',
            domicilioLegal: collectedData.domicilioLegal || 'Av. Corrientes 1234, CABA',
            telefono: collectedData.telefono || '011-4555-1234',
            email: collectedData.email || 'contacto@empresa.com.ar',
          },
          representante: collectedData.representante,
          datosSocietarios: collectedData.datosSocietarios,
          licenciaVinculada: collectedData.licenciaVinculada,
          completitud: {
            porcentaje: 85,
            camposFaltantes: ['Constancia AFIP actualizada', 'Estatuto certificado'],
          },
          timestamp: new Date().toLocaleString('es-AR'),
        };
        setEvaluation(evalData);
      }
    });
  }, [isSystemActive, validateInput, processUserInput, simulateTyping, currentStep, collectedData]);

  const resetChat = useCallback(() => {
    setMessages([
      {
        id: generateId(),
        role: 'assistant',
        content: SIMULATED_RESPONSES.inicio,
        timestamp: new Date(),
      },
    ]);
    setCurrentStep('inicio');
    setCollectedData({});
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
