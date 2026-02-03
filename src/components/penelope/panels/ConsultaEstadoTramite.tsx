import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowRight,
  User,
  FileCheck,
  Eye
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';

type EstadoTramite = 'verificado' | 'enRevision' | 'enEspera' | 'completado';

interface TramiteInfo {
  id: string;
  expediente: string;
  estado: EstadoTramite;
  fechaIngreso: Date;
  fechaEstimada: Date;
  tipoTramite: string;
  documentos: string[];
  historial: { fecha: Date; evento: string }[];
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

// Simulated data generator
function generarTramiteSimulado(id: string): TramiteInfo | null {
  // Only return data for valid-looking IDs
  if (!id.match(/^(EX-|TRA-|SEG-)/i) && id.length < 8) {
    return null;
  }

  const estados: EstadoTramite[] = ['verificado', 'enRevision', 'enEspera', 'completado'];
  const estado = estados[Math.floor(Math.random() * estados.length)];
  
  const fechaIngreso = new Date();
  fechaIngreso.setDate(fechaIngreso.getDate() - Math.floor(Math.random() * 30) - 5);
  
  const fechaEstimada = new Date();
  fechaEstimada.setDate(fechaEstimada.getDate() + Math.floor(Math.random() * 20) + 5);

  return {
    id,
    expediente: id.startsWith('EX-') ? id : `EX-2026-${Math.floor(Math.random() * 90000000 + 10000000)}-APN-ENACOM`,
    estado,
    fechaIngreso,
    fechaEstimada,
    tipoTramite: 'Licencia TIC - Alta',
    documentos: [
      'Formulario de solicitud',
      'Estatuto social',
      'Acta de designación de autoridades',
      'Constancia AFIP'
    ],
    historial: [
      { fecha: fechaIngreso, evento: 'Trámite ingresado por TAD' },
      { fecha: new Date(fechaIngreso.getTime() + 2 * 60 * 60 * 1000), evento: 'Documentación recibida - 4 archivos' },
      { fecha: new Date(fechaIngreso.getTime() + 24 * 60 * 60 * 1000), evento: 'Verificación formal iniciada' },
      { fecha: new Date(fechaIngreso.getTime() + 48 * 60 * 60 * 1000), evento: estado === 'verificado' ? 'Documentación verificada - sin observaciones' : 'En proceso de revisión' }
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));

    const resultado = generarTramiteSimulado(idBusqueda.trim());
    
    if (resultado) {
      setTramite(resultado);
    } else {
      setNoEncontrado(true);
    }

    setIsSearching(false);
  };

  const formatFecha = (fecha: Date) => {
    return fecha.toLocaleDateString(language === 'es' ? 'es-AR' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
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

          {/* IDs de ejemplo para demo */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">{t('trazabilidad.ciudadana.ejemplos')}:</span>
            {['EX-2026-12345678', 'SEG-ABC123', 'TRA-987654'].map(ejemplo => (
              <Button
                key={ejemplo}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => {
                  setIdBusqueda(ejemplo);
                }}
              >
                {ejemplo}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estado de no encontrado */}
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

      {/* Resultado de la búsqueda */}
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

          {/* Información del trámite */}
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
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">{t('trazabilidad.ciudadana.fechaIngreso')}</span>
                </div>
                <p className="font-medium text-sm">{tramite.fechaIngreso.toLocaleDateString(language === 'es' ? 'es-AR' : 'en-US')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">{t('trazabilidad.ciudadana.fechaEstimada')}</span>
                </div>
                <p className="font-medium text-sm">{tramite.fechaEstimada.toLocaleDateString(language === 'es' ? 'es-AR' : 'en-US')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Documentos adjuntos */}
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

          {/* Historial de pasos */}
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
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground text-center">
            {t('trazabilidad.ciudadana.disclaimer')}
          </div>
        </div>
      )}
    </div>
  );
}
