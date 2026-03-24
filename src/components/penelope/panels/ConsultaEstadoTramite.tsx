import { useState, useMemo } from 'react';
import { formatFechaAR, formatFechaHoraAR } from '@/lib/formatDate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  AlertTriangle,
  Loader2,
  User,
  FileCheck,
  Eye,
  Building2,
  ExternalLink,
  Info
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';

function calcularDiasHabiles(desde: Date, hasta: Date): number {
  let count = 0;
  const current = new Date(desde);
  current.setHours(0, 0, 0, 0);
  const end = new Date(hasta);
  end.setHours(0, 0, 0, 0);
  while (current < end) {
    current.setDate(current.getDate() + 1);
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
  }
  return count;
}

type EstadoTramite = 'verificado' | 'enRevision' | 'enEspera' | 'completado';

type EtapaProcedimiento = 'ingreso' | 'verificacion' | 'analisis' | 'decision' | 'notificacion';

interface TramiteInfo {
  id: string;
  expediente: string;
  estado: EstadoTramite;
  etapa: EtapaProcedimiento;
  fechaIngreso: Date;
  fechaEstimada: Date;
  tipoTramite: string;
  rupecoRef: string | null;
  documentos: string[];
  historial: { fecha: Date; evento: string; actor: string }[];
}

const estadoConfig: Record<EstadoTramite, { color: string; icon: React.ReactNode; bgClass: string }> = {
  verificado: { 
    color: 'text-success', 
    icon: <CheckCircle2 className="h-4 w-4" />,
    bgClass: 'bg-success/10 border-success/30'
  },
  enRevision: { 
    color: 'text-amber-600', 
    icon: <Eye className="h-4 w-4" />,
    bgClass: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800'
  },
  enEspera: { 
    color: 'text-blue-600', 
    icon: <Clock className="h-4 w-4" />,
    bgClass: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800'
  },
  completado: { 
    color: 'text-primary', 
    icon: <FileCheck className="h-4 w-4" />,
    bgClass: 'bg-primary/10 border-primary/30'
  }
};

const etapaLabels: Record<string, Record<EtapaProcedimiento, string>> = {
  es: {
    ingreso: 'Ingreso y caratulación',
    verificacion: 'Verificación documental asistida',
    analisis: 'Análisis sustantivo',
    decision: 'Decisión',
    notificacion: 'Notificación',
  },
  en: {
    ingreso: 'Entry and filing',
    verificacion: 'Assisted document verification',
    analisis: 'Substantive analysis',
    decision: 'Decision',
    notificacion: 'Notification',
  }
};

function generarTramiteSimulado(id: string): TramiteInfo | null {
  if (!id.match(/^(EX-|TRA-|SEG-)/i) && id.length < 8) {
    return null;
  }

  const estados: EstadoTramite[] = ['verificado', 'enRevision', 'enEspera', 'completado'];
  const estado = estados[Math.floor(Math.random() * estados.length)];
  
  const etapas: EtapaProcedimiento[] = ['ingreso', 'verificacion', 'analisis', 'decision', 'notificacion'];
  const etapaIdx = estado === 'completado' ? 4 : estado === 'verificado' ? 2 : Math.floor(Math.random() * 3);
  
  const fechaIngreso = new Date();
  fechaIngreso.setDate(fechaIngreso.getDate() - Math.floor(Math.random() * 30) - 5);
  
  const fechaEstimada = new Date();
  fechaEstimada.setDate(fechaEstimada.getDate() + Math.floor(Math.random() * 20) + 5);

  return {
    id,
    expediente: id.startsWith('EX-') ? id : `EX-2026-${Math.floor(Math.random() * 90000000 + 10000000)}-APN-ENACOM`,
    estado,
    etapa: etapas[etapaIdx],
    fechaIngreso,
    fechaEstimada,
    tipoTramite: 'Licencia TIC - Alta',
    rupecoRef: estado !== 'enEspera' ? `RUPECO-2026-${Math.floor(Math.random() * 9000 + 1000)}` : null,
    documentos: [
      'Formulario de solicitud',
      'Estatuto social',
      'Acta de designación de autoridades',
      'Constancia AFIP'
    ],
    historial: [
      { fecha: fechaIngreso, evento: 'Trámite ingresado por TAD', actor: 'Sistema TAD' },
      { fecha: new Date(fechaIngreso.getTime() + 2 * 60 * 60 * 1000), evento: 'Documentación recibida — 4 archivos', actor: 'Sistema Penélope (preprocesamiento)' },
      { fecha: new Date(fechaIngreso.getTime() + 24 * 60 * 60 * 1000), evento: 'Verificación formal asistida iniciada', actor: 'Sistema Penélope (asistencia)' },
      { fecha: new Date(fechaIngreso.getTime() + 48 * 60 * 60 * 1000), evento: estado === 'verificado' ? 'Verificación completada — derivado a análisis sustantivo' : 'En proceso de verificación formal asistida', actor: estado === 'verificado' ? 'Agente validador' : 'Sistema Penélope (asistencia)' }
    ]
  };
}

