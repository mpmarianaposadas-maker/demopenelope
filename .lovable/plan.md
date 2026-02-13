

# Correccion integral del motor de seguridad para evaluacion

## Resumen

El motor de seguridad tiene cinco problemas que deben corregirse antes de la evaluacion:

1. PII con un solo tipo detectado clasifica como riesgo "medium" en lugar de "high" (violacion de Ley 25.326)
2. Una sola inyeccion de prompt clasifica como riesgo "low" (inconsistente con fiabilidad por diseno)
3. Patrones PII incompletos (DNI de 7 digitos, telefonos locales, CBU/CVU no detectados)
4. No existe opcion de anonimizacion cuando se detecta PII
5. Botones de prueba rapida contienen ejemplos explicitos de ataque, contradiciendo el aviso de seguridad responsable

## Cambios por archivo

### 1. `src/lib/security.ts` - Motor de deteccion

**Patrones PII ampliados:**
- DNI: cambiar de `\d{2}` a `\d{1,2}` para soportar 7 digitos (ej: `5.123.456`)
- Telefono: agregar patron local sin prefijo internacional (ej: `1155443322`, `011-4567-8901`)
- Nuevo: CBU/CVU (22 digitos consecutivos)

**Logica de riesgo corregida:**
- Cualquier PII detectado = riesgo "high" (bloqueado), con flag `isPIIOnly` para distinguir de inyeccion
- 1 patron de inyeccion = riesgo "medium" (revision obligatoria, antes era "low")
- 2+ patrones de inyeccion = riesgo "high" (bloqueado)

**Nueva funcion `anonymizeInput()`:**
- DNI: `30.456.789` se convierte en `XX.XXX.789`
- CUIT/CUIL: `20-30456789-5` se convierte en `XX-XXXXXXXX-X`
- Email: `juan@mail.com` se convierte en `j***@m***.com`
- Telefono: se reemplaza por `[tel. protegido]`
- Tarjeta: se conservan ultimos 4 digitos `****-****-****-1234`
- CBU/CVU: `[CBU/CVU protegido]`

### 2. `src/hooks/useSecurityValidation.ts` - Hook de validacion

- Exponer flag `isPIIOnly` en el resultado (true cuando hay PII pero no inyeccion)
- Nueva funcion `anonymize(input)` que llama a `anonymizeInput` y retorna el texto enmascarado

### 3. `src/components/penelope/security/RiskLevelCard.tsx` - Tarjeta de riesgo

- Nuevas props opcionales: `isPIIBlock?: boolean` y `onAnonymize?: () => void`
- Cuando `isPIIBlock` es true, mostrar un boton adicional "Anonimizar datos" (icono EyeOff) junto a Editar y Escalar
- El boton solo aparece cuando el bloqueo es por PII, no por inyeccion de prompt

### 4. `src/components/penelope/security/ValidationPanel.tsx` - Panel principal

- Eliminar los 4 botones de prueba que contienen ejemplos de ataque/PII (lineas 260-291)
- Conservar unicamente el boton de entrada segura ("Licencia TIC - Alta Nueva")
- Reemplazar los botones eliminados con texto informativo: "Escriba cualquier texto en el campo de arriba para probar el motor de deteccion en tiempo real"
- Conectar logica de anonimizacion: pasar `isPIIBlock` y `onAnonymize` al RiskLevelCard
- Al presionar "Anonimizar datos": aplicar `anonymizeInput`, reemplazar texto en el textarea, revalidar automaticamente

## Flujo de anonimizacion

```text
Usuario escribe texto con PII
         |
         v
Motor detecta PII --> riesgo ALTO --> BLOQUEADO
         |
         v
RiskLevelCard muestra:
   - "Datos personales detectados (DNI, email...)"
   - Boton [Anonimizar datos]  (solo si isPIIOnly)
   - Boton [Editar]
   - Boton [Escalar]
         |
         v
Usuario presiona [Anonimizar datos]
         |
         v
anonymizeInput() enmascara los datos
         |
         v
Texto anonimizado reemplaza el input
         |
         v
Se revalida --> si pasa, se permite confirmar
```

## Resumen de impacto

- Toda PII se bloquea siempre (cumplimiento Ley 25.326), con opcion de anonimizar y continuar
- Toda inyeccion se bloquea o requiere revision obligatoria
- Se eliminan ejemplos precargados de ataque (coherencia con aviso de seguridad responsable)
- Se amplian patrones para cubrir mas formatos argentinos (DNI 7 dig, tel local, CBU/CVU)
- No se agregan dependencias nuevas
- Se modifican 4 archivos existentes

