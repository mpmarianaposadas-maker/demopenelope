import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Copy, Check } from 'lucide-react';
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

function generarTextoProvidencia(
  expediente: ExpedienteData,
  documentosFaltantes: DocumentoFaltante[]
): string {
  const fechaActual = formatearFecha(new Date());
  const fechaLimite = formatearFecha(
    calcularFechaLimite(expediente.fechaIngreso, 10) // 10 días hábiles para subsanar
  );
  const tipoPersonaTexto = expediente.tipoPersona === 'juridica' 
    ? 'la persona jurídica' 
    : 'el/la administrado/a';

  const listaDocumentos = documentosFaltantes
    .map((doc, idx) => `   ${idx + 1}. ${doc.nombre}\n      → Base normativa: ${doc.normativa}`)
    .join('\n');

  return `
═══════════════════════════════════════════════════════════════════════════════
                          ENTE NACIONAL DE COMUNICACIONES
                                     ENACOM
═══════════════════════════════════════════════════════════════════════════════

                      *** BORRADOR - REQUIERE VALIDACIÓN ***

                          PROVIDENCIA DE INTIMACIÓN
                          
Expediente N°: ${expediente.numero}
Carátula: ${expediente.caratula}
Trámite: ${expediente.tramiteNombre} (${expediente.tramiteCodigo})
Normativa aplicable: ${expediente.tramiteNormativa}
Fecha: ${fechaActual}

───────────────────────────────────────────────────────────────────────────────

                                 VISTO:

El expediente de la referencia, mediante el cual ${tipoPersonaTexto} 
"${expediente.caratula.split(' s/')[0]}" solicita ${expediente.tramiteNombre.toLowerCase()};

                               CONSIDERANDO:

Que de la verificación documental automatizada efectuada por el sistema 
"PENÉLOPE" surge la falta de presentación de documentación obligatoria 
requerida por la normativa vigente;

Que conforme lo establecido en el Decreto N° 971/2024 (Reglamento General 
del Silencio Administrativo Positivo - PEHAR), la documentación exigida 
resulta de cumplimiento obligatorio para la procedencia del trámite;

Que la Resolución ENACOM N° 3731/2019 (RUPECO - Registro Único de Personas 
de Comunicaciones) establece los requisitos documentales mínimos que deben 
cumplir los administrados ante este Organismo;

Que el Art. 5° del Reglamento de Procedimientos Administrativos (Decreto 
N° 1759/72 T.O. 2017) dispone que la Administración intimará al interesado 
para que subsane los defectos formales de la presentación dentro del plazo 
que se fije, bajo apercibimiento de tenerla por desistida;

───────────────────────────────────────────────────────────────────────────────

                        POR ELLO, SE RESUELVE:

ARTÍCULO 1°.- INTIMAR a ${tipoPersonaTexto} "${expediente.caratula.split(' s/')[0]}" 
a que dentro del plazo de DIEZ (10) días hábiles administrativos contados 
desde la notificación de la presente, acompañe la siguiente documentación 
faltante:

${listaDocumentos}

ARTÍCULO 2°.- HACER SABER que el incumplimiento de lo dispuesto en el 
artículo anterior dará lugar a que se tenga por desistido el trámite, 
procediendo al archivo de las actuaciones conforme lo dispuesto por el 
Art. 5° del Decreto N° 1759/72 (T.O. 2017).

ARTÍCULO 3°.- NOTIFICAR al interesado conforme los medios previstos en el 
Art. 41 del Decreto N° 1759/72 (T.O. 2017).

ARTÍCULO 4°.- Registrar, comunicar y cumplido, archivar.

───────────────────────────────────────────────────────────────────────────────

                          ⚠️ CONTROL DE PLAZOS (Decreto 971/2024)

Plazo de silencio administrativo positivo aplicable: ${expediente.plazoSilencioPositivo} días
Fecha límite absoluta para resolución: ${formatearFecha(calcularFechaLimite(expediente.fechaIngreso, expediente.plazoSilencioPositivo))}

───────────────────────────────────────────────────────────────────────────────

                      *** SECCIÓN PARA USO INTERNO ***

[ ] Validado por agente: _________________________

[ ] Revisión jurídica: _________________________

Firma: _________________________

Aclaración: _________________________

Cargo: _________________________

Fecha de firma: _________________________

═══════════════════════════════════════════════════════════════════════════════
            BORRADOR GENERADO AUTOMÁTICAMENTE POR PENÉLOPE v1.0
         Sistema de Verificación Documental - ENACOM
         
         ⚠️ ESTE DOCUMENTO REQUIERE REVISIÓN Y VALIDACIÓN HUMANA
            ANTES DE SU FIRMA Y NOTIFICACIÓN AL ADMINISTRADO
═══════════════════════════════════════════════════════════════════════════════
`.trim();
}

export function ProvidenciaIntimacion({ 
  expediente, 
  documentosFaltantes 
}: ProvidenciaIntimacionProps) {
  const [copied, setCopied] = useState(false);
  
  const textoProvidencia = generarTextoProvidencia(expediente, documentosFaltantes);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textoProvidencia);
      setCopied(true);
      toast.success('Providencia copiada al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Error al copiar');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([textoProvidencia], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Providencia_Intimacion_${expediente.numero.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Providencia descargada');
  };

  if (documentosFaltantes.length === 0) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-base text-amber-800 dark:text-amber-200">
            📋 Borrador de Providencia de Intimación
          </CardTitle>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
          Se detectaron <strong>{documentosFaltantes.length} documento(s) faltante(s)</strong>. 
          El borrador ha sido generado automáticamente según la normativa vigente.
        </p>
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
          ⚠️ Requiere validación del agente antes de su firma y cursado al administrado.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-white dark:bg-background rounded-md border p-3 max-h-[200px] overflow-y-auto">
          <pre className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {textoProvidencia}
          </pre>
        </div>
        
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
                Copiar texto
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
            Descargar .txt
          </Button>
        </div>
        
        <p className="text-[10px] text-muted-foreground text-center">
          ⚠️ Este documento es un borrador. Requiere revisión antes de su firma.
        </p>
      </CardContent>
    </Card>
  );
}

export type { ExpedienteData, DocumentoFaltante };
