import { Card, CardTitle, CardText } from '../Card';
import { Table, TableRow, TableCell } from '../Table';
import { useLanguage } from '@/hooks/useLanguage';
import { AlertTriangle, Lightbulb, Rocket, Database, FlaskConical, Users, Eye, CheckCircle, GraduationCap, MessageSquare } from 'lucide-react';
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
      {/* Disclaimer de proyección */}
      <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 text-xs text-amber-700 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-300">
        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
        <span>
          Panel ilustrativo de piloto simulado. Los valores presentados son proyecciones estimadas y no corresponden a datos reales del ENACOM. Escenario proyectado sobre la base de benchmarking internacional.
        </span>
      </div>

      <Card>
        <CardTitle>{t('metr.title')}</CardTitle>
        <CardText>
          Proyecciones estimadas basadas en experiencias internacionales comparables (ANATEL - Brasil, OFCOM - Reino Unido) y estudios de organismos multilaterales (BID, OCDE). Las cifras representan objetivos de diseño, no datos empíricos del ENACOM.
        </CardText>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          {[
            { value: '35-40%', subtitle: 'reducción proyectada', note: 'en etapas preliminares' },
            { value: '70-100%', subtitle: 'overlap RUPECO', note: 'requisitos reutilizables' },
            { value: '12-18', subtitle: 'días ganados (meta)', note: 'para análisis sustantivo' },
            { value: '100%', subtitle: 'supervisión humana', note: 'en toda operación' },
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
        <Badge variant="outline" className="text-[10px] mb-3 border-amber-300 text-amber-700 bg-amber-50">Escenario simulado — Benchmark de diseño</Badge>
        <Table
          columns={[
            { key: 'fase', header: t('metr.tiempos.col1') },
            { key: 'actual', header: t('metr.tiempos.col2') },
            { key: 'penelope', header: `${t('metr.tiempos.col3')} (proyección)` },
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

      {/* Indicadores de Éxito */}
      <Card>
        <CardTitle as="h3">Indicadores de Éxito</CardTitle>
        <CardText>Indicadores cualitativos y cuantitativos definidos para evaluar el impacto proyectado de Penélope:</CardText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {[
            { label: 'Tiempo promedio de admisibilidad formal', tipo: 'Cuantitativo — meta esperada' },
            { label: 'Número de ciclos de subsanación por expediente', tipo: 'Cuantitativo — objetivo de piloto' },
            { label: 'Porcentaje de reutilización de datos RUPECO', tipo: 'Cuantitativo — proyección ilustrativa' },
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

      {/* Fases de Implementación */}
      <Card>
        <CardTitle as="h3">Fases de Implementación</CardTitle>
        <CardText>Hoja de ruta propuesta para el despliegue gradual de Penélope:</CardText>
        <div className="space-y-3 my-4">
          {[
            { icon: Users, fase: 'Fase 1', titulo: 'Planificación interdisciplinaria', desc: 'Conformación de equipo con perfiles jurídicos, técnicos y de gestión organizativa.' },
            { icon: Database, fase: 'Fase 2', titulo: 'Golden Dataset (conjunto de datos curado)', desc: 'Construcción de dataset representativo para evitar automatización acrítica de patrones históricos.' },
            { icon: FlaskConical, fase: 'Fase 3', titulo: 'Piloto controlado', desc: 'Prueba en entorno acotado con expedientes reales y supervisión reforzada.' },
            { icon: Rocket, fase: 'Fase 4', titulo: 'Despliegue gradual y acompañamiento institucional', desc: 'Escalado progresivo con monitoreo continuo, capacitación y mejora iterativa.' },
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

      {/* Gestión del Cambio — NO TOCAR */}
      <Card>
        <CardTitle as="h3">Gestión del Cambio</CardTitle>
        <CardText>
          La incorporación de Penélope no se reduce a una decisión tecnológica. Requiere condiciones organizativas que faciliten su apropiación institucional de forma gradual, prudente y supervisada.
        </CardText>

        <div className="space-y-4 my-4">
          {/* Eje 1 */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                <Eye size={18} className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">1. Comprensión del problema institucional</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  El punto de partida no es introducir inteligencia artificial, sino visibilizar el problema organizativo que Penélope busca abordar: reiteración documental, ciclos evitables de subsanación, fragmentación de registros y riesgo de demora en etapas preliminares. La herramienta no interviene sobre la autonomía técnica o jurídica del agente.
                </p>
              </div>
            </div>
          </div>

          {/* Eje 2 */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                <CheckCircle size={18} className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">2. Beneficio verificable desde el piloto</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  La legitimidad interna de la herramienta no se construye con promesas abstractas, sino con beneficios observables en un piloto controlado: mejora en tiempos de admisibilidad formal, reducción de pedidos de subsanación puramente formales, mayor orden en etapas preliminares y mejor trazabilidad operativa. Todo beneficio es acotado, verificable y sujeto a revisión.
                </p>
              </div>
            </div>
          </div>

          {/* Eje 3 */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                <GraduationCap size={18} className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">3. Capacitación orientada al criterio y a la supervisión humana</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  La capacitación no exige conocimiento técnico profundo sobre modelos de lenguaje. Se centra en habilidades de supervisión:
                </p>
                <ul className="text-xs text-muted-foreground leading-relaxed list-disc ml-4 space-y-0.5">
                  <li>Interpretar alertas y semáforos del sistema</li>
                  <li>Revisar clasificaciones preliminares y validar o corregir información extraída</li>
                  <li>Revisar borradores no vinculantes antes de su carga en GDE</li>
                  <li>Comprender los límites de intervención de Penélope</li>
                  <li>Sostener el principio de validación humana obligatoria</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Eje 4 */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                <MessageSquare size={18} className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">4. Retroalimentación continua y mejora iterativa</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  La gestión del cambio incluye mecanismos para que agentes y equipos puedan reportar errores, señalar casos no previstos, proponer ajustes y participar en la mejora de reglas, flujos o alertas. La experiencia del personal es insumo para la evolución de la herramienta y condición de su apropiación institucional.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cierre */}
        <div className="border-t border-border pt-3 mt-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            La gestión del cambio no se agota en una capacitación inicial. Comprende soporte continuo, consulta, revisión periódica y actualización de instructivos. Su finalidad es que Penélope sea percibida como infraestructura de apoyo no decisorio, orientada a ordenar etapas preliminares y liberar tiempo para el análisis sustantivo, sin desplazar la responsabilidad humana ni alterar el régimen jurídico aplicable.
          </p>
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

      {/* Cierre / Conclusión de la PoC */}
      <Card>
        <CardTitle as="h3">Síntesis</CardTitle>
        <div className="bg-primary/5 border-l-4 border-l-primary rounded-r-lg p-4 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Penélope no propone reemplazar la decisión humana. Organiza y asiste etapas preliminares del procedimiento administrativo, liberando tiempo para el análisis sustantivo que corresponde al agente competente.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Esta prueba de concepto muestra un escenario institucional posible, presentado como propuesta académica y no como sistema en producción. Combina innovación con límites claros, trazabilidad, prudencia y gobernanza.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Toda intervención del sistema es acotada, supervisada y reversible. El régimen jurídico aplicable, la responsabilidad del agente público y el debido proceso administrativo permanecen inalterados.
          </p>
        </div>
      </Card>
    </>
  );
}
