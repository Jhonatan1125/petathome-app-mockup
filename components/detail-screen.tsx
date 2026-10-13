'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Frame, Status } from '@/components/app-shell'
import {
  age,
  citas,
  formatCOP,
  mascotas,
  planes,
  personal,
  pet,
  service,
  servicios,
  user
} from '@/lib/mock-data'

export function DetailScreen({
  role,
  title,
  eyebrow,
  children,
  back = '/cliente'
}: {
  role: 'cliente' | 'admin' | 'prestador'
  title: string
  eyebrow?: string
  children: React.ReactNode
  back?: string
}) {
  return (
    <Frame role={role} title={title}>
      <Link href={back} className="text-sm font-bold text-[#0F9D8A] hover:underline inline-flex items-center gap-1">
        ← Volver
      </Link>
      {eyebrow && <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-700">{eyebrow}</p>}
      <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">{title}</h2>
      <div className="mt-6 text-slate-900">{children}</div>
    </Frame>
  )
}

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-extrabold text-slate-950 text-lg border-b border-slate-100 pb-3">{title}</h3>
      <div className="mt-4 text-slate-900 font-normal">{children}</div>
    </section>
  )
}

const Field = ({ label, children }: { label: string; children?: React.ReactNode }) => (
  <label className="text-sm font-bold text-slate-900 block">
    {label}
    {children || (
      <input
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-950 placeholder:text-slate-500 shadow-xs focus:border-teal-600 focus:outline-none"
        placeholder={label}
      />
    )}
  </label>
)

export function VisualForm({
  title,
  submit,
  back = '/cliente'
}: {
  title: string
  submit: string
  back?: string
}) {
  return (
    <DetailScreen role="cliente" title={title} back={back}>
      <Panel title="Información requerida">
        <div className="grid grid-cols-2 gap-5">
          {['Nombre', 'Especie', 'Raza', 'Sexo', 'Fecha de nacimiento', 'Observaciones'].map((x) => (
            <Field label={x} key={x} />
          ))}
        </div>
        <Link
          href={back}
          className="mt-8 inline-block rounded-xl bg-[#0F9D8A] px-6 py-3 font-bold text-white shadow-sm hover:bg-[#0c8272] transition-colors"
        >
          {submit}
        </Link>
      </Panel>
    </DetailScreen>
  )
}

