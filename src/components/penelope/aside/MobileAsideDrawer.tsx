import { useState } from 'react';
import { PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PanelEstadoExpediente } from './PanelEstadoExpediente';
import { PanelMetricasPrompts } from './PanelMetricasPrompts';
import { KillSwitchPanel } from '../KillSwitchPanel';
import { useLanguage } from '@/hooks/useLanguage';

export function MobileAsideDrawer() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 lg:hidden h-12 w-12 rounded-full shadow-lg border-primary/20 bg-background/95 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          aria-label={t('aside.openPanel')}
        >
          <PanelRight className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="font-serif text-lg">
            {t('aside.title')}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-65px)]">
          <div className="p-4 space-y-4">
            <KillSwitchPanel />
            <PanelEstadoExpediente />
            <PanelMetricasPrompts />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
