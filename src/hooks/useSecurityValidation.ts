import { useState, useCallback } from 'react';
import { 
  validatePromptInput, 
  detectPromptInjection, 
  logSecurityEvent,
  anonymizeInput 
} from '@/lib/security';
import { useToast } from '@/hooks/use-toast';

interface SecurityValidationResult {
  isValid: boolean;
  sanitizedValue: string;
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  showAlert: boolean;
  isPIIOnly: boolean;
}

export function useSecurityValidation() {
  const { toast } = useToast();
  const [lastResult, setLastResult] = useState<SecurityValidationResult>({
    isValid: true,
    sanitizedValue: '',
    riskLevel: 'none',
    showAlert: false,
    isPIIOnly: false,
  });

  const validateInput = useCallback((input: string): SecurityValidationResult => {
    const detection = detectPromptInjection(input);
    const validation = validatePromptInput(input);
    
    const result: SecurityValidationResult = {
      isValid: validation.isValid,
      sanitizedValue: validation.sanitizedInput || '',
      riskLevel: detection.riskLevel,
      showAlert: detection.riskLevel !== 'none',
      isPIIOnly: detection.isPIIOnly ?? false,
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

      // Determine if it's a PII issue
      const isPII = detection.sensitiveData?.hasSensitiveData;

      // Show toast based on risk level
      if (detection.riskLevel === 'high') {
        toast({
          variant: 'destructive',
          title: isPII ? '🔒 Datos sensibles detectados' : '⚠️ Contenido bloqueado',
          description: isPII 
            ? `Se detectaron datos personales (${detection.sensitiveData?.detectedTypes.join(', ')}). No se permite compartir información sensible (Ley 25.326).`
            : 'Se detectó contenido potencialmente peligroso. La entrada ha sido rechazada.',
        });
      } else if (detection.riskLevel === 'medium') {
        toast({
          variant: 'destructive',
          title: isPII ? '🔒 Posibles datos sensibles' : '⚠️ Contenido sospechoso',
          description: isPII
            ? `Se detectó posible información personal (${detection.sensitiveData?.detectedTypes.join(', ')}). Revise antes de continuar.`
            : 'Se detectaron patrones inusuales. El contenido ha sido sanitizado.',
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

  const anonymize = useCallback((input: string): string => {
    return anonymizeInput(input);
  }, []);

  const clearAlert = useCallback(() => {
    setLastResult(prev => ({ ...prev, showAlert: false }));
  }, []);

  return {
    validateInput,
    lastResult,
    clearAlert,
    anonymize,
  };
}
