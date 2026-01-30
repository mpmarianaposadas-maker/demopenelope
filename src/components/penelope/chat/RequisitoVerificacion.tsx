import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronDown,
  ChevronUp,
  Shield,
  Scale,
  UserCheck,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AprobacionExpediente } from '@/hooks/useChatRupecoSimulado';

export interface RequisitoItem {
  id: string;
  nombre: string;
  normativa: string;
  articuloEspecifico?: string;
  detectado: boolean;
  nivelConfianza: number;
  validadoPorAgente?: boolean;
  observacionAgente?: string;
}

interface RequisitoVerificacionProps {
  requisitos: RequisitoItem[];
  onValidarRequisito: (id: string, validado: boolean, observacion?: string) => void;
  tipoPersona: 'humana' | 'juridica';
  tramiteNombre: string;
  onAprobarExpediente?: (agenteNombre: string, observaciones?: string) => void;
  aprobacion?: AprobacionExpediente | null;
  todosValidados?: boolean;
}

export function RequisitoVerificacion({ 
  requisitos, 
  onValidarRequisito,
  tipoPersona,
  tramiteNombre,
  onAprobarExpediente,
  aprobacion,
  todosValidados = false
}: RequisitoVerificacionProps) {
  const [expandido, setExpandido] = useState(true);
  const [agenteNombre, setAgenteNombre] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [mostrarFormAprobacion, setMostrarFormAprobacion] = useState(false);
  
  const cumplidos = requisitos.filter(r => r.detectado);
  const faltantes = requisitos.filter(r => !r.detectado);
  const validadosManualmente = requisitos.filter(r => r.validadoPorAgente === true).length;
  const rechazadosManualmente = requisitos.filter(r => r.validadoPorAgente === false).length;
  const totalRevisados = requisitos.filter(r => r.validadoPorAgente !== undefined).length;
  const puedeAprobar = todosValidados && !aprobacion;

  const getConfianzaColor = (nivel: number) => {
    if (nivel >= 85) return 'text-success';
    if (nivel >= 60) return 'text-warning-foreground';
    return 'text-destructive';
  };

  const getConfianzaBg = (nivel: number) => {
    if (nivel >= 85) return 'bg-success/10';
    if (nivel >= 60) return 'bg-cream';
    return 'bg-destructive/10';
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">
              Verificación de Requisitos RUPECO
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandido(!expandido)}
          >
            {expandido ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Resumen */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            ✓ {cumplidos.length} detectados
          </Badge>
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
            ✗ {faltantes.length} faltantes
          </Badge>
          {validadosManualmente > 0 && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              👤 {validadosManualmente} validados
            </Badge>
          )}
          <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/30">
            📋 {totalRevisados}/{requisitos.length} revisados
          </Badge>
        </div>
      </CardHeader>

      {expandido && (
        <CardContent className="space-y-4">
          {/* Info del trámite */}
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <div className="flex items-center gap-2 mb-1">
              <Scale className="h-4 w-4 text-primary" />
              <span className="font-medium">{tramiteNombre}</span>
            </div>
            <div className="text-muted-foreground text-xs">
              Tipo de persona: {tipoPersona === 'humana' ? 'Persona Humana' : 'Persona Jurídica'}
            </div>
          </div>

          {/* Leyenda */}
          <div className="p-2 bg-cream/50 rounded-lg text-xs border border-cream-dark">
            <div className="font-medium mb-1 text-cream-foreground">⚖️ Política de "Cuatro Ojos"</div>
            <p className="text-cream-foreground/80">
              Cada requisito detectado por IA debe ser verificado por el agente. 
              Use los controles para validar o rechazar la detección automática.
            </p>
          </div>

          {/* Requisitos cumplidos */}
          {cumplidos.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Requisitos Detectados ({cumplidos.length})
              </div>
              <div className="space-y-2">
                {cumplidos.map((req) => (
                  <div 
                    key={req.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all",
                      req.validadoPorAgente === true && "border-success bg-success/5",
                      req.validadoPorAgente === false && "border-destructive bg-destructive/5",
                      req.validadoPorAgente === undefined && "border-border bg-background"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{req.nombre}</span>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getConfianzaBg(req.nivelConfianza), getConfianzaColor(req.nivelConfianza))}
                          >
                            {req.nivelConfianza}% conf.
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <span className="font-medium">Base normativa:</span> {req.normativa}
                          {req.articuloEspecifico && ` - ${req.articuloEspecifico}`}
                        </div>
                      </div>
                      
                      {/* Controles de validación */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant={req.validadoPorAgente === true ? "default" : "outline"}
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => onValidarRequisito(req.id, true)}
                          title="Validar detección"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant={req.validadoPorAgente === false ? "destructive" : "outline"}
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => onValidarRequisito(req.id, false)}
                          title="Rechazar detección"
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {req.validadoPorAgente !== undefined && (
                      <div className="mt-2 pt-2 border-t border-border/50 text-xs">
                        {req.validadoPorAgente ? (
                          <span className="text-success flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Validado por agente
                          </span>
                        ) : (
                          <span className="text-destructive flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            Rechazado por agente - Requiere documentación
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requisitos faltantes */}
          {faltantes.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                Requisitos Faltantes ({faltantes.length})
              </div>
              <div className="space-y-2">
                {faltantes.map((req) => (
                  <div 
                    key={req.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all",
                      req.validadoPorAgente === true && "border-success bg-success/5",
                      req.validadoPorAgente !== true && "border-destructive/50 bg-destructive/5"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                          <span className="font-medium text-sm">{req.nombre}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 ml-6">
                          <span className="font-medium">Exigido por:</span> {req.normativa}
                          {req.articuloEspecifico && ` - ${req.articuloEspecifico}`}
                        </div>
                      </div>
                      
                      {/* Control para marcar como subsanado */}
                      <Button
                        variant={req.validadoPorAgente === true ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => onValidarRequisito(req.id, true)}
                        title="Marcar como subsanado/presentado"
                      >
                        {req.validadoPorAgente === true ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Subsanado
                          </>
                        ) : (
                          'Marcar subsanado'
                        )}
                      </Button>
                    </div>
                    
                    {req.validadoPorAgente === true && (
                      <div className="mt-2 pt-2 border-t border-success/30 text-xs text-success flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Documento presentado/subsanado por el administrado
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advertencia de silencio positivo */}
          {faltantes.filter(f => f.validadoPorAgente !== true).length > 0 && (
            <div className="p-3 bg-cream rounded-lg border border-cream-dark">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-cream-foreground flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm text-cream-foreground">
                    ⏰ Control de Silencio Positivo (Decreto 971/2024)
                  </div>
                  <p className="text-xs text-cream-foreground/80 mt-1">
                    Hay {faltantes.filter(f => f.validadoPorAgente !== true).length} documento(s) faltante(s). 
                    Debe generarse Providencia de Intimación para evitar la configuración del silencio administrativo positivo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Panel de aprobación ya realizada */}
          {aprobacion && (
            <div className="p-4 bg-success/10 rounded-lg border-2 border-success">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-success/20 rounded-full">
                  <UserCheck className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-success flex items-center gap-2">
                    ✅ Expediente Aprobado
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Agente:</strong> {aprobacion.agenteNombre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Fecha:</strong> {aprobacion.timestamp.toLocaleString('es-AR')}</span>
                    </div>
                    {aprobacion.observaciones && (
                      <div className="mt-2 p-2 bg-background/50 rounded text-xs">
                        <strong>Observaciones:</strong> {aprobacion.observaciones}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botón y formulario de aprobación */}
          {!aprobacion && onAprobarExpediente && (
            <div className="border-t border-border pt-4">
              {!mostrarFormAprobacion ? (
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => setMostrarFormAprobacion(true)}
                    disabled={!puedeAprobar}
                    className="w-full"
                    size="lg"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    {puedeAprobar 
                      ? 'Aprobar Expediente' 
                      : `Revisar todos los requisitos (${totalRevisados}/${requisitos.length})`
                    }
                  </Button>
                  {!puedeAprobar && (
                    <p className="text-xs text-muted-foreground text-center">
                      Debe revisar todos los requisitos antes de aprobar el expediente
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <UserCheck className="h-4 w-4 text-primary" />
                    Registro de Aprobación
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Nombre del Agente <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="Ingrese su nombre completo"
                      value={agenteNombre}
                      onChange={(e) => setAgenteNombre(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Observaciones (opcional)
                    </label>
                    <Textarea
                      placeholder="Agregue observaciones si corresponde..."
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      className="bg-background resize-none"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setMostrarFormAprobacion(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => {
                        if (agenteNombre.trim()) {
                          onAprobarExpediente(agenteNombre.trim(), observaciones.trim() || undefined);
                          setMostrarFormAprobacion(false);
                        }
                      }}
                      disabled={!agenteNombre.trim()}
                      className="flex-1"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Confirmar Aprobación
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
