import { Header } from '@/components/penelope/Header';
import { AccessibleTabs } from '@/components/penelope/AccessibleTabs';
import { KillSwitchPanel } from '@/components/penelope/KillSwitchPanel';
import { useLanguage } from '@/hooks/useLanguage';
import {
  PanelAcercaDe,
  PanelDemoInteractiva,
  PanelArquitectura,
  PanelBrechaRupeco,
  PanelBorradores,
  PanelTrazabilidad,
  PanelMetricas,
  PanelPropuestaNormativa,
  SecurityDemoPanel,
  PanelMetricasOperador,
  ConsultaEstadoTramite,
  PanelLimitaciones,
} from '@/components/penelope/panels';
import { PanelSimuladorInterno } from '@/components/penelope/simulador';
import { PanelEstadoExpediente, PanelMetricasPrompts, MobileAsideDrawer } from '@/components/penelope/aside';

const tabs = [
  // Conceptual
  { id: 'acerca-de', label: 'Acerca de', i18nKey: 'tabs.acercaDe' },
  { id: 'arquitectura', label: 'Arquitectura', i18nKey: 'tabs.arquitectura' },
  { id: 'brecha-rupeco', label: 'Brecha RUPECO', i18nKey: 'tabs.brechaRupeco' },
  { id: 'limitaciones', label: 'Limitaciones' },
  // Operativo
  { id: 'demo-interactiva', label: 'Demo Interactiva', i18nKey: 'tabs.demoInteractiva' },
  { id: 'borradores', label: 'Borradores Generados', i18nKey: 'tabs.borradores' },
  { id: 'simulador', label: 'Simulador Interno', i18nKey: 'tabs.simulador' },
  // Gobernanza
  { id: 'trazabilidad', label: 'Trazabilidad', i18nKey: 'tabs.trazabilidad' },
  { id: 'propuesta-normativa', label: 'Propuesta Normativa', i18nKey: 'tabs.propuestaNormativa' },
  { id: 'seguridad', label: 'Seguridad', i18nKey: 'tabs.seguridad' },
  // Monitoreo
  { id: 'metricas', label: 'Métricas', i18nKey: 'tabs.metricas' },
  { id: 'metricas-operador', label: 'Métricas Operador', i18nKey: 'tabs.metricasOperador' },
  { id: 'trazabilidad-ciudadana', label: 'Estado de Trámite', i18nKey: 'tabs.trazabilidadCiudadana' },
];

const groups = [
  { label: 'Conceptual', tabIds: ['acerca-de', 'arquitectura', 'brecha-rupeco', 'limitaciones'] },
  { label: 'Operativo', tabIds: ['demo-interactiva', 'borradores', 'simulador'] },
  { label: 'Gobernanza', tabIds: ['trazabilidad', 'propuesta-normativa', 'seguridad'] },
  { label: 'Monitoreo', tabIds: ['metricas', 'metricas-operador', 'trazabilidad-ciudadana'] },
];

const tooltips: Record<string, string> = {
  'acerca-de': 'Marco conceptual, pregunta de investigación y alcance',
  'arquitectura': 'Diagramas de flujo y modelo de fiabilidad por diseño',
  'brecha-rupeco': 'Hallazgo central: cobertura del 57% y principio Once-Only',
  'limitaciones': 'Reconocimiento explícito de limitaciones del sistema (IA responsable)',
  'demo-interactiva': 'Simule un trámite completo con verificación RUPECO',
  'borradores': 'Borradores de providencia de pase y nota de intimación, sin efectos hasta su aprobación humana',
  'simulador': 'Simulación del flujo interno paso a paso',
  'trazabilidad': 'Pilares de compliance y registro de auditoría',
  'propuesta-normativa': 'Articulado propuesto y experiencias comparadas',
  'seguridad': 'Validación contra prompt injection y datos sensibles',
  'metricas': 'Proyecciones de impacto basadas en benchmarking internacional',
  'metricas-operador': 'Dashboard de rendimiento con exportación CSV',
  'trazabilidad-ciudadana': 'Consulta pública del estado de un expediente',
};

const Index = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} onToggleLanguage={toggleLanguage} t={t} />

      <main className="container mx-auto px-4 py-6 md:py-8" role="main">
        {/* Bloque institucional permanente — única mención */}
        <div className="bg-primary/5 border-l-4 border-l-primary border border-primary/20 rounded-r-lg p-5 mb-6 flex items-start gap-4">
          <span className="text-2xl flex-shrink-0 mt-0.5">⚖️</span>
          <div>
            <h2 className="text-base font-semibold text-foreground mb-1 tracking-tight" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Sistema de apoyo no decisorio
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Esta plataforma no emite actos administrativos. Genera preanálisis sujetos a validación humana obligatoria.
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main column */}
          <section 
            className="flex-1 min-w-0" 
            aria-label="Secciones principales de la demo"
          >
            <AccessibleTabs tabs={tabs} t={t} groups={groups} tooltips={tooltips}>
              {/* Conceptual */}
              <PanelAcercaDe />
              <PanelArquitectura />
              <PanelBrechaRupeco />
              <PanelLimitaciones />
              {/* Operativo */}
              <PanelDemoInteractiva />
              <PanelBorradores />
              <PanelSimuladorInterno />
              {/* Gobernanza */}
              <PanelTrazabilidad />
              <PanelPropuestaNormativa />
              <SecurityDemoPanel />
              {/* Monitoreo */}
              <PanelMetricas />
              <PanelMetricasOperador />
              <ConsultaEstadoTramite />
            </AccessibleTabs>
          </section>

          {/* Side column with interactive panels */}
          <aside 
            className="hidden lg:flex lg:flex-col w-72 flex-shrink-0 gap-4"
            aria-label="Información complementaria"
          >
            <KillSwitchPanel />
            <PanelEstadoExpediente />
            <PanelMetricasPrompts />
          </aside>

          {/* Mobile drawer for side panels */}
          <MobileAsideDrawer />
        </div>
      </main>
    </div>
  );
};

export default Index;
