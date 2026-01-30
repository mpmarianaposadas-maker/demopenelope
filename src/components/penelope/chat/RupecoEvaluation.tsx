import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, FileText, User, Building2, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export interface RupecoEvaluationData {
  tipoTramite: string;
  tipoPersona: 'HUMANA' | 'JURIDICA';
  responsable: {
    nombre: string;
    cuit: string;
    domicilioLegal: string;
    domicilioReal?: string;
    telefono: string;
    email: string;
  };
  representante?: {
    nombre: string;
    dni: string;
    caracter: string;
  };
  datosSocietarios?: {
    tipoSociedad: string;
    fechaConstitucion: string;
    inscripcion: string;
  };
  licenciaVinculada?: string;
  completitud: {
    porcentaje: number;
    camposFaltantes: string[];
  };
  timestamp: string;
}

interface RupecoEvaluationProps {
  data: RupecoEvaluationData;
}

export function RupecoEvaluation({ data }: RupecoEvaluationProps) {
  const { t } = useLanguage();
  const completitudColor = 
    data.completitud.porcentaje >= 90 ? 'text-green-600' :
    data.completitud.porcentaje >= 70 ? 'text-yellow-600' : 'text-red-600';

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {t('chat.evaluation.title')}
          </CardTitle>
          <Badge variant={data.completitud.porcentaje >= 90 ? 'default' : 'secondary'}>
            {data.completitud.porcentaje}% {t('chat.evaluation.complete')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tipo de Trámite */}
        <div className="p-3 bg-background rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">{t('chat.evaluation.tramite')}</div>
          <div className="font-medium">{data.tipoTramite}</div>
        </div>

        {/* Responsable */}
        <div className="p-3 bg-background rounded-lg">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            {data.tipoPersona === 'HUMANA' ? <User className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
            {t('chat.evaluation.responsable')} ({data.tipoPersona === 'HUMANA' ? t('chat.evaluation.personaHumana') : t('chat.evaluation.personaJuridica')})
          </div>
          <div className="space-y-1 text-sm">
            <div><span className="text-muted-foreground">{t('chat.evaluation.nombre')}:</span> {data.responsable.nombre}</div>
            <div><span className="text-muted-foreground">CUIT:</span> {data.responsable.cuit}</div>
            <div className="flex items-start gap-1">
              <MapPin className="h-3 w-3 mt-1 text-muted-foreground flex-shrink-0" />
              <span>{data.responsable.domicilioLegal}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span>{data.responsable.telefono}</span>
            </div>
            <div><span className="text-muted-foreground">Email:</span> {data.responsable.email}</div>
          </div>
        </div>

        {/* Representante (si aplica) */}
        {data.representante && (
          <div className="p-3 bg-background rounded-lg">
            <div className="text-xs text-muted-foreground mb-2">{t('chat.evaluation.representante')}</div>
            <div className="space-y-1 text-sm">
              <div>{data.representante.nombre} (DNI: {data.representante.dni})</div>
              <div className="text-muted-foreground">{data.representante.caracter}</div>
            </div>
          </div>
        )}

        {/* Datos Societarios (si aplica) */}
        {data.datosSocietarios && (
          <div className="p-3 bg-background rounded-lg">
            <div className="text-xs text-muted-foreground mb-2">{t('chat.evaluation.societarios')}</div>
            <div className="space-y-1 text-sm">
              <div>{data.datosSocietarios.tipoSociedad}</div>
              <div className="text-muted-foreground">{t('chat.evaluation.constitucion')}: {data.datosSocietarios.fechaConstitucion}</div>
            </div>
          </div>
        )}

        {/* Licencia Vinculada */}
        {data.licenciaVinculada && (
          <div className="p-3 bg-background rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">{t('chat.evaluation.licencia')}</div>
            <div className="font-medium">{data.licenciaVinculada}</div>
          </div>
        )}

        {/* Completitud */}
        <div className="p-3 bg-background rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{t('chat.evaluation.completitud')}</span>
            <span className={`font-bold ${completitudColor}`}>{data.completitud.porcentaje}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
                data.completitud.porcentaje >= 90 ? 'bg-green-500' :
                data.completitud.porcentaje >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${data.completitud.porcentaje}%` }}
            />
          </div>
          {data.completitud.camposFaltantes.length > 0 && (
            <div className="mt-2 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <AlertCircle className="h-3 w-3" />
                {t('chat.evaluation.faltantes')}:
              </div>
              <ul className="list-disc list-inside text-muted-foreground">
                {data.completitud.camposFaltantes.map((campo, i) => (
                  <li key={i}>{campo}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground text-right">
          {t('chat.evaluation.generado')}: {data.timestamp}
        </div>
      </CardContent>
    </Card>
  );
}
