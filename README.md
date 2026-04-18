# 🏠 Hogar compartido

App para organizar el hogar entre dos familias.

---

## Cómo subir esto a Vercel (sin instalar nada)

### Paso 1 — Sube estos archivos a GitHub

En tu repositorio de GitHub, crea cada archivo con su ruta exacta y pega el contenido.
Los archivos que necesitas son:

```
package.json
next.config.js
tsconfig.json
tailwind.config.ts
postcss.config.js
middleware.ts
.gitignore
app/globals.css
app/layout.tsx
app/page.tsx
app/login/page.tsx
app/dashboard/page.tsx
lib/actions.ts
```

### Paso 2 — Conecta el repo en Vercel

1. Entra a vercel.com
2. "Add New Project"
3. Selecciona tu repositorio de GitHub
4. Vercel detecta automáticamente que es Next.js

### Paso 3 — Agrega la variable de entorno

Antes de hacer deploy, en la sección **Environment Variables** agrega:

| Nombre | Valor |
|--------|-------|
| `HOGAR_PIN` | el PIN que quieras (ej. `1234`) |

### Paso 4 — Deploy

Haz clic en **Deploy**. En 2 minutos tienes la app online.

---

## Cómo cambiar el PIN después

En Vercel → tu proyecto → Settings → Environment Variables → edita `HOGAR_PIN` → Redeploy.
