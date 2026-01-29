import { Card, CardTitle, CardText } from '../Card';
import { Table, TableRow, TableCell } from '../Table';

export function PanelMetricas() {
  const tiemposData = [
    { fase: '1. Ingreso y caratulación', actual: '1-2 días', penelope: '5 minutos', reduccion: '-95%' },
    { fase: '2. Verificación documental inicial', actual: '3-5 días', penelope: '2-4 horas', reduccion: '-90%' },
    { fase: '3. Primera subsanación (si aplica)', actual: '10-15 días', penelope: '1 día', reduccion: '-85%' },
    { fase: '4. Clasificación y derivación', actual: '2-3 días', penelope: 'Inmediato', reduccion: '-100%' },
    { fase: '5. Análisis técnico-jurídico', actual: '15-25 días', penelope: '15-25 días', reduccion: '0% (inalterado)' },
    { fase: 'TOTAL (sin subsanación)', actual: '28-46 días', penelope: '18-27 días', reduccion: '-35 a -40%' },
  ];

  const internacionalData = [
    { pais: 'Estonia', sistema: 'X-Road (interoperabilidad)', reduccion: '844 años ahorrados/año', estado: 'Operativo' },
    { pais: 'Reino Unido', sistema: 'GOV.UK Notify (notificaciones)', reduccion: '75% en comunicaciones', estado: 'Operativo' },
    { pais: 'Dinamarca', sistema: 'MitID + Once-Only', reduccion: '80% en documentación', estado: 'Operativo' },
    { pais: 'Colombia', sistema: 'SUIT (Trámites digitales)', reduccion: '60% en tiempos administrativos', estado: 'Operativo' },
    { pais: 'Argentina - ENACOM', sistema: 'Sistema Penélope', reduccion: '85% proyectado', estado: 'En desarrollo' },
  ];

  return (
    <>
      <Card>
        <CardTitle>Métricas y Beneficios Proyectados</CardTitle>
        <CardText>
          Métricas proyectadas basadas en datos de ENACOM 2024-2025 y benchmarks internacionales.
        </CardText>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="p-4 bg-secondary rounded-lg text-center">
            <div className="text-3xl font-bold text-primary">21 → 3</div>
            <div className="text-sm text-muted-foreground">días promedio</div>
          </div>
          <div className="p-4 bg-secondary rounded-lg text-center">
            <div className="text-3xl font-bold text-primary">-85%</div>
            <div className="text-sm text-muted-foreground">documentación</div>
          </div>
          <div className="p-4 bg-secondary rounded-lg text-center">
            <div className="text-3xl font-bold text-primary">97%</div>
            <div className="text-sm text-muted-foreground">confianza LLM</div>
          </div>
          <div className="p-4 bg-secondary rounded-lg text-center">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">decisión expresa</div>
          </div>
        </div>

        <CardText>De 21 días (promedio actual) a 3 días con Penélope.</CardText>
        <CardText>Gracias a interoperabilidad con RUPECO (Once-Only).</CardText>
        <CardText>
          Confianza promedio del modelo LLM (validado con 500 expedientes históricos).
        </CardText>
        <CardText>
          Sistema de alertas garantiza decisión expresa en 100% de los casos.
        </CardText>
      </Card>

      <Card>
        <CardTitle as="h3">Impacto en tiempos del procedimiento</CardTitle>
        <Table
          columns={[
            { key: 'fase', header: 'Fase del Procedimiento' },
            { key: 'actual', header: 'Tiempo Actual' },
            { key: 'penelope', header: 'Tiempo con Penélope' },
            { key: 'reduccion', header: 'Reducción' },
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
            Con una reducción del 35-40% en etapas preliminares, el organismo gana{' '}
            <strong className="text-highlight">12-18 días adicionales</strong> para el análisis sustantivo antes del vencimiento del plazo legal.
          </CardText>
          <CardText>
            Las proyecciones se basan en evidencia comparada (ANATEL, OFCOM) y estudios del BID. De 1-2 días a 5 minutos, de 3-5 días a 2-4 horas, de 10-15 días a 1 día. Principio Once-Only.
          </CardText>
        </div>
      </Card>

      <Card>
        <CardTitle as="h3">Comparación internacional</CardTitle>
        <Table
          columns={[
            { key: 'pais', header: 'País/Organismo' },
            { key: 'sistema', header: 'Sistema' },
            { key: 'reduccion', header: 'Reducción Tiempos' },
            { key: 'estado', header: 'Estado' },
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
                    row.estado === 'Operativo'
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
