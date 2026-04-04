import { createBackendSupabaseClient } from '../../lib/supabaseClient'
import type {
  CreatePresupuestoPayload,
  DomainIdentifier,
  PresupuestoRecord,
  UpdatePresupuestoPayload
} from '../../shared/types/domain'
import type { ServiceResult } from '../../shared/types/http'
import {
  validateCreatePresupuesto,
  validatePresupuestoId,
  validateUpdatePresupuesto
} from './presupuesto.schema'

const TABLE_NAME = 'presupuestos'

function getSupabaseClient() {
  return createBackendSupabaseClient()
}

/**
 * Detecta si dos rangos de fechas se superponen. 
 * Se considera que un rango con fecha_fin null se extiende indefinidamente.
 */
function datesOverlap(
  start1: string,
  end1: string | null,
  start2: string,
  end2: string | null
): boolean {
  // 2 rangos se superponen si el inicio de uno está 
  // antes del fin del otro y viceversa
  const end1IsAfterStart2 = !end1 || end1 >= start2
  const end2IsAfterStart1 = !end2 || end2 >= start1
  return end1IsAfterStart2 && end2IsAfterStart1
}

/**
 * Verifica si el rango de fechas dado se superpone con otros presupuestos del mismo usuario,
 *  excluyendo un presupuesto específico (usado para actualizaciones).
 */
async function checkOverlapExclusive(
  userId: string,
  fechaInicio: string,
  fechaFin: string | null,
  excludeId?: string
): Promise<PresupuestoRecord[]> {
  const supabase = getSupabaseClient()
  let query = supabase.from(TABLE_NAME).select('*').eq('user_id', userId)

  const { data, error } = await query

  if (error) {
    return []
  }

  if (!data) {
    return []
  }

  const overlapping = (data as PresupuestoRecord[]).filter((existing) => {
    // Excluyendo el presupuesto actual en caso de actualización
    if (excludeId && existing.id === excludeId) {
      return false
    }

    return datesOverlap(fechaInicio, fechaFin, existing.fecha_inicio, existing.fecha_fin)
  })

  return overlapping
}

export async function createPresupuesto(
  userId: string,
  payload: unknown
): Promise<ServiceResult<PresupuestoRecord>> {
  // Validar payload
  const validation = validateCreatePresupuesto(payload)
  if (!validation.success) {
    return { ok: false, message: validation.errors.join(' ') }
  }

  const { nombre, monto_limite, fecha_inicio, fecha_fin } = validation.data

  // Validar solapamiento
  const overlapping = await checkOverlapExclusive(userId, fecha_inicio, fecha_fin || null)
  if (overlapping.length > 0) {
    return {
      ok: false,
      message: `Ya existe un presupuesto que se superpone con estas fechas. Rango: ${overlapping[0].fecha_inicio} a ${overlapping[0].fecha_fin || 'indefinido'}`
    }
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([
        {
          user_id: userId,
          nombre,
          monto_limite,
          fecha_inicio,
          fecha_fin: fecha_fin || null,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('[Presupuesto Create Error]', error)
      return { ok: false, message: error.message || 'No se pudo crear el presupuesto.' }
    }

    return { ok: true, data: data as PresupuestoRecord, message: 'Presupuesto creado exitosamente.' }
  } catch (err) {
    console.error('[Presupuesto Create Exception]', err)
    const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
    return { ok: false, message: `Error inesperado: ${errorMsg}` }
  }
}

export async function getPresupuestosByUser(userId: string): Promise<ServiceResult<PresupuestoRecord[]>> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .order('fecha_inicio', { ascending: false })

    if (error) {
      return { ok: false, message: error.message || 'No se pudo obtener los presupuestos.' }
    }

    return { ok: true, data: (data as PresupuestoRecord[]) || [] }
  } catch (err) {
    return { ok: false, message: 'Error inesperado al obtener los presupuestos.' }
  }
}

export async function getPresupuestoById(
  userId: string,
  id: DomainIdentifier
): Promise<ServiceResult<PresupuestoRecord | null>> {
  const idValidation = validatePresupuestoId(id)
  if (!idValidation.success) {
    return { ok: false, message: idValidation.errors.join(' ') }
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      return { ok: false, message: error.message || 'No se pudo obtener el presupuesto.' }
    }

    return { ok: true, data: data as PresupuestoRecord | null }
  } catch (err) {
    return { ok: false, message: 'Error inesperado al obtener el presupuesto.' }
  }
}

export async function updatePresupuesto(
  userId: string,
  id: DomainIdentifier,
  payload: unknown
): Promise<ServiceResult<PresupuestoRecord | null>> {
  // Validar ID
  const idValidation = validatePresupuestoId(id)
  if (!idValidation.success) {
    return { ok: false, message: idValidation.errors.join(' ') }
  }

  const validation = validateUpdatePresupuesto(payload)
  if (!validation.success) {
    return { ok: false, message: validation.errors.join(' ') }
  }

  // traer el presupuesto existente para comparar fechas y validar superposición si se están actualizando las fechas
  const existing = await getPresupuestoById(userId, id)
  if (!existing.ok || !existing.data) {
    return { ok: false, message: 'El presupuesto no existe o no tienes acceso.' }
  }

  const { fecha_inicio, fecha_fin } = validation.data
  const newFechaInicio = fecha_inicio !== undefined ? fecha_inicio : existing.data.fecha_inicio
  const newFechaFin = fecha_fin !== undefined ? fecha_fin : existing.data.fecha_fin

  // se verifica que el nuevo rango de fechas no se superponga con otros presupuestos del usuario, excluyendo el presupuesto actual
  const overlapping = await checkOverlapExclusive(userId, newFechaInicio, newFechaFin, String(id))
  if (overlapping.length > 0) {
    return {
      ok: false,
      message: `Ya existe otro presupuesto que se superpone con estas fechas. Rango: ${overlapping[0].fecha_inicio} a ${overlapping[0].fecha_fin || 'indefinido'}`
    }
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(validation.data)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      return { ok: false, message: error.message || 'No se pudo actualizar el presupuesto.' }
    }

    return { ok: true, data: data as PresupuestoRecord | null, message: 'Presupuesto actualizado exitosamente.' }
  } catch (err) {
    return { ok: false, message: 'Error inesperado al actualizar el presupuesto.' }
  }
}

export async function deletePresupuesto(
  userId: string,
  id: DomainIdentifier
): Promise<ServiceResult<{ deleted: boolean }>> {
  const idValidation = validatePresupuestoId(id)
  if (!idValidation.success) {
    return { ok: false, message: idValidation.errors.join(' ') }
  }

  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id).eq('user_id', userId)

    if (error) {
      return { ok: false, message: error.message || 'No se pudo eliminar el presupuesto.' }
    }

    return { ok: true, data: { deleted: true }, message: 'Presupuesto eliminado exitosamente.' }
  } catch (err) {
    return { ok: false, message: 'Error inesperado al eliminar el presupuesto.' }
  }
}

export interface PresupuestoServiceContract {
  list: () => Promise<ServiceResult<PresupuestoRecord[]>>
  getById: (id: DomainIdentifier) => Promise<ServiceResult<PresupuestoRecord | null>>
  create: (payload: CreatePresupuestoPayload) => Promise<ServiceResult<PresupuestoRecord>>
  update: (id: DomainIdentifier, payload: UpdatePresupuestoPayload) => Promise<ServiceResult<PresupuestoRecord | null>>
  remove: (id: DomainIdentifier) => Promise<ServiceResult<{ deleted: boolean }>>
}