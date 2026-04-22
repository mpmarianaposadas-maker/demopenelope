/**
 * Cálculo de días hábiles administrativos en la República Argentina,
 * conforme al art. 1 inc. e) ap. 2 del Reglamento de la LNPA (Decreto 1759/72 t.o. 2017):
 * "Los plazos se cuentan por días hábiles administrativos, salvo disposición legal en contrario
 * o habilitación expresa".
 *
 * Se excluyen:
 *   - Sábados y domingos.
 *   - Feriados nacionales (Ley 27.399 y modificatorias).
 *   - Días no laborables con fines turísticos declarados por el PEN.
 *   - Asuetos administrativos generales para la APN (Decretos del PEN).
 *
 * Fuente del calendario 2026: feriados nacionales y días no laborables publicados por el
 * Ministerio del Interior — argentina.gob.ar/interior/feriados-nacionales-2026.
 */

// Feriados y días inhábiles para la Administración Pública Nacional.
// Formato: 'YYYY-MM-DD' (zona horaria local).
const DIAS_INHABILES_APN: Record<string, string[]> = {
  '2025': [
    '2025-01-01', // Año Nuevo
    '2025-03-03', // Carnaval
    '2025-03-04', // Carnaval
    '2025-03-24', // Día Nacional de la Memoria por la Verdad y la Justicia
    '2025-04-02', // Día del Veterano y de los Caídos en la Guerra de Malvinas
    '2025-04-17', // Jueves Santo (no laborable)
    '2025-04-18', // Viernes Santo
    '2025-05-01', // Día del Trabajador
    '2025-05-02', // Puente turístico
    '2025-05-25', // Día de la Revolución de Mayo
    '2025-06-16', // Paso a la Inmortalidad del Gral. Güemes (trasladado)
    '2025-06-20', // Paso a la Inmortalidad del Gral. Belgrano
    '2025-07-09', // Día de la Independencia
    '2025-08-15', // Puente turístico
    '2025-08-17', // Paso a la Inmortalidad del Gral. San Martín
    '2025-10-12', // Día del Respeto a la Diversidad Cultural
    '2025-11-21', // Puente turístico
    '2025-11-24', // Día de la Soberanía Nacional (trasladado)
    '2025-12-08', // Inmaculada Concepción de María
    '2025-12-25', // Navidad
  ],
  '2026': [
    '2026-01-01', // Año Nuevo
    '2026-02-16', // Carnaval
    '2026-02-17', // Carnaval
    '2026-03-24', // Día Nacional de la Memoria por la Verdad y la Justicia
    '2026-04-02', // Día del Veterano y de los Caídos en la Guerra de Malvinas
    '2026-04-03', // Viernes Santo
    '2026-05-01', // Día del Trabajador
    '2026-05-25', // Día de la Revolución de Mayo
    '2026-06-15', // Paso a la Inmortalidad del Gral. Güemes (trasladado al lunes)
    '2026-06-22', // Paso a la Inmortalidad del Gral. Belgrano (trasladado al lunes)
    '2026-07-09', // Día de la Independencia
    '2026-08-17', // Paso a la Inmortalidad del Gral. San Martín
    '2026-10-12', // Día del Respeto a la Diversidad Cultural
    '2026-11-23', // Día de la Soberanía Nacional (trasladado al lunes)
    '2026-12-08', // Inmaculada Concepción de María
    '2026-12-25', // Navidad
  ],
};

function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function inhabilesSet(year: number): Set<string> {
  return new Set(DIAS_INHABILES_APN[String(year)] ?? []);
}

/**
 * Devuelve true si la fecha indicada es día hábil administrativo en la APN argentina.
 */
export function esDiaHabilAR(date: Date): boolean {
  const dow = date.getDay();
  if (dow === 0 || dow === 6) return false;
  const set = inhabilesSet(date.getFullYear());
  return !set.has(toKey(date));
}

/**
 * Cuenta los días hábiles administrativos entre `desde` (exclusivo) y `hasta` (inclusivo).
 * Si `hasta <= desde` retorna 0.
 */
export function calcularDiasHabilesAR(desde: Date, hasta: Date): number {
  const current = new Date(desde);
  current.setHours(0, 0, 0, 0);
  const end = new Date(hasta);
  end.setHours(0, 0, 0, 0);
  let count = 0;
  while (current < end) {
    current.setDate(current.getDate() + 1);
    if (esDiaHabilAR(current)) count++;
  }
  return count;
}

/**
 * Cuenta los días hábiles administrativos restantes desde hoy hasta la fecha límite (inclusive).
 */
export function diasHabilesRestantesAR(fechaLimite: Date, hoy: Date = new Date()): number {
  return Math.max(0, calcularDiasHabilesAR(hoy, fechaLimite));
}
