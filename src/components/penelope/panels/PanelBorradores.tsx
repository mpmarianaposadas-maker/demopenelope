import { Card, CardTitle, CardText } from '../Card';
import { useLanguage } from '@/hooks/useLanguage';

export function PanelBorradores() {
  const { t } = useLanguage();

  return (
    <>
      {/* Providencia */}
      <Card as="article">
        <CardTitle>{t('borr.pv.title')}</CardTitle>
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
          <p className="italic text-muted-foreground text-sm border-t border-dashed border-border pt-3 mt-4">
            {t('borr.pv.disclaimer')}
          </p>
        </div>
      </Card>

      {/* Nota de Intimación para peticionantes (carga en GDE) */}
      <Card as="article">
        <CardTitle>{t('borr.nota.title')}</CardTitle>
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
          
          <p className="italic text-muted-foreground text-sm border-t border-dashed border-border pt-3 mt-4">
            {t('borr.nota.disclaimer')}
          </p>
        </div>
      </Card>

      {/* Versión alternativa de intimación */}
      <Card as="article">
        <CardTitle as="h3">{t('borr.alt.title')}</CardTitle>
        
        <div className="border-l-4 border-accent pl-4 space-y-3 text-sm md:text-base">
          <p className="font-semibold">{t('borr.co.docFaltante')}</p>
          <p className="leading-relaxed">
            {t('borr.alt.texto1')}{' '}
            <strong>{t('borr.co.intima')}</strong>{' '}
            {t('borr.alt.texto2')}{' '}
            <strong>{t('borr.alt.plazo')}</strong>{' '}
            {t('borr.alt.texto3')}
          </p>
          <p className="leading-relaxed">{t('borr.alt.texto4')}</p>
          <p className="leading-relaxed">{t('borr.alt.texto5')}</p>
          <p>{t('borr.alt.cierre')}</p>
          <p className="italic text-muted-foreground text-sm border-t border-dashed border-border pt-3 mt-4">
            {t('borr.alt.disclaimer')}
          </p>
        </div>
      </Card>
    </>
  );
}
