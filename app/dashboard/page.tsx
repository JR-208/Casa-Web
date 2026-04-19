'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

type AseoEntry = { id: string; familia: string; fecha: string; nota: string }
type CompraItem = { id: string; familia: string; item: string; completado: boolean }
type TableroPosta = { id: string; titulo: string; contenido: string; familia: string; created_at: string }

const FAMILIAS = ['Familia D', 'Familia S']
const C = {
  bg: '#F7F5F0', white: '#FFFFFF', border: '#E5E0D8',
  text: '#1A1814', muted: '#8C8880', hint: '#B0ACA8',
  accent: '#2C2820', accentLight: '#F0EDE8',
  green: '#2D6A4F', greenBg: '#EAF5EE',
  red: '#C0392B', redBg: '#FEF0EE',
  blue: '#1A5276', blueBg: '#EAF2FB',
}

const S: Record<string, React.CSSProperties> = {
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
  const [aseoLoading, setAseoLoading] = useState(false)

  const loadAseo = useCallback(async () => {
    const { data } = await supabase.from('aseo').select('*').order('fecha', { ascending: false }).limit(20)
    if (data) setAseoList(data)
  }, [])

  const addAseo = async () => {
    if (aseoLoading) return
    setAseoLoading(true)
    await supabase.from('aseo').insert({ familia: aseoFamilia, fecha: aseoFecha, nota: aseoNota })
    setAseoNota('')
    await loadAseo()
    setAseoLoading(false)
  }

  const deleteAseo = async (id: string) => {
    await supabase.from('aseo').delete().eq('id', id)
    await loadAseo()
  }

  // --- COMPRAS ---
  const [comprasFamilia, setComprasFamilia] = useState(FAMILIAS[0])
  const [comprasList, setComprasList] = useState<CompraItem[]>([])
  const [comprasInput, setComprasInput] = useState('')
  const [comprasLoading, setComprasLoading] = useState(false)

  const loadCompras = useCallback(async (fam: string) => {
    const { data } = await supabase.from('compras').select('*').eq('familia', fam).order('created_at', { ascending: true })
    if (data) setComprasList(data)
  }, [])

  const addCompra = async () => {
    if (!comprasInput.trim() || comprasLoading) return
    setComprasLoading(true)
    await supabase.from('compras').insert({ familia: comprasFamilia, item: comprasInput.trim(), completado: false })
    setComprasInput('')
    await loadCompras(comprasFamilia)
    setComprasLoading(false)
  }

  const toggleCompra = async (item: CompraItem) => {
    await supabase.from('compras').update({ completado: !item.completado }).eq('id', item.id)
    await loadCompras(comprasFamilia)
  }

  const deleteCompra = async (id: string) => {
    await supabase.from('compras').delete().eq('id', id)
    await loadCompras(comprasFamilia)
  }

  const clearCompletadas = async () => {
    await supabase.from('compras').delete().eq('familia', comprasFamilia).eq('completado', true)
    await loadCompras(comprasFamilia)
  }

  // --- TABLERO ---
  const [tableroList, setTableroList] = useState<TableroPosta[]>([])
  const [tableroTitulo, setTableroTitulo] = useState('')
  const [tableroContenido, setTableroContenido] = useState('')
  const [tableroFamilia, setTableroFamilia] = useState(FAMILIAS[0])
  const [tableroLoading, setTableroLoading] = useState(false)

  const loadTablero = useCallback(async () => {
    const { data } = await supabase.from('tablero').select('*').order('created_at', { ascending: false })
    if (data) setTableroList(data)
  }, [])

  const addTablero = async () => {
    if (!tableroTitulo.trim() || !tableroContenido.trim() || tableroLoading) return
    setTableroLoading(true)
    await supabase.from('tablero').insert({ titulo: tableroTitulo.trim(), contenido: tableroContenido.trim(), familia: tableroFamilia })
    setTableroTitulo('')
    setTableroContenido('')
    await loadTablero()
    setTableroLoading(false)
  }

  const deleteTablero = async (id: string) => {
    await supabase.from('tablero').delete().eq('id', id)
    await loadTablero()
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
        <span style={{ fontSize: '15px', fontWeight: 500, color: C.text }}>🏠 Hogar compartido</span>
        <button onClick={async () => { await fetch('/api/logout', { method: 'POST' }); window.location.href = '/login' }} style={S.btnGhost}>Salir</button>
      </header>

      {/* Tabs */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, display: 'flex', padding: '0 1.25rem', gap: '0' }}>
        {([['aseo', '🧹 Aseo'], ['compras', '🛒 Compras'], ['tablero', '📋 Tablero']] as [typeof tab, string][]).map(([key, label]) => (
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
            <div style={S.card}>
              <p style={{ ...S.label, marginBottom: '12px' }}>Registrar aseo</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <select value={aseoFamilia} onChange={e => setAseoFamilia(e.target.value)} style={{ ...S.input }}>
                  {FAMILIAS.map(f => <option key={f}>{f}</option>)}
                </select>
                <input type="date" value={aseoFecha} onChange={e => setAseoFecha(e.target.value)} style={S.input} />
              </div>
              <input placeholder="Nota opcional (ej. incluye baños)" value={aseoNota} onChange={e => setAseoNota(e.target.value)} style={{ ...S.input, marginBottom: '10px' }} />
              <button onClick={addAseo} disabled={aseoLoading} style={S.btn()}>
                {aseoLoading ? 'Guardando...' : '+ Registrar'}
              </button>
            </div>

            <p style={{ ...S.label, marginBottom: '10px' }}>Historial reciente</p>
            {aseoList.length === 0 && <p style={{ color: C.hint, fontSize: '14px', textAlign: 'center', padding: '2rem 0' }}>Aún no hay registros de aseo.</p>}
            {aseoList.map(e => (
              <div key={e.id} style={{ ...S.card, marginBottom: '8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={S.tag(e.familia)}>{e.familia}</span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: C.text }}>{formatFecha(e.fecha)}</span>
                  </div>
                  {e.nota && <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>{e.nota}</p>}
                </div>
                <button onClick={() => deleteAseo(e.id)} style={{ background: 'none', border: 'none', color: C.hint, cursor: 'pointer', fontSize: '16px', padding: '0 4px' }}>×</button>
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

            <div style={S.card}>
              <p style={{ ...S.label, marginBottom: '10px' }}>Lista de {comprasFamilia}</p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  placeholder="Agregar item..." value={comprasInput}
                  onChange={e => setComprasInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCompra()}
                  style={{ ...S.input, flex: 1 }}
                />
                <button onClick={addCompra} disabled={comprasLoading} style={S.btn()}>+</button>
              </div>

              {comprasList.length === 0 && <p style={{ color: C.hint, fontSize: '14px', textAlign: 'center', padding: '1rem 0' }}>Lista vacía — agrega algo arriba.</p>}

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
                    {item.completado && <span style={{ color: '#fff', fontSize: '11px', lineHeight: 1 }}>✓</span>}
                  </button>
                  <span style={{ flex: 1, fontSize: '14px', color: item.completado ? C.hint : C.text, textDecoration: item.completado ? 'line-through' : 'none' }}>
                    {item.item}
                  </span>
                  <button onClick={() => deleteCompra(item.id)} style={{ background: 'none', border: 'none', color: C.hint, cursor: 'pointer', fontSize: '16px' }}>×</button>
                </div>
              ))}

              {comprasList.some(i => i.completado) && (
                <button onClick={clearCompletadas} style={{ ...S.btnGhost, marginTop: '12px', fontSize: '12px' }}>
                  Limpiar completados
                </button>
              )}
            </div>
          </div>
        )}

        {/* ============ TABLERO ============ */}
        {tab === 'tablero' && (
          <div>
            <div style={S.card}>
              <p style={{ ...S.label, marginBottom: '12px' }}>Nueva nota</p>
              <select value={tableroFamilia} onChange={e => setTableroFamilia(e.target.value)} style={{ ...S.input, marginBottom: '8px' }}>
                {FAMILIAS.map(f => <option key={f}>{f}</option>)}
              </select>
              <input placeholder="Título" value={tableroTitulo} onChange={e => setTableroTitulo(e.target.value)} style={{ ...S.input, marginBottom: '8px' }} />
              <textarea
                placeholder="Escribe la nota aquí..."
                value={tableroContenido} onChange={e => setTableroContenido(e.target.value)}
                rows={3}
                style={{ ...S.input, resize: 'vertical', marginBottom: '10px' }}
              />
              <button onClick={addTablero} disabled={tableroLoading} style={S.btn()}>
                {tableroLoading ? 'Publicando...' : '+ Publicar nota'}
              </button>
            </div>

            <p style={{ ...S.label, marginBottom: '10px' }}>Notas publicadas</p>
            {tableroList.length === 0 && <p style={{ color: C.hint, fontSize: '14px', textAlign: 'center', padding: '2rem 0' }}>No hay notas aún.</p>}
            {tableroList.map(n => (
              <div key={n.id} style={{ ...S.card, marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={S.tag(n.familia)}>{n.familia}</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: C.text }}>{n.titulo}</span>
                  </div>
                  <button onClick={() => deleteTablero(n.id)} style={{ background: 'none', border: 'none', color: C.hint, cursor: 'pointer', fontSize: '16px' }}>×</button>
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
