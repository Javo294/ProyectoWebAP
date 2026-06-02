# IC4810 – Administración de Proyectos
## Proyecto 2: SISTRA-TEC – Sistema de Trazabilidad de Donaciones

**Institución:** Escuela de Ingeniería en Computación  
**Curso:** IC-4810 Administración de Proyectos  
**Profesor:** Dr. Jaime Solano Soto  
**Periodo:** I Semestre, 2026  
**Fecha de enunciado:** 20/04/2026

---

## Objetivo

Desarrollar una aplicación web **funcional, escalable, segura y bien arquitecturada**. El equipo debe asegurar que el software sea **inclusivo** antes de lanzarlo a la comunidad.

### Lecturas Recomendadas

- Artículo: *GenderMag: A Method for Evaluating Software's Gender Inclusiveness*
- Video: *"Gender-Inclusivity Software" with Margaret Burnett* (48.4 min)  
  [https://www.youtube.com/watch?v=txp4Cl3JGbc](https://www.youtube.com/watch?v=txp4Cl3JGbc)

> 💡 **Reflexión Crítica**  
> "Si en este aula somos 32 hombres y 1 mujer, y diseñamos el software según como nosotros aprendemos... ¿Estamos construyendo herramientas que excluyen al 50% de la población mundial por puro sesgo cognitivo?"

---

## 1. El Problema

Tras una emergencia natural en Costa Rica, diversas organizaciones recogen donaciones, pero la ciudadanía frecuentemente desconfía del destino final de los bienes.

**Solución requerida:** Construir una **Plataforma Web de Trazabilidad en Tiempo Real** que permita a un donante ver el ciclo de vida completo de su ayuda:

```
Recepción → Clasificación → En Tránsito → Entrega al Beneficiario
```

---

## 2. Requerimientos Técnicos

El sistema debe ser una **MVA (Minimum Viable Architecture)** — no un sitio estático.

| Capa | Tecnologías Permitidas | Requisitos |
|---|---|---|
| **Frontend** | React, Angular o Vue | Gestión de estado global (Redux / Context API), consumo de APIs asíncronas |
| **Backend** | Node.js (Express), Python (FastAPI / Django), C# (.NET Core) | Arquitectura en capas o Clean Architecture |
| **Base de Datos** | PostgreSQL | Integridad de transacciones de inventario |
| **Autenticación** | JWT (JSON Web Tokens) + OAuth2 | Roles: Administrador de Centro, Transportista, Donante |

---

## 3. Fases del Ejercicio

### Fase A: Modelado y Contratos

Definir **cuatro Historias de Usuario adicionales** a la HU base "Registro de Donación".

**Formato requerido para cada Historia de Usuario:**

```
ID:          [Número] – [Título]
Descripción: Como [rol]
             quiero [acción]
             para poder [beneficio]
Criterio de
Validación:  - [Criterio 1]
             - [Criterio 2]
             - [Criterio N]
Valor:       [Número de puntos]
Prioridad:   [Número]
Estimación:  [Horas]h
```

**Ejemplo de referencia (HU existente):**

```
ID:          32 – Catálogo de productos
Descripción: Como proveedor
             quiero poder entrar mis productos
             para poder componer un catálogo para poder ofrecerlos por la web
Criterio de
Validación:  - Dar de alta de productos
             - Comprobar que salen en la web
             - Comprobar que están todos
             - Modificar uno y comprobar que se actualiza en la web
Valor:       200
Prioridad:   1
Estimación:  16h
```

---

### Fase B: Desarrollo del Core

#### Frontend Inclusivo
- Aplicar los principios de **GenderMag** y accesibilidad **WCAG** en los formularios de registro.
- Basarse en las **cinco facetas cognitivas** del artículo de Burnett.
- Objetivo: garantizar que **cualquier ciudadano** pueda usar el sistema sin importar su perfil cognitivo.

#### Lógica de Negocio — Estado de la Donación
Implementar el siguiente flujo de estados:

```
Recibido → Clasificado → En Tránsito → Entregado
```

---

### Fase C: Despliegue y Calidad

| Entregable | Descripción |
|---|---|
| **Muro de Género** | Identificar al menos un "Muro de Género" en el software desarrollado |
| **Pruebas Unitarias** | Cobertura mínima del **70%** en la lógica del backend |
| **Despliegue** | Usar contenedores (Docker) o servicios en la nube (Heroku, AWS, Azure) |

---

## 4. Herramienta de Evaluación: La "Métrica de Producción"

| Criterio | Nivel 3: Senior (TEC) ✅ | Nivel 2: Junior ⚠️ | Nivel 1: Estudiante ❌ |
|---|---|---|---|
| **Arquitectura** | Separación total de intereses (Frontend / API / DB) | Lógica mezclada en los controladores | Todo en un solo archivo de script |
| **Seguridad** | Contraseñas hasheadas y rutas protegidas por JWT | Rutas protegidas, pero contraseñas en texto plano | Sin seguridad ni validación |
| **UX / Inclusión** | Sigue la guía de lenguaje inclusivo y es responsive | Funciona en desktop, pero no es intuitivo | Solo funciona en la resolución del alumno |

---

## 5. Mini-Manual: Auditoría de Inclusión Cognitiva (GenderMag)

El método GenderMag ayuda a encontrar **"Muros de Género"** en el software evaluando cómo diferentes perfiles cognitivos interactúan con la interfaz.

> **Aclaración clave:** No se trata de "hacer software para mujeres", sino de hacer software para **todos los estilos de pensamiento**.

### 5.1 Perfiles de Evaluación

| Perfil | Características |
|---|---|
| **Abigaíl** | Baja autoeficacia en computación; prefiere métodos familiares; aversión al riesgo (no explora botones desconocidos) |
| **Tim** | Alta autoeficacia; disfruta explorar nuevas funciones; aprende por ensayo y error |

### 5.2 Proceso de Auditoría (Paso a Paso)

Para cada acción que los usuarios deban realizar (ej: *Crear una cuenta*), responder las siguientes preguntas:

1. **Visión de la Faceta**  
   ¿La motivación (o el nivel de riesgo/autoeficacia) de "Abigaíl" y de "Tim" les permitiría **ver** que esta acción es necesaria?

2. **Visión de la Acción**  
   ¿"Abigaíl" y "Tim" **sabrán cómo realizar** la acción con los elementos disponibles en pantalla?

3. **Visión del Progreso**  
   Si realizan la acción, ¿el software les da una respuesta que **refuerza su confianza** o los confunde más?

### 5.3 Checklist de Rediseño Inclusivo

Si se detecta un fallo de inclusión, aplicar las siguientes soluciones:

- [ ] **Mensajes de Error Constructivos:** En lugar de `"Error 504"`, usar `"No pudimos conectar, intenta de nuevo, tus datos están a salvo"`.  
  *(Protege la Autoeficacia)*

- [ ] **Botón de "Deshacer" (Undo) Visible:** Si el usuario sabe que puede volver atrás, se atreverá a explorar más.  
  *(Reduce el Riesgo)*

- [ ] **Explicación del "Por Qué":** Antes de pedir un dato, explicar para qué sirve.  
  *(Ayuda al procesamiento Holístico)*

- [ ] **Ayuda en Contexto:** No redirigir al usuario a un manual externo; incluir pequeñas notas de ayuda junto a los campos difíciles.  
  *(Apoya el Aprendizaje)*

---

## Resumen de Entregables

| Fase | Entregable |
|---|---|
| A | 4 Historias de Usuario (formato estándar) |
| B | Aplicación web funcional con frontend inclusivo (GenderMag + WCAG) y flujo de estados de donación |
| C | Identificación de un Muro de Género + Pruebas unitarias ≥70% cobertura + Despliegue en Docker o nube |

---

*Documento generado a partir del enunciado oficial IC4810 – AP – Proyecto 2 – Web, con fecha 20/04/2026.*