import { Card, CardTitle, CardText, CardList } from '../Card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguage';
import { AlertTriangle, ArrowDown, CheckCircle, XCircle } from 'lucide-react';
import { SiguientePaso } from './SiguientePaso';
import { useTabNavigation } from '@/contexts/TabNavigationContext';

interface FlowStepProps {
  number: number;
  title: string;
  description: string;
  actor: 'auto' | 'human' | 'mixed';
  warning?: string;
  highlighted?: boolean;
}

function FlowStep({ number, title, description, actor, warning, highlighted }: FlowStepProps) {
  const actorColors = {
    auto: 'border-l-blue-500 bg-blue-50/50',
    human: 'border-l-green-500 bg-green-50/50',
    mixed: 'border-l-amber-500 bg-amber-50/50',
  };
  const actorLabels = {
    auto: 'Automatizado',
    human: 'Agente humano',
    mixed: 'IA + Supervisión',
  };

  return (
    <div className="relative">
      <div className={`border-l-4 ${actorColors[actor]} border border-border rounded-r-lg p-4 ${highlighted ? 'ring-2 ring-primary/30' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center">{number}</span>
          <span className="font-semibold text-sm text-foreground">{title}</span>
          <Badge variant="outline" className="text-xs ml-auto">{actorLabels[actor]}</Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed ml-8">{description}</p>
        {warning && (
          <div className="flex items-start gap-1.5 ml-8 mt-2 text-xs text-amber-700">
            <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
            <span>{warning}</span>
          </div>
        )}
      </div>
      <div className="flex justify-center py-1">
        <ArrowDown size={16} className="text-muted-foreground/50" />
      </div>
    </div>
  );
}

export function PanelArquitectura() {
  const { t } = useLanguage();
  const { goToTab } = useTabNavigation();

  const principios = [
    { titulo: 'No delegación decisoria', desc: 'El sistema no interpreta el Derecho, no evalúa solvencia ni emite actos administrativos.' },
    { titulo: 'Supervisión humana estructural', desc: 'Toda acción del sistema es revisada, convalidada o rectificada por agente humano (Human-in-the-Loop).' },
    { titulo: 'Eliminación estructural de riesgos', desc: 'Elimina por diseño las condiciones que podrían generar errores con efectos jurídicos.' },
    { titulo: 'IA estrictamente instrumental', desc: 'Limitada a estructuración, verificación formal y reutilización de información previamente validada.' },
  ];

  return (
    <>
      {/* Intro existente con i18n */}
      <Card>
        <CardTitle>{t('arq.title')}</CardTitle>
        <CardText>{t('arq.intro1')}</CardText>
        <CardText>
          {t('arq.intro2.prefix')}<em>{t('arq.intro2.emphasis')}</em>{t('arq.intro2.suffix')}
        </CardText>
        <CardText>{t('arq.intro3')}</CardText>
      </Card>

      {/* Modelo de Fiabilidad Procedimental */}
      <Card>
        <CardTitle as="h3">Modelo de Fiabilidad Procedimental</CardTitle>
        <div className="bg-primary/5 border-l-4 border-l-primary rounded-r-lg p-4 mb-4">
          <p className="text-sm font-semibold text-foreground mb-1">Fiabilidad por Diseño (Reliability by Design)</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Penélope no es un sistema de IA decisoria. Es un modelo de diseño procedimental que incorpora automatización asistida exclusivamente en etapas preliminares. La fiabilidad se apoya en su encuadre jurídico-institucional, no en la autonomía cognitiva de los modelos empleados.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {principios.map((p, i) => (
            <div key={i} className="border border-border rounded-lg p-4">
              <p className="text-sm font-semibold text-foreground mb-1">{p.titulo}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Diagramas de Flujo */}
      <Card>
        <CardTitle as="h3">Diagramas de Flujo del Sistema</CardTitle>
        <Tabs defaultValue="principal" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="principal">📋 Flujo Principal</TabsTrigger>
            <TabsTrigger value="subsanacion">🔄 Flujo de Subsanación</TabsTrigger>
          </TabsList>

          <TabsContent value="principal" className="mt-4 space-y-0">
            <FlowStep number={1} title="Ingreso por TAD" description="El expediente ingresa por TAD, se genera número GDE." actor="auto" />
            <FlowStep number={2} title="Sanitización Documental" description="Aplanado de capas PDF para prevenir prompt injection." actor="auto" warning="Protección contra texto oculto en documentos (Anexo II)" />
            <FlowStep number={3} title="Clasificación Asistida (IA)" description="LLM clasifica por tipo y normativa, determina nivel de confianza." actor="mixed" highlighted />
            <FlowStep number={4} title="Confirmación del Operador" description="El agente confirma, corrige o rechaza. Sin confirmación, el flujo no avanza." actor="human" />
            <FlowStep number={5} title="Validación Documental (Once-Only)" description="Consulta RUPECO, verifica completitud." actor="auto" />

            {/* Bifurcación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="border border-green-200 bg-green-50/50 rounded-lg p-4 text-center">
                <CheckCircle size={20} className="text-green-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-green-800">✓ Completo</p>
                <p className="text-xs text-green-700 mt-1">Pase a Área Técnica (borrador de PV)</p>
              </div>
              <div className="border border-red-200 bg-red-50/50 rounded-lg p-4 text-center">
                <XCircle size={20} className="text-red-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-red-800">✗ Incompleto</p>
                <p className="text-xs text-red-700 mt-1">Intimación de Subsanación (borrador de Nota)</p>
              </div>
            </div>

            <div className="flex justify-center py-1">
              <ArrowDown size={16} className="text-muted-foreground/50" />
            </div>

            <FlowStep number={7} title="Monitoreo de Plazos (Decreto 971/2024)" description="Control continuo, alertas escalonadas." actor="auto" />

            {/* Límite */}
            <div className="border-2 border-dashed border-red-400 rounded-lg p-4 bg-red-50/30 text-center mt-2">
              <p className="text-sm font-bold text-red-700">LÍMITE DE INTERVENCIÓN DE PENÉLOPE</p>
              <p className="text-xs text-red-600 mt-1">
                A partir de aquí, el análisis técnico-jurídico y la decisión son competencia exclusiva del área sustantiva.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="subsanacion" className="mt-4 space-y-0">
            <FlowStep number={1} title="Detección de Incidencia" description="Sistema detecta documento faltante/vencido/ilegible." actor="auto" />
            <FlowStep number={2} title="Generación de Borrador de Intimación" description="Penélope genera borrador automáticamente. Temperatura 0.0." actor="mixed" />
            <FlowStep number={3} title="Validación por Agente Humano" description="Agente revisa, modifica y firma. La emisión es acto de trámite exclusivo del agente." actor="human" highlighted />
            <FlowStep number={4} title="Notificación y Suspensión de Plazo" description="Notificación vía TAD, suspensión del cómputo." actor="auto" />
            <FlowStep number={5} title="Recepción de Subsanación" description="Trámite se reanuda, retorna a control documental." actor="auto" />
            <FlowStep number={6} title="Re-verificación con Control Humano" description="Nueva verificación con supervisión del agente." actor="human" />
          </TabsContent>
        </Tabs>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">Automatizado (determinístico)</Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200">Agente humano (obligatorio)</Badge>
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">IA + Supervisión humana</Badge>
        </div>
      </Card>

      {/* Componentes principales (existente) */}
      <Card>
        <CardTitle as="h3">{t('arq.componentes.title')}</CardTitle>
        <CardList
          items={[
            t('arq.componentes.item1'),
            t('arq.componentes.item2'),
            t('arq.componentes.item3'),
            t('arq.componentes.item4'),
            t('arq.componentes.item5'),
            t('arq.componentes.item6'),
          ]}
        />
      </Card>

      {/* Golden Dataset Note */}
      <Card>
        <div className="bg-primary/5 border-l-4 border-l-primary rounded-r-lg p-4">
          <p className="text-sm font-semibold text-foreground mb-1">Nota: Golden Dataset</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            El trabajo final (Cap. VI y VIII) enfatiza la necesidad de construir un <strong>conjunto de datos curado</strong> (golden dataset) antes de la puesta en producción, para evitar la automatización acrítica de patrones históricos que podrían perpetuar sesgos o errores estructurales.
          </p>
        </div>
      </Card>

      <SiguientePaso
        label="Brecha RUPECO"
        description="Visualice el hallazgo central del trabajo"
        onNavigate={() => goToTab('brecha-rupeco')}
      />
    </>
  );
}
