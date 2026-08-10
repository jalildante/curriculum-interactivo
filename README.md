# Curriculum interactivo — Isaac Jalil Romero Franco

Sitio estático (HTML/CSS/JS sin frameworks) + funciones serverless en Vercel.
Los comentarios se guardan y moderan en un **Google Sheet** (tu "repositorio" de datos).

## Estructura

```
index.html          Página principal (línea de tiempo interactiva)
admin.html           Panel de administrador (moderación)
styles.css / admin.css
app.js / admin.js    Lógica del sitio (sin build step, JS nativo con módulos ES)
data/resume.js       ← EDITA AQUÍ el contenido del CV, logos, fechas, logros
api/comments.js      Endpoint público: leer comentarios aprobados / enviar uno nuevo
api/admin/*.js        Endpoints de administrador (listar todo, aprobar, borrar, abrir/cerrar)
lib/sheets.js         Conexión a Google Sheets
lib/auth.js           Verifica la contraseña de administrador
```

## 1. Editar el contenido o los logos

Todo el texto del CV y las URLs de los logos están en [`data/resume.js`](data/resume.js).
Cada empresa es un objeto dentro de `COMPANIES`. Para cambiar un logo, reemplaza el
valor de `logo: "..."` por la URL de otra imagen. Si lo dejas vacío (`""`), el sitio
genera automáticamente un ícono con las iniciales de la empresa — nunca se rompe.

No hace falta ningún build: guardas el archivo y recargas la página.

## 2. Crear el Google Sheet (el "repositorio" de comentarios)

1. Crea una hoja de cálculo nueva en [sheets.google.com](https://sheets.google.com).
   No necesitas crear las pestañas ni encabezados: la app los crea solos la primera
   vez que se usa (pestañas `Comments` y `Settings`).
2. Copia el ID de la hoja: es la parte de la URL entre `/d/` y `/edit`, ejemplo:
   `https://docs.google.com/spreadsheets/d/`**`1AbCdEfGhIjKlmNoPQRstuVWXyz`**`/edit`

## 3. Crear la cuenta de servicio de Google (para que la app pueda leer/escribir)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/) y crea un proyecto
   (o usa uno existente).
2. Habilita la **Google Sheets API**: menú "APIs y servicios" → "Habilitar APIs y
   servicios" → busca "Google Sheets API" → Habilitar.
3. Crea una cuenta de servicio: "APIs y servicios" → "Credenciales" → "Crear
   credenciales" → "Cuenta de servicio". Dale cualquier nombre (ej. `curriculum-bot`).
4. Entra a la cuenta de servicio creada → pestaña "Claves" → "Agregar clave" →
   "Crear clave nueva" → tipo **JSON**. Se descarga un archivo `.json`.
5. Abre ese archivo. Necesitas dos valores:
   - `client_email` → esta es tu `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → esta es tu `GOOGLE_PRIVATE_KEY` (incluye los `\n`, cópiala tal cual, entre comillas)
6. Vuelve a tu Google Sheet → botón "Compartir" → pega el `client_email` de la
   cuenta de servicio → dale rol **Editor** → Enviar.
   (Sin este paso, la app no podrá leer ni escribir el Sheet.)

## 4. Configurar variables de entorno en Vercel

En el dashboard del proyecto en Vercel: **Settings → Environment Variables**, agrega:

| Variable | Valor |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | el `client_email` del paso 3 |
| `GOOGLE_PRIVATE_KEY` | el `private_key` del paso 3 (con comillas, tal cual) |
| `GOOGLE_SHEET_ID` | el ID del Sheet del paso 2 |
| `ADMIN_PASSWORD` | una contraseña que tú elijas para entrar a `/admin.html` |

## 5. Subir el proyecto a GitHub y desplegar en Vercel

```bash
cd curriculum-interactivo
git init
git add .
git commit -m "Curriculum interactivo inicial"
```

Luego crea un repositorio vacío en GitHub y conéctalo:

```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git branch -M main
git push -u origin main
```

Finalmente, en [vercel.com](https://vercel.com): "Add New… → Project" → importa
ese repositorio de GitHub → Vercel detecta automáticamente las funciones en `/api`
y el resto de archivos estáticos, no requiere configuración adicional → agrega las
4 variables de entorno del paso 4 → Deploy.

Cada vez que hagas `git push`, Vercel vuelve a desplegar automáticamente.

## 6. Cómo funciona la moderación de comentarios

- Cualquier visitante puede escribir un comentario en la etapa (empresa) que
  quiera, indicando su nombre. Ese comentario queda **pendiente** — nadie más
  lo ve todavía, solo tú.
- Entra a `TU-SITIO.vercel.app/admin.html`, ingresa tu `ADMIN_PASSWORD`.
- Desde ahí puedes: **aprobar** (se vuelve público), **ocultar** un comentario ya
  aprobado, **borrarlo** permanentemente, y **abrir/cerrar** globalmente la
  recepción de comentarios nuevos con un interruptor — cuando está cerrado, los
  comentarios existentes se conservan pero nadie puede enviar uno nuevo, y puedes
  reabrirlo cuando quieras.

## Nota sobre este entorno de desarrollo

Esta máquina no tiene Node.js instalado, así que no pude ejecutar `npm install`
ni levantar el backend (`/api`) localmente para probarlo de extremo a extremo —
sí verifiqué visualmente el sitio y el panel de administrador con un servidor
estático simple. El backend sigue el patrón estándar de Vercel Serverless
Functions, y Vercel instala las dependencias (`google-spreadsheet`,
`google-auth-library`) automáticamente al desplegar, así que no necesitas Node
instalado localmente para publicarlo. Si quieres probarlo en tu máquina antes de
desplegar, instala Node.js LTS y corre `npm install -g vercel && vercel dev`
dentro de esta carpeta.
