import { Card, CardTitle, CardText } from '../Card';
import { Table, TableRow, TableCell } from '../Table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export function PanelBrechaRupeco() {
  const sectores = [
    {
      nombre: 'TIC',
      tramites: 8,
      obligatorio: true,
      cobertura: 100,
      ejemplos: 'Licencias TIC, Modificaciones societarias, VARC, Transferencias',
    },
    {
      nombre: 'Audiovisual',
      tramites: 4,
      obligatorio: false,
      cobertura: 0,
      ejemplos: 'Modificación estatutaria, Transferencia de licencia, Certificado vigencia, Renuncia',
    },
    {
      nombre: 'Postal',
      tramites: 2,
      obligatorio: false,
      cobertura: 0,
      ejemplos: 'Inscripción ENACOM, Registro de nuevos servicios',
    },
  ];

  const docsHumana = [
    'DNI',
    'CUIT',
    'Domicilio real',
    'Domicilio para notificaciones',
    'Correo electrónico',
    'DDJJ de no incompatibilidad legal',
    'DDJJ cumplimiento normas técnicas',
  ];

  const docsJuridica = [
    'Razón social',
    'Estatuto y acta constitutiva vigentes',
    'Actas de designación de autoridades',
    'Poderes de representación',
  ];

  const consolidacionData = [
    { tipo: 'Licencia TIC', normativa: 'Ley 27.078', reqComunes: '7-10', rupecoActual: 'Obligatorio', propuesta: 'Mantener' },
    { tipo: 'Transferencia TIC', normativa: 'Res. 697/2017', reqComunes: '10', rupecoActual: 'Obligatorio', propuesta: 'Mantener' },
    { tipo: 'Autorización audiovisual', normativa: 'Ley 26.522', reqComunes: '8-10', rupecoActual: 'No obligatorio', propuesta: 'Extender ✱' },
    { tipo: 'Transferencia audiovisual', normativa: 'Ley 26.522', reqComunes: '10', rupecoActual: 'No obligatorio', propuesta: 'Extender ✱' },
    { tipo: 'Habilitación postal', normativa: 'Normativa postal', reqComunes: '8-10', rupecoActual: 'No obligatorio', propuesta: 'Extender ✱' },
  ];

  const docsBadges = ['DNI', 'CUIT', 'Estatuto', 'Domicilio', 'DDJJ'];
  const tramitesOnceOnly = ['Licencia TIC', 'Autorización Audiovisual', 'Habilitación Postal'];

  return (
    <>
      {/* Sección 1: Introducción */}
      <Card>
        <CardTitle>Brecha RUPECO</CardTitle>
        <CardText>
          Del total de procedimientos alcanzados por el régimen de silencio positivo en el ENACOM (Decreto 971/2024), catorce (14) corresponden a trámites vinculados a los sectores TIC, audiovisual y postal. De ese universo, doce (12) comparten una base documental prácticamente idéntica.
        </CardText>
        <CardText>
          Sin embargo, el RUPECO — único registro diseñado para centralizar información de prestadores — solo es obligatorio para trámites TIC, dejando fuera al 43% de los procedimientos sujetos a silencio positivo.
        </CardText>
      </Card>

      {/* Sección 2: Cobertura por sector */}
      <Card>
        <CardTitle as="h3">Cobertura actual del RUPECO por sector</CardTitle>
        <p className="text-xs text-muted-foreground mb-4 italic">Tabla 1 del trabajo</p>
        <div className="space-y-6">
          {sectores.map((s, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{s.nombre}</span>
                  <Badge className={s.obligatorio ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                    {s.obligatorio ? 'Obligatorio' : 'No obligatorio'}
                  </Badge>
                </div>
                <span className="text-sm font-medium text-muted-foreground">{s.tramites} trámites</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={s.cobertura || 3} className={`h-3 ${!s.obligatorio ? '[&>div]:bg-red-500' : ''}`} />
                <span className="text-sm font-medium w-20 text-right">
                  {s.cobertura}% ({s.obligatorio ? `${s.tramites}/${s.tramites}` : `0/${s.tramites}`})
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{s.ejemplos}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">Hallazgo crítico</p>
            <p className="text-sm text-amber-700">
              Solo el 57% de los trámites sujetos a silencio positivo utilizan el RUPECO. La redundancia detectada no es documental, sino organizativa e informática. Entre el 70% y el 100% de los requisitos ya se encuentran o podrían encontrarse en el RUPECO sin reforma legislativa.
            </p>
          </div>
        </div>
      </Card>

      {/* Sección 3: Núcleo Documental Común */}
      <Card>
        <CardTitle as="h3">Núcleo Documental Común (Tabla 2)</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3 text-sm">Personas Humanas (7 requisitos)</h4>
            <ul className="space-y-1.5">
              {docsHumana.map((doc, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3 text-sm">Personas Jurídicas (+3 adicionales = 10)</h4>
            <ul className="space-y-1.5">
              {docsJuridica.map((doc, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-3 italic">+ los 7 requisitos de persona humana</p>
          </div>
        </div>
      </Card>

      {/* Sección 4: Principio Once-Only */}
      <Card>
        <CardTitle as="h3">Principio Once-Only: Antes vs. Después</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {/* Sin Penélope */}
          <div className="border border-red-200 bg-red-50/50 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-3 text-sm">Sin Penélope (situación actual)</h4>
            <div className="space-y-3">
              {tramitesOnceOnly.map((tramite, i) => (
                <div key={i}>
                  <p className="text-xs font-medium text-red-700 mb-1">{tramite}</p>
                  <div className="flex flex-wrap gap-1">
                    {docsBadges.map((doc, j) => (
                      <Badge key={j} variant="outline" className="text-xs border-red-300 text-red-600">{doc}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold text-red-800 mt-3">= 15 presentaciones documentales (5 × 3 trámites)</p>
          </div>

          {/* Con Penélope */}
          <div className="border border-green-200 bg-green-50/50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3 text-sm">Con Penélope (Once-Only)</h4>
            <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-3">
              <p className="text-xs font-semibold text-green-800 mb-2 text-center">RUPECO (Golden Record)</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {docsBadges.map((doc, j) => (
                  <Badge key={j} variant="outline" className="text-xs border-green-400 text-green-700">{doc}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              {tramitesOnceOnly.map((tramite, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-green-700">
                  <ArrowRight size={12} className="flex-shrink-0" />
                  <span>{tramite}</span>
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold text-green-800 mt-3">= 5 presentaciones (1 vez, reutilizable)</p>
          </div>
        </div>
      </Card>

      {/* Sección 5: Oportunidad de Consolidación */}
      <Card>
        <CardTitle as="h3">Oportunidad de Consolidación (Tabla 3)</CardTitle>
        <Table
          columns={[
            { key: 'tipo', header: 'Tipo de trámite' },
            { key: 'normativa', header: 'Normativa' },
            { key: 'reqComunes', header: 'Req. comunes' },
            { key: 'rupecoActual', header: 'RUPECO actual' },
            { key: 'propuesta', header: 'Propuesta' },
          ]}
        >
          {consolidacionData.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{row.tipo}</TableCell>
              <TableCell>{row.normativa}</TableCell>
              <TableCell>{row.reqComunes}</TableCell>
              <TableCell>
                <span className={row.rupecoActual === 'Obligatorio'
                  ? 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
                  : 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
                }>
                  {row.rupecoActual}
                </span>
              </TableCell>
              <TableCell highlight>{row.propuesta}</TableCell>
            </TableRow>
          ))}
        </Table>
        <p className="text-xs text-muted-foreground mt-3 italic">
          ✱ La extensión no requiere reforma legislativa, sino una resolución del ENACOM.
        </p>
      </Card>
    </>
  );
}
