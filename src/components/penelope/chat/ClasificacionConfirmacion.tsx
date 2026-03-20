import { useState } from 'react';
import { formatFechaAR } from '@/lib/formatDate';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, CheckCircle2, Bot, HelpCircle, Info, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type TramiteENAC, TRAMITES_ENAC } from '@/lib/nucleoRupeco';

export type NivelConfianzaCualitativo = 'Alto' | 'Medio' | 'Bajo';

export interface ClasificacionPendiente {
  tramite: TramiteENAC;
  tipoPersona: 'humana' | 'juridica';
  nivelConfianza: NivelConfianzaCualitativo;
  nivelConfianzaNumerico: number;
  alcanzadoPorSilencioPositivo: boolean;
  plazoEstimado: number;
  fechaVencimientoEstimado: Date;
  ambiguo: boolean;
}

interface ClasificacionConfirmacionProps {
  clasificacion: ClasificacionPendiente;
  onConfirmar: (tramiteConfirmado: TramiteENAC) => void;
  onRechazar: () => void;
}

// Categorías permitidas según normativa del proyecto (enunciativo y limitado a esta demo)
const CATEGORIAS_PERMITIDAS = [
  { codigo: 'ENAC00062', nombre: 'Licencia TIC – Alta nueva' },
  { codigo: 'ENAC00025', nombre: 'Autorización de servicios audiovisuales' },
  { codigo: 'ENAC00063', nombre: 'Modificación societaria TIC' },
  { codigo: 'ENAC00064', nombre: 'Actualización de datos RUPECO' },
  { codigo: 'ENAC00013', nombre: 'Habilitación de servicios postales' },
];

export function ClasificacionConfirmacion({ 
  clasificacion, 
  onConfirmar, 
  onRechazar 
}: ClasificacionConfirmacionProps) {
  const [seleccionManual, setSeleccionManual] = useState<string | undefined>(
    clasificacion.ambiguo ? undefined : clasificacion.tramite.codigo
  );

  const getNivelConfianzaColor = (nivel: NivelConfianzaCualitativo) => {
    switch (nivel) {
      case 'Alto': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medio': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Bajo': return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const handleConfirmar = () => {
    if (!seleccionManual) return;
    
    // Buscar el trámite seleccionado
    const tramiteSeleccionado = TRAMITES_ENAC.find(t => t.codigo === seleccionManual);
    if (tramiteSeleccionado) {
      onConfirmar(tramiteSeleccionado);
    }
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/20">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">
              Clasificación Asistida del Trámite
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Resumen de clasificación IA - Formato tabla según especificación */}
        {!clasificacion.ambiguo ? (
          <div className="space-y-4">
            {/* Trámite probable con confianza */}
            <div className="flex items-start justify-between gap-4 p-3 bg-background rounded-lg border">
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-1">Trámite probable:</div>
                <p className="text-base font-semibold text-foreground">
                  {clasificacion.tramite.nombre}
                </p>
              </div>
              <Badge 
                variant="outline" 
                className={cn("shrink-0", getNivelConfianzaColor(clasificacion.nivelConfianza))}
              >
                Confianza: {clasificacion.nivelConfianza}
              </Badge>
            </div>

            {/* Tabla de parámetros - Según especificación del documento */}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Parámetro</TableHead>
                    <TableHead className="font-semibold">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Alcanzado por régimen de silencio positivo (demo)</TableCell>
                    <TableCell>
                      {clasificacion.alcanzadoPorSilencioPositivo ? (
                        <span className="flex items-center gap-1 text-success">
                          <CheckCircle2 className="h-4 w-4" /> Sí
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Plazo estimado (solo a efectos de la demo)</TableCell>
                    <TableCell>{clasificacion.plazoEstimado} días</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Vencimiento tentativo (demo)</TableCell>
                    <TableCell>{formatFechaAR(clasificacion.fechaVencimientoEstimado)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Nota explicativa de confianza técnica */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-800 space-y-1">
                  <p className="font-semibold">¿Qué significa "confianza técnica"?</p>
                  <p>
                    Es una medida interna de la IA sobre cuán probable considera que su clasificación 
                    técnica sea correcta (por ejemplo, que se trate efectivamente de "{clasificacion.tramite.nombre}").
                  </p>
                  <p>
                    No es una validación jurídica ni reemplaza el análisis del operador. 
                    <strong> Aunque la confianza sea "Alta", el operador debe confirmar siempre antes de continuar.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  No fue posible clasificar el trámite con suficiente claridad
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  La evidencia documental es ambigua. El operador debe seleccionar la categoría correspondiente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Aviso de confirmación obligatoria */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <HelpCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-800">
              <p className="font-semibold"><Pin size={14} className="inline mr-1" />Requiere confirmación del operador antes de continuar con la verificación documental.</p>
            </div>
          </div>
        </div>

        {/* Nota final sobre asistencia */}
        <div className="p-3 bg-muted/50 border border-muted-foreground/20 rounded-lg">
          <p className="text-xs text-muted-foreground italic">
            <strong>Nota:</strong> Esta clasificación es una asistencia automatizada. 
            La categoría definitiva del trámite la determina el operador humano.
          </p>
        </div>

        {/* Selección de categoría */}
        <div className="space-y-3 pt-2">
          <Label className="text-sm font-medium">
            {clasificacion.ambiguo 
              ? 'Seleccione el tipo de trámite:' 
              : 'Confirme o modifique la clasificación:'}
          </Label>
          <RadioGroup 
            value={seleccionManual} 
            onValueChange={setSeleccionManual}
            className="space-y-2"
          >
            {CATEGORIAS_PERMITIDAS.map((cat) => {
              const esDetectado = cat.codigo === clasificacion.tramite.codigo;
              return (
                <div
                  key={cat.codigo}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg border p-3 transition-colors bg-background",
                    seleccionManual === cat.codigo && "border-primary bg-primary/5",
                    esDetectado && !clasificacion.ambiguo && "border-green-300 bg-green-50/50"
                  )}
                >
                  <RadioGroupItem value={cat.codigo} id={cat.codigo} />
                  <Label 
                    htmlFor={cat.codigo} 
                    className="flex-1 cursor-pointer text-sm"
                  >
                    {cat.nombre}
                    {esDetectado && !clasificacion.ambiguo && (
                      <Badge variant="outline" className="ml-2 text-[10px] bg-green-100 text-green-700 border-green-300">
                        Detectado por IA
                      </Badge>
                    )}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-3 pt-0">
        <Button 
          variant="outline" 
          onClick={onRechazar}
          className="text-muted-foreground"
        >
          Cancelar verificación
        </Button>
        <Button 
          onClick={handleConfirmar}
          disabled={!seleccionManual}
          className="bg-primary"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Confirmar clasificación
        </Button>
      </CardFooter>
    </Card>
  );
}
