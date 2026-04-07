import type { ServiceResult } from '@/src/shared/types/common'
import type { Cartera, CreateCarteraInput, UpdateCarteraInput } from './cartera.schema'
import * as carteraRepository from './cartera.repository'

export async function listar(userId: string): Promise<ServiceResult<Cartera[]>> {
  try {
    const data = await carteraRepository.findAll(userId)
    return { ok: true, data }
  } catch {
    return { ok: false, message: 'No se pudieron cargar las carteras' }
  }
}

export async function crear(
  userId: string,
  input: CreateCarteraInput
): Promise<ServiceResult<Cartera>> {
  try {
    const nombre = input.nombre.trim()
    if (!nombre) return { ok: false, message: 'El nombre es obligatorio' }

    const existente = await carteraRepository.findByNombre(userId, nombre)
    if (existente) return { ok: false, message: 'Ya tienes una cartera con ese nombre' }
    
    const data = await carteraRepository.insert(userId, {
      ...input,
      nombre,
      objetivo_cantidad: input.objetivo_cantidad ?? null  
    })
    return { ok: true, data }
  } catch (e) {
    return { ok: false, message: 'No se pudo crear la cartera' }
  }
}

export async function actualizar(
  id: string,
  input: Partial<UpdateCarteraInput>
): Promise<ServiceResult<Cartera>> {
  try {
    const data = await carteraRepository.update(id, input)
    return { ok: true, data }
  } catch {
    return { ok: false, message: 'No se pudo actualizar la cartera' }
  }
}

export async function eliminar(id: string): Promise<ServiceResult<void>> {
  try {
    await carteraRepository.remove(id)
    return { ok: true, data: undefined }
  } catch {
    return { ok: false, message: 'No se pudo eliminar la cartera' }
  }
}