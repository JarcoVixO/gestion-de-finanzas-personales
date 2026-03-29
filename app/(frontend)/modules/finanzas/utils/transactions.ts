import type {
  Transaction,
  TransactionCategoryMeta,
  TransactionFormState,
  TransactionType
} from '../../../shared/types/finance'

const TODAY = (): string => new Date().toISOString().slice(0, 10)

export function createEmptyTransactionForm(): TransactionFormState {
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

export function createTransactionFormFromTransaction(
  transaction: Transaction | null | undefined
): TransactionFormState {
  const baseForm = createEmptyTransactionForm()

  if (!transaction) {
    return baseForm
  }

  return {
    ...baseForm,
    description: transaction.description || '',
    amount: String(Math.abs(Number(transaction.amount) || 0)),
    date: toInputDate(transaction.date),
    type: (Number(transaction.amount) || 0) < 0 ? 'expense' : 'income',
    accountId: transaction.accountId || ''
  }
}

export function toInputDate(value: string | null | undefined): string {
  if (!value) {
    return TODAY()
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return TODAY()
  }

  return parsedDate.toISOString().slice(0, 10)
}

export function formatTransactionDate(value: string | null | undefined): string {
  if (!value) {
    return 'Sin fecha'
  }

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('es-SV', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export function getTransactionCategoryMeta(transaction: Transaction): TransactionCategoryMeta {
  const isIncome = transaction.amount >= 0
  const normalizedDescription = (transaction.description || '').toLowerCase()

  if (isIncome && normalizedDescription.includes('sueldo')) {
    return { label: 'Salario', badgeClass: 'text-bg-success', icon: 'work' }
  }

  if (isIncome) {
    return { label: 'Ingreso', badgeClass: 'text-bg-success', icon: 'trending_up' }
  }

  return { label: 'Gasto', badgeClass: 'text-bg-warning text-dark', icon: 'receipt_long' }
}

export function getSignedTransactionAmount(amount: number, type: TransactionType): number {
  return type === 'expense' ? -Math.abs(amount) : Math.abs(amount)
}
