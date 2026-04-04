import type { ServiceResult } from '@/src/shared/types/common'
import type {
  Transaccion,
  CreateTransaccionInput,
  UpdateTransaccionInput
} from './transaccion.schema'
import * as transaccionRepository from './transaccion.repository'

export async function listar(userId: string): Promise<ServiceResult<Transaccion[]>> {
  try {
    const data = await transaccionRepository.findAll(userId)
    return { ok: true, data }
  } catch {
    return { ok: false, message: 'No se pudieron cargar las transacciones' }
  }
}

export async function crear(
  userId: string,
  input: CreateTransaccionInput
): Promise<ServiceResult<Transaccion>> {
  try {
    const description = input.description.trim()
    if (!description) return { ok: false, message: 'La descripción es obligatoria' }
    if (!input.amount) return { ok: false, message: 'El monto es obligatorio' }

    const data = await transaccionRepository.insert(userId, { ...input, description })
    return { ok: true, data }
  } catch {
    return { ok: false, message: 'No se pudo crear la transacción' }
  }
}

export async function actualizar(
  id: string,
  input: Partial<UpdateTransaccionInput>
): Promise<ServiceResult<Transaccion>> {
  try {
    const data = await transaccionRepository.update(id, input)
    return { ok: true, data }
  } catch {
    return { ok: false, message: 'No se pudo actualizar la transacción' }
  }
}

export async function eliminar(id: string): Promise<ServiceResult<void>> {
  try {
    await transaccionRepository.remove(id)
    return { ok: true, data: undefined }
  } catch {
    return { ok: false, message: 'No se pudo eliminar la transacción' }
  }
}