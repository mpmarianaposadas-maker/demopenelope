import { Globe } from 'lucide-react';

interface HeaderProps {
  language: 'es' | 'en';
  onToggleLanguage: () => void;
  t: (key: string) => string;
}

export function Header({ language, onToggleLanguage, t }: HeaderProps) {
  return (
    <header className="header-institutional" role="banner">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left side - Logo and text */}
          <div className="flex items-center gap-4">
            <div 
              className="w-20 h-20 rounded-xl overflow-hidden border-2 border-cream/40 flex items-center justify-center" 
              aria-label="Logo ENACOM Sistema Penélope"
            >
              <img 
                src={penelopeImage} 
                alt="Penélope - Sistema de Verificación Documental"
                className="w-full h-full object-cover brightness-0 invert opacity-90"
              />
            </div>
            <div className="flex-1">
              <h1 
                className="text-2xl md:text-3xl font-serif font-bold leading-tight"
                data-i18n="title.principal"
              >
                Sistema Penélope
              </h1>
              <p 
                className="text-sm opacity-80 mt-1"
              >
                ENACOM
              </p>
            </div>
          </div>

          {/* Right side - Badge and language toggle */}
          <div className="flex items-center gap-3">
            <span 
              className="badge-demo"
              aria-label="Demo interactiva en desarrollo"
              data-i18n="badge.demo"
            >
              POC — Prueba de Concepto
            </span>
            
            {/* Language toggle - optional, hidden by default */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
              aria-label={`Cambiar idioma a ${language === 'es' ? 'inglés' : 'español'}`}
            >
              <Globe className="w-4 h-4" />
              <span>{t('lang.current')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
