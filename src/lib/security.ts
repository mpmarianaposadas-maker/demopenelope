import { z } from 'zod';

// ============================================
// Prompt Injection Protection Utilities
// ============================================

// Common prompt injection patterns to detect
const INJECTION_PATTERNS = [
  // Direct instruction overrides (EN)
  /ignore\s+(previous|all|above)\s+(instructions?|prompts?)/i,
  /forget\s+(everything|all|your)\s+(instructions?|training)/i,
  /disregard\s+(your|all|previous)\s+(rules?|instructions?)/i,
  
  // Direct instruction overrides (ES)
  /ignor[aáe]\s+(las\s+)?(anteriores|todas|previas)\s+(instrucciones|reglas|directivas)/i,
  /olvid[aáe]\s+(todo|todas?\s+las?\s+)(instrucciones|reglas|restricciones)/i,
  /no\s+(hagas?\s+caso|sigas?|respetes?)\s+(las?\s+)?(reglas?|instrucciones|restricciones|l[ií]mites)/i,
  /salt[aáe]te\s+(las?\s+)?(reglas?|restricciones|instrucciones|l[ií]mites|medidas)/i,
  /desactiv[aáe]\s+(las?\s+)?(reglas?|restricciones|filtros?|medidas|protecciones?|seguridad)/i,
  
  // Role manipulation attempts (EN)
  /you\s+are\s+now\s+(a|an|the)/i,
  /pretend\s+(to\s+be|you\s+are)/i,
  /act\s+as\s+(if|a|an)/i,
  /roleplay\s+as/i,
  
  // Role manipulation attempts (ES)
  /ahora\s+(sos|eres|ser[aá]s)\s+(un|una|el|la)/i,
  /comport[aá]te\s+como/i,
  /hac[eé]\s+de\s+cuenta\s+que/i,
  /fingi?\s+que\s+(sos|eres)/i,
  /actu[aá]\s+como\s+(si|un|una)/i,
  
  // System prompt extraction (EN)
  /what\s+(is|are)\s+your\s+(instructions?|prompts?|rules?)/i,
  /show\s+(me\s+)?your\s+(system\s+)?prompt/i,
  /reveal\s+your\s+(instructions?|programming)/i,
  
  // System prompt extraction (ES)
  /mostr[aáe]me\s+(tu|el)\s+(prompt|sistema|instrucciones)/i,
  /cu[aá]les?\s+(son\s+)?(tus|las)\s+(instrucciones|reglas|directivas)/i,
  /revel[aáe]\s+(tu|tus)\s+(instrucciones|programaci[oó]n|configuraci[oó]n)/i,
  
  // Security bypass attempts (ES)
  /evit[aáe]\s+(las?\s+)?(medidas|controles?|filtros?|validaci[oó]n|seguridad)/i,
  /deshabili(t[aáe]|tar)\s+(la\s+)?(seguridad|protecci[oó]n|validaci[oó]n|filtros?)/i,
  /sin\s+(restricciones?|l[ií]mites?|filtros?|seguridad|reglas)/i,
  /modo\s+(libre|sin\s+restricciones|admin|administrador|debug)/i,
  /bypass\s+(security|seguridad|filters?|filtros?)/i,
  
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

// ============================================
// Sensitive Data (PII) Detection Patterns
// ============================================

const PII_PATTERNS = [
  // Argentine DNI (7-8 digits, with or without dots)
  { pattern: /\b\d{2}\.?\d{3}\.?\d{3}\b/, label: 'DNI' },
  // Argentine CUIT/CUIL (XX-XXXXXXXX-X format)
  { pattern: /\b\d{2}-?\d{7,8}-?\d\b/, label: 'CUIT/CUIL' },
  // Credit card numbers (13-19 digits, with or without spaces/dashes)
  { pattern: /\b(?:\d[ -]*?){13,19}\b/, label: 'tarjeta de crédito' },
  // Email addresses
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, label: 'email' },
  // Phone numbers (Argentine format and international)
  { pattern: /(?:\+?54\s?)?(?:9\s?)?(?:11|[2-9]\d{2,3})\s?\d{4}[\s-]?\d{4}\b/, label: 'teléfono' },
  // Passport numbers
  { pattern: /\b[A-Z]{3}\d{6}\b/, label: 'pasaporte' },
  // Explicit sensitive data keywords
  { pattern: /\b(contrase[nñ]a|password|clave\s+de\s+acceso|pin\s+de\s+seguridad|n[uú]mero\s+de\s+(tarjeta|cuenta|dni|documento))\b/i, label: 'dato sensible' },
];

/**
 * Detects sensitive/personal data (PII) in input
 */
export function detectSensitiveData(input: string): {
  hasSensitiveData: boolean;
  detectedTypes: string[];
} {
  const detectedTypes: string[] = [];
  
  for (const { pattern, label } of PII_PATTERNS) {
    if (pattern.test(input)) {
      if (!detectedTypes.includes(label)) {
        detectedTypes.push(label);
      }
    }
  }
  
  return {
    hasSensitiveData: detectedTypes.length > 0,
    detectedTypes,
  };
}

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
  sensitiveData?: { hasSensitiveData: boolean; detectedTypes: string[] };
} {
  const matchedPatterns: string[] = [];
  
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      matchedPatterns.push(pattern.source);
    }
  }
  
  // Also check for sensitive data
  const sensitiveData = detectSensitiveData(input);
  
  let riskLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
  
  // PII detected → at least medium risk
  if (sensitiveData.hasSensitiveData) {
    riskLevel = sensitiveData.detectedTypes.length >= 2 ? 'high' : 'medium';
  }
  
  // Injection patterns override if higher
  if (matchedPatterns.length >= 4) {
    riskLevel = 'high';
  } else if (matchedPatterns.length >= 2 && riskLevel !== 'high') {
    riskLevel = 'medium';
  } else if (matchedPatterns.length === 1 && riskLevel === 'none') {
    riskLevel = 'low';
  }
  
  return {
    isInjection: matchedPatterns.length > 0 || sensitiveData.hasSensitiveData,
    matchedPatterns: [
      ...matchedPatterns,
      ...sensitiveData.detectedTypes.map(t => `PII:${t}`),
    ],
    riskLevel,
    sensitiveData,
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
  
  // Only log to console in development mode
  // In production, this would send to a secure backend logging service
  if (import.meta.env.DEV) {
    console.info('[Security Event]', { eventType: fullEvent.eventType, riskLevel: fullEvent.riskLevel, timestamp: fullEvent.timestamp });
  }
}

export function getSecurityLog(): readonly SecurityEvent[] {
  return [...securityLog];
}

export function clearSecurityLog(): void {
  securityLog.length = 0;
}
