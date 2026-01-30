import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Eye,
  ChevronDown,
  ChevronUp,
  Shield,
  Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

export function RequisitoVerificacion({ 
  requisitos, 
  onValidarRequisito,
  tipoPersona,
  tramiteNombre
}: RequisitoVerificacionProps) {
  const [expandido, setExpandido] = useState(true);
  
  const cumplidos = requisitos.filter(r => r.detectado);
  const faltantes = requisitos.filter(r => !r.detectado);
  const validadosManualmente = requisitos.filter(r => r.validadoPorAgente === true).length;
  const rechazadosManualmente = requisitos.filter(r => r.validadoPorAgente === false).length;

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
        </CardContent>
      )}
    </Card>
  );
}
