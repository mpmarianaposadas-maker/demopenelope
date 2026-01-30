import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Eye,
  ChevronDown,
  ChevronUp,
  Clock,
  UserCheck,
  FileCheck,
  FileX
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type TipoAccion = 
  | 'validar_requisito'
  | 'rechazar_requisito'
  | 'subsanar_requisito'
  | 'aprobar_expediente'
  | 'rechazar_expediente'
  | 'revertir_decision'
  | 'inicio_verificacion';

export interface AccionAgente {
  id: string;
  tipo: TipoAccion;
  timestamp: Date;
  agenteNombre?: string;
  descripcion: string;
  detalles?: string;
  requisitoId?: string;
  requisitoNombre?: string;
}

interface HistorialAccionesProps {
  acciones: AccionAgente[];
  expedienteNumero?: string;
}

const getIconoAccion = (tipo: TipoAccion) => {
  switch (tipo) {
    case 'validar_requisito':
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    case 'rechazar_requisito':
      return <XCircle className="h-4 w-4 text-destructive" />;
    case 'subsanar_requisito':
      return <FileCheck className="h-4 w-4 text-primary" />;
    case 'aprobar_expediente':
      return <UserCheck className="h-4 w-4 text-success" />;
    case 'rechazar_expediente':
      return <FileX className="h-4 w-4 text-destructive" />;
    case 'revertir_decision':
      return <RotateCcw className="h-4 w-4 text-cream-foreground" />;
    case 'inicio_verificacion':
      return <Eye className="h-4 w-4 text-primary" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getColorAccion = (tipo: TipoAccion) => {
  switch (tipo) {
    case 'validar_requisito':
    case 'aprobar_expediente':
      return 'border-l-success bg-success/5';
    case 'rechazar_requisito':
    case 'rechazar_expediente':
      return 'border-l-destructive bg-destructive/5';
    case 'subsanar_requisito':
      return 'border-l-primary bg-primary/5';
    case 'revertir_decision':
      return 'border-l-cream-dark bg-cream/50';
    case 'inicio_verificacion':
      return 'border-l-primary bg-primary/5';
    default:
      return 'border-l-muted bg-muted/5';
  }
};

const getBadgeAccion = (tipo: TipoAccion) => {
  switch (tipo) {
    case 'validar_requisito':
      return { label: 'Validación', className: 'bg-success/10 text-success border-success/30' };
    case 'rechazar_requisito':
      return { label: 'Rechazo Req.', className: 'bg-destructive/10 text-destructive border-destructive/30' };
    case 'subsanar_requisito':
      return { label: 'Subsanación', className: 'bg-primary/10 text-primary border-primary/30' };
    case 'aprobar_expediente':
      return { label: 'Aprobación', className: 'bg-success/10 text-success border-success/30' };
    case 'rechazar_expediente':
      return { label: 'Rechazo Exp.', className: 'bg-destructive/10 text-destructive border-destructive/30' };
    case 'revertir_decision':
      return { label: 'Reversión', className: 'bg-cream text-cream-foreground border-cream-dark' };
    case 'inicio_verificacion':
      return { label: 'Sistema', className: 'bg-muted text-muted-foreground border-muted-foreground/30' };
    default:
      return { label: 'Acción', className: 'bg-muted text-muted-foreground border-muted-foreground/30' };
  }
};

export function HistorialAcciones({ acciones, expedienteNumero }: HistorialAccionesProps) {
  const [expandido, setExpandido] = useState(true);

  if (acciones.length === 0) {
    return null;
  }

  const accionesOrdenadas = [...acciones].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <Card className="border-2 border-muted">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">
              Historial de Acciones
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {acciones.length} registros
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandido(!expandido)}
          >
            {expandido ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        {expedienteNumero && (
          <div className="text-xs text-muted-foreground mt-1">
            Expediente: {expedienteNumero}
          </div>
        )}
      </CardHeader>

      {expandido && (
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {accionesOrdenadas.map((accion, index) => {
                const badge = getBadgeAccion(accion.tipo);
                return (
                  <div
                    key={accion.id}
                    className={cn(
                      "p-3 rounded-lg border-l-4 transition-all",
                      getColorAccion(accion.tipo)
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getIconoAccion(accion.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={cn("text-xs", badge.className)}>
                            {badge.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {accion.timestamp.toLocaleString('es-AR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </span>
                        </div>
                        
                        <p className="text-sm font-medium mt-1">
                          {accion.descripcion}
                        </p>
                        
                        {accion.agenteNombre && (
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <UserCheck className="h-3 w-3" />
                            Agente: {accion.agenteNombre}
                          </div>
                        )}
                        
                        {accion.requisitoNombre && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Requisito: {accion.requisitoNombre}
                          </div>
                        )}
                        
                        {accion.detalles && (
                          <div className="text-xs text-muted-foreground mt-2 p-2 bg-background/50 rounded">
                            {accion.detalles}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {index < accionesOrdenadas.length - 1 && (
                      <div className="absolute left-[1.35rem] top-full h-3 w-px bg-border" />
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Primera acción: {accionesOrdenadas[accionesOrdenadas.length - 1]?.timestamp.toLocaleString('es-AR')}</span>
              <span>Última acción: {accionesOrdenadas[0]?.timestamp.toLocaleString('es-AR')}</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
