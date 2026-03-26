import { Card, CardTitle, CardText } from '../Card';
import { Info, Shield, AlertTriangle } from 'lucide-react';

const limitaciones = [
  {
    letra: 'a',
    titulo: 'Dependencia de la calidad del Golden Dataset',
    desc: 'La fiabilidad de las clasificaciones preliminares y la detección de faltantes depende directamente de la calidad y representatividad del conjunto de datos curado construido antes de la puesta en producción. Una automatización acrítica de patrones históricos podría perpetuar errores estructurales o sesgos organizativos preexistentes.',
  },
  {
    letra: 'b',
    titulo: 'Alcance acotado a etapas preliminares no discrecionales',
    desc: 'Penélope no puede intervenir en la etapa de análisis técnico-jurídico sustantivo ni en la emisión de actos administrativos. Su utilidad se limita a las fases formales previas a la decisión. Toda situación que requiera interpretación normativa queda fuera de su alcance por diseño.',
  },
  {
    letra: 'c',
    titulo: 'Limitaciones inherentes a los modelos de lenguaje (LLMs)',
    desc: 'Los modelos de lenguaje generativo pueden producir respuestas incorrectas ("alucinaciones") aun con temperatura 0 y anclaje normativo. Por ello, toda sugerencia del sistema requiere revisión humana obligatoria antes de producir efectos jurídicos. El sistema no garantiza exhaustividad ni corrección absoluta.',
  },
  {
    letra: 'd',
    titulo: 'Ausencia de datos reales del ENACOM',
    desc: 'Esta PoC no utiliza expedientes reales ni datos históricos del organismo. Las proyecciones de impacto son estimaciones basadas en experiencias internacionales comparables y no constituyen validación empírica del sistema en el contexto institucional específico del ENACOM.',
  },
  {
    letra: 'e',
    titulo: 'Requisito de condiciones organizativas previas',
    desc: 'La implementación de Penélope requiere condiciones institucionales que no pueden asumirse como dadas: actualización y mantenimiento del RUPECO, capacitación de agentes, infraestructura tecnológica compatible y decisión política de adopción. Sin estas condiciones, el sistema no puede operar según su diseño.',
  },
  {
    letra: 'f',
    titulo: 'No contempla variaciones procedimentales atípicas',
    desc: 'El sistema modela flujos procedimentales estándar. Los expedientes con particularidades atípicas, acumulación de pretensiones o regímenes especiales pueden requerir intervención humana desde etapas más tempranas, reduciendo el alcance de la automatización asistida.',
  },
];

export function PanelLimitaciones() {
  return (
    <>
      <Card>
        <CardTitle>Limitaciones del Sistema Penélope</CardTitle>
        <CardText>El reconocimiento de limitaciones es parte del diseño responsable.</CardText>

        {/* Nota académica */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-start gap-2 text-xs text-muted-foreground mb-4">
          <Info size={14} className="flex-shrink-0 mt-0.5 text-primary" />
          <span>
            Esta sección forma parte de la evaluación académica del sistema. El reconocimiento explícito de limitaciones es un requisito de IA responsable conforme ISO/IEC 42001:2023.
          </span>
        </div>

        {/* Limitaciones */}
        <div className="space-y-4">
          {limitaciones.map((lim) => (
            <div key={lim.letra} className="border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{lim.letra})</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground mb-1">{lim.titulo}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{lim.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Cierre */}
      <Card>
        <div className="bg-primary/5 border-l-4 border-l-primary rounded-r-lg p-4 flex items-start gap-3">
          <Shield size={18} className="flex-shrink-0 mt-0.5 text-primary" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Estas limitaciones no invalidan la propuesta. La definen como un sistema de alcance acotado, diseñado con prudencia institucional, trazabilidad y supervisión humana obligatoria.
          </p>
        </div>
      </Card>
    </>
  );
}
