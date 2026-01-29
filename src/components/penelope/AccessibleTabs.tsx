import { useState, useRef, useCallback, KeyboardEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  i18nKey: string;
}

interface AccessibleTabsProps {
  tabs: Tab[];
  children: ReactNode[];
  t: (key: string) => string;
}

export function AccessibleTabs({ tabs, children, t }: AccessibleTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      let newIndex = index;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          newIndex = index === 0 ? tabs.length - 1 : index - 1;
          break;
        case 'ArrowRight':
          event.preventDefault();
          newIndex = index === tabs.length - 1 ? 0 : index + 1;
          break;
        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          newIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      setActiveIndex(newIndex);
      tabRefs.current[newIndex]?.focus();
    },
    [tabs.length]
  );

  return (
    <div className="w-full">
      {/* Tab list */}
      <div
        className="flex flex-wrap gap-1 border-b border-border bg-secondary/50 p-1 rounded-t-lg"
        role="tablist"
        aria-label="Secciones de la demo Penélope"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[index] = el)}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            data-i18n={tab.i18nKey}
            data-tab-target={`panel-${tab.id}`}
            type="button"
            className={cn(
              'tab-institutional flex-shrink-0',
              activeIndex === index && 'tab-active'
            )}
          >
            {t(tab.i18nKey)}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="border border-t-0 border-border rounded-b-lg bg-card">
        {children.map((child, index) => (
          <section
            key={tabs[index]?.id || index}
            id={`panel-${tabs[index]?.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tabs[index]?.id}`}
            hidden={activeIndex !== index}
            className={cn(
              'p-4 md:p-6 animate-fade-in',
              activeIndex !== index && 'hidden'
            )}
          >
            {child}
          </section>
        ))}
      </div>
    </div>
  );
}
