import { useState, useCallback } from 'react';
import { Card, CardTitle, CardText } from '../Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/hooks/useLanguage';
import { FileText, Clock, User, AlertTriangle, Check, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LedgerEntry {
  id: string;
  caseId: string;
  promptId: string;
  taskType: 'VALIDACION_SEGURIDAD' | 'KILL_SWITCH' | 'ACTUALIZACION_SISTEMA' | 'OVERRIDE_HUMANO';
  riskLevel: 'BAJO' | 'MEDIO' | 'ALTO';
  result: 'Permitido' | 'Permitido con revisión manual' | 'Bloqueado';
  operator: string;
  timestamp: Date;
  details?: string;
  // Human override fields
  humanOverride?: {
    originalValue?: string;
    adjustedValue?: string;
    author: string;
    role?: string;
    justification?: string;
  };
}

interface SecurityLedgerProps {
  entries: LedgerEntry[];
  maxVisible?: number;
}

export function SecurityLedger({ entries, maxVisible = 5 }: SecurityLedgerProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  
  const visibleEntries = expanded ? entries : entries.slice(0, maxVisible);
  
  const getRiskBadge = (level: LedgerEntry['riskLevel']) => {
    switch (level) {
      case 'ALTO':
        return <Badge variant="destructive" className="text-xs">ALTO</Badge>;
      case 'MEDIO':
        return <Badge className="bg-orange-500 text-white text-xs">MEDIO</Badge>;
      case 'BAJO':
        return <Badge className="bg-green-600 text-white text-xs">BAJO</Badge>;
    }
  };
  
  const getResultIcon = (result: LedgerEntry['result']) => {
    switch (result) {
      case 'Permitido':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'Permitido con revisión manual':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'Bloqueado':
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <CardTitle>{t('security.ledger.title')}</CardTitle>
        </div>
        <Badge variant="outline" className="text-xs">
          {entries.length} {t('security.ledger.entries')}
        </Badge>
      </div>
      
      <CardText className="text-xs mb-2">
        {t('security.ledger.description')}
      </CardText>
      <p className="text-xs text-muted-foreground italic mb-4 border-l-2 border-primary/30 pl-2">
        Panel de monitoreo técnico del uso de modelos, conforme lo desarrollado en el trabajo.
      </p>
      
      <ScrollArea className={expanded ? 'max-h-96' : 'max-h-64'}>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {visibleEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-secondary/30 rounded-lg border border-border/50 text-xs space-y-2"
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    {getResultIcon(entry.result)}
                    <span className="font-mono font-medium">{entry.promptId}</span>
                  </div>
                  {getRiskBadge(entry.riskLevel)}
                </div>
                
                {/* Details grid */}
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span className="truncate">{entry.caseId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{entry.operator}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(entry.timestamp)}</span>
                  </div>
                  <div className="text-xs">
                    {formatDate(entry.timestamp)}
                  </div>
                </div>
                
                {/* Task type and result */}
                <div className="flex items-center justify-between pt-1 border-t border-border/30">
                  <span className="text-muted-foreground">{entry.taskType}</span>
                  <span className={`font-medium ${
                    entry.result === 'Permitido' ? 'text-green-600' :
                    entry.result === 'Bloqueado' ? 'text-destructive' : 'text-orange-500'
                  }`}>
                    {entry.result}
                  </span>
                </div>
                
                {entry.details && (
                  <div className="text-muted-foreground italic pt-1">
                    {entry.details}
                  </div>
                )}
                
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
      
      {entries.length > maxVisible && (
        <div className="mt-3 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="w-full gap-2 text-xs"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                {t('security.ledger.collapse')}
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                {t('security.ledger.showAll')} ({entries.length - maxVisible} {t('security.ledger.more')})
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}
