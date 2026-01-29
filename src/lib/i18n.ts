// Internationalization support for Penélope Demo
// Default language: Spanish (ES)

export type Language = 'es' | 'en';

export interface Translations {
  [key: string]: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    // Header
    'title.principal': 'Automatización Asistida e IA Responsable para la Prevención del Silencio Positivo',
    'subtitle.organismo': 'ENACOM · Proyecto Penélope',
    'badge.demo': 'DEMO INTERACTIVA',
    
    // Tabs
    'tabs.demoInteractiva': 'Demo Interactiva',
    'tabs.arquitectura': 'Arquitectura',
    'tabs.borradores': 'Borradores Generados',
    'tabs.trazabilidad': 'Trazabilidad',
    'tabs.metricas': 'Métricas',
    
    // Language toggle
    'lang.toggle': 'EN',
    'lang.current': 'ES',
  },
  en: {
    // Header
    'title.principal': 'AI-Assisted Automation for Positive Silence Prevention',
    'subtitle.organismo': 'ENACOM · Penélope Project',
    'badge.demo': 'INTERACTIVE DEMO',
    
    // Tabs
    'tabs.demoInteractiva': 'Interactive Demo',
    'tabs.arquitectura': 'Architecture',
    'tabs.borradores': 'Generated Drafts',
    'tabs.trazabilidad': 'Traceability',
    'tabs.metricas': 'Metrics',
    
    // Language toggle
    'lang.toggle': 'ES',
    'lang.current': 'EN',
  },
};

export const defaultLanguage: Language = 'es';

export function t(key: string, lang: Language = defaultLanguage): string {
  return translations[lang][key] || key;
}
