

# Plan: Asistente de IA RUPECO para Demo Interactiva

## Resumen

Integrar un chatbot conversacional alimentado por **Lovable AI** en el panel "Demo Interactiva" que guíe al usuario a través del flujo de recolección de datos RUPECO para trámites TIC, audiovisuales, postales y RUPECO de ENACOM.

---

## Arquitectura de la Solución

```text
+------------------+       +-----------------------+       +---------------------+
|   Frontend       |       |   Edge Function       |       |   Lovable AI        |
|   (React)        | ----> |   /chat-rupeco        | ----> |   Gateway           |
|                  |       |                       |       |   (Gemini 3 Flash)  |
+------------------+       +-----------------------+       +---------------------+
        |                           |
        v                           v
+------------------+       +-----------------------+
|  ChatRupeco      |       |  System Prompt        |
|  Component       |       |  (Instrucciones       |
|                  |       |   RUPECO completas)   |
+------------------+       +-----------------------+
```

---

## Componentes a Crear

### 1. Edge Function: `chat-rupeco`
- Recibe el historial de mensajes del chat
- Inyecta el **system prompt completo** con las instrucciones RUPECO proporcionadas
- Llama al gateway de Lovable AI con streaming habilitado
- Modelo: `google/gemini-3-flash-preview`

### 2. Componentes del Chat
- `ChatRupeco.tsx`: Interfaz principal con streaming de mensajes
- `ChatMessage.tsx`: Renderizado individual con react-markdown
- `ChatInput.tsx`: Campo de entrada con botón de envío
- `RupecoEvaluation.tsx`: Visualización del JSON de evaluación final

### 3. Hook: `useChatRupeco.ts`
- Gestión del estado del chat (mensajes, loading, error)
- Lógica de streaming con parsing SSE
- Integración con TipoTramiteContext

---

## Flujo de Usuario

1. Usuario abre la pestaña "Demo Interactiva"
2. Ve introducción y chat con mensaje de bienvenida del asistente
3. Puede escribir o usar botones rápidos ("Trámite TIC", "Consulta RUPECO", etc.)
4. El asistente guía por bloques:
   - Tipo de trámite
   - Identificación del responsable
   - Domicilios y contacto
   - Representación (si aplica)
   - Datos societarios (solo PJ)
   - Licencia/servicio vinculado
5. Al finalizar ("listo", "evaluar"), devuelve JSON estructurado
6. El JSON se renderiza como tarjeta visual de evaluación

---

## Archivos a Crear/Modificar

| Archivo | Acción |
|---------|--------|
| `supabase/functions/chat-rupeco/index.ts` | Crear |
| `supabase/config.toml` | Crear |
| `src/components/penelope/chat/ChatRupeco.tsx` | Crear |
| `src/components/penelope/chat/ChatMessage.tsx` | Crear |
| `src/components/penelope/chat/ChatInput.tsx` | Crear |
| `src/components/penelope/chat/RupecoEvaluation.tsx` | Crear |
| `src/components/penelope/chat/index.ts` | Crear |
| `src/hooks/useChatRupeco.ts` | Crear |
| `src/components/penelope/panels/PanelDemoInteractiva.tsx` | Modificar |
| `src/lib/i18n.ts` | Modificar (traducciones) |

---

## Detalles Técnicos

### System Prompt
Se usará el prompt RUPECO proporcionado con:
- Identificación de tipo de trámite (TIC, Audiovisual, Postal, RUPECO)
- Núcleo RUPECO a recolectar (5 bloques de información)
- Modo de interacción por bloques
- Estructura JSON de salida para evaluación

### Streaming
- SSE (Server-Sent Events) para respuestas en tiempo real
- Parsing token por token
- Actualización progresiva del mensaje del asistente

### Integración con Contexto
- **TipoTramiteContext**: Actualiza automáticamente cuando el asistente detecta el tipo de trámite
- **KillSwitchContext**: Respeta el estado del kill switch

### Manejo de Errores
- Toast para errores 429 (rate limit)
- Toast para errores 402 (créditos agotados)

---

## Dependencia Adicional

```json
{
  "react-markdown": "^9.0.0"
}
```

---

## Orden de Implementación

1. Habilitar Lovable Cloud (requisito previo)
2. Crear edge function `chat-rupeco`
3. Crear hook `useChatRupeco`
4. Crear componentes del chat
5. Actualizar `PanelDemoInteractiva`
6. Agregar traducciones
7. Probar flujo end-to-end

