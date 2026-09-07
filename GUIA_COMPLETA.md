# Guía Completa: Curriculum Interactivo con Comentarios Moderados

**Fecha:** 10 de agosto de 2026

---

## Tabla de Contenidos

1. Introducción y Visión General
2. Plataformas y Tecnologías Utilizadas
3. Arquitectura del Proyecto
4. Paso a Paso: Implementación Práctica
5. Análisis de Costos: Google Cloud
6. Opciones Gratuitas vs. Pagadas
7. Herramientas a Estudiar (como Analista de Datos)
8. Alternativa Corporativa: Office 365 + Azure
9. Preguntas Frecuentes
10. Recursos y Referencias

---

## 1. Introducción y Visión General

Este proyecto es un **curriculum vitae interactivo** en línea con las siguientes características:

✓ **Frontend:** Sitio estático con HTML, CSS y JavaScript vanilla (sin frameworks).
✓ **Backend:** Funciones serverless en Node.js que se auto-escalan con la demanda.
✓ **Base de datos:** Google Sheets (tus comentarios son datos reales, no simulados).
✓ **Moderación:** Panel administrativo protegido por contraseña para aprobar/rechazar comentarios.
✓ **Hosting:** Desplegado automáticamente en Vercel con cada push a GitHub.

El resultado final es un CV dinámico que cualquiera puede visitar, dejar comentarios sobre tus logros, y tú controlas qué se publica.

---

## 2. Plataformas y Tecnologías Utilizadas

### 2.1 Stack actual (recomendado para este proyecto)

| Componente | Tecnología | Razón |
|---|---|---|
| Frontend | HTML5 + CSS3 + JavaScript ES6 | Cero dependencias, rápido, mantenible |
| Backend | Node.js + Vercel Serverless | Escalable automático, no requiere servidor |
| Base de datos | Google Sheets | Colaborativo, gratis, visual, no SQL necesario |
| Hosting | Vercel.com | Gratis para sitios estáticos + funciones serverless |
| Versionado | GitHub | Control de versiones, integración con Vercel |
| Autenticación | Contraseña estática | Simple para admin, suficiente para 1-2 usuarios |
| Logos | Assets locales (carpeta /assets) | Sin dependencias externas, bajo caché |

### 2.2 Alternativas posibles

- **Frontend:** React, Vue, Svelte (más pesadas, overkill para este caso)
- **Backend:** Python (Flask/FastAPI), Go, Java (más complejos, no serverless gratuito)
- **Base de datos:** MongoDB, PostgreSQL, Firebase (requieren más configuración)
- **Hosting:** Heroku (pagado ahora), AWS Lambda (complejo de configurar), Railway (alternativa a Vercel)

---

## 3. Arquitectura del Proyecto

### 3.1 Flujo de datos

**Visitante anónimo:**
1. Entra a tu-sitio.vercel.app → carga index.html (estático)
2. JavaScript carga data/resume.js → renderiza línea de tiempo con logos
3. Al clicar un logo → se abre modal con experiencia + formulario de comentario
4. Envía comentario → POST a /api/comments → guarda en Google Sheets (pendiente de aprobación)
5. Carga comentarios aprobados → GET a /api/comments → lee Google Sheets → muestra públicamente

**Tú (administrador):**
1. Entra a tu-sitio.vercel.app/admin.html → ingresa contraseña
2. Ve todos los comentarios (pendientes + aprobados)
3. Botones: Aprobar, Ocultar, Borrar
4. Toggle global: abrir/cerrar comentarios nuevos (útil durante eventos o vacaciones)
5. Cambios se guardan en Google Sheets automáticamente

### 3.2 Estructura de carpetas

