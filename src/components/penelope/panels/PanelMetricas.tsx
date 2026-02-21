import { Card, CardTitle, CardText } from '../Card';
import { Table, TableRow, TableCell } from '../Table';
import { useLanguage } from '@/hooks/useLanguage';
import { AlertTriangle, Lightbulb, Rocket, Database, FlaskConical, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    { pais: 'Argentina - ENACOM', sistema: 'Sistema Penélope', reduccion: '35-40% proyectado', estado: t('metr.estadoDesarrollo') },
  ];

  return (
    <>
      <Card>
        <CardTitle>{t('metr.title')}</CardTitle>
        <CardText>
          Proyecciones estimadas basadas en experiencias internacionales comparables (ANATEL - Brasil, OFCOM - Reino Unido) y estudios de organismos multilaterales (BID, OCDE). Las cifras representan objetivos de diseño, no datos empíricos del ENACOM.
        </CardText>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          {[
            { value: '35-40%', subtitle: 'reducción total', note: 'en etapas preliminares' },
            { value: '70-100%', subtitle: 'overlap RUPECO', note: 'requisitos reutilizables' },
            { value: '12-18', subtitle: 'días ganados', note: 'para análisis sustantivo' },
            { value: '100%', subtitle: 'supervisión humana', note: 'en toda decisión' },
          ].map((kpi, i) => (
            <div key={i} className="p-4 bg-secondary rounded-lg text-center transition-all duration-300 ease-out hover:scale-105 hover:shadow-md hover:bg-primary/10 cursor-default group">
              <div className="text-2xl md:text-3xl font-bold text-primary transition-transform duration-300 group-hover:scale-110">{kpi.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{kpi.subtitle}</div>
              <div className="text-xs text-muted-foreground/70 mt-0.5">{kpi.note}</div>
            </div>
          ))}
        </div>
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

      {/* Indicadores de Éxito - Cap. VIII */}
      <Card>
        <CardTitle as="h3">Indicadores de Éxito (Cap. VIII)</CardTitle>
        <CardText>Indicadores cualitativos y cuantitativos definidos en el trabajo final para evaluar el impacto de Penélope:</CardText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {[
            { label: 'Tiempo promedio de admisibilidad formal', tipo: 'Cuantitativo' },
            { label: 'Número de ciclos de subsanación por expediente', tipo: 'Cuantitativo' },
            { label: 'Porcentaje de reutilización de datos RUPECO', tipo: 'Cuantitativo' },
            { label: 'Percepción del administrado', tipo: 'Cualitativo' },
            { label: 'Percepción de los agentes', tipo: 'Cualitativo' },
          ].map((kpi, i) => (
            <div key={i} className="border border-border rounded-lg p-3 flex items-start gap-2">
              <Lightbulb size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">{kpi.label}</p>
                <Badge variant="outline" className="text-xs mt-1">{kpi.tipo}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Fases de Implementación - Cap. VIII */}
      <Card>
        <CardTitle as="h3">Fases de Implementación</CardTitle>
        <CardText>Hoja de ruta del trabajo final (Cap. VIII, p. 19-21):</CardText>
        <div className="space-y-3 my-4">
          {[
            { icon: Users, fase: 'Fase 1', titulo: 'Planificación interdisciplinaria', desc: 'Conformación de equipo con perfiles jurídicos, técnicos y de gestión del cambio.' },
            { icon: Database, fase: 'Fase 2', titulo: 'Golden Dataset (conjunto de datos curado)', desc: 'Construcción de dataset representativo para evitar automatización acrítica de patrones históricos.' },
            { icon: FlaskConical, fase: 'Fase 3', titulo: 'Piloto controlado', desc: 'Prueba en entorno acotado con expedientes reales y supervisión reforzada.' },
            { icon: Rocket, fase: 'Fase 4', titulo: 'Despliegue gradual y gestión del cambio', desc: 'Escalado progresivo con modelo ADKAR de acompañamiento institucional.' },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-3 border border-border rounded-lg p-4">
              <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                <f.icon size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary">{f.fase}</span>
                  <span className="text-sm font-semibold text-foreground">{f.titulo}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Modelo ADKAR - Anexo IV */}
      <Card>
        <CardTitle as="h3">Gestión del Cambio — Modelo ADKAR</CardTitle>
        <CardText>
          El Anexo IV del trabajo final propone el modelo ADKAR para la adopción institucional de Penélope:
        </CardText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {[
            { letra: 'A', titulo: 'Awareness', desc: 'Talleres de sensibilización sobre IA responsable en la Administración Pública.' },
            { letra: 'D', titulo: 'Desire', desc: 'Certificación como «Operadores de IA Pública» para generar incentivo profesional.' },
            { letra: 'K', titulo: 'Knowledge', desc: 'Capacitación en interpretación de alertas, semáforos y outputs del sistema.' },
            { letra: 'A', titulo: 'Ability', desc: 'Simulacros en sandbox con expedientes de prueba y retroalimentación supervisada.' },
          ].map((etapa, i) => (
            <div key={i} className="border border-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{etapa.letra}</span>
                <span className="text-sm font-semibold text-foreground">{etapa.titulo}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed ml-8">{etapa.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Nota metodológica */}
      <Card>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">Nota metodológica</p>
            <p className="text-sm text-amber-700">
              Los indicadores de impacto y las simulaciones presentadas son proyecciones estimadas (objetivos de diseño), construidas sobre la base de experiencias internacionales comparables (ANATEL - Brasil, OFCOM - Reino Unido) y estudios de organismos multilaterales (BID, OCDE). No reflejan datos empíricos del ENACOM.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}
