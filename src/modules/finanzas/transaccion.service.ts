import type { ServiceResult } from '@/src/shared/types/common'
import type {
  Transaccion,
  CreateTransaccionInput,
  UpdateTransaccionInput
} from './transaccion.schema'
import * as transaccionRepository from './transaccion.repository'
import * as carteraRepository from '../carteras/cartera.repository'

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
    if (!input.monto) return { ok: false, message: 'El monto es obligatorio' }
    if (!input.tipo) return { ok: false, message: 'El tipo es obligatorio' }
    if (!input.fecha) return { ok: false, message: 'La fecha es obligatoria' }
    
    const data = await transaccionRepository.insert(userId, input)

    // Actualizar balance de la cartera si se especificó una
    if (input.cartera_id) {
      const cartera = await carteraRepository.findById(input.cartera_id)
      if (cartera) {
        const nuevoBalance = input.tipo === 'ingreso'
          ? cartera.balance + Math.abs(input.monto)
          : cartera.balance - Math.abs(input.monto)
        await carteraRepository.update(input.cartera_id, { balance: nuevoBalance })
      }
    }

    return { ok: true, data }
  } catch (e){
    return { ok: false, message: 'No se pudo crear la transacción' }
  }
}

export async function actualizar(
  id: string,
  input: Partial<UpdateTransaccionInput>
): Promise<ServiceResult<Transaccion>> {
  try {
    const txAnterior = await transaccionRepository.findById(id)

    if (txAnterior?.cartera_id) {
      const cartera = await carteraRepository.findById(txAnterior.cartera_id)

      if (cartera) {
        const balanceRevertido = txAnterior.tipo === 'ingreso'
          ? cartera.balance - Math.abs(txAnterior.monto)
          : cartera.balance + Math.abs(txAnterior.monto)
        await carteraRepository.update(txAnterior.cartera_id, { balance: balanceRevertido })
      }
    }

    const data = await transaccionRepository.update(id, input)

    const cartera_id = input.cartera_id ?? txAnterior?.cartera_id
    const tipoFinal = input.tipo ?? txAnterior?.tipo
    const montoFinal = input.monto ?? txAnterior?.monto

    if (cartera_id && tipoFinal !== undefined && montoFinal !== undefined) {
      const cartera = await carteraRepository.findById(cartera_id)

      if (cartera) {
        const nuevoBalance = tipoFinal === 'ingreso'
          ? cartera.balance + Math.abs(montoFinal)
          : cartera.balance - Math.abs(montoFinal)
        await carteraRepository.update(cartera_id, { balance: nuevoBalance })
      }
    }

    return { ok: true, data }
  } catch (e) {
    return { ok: false, message: 'No se pudo actualizar la transacción' }
  }
}

export async function eliminar(id: string): Promise<ServiceResult<void>> {
  try {
    const tx = await transaccionRepository.findById(id)
    
    if (tx?.cartera_id) {
      const cartera = await carteraRepository.findById(tx.cartera_id)
      
      if (cartera) {
        const balanceRevertido = tx.tipo === 'ingreso'
          ? cartera.balance - Math.abs(tx.monto)
          : cartera.balance + Math.abs(tx.monto)
        
        await carteraRepository.update(tx.cartera_id, { balance: balanceRevertido })
        
        const carteraActualizada = await carteraRepository.findById(tx.cartera_id)
      }
    }

    await transaccionRepository.remove(id)
    return { ok: true, data: undefined }
  } catch (e) {
    return { ok: false, message: 'No se pudo eliminar la transacción' }
  }
}