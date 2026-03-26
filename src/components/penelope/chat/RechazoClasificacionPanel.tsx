import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, XCircle, Scale, Bot, Building2, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CausalRechazo {
  id: string;
  label: string;
  descripcion: string;
  requiereTextoLibre: boolean;
  tipo: 'informalismo' | 'error_sistema' | 'mixto' | 'competencia' | 'otro';
  badgeColor: string;
}

const CAUSALES: CausalRechazo[] = [
  {
    id: 'informalismo',
    label: 'Reclasificación por informalismo',
    descripcion: 'Inconsistencia entre la solicitud y la documentación adjunta. Se reclasifica en favor del administrado (art. 1 inc. c, LNPA).',
    requiereTextoLibre: false,
    tipo: 'informalismo',
    badgeColor: 'border-blue-400 text-blue-700 bg-blue-50',
  },
  {
    id: 'error_sistema',
    label: 'Error de clasificación del sistema',
    descripcion: 'El modelo asignó un tipo de trámite incorrecto sin relación con el expediente.',
    requiereTextoLibre: false,
    tipo: 'error_sistema',
    badgeColor: 'border-amber-400 text-amber-700 bg-amber-50',
  },
  {
    id: 'mixto',
    label: 'Expediente mixto',
    descripcion: 'El trámite involucra más de una categoría.',
    requiereTextoLibre: false,
    tipo: 'mixto',
    badgeColor: 'border-purple-400 text-purple-700 bg-purple-50',
  },
  {
    id: 'competencia',
    label: 'Competencia de otro organismo',
    descripcion: 'El trámite corresponde a la competencia de otro organismo público.',
    requiereTextoLibre: false,
    tipo: 'competencia',
    badgeColor: 'border-gray-400 text-gray-600 bg-gray-50',
  },
  {
    id: 'otro',
    label: 'Otro',
    descripcion: 'Especifique el motivo del rechazo.',
    requiereTextoLibre: true,
    tipo: 'otro',
    badgeColor: 'border-gray-400 text-gray-600 bg-gray-50',
  },
];

const CAUSAL_ICONS: Record<string, React.ReactNode> = {
  informalismo: <Scale className="h-4 w-4" />,
  error_sistema: <Bot className="h-4 w-4" />,
  mixto: <AlertTriangle className="h-4 w-4" />,
  competencia: <Building2 className="h-4 w-4" />,
  otro: <HelpCircle className="h-4 w-4" />,
};

export interface DatosRechazo {
  causal: CausalRechazo;
  detalleAdicional?: string;
}

interface RechazoClasificacionPanelProps {
  onConfirmarRechazo: (datos: DatosRechazo) => void;
  onVolver: () => void;
}

export function RechazoClasificacionPanel({ onConfirmarRechazo, onVolver }: RechazoClasificacionPanelProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [textoLibre, setTextoLibre] = useState('');

  const causalSeleccionada = CAUSALES.find(c => c.id === selectedId);
  const requiereTexto = causalSeleccionada?.requiereTextoLibre;
  const puedeConfirmar = selectedId && (!requiereTexto || textoLibre.trim().length > 0);

  const handleConfirmar = () => {
    if (!causalSeleccionada) return;
    onConfirmarRechazo({
      causal: causalSeleccionada,
      detalleAdicional: requiereTexto ? textoLibre.trim() : undefined,
    });
  };

  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-destructive/20">
            <XCircle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-lg">
              Rechazo de Clasificación — Causal Obligatoria
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Seleccione el motivo del rechazo antes de confirmar. Este registro quedará asentado en el Prompt Net Ledger.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <RadioGroup value={selectedId} onValueChange={setSelectedId} className="space-y-2">
          {CAUSALES.map((causal) => (
            <div
              key={causal.id}
              className={cn(
                "flex items-start space-x-3 rounded-lg border p-3 transition-colors bg-background",
                selectedId === causal.id && "border-destructive/50 bg-destructive/5"
              )}
            >
              <RadioGroupItem value={causal.id} id={`causal-${causal.id}`} className="mt-0.5" />
              <Label htmlFor={`causal-${causal.id}`} className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  {CAUSAL_ICONS[causal.id]}
                  <span className="text-sm font-medium">{causal.label}</span>
                  <Badge variant="outline" className={cn("text-[10px]", causal.badgeColor)}>
                    {causal.tipo === 'informalismo' ? 'Informalismo' :
                     causal.tipo === 'error_sistema' ? 'Error IA' :
                     causal.tipo === 'mixto' ? 'Mixto' :
                     causal.tipo === 'competencia' ? 'Competencia' : 'Otro'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{causal.descripcion}</p>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Campo de texto libre para "Otro" */}
        {requiereTexto && (
          <div className="space-y-2 pl-6">
            <Label className="text-sm font-medium">Detalle del motivo (obligatorio):</Label>
            <Textarea
              value={textoLibre}
              onChange={(e) => setTextoLibre(e.target.value)}
              placeholder="Describa el motivo del rechazo..."
              className="min-h-[80px] text-sm"
            />
          </div>
        )}

        {/* Aviso informalismo */}
        {selectedId === 'informalismo' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Scale className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-800">
                <strong>Principio de informalismo a favor del administrado:</strong> Al confirmar, 
                el sistema habilitará la selección de un nuevo tipo de trámite sin reiniciar el expediente, 
                conforme art. 1 inc. c) de la Ley N° 19.549.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-3 pt-0">
        <Button variant="outline" onClick={onVolver} className="text-muted-foreground">
          Volver
        </Button>
        <Button
          variant="destructive"
          onClick={handleConfirmar}
          disabled={!puedeConfirmar}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Confirmar rechazo
        </Button>
      </CardFooter>
    </Card>
  );
}

export { CAUSALES };
