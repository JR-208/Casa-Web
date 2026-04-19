// Demo store - datos en memoria (se pierden al recargar)

export type AseoEntry = { id: string; familia: string; fecha: string; nota: string }
export type CompraItem = { id: string; familia: string; item: string; completado: boolean; created_at: string }
export type TableroPosta = { id: string; titulo: string; contenido: string; familia: string; created_at: string }

function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

// Initial demo data
const initialAseo: AseoEntry[] = [
  { id: generateId(), familia: 'Familia D', fecha: new Date().toISOString().split('T')[0], nota: 'Limpieza general' },
  { id: generateId(), familia: 'Familia S', fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], nota: 'Incluye banos' },
]

const initialCompras: CompraItem[] = [
  { id: generateId(), familia: 'Familia D', item: 'Leche', completado: false, created_at: new Date().toISOString() },
  { id: generateId(), familia: 'Familia D', item: 'Pan', completado: true, created_at: new Date().toISOString() },
  { id: generateId(), familia: 'Familia S', item: 'Huevos', completado: false, created_at: new Date().toISOString() },
]

const initialTablero: TableroPosta[] = [
  { id: generateId(), familia: 'Familia D', titulo: 'Reunion vecinos', contenido: 'Este sabado a las 3pm en el salon comunal', created_at: new Date().toISOString() },
]

export const demoStore = {
  aseo: [...initialAseo],
  compras: [...initialCompras],
  tablero: [...initialTablero],

  // ASEO
  getAseo: () => [...demoStore.aseo].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()),
  addAseo: (entry: Omit<AseoEntry, 'id'>) => {
    const newEntry = { ...entry, id: generateId() }
    demoStore.aseo.push(newEntry)
    return newEntry
  },
  deleteAseo: (id: string) => {
    demoStore.aseo = demoStore.aseo.filter(e => e.id !== id)
  },

  // COMPRAS
  getCompras: (familia: string) => demoStore.compras.filter(c => c.familia === familia),
  addCompra: (item: Omit<CompraItem, 'id' | 'created_at'>) => {
    const newItem = { ...item, id: generateId(), created_at: new Date().toISOString() }
    demoStore.compras.push(newItem)
    return newItem
  },
  toggleCompra: (id: string) => {
    const item = demoStore.compras.find(c => c.id === id)
    if (item) item.completado = !item.completado
  },
  deleteCompra: (id: string) => {
    demoStore.compras = demoStore.compras.filter(c => c.id !== id)
  },
  clearCompletadas: (familia: string) => {
    demoStore.compras = demoStore.compras.filter(c => !(c.familia === familia && c.completado))
  },

  // TABLERO
  getTablero: () => [...demoStore.tablero].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  addTablero: (post: Omit<TableroPosta, 'id' | 'created_at'>) => {
    const newPost = { ...post, id: generateId(), created_at: new Date().toISOString() }
    demoStore.tablero.push(newPost)
    return newPost
  },
  deleteTablero: (id: string) => {
    demoStore.tablero = demoStore.tablero.filter(p => p.id !== id)
  },
}
