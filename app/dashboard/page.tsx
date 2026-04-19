'use client'

import { useState, useCallback, useEffect } from 'react'
import { demoStore, type AseoEntry, type CompraItem, type TableroPosta } from '@/lib/demo-store'

const FAMILIAS = ['Familia D', 'Familia S']
const C = {
  bg: '#F7F5F0', white: '#FFFFFF', border: '#E5E0D8',
  text: '#1A1814', muted: '#8C8880', hint: '#B0ACA8',
  accent: '#2C2820', accentLight: '#F0EDE8',
  green: '#2D6A4F', greenBg: '#EAF5EE',
  red: '#C0392B', redBg: '#FEF0EE',
  blue: '#1A5276', blueBg: '#EAF2FB',
}

const S: Record<string, React.CSSProperties | ((arg: string) => React.CSSProperties)> = {
  card: { background: C.white, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' },
  label: { fontSize: '12px', fontWeight: 500, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
  input: { width: '100%', padding: '10px 12px', fontSize: '14px', border: `1px solid ${C.border}`, borderRadius: '10px', outline: 'none', background: '#FAFAF8', color: C.text, fontFamily: "'DM Sans', sans-serif" },
  btn: (color = C.accent): React.CSSProperties => ({ padding: '9px 16px', background: color, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }),
  btnGhost: { padding: '6px 12px', background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  tag: (fam: string): React.CSSProperties => ({ fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '6px', background: fam === 'Familia D' ? '#EAF2FB' : '#F5EEF8', color: fam === 'Familia D' ? '#1A5276' : '#6C3483' }),
}

export default function Dashboard() {
  const [tab, setTab] = useState<'aseo' | 'compras' | 'tablero'>('aseo')

  // --- ASEO ---
  const [aseoList, setAseoList] = useState<AseoEntry[]>([])
  const [aseoFamilia, setAseoFamilia] = useState(FAMILIAS[0])
  const [aseoFecha, setAseoFecha] = useState(new Date().toISOString().split('T')[0])
  const [aseoNota, setAseoNota] = useState('')

  const loadAseo = useCallback(() => {
    setAseoList(demoStore.getAseo())
  }, [])

  const addAseo = () => {
    demoStore.addAseo({ familia: aseoFamilia, fecha: aseoFecha, nota: aseoNota })
    setAseoNota('')
    loadAseo()
  }

  const deleteAseo = (id: string) => {
    demoStore.deleteAseo(id)
    loadAseo()
  }

  // --- COMPRAS ---
  const [comprasFamilia, setComprasFamilia] = useState(FAMILIAS[0])
  const [comprasList, setComprasList] = useState<CompraItem[]>([])
  const [comprasInput, setComprasInput] = useState('')

  const loadCompras = useCallback((fam: string) => {
    setComprasList(demoStore.getCompras(fam))
  }, [])

  const addCompra = () => {
    if (!comprasInput.trim()) return
    demoStore.addCompra({ familia: comprasFamilia, item: comprasInput.trim(), completado: false })
    setComprasInput('')
    loadCompras(comprasFamilia)
  }

  const toggleCompra = (item: CompraItem) => {
    demoStore.toggleCompra(item.id)
    loadCompras(comprasFamilia)
  }

  const deleteCompra = (id: string) => {
    demoStore.deleteCompra(id)
    loadCompras(comprasFamilia)
  }

  const clearCompletadas = () => {
    demoStore.clearCompletadas(comprasFamilia)
    loadCompras(comprasFamilia)
  }

  // --- TABLERO ---
  const [tableroList, setTableroList] = useState<TableroPosta[]>([])
  const [tableroTitulo, setTableroTitulo] = useState('')
  const [tableroContenido, setTableroContenido] = useState('')
  const [tableroFamilia, setTableroFamilia] = useState(FAMILIAS[0])

  const loadTablero = useCallback(() => {
    setTableroList(demoStore.getTablero())
  }, [])

  const addTablero = () => {
    if (!tableroTitulo.trim() || !tableroContenido.trim()) return
    demoStore.addTablero({ titulo: tableroTitulo.trim(), contenido: tableroContenido.trim(), familia: tableroFamilia })
    setTableroTitulo('')
    setTableroContenido('')
    loadTablero()
  }

  const deleteTablero = (id: string) => {
    demoStore.deleteTablero(id)
    loadTablero()
  }

  // Load on mount and tab change
  useEffect(() => { loadAseo() }, [loadAseo])
  useEffect(() => { loadCompras(comprasFamilia) }, [comprasFamilia, loadCompras])
  useEffect(() => { loadTablero() }, [loadTablero])

  const formatFecha = (f: string) => new Date(f + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <header style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '0 1.25rem', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <span style={{ fontSize: '15px', fontWeight: 500, color: C.text }}>Hogar compartido</span>
        <span style={{ fontSize: '11px', padding: '4px 8px', background: '#FEF3CD', color: '#856404', borderRadius: '6px' }}>Modo Demo</span>
      </header>

      {/* Tabs */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, display: 'flex', padding: '0 1.25rem', gap: '0' }}>
        {([['aseo', 'Aseo'], ['compras', 'Compras'], ['tablero', 'Tablero']] as [typeof tab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '12px 16px', fontSize: '13px', fontWeight: tab === key ? 500 : 400,
            color: tab === key ? C.text : C.muted, background: 'none', border: 'none',
            borderBottom: tab === key ? `2px solid ${C.accent}` : '2px solid transparent',
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.25rem 1rem' }}>

        {/* ============ ASEO ============ */}
        {tab === 'aseo' && (
          <div>
            <div style={S.card as React.CSSProperties}>
              <p style={{ ...(S.label as React.CSSProperties), marginBottom: '12px' }}>Registrar aseo</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <select value={aseoFamilia} onChange={e => setAseoFamilia(e.target.value)} style={{ ...(S.input as React.CSSProperties) }}>
                  {FAMILIAS.map(f => <option key={f}>{f}</option>)}
                </select>
                <input type="date" value={aseoFecha} onChange={e => setAseoFecha(e.target.value)} style={S.input as React.CSSProperties} />
              </div>
              <input placeholder="Nota opcional (ej. incluye banos)" value={aseoNota} onChange={e => setAseoNota(e.target.value)} style={{ ...(S.input as React.CSSProperties), marginBottom: '10px' }} />
              <button onClick={addAseo} style={(S.btn as (color?: string) => React.CSSProperties)()}>
                + Registrar
              </button>
            </div>

            <p style={{ ...(S.label as React.CSSProperties), marginBottom: '10px' }}>Historial reciente</p>
            {aseoList.length === 0 && <p style={{ color: C.hint, fontSize: '14px', textAlign: 'center', padding: '2rem 0' }}>Aun no hay registros de aseo.</p>}
            {aseoList.map(e => (
              <div key={e.id} style={{ ...(S.card as React.CSSProperties), marginBottom: '8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={(S.tag as (fam: string) => React.CSSProperties)(e.familia)}>{e.familia}</span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: C.text }}>{formatFecha(e.fecha)}</span>
                  </div>
                  {e.nota && <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>{e.nota}</p>}
                </div>
                <button onClick={() => deleteAseo(e.id)} style={{ background: 'none', border: 'none', color: C.hint, cursor: 'pointer', fontSize: '16px', padding: '0 4px' }}>x</button>
              </div>
            ))}
          </div>
        )}

        {/* ============ COMPRAS ============ */}
        {tab === 'compras' && (
          <div>
            {/* Selector familia */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
              {FAMILIAS.map(f => (
                <button key={f} onClick={() => setComprasFamilia(f)} style={{
                  padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 500,
                  border: `1px solid ${comprasFamilia === f ? C.accent : C.border}`,
                  background: comprasFamilia === f ? C.accent : C.white,
                  color: comprasFamilia === f ? '#fff' : C.muted,
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                }}>{f}</button>
              ))}
            </div>

            <div style={S.card as React.CSSProperties}>
              <p style={{ ...(S.label as React.CSSProperties), marginBottom: '10px' }}>Lista de {comprasFamilia}</p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  placeholder="Agregar item..." value={comprasInput}
                  onChange={e => setComprasInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCompra()}
                  style={{ ...(S.input as React.CSSProperties), flex: 1 }}
                />
                <button onClick={addCompra} style={(S.btn as (color?: string) => React.CSSProperties)()}>+</button>
              </div>

              {comprasList.length === 0 && <p style={{ color: C.hint, fontSize: '14px', textAlign: 'center', padding: '1rem 0' }}>Lista vacia - agrega algo arriba.</p>}

              {comprasList.map(item => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 0', borderBottom: `1px solid ${C.border}`,
                }}>
                  <button onClick={() => toggleCompra(item)} style={{
                    width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
                    border: `1.5px solid ${item.completado ? C.green : C.border}`,
                    background: item.completado ? C.green : 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {item.completado && <span style={{ color: '#fff', fontSize: '11px', lineHeight: 1 }}>&#10003;</span>}
                  </button>
                  <span style={{ flex: 1, fontSize: '14px', color: item.completado ? C.hint : C.text, textDecoration: item.completado ? 'line-through' : 'none' }}>
                    {item.item}
                  </span>
                  <button onClick={() => deleteCompra(item.id)} style={{ background: 'none', border: 'none', color: C.hint, cursor: 'pointer', fontSize: '16px' }}>x</button>
                </div>
              ))}

              {comprasList.some(i => i.completado) && (
                <button onClick={clearCompletadas} style={{ ...(S.btnGhost as React.CSSProperties), marginTop: '12px', fontSize: '12px' }}>
                  Limpiar completados
                </button>
              )}
            </div>
          </div>
        )}

        {/* ============ TABLERO ============ */}
        {tab === 'tablero' && (
          <div>
            <div style={S.card as React.CSSProperties}>
              <p style={{ ...(S.label as React.CSSProperties), marginBottom: '12px' }}>Nueva nota</p>
              <select value={tableroFamilia} onChange={e => setTableroFamilia(e.target.value)} style={{ ...(S.input as React.CSSProperties), marginBottom: '8px' }}>
                {FAMILIAS.map(f => <option key={f}>{f}</option>)}
              </select>
              <input placeholder="Titulo" value={tableroTitulo} onChange={e => setTableroTitulo(e.target.value)} style={{ ...(S.input as React.CSSProperties), marginBottom: '8px' }} />
              <textarea
                placeholder="Escribe la nota aqui..."
                value={tableroContenido} onChange={e => setTableroContenido(e.target.value)}
                rows={3}
                style={{ ...(S.input as React.CSSProperties), resize: 'vertical', marginBottom: '10px' }}
              />
              <button onClick={addTablero} style={(S.btn as (color?: string) => React.CSSProperties)()}>
                + Publicar nota
              </button>
            </div>

            <p style={{ ...(S.label as React.CSSProperties), marginBottom: '10px' }}>Notas publicadas</p>
            {tableroList.length === 0 && <p style={{ color: C.hint, fontSize: '14px', textAlign: 'center', padding: '2rem 0' }}>No hay notas aun.</p>}
            {tableroList.map(n => (
              <div key={n.id} style={{ ...(S.card as React.CSSProperties), marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={(S.tag as (fam: string) => React.CSSProperties)(n.familia)}>{n.familia}</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: C.text }}>{n.titulo}</span>
                  </div>
                  <button onClick={() => deleteTablero(n.id)} style={{ background: 'none', border: 'none', color: C.hint, cursor: 'pointer', fontSize: '16px' }}>x</button>
                </div>
                <p style={{ fontSize: '14px', color: C.muted, margin: '0 0 6px', lineHeight: 1.5 }}>{n.contenido}</p>
                <p style={{ fontSize: '11px', color: C.hint, margin: 0 }}>
                  {new Date(n.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
