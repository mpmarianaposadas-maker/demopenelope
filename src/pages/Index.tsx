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
} from '@/components/penelope/panels';
import { PanelSimuladorInterno } from '@/components/penelope/simulador';
import { PanelEstadoExpediente, PanelMetricasPrompts, MobileAsideDrawer } from '@/components/penelope/aside';

const tabs = [
  { id: 'acerca-de', label: 'Acerca de', i18nKey: 'tabs.acercaDe' },
  { id: 'demo-interactiva', label: 'Demo Interactiva', i18nKey: 'tabs.demoInteractiva' },
  { id: 'arquitectura', label: 'Arquitectura', i18nKey: 'tabs.arquitectura' },
  { id: 'brecha-rupeco', label: 'Brecha RUPECO', i18nKey: 'tabs.brechaRupeco' },
  { id: 'borradores', label: 'Borradores Generados', i18nKey: 'tabs.borradores' },
  { id: 'trazabilidad', label: 'Trazabilidad', i18nKey: 'tabs.trazabilidad' },
  { id: 'metricas', label: 'Métricas', i18nKey: 'tabs.metricas' },
  { id: 'propuesta-normativa', label: 'Propuesta Normativa', i18nKey: 'tabs.propuestaNormativa' },
  { id: 'seguridad', label: 'Seguridad', i18nKey: 'tabs.seguridad' },
  { id: 'simulador', label: 'Simulador Interno', i18nKey: 'tabs.simulador' },
  { id: 'metricas-operador', label: 'Métricas Operador', i18nKey: 'tabs.metricasOperador' },
  { id: 'trazabilidad-ciudadana', label: 'Estado de Trámite', i18nKey: 'tabs.trazabilidadCiudadana' },
];

const Index = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} onToggleLanguage={toggleLanguage} t={t} />

      <main className="container mx-auto px-4 py-6 md:py-8" role="main">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main column */}
          <section 
            className="flex-1 min-w-0" 
            aria-label="Secciones principales de la demo"
          >
            <AccessibleTabs tabs={tabs} t={t}>
              <PanelAcercaDe />
              <PanelDemoInteractiva />
              <PanelArquitectura />
              <PanelBrechaRupeco />
              <PanelBorradores />
              <PanelTrazabilidad />
              <PanelMetricas />
              <PanelPropuestaNormativa />
              <SecurityDemoPanel />
              <PanelSimuladorInterno />
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
