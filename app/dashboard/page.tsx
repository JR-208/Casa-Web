import { logoutAction } from '@/lib/actions'

export default function DashboardPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#F7F5F0',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Header */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #E5E0D8',
        padding: '0 1.5rem',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '16px', fontWeight: 500, color: '#1A1814' }}>
          🏠 Hogar compartido
        </span>
        <form action={logoutAction}>
          <button type="submit" style={{
            background: 'none',
            border: 'none',
            fontSize: '13px',
            color: '#8C8880',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Salir
          </button>
        </form>
      </header>

      {/* Content placeholder */}
      <div style={{
        maxWidth: '640px',
        margin: '3rem auto',
        padding: '0 1rem',
        textAlign: 'center',
        color: '#B0ACA8',
        fontSize: '14px',
      }}>
        Aquí irán los módulos de aseo y gastos
      </div>
    </main>
  )
}
