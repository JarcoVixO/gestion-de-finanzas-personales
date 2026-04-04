import type { ServiceResult } from '@/src/shared/types/common'

// Tipos de dominio
export interface Transaccion {
  id: string
  user_id: string
  description: string
  amount: number
  date: string
  account_id?: string | null
  account_name?: string
  category?: TransaccionCategory
  created_at?: string
}

export type TransaccionType = 'income' | 'expense'
export type TransaccionTab = 'all' | 'income' | 'expense'
export type TransaccionCategory = 'food' | 'transport' | 'savings' | 'salary' | 'leisure' | 'other'

export interface TransaccionFormState {
  type: TransaccionType
  description: string
  amount: string
  date: string
  accountId: string
  budgetId: string
  category: TransaccionCategory
}

export interface CreateTransaccionInput {
  description: string
  amount: number
  date: string
  accountId: string
  category?: TransaccionCategory
}

export interface UpdateTransaccionInput {
  id: string
  description?: string
  amount?: number
  date?: string
  accountId?: string | null
  category?: TransaccionCategory
}

export interface TransaccionCategoryMeta {
  label: string
  badgeClass: string
  icon: string
}

// Helpers y mappers
const TODAY = (): string => new Date().toISOString().slice(0, 10)

export function toInputDate(value: string | null | undefined): string {
  if (!value) return TODAY()
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? TODAY() : parsed.toISOString().slice(0, 10)
}

export function formatTransaccionDate(value: string | null | undefined): string {
  if (!value) return 'Sin fecha'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-SV', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export function getTransaccionCategoryMeta(tx: Transaccion): TransaccionCategoryMeta {
  const isIncome = tx.amount >= 0
  const desc = (tx.description ?? '').toLowerCase()

  if (isIncome && desc.includes('sueldo'))
    return { label: 'Salario', badgeClass: 'text-bg-success', icon: 'work' }
  if (isIncome)
    return { label: 'Ingreso', badgeClass: 'text-bg-success', icon: 'trending_up' }
  return { label: 'Gasto', badgeClass: 'text-bg-warning text-dark', icon: 'receipt_long' }
}

export function getSignedAmount(amount: number, type: TransaccionType): number {
  return type === 'expense' ? -Math.abs(amount) : Math.abs(amount)
}

export function createEmptyForm(): TransaccionFormState {
  return {
    type: 'expense',
    description: '',
    amount: '',
    date: TODAY(),
    accountId: '',
    budgetId: '',
    category: 'food'
  }
}

export function formFromTransaccion(tx: Transaccion | null | undefined): TransaccionFormState {
  const base = createEmptyForm()
  if (!tx) return base
  return {
    ...base,
    description: tx.description ?? '',
    amount: String(Math.abs(Number(tx.amount) || 0)),
    date: toInputDate(tx.date),
    type: (Number(tx.amount) || 0) < 0 ? 'expense' : 'income',
    accountId: tx.account_id ?? ''
  }
}