import { useState, useCallback } from 'react';
import { Message } from '@/components/penelope/chat/ChatMessage';
import { RupecoEvaluationData } from '@/components/penelope/chat/RupecoEvaluation';
import { useTipoTramite } from '@/contexts/TipoTramiteContext';
import { useKillSwitch } from '@/contexts/KillSwitchContext';
import { useSecurityValidation } from '@/hooks/useSecurityValidation';

// Bloques del flujo RUPECO
type RupecoStep = 
  | 'inicio'
  | 'tipo_tramite'
  | 'identificacion_responsable'
  | 'domicilios_contacto'
  | 'representacion'
  | 'datos_societarios'
  | 'licencia_servicio'
  | 'confirmacion'
  | 'evaluacion';

// Estructura del núcleo RUPECO
interface NucleoRupeco {
  tramite_enac: {
    codigo: string | null;
    categoria: 'TIC' | 'audiovisual' | 'postal' | 'rupeco' | null;
    descripcion_libre: string;
  };
  identificacion_responsable: {
    tipo_persona: 'humana' | 'juridica' | null;
    nombre_razon_social: string | null;
    tipo_documento: string | null;
    numero_documento: string | null;
    cuit_cuil: string | null;
  };
  domicilios_contacto: {
    domicilio_legal_real: string | null;
    domicilio_servicios: string | null;
    telefono: string | null;
    email: string | null;
  };
  representacion: {
    actua_en_nombre_propio: boolean | null;
    nombre_representante: string | null;
    documento_representante: string | null;
    cuit_representante: string | null;
    tipo_instrumento: string | null;
    datos_instrumento: string | null;
  };
  datos_societarios: {
    aplica: boolean;
    tipo_societario: string | null;
    fecha_constitucion: string | null;
    autoridad_registro: string | null;
    estatuto_vigente: string | null;
    autoridades_vigentes: string | null;
  };
  licencia_servicio: {
    numero_licencia: string | null;
    tipo_tramite_actual: string | null;
    estado_servicio: string | null;
  };
}