```
curriculum-interactivo/
├── index.html              # Página principal (estática)
├── admin.html              # Panel de admin (estático)
├── styles.css              # Estilos compartidos
├── admin.css               # Estilos del panel
├── app.js                  # Lógica del sitio público
├── admin.js                # Lógica del panel admin
├── package.json            # Dependencias (google-spreadsheet, google-auth-library)
├── data/
│   └── resume.js           # ⭐ EDITA AQUÍ: contenido del CV
├── lib/
│   ├── sheets.js           # Conector a Google Sheets
│   └── auth.js             # Verificación de contraseña admin
├── api/                    # Funciones serverless (Vercel)
│   ├── comments.js         # GET/POST comentarios
│   └── admin/
│       ├── list.js         # Listar todos los comentarios
│       ├── approve.js      # Aprobar/ocultar
│       ├── delete.js       # Borrar
│       └── settings.js     # Abrir/cerrar comentarios
├── assets/
│   └── logos/              # Logos de empresas (locales)
│       ├── marketpro.png
│       ├── jugosdelvalle.svg
│       └── ...
└── .gitignore              # No versionar: node_modules, .env
```

---

## 4. Paso a Paso: Implementación Práctica

### 4.1 Preparación (Pre-requisitos)

- Cuenta de GitHub (gratis)
- Cuenta de Vercel (gratis)
- Cuenta de Google Cloud Console (prueba gratuita de 90 días con $300)
- Terminal/Bash (incluido en Windows, Mac, Linux)
- Editor de texto (VS Code, Sublime Text, o similar)

### 4.2 Fase 1: Crear el Google Sheet (tu base de datos)

1. Ve a sheets.google.com y crea un nuevo documento
2. Ponle nombre: 'Curriculum - Comentarios'
3. Copia el ID: es la parte de la URL entre /d/ y /edit
4. Guarda este ID para el Paso 4.4

**Nota:** No necesitas crear columnas ni pestañas, la app las crea solas.

### 4.3 Fase 2: Crear cuenta de servicio en Google Cloud

1. Ve a console.cloud.google.com
2. Crea un proyecto nuevo (nombre: 'curriculum-app')
3. Habilita Google Sheets API (busca en el buscador de arriba)
4. Ve a 'Credenciales' → 'Crear credenciales' → 'Cuenta de servicio'
5. Ponle nombre (ej. 'curriculum-bot') → Crear
6. Entra a esa cuenta → pestaña 'Claves' → 'Agregar clave' → 'JSON'
7. Se descarga un archivo .json con client_email y private_key
8. Vuelve a tu Google Sheet → Compartir → Pega el client_email → Editor

**⚠️ CRÍTICO:** Sin este paso, la app no podrá guardar comentarios.

### 4.4 Fase 3: Subir el código a GitHub

1. Descarga toda la carpeta curriculum-interactivo (la que construimos)
2. En GitHub, crea un repo nuevo: 'curriculum-interactivo'
3. Desde terminal: cd curriculum-interactivo && git init && git add . && git commit -m 'inicial'
4. git remote add origin https://github.com/TU-USUARIO/curriculum-interactivo.git
5. git push -u origin main

### 4.5 Fase 4: Desplegar en Vercel

1. Ve a vercel.com → 'Import Project' → selecciona tu repo de GitHub
2. Antes de Deploy, agrega las 4 variables de entorno:
   - GOOGLE_SERVICE_ACCOUNT_EMAIL = [del .json del paso 4.3]
   - GOOGLE_PRIVATE_KEY = [del .json del paso 4.3]
   - GOOGLE_SHEET_ID = [del paso 4.2]
   - ADMIN_PASSWORD = [elige una contraseña]
3. Deploy → en 1-2 minutos obtienes tu URL (ej. curriculum-interactivo.vercel.app)

---

## 5. Análisis de Costos: Google Cloud

### 5.1 Período de prueba (primeros 90 días)

- **Crédito inicial:** $300 USD
- **Duración:** 90 días
- **Sheets API:** 60 solicitudes/minuto por usuario = gratis (límite generoso)
- **Costo estimado:** $0 (mientras no excedas los límites gratuitos)

### 5.2 Después de 90 días (sin acciones de tu parte)

- **Cambio automático:** Tu proyecto NO se apaga. Google pasa al modelo de pago por uso.
- **¿Tienes que pagar sí o sí?** NO, solo pagas si excedes los límites gratuitos.

