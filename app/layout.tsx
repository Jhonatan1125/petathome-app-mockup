import type { Metadata } from 'next'
import './globals.css'
import { StoreProvider } from '@/lib/store'

export const metadata: Metadata = {
  title: 'PETATHOME · Cuidado para mascotas',
  description: 'Servicios de bienestar para mascotas a domicilio en Medellín'
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="light" style={{ colorScheme: 'light' }}>
      <body className="bg-[#f8fafb] text-slate-900 antialiased min-h-screen">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
