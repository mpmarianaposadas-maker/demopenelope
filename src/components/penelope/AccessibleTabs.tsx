import { useState, useRef, useCallback, useEffect, useMemo, KeyboardEvent, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TabNavigationContext } from '@/contexts/TabNavigationContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  i18nKey: string;
}

interface TabGroup {
  label: string;
  tabIds: string[];
}

interface AccessibleTabsProps {
  tabs: Tab[];
  children: ReactNode[];
  t: (key: string) => string;
  groups?: TabGroup[];
  tooltips?: Record<string, string>;
}

// Tour tracks all tabs in the PoC
const TOUR_TABS = [
  'acerca-de', 'arquitectura', 'brecha-rupeco',
  'demo-interactiva', 'borradores', 'simulador',
  'trazabilidad', 'propuesta-normativa', 'seguridad',
  'metricas', 'metricas-operador', 'trazabilidad-ciudadana',
];

const tabContentVariants: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
};

export function AccessibleTabs({ tabs, children, t, groups, tooltips }: AccessibleTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set());
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeTabId = tabs[activeIndex]?.id;
  const activeGroup = useMemo(() => {
    if (!groups) return null;
    return groups.find(g => g.tabIds.includes(activeTabId)) ?? null;
  }, [groups, activeTabId]);

  const goToTab = useCallback((tabId: string) => {
    const idx = tabs.findIndex(tab => tab.id === tabId);
    if (idx !== -1) {
      setActiveIndex(idx);
      setVisitedTabs(prev => new Set(prev).add(tabId));
    }
  }, [tabs]);

  // Track visited tabs & scroll to top on tab change
  useEffect(() => {
    const currentTabId = tabs[activeIndex]?.id;
    if (currentTabId) {
      setVisitedTabs(prev => {
        if (prev.has(currentTabId)) return prev;
        return new Set(prev).add(currentTabId);
      });
    }
  }, [activeIndex, tabs]);

  // Show completion message
  const tourVisited = TOUR_TABS.filter(id => visitedTabs.has(id)).length;
  useEffect(() => {
    if (tourVisited === TOUR_TABS.length && !showComplete) {
      setShowComplete(true);
      const timer = setTimeout(() => setShowComplete(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [tourVisited, showComplete]);

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

  const renderTabButton = (tab: Tab, index: number) => (
    <div key={tab.id} className="relative flex-shrink-0">
      <motion.button
        ref={(el) => (tabRefs.current[index] = el)}
        id={`tab-${tab.id}`}
        role="tab"
        aria-selected={activeIndex === index}
        aria-controls={`panel-${tab.id}`}
        tabIndex={activeIndex === index ? 0 : -1}
        onClick={() => setActiveIndex(index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        onMouseEnter={() => tooltips?.[tab.id] && setHoveredTab(tab.id)}
        onMouseLeave={() => setHoveredTab(null)}
        data-i18n={tab.i18nKey}
        data-tab-target={`panel-${tab.id}`}
        type="button"
        className={cn(
          'tab-institutional relative',
          activeIndex === index && 'tab-active'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
      >
        {t(tab.i18nKey)}
        {activeIndex === index && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-sm"
            style={{ backgroundColor: 'hsl(var(--badge-demo-bg))' }}
            layoutId="activeTabIndicator"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </motion.button>
      {/* Tooltip */}
      {tooltips?.[tab.id] && hoveredTab === tab.id && (
        <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-50 whitespace-nowrap bg-foreground text-background text-xs rounded px-2.5 py-1.5 shadow-lg animate-in fade-in-0 duration-150 pointer-events-none">
          {tooltips[tab.id]}
        </div>
      )}
    </div>
  );

  const renderTabs = () => {
    if (groups && groups.length > 0) {
      return groups.map((group, gi) => {
        const isActiveGroup = activeGroup?.label === group.label;
        const groupTabs = group.tabIds
          .map(id => ({ tab: tabs.find(t => t.id === id)!, index: tabs.findIndex(t => t.id === id) }))
          .filter(({ tab }) => tab);

        return (
          <div key={group.label} className="flex items-start gap-0.5 flex-wrap">
            {gi > 0 && (
              <div className="hidden md:block w-px self-stretch bg-border mx-1.5 my-1" />
            )}
            <div className="flex flex-col gap-0.5">
              <span className={cn(
                "text-[10px] uppercase tracking-wider px-1 leading-tight inline-flex items-center gap-1 transition-colors duration-200",
                isActiveGroup ? "text-primary font-semibold" : "text-muted-foreground/70"
              )}>
                {isActiveGroup && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                )}
                {group.label}
              </span>
              <div className="flex flex-wrap gap-0.5">
                {groupTabs.map(({ tab, index }) => renderTabButton(tab, index))}
              </div>
            </div>
          </div>
        );
      });
    }

    return tabs.map((tab, index) => renderTabButton(tab, index));
  };

  return (
    <TabNavigationContext.Provider value={{ goToTab, visitedTabs }}>
      <div className="w-full">
        {/* Tab list */}
        <div
          className="flex flex-wrap gap-1 border-b border-border bg-secondary/50 p-1 rounded-t-lg"
          role="tablist"
          aria-label="Secciones de la demo Penélope"
        >
          {renderTabs()}
        </div>

        {/* Breadcrumb */}
        {activeGroup && (
          <div className="flex items-center gap-1.5 px-4 py-2 text-xs text-muted-foreground border-x border-border bg-muted/30">
            <span className="font-medium uppercase tracking-wide text-primary">{activeGroup.label}</span>
            <ChevronRight size={12} className="text-muted-foreground/50" />
            <span className="text-foreground font-medium">{t(tabs[activeIndex]?.i18nKey)}</span>
          </div>
        )}

        {/* Tab panels */}
        <div className="border border-t-0 border-border rounded-b-lg bg-card overflow-hidden">
          {/* Tour progress indicator */}
          {tourVisited >= 0 && tourVisited < TOUR_TABS.length && (
            <div className="flex items-center gap-2 justify-end px-4 pt-3">
              <span className="text-[11px] text-muted-foreground">Sección {Math.min(tourVisited + 1, TOUR_TABS.length)} de {TOUR_TABS.length}</span>
              <Progress value={((tourVisited + 1) / TOUR_TABS.length) * 100} className="h-1.5 w-24" />
            </div>
          )}
          {showComplete && (
            <div className="flex items-center gap-1.5 justify-end px-4 pt-3 animate-in fade-in-0 duration-300">
              <Check size={14} className="text-green-600" />
              <span className="text-[11px] text-green-600 font-medium">Recorrido completo</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.section
              key={tabs[activeIndex]?.id}
              id={`panel-${tabs[activeIndex]?.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tabs[activeIndex]?.id}`}
              className="p-4 md:p-6"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {children[activeIndex]}

              {/* Footer: Next section button */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-end gap-3">
                <span className="text-xs text-muted-foreground">
                  Siguiente: {t(tabs[(activeIndex + 1) % tabs.length]?.i18nKey)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const nextIndex = (activeIndex + 1) % tabs.length;
                    setActiveIndex(nextIndex);
                    setVisitedTabs(prev => new Set(prev).add(tabs[nextIndex].id));
                  }}
                  className="gap-1.5"
                >
                  {activeIndex === tabs.length - 1 ? '→ Volver al inicio' : '→ Siguiente sección'}
                </Button>
              </div>
            </motion.section>
          </AnimatePresence>
        </div>
      </div>
    </TabNavigationContext.Provider>
  );
}
