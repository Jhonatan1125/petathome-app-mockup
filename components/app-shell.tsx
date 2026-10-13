'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, CalendarDays, ChevronRight, ClipboardList, Home, PawPrint, Stethoscope, Users } from 'lucide-react';
import { Role } from '@/lib/mock-data'

const roles = {
  cliente: { label: 'Cliente', name: 'María Fernanda', initials: 'MF', home: '/cliente' },
  admin: { label: 'Administrador', name: 'Carlos Gómez', initials: 'CG', home: '/admin' },
  prestador: { label: 'Personal prestador', name: 'Dra. Ana López', initials: 'AL', home: '/prestador' }
} as const

const nav = {
  cliente: [
    ['Resumen', '/cliente', Home],
    ['Mis mascotas', '/cliente/mascotas', PawPrint],
    ['Planes y servicios', '/cliente/planes', ClipboardList],
    ['Mis citas', '/cliente/citas', CalendarDays],
    ['Mi perfil', '/cliente/perfil', Users]
  ],
  admin: [
    ['Resumen', '/admin', Home],
    ['Planes', '/admin/planes', ClipboardList],
    ['Servicios', '/admin/servicios', Stethoscope],
    ['Citas', '/admin/citas', CalendarDays],
    ['Personal', '/admin/personal', Users]
  ],
  prestador: [
    ['Agenda de hoy', '/prestador', Home],
    ['Mi agenda', '/prestador/agenda', CalendarDays],
    ['Mis pacientes', '/prestador/mascotas/m1', PawPrint],
    ['Tratamientos', '/prestador/tratamientos/nuevo', ClipboardList]
  ]
} as const

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid size-10 place-items-center rounded-xl bg-[#0F9D8A] text-white shadow-sm">
        <PawPrint className="size-5" />
      </span>
      <b className="text-xl tracking-tight text-slate-950 font-extrabold">
        PETATHOME<span className="text-[#0F9D8A]">.</span>
      </b>
    </Link>
  )
}

export function Status({ children, tone = 'blue' }: { children: React.ReactNode; tone?: string }) {
  const c = {
    blue: 'bg-blue-100 text-blue-900 border border-blue-200',
    teal: 'bg-teal-100 text-teal-900 border border-teal-200',
    amber: 'bg-amber-100 text-amber-900 border border-amber-200',
    green: 'bg-emerald-100 text-emerald-900 border border-emerald-200',
    red: 'bg-red-100 text-red-900 border border-red-200'
  }
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${c[tone as keyof typeof c] || c.blue}`}>
      {children}
    </span>
  )
}

export function Frame({ role, title, children }: { role: Role; title: string; children: React.ReactNode }) {
  const path = usePathname()
  return (
    <div className="min-h-screen bg-[#f8fafb] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-[252px] flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-sm">
        <Brand />
        <div className="mt-8 flex items-center gap-3 rounded-2xl bg-slate-100 p-3 border border-slate-200">
          <div className="grid size-10 place-items-center rounded-full bg-teal-100 text-sm font-bold text-teal-900">
            {roles[role].initials}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{roles[role].name}</p>
            <p className="text-xs font-medium text-slate-600">{roles[role].label}</p>
          </div>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-1.5">
          {nav[role].map(([label, href, Icon]) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                path === href
                  ? 'bg-teal-50 text-[#0F9D8A] font-bold border border-teal-100'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/notificaciones"
          className="mb-3 flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
        >
          <Bell className="size-4" />
          Notificaciones
          <sup className="ml-auto grid size-5 place-items-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-800 border border-orange-200">
            3
          </sup>
        </Link>
        <Link
          href="/login"
          className="border-t border-slate-200 px-3 pt-4 text-sm font-semibold text-slate-700 hover:text-red-700"
        >
          Cerrar sesión
        </Link>
      </aside>

      <main className="ml-[252px]">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-10 py-5 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600">PETATHOME App</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{title}</h1>
          </div>
          <Link
            href="/notificaciones"
            className="grid size-10 place-items-center rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 shadow-xs"
          >
            <Bell className="size-4" />
          </Link>
        </header>
        <div className="mx-auto max-w-[1180px] px-10 py-8 text-slate-900">{children}</div>
      </main>

      <div className="fixed bottom-6 right-6 z-30 w-64 rounded-2xl border border-slate-300 bg-white p-3.5 shadow-2xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">Vista demo (Roles)</p>
        <div className="flex flex-col gap-1">
          {Object.entries(roles).map(([key, v]) => (
            <Link
              key={key}
              href={v.home}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                role === key
                  ? 'bg-teal-50 text-[#0F9D8A] border border-teal-200'
                  : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              {v.label}
              <ChevronRight className="size-4 text-slate-600" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
