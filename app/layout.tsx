import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hogar compartido',
  description: 'Organización del hogar entre familias',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
