'use server'

import { getCurrentUserAction } from '@/src/auth/autenticacion/auth.actions'
import type { DomainIdentifier, PresupuestoRecord } from '@/src/shared/types/domain'
import type { ServiceResult } from '@/src/shared/types/http'
import {
  createPresupuesto,
  deletePresupuesto,
  getPresupuestoById,
  getPresupuestosByUser,
  updatePresupuesto
} from './presupuesto.service'

interface CreatePresupuestoActionResult {
  ok: boolean
  presupuesto?: PresupuestoRecord
  message?: string
}

interface UpdatePresupuestoActionResult {
  ok: boolean
  presupuesto?: PresupuestoRecord | null
  message?: string
}

interface DeletePresupuestoActionResult {
  ok: boolean
  message?: string
}

export async function createPresupuestoAction(
  formData: FormData
): Promise<CreatePresupuestoActionResult> {
  const user = await getCurrentUserAction()
  if (!user) {
    return { ok: false, message: 'No autenticado.' }
  }

  const nombre = String(formData.get('nombre') || '').trim()
  const montoLimite = String(formData.get('monto_limite') || '').trim()
  const fechaInicio = String(formData.get('fecha_inicio') || '').trim()
  const fechaFin = String(formData.get('fecha_fin') || '').trim() || null

  const payload = {
    nombre,
    monto_limite: Number(montoLimite),
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin
  }

  const result = await createPresupuesto(user.id, payload)

  if (!result.ok) {
    return { ok: false, message: result.message }
  }

  return { ok: true, presupuesto: result.data, message: result.message }
}

export async function getPresupuestosAction(): Promise<ServiceResult<PresupuestoRecord[]>> {
  const user = await getCurrentUserAction()
  if (!user) {
    return { ok: false, message: 'No autenticado.' }
  }

  return getPresupuestosByUser(user.id)
}

export async function getPresupuestoAction(id: DomainIdentifier): Promise<ServiceResult<PresupuestoRecord | null>> {
  const user = await getCurrentUserAction()
  if (!user) {
    return { ok: false, message: 'No autenticado.' }
  }

  return getPresupuestoById(user.id, id)
}

export async function updatePresupuestoAction(
  id: DomainIdentifier,
  formData: FormData
): Promise<UpdatePresupuestoActionResult> {
  const user = await getCurrentUserAction()
  if (!user) {
    return { ok: false, message: 'No autenticado.' }
  }

  const nombre = String(formData.get('nombre') || '').trim() || undefined
  const montoLimite = String(formData.get('monto_limite') || '').trim()
  const fechaInicio = String(formData.get('fecha_inicio') || '').trim() || undefined
  const fechaFin = String(formData.get('fecha_fin') || '').trim() || undefined

  const payload: Record<string, unknown> = {}

  if (nombre) payload.nombre = nombre
  if (montoLimite) payload.monto_limite = Number(montoLimite)
  if (fechaInicio) payload.fecha_inicio = fechaInicio
  if (fechaFin !== undefined) payload.fecha_fin = fechaFin || null

  const result = await updatePresupuesto(user.id, id, payload)

  if (!result.ok) {
    return { ok: false, message: result.message }
  }

  return { ok: true, presupuesto: result.data, message: result.message }
}

export async function deletePresupuestoAction(id: DomainIdentifier): Promise<DeletePresupuestoActionResult> {
  const user = await getCurrentUserAction()
  if (!user) {
    return { ok: false, message: 'No autenticado.' }
  }

  const result = await deletePresupuesto(user.id, id)

  if (!result.ok) {
    return { ok: false, message: result.message }
  }

  return { ok: true, message: result.message }
}
