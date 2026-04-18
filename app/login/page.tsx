'use client'

import { useActionState } from 'react'
import { loginAction } from '@/lib/actions'

const initialState = { error: '' }

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F7F5F0',
      fontFamily: "'DM Sans', sans-serif",
      padding: '1rem',
    }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>

        {/* Ícono */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px', height: '64px',
            background: '#fff',
            border: '1px solid #E5E0D8',
            borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '28px',
          }}>🏠</div>
          <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#1A1814', margin: '0 0 4px' }}>
            Hogar compartido
          </h1>
          <p style={{ fontSize: '14px', color: '#8C8880', margin: 0 }}>
            Ingresa el PIN para continuar
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          border: '1px solid #E5E0D8',
          borderRadius: '20px',
          padding: '1.75rem',
        }}>
          <form action={formAction}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#5C5850',
              marginBottom: '8px',
              letterSpacing: '0.02em',
            }}>
              PIN de acceso
            </label>

            <input
              name="pin"
              type="password"
              inputMode="numeric"
              maxLength={8}
              required
              placeholder="••••"
              autoFocus
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '22px',
                textAlign: 'center',
                letterSpacing: '0.3em',
                border: '1px solid #E5E0D8',
                borderRadius: '12px',
                outline: 'none',
                background: '#FAFAF8',
                color: '#1A1814',
                fontFamily: "'DM Mono', monospace",
                marginBottom: '12px',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#C4A882'}
              onBlur={e => e.target.style.borderColor = '#E5E0D8'}
            />

            {state?.error && (
              <p style={{
                fontSize: '13px',
                color: '#C0392B',
                textAlign: 'center',
                margin: '0 0 12px',
                padding: '8px 12px',
                background: '#FEF0EE',
                borderRadius: '8px',
              }}>
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              style={{
                width: '100%',
                padding: '12px',
                background: isPending ? '#C4B8A8' : '#2C2820',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 500,
                border: 'none',
                borderRadius: '12px',
                cursor: isPending ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {isPending ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#B0ACA8', marginTop: '1.5rem' }}>
          Solo personas con el PIN pueden acceder
        </p>
      </div>
    </main>
  )
}
