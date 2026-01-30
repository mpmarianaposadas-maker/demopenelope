import { Card, CardTitle, CardText } from '../Card';
import { Table, TableRow, TableCell } from '../Table';
import { useLanguage } from '@/hooks/useLanguage';

export function PanelMetricas() {
  const { t } = useLanguage();

  const tiemposData = [
    { fase: t('metr.fase1'), actual: '1-2 días', penelope: '5 minutos', reduccion: '-95%' },
    { fase: t('metr.fase2'), actual: '3-5 días', penelope: '2-4 horas', reduccion: '-90%' },
    { fase: t('metr.fase3'), actual: '10-15 días', penelope: '1 día', reduccion: '-85%' },
    { fase: t('metr.fase4'), actual: '2-3 días', penelope: t('metr.inmediato'), reduccion: '-100%' },
    { fase: t('metr.fase5'), actual: '15-25 días', penelope: '15-25 días', reduccion: t('metr.inalterado') },
    { fase: t('metr.faseTotal'), actual: '28-46 días', penelope: '18-27 días', reduccion: '-35 a -40%' },
  ];

  const internacionalData = [
    { pais: 'Estonia', sistema: 'X-Road (interoperabilidad)', reduccion: '844 años ahorrados/año', estado: t('metr.estadoOperativo') },
    { pais: 'Reino Unido', sistema: 'GOV.UK Notify (notificaciones)', reduccion: '75% en comunicaciones', estado: t('metr.estadoOperativo') },
    { pais: 'Dinamarca', sistema: 'MitID + Once-Only', reduccion: '80% en documentación', estado: t('metr.estadoOperativo') },
    { pais: 'Colombia', sistema: 'SUIT (Trámites digitales)', reduccion: '60% en tiempos administrativos', estado: t('metr.estadoOperativo') },
    { pais: 'Argentina - ENACOM', sistema: 'Sistema Penélope', reduccion: '85% proyectado', estado: t('metr.estadoDesarrollo') },
  ];

  return (
    <>
      <Card>
        <CardTitle>{t('metr.title')}</CardTitle>
        <CardText>{t('metr.intro')}</CardText>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="p-4 bg-secondary rounded-lg text-center">
            <div className="text-3xl font-bold text-primary">{t('metr.kpi1.value')}</div>
            <div className="text-sm text-muted-foreground">{t('metr.kpi1.label')}</div>
          </div>
          <div className="p-4 bg-secondary rounded-lg text-center">
            <div className="text-3xl font-bold text-primary">{t('metr.kpi2.value')}</div>
            <div className="text-sm text-muted-foreground">{t('metr.kpi2.label')}</div>
          </div>
          <div className="p-4 bg-secondary rounded-lg text-center">
            <div className="text-3xl font-bold text-primary">{t('metr.kpi3.value')}</div>
            <div className="text-sm text-muted-foreground">{t('metr.kpi3.label')}</div>
          </div>
          <div className="p-4 bg-secondary rounded-lg text-center">
            <div className="text-3xl font-bold text-primary">{t('metr.kpi4.value')}</div>
            <div className="text-sm text-muted-foreground">{t('metr.kpi4.label')}</div>
          </div>
        </div>

        <CardText>{t('metr.desc1')}</CardText>
        <CardText>{t('metr.desc2')}</CardText>
        <CardText>{t('metr.desc3')}</CardText>
        <CardText>{t('metr.desc4')}</CardText>
      </Card>

      <Card>
        <CardTitle as="h3">{t('metr.tiempos.title')}</CardTitle>
        <Table
          columns={[
            { key: 'fase', header: t('metr.tiempos.col1') },
            { key: 'actual', header: t('metr.tiempos.col2') },
            { key: 'penelope', header: t('metr.tiempos.col3') },
            { key: 'reduccion', header: t('metr.tiempos.col4') },
          ]}
        >
          {tiemposData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.fase}</TableCell>
              <TableCell>{row.actual}</TableCell>
              <TableCell>{row.penelope}</TableCell>
              <TableCell highlight>{row.reduccion}</TableCell>
            </TableRow>
          ))}
        </Table>

        <div className="mt-4">
          <CardText>
            {t('metr.tiempos.conclusion1')}{' '}
            <strong className="text-highlight">{t('metr.tiempos.diasAdicionales')}</strong>{' '}
            {t('metr.tiempos.conclusion2')}
          </CardText>
          <CardText>{t('metr.tiempos.nota')}</CardText>
        </div>
      </Card>

      <Card>
        <CardTitle as="h3">{t('metr.internacional.title')}</CardTitle>
        <Table
          columns={[
            { key: 'pais', header: t('metr.internacional.col1') },
            { key: 'sistema', header: t('metr.internacional.col2') },
            { key: 'reduccion', header: t('metr.internacional.col3') },
            { key: 'estado', header: t('metr.internacional.col4') },
          ]}
        >
          {internacionalData.map((row, index) => (
            <TableRow key={index}>
              <TableCell highlight>{row.pais}</TableCell>
              <TableCell>{row.sistema}</TableCell>
              <TableCell>{row.reduccion}</TableCell>
              <TableCell>
                <span
                  className={
                    row.estado === t('metr.estadoOperativo')
                      ? 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
                      : 'status-pending'
                  }
                >
                  {row.estado}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </>
  );
}