// Códigos ENAC por categoría
const CODIGOS_ENAC = {
  TIC: ['ENAC00062', 'ENAC00063', 'ENAC00066', 'ENAC00083', 'ENAC00084', 'ENAC00099', 'ENAC00100', 'ENAC00101'],
  audiovisual: ['ENAC00025', 'ENAC00052', 'ENAC00053', 'ENAC00104', 'ENAC00109', 'ENAC00208', 'ENAC00209'],
  postal: ['ENAC00013'],
  rupeco: ['ENAC00078', 'ENAC00117', 'ENAC00119'],
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const createInitialNucleo = (): NucleoRupeco => ({
  tramite_enac: { codigo: null, categoria: null, descripcion_libre: '' },
  identificacion_responsable: {
    tipo_persona: null,
    nombre_razon_social: null,
    tipo_documento: null,
    numero_documento: null,
    cuit_cuil: null,
  },
  domicilios_contacto: {
    domicilio_legal_real: null,
    domicilio_servicios: null,
    telefono: null,
    email: null,
  },
  representacion: {
    actua_en_nombre_propio: null,
    nombre_representante: null,
    documento_representante: null,
    cuit_representante: null,
    tipo_instrumento: null,
    datos_instrumento: null,
  },
  datos_societarios: {
    aplica: false,
    tipo_societario: null,
    fecha_constitucion: null,
    autoridad_registro: null,
    estatuto_vigente: null,
    autoridades_vigentes: null,
  },
  licencia_servicio: {
    numero_licencia: null,
    tipo_tramite_actual: null,
    estado_servicio: null,
  },
});

const MENSAJE_INICIAL = `¡Hola! 👋 Soy **Penélope**, asistente del Proyecto RUPECO para ENACOM.

Estoy aquí para ayudarte a **relevar el núcleo documental RUPECO** y evaluar si los datos están completos para una inscripción o actualización en el Registro.

Trabajo con trámites de:
- 📡 **TIC** (ENAC00062, ENAC00063, ENAC00066, ENAC00083, ENAC00084, ENAC00099, ENAC00100, ENAC00101)
- 📺 **Audiovisual** (ENAC00025, ENAC00052, ENAC00053, ENAC00104, ENAC00109, ENAC00208, ENAC00209)
- 📮 **Postal** (ENAC00013)
- 📋 **RUPECO directo** (ENAC00078, ENAC00117, ENAC00119)

---

**BLOQUE 1: TIPO DE TRÁMITE**

¿Qué tipo de trámite estás trabajando?
1. TIC
2. Audiovisual
3. Postal
4. RUPECO directo

Si conocés el código ENAC, indicalo. Si no, elegí la categoría.`;

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
  const [currentStep, setCurrentStep] = useState<RupecoStep>('tipo_tramite');
  const [nucleo, setNucleo] = useState<NucleoRupeco>(createInitialNucleo());
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
    }, 400 + Math.random() * 300);
  }, []);

  const detectCategoria = (input: string): 'TIC' | 'audiovisual' | 'postal' | 'rupeco' | null => {
    const upper = input.toUpperCase();
    
    // Buscar código ENAC específico
    for (const [cat, codigos] of Object.entries(CODIGOS_ENAC)) {
      for (const codigo of codigos) {
        if (upper.includes(codigo)) {
          return cat as 'TIC' | 'audiovisual' | 'postal' | 'rupeco';
        }
      }
    }
    
    // Detectar por palabra clave
    if (upper.includes('TIC') || upper.includes('TELECOMUNICACION') || upper.includes('INTERNET') || upper.includes('1')) {
      return 'TIC';
    }
    if (upper.includes('AUDIOVISUAL') || upper.includes('TELEVISION') || upper.includes('RADIO') || upper.includes('SEÑAL') || upper.includes('2')) {
      return 'audiovisual';
    }
    if (upper.includes('POSTAL') || upper.includes('CORREO') || upper.includes('ENCOMIENDA') || upper.includes('3')) {
      return 'postal';
    }
    if (upper.includes('RUPECO') || upper.includes('REGISTRO') || upper.includes('4')) {
      return 'rupeco';
    }
    
    return null;
  };

  const extractCodigoENAC = (input: string): string | null => {
    const match = input.toUpperCase().match(/ENAC\d{5}/);
    return match ? match[0] : null;
  };

  const generateEvaluationJSON = useCallback(() => {
    const evaluarBloque = (datos: Record<string, unknown>, camposRequeridos: string[]) => {
      const faltantes: string[] = [];
      for (const campo of camposRequeridos) {
        if (datos[campo] === null || datos[campo] === '' || datos[campo] === undefined) {
          faltantes.push(campo);
        }
      }
      return {
        datos,
        completo: faltantes.length === 0,
        faltantes,
      };
    };

    const identificacion = evaluarBloque(
      nucleo.identificacion_responsable,
      ['tipo_persona', 'nombre_razon_social', 'cuit_cuil']
    );

    const domicilios = evaluarBloque(
      nucleo.domicilios_contacto,
      ['domicilio_legal_real', 'telefono', 'email']
    );

    const representacion = evaluarBloque(
      nucleo.representacion,
      nucleo.representacion.actua_en_nombre_propio === false 
        ? ['nombre_representante', 'documento_representante', 'tipo_instrumento']
        : ['actua_en_nombre_propio']
    );

    const societarios = nucleo.datos_societarios.aplica
      ? evaluarBloque(
          nucleo.datos_societarios,
          ['tipo_societario', 'fecha_constitucion', 'autoridad_registro']
        )
      : { datos: nucleo.datos_societarios, completo: true, faltantes: [], aplica: false };

    const licencia = evaluarBloque(
      nucleo.licencia_servicio,
      ['tipo_tramite_actual']
    );

    const bloquesIncompletos: string[] = [];
    if (!identificacion.completo) bloquesIncompletos.push('identificacion_responsable');
    if (!domicilios.completo) bloquesIncompletos.push('domicilios_contacto');
    if (!representacion.completo) bloquesIncompletos.push('representacion');
    if (nucleo.datos_societarios.aplica && !societarios.completo) bloquesIncompletos.push('datos_societarios');
    if (!licencia.completo) bloquesIncompletos.push('licencia_servicio_vinculado');

    return {
      tramite_enac: nucleo.tramite_enac,
      nucleo_rupeco: {
        identificacion_responsable: identificacion,
        domicilios_contacto: domicilios,
        representacion: representacion,
        datos_societarios: { ...societarios, aplica: nucleo.datos_societarios.aplica },
        licencia_servicio_vinculado: licencia,
      },
      evaluacion_global: {
        todos_los_bloques_completos: bloquesIncompletos.length === 0,
        bloques_incompletos: bloquesIncompletos,
      },
    };
  }, [nucleo]);

  const processUserInput = useCallback((input: string) => {
    const lowerInput = input.toLowerCase().trim();
    let response = '';
    let nextStep: RupecoStep = currentStep;
    const updatedNucleo = { ...nucleo };

    // Detectar comando de evaluación
    if (lowerInput.includes('listo') || lowerInput.includes('ya te di todo') || lowerInput.includes('evaluar') || lowerInput.includes('terminar')) {
      const evalJSON = generateEvaluationJSON();
      response = '```json\n' + JSON.stringify(evalJSON, null, 2) + '\n```';
      nextStep = 'evaluacion';
      
      // Generar RupecoEvaluationData para el componente visual
      const totalCampos = 12;
      const camposCompletos = Object.values(evalJSON.nucleo_rupeco).reduce((acc, bloque) => {
        if ('faltantes' in bloque) {
          return acc + (Object.keys(bloque.datos).length - bloque.faltantes.length);
        }
        return acc;
      }, 0);
      
      const evalData: RupecoEvaluationData = {
        tipoTramite: nucleo.tramite_enac.descripcion_libre || nucleo.tramite_enac.categoria || 'Sin especificar',
        tipoPersona: nucleo.identificacion_responsable.tipo_persona === 'humana' ? 'HUMANA' : 'JURIDICA',
        responsable: {
          nombre: nucleo.identificacion_responsable.nombre_razon_social || 'Sin especificar',
          cuit: nucleo.identificacion_responsable.cuit_cuil || 'Sin especificar',
          domicilioLegal: nucleo.domicilios_contacto.domicilio_legal_real || 'Sin especificar',
          telefono: nucleo.domicilios_contacto.telefono || 'Sin especificar',
          email: nucleo.domicilios_contacto.email || 'Sin especificar',
        },
        representante: nucleo.representacion.actua_en_nombre_propio === false ? {
          nombre: nucleo.representacion.nombre_representante || 'Sin especificar',
          dni: nucleo.representacion.documento_representante || 'Sin especificar',
          caracter: nucleo.representacion.tipo_instrumento || 'Sin especificar',
        } : undefined,
        datosSocietarios: nucleo.datos_societarios.aplica ? {
          tipoSociedad: nucleo.datos_societarios.tipo_societario || 'Sin especificar',
          fechaConstitucion: nucleo.datos_societarios.fecha_constitucion || 'Sin especificar',
          inscripcion: nucleo.datos_societarios.autoridad_registro || 'Sin especificar',
        } : undefined,
        licenciaVinculada: nucleo.licencia_servicio.numero_licencia || nucleo.tramite_enac.codigo || undefined,
        completitud: {
          porcentaje: Math.round((camposCompletos / totalCampos) * 100),
          camposFaltantes: evalJSON.evaluacion_global.bloques_incompletos,
        },
        timestamp: new Date().toLocaleString('es-AR'),
      };
      setEvaluation(evalData);
      setNucleo(updatedNucleo);
      setCurrentStep(nextStep);
      return response;
    }

    switch (currentStep) {
      case 'tipo_tramite': {
        const categoria = detectCategoria(input);
        const codigo = extractCodigoENAC(input);
        
        if (categoria) {
          updatedNucleo.tramite_enac.categoria = categoria;
          updatedNucleo.tramite_enac.codigo = codigo;
          updatedNucleo.tramite_enac.descripcion_libre = input;
          setTipoTramite(categoria === 'TIC' ? 'Licencia TIC' : categoria === 'audiovisual' ? 'Servicio Audiovisual' : categoria === 'postal' ? 'Servicio Postal' : 'RUPECO');
          
          response = `✅ **Registrado:** Trámite de categoría **${categoria.toUpperCase()}**${codigo ? ` (${codigo})` : ''}.

---

**BLOQUE 2: IDENTIFICACIÓN DEL RESPONSABLE**

Necesito los siguientes datos:
1. ¿Es **persona humana** o **persona jurídica**?
2. Nombre y apellido (PH) o razón social (PJ)
3. CUIT/CUIL

Por favor, indicá estos datos.`;
          nextStep = 'identificacion_responsable';
        } else {
          response = `No pude identificar la categoría del trámite. Por favor indicá:
- **TIC** (ej: ENAC00062)
- **Audiovisual** (ej: ENAC00025)
- **Postal** (ej: ENAC00013)
- **RUPECO** (ej: ENAC00078)

O simplemente escribí el número 1, 2, 3 o 4.`;
        }
        break;
      }

      case 'identificacion_responsable': {
        // Detectar tipo de persona
        if (lowerInput.includes('humana') || lowerInput.includes('fisica') || lowerInput.includes('físico')) {
          updatedNucleo.identificacion_responsable.tipo_persona = 'humana';
          updatedNucleo.datos_societarios.aplica = false;
        } else if (lowerInput.includes('juridica') || lowerInput.includes('jurídica') || lowerInput.includes('empresa') || lowerInput.includes('sociedad')) {
          updatedNucleo.identificacion_responsable.tipo_persona = 'juridica';
          updatedNucleo.datos_societarios.aplica = true;
        }

        // Extraer CUIT (formato XX-XXXXXXXX-X)
        const cuitMatch = input.match(/\d{2}-?\d{8}-?\d/);
        if (cuitMatch) {
          updatedNucleo.identificacion_responsable.cuit_cuil = cuitMatch[0];
        }

        // Extraer nombre (texto después de "nombre:" o similar, o texto largo)
        const nombreMatch = input.match(/(?:nombre|razón social|razon social)[:\s]+([^,\n]+)/i);
        if (nombreMatch) {
          updatedNucleo.identificacion_responsable.nombre_razon_social = nombreMatch[1].trim();
        } else {
          // Intentar extraer nombre de palabras capitalizadas
          const palabras = input.split(/[,\n]/).find(p => p.trim().length > 3 && !p.match(/\d{2}-?\d{8}-?\d/) && !p.toLowerCase().includes('persona'));
          if (palabras) {
            updatedNucleo.identificacion_responsable.nombre_razon_social = palabras.trim();
          }
        }

        const tipoPersona = updatedNucleo.identificacion_responsable.tipo_persona;
        const nombre = updatedNucleo.identificacion_responsable.nombre_razon_social;
        const cuit = updatedNucleo.identificacion_responsable.cuit_cuil;

        response = `✅ **Datos registrados:**
- Tipo de persona: ${tipoPersona || '❓ Falta indicar'}
- Nombre/Razón social: ${nombre || '❓ Falta indicar'}
- CUIT/CUIL: ${cuit || '❓ Falta indicar'}

${(!tipoPersona || !nombre || !cuit) ? '⚠️ Faltan datos. Por favor completá lo que falta.\n\n' : ''}---

**BLOQUE 3: DOMICILIOS Y CONTACTO**

Indicá:
1. Domicilio ${tipoPersona === 'humana' ? 'real' : 'legal'}
2. Domicilio donde se prestan los servicios (si aplica)
3. Teléfono de contacto
4. Correo electrónico`;
        nextStep = 'domicilios_contacto';
        break;
      }

      case 'domicilios_contacto': {
        // Extraer email
        const emailMatch = input.match(/[\w.-]+@[\w.-]+\.\w+/);
        if (emailMatch) {
          updatedNucleo.domicilios_contacto.email = emailMatch[0];
        }

        // Extraer teléfono
        const telMatch = input.match(/(?:\+54\s?)?(?:11|[2-9]\d{2,3})[-\s]?\d{3,4}[-\s]?\d{4}/);
        if (telMatch) {
          updatedNucleo.domicilios_contacto.telefono = telMatch[0];
        }

        // Extraer domicilio (línea que contiene calle/número)
        const domMatch = input.match(/(?:domicilio|calle|av\.|avenida)[:\s]*([^,\n]+(?:\d+[^,\n]*)?)/i);
        if (domMatch) {
          updatedNucleo.domicilios_contacto.domicilio_legal_real = domMatch[1].trim();
        } else {
          // Buscar cualquier texto que parezca dirección
          const posibleDom = input.split(/[,\n]/).find(p => p.match(/\d+/) && p.length > 10);
          if (posibleDom) {
            updatedNucleo.domicilios_contacto.domicilio_legal_real = posibleDom.trim();
          }
        }

        response = `✅ **Datos registrados:**
- Domicilio: ${updatedNucleo.domicilios_contacto.domicilio_legal_real || '❓ Falta indicar'}
- Teléfono: ${updatedNucleo.domicilios_contacto.telefono || '❓ Falta indicar'}
- Email: ${updatedNucleo.domicilios_contacto.email || '❓ Falta indicar'}

---

**BLOQUE 4: REPRESENTACIÓN**

¿El responsable actúa en **nombre propio** o a través de un **representante**?

Si hay representante, indicá:
- Nombre del representante
- Documento
- Tipo de instrumento (poder, acta societaria, etc.)`;
        nextStep = 'representacion';
        break;
      }

      case 'representacion': {
        if (lowerInput.includes('propio') || lowerInput.includes('titular') || lowerInput.includes('no hay representante') || lowerInput.includes('sin representante')) {
          updatedNucleo.representacion.actua_en_nombre_propio = true;
        } else if (lowerInput.includes('representante') || lowerInput.includes('apoderado') || lowerInput.includes('poder')) {
          updatedNucleo.representacion.actua_en_nombre_propio = false;
          
          // Extraer nombre del representante
          const repMatch = input.match(/(?:representante|apoderado)[:\s]*([^,\n]+)/i);
          if (repMatch) {
            updatedNucleo.representacion.nombre_representante = repMatch[1].trim();
          }
          
          // Extraer tipo de instrumento
          if (lowerInput.includes('poder')) {
            updatedNucleo.representacion.tipo_instrumento = 'Poder';
          } else if (lowerInput.includes('acta')) {
            updatedNucleo.representacion.tipo_instrumento = 'Acta societaria';
          }
        }

        const esPJ = updatedNucleo.datos_societarios.aplica;
        
        response = `✅ **Registrado:** ${updatedNucleo.representacion.actua_en_nombre_propio ? 'Actúa en nombre propio' : `Representante: ${updatedNucleo.representacion.nombre_representante || 'indicar datos'}`}

---

${esPJ ? `**BLOQUE 5: DATOS SOCIETARIOS**

Como es persona jurídica, necesito:
1. Tipo societario (SA, SRL, asociación civil, cooperativa, etc.)
2. Fecha de constitución
3. Autoridad de registro (IGJ u otra)
4. ¿Estatuto vigente?
5. Autoridades actuales (directorio, administrador)` : `**BLOQUE 5: LICENCIA/SERVICIO VINCULADO**

Indicá:
1. ¿Tenés número de licencia o registro existente?
2. Tipo de trámite actual (obtención, modificación, renovación, transferencia, etc.)
3. Estado del servicio (vigente, en trámite, baja)`}`;
        
        nextStep = esPJ ? 'datos_societarios' : 'licencia_servicio';
        break;
      }

      case 'datos_societarios': {
        // Detectar tipo societario
        if (lowerInput.includes('s.a.') || lowerInput.includes(' sa ') || lowerInput.includes('sociedad anónima') || lowerInput.includes('anonima')) {
          updatedNucleo.datos_societarios.tipo_societario = 'Sociedad Anónima (S.A.)';
        } else if (lowerInput.includes('s.r.l') || lowerInput.includes('srl') || lowerInput.includes('responsabilidad limitada')) {
          updatedNucleo.datos_societarios.tipo_societario = 'S.R.L.';
        } else if (lowerInput.includes('cooperativa')) {
          updatedNucleo.datos_societarios.tipo_societario = 'Cooperativa';
        } else if (lowerInput.includes('asociación') || lowerInput.includes('asociacion') || lowerInput.includes('civil')) {
          updatedNucleo.datos_societarios.tipo_societario = 'Asociación Civil';
        } else if (lowerInput.includes('s.a.s') || lowerInput.includes('sas') || lowerInput.includes('simplificada')) {
          updatedNucleo.datos_societarios.tipo_societario = 'S.A.S.';
        }

        // Detectar autoridad de registro
        if (lowerInput.includes('igj')) {
          updatedNucleo.datos_societarios.autoridad_registro = 'IGJ';
        } else if (lowerInput.includes('dppj') || lowerInput.includes('provincia')) {
          updatedNucleo.datos_societarios.autoridad_registro = 'DPPJ Provincial';
        }

        // Extraer fecha
        const fechaMatch = input.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}/);
        if (fechaMatch) {
          updatedNucleo.datos_societarios.fecha_constitucion = fechaMatch[0];
        }

        response = `✅ **Datos societarios registrados:**
- Tipo: ${updatedNucleo.datos_societarios.tipo_societario || '❓ Falta indicar'}
- Constitución: ${updatedNucleo.datos_societarios.fecha_constitucion || '❓ Falta indicar'}
- Registro: ${updatedNucleo.datos_societarios.autoridad_registro || '❓ Falta indicar'}

---

**BLOQUE 6: LICENCIA/SERVICIO VINCULADO**

Indicá:
1. ¿Tenés número de licencia o registro existente?
2. Tipo de trámite actual (obtención, modificación, renovación, transferencia, etc.)
3. Estado del servicio (vigente, en trámite, baja)`;
        nextStep = 'licencia_servicio';
        break;
      }

      case 'licencia_servicio': {
        // Extraer número de licencia
        const licMatch = input.match(/(?:licencia|registro)[:\s#]*(\d+[-\/]?\d*)/i);
        if (licMatch) {
          updatedNucleo.licencia_servicio.numero_licencia = licMatch[1];
        }

        // Detectar tipo de trámite
        if (lowerInput.includes('obtención') || lowerInput.includes('obtencion') || lowerInput.includes('alta') || lowerInput.includes('nuevo')) {
          updatedNucleo.licencia_servicio.tipo_tramite_actual = 'Obtención';
        } else if (lowerInput.includes('modificación') || lowerInput.includes('modificacion')) {
          updatedNucleo.licencia_servicio.tipo_tramite_actual = 'Modificación';
        } else if (lowerInput.includes('renovación') || lowerInput.includes('renovacion')) {
          updatedNucleo.licencia_servicio.tipo_tramite_actual = 'Renovación';
        } else if (lowerInput.includes('transferencia')) {
          updatedNucleo.licencia_servicio.tipo_tramite_actual = 'Transferencia';
        } else if (lowerInput.includes('baja') || lowerInput.includes('renuncia')) {
          updatedNucleo.licencia_servicio.tipo_tramite_actual = 'Baja/Renuncia';
        }

        // Detectar estado
        if (lowerInput.includes('vigente')) {
          updatedNucleo.licencia_servicio.estado_servicio = 'Vigente';
        } else if (lowerInput.includes('trámite') || lowerInput.includes('tramite')) {
          updatedNucleo.licencia_servicio.estado_servicio = 'En trámite';
        }

        response = `✅ **Licencia/Servicio registrado:**
- Nº Licencia: ${updatedNucleo.licencia_servicio.numero_licencia || 'No indicado'}
- Tipo de trámite: ${updatedNucleo.licencia_servicio.tipo_tramite_actual || '❓ Falta indicar'}
- Estado: ${updatedNucleo.licencia_servicio.estado_servicio || 'No indicado'}

---

**✅ RELEVAMIENTO COMPLETO**

He registrado todos los bloques del núcleo RUPECO. 

Para generar la **evaluación estructurada** en formato JSON, escribí:
- **"listo"**
- **"evaluar requisitos"**
- **"terminar"**

¿Querés modificar algún dato antes de evaluar?`;
        nextStep = 'confirmacion';
        break;
      }

      case 'confirmacion':
      case 'evaluacion': {
        // Si no es comando de evaluación, permitir modificaciones
        if (lowerInput.includes('modificar') || lowerInput.includes('cambiar') || lowerInput.includes('corregir')) {
          response = `¿Qué bloque querés modificar?
1. Tipo de trámite
2. Identificación del responsable
3. Domicilios y contacto
4. Representación
5. Datos societarios
6. Licencia/Servicio

Indicá el número o nombre del bloque.`;
        } else {
          response = `Escribí **"listo"** o **"evaluar"** para generar el JSON de evaluación.

Si querés modificar algo, indicá qué bloque: identificación, domicilios, representación, societarios o licencia.`;
        }
        break;
      }

      default:
        response = MENSAJE_INICIAL;
        nextStep = 'tipo_tramite';
    }

    setNucleo(updatedNucleo);
    setCurrentStep(nextStep);
    return response;
  }, [currentStep, nucleo, setTipoTramite, generateEvaluationJSON]);

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
        content: MENSAJE_INICIAL,
        timestamp: new Date(),
      },
    ]);
    setCurrentStep('tipo_tramite');
    setNucleo(createInitialNucleo());
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
