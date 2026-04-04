export type DomainIdentifier = string | number

export interface TransactionRecord {
  id: DomainIdentifier
  date: string
  description: string
  amount: number
  accountId?: string | null
  accountName?: string
  category?: string
  type?: 'income' | 'expense'
}

export interface CreateTransactionPayload {
  date: string
  description: string
  amount: number
  accountId: string
  category?: string
  type?: 'income' | 'expense'
}

export interface UpdateTransactionPayload {
  date?: string
  description?: string
  amount?: number
  accountId?: string | null
  category?: string
  type?: 'income' | 'expense'
}

export interface WalletRecord {
  id: string
  name: string
  balance: number
  type: string
  goal: number
}

export interface CreateWalletPayload {
  name: string
  balance: number
  type?: string
  goal?: number
}

export interface UpdateWalletPayload {
  name?: string
  balance?: number
  goal?: number | null
}

export interface BudgetRecord {
  id: string
  name: string
  limit: number
  spent: number
  description?: string
  category: string
  priority: string
  dueDate: string
}

export interface CreateBudgetPayload {
  name: string
  limit: number
  spent?: number
  description?: string
  category?: string
  priority?: string
  dueDate?: string
}

export interface UpdateBudgetPayload {
  name?: string
  limit?: number | null
  description?: string
  category?: string
  priority?: string
  dueDate?: string
}

export interface PresupuestoRecord {
  id: string
  user_id: string
  nombre: string
  monto_limite: number
  fecha_inicio: string
  fecha_fin: string | null
  created_at: string
}

export interface CreatePresupuestoPayload {
  nombre: string
  monto_limite: number
  fecha_inicio: string
  fecha_fin?: string | null
}

export interface UpdatePresupuestoPayload {
  nombre?: string
  monto_limite?: number
  fecha_inicio?: string
  fecha_fin?: string | null
}
