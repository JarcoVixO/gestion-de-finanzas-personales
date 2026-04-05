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
  return (data ?? []).map(toCartera)
}

export async function findById(id: string): Promise<Cartera | null> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('carteras')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return toCartera(data)
}

export async function insert(userId: string, input: CreateCarteraInput): Promise<Cartera> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('carteras')
    .insert({
      user_id: userId,
      nombre: input.name,
      balance_inicial: input.balance,
      objetivo_cantidad: input.goal ?? null
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return toCartera(data)
}

export async function update(id: string, input: Partial<UpdateCarteraInput>): Promise<Cartera> {
  const supabase = createBackendSupabaseClient()
  const { data, error } = await supabase
    .from('carteras')
    .update({
      ...(input.name !== undefined && { nombre: input.name }),
      ...(input.balance !== undefined && { balance_inicial: input.balance }),
      ...(input.goal !== undefined && { objetivo_cantidad: input.goal })
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return toCartera(data)
}

export async function remove(id: string): Promise<void> {
  const supabase = createBackendSupabaseClient()
  const { error } = await supabase.from('carteras').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// Mapper de DB → dominio
function toCartera(row: any): Cartera {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.nombre,
    balance: row.balance_inicial,
    goal: row.objetivo_cantidad ?? 0,
    created_at: row.created_at
  }
}