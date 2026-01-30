import { useState, useCallback } from 'react';
import { 
  validatePromptInput, 
  detectPromptInjection, 
  logSecurityEvent 
} from '@/lib/security';
import { useToast } from '@/hooks/use-toast';

interface SecurityValidationResult {
  isValid: boolean;
  sanitizedValue: string;
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  showAlert: boolean;
}

export function useSecurityValidation() {
  const { toast } = useToast();
  const [lastResult, setLastResult] = useState<SecurityValidationResult>({
    isValid: true,
    sanitizedValue: '',
    riskLevel: 'none',
    showAlert: false,
  });

  const validateInput = useCallback((input: string): SecurityValidationResult => {
    const detection = detectPromptInjection(input);
    const validation = validatePromptInput(input);
    
    const result: SecurityValidationResult = {
      isValid: validation.isValid,
      sanitizedValue: validation.sanitizedInput || '',
      riskLevel: detection.riskLevel,
      showAlert: detection.riskLevel !== 'none',
    };

    setLastResult(result);

    // Log security event if injection detected
    if (detection.isInjection) {
      logSecurityEvent({
        eventType: 'injection_attempt',
        details: {
          matchedPatterns: detection.matchedPatterns,
          inputLength: input.length,
        },
        riskLevel: detection.riskLevel as 'low' | 'medium' | 'high',
      });

      // Show toast based on risk level
      if (detection.riskLevel === 'high') {
        toast({
          variant: 'destructive',
          title: '⚠️ Contenido bloqueado',
          description: 'Se detectó contenido potencialmente peligroso. La entrada ha sido rechazada.',
        });
      } else if (detection.riskLevel === 'medium') {
        toast({
          variant: 'destructive',
          title: '⚠️ Contenido sospechoso',
          description: 'Se detectaron patrones inusuales. El contenido ha sido sanitizado.',
        });
      } else if (detection.riskLevel === 'low') {
        toast({
          title: '🔍 Verificación de seguridad',
          description: 'Se detectó contenido inusual. Revisando...',
        });
      }
    }

    return result;
  }, [toast]);

  const clearAlert = useCallback(() => {
    setLastResult(prev => ({ ...prev, showAlert: false }));
  }, []);

  return {
    validateInput,
    lastResult,
    clearAlert,
  };
}
