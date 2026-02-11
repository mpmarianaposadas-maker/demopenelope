

# Cambio de color del boton de seleccion de tramite

## Diagnostico

En `ChatRupeco.tsx` (lineas 128-135), los botones de seleccion rapida de tipo de tramite ("Licencia TIC nueva", "Autorizacion Audiovisual", etc.) usan `variant="outline"`, lo que les da un aspecto gris claro con borde. Esto los hace poco visibles como accion principal.

## Cambio propuesto

**Archivo:** `src/components/penelope/chat/ChatRupeco.tsx`

Cambiar los botones de quick actions de `variant="outline"` a `variant="default"` para que usen el color primario (azul oscuro institucional) con texto blanco.

```
Antes:  variant="outline"  (gris claro con borde)
Despues: variant="default"  (azul oscuro con texto blanco)
```

Es un cambio de una sola palabra en la linea 131 del archivo. No se modifican dependencias ni logica.

