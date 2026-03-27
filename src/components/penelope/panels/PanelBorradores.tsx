import { Card, CardTitle, CardText } from '../Card';
import { useLanguage } from '@/hooks/useLanguage';
import { Badge } from '@/components/ui/badge';
import { FileText, Send, Info, ClipboardList } from 'lucide-react';
import { ActorLabels } from '../ActorLabel';
import { useAgente } from '@/contexts/AgenteContext';

const MESES_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

function fechaDinamica(): string {
  const now = new Date();
  return `Buenos Aires, ${now.getDate()} de ${MESES_ES[now.getMonth()]} de ${now.getFullYear()}`;
}

export function PanelBorradores() {
  const { t } = useLanguage();
  const { agenteNombre } = useAgente();
  const fechaHoy = fechaDinamica();
  const generadorNota = agenteNombre
    ? `Sistema Penélope - Módulo "Redactor Nota" (Prompt estructurado, Temp: 0.0) · Agente: ${agenteNombre}`
    : t('borr.nota.generador');
  const generadorPV = agenteNombre
    ? `Sistema Penélope - Módulo "Redactor PV" (Prompt estructurado, Temp: 0.0) · Agente: ${agenteNombre}`
    : t('borr.pv.generador');

  return (
    <>
      {/* Leyenda de naturaleza simulada */}
      <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3 flex items-center gap-2 text-xs text-amber-700 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-300">
        <Info size={14} className="flex-shrink-0" />
        <span>Panel ilustrativo — Borradores no vinculantes generados por el sistema. Requieren revisión, edición y firma del agente responsable antes de producir cualquier efecto.</span>
      </div>

      {/* ═══ SECCIÓN 1: Comunicaciones dirigidas al administrado ═══ */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2 mt-4">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-primary" />
          <h3 className="font-serif font-semibold text-foreground text-base">
            {t('borr.seccion.administrado') || 'Comunicaciones dirigidas al administrado'}
          </h3>
        </div>
        <ActorLabels types={['llm', 'validacion']} />
      </div>

      {/* Nota de Intimación */}
      <Card as="article">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <CardTitle>{t('borr.nota.title')}</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800">
              Borrador no vinculante
            </Badge>
            <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800">
              Tipo documento GDE: Nota (NO)
            </Badge>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <CardText>
            <strong>{t('borr.tipoDoc')}</strong> Nota (NO) - {t('borr.nota.destino')}
          </CardText>
          <CardText>
            <strong>{t('borr.estado')}</strong>{' '}
            <span className="status-pending">{t('borr.estadoPendiente')}</span>
          </CardText>
          <CardText>
            <strong>{t('borr.generadoPor')}</strong> {generadorNota}
          </CardText>
          <CardText>
            <strong>Ref. RUPECO:</strong> RUPECO-2024-00892 (vigente)
          </CardText>
        </div>

        <div className="border-l-4 border-primary pl-4 space-y-3 text-sm md:text-base">
          <p className="font-semibold">NO-2026-XXXXX-APN-ENACOM</p>
          <p>{t('borr.nota.ref')} EX-2026-00123456-APN-ENACOM</p>
          <p>{fechaHoy}</p>
          <p>{t('borr.nota.destinatario')}</p>
          <p>
            <span className="bg-yellow-100 border-l-2 border-yellow-400 px-2 py-0.5 font-bold dark:bg-yellow-900/30 dark:border-yellow-600">
              [el/la peticionante — completar según corresponda: persona humana o jurídica]
            </span>
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 italic mt-1">
            ⚑ Campo a completar por el agente: verificar si el destinatario es persona humana o jurídica y adecuar la denominación antes de cargar en GDE.
          </p>
          <p>{t('borr.nota.domicilio')}</p>
          <p className="font-semibold">
            {t('borr.nota.refIntimacion')}{' '}
            <span className="bg-yellow-100 border-l-2 border-yellow-400 px-2 py-0.5 font-bold dark:bg-yellow-900/30 dark:border-yellow-600">
              [Completar con el número otorgado por el Sistema TAD]
            </span>
          </p>
          
          <p className="leading-relaxed">
            {t('borr.nota.texto1')}{' '}
            <span className="bg-yellow-100 border-l-2 border-yellow-400 px-2 py-0.5 font-bold dark:bg-yellow-900/30 dark:border-yellow-600">
              [Completar con motivo de solicitud]
            </span>
          </p>
          <p className="leading-relaxed">{t('borr.nota.texto2')}</p>
          <p className="font-semibold">
            <span className="bg-yellow-100 border-l-2 border-yellow-400 px-2 py-0.5 dark:bg-yellow-900/30 dark:border-yellow-600">
              {t('borr.co.docFaltante')}
            </span>
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 italic mt-1">
            ⚑ Campo a completar una vez comprobados por el agente de que son recaudos ausentes o carentes de algún aspecto formal exigido por el Reglamento de aplicación.
          </p>
          <p className="leading-relaxed">{t('borr.nota.texto6')}</p>
          <p className="leading-relaxed">La presentación oportuna de la documentación solicitada posibilitará la continuación de su pedido en tiempo y forma.</p>
          <p>{t('borr.nota.cierre')}</p>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300 font-medium flex items-center gap-2">
              <ClipboardList size={14} className="inline mr-1" />{t('borr.nota.instrucciones')}
            </p>
            <ul className="text-xs text-blue-700 dark:text-blue-400 mt-2 space-y-1 list-disc list-inside">
              <li>{t('borr.nota.paso1')}</li>
              <li>{t('borr.nota.paso2')}</li>
              <li>{t('borr.nota.paso3')}</li>
            </ul>
          </div>
          
          <hr className="border-border mt-4 mb-0" />
          <div className="bg-gray-100 dark:bg-gray-800/40 border-l-4 border-amber-400 pl-3 pr-3 py-2 mt-2 rounded-r">
            <span className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium">Marca de sistema — no forma parte del instrumento</span>
            <p className="italic text-muted-foreground text-sm">
              {t('borr.nota.disclaimer')}
            </p>
          </div>
        </div>
      </Card>

      {/* Versión alternativa de intimación */}
      <Card as="article">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <CardTitle as="h3">{t('borr.alt.title')}</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800">
              Borrador no vinculante
            </Badge>
            <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800">
              Tipo documento GDE: Nota (NO)
            </Badge>
          </div>
        </div>
        
        <div className="border-l-4 border-accent pl-4 space-y-3 text-sm md:text-base">
          <p className="leading-relaxed">
            En virtud de lo establecido en el artículo 5°, inciso d) del Reglamento de Procedimientos Administrativos, aprobado por Decreto N° 1759/72 – T.O. 2017 (Decreto N° 894/2017), se <strong>INTIMA</strong> a subsanar el defecto formal detectado en el plazo de <strong>DIEZ (10) días hábiles administrativos</strong>, contados desde el día siguiente a la notificación de la presente.
          </p>
          <p className="leading-relaxed">
            La documentación requerida deberá ser ingresada a través del sistema de Trámites a Distancia (TAD), en el expediente electrónico individualizado en el encabezamiento de esta comunicación. Ante cualquier inconveniente para la carga documental, podrá requerir asistencia técnica dirigiéndose a la Mesa de Ayuda al correo electrónico: <a href="mailto:mesadeayuda@enacom.gob.ar" className="text-primary underline">mesadeayuda@enacom.gob.ar</a>
          </p>
          <p className="leading-relaxed">
            Se advierte que el incumplimiento dentro del plazo fijado importará la declaración de caducidad de las actuaciones y su archivo sin más trámite, de conformidad con lo previsto en el artículo 1°, inciso e), apartado 9) de la Ley N° 19.549.
          </p>
          <p>Sin otro particular, saludo a usted atentamente.</p>
          <hr className="border-border mt-4 mb-0" />
          <div className="bg-gray-100 dark:bg-gray-800/40 border-l-4 border-amber-400 pl-3 pr-3 py-2 mt-2 rounded-r">
            <span className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium">Marca de sistema — no forma parte del instrumento</span>
            <p className="italic text-muted-foreground text-sm">
              {t('borr.alt.disclaimer')}
            </p>
          </div>
        </div>
      </Card>

      {/* ═══ SECCIÓN 2: Información interna de gestión (GDE) ═══ */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2 mt-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-serif font-semibold text-foreground text-base">
            {t('borr.seccion.interna') || 'Actos internos de gestión (GDE)'}
          </h3>
        </div>
        <ActorLabels types={['llm', 'validacion']} />
      </div>

      {/* Providencia */}
      <Card as="article">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <CardTitle>{t('borr.pv.title')}</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800">
              Borrador no vinculante
            </Badge>
            <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800">
              Tipo documento GDE: Providencia (PV)
            </Badge>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <CardText>
            <strong>{t('borr.tipoDoc')}</strong> Providencia (PV)
          </CardText>
          <CardText>
            <strong>{t('borr.estado')}</strong>{' '}
            <span className="status-pending">{t('borr.estadoPendiente')}</span>
          </CardText>
          <CardText>
            <strong>{t('borr.generadoPor')}</strong> {generadorPV}
          </CardText>
          <CardText>
            <strong>Ref. RUPECO:</strong> RUPECO-2024-00892 (vigente)
          </CardText>
        </div>

        {/* Nota condicional para inscripciones RUPECO */}
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <strong>Nota:</strong> En trámites de inscripción RUPECO en curso, el número RUPECO será asignado tras el otorgamiento formal. El presente ejemplo corresponde a un administrado con registro RUPECO vigente.
            </p>
          </div>
        </div>
        
        <div className="border-l-4 border-primary pl-4 space-y-3 text-sm md:text-base">
          <p className="font-semibold">EX-2026-00123456-APN-ENACOM</p>
          <p>{fechaHoy}</p>
          <p className="leading-relaxed">{t('borr.pv.texto1')}</p>
          <p className="leading-relaxed">
            {t('borr.pv.texto2')}{' '}
            <span className="bg-yellow-100 border-l-2 border-yellow-400 px-2 py-0.5 font-bold dark:bg-yellow-900/30 dark:border-yellow-600">
              [el/la peticionante — completar según corresponda: persona humana o jurídica]
            </span>{' '}
            (CUIT XX-XXXXXXXX-X · RUPECO N° XXXX-XXXX).
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 italic mt-1">
            ⚑ Campo a completar por el agente: verificar denominación (persona humana o jurídica), CUIT y número de inscripción RUPECO antes de cargar en GDE.
          </p>
          <p className="leading-relaxed">
            {t('borr.pv.texto3')}{' '}
            <strong>{t('borr.pv.pase')}</strong> {t('borr.pv.destino')}
          </p>
          <p>{t('borr.pv.cierre')}</p>
          <hr className="border-border mt-4 mb-0" />
          <div className="bg-gray-100 dark:bg-gray-800/40 border-l-4 border-amber-400 pl-3 pr-3 py-2 mt-2 rounded-r">
            <span className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium">Marca de sistema — no forma parte del instrumento</span>
            <p className="italic text-muted-foreground text-sm">
              {t('borr.pv.disclaimer')}
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}
