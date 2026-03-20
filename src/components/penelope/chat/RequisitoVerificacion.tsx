import { useState } from 'react';
import { formatFechaHoraAR } from '@/lib/formatDate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronDown,
  ChevronUp,
  Shield,
  Scale,
  UserCheck,
  Clock,
  RotateCcw,
  FileWarning,
  Info,
  FileText,
  FolderOpen,
  ClipboardList,
  CircleDot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AprobacionExpediente } from '@/hooks/useChatRupecoSimulado';
import { useIsMobile } from '@/hooks/use-mobile';

// Estados de detección del documento según semáforo
export type EstadoDeteccion = 'verde' | 'amarillo' | 'rojo';

export interface RequisitoItem {
  id: string;
  nombre: string;
  normativa: string;
  articuloEspecifico?: string;
  detectado: boolean;
  nivelConfianza: number;
  validadoPorAgente?: boolean;
  observacionAgente?: string;
  // Nuevos campos para orden en expediente
  estadoIA: EstadoDeteccion;
  ordenExpediente: string;
  comentarioBrief?: string;
  problemaOCR?: boolean;
}

interface RequisitoVerificacionProps {
  requisitos: RequisitoItem[];
  onValidarRequisito: (id: string, validado: boolean, observacion?: string) => void;
  tipoPersona: 'humana' | 'juridica';
  tramiteNombre: string;
  onAprobarExpediente?: (agenteNombre: string, observaciones?: string) => void;
  onRechazarExpediente?: (agenteNombre: string, motivoRechazo: string) => void;
  onRevertirDecision?: (agenteNombre: string, justificacion: string) => void;
  aprobacion?: AprobacionExpediente | null;
  todosValidados?: boolean;
}

// Componente para mostrar el estado semáforo
function EstadoSemaforo({ estado, problemaOCR }: { estado: EstadoDeteccion; problemaOCR?: boolean }) {
  const config = {
    verde: { icon: <CircleDot size={14} className="text-success" />, label: 'Verde', className: 'text-success' },
    amarillo: { icon: <CircleDot size={14} className="text-warning-foreground" />, label: 'Amarillo', className: 'text-warning-foreground' },
    rojo: { icon: <CircleDot size={14} className="text-destructive" />, label: 'Rojo', className: 'text-destructive' },
  };
  const { icon, className } = config[estado];
  
  return (
    <span className={cn("flex items-center gap-1 text-sm", className)}>
      {icon} {estado.charAt(0).toUpperCase() + estado.slice(1)}
      {problemaOCR && <FileWarning className="h-3 w-3 ml-1" />}
    </span>
  );
}

