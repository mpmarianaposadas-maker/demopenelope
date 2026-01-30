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

      {/* Comunicación Oficial CO - versión principal */}
      <Card as="article">
        <CardTitle>{t('borr.co.title')}</CardTitle>
        <div className="space-y-2 mb-4">
          <CardText>
            <strong>{t('borr.tipoDoc')}</strong> Comunicación Oficial (CO)
          </CardText>
          <CardText>
            <strong>{t('borr.estado')}</strong>{' '}
            <span className="status-pending">{t('borr.estadoPendiente')}</span>
          </CardText>
          <CardText>
            <strong>{t('borr.generadoPor')}</strong> {t('borr.co.generador')}
          </CardText>
        </div>

        <div className="border-l-4 border-primary pl-4 space-y-3 text-sm md:text-base">
          <p className="font-semibold">CO-2026-XXXXX-APN-ENACOM</p>
          <p>{t('borr.co.ref')} EX-2026-00123456-APN-ENACOM</p>
          <p>{t('borr.co.fecha')}</p>
          <p>{t('borr.co.destinatario')}</p>
          <p><strong>COOPERATIVA DEL VALLE LTDA.</strong></p>
          <p>{t('borr.co.domicilio')}</p>
          <p>{t('borr.co.presente')}</p>
          <p className="font-semibold">{t('borr.co.refIntimacion')}</p>
          
          <p className="leading-relaxed">{t('borr.co.texto1')}</p>
          <p className="leading-relaxed">{t('borr.co.texto2')}</p>
          <p className="font-semibold">{t('borr.co.docFaltante')}</p>
          <p className="leading-relaxed">
            {t('borr.co.texto3')}{' '}
            <strong>{t('borr.co.intima')}</strong>{' '}
            {t('borr.co.texto4')}{' '}
            <strong>{t('borr.co.plazo')}</strong>{' '}
            {t('borr.co.texto5')}
          </p>
          <p className="leading-relaxed">{t('borr.co.texto6')}</p>
          <p className="leading-relaxed">{t('borr.co.texto7')}</p>
          <p>{t('borr.co.cierre')}</p>
          <p className="italic text-muted-foreground text-sm border-t border-dashed border-border pt-3 mt-4">
            {t('borr.co.disclaimer')}
          </p>
        </div>
      </Card>

      {/* Comunicación Oficial CO - versión alternativa */}
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
