'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import {
  AUTH_ACCESS_TOKEN_COOKIE,
  createSupabaseServerAuthClient
} from '@/src/lib/supabaseClient'
import type { ServiceResult } from '@/src/shared/types/common'
import type {
  Transaccion,
  CreateTransaccionInput,
  UpdateTransaccionInput
} from './transaccion.schema'
import * as transaccionService from './transaccion.service'

async function getUserId(): Promise<string> {
  const cookieStore = cookies()
  const accessToken = cookieStore.get(AUTH_ACCESS_TOKEN_COOKIE)?.value
  if (!accessToken) throw new Error('No autenticado')

  const supabase = createSupabaseServerAuthClient()
  const { data, error } = await supabase.auth.getUser(accessToken)
  if (error || !data.user) throw new Error('Sesión inválida')

  return data.user.id
}

export async function listarTransaccionesAction(): Promise<ServiceResult<Transaccion[]>> {
  try {
    const userId = await getUserId()
    return transaccionService.listar(userId)
  } catch {
    return { ok: false, message: 'Sesión no válida' }
  }
}

export async function crearTransaccionAction(
  input: CreateTransaccionInput
): Promise<ServiceResult<Transaccion>> {
  try {
    const userId = await getUserId()
    const result = await transaccionService.crear(userId, input)
    if (result.ok) revalidatePath('/finanzas')
    return result
  } catch {
    return { ok: false, message: 'Error inesperado' }
  }
}

export async function actualizarTransaccionAction(
  id: string,
  input: Partial<UpdateTransaccionInput>
): Promise<ServiceResult<Transaccion>> {
  try {
    const result = await transaccionService.actualizar(id, input)
    if (result.ok) revalidatePath('/finanzas')
    return result
  } catch {
    return { ok: false, message: 'Error inesperado' }
  }
}

export async function eliminarTransaccionAction(
  id: string
): Promise<ServiceResult<void>> {
  try {
    const result = await transaccionService.eliminar(id)
    if (result.ok) revalidatePath('/finanzas')
    return result
  } catch {
    return { ok: false, message: 'Error inesperado' }
  }
}