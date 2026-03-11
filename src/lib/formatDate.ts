/**
 * Funciones de formato de fecha estandarizadas para el Sistema Penélope.
 * Estándar argentino: DD/MM/YYYY, formato horario 24hs (HH:MM o HH:MM:SS).
 */

/** DD/MM/YYYY */
export function formatFechaAR(fecha: Date): string {
  const d = String(fecha.getDate()).padStart(2, '0');
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const y = fecha.getFullYear();
  return `${d}/${m}/${y}`;
}

/** HH:MM (24hs) */
export function formatHoraAR(fecha: Date): string {
  const h = String(fecha.getHours()).padStart(2, '0');
  const min = String(fecha.getMinutes()).padStart(2, '0');
  return `${h}:${min}`;
}

/** HH:MM:SS (24hs) */
export function formatHoraSegAR(fecha: Date): string {
  const h = String(fecha.getHours()).padStart(2, '0');
  const min = String(fecha.getMinutes()).padStart(2, '0');
  const s = String(fecha.getSeconds()).padStart(2, '0');
  return `${h}:${min}:${s}`;
}

/** DD/MM/YYYY, HH:MM */
export function formatFechaHoraAR(fecha: Date): string {
  return `${formatFechaAR(fecha)}, ${formatHoraAR(fecha)}`;
}

/** DD/MM/YYYY, HH:MM:SS */
export function formatFechaHoraSegAR(fecha: Date): string {
  return `${formatFechaAR(fecha)}, ${formatHoraSegAR(fecha)}`;
}
