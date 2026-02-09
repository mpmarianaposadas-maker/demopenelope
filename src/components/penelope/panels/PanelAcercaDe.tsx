import { Card, CardTitle, CardText } from '../Card';
import { Badge } from '@/components/ui/badge';
import { Check, X, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

export function PanelAcercaDe() {
  const transformaciones = [
    {
      de: 'Administración reactiva',
      a: 'Administración preventiva',
      desc: 'De esperar vencimientos a anticiparse a riesgos procedimentales.',
    },
    {
      de: 'Inercia procedimental',
      a: 'Gestión activa',
      desc: 'De acumulación pasiva a intervención temprana.',
    },
    {
      de: 'Cumplimiento burocrático',
      a: 'Experiencia del ciudadano',
      desc: 'Del enfoque en proceso interno al interés público.',
    },
    {
      de: 'Silencio como distorsión',
      a: 'Silencio como garantía',
      desc: 'El silencio positivo vuelve a ser garantía excepcional.',
    },
  ];

  const esItems = [
    'Sistema de automatización asistida e IA responsable',
    'Infraestructura organizativa',
    'Facilitador de interoperabilidad',
    'Modelo de fiabilidad por diseño',
    'Herramienta de gestión activa',
    'Compatible con Derecho Público argentino',
  ];

  const noEsItems = [
    'Sistema de IA decisoria',
    'Herramienta de interpretación jurídica',
    'Sustituto de la actividad del órgano',
    'Emisor de actos administrativos',
    'Evaluador de solvencia/idoneidad',
    'Sistema que opera en etapa de decisión',
  ];

  return (
    <>
      {/* Sección 1: El Viaje de Penélope */}
      <Card>
        <CardTitle>El Viaje de Penélope</CardTitle>
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

      {/* Sección 4: Qué ES y qué NO ES */}
      <Card>
        <CardTitle as="h3">Qué es y qué NO es Penélope</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="border border-green-200 bg-green-50/50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3 text-sm">✓ ES</h4>
            <ul className="space-y-2">
              {esItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-red-200 bg-red-50/50 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-3 text-sm">✗ NO ES</h4>
            <ul className="space-y-2">
              {noEsItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <X size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Sección 5: Alcance */}
      <Card>
        <CardTitle as="h3">Alcance de esta Demo</CardTitle>
        <CardText>
          Esta demo ilustra el diseño conceptual modelando 5 de los 14 procedimientos identificados como sujetos a silencio positivo.
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
      </Card>

      {/* Sección 6: Créditos */}
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
    </>
  );
}
