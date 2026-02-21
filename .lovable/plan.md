

# Ajustes de nombre y boton de scroll

## Cambio 1: Titulo del header

Reemplazar el titulo actual del header por el titulo completo del trabajo final.

**Actual:** "Automatizacion Asistida e IA Responsable para la Prevencion del Silencio Positivo"

**Nuevo:** "El viaje de Penelope: automatizacion asistida e inteligencia artificial responsable en etapas preliminares del procedimiento administrativo"

Esto requiere cambiar la clave `title.principal` en el archivo de traducciones (`src/lib/i18n.ts`) tanto en espanol como en ingles. Tambien se actualizara el titulo en `index.html` (pestana del navegador) y las meta tags OG/Twitter para mantener coherencia.

## Cambio 2: Boton de scroll oscuro

El boton de scroll (flecha hacia abajo con animacion de rebote) en la Demo Interactiva ya usa `bg-primary` (azul institucional). Se cambiara a un tono mas oscuro usando clases como `bg-gray-900` o `bg-slate-800` para que sea visualmente mas oscuro y destacado.

### Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/lib/i18n.ts` | Actualizar `title.principal` (ES y EN) |
| `index.html` | Actualizar `<title>` y meta tags OG/Twitter con el titulo completo |
| `src/components/penelope/chat/ChatRupeco.tsx` | Cambiar el fondo del boton de scroll de `bg-primary` a `bg-gray-900` (oscuro) |

Son 3 archivos con cambios minimos y puntuales.

