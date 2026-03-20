# Sistema Penélope  
### Automatización asistida e inteligencia artificial responsable en etapas preliminares del procedimiento administrativo

---

## 📌 Descripción

**Penélope** es un modelo de infraestructura procedimental que introduce automatización asistida e inteligencia artificial generativa en etapas preliminares del procedimiento administrativo, sin delegación de la función decisoria.

El sistema se orienta a intervenir sobre tareas técnicas, repetitivas y no discrecionales —verificación formal, clasificación documental y control de plazos— con el objetivo de reducir la inercia organizativa que afecta el cumplimiento de los plazos administrativos.

Su diseño responde a una premisa central:

> El problema no es la norma. Es la organización previa a la decisión.

---

## 🎯 Objetivo

Mejorar la capacidad de respuesta de la Administración Pública mediante:

- Reducción de cargas documentales redundantes  
- Disminución de tiempos de admisibilidad  
- Monitoreo activo de plazos procedimentales  
- Mejora en la trazabilidad del trámite  

Todo ello **sin modificar el régimen jurídico vigente** ni sustituir la decisión administrativa.

---

## ⚙️ Alcance del sistema

Penélope interviene exclusivamente en **etapas preliminares del procedimiento**, sin producir efectos jurídicos directos.

### ✔️ Funciones del sistema

- Verificación formal de requisitos documentales  
- Clasificación preliminar de expedientes  
- Extracción de datos desde documentos no estructurados (PDFs)  
- Generación asistida de borradores (providencias / intimaciones)  
- Control y alerta de plazos administrativos  

### ❌ Límites explícitos

- No interpreta normas  
- No evalúa mérito ni oportunidad  
- No emite actos administrativos  
- No sustituye la decisión del funcionario competente  

---

## 🔄 Pipeline operativo

El sistema se estructura en un flujo secuencial de cinco etapas:

1. **Ingreso de expediente**  
   Vinculación automática con registros existentes (ej. RUPECO)

2. **Verificación documental**  
   Aplicación de reglas determinísticas para control de integridad formal

3. **Clasificación preliminar**  
   Ordenamiento del expediente con validación humana obligatoria

4. **Control de plazos**  
   Generación de alertas tempranas sobre vencimientos

5. **Convalidación humana**  
   Revisión y aprobación antes de cualquier actuación en GDE

📌 La intervención del sistema finaliza antes del análisis sustantivo.

---

## 🧠 Arquitectura técnica

Penélope adopta una **arquitectura híbrida**:

### 🔹 Automatización determinística
- Checklists normativos
- Validaciones formales
- Reglas auditables y reproducibles

### 🔹 IA generativa (uso restringido)
- Extracción de información en documentos no estructurados
- Configuración conservadora:
  - Temperatura = 0  
  - Top-p bajo  
  - Anclaje obligatorio al texto fuente  

### 🔐 Restricciones operativas
- Prohibición de inferencia  
- Prohibición de completar información no presente  
- Output no vinculante  
- Validación humana obligatoria  

---

## 👤 Control humano (Human-in-the-loop)

El sistema opera bajo supervisión humana efectiva:

- Toda salida requiere validación del agente  
- La activación de generación es manual (no automática)  
- Posibilidad de corrección, rechazo o modificación  

---

## 🧾 Trazabilidad y auditoría

Cada interacción queda registrada en un sistema de trazabilidad (**Prompt Net Ledger**), que permite:

- Auditoría completa del proceso  
- Identificación de intervenciones humanas  
- Reconstrucción del flujo en caso de revisión o litigio  

---

## 🛑 Mecanismo de seguridad (Kill Switch)

El sistema incorpora un mecanismo de suspensión inmediata:

- Activación por funcionarios habilitados  
- Detención del procesamiento automatizado  
- Derivación a gestión manual  
- Reactivación bajo control jerárquico  

---

## ⚖️ Marco jurídico

El diseño del sistema se ajusta a los principios del Derecho Administrativo argentino:

- Principio de legalidad  
- Debido proceso (art. 18 CN)  
- Art. 7 LNPA (elementos del acto administrativo)  
- Responsabilidad estatal (Ley 26.944)  
- Protección de datos personales (Ley 25.326)  

Penélope **no integra el acto administrativo** ni afecta sus elementos esenciales.

---

## 🏛️ Caso de uso

El modelo se desarrolla tomando como referencia:

- ENACOM  
- Registro RUPECO  
- Trámites TIC, audiovisuales y postales  

---

## 🧪 Prueba de concepto (POC)

Se desarrolló un prototipo interactivo en Lovable para:

- Simular la experiencia del agente  
- Validar el flujo operativo  
- Evaluar la ergonomía del sistema  

🔗 Demo:  
https://demopenelope.lovable.app

---

## 🧭 Enfoque conceptual

Penélope no es un sistema de decisión automatizada.

Es un modelo de:

> **fiabilidad procedimental por diseño**

Su finalidad es evitar que la desorganización administrativa sustituya la decisión.

---

## 📚 Origen del proyecto

Trabajo final del:

**Posgrado Internacional en IA Generativa, Prompting y Derecho (IALAB)**  
Edición 2025  

---

## 👩‍💻 Autora

Graciela Mariana Posadas  
Abogada – Especialista en Derecho Administrativo, Telecomunicaciones e IA  

---

## 📌 Estado del proyecto

- ✔ Modelo conceptual desarrollado  
- ✔ Arquitectura técnico-jurídica definida  
- ✔ Prototipo funcional (POC)  
- ⏳ Pendiente: implementación institucional  

---
