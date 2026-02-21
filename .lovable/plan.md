

# Diagnostico: ajustes de la demo respecto del trabajo final

## Estado actual

El titulo y el boton de scroll ya fueron corregidos. A continuacion se detallan los desajustes restantes entre la demo y el trabajo final, organizados por prioridad.

---

## PRIORIDAD ALTA (afectan la coherencia juridica)

### 1. Kill Switch: reactivacion inconsistente

**Trabajo (Anexo III, p.32):** "Reactivacion: Requiere auditoria y firma de dos directores."

**Demo actual:** Se reactiva con un cooldown de 3 segundos y un solo clic de confirmacion.

**Ajuste:** Modificar el flujo de reactivacion para simular la firma de dos directores (formulario con dos campos de nombre/cargo obligatorios). El cooldown puede mantenerse, pero debe exigir la doble firma antes.

**Archivos:** `src/contexts/KillSwitchContext.tsx`, `src/components/penelope/KillSwitchPanel.tsx`

---

### 2. Propuesta Normativa: falta el derecho a trazabilidad

**Trabajo (Cap. VII, p.18):** Enumera tres derechos del administrado:
1. Derecho a la informacion (Art. 4 actual de la demo, OK)
2. Derecho a revision humana (Art. 5 actual de la demo, OK)
3. **Derecho a la trazabilidad** (no esta en la demo)

**Ajuste:** Agregar un Art. 6 al panel de Propuesta Normativa:
- Titulo: "Derecho a la trazabilidad"
- Texto: "El sistema debe permitir al administrado conocer el estado real de su tramite y la secuencia basica de actuaciones relevantes, incluyendo las intervenciones automatizadas convalidadas por agentes humanos."
- Fundamento: Ley 27.275 (Acceso a la Informacion Publica)
- Categoria: Garantias (verde)

**Archivo:** `src/components/penelope/panels/PanelPropuestaNormativa.tsx`

---

### 3. Matriz de Riesgos ausente

**Trabajo (Anexo III, p.33):** Presenta una Matriz de Riesgos con 4 categorias:

| Riesgo | Nivel Inicial | Mitigacion | Residual |
|---|---|---|---|
| Sesgo | ALTO | Dataset curado + Auditorias | BAJO |
| Alucinaciones | MEDIO | Temperatura 0 + Anclaje | BAJO |
| Prompt Injection | ALTO | Sanitizacion + Prompt defensivo | MEDIO |
| Privacidad | MEDIO | Filtros de entrada | BAJO |

**Demo actual:** No tiene esta matriz. El panel de Seguridad tiene validacion en tiempo real y reglas, pero no muestra la matriz de riesgos del trabajo.

**Ajuste:** Agregar una seccion "Matriz de Riesgos" al panel de Seguridad (`SecurityDemoPanel.tsx`) con la tabla de 4 riesgos, niveles con semaforo, mitigaciones y riesgo residual.

**Archivo:** `src/components/penelope/panels/SecurityDemoPanel.tsx`

---

## PRIORIDAD MEDIA (mejoran la fidelidad)

### 4. Experiencias internacionales incompletas

**Trabajo (Cap. III y VII):** Menciona Espana (Ley 40/2015 - actuacion administrativa automatizada) y Francia (Loi 2016-1321 - decisiones algoritmicas) como referentes.

**Demo actual:** Solo muestra Estonia, Dinamarca, UE y Brasil.

**Ajuste:** Agregar Espana y Francia al array `experiencias` en PanelPropuestaNormativa.

**Archivo:** `src/components/penelope/panels/PanelPropuestaNormativa.tsx`

---

### 5. Estrategia de gestion del cambio (ADKAR) ausente

**Trabajo (Anexo IV, p.35-36):** Describe el modelo ADKAR con 4 etapas:
- Awareness: talleres de sensibilizacion
- Desire: certificacion como "Operadores de IA Publica"
- Knowledge y Ability: interpretacion de alertas y simulacros en sandbox

**Demo actual:** No tiene referencia a ADKAR.

**Ajuste:** Agregar una seccion informativa al panel de Metricas o crear una subseccion en "Acerca de" que mencione las fases de implementacion y el modelo ADKAR. Alternativa: agregarlo al final del PanelMetricas como tarjeta informativa.

**Archivo:** `src/components/penelope/panels/PanelMetricas.tsx`

---

### 6. Fases de implementacion ausentes

**Trabajo (Cap. VIII, p.19-21):** Describe 4 fases:
1. Planificacion interdisciplinaria
2. Golden dataset (conjunto de datos curado)
3. Piloto controlado
4. Despliegue gradual y gestion del cambio

**Demo actual:** No menciona las fases de implementacion.

**Ajuste:** Agregar una tarjeta o seccion al panel de Arquitectura o Metricas con las 4 fases como un timeline visual simple.

**Archivo:** `src/components/penelope/panels/PanelArquitectura.tsx` o `PanelMetricas.tsx`

---

## PRIORIDAD BAJA (detalles menores)

### 7. Indicadores de exito (KPIs) del trabajo

**Trabajo (Cap. VIII, p.20):** Lista 5 indicadores cualitativos/cuantitativos:
- Tiempo promedio de admisibilidad formal
- Numero de ciclos de subsanacion por expediente
- Porcentaje de reutilizacion de datos RUPECO
- Percepcion del administrado
- Percepcion de los agentes

**Demo actual:** Tiene KPIs numericos pero no estos indicadores textuales especificos.

**Ajuste menor:** Alinear las etiquetas de KPIs del PanelMetricas con los nombres exactos del trabajo. Cambio cosmético en textos.

---

### 8. Referencia a "golden dataset"

**Trabajo (Cap. VI, p.15 y Cap. VIII):** Menciona la necesidad de un "conjunto de datos curado" para evitar automatizacion acritica de patrones historicos.

**Demo actual:** No hay referencia.

**Ajuste:** Agregar una mencion breve en el panel de Arquitectura o Trazabilidad como nota contextual.

---

## Resumen de impacto

| Cambio | Archivos | Complejidad |
|---|---|---|
| Kill Switch doble firma | 2 archivos | Media |
| Art. 6 Trazabilidad | 1 archivo | Baja |
| Matriz de Riesgos | 1 archivo | Baja |
| Espana y Francia | 1 archivo | Minima |
| ADKAR | 1 archivo | Baja |
| Fases implementacion | 1 archivo | Baja |
| KPIs textuales | 1 archivo (i18n) | Minima |
| Golden dataset | 1 archivo | Minima |

Total estimado: 6-8 archivos con cambios puntuales, sin nuevas dependencias.

