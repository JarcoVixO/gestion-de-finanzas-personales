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
