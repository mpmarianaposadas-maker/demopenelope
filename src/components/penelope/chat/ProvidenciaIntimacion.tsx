import { Button } from '@/components/ui/button';
import { formatFechaAR } from '@/lib/formatDate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Copy, Check, AlertTriangle, Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DocumentoFaltante {
  nombre: string;
  normativa: string;
}

interface ExpedienteData {
  numero: string;
  caratula: string;
  tipoPersona: 'humana' | 'juridica';
  tramiteNombre: string;
  tramiteCodigo: string;
  tramiteNormativa: string;
  plazoSilencioPositivo: number;
  fechaIngreso: Date;
}

interface ProvidenciaIntimacionProps {
  expediente: ExpedienteData;
  documentosFaltantes: DocumentoFaltante[];
}

function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function calcularFechaLimite(fechaIngreso: Date, plazo: number): Date {
  const fechaLimite = new Date(fechaIngreso);
  fechaLimite.setDate(fechaLimite.getDate() + plazo);
  return fechaLimite;
}

function generarTextoNota(
  expediente: ExpedienteData,
  documentosFaltantes: DocumentoFaltante[]
): string {
  const fechaActual = formatearFecha(new Date());
  const fechaLimiteSilencio = formatearFecha(
    calcularFechaLimite(expediente.fechaIngreso, expediente.plazoSilencioPositivo)
  );

  const tablaDocumentos = documentosFaltantes
    .map((doc, idx) => `| ${idx + 1} | ${doc.nombre} | ${doc.normativa} |`)
    .join('\n');

  return `
═══════════════════════════════════════════════════════════════════
          ENTE NACIONAL DE COMUNICACIONES - ENACOM
          NOTA DE INTIMACIÓN
═══════════════════════════════════════════════════════════════════

Número de Nota: [ Campo a completar por el agente ]
Expediente: ${expediente.numero}
Fecha: ${fechaActual}

Destinatario: ${expediente.caratula.split(' s/')[0]}
Domicilio constituido: [ Campo a completar por el agente ]

Ref.: INTIMACIÓN - Subsanación documental

De mi consideración:

Me dirijo a Ud. en relación al expediente de referencia, tramitado ante
este Ente Nacional de Comunicaciones conforme la normativa vigente en
materia de Servicios de Tecnologías de la Información y las Comunicaciones
(Ley N° 27.078 y modificatorias).

Del análisis formal de la documentación aportada mediante Trámites a
Distancia (TAD), se ha detectado la falta de documentación obligatoria
conforme Res. ENACOM N° 3731/2019 (RUPECO).

══════════════════════════════════════════════════════════════════
                    DOCUMENTACIÓN FALTANTE
══════════════════════════════════════════════════════════════════

| N° | Documento Requerido                      | Base Normativa          |
|----|------------------------------------------|-------------------------|
${tablaDocumentos}

══════════════════════════════════════════════════════════════════

En virtud de lo expuesto, y de conformidad con lo establecido en los
artículos 1° inciso f) y 3° de la Ley Nacional de Procedimientos
Administrativos N° 19.549, se INTIMA a subsanar dentro de DIEZ (10)
DÍAS HÁBILES ADMINISTRATIVOS desde la notificación de la presente,
bajo apercibimiento de archivo (Art. 5°, Decreto N° 1759/72 T.O. 2017).

La documentación requerida deberá ser presentada a través del sistema
de Trámites a Distancia (TAD), citando el número de expediente.

Sin otro particular, saludo a Ud. atentamente.

[ Firma del agente — Campo a completar por el agente ]
[ Cargo y dependencia — Campo a completar por el agente ]
`.trim();
}

export function ProvidenciaIntimacion({ 
  expediente, 
  documentosFaltantes 
}: ProvidenciaIntimacionProps) {
  const [copied, setCopied] = useState(false);
  
  const textoNota = generarTextoNota(expediente, documentosFaltantes);
  const fechaLimiteSilencio = calcularFechaLimite(expediente.fechaIngreso, expediente.plazoSilencioPositivo);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textoNota);
      setCopied(true);
      toast.success('Nota copiada al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Error al copiar');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([textoNota], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Nota_Intimacion_GDE_${expediente.numero.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Nota descargada - Lista para cargar en GDE');
  };

  if (documentosFaltantes.length === 0) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-base text-amber-800 dark:text-amber-200">
              Borrador de Nota de Intimación
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
              <FileText className="h-3 w-3 text-blue-600" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">Para carga en GDE</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs bg-amber-100 dark:bg-amber-900/50 px-2 py-1 rounded">
              <AlertTriangle className="h-3 w-3 text-amber-600" />
              <span className="text-amber-700 dark:text-amber-300 font-medium">Requiere validación</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Resumen destacado */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-background rounded-lg border p-3">
            <div className="text-xs text-muted-foreground mb-1">Expediente</div>
            <div className="font-mono text-sm font-medium truncate">{expediente.numero}</div>
          </div>
          <div className="bg-white dark:bg-background rounded-lg border p-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Clock className="h-3 w-3" />
              Plazo subsanación
            </div>
            <div className="font-medium text-sm">10 días hábiles</div>
          </div>
        </div>

        {/* Tabla de documentos faltantes */}
        <div className="rounded-lg border bg-white dark:bg-background overflow-hidden">
          <div className="bg-amber-100 dark:bg-amber-900/30 px-3 py-2 border-b">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-200">
              {documentosFaltantes.length} documento(s) faltante(s)
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="w-[50%] py-2">Documento</TableHead>
                <TableHead className="py-2">Base Normativa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentosFaltantes.map((doc, idx) => (
                <TableRow key={idx} className="text-xs">
                  <TableCell className="py-2 font-medium">{doc.nombre}</TableCell>
                  <TableCell className="py-2 text-muted-foreground">{doc.normativa}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Control de plazos */}
        <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900 p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-red-600" />
            <div>
              <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                Control Silencio Positivo (Decreto 971/2024)
              </div>
              <div className="text-xs text-red-700 dark:text-red-300">
                Plazo máximo: {expediente.plazoSilencioPositivo} días
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Vence</div>
            <div className="text-sm font-bold text-red-700 dark:text-red-300">
              {formatFechaAR(fechaLimiteSilencio)}
            </div>
          </div>
        </div>

        {/* Vista previa del texto */}
        <details className="group">
          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <span className="group-open:rotate-90 transition-transform">▶</span>
            Ver texto completo del borrador de nota
          </summary>
          <div className="mt-2 bg-white dark:bg-background rounded-md border p-3 max-h-[150px] overflow-y-auto">
            <pre className="text-[9px] font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {textoNota}
            </pre>
          </div>
        </details>
        
        {/* Acciones */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            className="flex-1"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1 text-green-600" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copiar
              </>
            )}
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleDownload}
            className="flex-1"
          >
            <Download className="h-3 w-3 mr-1" />
            Descargar
          </Button>
        </div>
        
        <hr className="border-border mt-3 mb-0" />
        <div className="bg-gray-100 dark:bg-gray-800/40 border-l-4 border-amber-400 pl-3 pr-3 py-2 mt-2 rounded-r">
          <span className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium">Marca de sistema — no forma parte del instrumento</span>
          <p className="text-[10px] text-amber-700 dark:text-amber-400 text-center font-medium">
            <AlertTriangle size={14} className="inline mr-1" />Borrador de NOTA para carga en GDE · Requiere validación y carga manual por el operador
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export type { ExpedienteData, DocumentoFaltante };
