import { createClient } from '@supabase/supabase-js'

export interface SupabaseClientConfig {
  url?: string
  serviceRoleKey?: string
}

export interface SupabaseTableQuery<TRecord = unknown> {
  select: (columns?: string) => Promise<TRecord[]>
  insert: (payload: Partial<TRecord> | Array<Partial<TRecord>>) => Promise<TRecord[]>
  update: (payload: Partial<TRecord>) => SupabaseTableQuery<TRecord>
  delete: () => Promise<{ deleted: boolean }>
  eq: (column: string, value: unknown) => SupabaseTableQuery<TRecord>
  single: () => Promise<TRecord | null>
}

export interface SupabaseClientContract {
  from: <TRecord = unknown>(table: string) => SupabaseTableQuery<TRecord>
}

const getBackendSupabaseEnv = () => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Missing backend Supabase environment variables.')
  }

  return { url, serviceRoleKey }
}

export const createBackendSupabaseClient = () => {
  const { url, serviceRoleKey } = getBackendSupabaseEnv()
  return createClient(url, serviceRoleKey)
}

export const supabase = createBackendSupabaseClient()