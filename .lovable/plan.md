

# Aviso de seguridad: por qué no se incluyen ejemplos de ataque

## Contexto

El modulo de Seguridad y Gobernanza (`SecurityDemoPanel.tsx`) muestra las reglas de deteccion y el panel de validacion, pero no incluye ejemplos precargados de prompt injection ni de datos sensibles. Es importante comunicar al usuario **por qué** no se proveen esos ejemplos.

## Cambio propuesto

Agregar un bloque informativo (banner/aviso) dentro del `SecurityDemoPanel`, justo antes del `ValidationPanel`, con un mensaje claro que explique:

- Que por razones de seguridad responsable, no se incluyen ejemplos de ataques ni patrones maliciosos precargados.
- Que mostrar ejemplos de prompt injection podria facilitar su replicacion en otros contextos.
- Que el motor de seguridad esta activo y puede probarse ingresando texto libre en el chat de la Demo Interactiva.

## Diseno visual

Se usara el componente `Alert` existente del proyecto con un icono de `ShieldAlert` y estilo amarillo/ambar (warning), para que sea visible pero no alarmante. Ejemplo del texto:

> **Nota de seguridad responsable**
> Este modulo no incluye ejemplos precargados de inyeccion de prompt ni datos sensibles (PII). Proveer patrones de ataque listos para usar podria facilitar su replicacion maliciosa en otros sistemas. El motor de deteccion esta activo: puede probarse ingresando texto libre en el chat del modulo "Demo Interactiva".

## Detalle tecnico

**Archivo a modificar:** `src/components/penelope/panels/SecurityDemoPanel.tsx`

- Importar `Alert`, `AlertTitle`, `AlertDescription` desde `@/components/ui/alert`
- Importar `ShieldAlert` desde `lucide-react`
- Insertar el bloque `Alert` entre `SecurityRulesPanel` y `ValidationPanel`
- El texto se agrega directamente en el componente (sin necesidad de i18n adicional, dado que todo el proyecto esta en espanol)

No se modifican dependencias, logica ni otros archivos.

