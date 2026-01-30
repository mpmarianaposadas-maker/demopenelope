import { z } from 'zod';

// ============================================
// Prompt Injection Protection Utilities
// ============================================

// Common prompt injection patterns to detect
const INJECTION_PATTERNS = [
  // Direct instruction overrides
  /ignore\s+(previous|all|above)\s+(instructions?|prompts?)/i,
  /forget\s+(everything|all|your)\s+(instructions?|training)/i,
  /disregard\s+(your|all|previous)\s+(rules?|instructions?)/i,
  
  // Role manipulation attempts
  /you\s+are\s+now\s+(a|an|the)/i,
  /pretend\s+(to\s+be|you\s+are)/i,
  /act\s+as\s+(if|a|an)/i,
  /roleplay\s+as/i,
  
  // System prompt extraction
  /what\s+(is|are)\s+your\s+(instructions?|prompts?|rules?)/i,
  /show\s+(me\s+)?your\s+(system\s+)?prompt/i,
  /reveal\s+your\s+(instructions?|programming)/i,
  
  // Delimiter injection
  /\[\[.*\]\]/,
  /<<<.*>>>/,
  /\{\{.*\}\}/,
  
  // Code execution attempts
  /<script[\s>]/i,
  /javascript:/i,
  /on\w+\s*=/i,
  
  // SQL injection patterns (for defense in depth)
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b.*\b(FROM|INTO|TABLE|SET)\b)/i,
  /--\s*$/,
  /;\s*(SELECT|INSERT|UPDATE|DELETE|DROP)/i,
];

// Characters that could be used for injection
const DANGEROUS_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

/**
 * Detects potential prompt injection attempts
 * @param input - The user input to analyze
 * @returns Object with detection result and matched patterns
 */
export function detectPromptInjection(input: string): {
  isInjection: boolean;
  matchedPatterns: string[];
  riskLevel: 'none' | 'low' | 'medium' | 'high';
} {
  const matchedPatterns: string[] = [];
  
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      matchedPatterns.push(pattern.source);
    }
  }
  
  let riskLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
  
  if (matchedPatterns.length === 0) {
    riskLevel = 'none';
  } else if (matchedPatterns.length === 1) {
    riskLevel = 'low';
  } else if (matchedPatterns.length <= 3) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }
  
  return {
    isInjection: matchedPatterns.length > 0,
    matchedPatterns,
    riskLevel,
  };
}

/**
 * Sanitizes user input by removing dangerous characters and patterns
 * @param input - The raw user input
 * @param options - Sanitization options
 * @returns Sanitized string
 */
export function sanitizeInput(
  input: string,
  options: {
    maxLength?: number;
    allowHtml?: boolean;
    stripNewlines?: boolean;
  } = {}
): string {
  const { maxLength = 1000, allowHtml = false, stripNewlines = false } = options;
  
  let sanitized = input;
  
  // Remove control characters
  sanitized = sanitized.replace(DANGEROUS_CHARS, '');
  
  // Remove HTML if not allowed
  if (!allowHtml) {
    sanitized = sanitized
      .replace(/<[^>]*>/g, '')
      .replace(/&lt;/g, '')
      .replace(/&gt;/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'");
  }
  
  // Strip newlines if requested
  if (stripNewlines) {
    sanitized = sanitized.replace(/[\r\n]+/g, ' ');
  }
  
  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Validates and sanitizes input for use in AI prompts
 * Returns null if input is rejected due to injection attempt
 */
export function validatePromptInput(input: string): {
  isValid: boolean;
  sanitizedInput: string | null;
  error?: string;
  riskLevel: 'none' | 'low' | 'medium' | 'high';
} {
  const detection = detectPromptInjection(input);
  
  if (detection.riskLevel === 'high') {
    return {
      isValid: false,
      sanitizedInput: null,
      error: 'Input rejected: potential security risk detected',
      riskLevel: detection.riskLevel,
    };
  }
  
  const sanitized = sanitizeInput(input);
  
  return {
    isValid: true,
    sanitizedInput: sanitized,
    riskLevel: detection.riskLevel,
  };
}

// ============================================
// Zod Schemas for Input Validation
// ============================================

export const tipoTramiteSchema = z
  .string()
  .trim()
  .min(1, 'El tipo de trámite no puede estar vacío')
  .max(200, 'El tipo de trámite no puede exceder 200 caracteres')
  .refine(
    (val) => !detectPromptInjection(val).isInjection,
    'Contenido no permitido detectado'
  );

export const expedienteSchema = z
  .string()
  .trim()
  .regex(
    /^EX-\d{4}-\d{8}-APN-[A-Z]{2,6}$/,
    'Formato de expediente inválido. Ejemplo: EX-2026-01234567-APN-DNLTC'
  );

export const userInputSchema = z.object({
  tipoTramite: tipoTramiteSchema.optional(),
  expediente: expedienteSchema.optional(),
  comentario: z
    .string()
    .trim()
    .max(2000, 'El comentario no puede exceder 2000 caracteres')
    .optional(),
});

// ============================================
// Security Event Logging (for audit trail)
// ============================================

interface SecurityEvent {
  timestamp: Date;
  eventType: 'injection_attempt' | 'validation_failure' | 'sanitization' | 'kill_switch';
  details: Record<string, unknown>;
  riskLevel?: 'low' | 'medium' | 'high';
}

const securityLog: SecurityEvent[] = [];
const MAX_LOG_SIZE = 100;

export function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
  const fullEvent: SecurityEvent = {
    ...event,
    timestamp: new Date(),
  };
  
  securityLog.push(fullEvent);
  
  // Keep log size manageable
  if (securityLog.length > MAX_LOG_SIZE) {
    securityLog.shift();
  }
  
  // In production, this would send to a secure logging service
  console.info('[Security Event]', fullEvent);
}

export function getSecurityLog(): readonly SecurityEvent[] {
  return [...securityLog];
}

export function clearSecurityLog(): void {
  securityLog.length = 0;
}
