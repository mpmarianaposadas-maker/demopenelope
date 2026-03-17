import { Card, CardTitle, CardText } from '../Card';
import { useLanguage } from '@/hooks/useLanguage';
import { Badge } from '@/components/ui/badge';
import { FileText, Send, Info } from 'lucide-react';

export function PanelBorradores() {
  const { t } = useLanguage();

  return (
    <>
      {/* ═══ SECCIÓN 1: Comunicaciones dirigidas al administrado ═══ */}
      <div className="flex items-center gap-2 mb-2">
        <Send className="w-5 h-5 text-primary" />
        <h3 className="font-serif font-semibold text-foreground text-base">
          {t('borr.seccion.administrado') || 'Comunicaciones dirigidas al administrado'}
        </h3>
      </div>

      {/* Nota de Intimación */}
      <Card as="article">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <CardTitle>{t('borr.nota.title')}</CardTitle>
          <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800">
            Tipo documento GDE: Nota (NO)
          </Badge>
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
            <strong>{t('borr.generadoPor')}</strong> {t('borr.nota.generador')}
          </CardText>
          <CardText>
            <strong>Ref. RUPECO:</strong> RUPECO-2024-00892 (vigente)
          </CardText>
        </div>

        <div className="border-l-4 border-primary pl-4 space-y-3 text-sm md:text-base">
          <p className="font-semibold">NO-2026-XXXXX-APN-ENACOM</p>
          <p>{t('borr.nota.ref')} EX-2026-00123456-APN-ENACOM</p>
          <p>{t('borr.nota.fecha')}</p>
          <p>{t('borr.nota.destinatario')}</p>
          <p><strong>COOPERATIVA DEL VALLE LTDA.</strong></p>
          <p>{t('borr.nota.domicilio')}</p>
          <p>{t('borr.nota.presente')}</p>
          <p className="font-semibold">{t('borr.nota.refIntimacion')}</p>
          
          <p className="leading-relaxed">{t('borr.nota.texto1')}</p>
          <p className="leading-relaxed">{t('borr.nota.texto2')}</p>
          <p className="font-semibold">{t('borr.co.docFaltante')}</p>
          <p className="leading-relaxed">
            {t('borr.nota.texto3')}{' '}
            <strong>{t('borr.co.intima')}</strong>{' '}
            {t('borr.nota.texto4')}{' '}
            <strong>{t('borr.co.plazo')}</strong>{' '}
            {t('borr.nota.texto5')}
          </p>
          <p className="leading-relaxed">{t('borr.nota.texto6')}</p>
          <p className="leading-relaxed">{t('borr.nota.texto7')}</p>
          <p>{t('borr.nota.cierre')}</p>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300 font-medium flex items-center gap-2">
              📋 {t('borr.nota.instrucciones')}
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
          <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800">
            Tipo documento GDE: Nota (NO)
          </Badge>
        </div>
        
        <div className="border-l-4 border-accent pl-4 space-y-3 text-sm md:text-base">
          <p className="font-semibold">{t('borr.co.docFaltante')}</p>
          <p className="leading-relaxed">
            {t('borr.alt.texto1')}{' '}
            <strong>{t('borr.co.intima')}</strong>{' '}
            <span className="bg-yellow-100 border-l-2 border-yellow-400 px-2 py-0.5 font-bold dark:bg-yellow-900/30 dark:border-yellow-600">
              [el/la peticionante — completar según corresponda: persona humana o jurídica]
            </span>{' '}
            a subsanar el defecto formal detectado dentro del plazo de{' '}
            <strong>{t('borr.alt.plazo')}</strong>{' '}
            {t('borr.alt.texto3')}
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 italic mt-1">
            ⚑ Campo a completar por el agente: verificar si el destinatario es persona humana o jurídica y adecuar la denominación antes de cargar en GDE.
          </p>
          <p className="leading-relaxed">{t('borr.alt.texto4')}</p>
          <p className="leading-relaxed">{t('borr.alt.texto5')}</p>
          <p>{t('borr.alt.cierre')}</p>
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
      <div className="flex items-center gap-2 mb-2 mt-6">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="font-serif font-semibold text-foreground text-base">
          {t('borr.seccion.interna') || 'Actos internos de gestión (GDE)'}
        </h3>
      </div>

      {/* Providencia */}
      <Card as="article">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <CardTitle>{t('borr.pv.title')}</CardTitle>
          <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800">
            Tipo documento GDE: Providencia (PV)
          </Badge>
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
            <strong>{t('borr.generadoPor')}</strong> {t('borr.pv.generador')}
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
          <p>{t('borr.pv.fecha')}</p>
          <p className="leading-relaxed">{t('borr.pv.texto1')}</p>
          <p className="leading-relaxed">
            {t('borr.pv.texto2')}{' '}
            <strong>COOPERATIVA DEL VALLE LTDA.</strong> (CUIT XX-XXXXXXXX-X).
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