export function PetDetail({ id }: { id: string }) {
  const p = pet(id) || mascotas[0]
  const [activeTab, setActiveTab] = useState(0)

  return (
    <DetailScreen role="cliente" title={p.nombre} eyebrow={`${p.especie} · ${p.raza}`}>
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <Panel title="Identificación">
          <div className="grid size-36 place-items-center rounded-2xl bg-teal-100 text-teal-900 text-5xl font-black mx-auto">
            {p.nombre.charAt(0)}
          </div>
          <div className="mt-4 space-y-1 text-center">
            <p className="text-base font-bold text-slate-950">{p.nombre}</p>
            <p className="text-sm font-medium text-slate-700">
              {p.especie} · {p.raza || 'Mestizo'}
            </p>
            <p className="text-xs font-semibold text-slate-600">
              {p.sexo} · {age(p.fecha_nacimiento)} años cumplidos
            </p>
          </div>
          {p.observaciones && (
            <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs font-medium text-amber-900 border border-amber-200">
              <b>Nota clínica:</b> {p.observaciones}
            </div>
          )}
        </Panel>

        <div className="flex flex-col gap-6">
          <div className="flex gap-2 border-b border-slate-200 pb-2">
            {['Información y citas', 'Historial clínico', 'Planes vinculados'].map((x, i) => (
              <button
                key={x}
                onClick={() => setActiveTab(i)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  activeTab === i
                    ? 'bg-[#0F9D8A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {x}
              </button>
            ))}
          </div>

          <Panel title="Atenciones y citas registradas">
            <div className="divide-y divide-slate-100">
              {citas
                .filter((c) => c.id_mascota === p.id_mascota)
                .map((c) => (
                  <div className="flex items-center justify-between py-3.5" key={c.id_cita}>
                    <div>
                      <p className="font-bold text-slate-900">{service(c.id_servicio)?.nombre}</p>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">
                        Fecha: {c.fecha} · Hora: {c.hora} · Sede a domicilio: {c.direccion}
                      </p>
                    </div>
                    <Status tone="teal">{c.estado}</Status>
                  </div>
                ))}
            </div>
          </Panel>
        </div>
      </div>
    </DetailScreen>
  )
}

function Timeline({ state }: { state: string }) {
  const steps = ['PROGRAMADA', 'CONFIRMADA', 'EN_PROCESO', 'ATENDIDA']
  return (
    <div className="flex flex-col gap-5 border-l-3 border-teal-200 pl-5">
      {steps.map((x, i) => {
        const isPast = steps.indexOf(state) >= i
        return (
          <div key={x} className={isPast ? 'text-teal-900' : 'text-slate-500'}>
            <b className="text-sm font-black block">{x.replace('_', ' ')}</b>
            <p className="text-xs font-semibold">{isPast ? '✓ Registrado en el sistema' : '○ Pendiente'}</p>
          </div>
        )
      })}
    </div>
  )
}

function AppointmentActions() {
  const [openReprogramar, setOpenReprogramar] = useState(false)
  const [openCancelar, setOpenCancelar] = useState(false)

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={() => setOpenReprogramar(true)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-xs"
        >
          Reprogramar
        </button>
        <button
          onClick={() => setOpenCancelar(true)}
          className="rounded-xl bg-red-100 border border-red-200 px-4 py-2 text-xs font-bold text-red-900 hover:bg-red-200"
        >
          Cancelar cita
        </button>
      </div>

      {openReprogramar && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-6 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-slate-950 text-lg">Reprogramar fecha y hora</h3>
            <div className="mt-4 space-y-4">
              <Field label="Nueva fecha">
                <input
                  type="date"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 font-semibold text-slate-900"
                  defaultValue="2026-10-18"
                />
              </Field>
              <Field label="Nueva franja horaria">
                <select className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 font-semibold text-slate-900">
                  <option>09:00 a. m.</option>
                  <option>11:00 a. m.</option>
                  <option>02:30 p. m.</option>
                  <option>04:00 p. m.</option>
                </select>
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpenReprogramar(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cerrar
              </button>
              <button
                onClick={() => setOpenReprogramar(false)}
                className="rounded-xl bg-[#0F9D8A] px-5 py-2 text-xs font-bold text-white hover:bg-[#0c8272]"
              >
                Confirmar cambio
              </button>
            </div>
          </div>
        </div>
      )}

      {openCancelar && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-6 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-slate-950 text-lg">Cancelar cita de servicio</h3>
            <p className="mt-1 text-xs text-slate-600 font-medium">
              Por política institucional, las cancelaciones deben realizarse con al menos 24 horas de antelación.
            </p>
            <div className="mt-4">
              <Field label="Motivo de cancelación">
                <select className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 font-semibold text-slate-900">
                  <option>Imprevisto de fuerza mayor</option>
                  <option>Mascota atendida en clínica de urgencia</option>
                  <option>Incompatibilidad de horario</option>
                  <option>Otro motivo</option>
                </select>
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpenCancelar(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Volver
              </button>
              <button
                onClick={() => setOpenCancelar(false)}
                className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Confirmar cancelación
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function AppointmentDetail({
  id,
  role = 'cliente'
}: {
  id: string
  role?: 'cliente' | 'admin' | 'prestador'
}) {
  const c = citas.find((x) => x.id_cita === id) || citas[0]
  const p = pet(c.id_mascota) || mascotas[0]
  const s = service(c.id_servicio) || servicios[0]
  const [assignedSuccess, setAssignedSuccess] = useState(false)

  return (
    <DetailScreen role={role} title={`Cita ${c.id_cita.toUpperCase()}`} back={role === 'admin' ? '/admin/citas' : '/cliente/citas'}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <Panel title="Detalle de la solicitud">
            <div className="space-y-2 text-sm">
              <p className="text-slate-800">
                Mascota beneficiaria: <b className="text-slate-950 font-bold">{p.nombre} ({p.especie})</b>
              </p>
              <p className="text-slate-800">
                Servicio a prestar: <b className="text-slate-950 font-bold">{s.nombre}</b>
              </p>
              <p className="text-slate-800">
                Fecha y hora pactada: <b className="text-slate-950 font-bold">{c.fecha} · {c.hora}</b>
              </p>
              <p className="text-slate-800">
                Dirección de atención: <b className="text-slate-950 font-bold">{c.direccion}</b>
              </p>
              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Estado actual:</span>
                <Status tone="teal">{c.estado}</Status>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100">
              <AppointmentActions />
            </div>
          </Panel>

          <Panel title="Personal responsable asignado">
            {c.id_personal ? (
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-full bg-teal-100 text-teal-900 font-bold text-sm">
                  AL
                </div>
                <div>
                  <p className="font-extrabold text-slate-950">Dra. Ana López</p>
                  <p className="text-xs font-semibold text-slate-600">Veterinaria profesional · Salud y Vacunación</p>
                  <p className="text-xs font-bold text-emerald-800 mt-1">✓ Confirmada para este servicio</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-amber-50 p-4 border border-amber-200">
                <p className="font-bold text-amber-900 text-sm">Sin profesional asignado</p>
                <p className="text-xs text-amber-800 font-medium mt-1">
                  El administrador debe asignar un prestador con disponibilidad en este horario.
                </p>
              </div>
            )}
          </Panel>
        </div>

        <Panel title="Trazabilidad del estado (Línea de tiempo)">
          <Timeline state={c.estado} />
        </Panel>
      </div>

      {role === 'admin' && (
        <div className="mt-6">
          <Panel title="Asignación de personal operativo (RF-14)">
            <p className="text-xs font-medium text-slate-600 mb-4">
              Solo se muestran profesionales cuya especialidad coincide con el tipo de servicio y cuentan con disponibilidad:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Dra. Ana López', role: 'Veterinaria · Salud', available: true },
                { name: 'Julián Pérez', role: 'Auxiliar veterinario · Vacunación', available: false },
                { name: 'Laura Gómez', role: 'Estilista canino · Estética', available: true }
              ].map((prov, i) => (
                <div
                  key={prov.name}
                  className={`rounded-2xl border p-4 flex flex-col justify-between ${
                    prov.available ? 'border-slate-300 bg-white' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div>
                    <b className="text-sm font-black text-slate-950 block">{prov.name}</b>
                    <p className="text-xs font-semibold text-slate-600 mt-1">{prov.role}</p>
                    <p
                      className={`text-xs font-bold mt-2 ${
                        prov.available ? 'text-emerald-800' : 'text-slate-500'
                      }`}
                    >
                      {prov.available ? '● Franja disponible' : '✕ No disponible en esta hora'}
                    </p>
                  </div>
                  <button
                    disabled={!prov.available}
                    onClick={() => setAssignedSuccess(true)}
                    className="mt-4 rounded-xl bg-[#0F9D8A] px-4 py-2 text-xs font-bold text-white disabled:bg-slate-200 disabled:text-slate-400 hover:bg-[#0c8272] transition-colors"
                  >
                    Asignar a esta cita
                  </button>
                </div>
              ))}
            </div>
            {assignedSuccess && (
              <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-900">
                ✓ Personal asignado satisfactoriamente. Se generó notificación automática al cliente y prestador.
              </div>
            )}
          </Panel>
        </div>
      )}
    </DetailScreen>
  )
}

export function PlanDetail({ id }: { id: string }) {
  const p = planes.find((x) => x.id_plan === id) || planes[0]
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  return (
    <DetailScreen role="cliente" title={p.nombre} back="/cliente/planes">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Panel title="Cobertura y servicios incluidos">
          <p className="text-sm font-medium text-slate-700 leading-relaxed">{p.descripcion}</p>
          <div className="mt-5 space-y-2.5">
            {p.servicios.map((x) => (
              <div
                key={x.id_servicio}
                className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm font-bold text-slate-900"
              >
                <span>{service(x.id_servicio)?.nombre}</span>
                <span className="rounded-lg bg-teal-100 text-teal-900 px-2.5 py-1 text-xs">
                  {x.cantidad_incluida} atenciones incluidas
                </span>
              </div>
            ))}
          </div>
          {p.condiciones && (
            <p className="mt-4 text-xs font-semibold text-slate-500 italic">Condiciones: {p.condiciones}</p>
          )}
        </Panel>

        <Panel title="Contratación del plan">
          <div className="rounded-2xl bg-teal-50 border border-teal-200 p-6 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Tarifa trimestral</span>
            <p className="text-4xl font-black text-teal-950 mt-1">{formatCOP(p.valor)}</p>
            <p className="text-xs font-semibold text-slate-700 mt-2">Vigencia por {p.duracion_dias} días corridos</p>
            <button
              onClick={() => setOpen(true)}
              className="mt-6 w-full rounded-xl bg-[#0F9D8A] px-5 py-3.5 font-bold text-white shadow-sm hover:bg-[#0c8272] transition-colors"
            >
              Contratar plan ahora
            </button>
          </div>
        </Panel>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-6 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-slate-950 text-lg">Confirmar contratación</h3>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              Selecciona a cuál de tus mascotas deseas vincularle el plan:
            </p>
            <div className="mt-4">
              <Field label="Mascota beneficiaria">
                <select className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 font-bold text-slate-900">
                  <option>Luna (Golden Retriever)</option>
                  <option>Max (Beagle)</option>
                  <option>Nala (Gato Criollo)</option>
                </select>
              </Field>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs space-y-1 font-semibold text-slate-800">
              <p>Plan seleccionado: <b className="text-slate-950">{p.nombre}</b></p>
              <p>Valor total: <b className="text-teal-900">{formatCOP(p.valor)}</b></p>
              <p className="text-slate-600 font-medium">Modalidad: Facturación de servicios a domicilio</p>
              <p className="text-[#F59E0B] font-bold">Pago: A convenir directamente con la empresa</p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setOpen(false)
                  setDone(true)
                }}
                className="rounded-xl bg-[#0F9D8A] px-5 py-2 text-xs font-bold text-white hover:bg-[#0c8272]"
              >
                Confirmar plan
              </button>
            </div>
          </div>
        </div>
      )}

      {done && (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-emerald-900 text-white px-6 py-4 font-bold shadow-2xl flex items-center gap-3">
          <span>✓ Plan contratado exitosamente para tu mascota.</span>
          <button onClick={() => setDone(false)} className="text-xs underline text-emerald-200">
            Cerrar
          </button>
        </div>
      )}
    </DetailScreen>
  )
}

export function AdminTable({ kind }: { kind: 'planes' | 'servicios' | 'personal' }) {
  if (kind === 'personal') {
    return (
      <DetailScreen role="admin" title="Personal responsable" back="/admin">
        <Panel title="Equipo profesional en servicio">
          <Link
            href="/admin/personal/nuevo"
            className="mb-4 inline-block rounded-xl bg-[#0F9D8A] px-4 py-2 font-bold text-white shadow-xs hover:bg-[#0c8272]"
          >
            Registrar personal
          </Link>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 font-bold text-slate-900 text-xs uppercase">
                <tr>
                  {['Nombre', 'Cargo', 'Especialidad', 'Estado', 'Citas asignadas'].map((x) => (
                    <th className="p-3" key={x}>
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {personal.map((r, i) => (
                  <tr className="hover:bg-slate-50 font-medium text-slate-900" key={r.id_personal}>
                    <td className="p-3 font-bold">
                      <Link href={`/admin/personal/${r.id_personal}`} className="text-teal-900 hover:underline">
                        {user(r.usuario_id)?.nombre || 'Profesional'}
                      </Link>
                    </td>
                    <td className="p-3">{r.cargo}</td>
                    <td className="p-3">{r.especialidad}</td>
                    <td className="p-3">
                      <Status tone="green">{r.estado_laboral}</Status>
                    </td>
                    <td className="p-3 font-bold">{i + 1} servicios</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </DetailScreen>
    )
  }

  const rows = kind === 'planes' ? planes : servicios
  return (
    <DetailScreen role="admin" title={kind === 'planes' ? 'Planes' : 'Servicios'} back="/admin">
      <Panel title="Registros comerciales activos">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 font-bold text-slate-900 text-xs uppercase">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(rows as any[]).map((r) => (
                <tr className="hover:bg-slate-50 font-medium text-slate-900" key={r.id_plan || r.id_servicio}>
                  <td className="p-4 font-bold">{r.nombre}</td>
                  <td className="p-4 text-slate-700">{r.descripcion}</td>
                  <td className="p-4">
                    <Status tone="green">{r.estado}</Status>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </DetailScreen>
  )
}

export function SimpleCreate({
  title,
  role = 'admin',
  back = '/admin',
  fields = ['Nombre', 'Descripción', 'Especialidad', 'Estado']
}: {
  title: string
  role?: 'admin' | 'prestador'
  back?: string
  fields?: string[]
}) {
  return (
    <DetailScreen role={role} title={title} back={back}>
      <Panel title="Datos del nuevo registro">
        <div className="grid grid-cols-2 gap-4">
          {fields.map((x) => (
            <Field label={x} key={x} />
          ))}
        </div>
        <Link
          href={back}
          className="mt-6 inline-block rounded-xl bg-[#0F9D8A] px-6 py-3 font-bold text-white hover:bg-[#0c8272]"
        >
          Guardar registro
        </Link>
      </Panel>
    </DetailScreen>
  )
}

export function ProviderTreatment({ id }: { id: string }) {
  const c = citas.find((x) => x.id_cita === id) || citas[0]
  const p = pet(c.id_mascota) || mascotas[0]

  return (
    <DetailScreen role="prestador" title="Registrar tratamiento realizado" back={`/prestador/citas/${id}`}>
      <Panel title="Resumen de la cita y paciente">
        <div className="flex items-center gap-4 text-sm font-semibold text-slate-900">
          <span>Paciente: <b className="text-slate-950 font-bold">{p.nombre} ({p.especie})</b></span>
          <span>·</span>
          <span>Servicio: <b className="text-slate-950 font-bold">{service(c.id_servicio)?.nombre}</b></span>
          <span>·</span>
          <span>Hora: <b className="text-slate-950 font-bold">{c.hora}</b></span>
        </div>
      </Panel>

      <div className="mt-6">
        <Panel title="Ficha del tratamiento (RF-11 / Requisito obligatorio 4)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Tipo de servicio o procedimiento">
              <select className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 font-bold text-slate-950">
                <option>Consulta médica básica</option>
                <option>Vacunación anual y desparasitación</option>
                <option>Baño, secado y estética profiláctica</option>
                <option>Sesión de entrenamiento de conducta</option>
                <option>Acompañamiento y servicio funerario</option>
              </select>
            </Field>

            <Field label="Profesional responsable">
              <input
                readOnly
                value="Dra. Ana López (Veterinaria)"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-100 p-3 font-bold text-slate-900"
              />
            </Field>

            <Field label="Descripción del tratamiento realizado">
              <textarea
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 font-semibold text-slate-950"
                placeholder="Detalle los hallazgos clínicos o procedimientos efectuados..."
                defaultValue="Se realiza examen general sin alteraciones en signos vitales. Se completa vacunación anual antirrábica."
              />
            </Field>

            <Field label="Recomendaciones y observaciones para el propietario">
              <textarea
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 font-semibold text-slate-950"
                placeholder="Observaciones de cuidado posterior..."
                defaultValue="Mantener en reposo por 12 horas. Próximo control preventivo en 6 meses."
              />
            </Field>
          </div>

          <Link
            href={`/prestador/citas/${id}`}
            className="mt-8 inline-block rounded-xl bg-[#0F9D8A] px-6 py-3 font-bold text-white shadow-sm hover:bg-[#0c8272]"
          >
            Guardar tratamiento y finalizar atención
          </Link>
        </Panel>
      </div>
    </DetailScreen>
  )
}

export function NoPermission() {
  return (
    <DetailScreen role="cliente" title="Sin permisos">
      <Panel title="Acceso restringido (RNF-03 / RNF-05)">
        <p className="text-slate-800 font-semibold text-sm">
          No tienes los permisos asignados para visualizar este módulo o la ficha clínica de esta mascota.
        </p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-xl bg-[#0F9D8A] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0c8272]"
        >
          Volver al inicio
        </Link>
      </Panel>
    </DetailScreen>
  )
}

export function NotFoundScreen() {
  return (
    <DetailScreen role="cliente" title="Página no encontrada">
      <Panel title="Error 404">
        <p className="text-slate-800 font-semibold text-sm">La ruta solicitada no se encuentra disponible.</p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-xl bg-[#0F9D8A] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0c8272]"
        >
          Ir al inicio
        </Link>
      </Panel>
    </DetailScreen>
  )
}

export function AppointmentWizard() {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState('m1')

  return (
    <DetailScreen role="cliente" title="Programar una cita" back="/cliente/citas">
      <div className="mb-6 flex gap-3">
        {['Mascota', 'Plan o servicio', 'Fecha y hora', 'Resumen y confirmación'].map((x, i) => (
          <div
            className={`flex-1 rounded-xl p-3 text-center text-sm font-bold transition-all ${
              step === i + 1
                ? 'bg-[#0F9D8A] text-white shadow-xs'
                : 'border border-slate-300 bg-white text-slate-800'
            }`}
            key={x}
          >
            {i + 1}. {x}
          </div>
        ))}
      </div>

      <Panel
        title={
          [
            'Paso 1: Elige la mascota que recibirá la atención',
            'Paso 2: Elige si usas un plan contratado o servicio individual',
            'Paso 3: Selecciona fecha y franja horaria disponible',
            'Paso 4: Confirma los datos de la cita'
          ][step - 1]
        }
      >
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mascotas.slice(0, 3).map((p) => (
              <button
                onClick={() => setSelected(p.id_mascota)}
                className={`rounded-2xl border p-5 text-left transition-all ${
                  selected === p.id_mascota
                    ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-500'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
                key={p.id_mascota}
              >
                <b className="text-base font-extrabold text-slate-950 block">{p.nombre}</b>
                <span className="block text-xs font-semibold text-slate-600 mt-1">
                  {p.especie} · {p.raza}
                </span>
                <span className="mt-3 inline-block rounded-md bg-teal-100 text-teal-900 text-[11px] font-bold px-2 py-0.5">
                  {selected === p.id_mascota ? '✓ Seleccionada' : 'Seleccionar'}
                </span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-3">
            {[
              ...planes.map((p) => `${p.nombre} (Plan activo · 2 sesiones restantes incluidas)`),
              ...servicios.slice(0, 4).map((s) => `${s.nombre} · Tarifa individual: ${formatCOP(s.valor_individual)}`)
            ].map((x, i) => (
              <button
                className={`rounded-xl border p-4 text-left font-bold text-sm transition-all ${
                  i === 0
                    ? 'border-teal-600 bg-teal-50 text-teal-950 ring-1 ring-teal-500'
                    : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                }`}
                key={x}
              >
                {x}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-300 p-4 bg-white">
              <p className="font-bold text-slate-950 mb-3 text-sm">Octubre 2026</p>
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-slate-800">
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                  <span className="text-slate-500 py-1" key={i}>
                    {d}
                  </span>
                ))}
                {Array.from({ length: 30 }, (_, i) => (
                  <button
                    className={`rounded-lg p-2 font-bold transition-all ${
                      i === 11 ? 'bg-[#0F9D8A] text-white shadow-xs' : 'text-slate-900 hover:bg-slate-100'
                    }`}
                    key={i}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-950 text-sm mb-3">Horarios disponibles para tu sector</p>
              <div className="grid grid-cols-3 gap-2.5">
                {['09:00', '10:30', '12:00', '14:00', '15:00', '17:00'].map((x, i) => (
                  <button
                    className={`rounded-xl border p-3 text-center text-xs font-extrabold ${
                      i === 4
                        ? 'border-teal-600 bg-teal-50 text-teal-950 ring-1 ring-teal-500'
                        : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                    }`}
                    key={x}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="rounded-2xl bg-slate-100 border border-slate-300 p-5 text-sm space-y-2 text-slate-900 font-semibold">
            <p>Mascota: <b className="text-slate-950">{pet(selected)?.nombre}</b></p>
            <p>Servicio: <b className="text-slate-950">Consulta básica de salud a domicilio</b></p>
            <p>Fecha y hora: <b className="text-slate-950">12 oct 2026 · 15:00</b></p>
            <p>Dirección registrada: <b className="text-slate-950">Cra 43A #10-20, Medellín (El Poblado)</b></p>
            <p>Prestador inicial: <b className="text-teal-900">Por asignar según turno operativo</b></p>
            <p className="text-amber-800 font-bold pt-1">Pago: A convenir con la empresa (sin pasarela de pago)</p>
          </div>
        )}

        <div className="mt-8 flex justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100"
            >
              Atrás
            </button>
          ) : (
            <span />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="rounded-xl bg-[#0F9D8A] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0c8272] transition-colors"
            >
              Siguiente paso →
            </button>
          ) : (
            <Link
              href="/cliente/citas/confirmacion"
              className="rounded-xl bg-[#0F9D8A] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0c8272] shadow-sm transition-colors"
            >
              Confirmar cita
            </Link>
          )}
        </div>
      </Panel>
    </DetailScreen>
  )
}
