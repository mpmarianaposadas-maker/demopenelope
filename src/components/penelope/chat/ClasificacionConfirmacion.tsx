import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, CheckCircle2, Clock, FileText, HelpCircle, Info } from 'lucide-react';
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

// Categorías permitidas según normativa del proyecto
const CATEGORIAS_PERMITIDAS = [
  { codigo: 'ENAC00062', nombre: 'Licencia TIC nueva' },
  { codigo: 'ENAC00025', nombre: 'Autorización de servicios audiovisuales' },
  { codigo: 'ENAC00063', nombre: 'Modificación societaria TIC' },
  { codigo: 'ENAC00064', nombre: 'Renovación de licencia TIC' },
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
    <Card className="border-amber-200 bg-amber-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-amber-100">
            <HelpCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-lg text-amber-900">
              Clasificación Asistida del Trámite
            </CardTitle>
            <p className="text-xs text-amber-700 mt-1">
              Requiere confirmación del operador antes de continuar
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Resumen de clasificación IA */}
        {!clasificacion.ambiguo ? (
          <div className="bg-white rounded-lg border p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Trámite probable:</span>
                </div>
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

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                {clasificacion.alcanzadoPorSilencioPositivo ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Info className="h-4 w-4 text-muted-foreground" />
                )}
                <span>
                  {clasificacion.alcanzadoPorSilencioPositivo 
                    ? 'Alcanzado por silencio positivo' 
                    : 'No alcanzado por silencio positivo'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Plazo estimado: {clasificacion.plazoEstimado} días</span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground border-t pt-2">
              <strong>Vencimiento tentativo:</strong>{' '}
              {clasificacion.fechaVencimientoEstimado.toLocaleDateString('es-AR')}
            </div>
          </div>
        ) : (
          <div className="bg-red-50 rounded-lg border border-red-200 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Clasificación ambigua
                </p>
                <p className="text-sm text-red-700 mt-1">
                  La evidencia documental es insuficiente para determinar el tipo de trámite 
                  con claridad. El operador debe seleccionar la categoría correspondiente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Aviso de asistencia */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-800">
              <strong>Nota:</strong> Esta clasificación es una asistencia automatizada. 
              La categoría definitiva del trámite la determina el operador humano.
            </p>
          </div>
        </div>

        {/* Selección de categoría */}
        <div className="space-y-3">
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
                    "flex items-center space-x-3 rounded-lg border p-3 transition-colors",
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