// Componente de card para vista mobile
function RequisitoCardMobile({ 
  req, 
  index, 
  onValidarRequisito 
}: { 
  req: RequisitoItem; 
  index: number; 
  onValidarRequisito: (id: string, validado: boolean) => void;
}) {
  const estadoConfig = {
    verde: { bg: 'bg-success/10 border-success/30', text: 'text-success', emoji: <CircleDot size={14} className="text-success" /> },
    amarillo: { bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800', text: 'text-amber-600', emoji: <CircleDot size={14} className="text-amber-600" /> },
    rojo: { bg: 'bg-destructive/10 border-destructive/30', text: 'text-destructive', emoji: <CircleDot size={14} className="text-destructive" /> }
  };

  const config = estadoConfig[req.estadoIA];

  return (
    <Card className={cn(
      "border",
      req.validadoPorAgente === true && "border-success bg-success/5",
      req.validadoPorAgente === false && "border-destructive bg-destructive/5",
      req.validadoPorAgente === undefined && config.bg
    )}>
      <CardContent className="p-4 space-y-3">
        {/* Header con número y estado */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
              {index + 1}
            </span>
            <Badge variant="outline" className={cn("gap-1", config.bg, config.text)}>
              {config.emoji} {req.estadoIA.charAt(0).toUpperCase() + req.estadoIA.slice(1)}
              {req.problemaOCR && <FileWarning className="h-3 w-3" />}
            </Badge>
          </div>
          {req.validadoPorAgente !== undefined && (
            <Badge variant={req.validadoPorAgente ? "default" : "destructive"} className="text-xs">
              {req.validadoPorAgente ? <><CheckCircle2 size={12} className="inline mr-1" />Validado</> : <><XCircle size={12} className="inline mr-1" />Rechazado</>}
            </Badge>
          )}
        </div>

        {/* Nombre del requisito */}
        <div>
          <p className="font-medium text-sm">{req.nombre}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {req.normativa}
            {req.articuloEspecifico && ` - ${req.articuloEspecifico}`}
          </p>
        </div>

        {/* Orden en expediente */}
        <div className="flex items-center gap-2 text-xs">
          <FileText className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">Orden:</span>
          <span className="font-medium">{req.ordenExpediente || 'No determinado'}</span>
        </div>

        {/* Comentario breve */}
        {req.comentarioBrief && (
          <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            {req.comentarioBrief}
          </p>
        )}

        {/* Alerta OCR si aplica */}
        {req.problemaOCR && (
          <div className="text-xs text-amber-600 italic flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 p-2 rounded">
            <FileWarning className="h-3 w-3" />
            Posible error OCR - Revisar manualmente
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2 pt-2">
          <Button
            variant={req.validadoPorAgente === true ? "default" : "outline"}
            size="sm"
            className="flex-1 h-9"
            onClick={() => onValidarRequisito(req.id, true)}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Validar
          </Button>
          <Button
            variant={req.validadoPorAgente === false ? "destructive" : "outline"}
            size="sm"
            className="flex-1 h-9"
            onClick={() => onValidarRequisito(req.id, false)}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Rechazar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function RequisitoVerificacion({
  requisitos, 
  onValidarRequisito,
  tipoPersona,
  tramiteNombre,
  onAprobarExpediente,
  onRechazarExpediente,
  onRevertirDecision,
  aprobacion,
  todosValidados = false
}: RequisitoVerificacionProps) {
  const [expandido, setExpandido] = useState(true);
  const [agenteNombre, setAgenteNombre] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [justificacionReversion, setJustificacionReversion] = useState('');
  const [mostrarFormAprobacion, setMostrarFormAprobacion] = useState(false);
  const [mostrarFormRechazo, setMostrarFormRechazo] = useState(false);
  const [mostrarFormReversion, setMostrarFormReversion] = useState(false);
  const isMobile = useIsMobile();
  
  const verdes = requisitos.filter(r => r.estadoIA === 'verde');
  const amarillos = requisitos.filter(r => r.estadoIA === 'amarillo');
  const rojos = requisitos.filter(r => r.estadoIA === 'rojo');
  const validadosManualmente = requisitos.filter(r => r.validadoPorAgente === true).length;
  const totalRevisados = requisitos.filter(r => r.validadoPorAgente !== undefined).length;
  const puedeAprobar = todosValidados && !aprobacion;
  const expedienteResuelto = aprobacion?.aprobado || aprobacion?.rechazado;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">
              <FolderOpen size={16} className="inline mr-1" /> Verificación del Núcleo Documental (demo)
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
        
        {/* Resumen con semáforos */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            <CircleDot size={12} className="inline mr-1" />{verdes.length} verdes
          </Badge>
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
            <CircleDot size={12} className="inline mr-1" />{amarillos.length} amarillos
          </Badge>
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
            <CircleDot size={12} className="inline mr-1" />{rojos.length} rojos
          </Badge>
          <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/30">
            <ClipboardList size={12} className="inline mr-1" />{totalRevisados}/{requisitos.length} revisados
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

          {/* Tabla/Cards de verificación documental - Layout responsive */}
          {isMobile ? (
            // Vista mobile: Cards apilables
            <div className="space-y-3">
              {requisitos.map((req, index) => (
                <RequisitoCardMobile
                  key={req.id}
                  req={req}
                  index={index}
                  onValidarRequisito={onValidarRequisito}
                />
              ))}
            </div>
          ) : (
            // Vista desktop: Tabla completa
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center font-semibold">Nº</TableHead>
                    <TableHead className="font-semibold">Requisito</TableHead>
                    <TableHead className="w-24 text-center font-semibold">Estado IA</TableHead>
                    <TableHead className="font-semibold">Orden en el expediente</TableHead>
                    <TableHead className="font-semibold">Comentario breve</TableHead>
                    <TableHead className="w-24 text-center font-semibold">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requisitos.map((req, index) => (
                    <TableRow 
                      key={req.id}
                      className={cn(
                        req.validadoPorAgente === true && "bg-success/5",
                        req.validadoPorAgente === false && "bg-destructive/5",
                      )}
                    >
                      <TableCell className="text-center font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{req.nombre}</div>
                        <div className="text-xs text-muted-foreground">
                          {req.normativa}
                          {req.articuloEspecifico && ` - ${req.articuloEspecifico}`}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <EstadoSemaforo estado={req.estadoIA} problemaOCR={req.problemaOCR} />
                      </TableCell>
                      <TableCell className="text-sm">
                        {req.ordenExpediente || 'No determinado'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px]">
                        {req.comentarioBrief || '—'}
                        {req.problemaOCR && (
                          <div className="mt-1 text-xs text-amber-600 italic">
                            <AlertTriangle size={12} className="inline mr-1" />Posible error OCR
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant={req.validadoPorAgente === true ? "default" : "outline"}
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => onValidarRequisito(req.id, true)}
                            title="Validar"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant={req.validadoPorAgente === false ? "destructive" : "outline"}
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => onValidarRequisito(req.id, false)}
                            title="Rechazar"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Texto informativo sobre "Orden en el expediente" */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-800">
               <strong><Info size={14} className="inline mr-1" /></strong> El campo "Orden en el expediente" indica el número de orden del documento 
                dentro del expediente electrónico (conforme Decreto 336/17 y nomenclatura GDE), 
                donde se detectó cada requisito en esta demo.
              </p>
            </div>
          </div>

          {/* Advertencia de errores OCR si hay documentos amarillos */}
          {amarillos.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <FileWarning className="h-5 w-5 text-amber-600 shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">⚠️ Posibles errores de OCR/digitalización detectados</p>
                  <p className="text-xs mt-1">
                    La lectura automática (OCR) puede no haber captado todo el contenido del documento 
                    (páginas incompletas, baja resolución o secciones ilegibles). 
                    <strong> Revise manualmente el archivo original antes de marcar estos requisitos como ausentes.</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Leyenda de política "Cuatro Ojos" */}
          <div className="p-2 bg-cream/50 rounded-lg text-xs border border-cream-dark">
            <div className="font-medium mb-1 text-cream-foreground">⚖️ Política de "Cuatro Ojos"</div>
            <p className="text-cream-foreground/80">
              Cada requisito detectado por IA debe ser verificado por el agente. 
              Use los controles para validar o rechazar la detección automática.
            </p>
          </div>

          {/* Advertencia de silencio positivo */}
          {rojos.filter(f => f.validadoPorAgente !== true).length > 0 && (
            <div className="p-3 bg-cream rounded-lg border border-cream-dark">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-cream-foreground flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm text-cream-foreground">
                    ⏰ Control de Silencio Positivo (Decreto 971/2024)
                  </div>
                  <p className="text-xs text-cream-foreground/80 mt-1">
                    Hay {rojos.filter(f => f.validadoPorAgente !== true).length} documento(s) faltante(s). 
                    Debe generarse Providencia de Intimación para evitar la configuración del silencio administrativo positivo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Panel de aprobación ya realizada */}
          {aprobacion?.aprobado && !aprobacion?.revertido && (
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
                      <span><strong>Fecha:</strong> {formatFechaHoraAR(aprobacion.timestamp)}</span>
                    </div>
                    {aprobacion.observaciones && (
                      <div className="mt-2 p-2 bg-background/50 rounded text-xs">
                        <strong>Observaciones:</strong> {aprobacion.observaciones}
                      </div>
                    )}
                  </div>
                  
                  {/* Botón de revertir */}
                  {onRevertirDecision && !mostrarFormReversion && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => setMostrarFormReversion(true)}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Revertir decisión
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Panel de rechazo ya realizado */}
          {aprobacion?.rechazado && !aprobacion?.revertido && (
            <div className="p-4 bg-destructive/10 rounded-lg border-2 border-destructive">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-destructive/20 rounded-full">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-destructive flex items-center gap-2">
                    ❌ Expediente Rechazado
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Agente:</strong> {aprobacion.agenteNombre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Fecha:</strong> {formatFechaHoraAR(aprobacion.timestamp)}</span>
                    </div>
                    {aprobacion.motivoRechazo && (
                      <div className="mt-2 p-2 bg-destructive/5 rounded text-xs border border-destructive/20">
                        <strong>Motivo de rechazo:</strong> {aprobacion.motivoRechazo}
                      </div>
                    )}
                  </div>
                  
                  {/* Botón de revertir */}
                  {onRevertirDecision && !mostrarFormReversion && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => setMostrarFormReversion(true)}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Revertir decisión
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Formulario de reversión */}
          {mostrarFormReversion && onRevertirDecision && (
            <div className="space-y-3 p-4 bg-cream rounded-lg border border-cream-dark">
              <div className="flex items-center gap-2 text-sm font-medium text-cream-foreground">
                <RotateCcw className="h-4 w-4" />
                Revertir Decisión
              </div>
              
              <div className="p-2 bg-cream-dark/30 rounded text-xs text-cream-foreground">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                Esta acción revertirá la decisión de <strong>{aprobacion?.aprobado ? 'aprobación' : 'rechazo'}</strong> y 
                permitirá tomar una nueva decisión sobre el expediente.
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
                  Justificación de la Reversión <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Indique el motivo por el cual revierte la decisión (obligatorio)..."
                  value={justificacionReversion}
                  onChange={(e) => setJustificacionReversion(e.target.value)}
                  className="bg-background resize-none"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMostrarFormReversion(false);
                    setAgenteNombre('');
                    setJustificacionReversion('');
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (agenteNombre.trim() && justificacionReversion.trim()) {
                      onRevertirDecision(agenteNombre.trim(), justificacionReversion.trim());
                      setMostrarFormReversion(false);
                      setAgenteNombre('');
                      setJustificacionReversion('');
                    }
                  }}
                  disabled={!agenteNombre.trim() || !justificacionReversion.trim()}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Confirmar Reversión
                </Button>
              </div>
            </div>
          )}

          {/* Botones y formularios de aprobación/rechazo */}
          {!expedienteResuelto && (onAprobarExpediente || onRechazarExpediente) && (
            <div className="border-t border-border pt-4">
              {!mostrarFormAprobacion && !mostrarFormRechazo ? (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    {onAprobarExpediente && (
                      <Button
                        onClick={() => setMostrarFormAprobacion(true)}
                        disabled={!puedeAprobar}
                        className="flex-1"
                        size="lg"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Aprobar
                      </Button>
                    )}
                    {onRechazarExpediente && (
                      <Button
                        onClick={() => setMostrarFormRechazo(true)}
                        disabled={!puedeAprobar}
                        variant="destructive"
                        className="flex-1"
                        size="lg"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    )}
                  </div>
                  {!puedeAprobar && (
                    <p className="text-xs text-muted-foreground text-center">
                      Debe revisar todos los requisitos antes de resolver el expediente ({totalRevisados}/{requisitos.length})
                    </p>
                  )}
                </div>
              ) : mostrarFormAprobacion ? (
                <div className="space-y-3 p-4 bg-success/5 rounded-lg border border-success/30">
                  <div className="flex items-center gap-2 text-sm font-medium text-success">
                    <UserCheck className="h-4 w-4" />
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
                      onClick={() => {
                        setMostrarFormAprobacion(false);
                        setAgenteNombre('');
                        setObservaciones('');
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => {
                        if (agenteNombre.trim() && onAprobarExpediente) {
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
              ) : (
                <div className="space-y-3 p-4 bg-destructive/5 rounded-lg border border-destructive/30">
                  <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                    <XCircle className="h-4 w-4" />
                    Registro de Rechazo
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
                      Motivo de Rechazo <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      placeholder="Indique el motivo del rechazo (obligatorio)..."
                      value={motivoRechazo}
                      onChange={(e) => setMotivoRechazo(e.target.value)}
                      className="bg-background resize-none border-destructive/30"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMostrarFormRechazo(false);
                        setAgenteNombre('');
                        setMotivoRechazo('');
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (agenteNombre.trim() && motivoRechazo.trim() && onRechazarExpediente) {
                          onRechazarExpediente(agenteNombre.trim(), motivoRechazo.trim());
                          setMostrarFormRechazo(false);
                        }
                      }}
                      disabled={!agenteNombre.trim() || !motivoRechazo.trim()}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Confirmar Rechazo
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
