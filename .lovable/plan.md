

# Ajustes de layout y scroll del Verificador RUPECO

Cambios exclusivamente de CSS/layout, sin tocar logica ni componentes funcionales.

---

## Cambio 1: Altura del contenedor principal

**Archivo:** `src/components/penelope/chat/ChatRupeco.tsx` (linea 91)

Reemplazar `h-[600px] max-h-[70vh]` por clases responsive:
- Desktop: `h-[min(85vh,900px)]`
- Mobile: `h-[85vh]`

Se usa estilo inline con CSS `min()` para desktop y clase condicional para mobile (ya existe `useIsMobile`).

Ademas, se reemplaza el `<ScrollArea>` de Radix por un `div` con `overflow-y: auto` nativo para tener control directo del scrollbar y el fade. El ScrollArea de Radix oculta el scrollbar nativo y lo reemplaza por uno propio dificil de estilizar con alto contraste.

---

## Cambio 2: Progress indicator sticky

**Archivo:** `src/components/penelope/chat/ChatRupeco.tsx` (lineas 128-132)

Mover el bloque del `RupecoProgressIndicator` DENTRO del area scrollable pero como elemento sticky:
- `position: sticky; top: 0; z-index: 20;`
- Fondo solido blanco (`bg-card`) para que tape el contenido al hacer scroll
- Borde inferior suave (`border-b border-border/50`)
- Padding ajustado

---

## Cambio 3: Scrollbar visible con alto contraste

**Archivo:** `src/index.css`

Agregar reglas CSS para el contenedor del verificador usando una clase especifica (`.rupeco-scroll`):

```css
.rupeco-scroll::-webkit-scrollbar {
  width: 10px;
}
.rupeco-scroll::-webkit-scrollbar-track {
  background: hsl(210 15% 94%);
  border-radius: 5px;
}
.rupeco-scroll::-webkit-scrollbar-thumb {
  background: hsl(215 15% 55%);
  border-radius: 5px;
  border: 2px solid hsl(210 15% 94%);
}
.rupeco-scroll::-webkit-scrollbar-thumb:hover {
  background: hsl(215 15% 40%);
}
/* Firefox */
.rupeco-scroll {
  scrollbar-width: thin;
  scrollbar-color: hsl(215 15% 55%) hsl(210 15% 94%);
}
```

---

## Cambio 4: Fade inferior (gradiente indicador de scroll)

**Archivo:** `src/components/penelope/chat/ChatRupeco.tsx`

Agregar un `div` posicionado absolute en la parte inferior del contenedor scrollable con un gradiente de transparente a blanco (`bg-gradient-to-t from-card to-transparent`), con `pointer-events-none` para no interferir con clicks. Se oculta con state cuando el usuario llega al final del scroll.

Se agrega un pequeno hook de scroll listener para detectar si hay contenido oculto abajo y mostrar/ocultar el fade.

---

## Resumen de archivos

| Archivo | Tipo de cambio |
|---|---|
| `src/components/penelope/chat/ChatRupeco.tsx` | Altura, scroll nativo, sticky progress, fade inferior |
| `src/index.css` | Estilos de scrollbar con alto contraste |

No se modifican: logica, textos, componentes funcionales, ni arquitectura.

