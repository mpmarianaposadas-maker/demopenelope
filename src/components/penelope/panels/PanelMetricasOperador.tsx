import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  FileSpreadsheet, 
  TrendingUp, 
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Shield
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { exportToCSV, generateDemoData, type MetricaRow } from '@/lib/exportCSV';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

type Periodo = 'semana' | 'mes' | 'anio';

interface MetricaCard {
  titulo: string;
  valor: string | number;
  descripcion: string;
  icono: React.ReactNode;
  tendencia?: 'up' | 'down' | 'neutral';
  porcentaje?: string;
}

export function PanelMetricasOperador() {
  const { t } = useLanguage();
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const [isExporting, setIsExporting] = useState(false);

  // Generate demo data based on period
  const demoData = useMemo(() => {
    const countByPeriod = { semana: 15, mes: 50, anio: 200 };
    return generateDemoData(countByPeriod[periodo]);
  }, [periodo]);

  // Calculate metrics from demo data
  const metricas = useMemo(() => {
    const total = demoData.length;
    const silencioEvitado = demoData.filter(d => d.silencioEvitado).length;
    const totalAlertas = demoData.reduce((acc, d) => acc + d.alertas, 0);
    const clasificacionCorrecta = demoData.filter(d => d.clasificacionCorrecta).length;
    const tiempoPromedio = demoData.reduce((acc, d) => acc + d.diasGestion, 0) / total;

    return {
      totalProcesados: total,
      silencioEvitado,
      silencioEvitadoPct: ((silencioEvitado / total) * 100).toFixed(1),
      alertasGeneradas: totalAlertas,
      tiempoPromedioAntes: 28,
      tiempoPromedioDespues: tiempoPromedio.toFixed(1),
      clasificacionCorrecta: ((clasificacionCorrecta / total) * 100).toFixed(1)
    };
  }, [demoData]);

  // Data for bar chart
  const chartData = useMemo(() => {
    const byTipo: Record<string, number> = {};
    demoData.forEach(d => {
      const tipo = d.tipoTramite.split(' - ')[0];
      byTipo[tipo] = (byTipo[tipo] || 0) + 1;
    });
    return Object.entries(byTipo).map(([name, value]) => ({ name: name.substring(0, 15), value }));
  }, [demoData]);

  // Data for pie chart
  const pieData = useMemo(() => [
    { name: t('metricas.operador.silencioEvitado'), value: parseInt(metricas.silencioEvitadoPct) },
    { name: t('metricas.operador.noEvitado'), value: 100 - parseInt(metricas.silencioEvitadoPct) }
  ], [metricas, t]);

  const COLORS = ['hsl(var(--success))', 'hsl(var(--muted))'];

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      exportToCSV(demoData, 'metricas_penelope');
      toast.success(t('metricas.operador.exportExito'));
    } catch (error) {
      toast.error(t('metricas.operador.exportError'));
    } finally {
      setIsExporting(false);
    }
  };

  const metricasCards: MetricaCard[] = [
    {
      titulo: t('metricas.operador.totalProcesados'),
      valor: metricas.totalProcesados.toLocaleString(),
      descripcion: t('metricas.operador.totalProcesadosDesc'),
      icono: <FileSpreadsheet className="h-5 w-5 text-primary" />,
      tendencia: 'up',
      porcentaje: '+12%'
    },
    {
      titulo: t('metricas.operador.silencioEvitado'),
      valor: `${metricas.silencioEvitadoPct}%`,
      descripcion: t('metricas.operador.silencioEvitadoDesc'),
      icono: <Clock className="h-5 w-5 text-success" />,
      tendencia: 'up',
      porcentaje: '+5.2%'
    },
    {
      titulo: t('metricas.operador.alertasGeneradas'),
      valor: metricas.alertasGeneradas,
      descripcion: t('metricas.operador.alertasGeneradasDesc'),
      icono: <AlertTriangle className="h-5 w-5 text-amber-500" />
    },
    {
      titulo: t('metricas.operador.tiempoPromedio'),
      valor: `${metricas.tiempoPromedioAntes} → ${metricas.tiempoPromedioDespues}`,
      descripcion: t('metricas.operador.tiempoPromedioDesc'),
      icono: <TrendingDown className="h-5 w-5 text-success" />,
      tendencia: 'down',
      porcentaje: '-85%'
    },
    {
      titulo: t('metricas.operador.clasificacionCorrecta'),
      valor: `${metricas.clasificacionCorrecta}%`,
      descripcion: t('metricas.operador.clasificacionCorrectaDesc'),
      icono: <CheckCircle2 className="h-5 w-5 text-success" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header con badge de acceso restringido */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">{t('metricas.operador.title')}</h2>
            <p className="text-sm text-muted-foreground">{t('metricas.operador.subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700">
            <Shield className="h-3 w-3 mr-1" />
            {t('metricas.operador.badge')}
          </Badge>
        </div>
      </div>

      {/* Filtros de periodo y botón de exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs value={periodo} onValueChange={(v) => setPeriodo(v as Periodo)}>
          <TabsList>
            <TabsTrigger value="semana">{t('metricas.operador.periodo.semana')}</TabsTrigger>
            <TabsTrigger value="mes">{t('metricas.operador.periodo.mes')}</TabsTrigger>
            <TabsTrigger value="anio">{t('metricas.operador.periodo.anio')}</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button
          variant="outline"
          onClick={handleExportCSV}
          disabled={isExporting}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {t('metricas.operador.descargarCSV')}
        </Button>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricasCards.map((metrica, idx) => (
          <Card key={idx} className="relative overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{metrica.titulo}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{metrica.valor}</span>
                    {metrica.tendencia && metrica.porcentaje && (
                      <span className={`text-xs font-medium ${
                        metrica.tendencia === 'up' ? 'text-success' : 
                        metrica.tendencia === 'down' ? 'text-success' : 'text-muted-foreground'
                      }`}>
                        {metrica.tendencia === 'up' ? <TrendingUp className="h-3 w-3 inline" /> : 
                         metrica.tendencia === 'down' ? <TrendingDown className="h-3 w-3 inline" /> : null}
                        {' '}{metrica.porcentaje}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{metrica.descripcion}</p>
                </div>
                <div className="p-2 bg-muted/50 rounded-lg">
                  {metrica.icono}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Expedientes por tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('metricas.operador.chartTipos')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico circular - Silencio positivo evitado */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('metricas.operador.chartSilencio')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${value}%`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[idx] }}
                  />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground text-center">
        {t('metricas.operador.disclaimer')}
      </div>
    </div>
  );
}
