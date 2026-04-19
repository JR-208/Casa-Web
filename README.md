# 🏠 Hogar compartido — Familia D & Familia S

## Variables de entorno en Vercel

En Vercel → tu proyecto → Settings → Environment Variables agrega estas 3:

| Nombre | Valor |
|--------|-------|
| `HOGAR_PIN` | Tu PIN de acceso (ej. `1234`) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://aytcbncjcuqalbwklisg.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_TcUz9q7TimrWpWR8mxja6g_hczaTnuo` |

Después de agregar las variables, haz **Redeploy**.

## Secciones

- **Aseo** — registra qué familia hizo el aseo y qué día
- **Compras** — lista privada por familia, se puede tachar lo comprado
- **Tablero** — notas públicas visibles para ambas familias