export function ConsultaEstadoTramite() {
  const { t, language } = useLanguage();
  const [idBusqueda, setIdBusqueda] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [tramite, setTramite] = useState<TramiteInfo | null>(null);
  const [noEncontrado, setNoEncontrado] = useState(false);

  const handleBuscar = async () => {
    if (!idBusqueda.trim()) {
      toast.error(t('trazabilidad.ciudadana.errorVacio'));
      return;
    }

    setIsSearching(true);
    setNoEncontrado(false);
    setTramite(null);

    await new Promise(resolve => setTimeout(resolve, 1200));

    const resultado = generarTramiteSimulado(idBusqueda.trim());
    
    if (resultado) {
      setTramite(resultado);
    } else {
      setNoEncontrado(true);
    }

    setIsSearching(false);
  };

  const formatFecha = (fecha: Date) => formatFechaHoraAR(fecha);

  const lang = language === 'es' ? 'es' : 'en';

  const FECHA_INGRESO = new Date(2026, 2, 5);
  const FECHA_LIMITE = new Date(2026, 3, 4);
  const PLAZO_TOTAL = 30;

  const diasTranscurridos = useMemo(() => calcularDiasHabiles(FECHA_INGRESO, new Date()), []);
  const porcentajeAvance = Math.min((diasTranscurridos / PLAZO_TOTAL) * 100, 100);
  const progressColor = porcentajeAvance <= 50 ? 'bg-green-500' : porcentajeAvance <= 80 ? 'bg-yellow-500' : 'bg-red-500';
  const borderColor = porcentajeAvance <= 50 ? 'border-l-green-500' : porcentajeAvance <= 80 ? 'border-l-yellow-500' : 'border-l-red-500';

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3 flex items-center gap-2 text-xs text-amber-700 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-300">
        <Info size={14} className="flex-shrink-0" />
        <span>Caso simulado — Los datos corresponden a un escenario demostrativo y no reflejan expedientes reales del ENACOM.</span>
      </div>

      {/* Card de resumen */}
      <Card className={`border-l-4 ${borderColor}`}>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-base">{language === 'es' ? 'Control de plazo del expediente' : 'Case deadline control'}</span>
          </div>

          {/* Contador dinámico */}
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold tabular-nums">{diasTranscurridos}</span>
              <span className="text-muted-foreground text-sm">
                {language === 'es' ? `de ${PLAZO_TOTAL} días hábiles transcurridos` : `of ${PLAZO_TOTAL} business days elapsed`}
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${porcentajeAvance}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">0</span>
              <span className="text-[10px] text-muted-foreground">{PLAZO_TOTAL}</span>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">{language === 'es' ? 'Fecha de ingreso' : 'Filing date'}</p>
                <p className="text-sm font-medium">{formatFechaAR(FECHA_INGRESO)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">{language === 'es' ? 'Fecha límite' : 'Deadline'}</p>
                <p className="text-sm font-medium">{formatFechaAR(FECHA_LIMITE)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 border-green-300 text-[10px] px-1.5 py-0.5 hover:bg-green-100">
                {language === 'es' ? 'En tramitación — Etapa preliminar (Penélope)' : 'In process — Preliminary stage (Penélope)'}
              </Badge>
            </div>
          </div>

          {/* Referencia normativa */}
          <p className="text-[10px] text-muted-foreground italic pt-1">
            {language === 'es' ? 'Plazo Decreto 971/2024 — Silencio positivo' : 'Deadline Decree 971/2024 — Positive silence'}
          </p>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="flex items-center gap-3">
        <User className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">{t('trazabilidad.ciudadana.title')}</h2>
          <p className="text-sm text-muted-foreground">{t('trazabilidad.ciudadana.subtitle')}</p>
        </div>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder={t('trazabilidad.ciudadana.placeholder')}
                value={idBusqueda}
                onChange={(e) => setIdBusqueda(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('trazabilidad.ciudadana.formato')}
              </p>
            </div>
            <Button 
              onClick={handleBuscar} 
              disabled={isSearching}
              className="gap-2"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {t('trazabilidad.ciudadana.buscar')}
            </Button>
          </div>

          {/* IDs de ejemplo */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">{t('trazabilidad.ciudadana.ejemplos')}:</span>
            {['EX-2026-12345678', 'SEG-ABC123', 'TRA-987654'].map(ejemplo => (
              <Button
                key={ejemplo}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setIdBusqueda(ejemplo)}
              >
                {ejemplo}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* No encontrado */}
      {noEncontrado && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-destructive">{t('trazabilidad.ciudadana.noEncontrado')}</p>
                <p className="text-sm text-muted-foreground">{t('trazabilidad.ciudadana.noEncontradoDesc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultado */}
      {tramite && (
        <div className="space-y-4">
          {/* Estado principal */}
          <Card className={`border ${estadoConfig[tramite.estado].bgClass}`}>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${estadoConfig[tramite.estado].bgClass}`}>
                    <span className={estadoConfig[tramite.estado].color}>
                      {estadoConfig[tramite.estado].icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('trazabilidad.ciudadana.estadoActual')}</p>
                    <p className={`text-lg font-semibold ${estadoConfig[tramite.estado].color}`}>
                      {t(`trazabilidad.ciudadana.estado.${tramite.estado}`)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="self-start sm:self-auto">
                  {tramite.expediente}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Info del trámite con RUPECO y etapa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">{t('trazabilidad.ciudadana.tipoTramite')}</span>
                </div>
                <p className="font-medium text-sm">{tramite.tipoTramite}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Building2 className="h-4 w-4" />
                  <span className="text-xs">{t('trazabilidad.ciudadana.rupeco')}</span>
                </div>
                <p className="font-medium text-sm font-mono">
                  {tramite.rupecoRef ?? (
                    <span className="text-muted-foreground italic text-xs">
                      {language === 'es' ? 'Pendiente de asignación' : 'Pending assignment'}
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">{t('trazabilidad.ciudadana.etapaActual')}</span>
                </div>
                <p className="font-medium text-sm">{etapaLabels[lang]?.[tramite.etapa] ?? tramite.etapa}</p>
              </CardContent>
            </Card>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">{t('trazabilidad.ciudadana.fechaIngreso')}</span>
                </div>
                <p className="font-medium text-sm">{formatFechaAR(tramite.fechaIngreso)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">{t('trazabilidad.ciudadana.fechaEstimada')}</span>
                </div>
                <p className="font-medium text-sm">{formatFechaAR(tramite.fechaEstimada)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Documentos */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                {t('trazabilidad.ciudadana.documentos')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tramite.documentos.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-3 w-3 text-success" />
                    {doc}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Historial con actor */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t('trazabilidad.ciudadana.historial')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tramite.historial.map((paso, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${idx === tramite.historial.length - 1 ? 'bg-primary' : 'bg-muted-foreground'}`} />
                      {idx < tramite.historial.length - 1 && (
                        <div className="w-px h-full bg-border flex-1 min-h-[20px]" />
                      )}
                    </div>
                    <div className="flex-1 pb-3">
                      <p className="text-xs text-muted-foreground">{formatFecha(paso.fecha)}</p>
                      <p className="text-sm">{paso.evento}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {language === 'es' ? 'Registrado por' : 'Recorded by'}: {paso.actor}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer institucional */}
          <div className="p-4 bg-secondary/50 rounded-lg border border-border/50 text-xs text-muted-foreground space-y-2">
            <p>{t('trazabilidad.ciudadana.disclaimer')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
