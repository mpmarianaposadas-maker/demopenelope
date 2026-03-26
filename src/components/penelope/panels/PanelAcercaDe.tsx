import { useState } from 'react';
import { Card, CardTitle, CardText } from '../Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, BookOpen, GraduationCap, ArrowRight, Compass, Search, GitBranch, BarChart2, Scale, TrendingUp, BrainCircuit, Cpu, UserCheck, ShieldOff } from 'lucide-react';
import { SiguientePaso } from './SiguientePaso';
import { useTabNavigation } from '@/contexts/TabNavigationContext';

export function PanelAcercaDe() {
  const [showWelcome, setShowWelcome] = useState(true);
  const { goToTab } = useTabNavigation();

  const transformaciones = [
    { de: 'Administración reactiva', a: 'Administración preventiva', desc: 'De esperar vencimientos a anticiparse a riesgos procedimentales.' },
    { de: 'Inercia procedimental', a: 'Gestión activa', desc: 'De acumulación pasiva a intervención temprana en etapas preliminares.' },
    { de: 'Cumplimiento burocrático', a: 'Experiencia del ciudadano', desc: 'Del enfoque en proceso interno al interés público.' },
    { de: 'Silencio como distorsión', a: 'Silencio como garantía', desc: 'El silencio positivo vuelve a ser garantía excepcional.' },
  ];

  const siHace = [
    'Clasificar preliminarmente documentación',
    'Detectar faltantes formales',
    'Sugerir borradores no vinculantes',
    'Registrar trazabilidad de cada intervención',
    'Generar alertas sobre plazos perentorios',
    'Asistir etapas preliminares del trámite',
  ];

  const noHace = [
    'No resuelve expedientes',
    'No dicta actos administrativos',
    'No sustituye criterio jurídico humano',
    'No firma decisiones finales',
    'No reemplaza responsabilidad del agente público',
    'No opera sin revisión humana',
  ];

  const pasos = [
    { icon: <BookOpen size={15} className="inline mr-1" />, tab: 'Acerca de', desc: 'Conozca el marco conceptual y la pregunta de investigación' },
    { icon: <Search size={15} className="inline mr-1" />, tab: 'Demo Interactiva', desc: 'Simule el procesamiento de un expediente' },
    { icon: <GitBranch size={15} className="inline mr-1" />, tab: 'Arquitectura', desc: 'Explore los diagramas de flujo y el modelo de fiabilidad' },
    { icon: <BarChart2 size={15} className="inline mr-1" />, tab: 'Brecha RUPECO', desc: 'Visualice el hallazgo central: la brecha del 57%' },
    { icon: <Scale size={15} className="inline mr-1" />, tab: 'Propuesta Normativa', desc: 'Revise el articulado propuesto' },
    { icon: <TrendingUp size={15} className="inline mr-1" />, tab: 'Métricas', desc: 'Consulte las proyecciones de impacto (Tabla 4)' },
  ];

  return (
    <>
      {/* Banner de bienvenida */}
      {showWelcome && (
        <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-5 mb-6">
          <button
            onClick={() => setShowWelcome(false)}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cerrar banner de bienvenida"
          >
            <X size={18} />
          </button>
          <div className="flex items-start gap-3 mb-3">
            <Compass size={24} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-semibold text-foreground mb-1">
                Bienvenido/a a la PoC del Sistema Penélope
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Esta prueba de concepto acompaña la propuesta académica «El viaje de Penélope» y permite explorar de forma interactiva el sistema propuesto. A continuación encontrará un recorrido sugerido.
              </p>
            </div>
          </div>
          <ol className="space-y-1.5 ml-9 mb-4">
            {pasos.map((paso, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span>{paso.icon}</span>
                <span><strong>{paso.tab}</strong> — {paso.desc}</span>
              </li>
            ))}
          </ol>
          <div className="ml-9 flex items-center gap-4">
            <Button size="sm" onClick={() => setShowWelcome(false)}>
              Entendido, comenzar
            </Button>
            <p className="text-xs text-muted-foreground">
              Puede navegar libremente entre las pestañas en cualquier orden.
            </p>
          </div>
        </div>
      )}

      {/* Sección 1: El Viaje de Penélope */}
      <Card>
        <CardTitle>El Viaje de Penélope</CardTitle>
        <Badge variant="outline" className="text-[10px] mb-3 border-primary/30 text-primary">Propuesta académica — PoC</Badge>
        <div className="bg-primary/5 border-l-4 border-l-primary rounded-r-lg p-4 mb-4">
          <p className="text-muted-foreground leading-relaxed italic">
            «En el mito homérico, Penélope teje y desteje esperando el regreso de Ulises. En esta propuesta, la Administración —quien la encarna— se despide de la espera pasiva y procura abandonar una lógica procedimental basada en la postergación y la acumulación de expedientes, para dar paso a una gestión que interviene tempranamente sobre sus propios procesos.»
          </p>
        </div>
        <CardText>
          El viaje simboliza el tránsito institucional desde la inercia hacia la acción organizativa orientada a la decisión y a la satisfacción efectiva del interés público. No es un viaje tecnológico: es institucional.
        </CardText>
      </Card>

      {/* Sección 2: La transformación institucional */}
      <Card>
        <CardTitle as="h3">La transformación institucional</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {transformaciones.map((t, i) => (
            <div key={i} className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-muted-foreground">{t.de}</span>
                <ArrowRight size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm font-semibold text-primary">{t.a}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Sección 3: Pregunta de Investigación */}
      <Card>
        <CardTitle as="h3">Pregunta de Investigación</CardTitle>
        <div className="bg-primary/5 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <BookOpen size={20} className="text-primary mt-1 flex-shrink-0" />
            <p className="text-muted-foreground leading-relaxed font-medium">
              ¿Puede la automatización asistida basada en inteligencia artificial, limitada a etapas preliminares no discrecionales del procedimiento administrativo, reducir el riesgo institucional del silencio administrativo positivo sin vulnerar los principios de legalidad, debido proceso y control humano?
            </p>
          </div>
        </div>
        <div className="border-l-4 border-l-primary/50 pl-4">
          <p className="text-sm font-semibold text-foreground mb-1">Hipótesis</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            La automatización asistida, circunscrita a tareas preparatorias y técnicas y sometida a supervisión humana, resulta jurídicamente compatible con el procedimiento y constituye una herramienta idónea para preservar la excepcionalidad del silencio positivo.
          </p>
        </div>
      </Card>

      {/* Sección 4: Penélope SÍ hace / NO hace */}
      <Card>
        <CardTitle as="h3">Alcance funcional de Penélope</CardTitle>
        <CardText>
          Penélope opera exclusivamente como infraestructura de apoyo no decisorio. Su intervención se limita a etapas preliminares, formales y no discrecionales del procedimiento administrativo.
        </CardText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="border border-green-200 bg-green-50/50 rounded-lg p-4 dark:bg-green-950/10 dark:border-green-900">
            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 text-sm flex items-center gap-1.5">
              <Check size={14} />Penélope sí hace
            </h4>
            <ul className="space-y-2">
              {siHace.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-red-200 bg-red-50/50 rounded-lg p-4 dark:bg-red-950/10 dark:border-red-900">
            <h4 className="font-semibold text-red-800 dark:text-red-300 mb-3 text-sm flex items-center gap-1.5">
              <ShieldOff size={14} />Penélope no hace
            </h4>
            <ul className="space-y-2">
              {noHace.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
                  <X size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Sección 5: Rol del LLM */}
      <Card>
        <CardTitle as="h3">Rol de la IA generativa en el sistema</CardTitle>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <BrainCircuit size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Penélope utiliza un modelo de lenguaje (LLM) de forma estrictamente acotada. El modelo asiste en la lectura de documentos no estructurados, ayuda a extraer o resumir información relevante y sugiere borradores no vinculantes de actos de trámite. Opera bajo prompts restrictivos, acotado por reglas determinísticas y controles de validación.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-lg p-2.5">
              <Cpu size={14} className="text-blue-600 flex-shrink-0" />
              <span><strong>Motor de reglas:</strong> verificación formal, plazos, completitud</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-lg p-2.5">
              <BrainCircuit size={14} className="text-purple-600 flex-shrink-0" />
              <span><strong>Asistencia LLM:</strong> clasificación preliminar, borradores</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-lg p-2.5">
              <UserCheck size={14} className="text-green-600 flex-shrink-0" />
              <span><strong>Validación humana:</strong> obligatoria en toda operación</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic border-t border-border/50 pt-2">
            El LLM no decide, no sustituye análisis sustantivo y no reemplaza el criterio jurídico humano. Toda sugerencia requiere convalidación por agente responsable.
          </p>
        </div>
      </Card>

      {/* Sección 6: Qué ES y qué NO ES (categorización técnica) */}
      <Card>
        <CardTitle as="h3">Qué es y qué NO es Penélope</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="border border-green-200 bg-green-50/50 rounded-lg p-4 dark:bg-green-950/10 dark:border-green-900">
            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 text-sm"><Check size={14} className="inline mr-1" />ES</h4>
            <ul className="space-y-2">
              {[
                'Sistema de automatización asistida e IA responsable',
                'Infraestructura organizativa de apoyo no decisorio',
                'Facilitador de interoperabilidad (principio Once-Only)',
                'Modelo de fiabilidad por diseño',
                'Herramienta de gestión activa en etapas preliminares',
                'Compatible con Derecho Público argentino',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-red-200 bg-red-50/50 rounded-lg p-4 dark:bg-red-950/10 dark:border-red-900">
            <h4 className="font-semibold text-red-800 dark:text-red-300 mb-3 text-sm"><X size={14} className="inline mr-1" />NO ES</h4>
            <ul className="space-y-2">
              {[
                'Sistema de IA decisoria',
                'Herramienta de interpretación jurídica',
                'Sustituto de la actividad del órgano competente',
                'Emisor de actos administrativos',
                'Evaluador de solvencia o idoneidad',
                'Sistema que opera en etapa de decisión',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
                  <X size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Sección 7: Alcance */}
      <Card>
        <CardTitle as="h3">Alcance de esta PoC</CardTitle>
        <CardText>
          Esta prueba de concepto ilustra el diseño conceptual del sistema, modelando 5 de los 14 procedimientos identificados como sujetos a silencio positivo. No utiliza datos reales del ENACOM.
        </CardText>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
          {[
            { value: '5', label: 'Trámites modelados' },
            { value: '14', label: 'Total con silencio +' },
            { value: '12', label: 'Base documental común' },
            { value: '3', label: 'Sectores cubiertos' },
          ].map((kpi, i) => (
            <div key={i} className="p-4 bg-secondary rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">{kpi.value}</div>
              <div className="text-sm text-muted-foreground">{kpi.label}</div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground italic">
          Datos demostrativos — escenario proyectado sobre la base de la propuesta académica.
        </p>
      </Card>

      {/* Sección 8: Créditos */}
      <Card>
        <div className="flex items-start gap-3">
          <GraduationCap size={24} className="text-primary flex-shrink-0 mt-1" />
          <div>
            <Badge className="mb-2">Posgrado Internacional en IA Generativa, Prompting y Derecho — 6.ª Edición 2025</Badge>
            <p className="text-sm text-muted-foreground">
              UBA IALAB · Alumna: Graciela Mariana Posadas · Marzo 2026
            </p>
          </div>
        </div>
      </Card>

      {/* Principio rector */}
      <div className="bg-primary/5 border-l-4 border-l-primary border border-primary/20 rounded-r-lg p-5">
        <h3 className="text-base font-semibold text-foreground mb-2 tracking-tight" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
          ⚖️ Principio rector del sistema
        </h3>
        <p className="text-[15px] font-semibold text-foreground leading-relaxed mb-2">
          Penélope no decide, no interpreta normas y no sustituye al funcionario. Organiza, asiste y registra. La decisión administrativa permanece, en todo momento y por diseño, en manos humanas.
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Este principio es el núcleo jurídico de la propuesta y la base de su compatibilidad con la Ley N° 19.549, el régimen de procedimientos administrativos y los principios de legalidad y debido proceso.
        </p>
      </div>

      {/* Navegación al siguiente paso */}
      <SiguientePaso
        label="Demo Interactiva"
        description="Pruebe el sistema en acción con un caso simulado"
        onNavigate={() => goToTab('demo-interactiva')}
      />
    </>
  );
}
