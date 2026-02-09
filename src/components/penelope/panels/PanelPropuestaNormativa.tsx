import { Card, CardTitle, CardText } from '../Card';
import { Badge } from '@/components/ui/badge';
import { Check, Scale, Globe, Shield } from 'lucide-react';

export function PanelPropuestaNormativa() {
  const articulos = [
    {
      num: 'Art. 1°',
      titulo: 'Automatización en etapas preliminares',
      texto: 'Autorízase la utilización de sistemas de automatización asistida y herramientas de IA responsable en las etapas preliminares, exclusivamente para tareas de verificación formal, clasificación documental, estandarización de antecedentes y control de plazos.',
      fundamento: 'LNPA Art. 1° inc. e)',
      color: 'blue',
      categoria: 'Habilitación',
    },
    {
      num: 'Art. 2°',
      titulo: 'Límites de intervención',
      texto: 'La automatización no podrá sustituir tareas que impliquen valoración jurídica, técnica o discrecional, ni emitir actos ni sugerencias de decisión.',
      fundamento: 'Doctrina del Acto Administrativo',
      color: 'amber',
      categoria: 'Límites',
    },
    {
      num: 'Art. 3°',
      titulo: 'Supervisión humana obligatoria',
      texto: 'Toda intervención automatizada deberá ser revisada, convalidada o rectificada por el agente responsable.',
      fundamento: 'AI Act Art. 14 / ISO 42001',
      color: 'amber',
      categoria: 'Límites',
    },
    {
      num: 'Art. 4°',
      titulo: 'Derecho a la información',
      texto: 'El administrado será notificado cuando su trámite sea procesado mediante automatización asistida, con explicación comprensible de qué se automatiza y qué permanece bajo análisis humano.',
      fundamento: 'OCDE Principios IA 1.3 / RGPD Art. 22',
      color: 'green',
      categoria: 'Garantías',
    },
    {
      num: 'Art. 5°',
      titulo: 'Derecho a impugnación',
      texto: 'El administrado podrá solicitar revisión humana sin costo adicional, resuelta por funcionario distinto dentro de 5 días hábiles, bajo pena de suspensión del plazo principal.',
      fundamento: 'RGPD Art. 22 / AI Act Arts. 13 y 86',
      color: 'green',
      categoria: 'Garantías',
    },
  ];

  const experiencias = [
    { bandera: '🇪🇪', pais: 'Estonia', sistema: 'X-Road', desc: 'Modelo de Once-Only gubernamental.' },
    { bandera: '🇩🇰', pais: 'Dinamarca', sistema: 'MitID + Registros Base', desc: 'Instrumentado sin reformar derecho sustantivo.' },
    { bandera: '🇪🇺', pais: 'UE', sistema: 'AI Act (Reg. 2024/1689)', desc: 'Paradigma adoptado para Penélope.' },
    { bandera: '🇧🇷', pais: 'Brasil', sistema: 'ANATEL', desc: 'Benchmark sectorial para métricas.' },
  ];

  const borderColors: Record<string, string> = {
    blue: 'border-l-blue-500',
    amber: 'border-l-amber-500',
    green: 'border-l-green-500',
  };

  return (
    <>
      {/* Sección 1: Introducción */}
      <Card>
        <CardTitle>Propuesta Normativa</CardTitle>
        <CardText>
          La implementación de Penélope requiere un encuadre jurídico explícito mediante una resolución del ENACOM que apruebe el «Reglamento de Tramitación Asistida en Etapas Preliminares». No exige modificar la legislación de fondo, sino adoptar decisiones reglamentarias.
        </CardText>
      </Card>

      {/* Sección 2: Articulado Propuesto */}
      <Card>
        <CardTitle as="h3">Articulado Propuesto</CardTitle>
        <div className="space-y-4 my-4">
          {articulos.map((art, i) => (
            <div key={i} className={`border-l-4 ${borderColors[art.color]} border border-border rounded-r-lg p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-foreground text-sm">{art.num}</span>
                <span className="font-semibold text-foreground text-sm">— {art.titulo}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">{art.texto}</p>
              <Badge variant="outline" className="text-xs">{art.fundamento}</Badge>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-3 h-3 rounded bg-blue-500" /> Habilitación
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-3 h-3 rounded bg-amber-500" /> Límites
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-3 h-3 rounded bg-green-500" /> Garantías del administrado
          </div>
        </div>
      </Card>

      {/* Sección 3: Extensión del RUPECO */}
      <Card>
        <CardTitle as="h3">Extensión del RUPECO</CardTitle>
        <div className="bg-primary/5 rounded-lg p-4 mb-3">
          <CardText className="mb-3">
            Propuesta de ampliar el RUPECO a trámites audiovisuales y postales.
          </CardText>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Check size={16} className="flex-shrink-0" />
              <span>No requiere reforma legislativa</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Check size={16} className="flex-shrink-0" />
              <span>Resolución de ENACOM suficiente</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Sección 4: Responsabilidad del Estado */}
      <Card>
        <CardTitle as="h3">Responsabilidad del Estado</CardTitle>
        <CardText>
          La propuesta no altera el régimen de responsabilidad del Estado regulado por la Ley 26.944, ni modifica la doctrina de la Corte Suprema en el caso <em>Vadell</em> (Fallos 306:2030) sobre responsabilidad objetiva y directa.
        </CardText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="border border-border rounded-lg p-4 flex items-start gap-3">
            <Shield size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Supervisión obligatoria</p>
              <p className="text-xs text-muted-foreground">La supervisión humana estructural asegura que la responsabilidad recaiga siempre en el agente que convalida.</p>
            </div>
          </div>
          <div className="border border-border rounded-lg p-4 flex items-start gap-3">
            <Scale size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Derechos del administrado</p>
              <p className="text-xs text-muted-foreground">El derecho a revisión humana y a información garantizan el debido proceso ante intervenciones automatizadas.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Sección 5: Experiencias Internacionales */}
      <Card>
        <CardTitle as="h3">Experiencias Internacionales</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {experiencias.map((exp, i) => (
            <div key={i} className="border border-border rounded-lg p-4 flex items-start gap-3">
              <Globe size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  {exp.bandera} {exp.pais} — {exp.sistema}
                </p>
                <p className="text-xs text-muted-foreground">{exp.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground italic">
          El articulado es una propuesta académica.
        </p>
      </Card>
    </>
  );
}
