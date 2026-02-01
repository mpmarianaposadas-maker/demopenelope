import { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  HelpCircle, 
  AlertCircle, 
  FileWarning, 
  Users, 
  Building2, 
  RefreshCcw, 
  FileText,
  Copy,
  Check,
  Info,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Categorías de errores RUPECO/TAD según documentación
export type CategoriaErrorRupeco = 
  | 'inconsistencia_datos'
  | 'apoderados_titular'
  | 'documentacion_ilegible'
  | 'subsanacion_infinita'
  | 'otro';

interface CategoriaInfo {
  codigo: CategoriaErrorRupeco;
  nombre: string;
  descripcion: string;
  icon: React.ReactNode;
  explicacionTecnica: string;
  pasosAdministrado: string[];
}

const CATEGORIAS_ERRORES: CategoriaInfo[] = [
  {
    codigo: 'inconsistencia_datos',
    nombre: 'Inconsistencia de datos tributarios',
    descripcion: 'Diferencias entre ARCA, TAD, GDE y RUPECO en denominación o datos fiscales',
    icon: <Building2 className="h-5 w-5" />,
    explicacionTecnica: 'El sistema detectó que la razón social o CUIT registrado en ARCA no coincide con los datos cargados en TAD o el expediente GDE. Esto puede deberse a un cambio reciente de denominación no actualizado en TAD, o a un error de tipeo al cargar el trámite.',
    pasosAdministrado: [
      'Verificar la constancia de CUIT vigente en ARCA (antes AFIP).',
      'Comparar la denominación exacta con la registrada en TAD.',
      'Si hay diferencias, utilizar la función "Actualizar datos" en TAD para sincronizar con ARCA.',
      'Reiniciar el trámite con los datos corregidos.',
    ],
  },
  {
    codigo: 'apoderados_titular',
    nombre: 'Problemas de apoderados / titular',
    descripcion: 'El apoderado no está correctamente configurado o el titular del trámite es incorrecto',
    icon: <Users className="h-5 w-5" />,
    explicacionTecnica: 'El trámite fue iniciado por una persona física a nombre propio, pero corresponde a una persona jurídica. Alternativamente, el poder de representación no está registrado en TAD o venció. La plataforma no reconoce al iniciador como representante válido de la PJ.',
    pasosAdministrado: [
      'Verificar que el poder de representación esté vigente y cargado en TAD.',
      'En TAD, seleccionar "Actuar en representación de" y elegir la persona jurídica correspondiente.',
      'Si el poder no está cargado, agregarlo desde la sección "Mis poderes" antes de continuar.',
      'Reiniciar el trámite actuando en representación de la PJ.',
    ],
  },
  {
    codigo: 'documentacion_ilegible',
    nombre: 'Documentación ilegible/incompleta',
    descripcion: 'PDFs escaneados con mala calidad, páginas faltantes o archivos corruptos',
    icon: <FileWarning className="h-5 w-5" />,
    explicacionTecnica: 'El documento adjunto no puede ser procesado correctamente. Puede tratarse de un escaneo de baja resolución, un PDF de múltiples archivos con páginas saltadas, o un archivo dañado. El OCR del sistema no logra extraer el texto necesario.',
    pasosAdministrado: [
      'Verificar que el documento original esté completo (todas las páginas).',
      'Escanear nuevamente con resolución mínima de 300 DPI.',
      'Unificar todas las páginas en un único archivo PDF.',
      'Verificar que el archivo no esté protegido con contraseña.',
      'Subir el nuevo archivo reemplazando el anterior.',
    ],
  },
  {
    codigo: 'subsanacion_infinita',
    nombre: 'Subsanación que no finaliza',
    descripcion: 'La tarea de subsanación permanece abierta aunque se cargaron los documentos',
    icon: <RefreshCcw className="h-5 w-5" />,
    explicacionTecnica: 'El administrado cargó los documentos de subsanación pero no finalizó la tarea en TAD. La plataforma requiere que después de adjuntar los archivos, se presione el botón "Enviar" o "Confirmar" para cerrar la tarea y reenviarla al organismo.',
    pasosAdministrado: [
      'Ingresar a TAD con el CUIT correspondiente.',
      'Ir a "Mis trámites" y localizar el expediente.',
      'Verificar que la tarea de subsanación esté en estado "Pendiente de envío".',
      'Revisar que todos los documentos requeridos estén adjuntos.',
      'Presionar el botón "Enviar" o "Confirmar" para finalizar la tarea.',
      'Verificar que el estado cambie a "Enviado" o "En trámite".',
    ],
  },
  {
    codigo: 'otro',
    nombre: 'Otro error',
    descripcion: 'Error no clasificado en las categorías anteriores',
    icon: <AlertCircle className="h-5 w-5" />,
    explicacionTecnica: 'El problema reportado no corresponde a las categorías típicas. Se requiere análisis adicional por parte del equipo técnico o derivación a mesa de ayuda.',
    pasosAdministrado: [
      'Documentar el error con capturas de pantalla.',
      'Anotar el número de expediente y la etapa del trámite.',
      'Contactar a mesa de ayuda de ENACOM para asistencia especializada.',
    ],
  },
];

// Tipos de trámite disponibles para demo
const TIPOS_TRAMITE_DEMO = [
  'Licencia TIC - Alta nueva',
  'Autorización de servicios audiovisuales',
  'Modificación societaria TIC',
  'Actualización de datos RUPECO',
  'Habilitación de servicios postales',
];

// Nombres de empresas ficticios para demo
const EMPRESAS_DEMO = [
  'Comunicaciones Patagónicas S.R.L.',
  'TeleSur Argentina S.A.',
  'Conectividad Federal S.A.S.',
  'Red Digital del Litoral S.A.',
  'Servicios Multimediales Andinos S.R.L.',
  'Fibra Óptica del NOA S.A.',
  'Telecomunicaciones del Plata S.A.',
  'Internet Cuyo S.R.L.',
];

// Genera datos aleatorios para demo
function generarDatosDemo() {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  const expedienteNumero = `EX-2026-${randomNum.toString().padStart(8, '0')}-APN-DNLTC`;
  const tipoTramite = TIPOS_TRAMITE_DEMO[Math.floor(Math.random() * TIPOS_TRAMITE_DEMO.length)];
  const empresaNombre = EMPRESAS_DEMO[Math.floor(Math.random() * EMPRESAS_DEMO.length)];
  
  return { expedienteNumero, tipoTramite, empresaNombre };
}

export function AsistenteRupecoTAD() {
  // Datos aleatorios para demo (se generan una vez al montar)
  const datosDemo = useMemo(() => generarDatosDemo(), []);
  
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaErrorRupeco | null>(null);
  const [descripcionProblema, setDescripcionProblema] = useState('');
  const [mostrarBorrador, setMostrarBorrador] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  
  const formRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const categoriaInfo = CATEGORIAS_ERRORES.find(c => c.codigo === categoriaSeleccionada);

  // Ocultar indicador de scroll cuando el usuario hace scroll
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    
    const handleScroll = () => {
      if (content.scrollTop > 50) {
        setShowScrollHint(false);
      }
    };
    
    content.addEventListener('scroll', handleScroll);
    return () => content.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll suave al seleccionar categoría
  const handleCategoriaClick = (codigo: CategoriaErrorRupeco) => {
    setCategoriaSeleccionada(codigo);
    setMostrarBorrador(false);
    
    // Esperar un tick para que el contenido se renderice
    setTimeout(() => {
      formRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const generarBorradorSubsanacion = (): string => {
    if (!categoriaInfo) return '';

    const fecha = new Date().toLocaleDateString('es-AR');
    const pasos = categoriaInfo.pasosAdministrado.map((p, i) => `${i + 1}. ${p}`).join('\n');

    return `NOTA DE SUBSANACIÓN

Expediente: ${datosDemo.expedienteNumero}
Fecha: ${fecha}

De nuestra consideración:

En relación al trámite de ${datosDemo.tipoTramite} iniciado por ${datosDemo.empresaNombre}, se ha detectado la siguiente observación:

**Categoría del problema:** ${categoriaInfo.nombre}

**Descripción:**
${descripcionProblema || categoriaInfo.descripcion}

**Acciones requeridas:**
${pasos}

Una vez realizadas las acciones indicadas, la información será nuevamente analizada por este organismo.

Sin otro particular, saluda atentamente.

---
ENACOM - Ente Nacional de Comunicaciones
Este documento es un borrador generado automáticamente. Requiere revisión y aprobación del agente antes de su envío.`;
  };

  const copiarBorrador = async () => {
    const borrador = generarBorradorSubsanacion();
    await navigator.clipboard.writeText(borrador);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <Card className="border-2 border-amber-200 bg-amber-50/30 relative">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-amber-100">
            <HelpCircle className="h-5 w-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg text-amber-900">
              🛠️ Asistente RUPECO/TAD
            </CardTitle>
            <p className="text-xs text-amber-700 mt-1">
              Clasificación y resolución de errores comunes
            </p>
          </div>
          {/* Badge de demo */}
          <Badge variant="secondary" className="text-xs bg-amber-200 text-amber-800">
            Demo
          </Badge>
        </div>
      </CardHeader>

      <CardContent 
        ref={contentRef}
        className="space-y-4 max-h-[70vh] overflow-y-auto scroll-smooth relative"
      >
        {/* Selector de categoría */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            1. Seleccione la categoría del problema:
          </label>
          <div className="grid gap-2">
            {CATEGORIAS_ERRORES.map((cat) => (
              <button
                key={cat.codigo}
                onClick={() => handleCategoriaClick(cat.codigo)}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border text-left transition-all",
                  categoriaSeleccionada === cat.codigo
                    ? "border-amber-500 bg-amber-100"
                    : "border-border bg-background hover:border-amber-300"
                )}
              >
                <div className={cn(
                  "p-2 rounded-full shrink-0",
                  categoriaSeleccionada === cat.codigo ? "bg-amber-200" : "bg-muted"
                )}>
                  {cat.icon}
                </div>
                <div>
                  <div className="font-medium text-sm">{cat.nombre}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {cat.descripcion}
                  </div>
                </div>
                {categoriaSeleccionada === cat.codigo && (
                  <ChevronRight className="h-4 w-4 text-amber-600 ml-auto shrink-0 self-center" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Indicador de scroll */}
        {showScrollHint && !categoriaSeleccionada && (
          <div className="flex flex-col items-center justify-center py-2 text-muted-foreground animate-bounce">
            <ChevronDown className="h-5 w-5" />
            <span className="text-xs">Seleccione una categoría</span>
          </div>
        )}

        {/* Explicación técnica y formulario */}
        {categoriaInfo && (
          <div ref={formRef} className="space-y-4 pt-2">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm text-blue-900">
                    ¿Qué pasó técnicamente?
                  </div>
                  <p className="text-sm text-blue-800 mt-1">
                    {categoriaInfo.explicacionTecnica}
                  </p>
                </div>
              </div>
            </div>

            {/* Pasos para el administrado */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="pasos">
                <AccordionTrigger className="text-sm font-medium">
                  📋 Pasos para el administrado ({categoriaInfo.pasosAdministrado.length} acciones)
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="space-y-2 text-sm">
                    {categoriaInfo.pasosAdministrado.map((paso, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Badge variant="outline" className="shrink-0 h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {idx + 1}
                        </Badge>
                        <span>{paso}</span>
                      </li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Descripción adicional del problema */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                2. Descripción adicional del problema (opcional):
              </label>
              <Textarea
                placeholder="Agregue detalles específicos del caso si corresponde..."
                value={descripcionProblema}
                onChange={(e) => setDescripcionProblema(e.target.value)}
                className="bg-background resize-none"
                rows={3}
              />
            </div>

            {/* Datos del trámite (demo) */}
            <div className="p-3 bg-secondary/30 rounded-lg border border-dashed border-amber-300">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-300">
                  📋 Datos de demostración
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Nº Expediente
                  </label>
                  <Input 
                    value={datosDemo.expedienteNumero} 
                    readOnly 
                    className="bg-muted text-sm font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Tipo de trámite
                  </label>
                  <Input 
                    value={datosDemo.tipoTramite} 
                    readOnly 
                    className="bg-muted text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Empresa/Persona
                  </label>
                  <Input 
                    value={datosDemo.empresaNombre} 
                    readOnly 
                    className="bg-muted text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Botón generar borrador */}
            <Button 
              onClick={() => setMostrarBorrador(true)}
              className="w-full"
              variant="default"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generar borrador de nota de subsanación
            </Button>

            {/* Borrador generado */}
            {mostrarBorrador && (
              <div className="space-y-3 p-4 bg-background border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Borrador de Nota de Subsanación</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copiarBorrador}
                    className="text-xs"
                  >
                    {copiado ? (
                      <>
                        <Check className="h-3 w-3 mr-1" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" /> Copiar
                      </>
                    )}
                  </Button>
                </div>
                <pre className="p-3 bg-muted rounded text-xs whitespace-pre-wrap font-mono overflow-x-auto max-h-[300px] overflow-y-auto">
                  {generarBorradorSubsanacion()}
                </pre>
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                  <strong>⚠️ Importante:</strong> Este borrador requiere revisión y aprobación del agente 
                  antes de su envío.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Nota sobre límites del módulo */}
        <div className="p-3 bg-muted/50 border rounded-lg">
          <p className="text-xs text-muted-foreground italic">
            <strong>Nota:</strong> El módulo de seguridad de Penélope no está habilitado para 
            adoptar decisiones sustantivas ni para aprobar o rechazar trámites. Solo puede 
            asistir con la clasificación de errores y generar borradores de subsanación que 
            requieren siempre intervención humana.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