**Límites gratuitos permanentes (después de los 90 días):**
- Google Sheets API: 60 solicitudes/minuto, gratis
- Compute (si usaras Cloud Functions): 2 millones de invocaciones/mes, gratis
- Cloud Storage: 5 GB/mes, gratis
- BigQuery: 1 TB/mes de consultas, gratis

**¿Tu caso específico?**
Un CV con comentarios moderados probablemente nunca supere estos límites gratuitos. A menos que recibas millones de comentarios/mes, seguirá siendo gratis.

### 5.3 ¿Cuánto costaría si necesitarás pagar?

| Servicio | Límite gratuito | Precio si lo superas |
|---|---|---|
| Sheets API | 60 req/min (24M/mes) | Se incluye en Google Cloud gratis |
| Cloud Storage | 5 GB/mes | $0.020 por GB adicional |
| Compute (Apps Script) | Incluido | Casi nunca pago (muy eficiente) |

**Conclusión:** Para un CV interactivo típico, el costo anual posterior a los 90 días será $0. Solo pagarías si tuvieras una escalada masiva de tráfico (millones de comentarios/mes).

---

## 6. Opciones Gratuitas vs. Pagadas

### 6.1 Nuestra opción actual (100% gratis)

- Vercel (hosting estático + serverless): Gratis indefinidamente
- GitHub (versionado): Gratis para repos públicos
- Google Sheets (base de datos): Gratis (5M filas)
- Google Cloud Console: Gratis primeros 90 días + límites gratuitos permanentes

**Costo total: $0/año**

### 6.2 Alternativas pagadas (si queremos más funcionalidades)

| Alternativa | Costo/mes | Ventajas | Desventajas |
|---|---|---|---|
| Heroku + PostgreSQL | $7-50 | BD tradicional, escalable | Más caro, más complejo |
| AWS Lambda + RDS | $15-100 | Muy escalable | Configuración compleja |
| Firebase (Google) | $0-300 | Tiempo real, autenticación integrada | Vendor lock-in, caro a escala |
| Railway (Vercel alternativa) | $7-100 | Similar a Vercel, buen UX | Comunidad más pequeña |

**Recomendación:** Mantén la opción gratuita. Es más que suficiente para un CV y tiene cero overhead operacional.

---

## 7. Herramientas a Estudiar (como Analista de Datos)

### 7.1 Ruta de aprendizaje recomendada

**Nivel 1: Fundamentos (1-2 meses)**
- **HTML/CSS/JavaScript:** Tutorial de freeCodeCamp (5-10 horas)
- **Git & GitHub:** Aprender a hacer push, commit, branches
- **APIs RESTful:** Entender GET/POST, JSON, cómo se comunican navegador ↔ servidor

**Nivel 2: Datos & Backend (2-4 meses)**
- **Google Sheets API:** Leer/escribir datos desde código (Python o Node.js)
- **Node.js basics:** Entender async/await, funciones serverless
- **JSON & Data Structures:** Cómo se organizan datos en APIs
- **Environment variables & Secrets:** Cómo no exponer contraseñas

**Nivel 3: Análisis aplicado (1-2 meses)**
- **SQL básico:** Si pasas de Sheets a bases de datos reales
- **Power BI / Looker:** Visualizar datos de Google Sheets en dashboards
- **Python para análisis:** pandas, numpy (complementario a SQL)

### 7.2 Recursos gratuitos específicos

- **freeCodeCamp (YouTube):** Web Development, APIs, Node.js
- **MDN Web Docs (mozilla.org):** Referencia de HTML/CSS/JS
- **Google Colab + pandas:** Análisis sin instalar Python
- **Postman (desktop):** Testear APIs antes de integrarlas
- **Google Sheets función IMPORTRANGE:** Conectar múltiples sheets

**Tiempo estimado total:** 6-9 meses de estudio dedicado (15-20 horas/semana) para dominar todo y ser capaz de crear proyectos similares desde cero.

---

## 8. Alternativa Corporativa: Office 365 + Azure

