import type { ServiceResult } from '@/src/shared/types/common'
import type { Cartera, CreateCarteraInput, UpdateCarteraInput } from './cartera.schema'
import * as carteraRepository from './cartera.repository'

function calcularGoal(balance: number, goal?: number | null): number {
  if (goal && Number.isFinite(goal) && goal > 0) return goal
  return Math.max(Math.round(Math.abs(balance) * 1.2), 100)
}

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
    const name = input.name.trim()
    if (!name) return { ok: false, message: 'El nombre es obligatorio' }
    const goal = calcularGoal(input.balance, input.goal)
    const data = await carteraRepository.insert(userId, { ...input, name, goal })
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