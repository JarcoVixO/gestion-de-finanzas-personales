import { createBackendSupabaseClient } from '@/src/lib/supabaseClient'
import type { Transaccion, CreateTransaccionInput, UpdateTransaccionInput } from './transaccion.schema'

export async function findAll(userId: string): Promise<Transaccion[]> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('transacciones')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function findById(id: string): Promise<Transaccion | null> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('transacciones')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function insert(
  userId: string,
  input: CreateTransaccionInput
): Promise<Transaccion> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('transacciones')
    .insert({ ...input, user_id: userId, account_id: input.accountId })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function update(
  id: string,
  input: Partial<UpdateTransaccionInput>
): Promise<Transaccion> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('transacciones')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function remove(id: string): Promise<void> {
  const supabase = createBackendSupabaseClient()
  const { error } = await supabase
    .from('transacciones')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}