### 8.1 Reemplazos equivalentes en ecosistema Microsoft

| Nuestra solución | Alternativa Office 365 | Alternativa Azure | Ventaja corporativa |
|---|---|---|---|
| Google Sheets | Excel Online (OneDrive/SharePoint) | Azure SQL Database | Integración con Microsoft Teams, más control |
| Vercel | Azure App Service o Azure Static Web Apps | Azure Functions | Facturación centralizada, auditoría integrada |
| Google Cloud Console | Azure Portal | Azure Portal | Single sign-on con Active Directory corporativo |
| GitHub | Azure DevOps Repos | Azure Pipelines | Integración nativa, mejor compliance |

### 8.2 Beneficios de la ruta corporativa

- **Cumplimiento:** Auditoría automática, compliance con GDPR/HIPAA
- **Seguridad:** Encriptación en tránsito y en reposo, MFA integrado
- **Escalabilidad:** Infraestructura empresarial lista para 10K+ usuarios
- **Soporte:** Support 24/7 incluido en contratos empresariales
- **Integración:** SSO con Active Directory, Power BI sin configuración extra

### 8.3 Costos corporativos estimados

- **Microsoft Office 365 Enterprise:** $20-30/usuario/mes
- **Azure App Service (pequeño):** $50-200/mes
- **Azure SQL Database:** $100-500/mes según tamaño
- **Total estimado:** $300-1000/mes (depende de usuarios y uso)

**Cuándo usar esto:** Si tu empresa usa Office 365 ya, quieres compliance, o tienes >50 usuarios.

---

## 9. Preguntas Frecuentes

**P1. ¿Puedo editar el CV sin código?**
Sí, todo está en data/resume.js (un archivo de datos). Solo cambias texto, fechas, URLs de logos. No toques el código.

**P2. ¿Qué pasa si Google Cloud me cierra la cuenta después de 90 días sin pagar?**
No la cierra. Pasa automáticamente a pago por uso, pero los límites gratuitos permanentes siguen vigentes. Seguirá gratis si no excedes esos límites.

**P3. ¿Puedo usar mi propia base de datos en lugar de Google Sheets?**
Sí, pero necesitas: PostgreSQL (Heroku), MongoDB (Atlas), o Firebase. Más configuración, más caro. Sheets es más fácil.

**P4. ¿Cuál es la velocidad de carga del sitio?**
Muy rápida: el HTML/CSS es estático (0 servidor), JS es mínimo, logos son locales. Típicamente <500ms worldwide.

**P5. ¿Cómo privarizo la URL para que no aparezca en Google Search?**
Sube un archivo robots.txt que diga Disallow: /, o usa password protection en Vercel (pagado).

**P6. ¿Puedo integrar esto con LinkedIn, Twitter, etc?**
Sí, con OAuth (requiere configuración de APIs de esas plataformas). Fuera del scope de esta guía.

**P7. ¿Y si quiero versionar el CV en GitHub para que se vea el historial de cambios?**
Perfecto, ya lo estás haciendo. data/resume.js está versionado, así que Git muestra cada cambio.

---

## 10. Recursos y Referencias

### 10.1 Documentación oficial

- Google Sheets API: developers.google.com/sheets/api
- Vercel Docs: vercel.com/docs
- Node.js Docs: nodejs.org/docs
- MDN (HTML/CSS/JS): developer.mozilla.org

### 10.2 Comunidades de soporte

- Stack Overflow (etiquetas: google-sheets-api, vercel, node.js)
- GitHub Discussions (en el repo del proyecto)
- Vercel Community Slack: vercel.com/support
- Google Cloud Community: cloud.google.com/community

### 10.3 Archivos descargables

Todos los archivos del proyecto están disponibles en:
**github.com/[TU-USUARIO]/curriculum-interactivo**

Clona el repo con:
```
git clone https://github.com/[TU-USUARIO]/curriculum-interactivo.git
```

---

**📌 Última actualización:** 10 de agosto de 2026
**📧 Preguntas?** Abre un issue en GitHub o consulta la documentación del proyecto.
