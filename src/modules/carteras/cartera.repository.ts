import { createBackendSupabaseClient } from '@/src/lib/supabaseClient'
import type { Cartera, CreateCarteraInput, UpdateCarteraInput } from './cartera.schema'

export async function findAll(userId: string): Promise<Cartera[]> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('carteras')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function findById(id: string): Promise<Cartera | null> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('carteras')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function insert(
  userId: string,
  input: CreateCarteraInput
): Promise<Cartera> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('carteras')
    .insert({ ...input, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function update(
  id: string,
  input: Partial<UpdateCarteraInput>
): Promise<Cartera> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('carteras')
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
    .from('carteras')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}