import { Card, CardTitle, CardText } from '../Card';
import { Table, TableRow, TableCell } from '../Table';

export function PanelTrazabilidad() {
  const complianceData = [
    {
      pilar: 'Transparencia',
      solucion: 'Marca de agua "Generado por IA" + notificación en expediente',
      sustento: 'Ley 25.326 / Ética Pública',
    },
    {
      pilar: 'Supervisión Humana',
      solucion: 'Flujo Human-in-the-Loop obligatorio antes de firma',
      sustento: 'AI Act (Art. 14) / LNPA',
    },
    {
      pilar: 'No Discrecionalidad',
      solucion: 'Opera solo sobre reglas binarias (Cumple/No Cumple) predefinidas',
      sustento: 'Doctrina del Acto Administrativo',
    },
    {
      pilar: 'Seguridad de Datos',
      solucion: 'Arquitectura Secure Overlay: Lee pero no escribe en BBDD sin validación',
      sustento: 'ISO/IEC 27001',
    },
    {
      pilar: 'Explicabilidad',
      solucion: 'Prompt Net Ledger registra cada decisión algorítmica',
      sustento: 'ISO/IEC 42001 / AI Act',
    },
  ];

  return (
    <>
      <Card>
        <CardTitle>Trazabilidad y Compliance</CardTitle>
        <CardText>
          Todo procesamiento automatizado queda registrado con timestamp certificado. El administrado puede solicitar acceso al log de su expediente conforme Ley de Acceso a la Información Pública N° 27.275.
        </CardText>
        <CardText>
          Ninguna acción con efectos jurídicos (notificaciones, intimaciones, decisiones) se ejecuta sin validación expresa del agente humano. El sistema asiste, no decide.
        </CardText>
        <CardText>
          Temperatura 0.0 en prompts críticos garantiza determinismo. Sistema de validación cruzada con bases normativas actualizadas (RAG). Métricas de confianza transparentes.
        </CardText>
        <CardText>
          El sistema NO realiza evaluaciones subjetivas (solvencia, idoneidad, perfil de riesgo). Solo verifica cumplimiento formal de requisitos objetivos establecidos por normativa.
        </CardText>
      </Card>

      <Card>
        <CardTitle as="h3">Pilares de cumplimiento</CardTitle>
        <CardText>
          El sistema Penélope fue diseñado siguiendo los requisitos de la norma internacional ISO/IEC 42001:2023 (Sistemas de Gestión de Inteligencia Artificial).
        </CardText>

        <Table
          columns={[
            { key: 'pilar', header: 'Pilar de Compliance' },
            { key: 'solucion', header: 'Solución en Penélope' },
            { key: 'sustento', header: 'Sustento Normativo' },
          ]}
        >
          {complianceData.map((row, index) => (
            <TableRow key={index}>
              <TableCell highlight>{row.pilar}</TableCell>
              <TableCell>{row.solucion}</TableCell>
              <TableCell>{row.sustento}</TableCell>
            </TableRow>
          ))}
        </Table>

        <div className="mt-4 space-y-2">
          <CardText>
            Registro inmutable de todas las acciones del sistema para garantizar explicabilidad y defensa jurídica.
          </CardText>
          <CardText>
            Mecanismo de seguridad para detener el sistema ante riesgos inminentes.
          </CardText>
        </div>
      </Card>
    </>
  );
}
