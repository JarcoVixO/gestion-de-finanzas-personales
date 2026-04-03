export type EntityIdentifier = string | number
export type TransactionType = 'income' | 'expense'
export type TransactionTab = 'all' | 'income' | 'expense'
export type TransactionCategory = 'food' | 'transport' | 'savings' | 'salary' | 'leisure' | 'other'

export interface Account {
  id: string
  name: string
  balance: number
  type: string
  goal: number
}

export interface Transaction {
  id: EntityIdentifier
  date: string
  description: string
  amount: number
  accountId?: string | null
  accountName?: string
  account?: string
  icon?: string
  category?: string
  categoryColor?: string
  type?: TransactionType
}

export interface Budget {
  id: string
  name: string
  limit: number
  spent: number
  description?: string
  category: string
  priority: string
  dueDate: string
}

export interface TransactionFormState {
  type: TransactionType
  description: string
  amount: string
  date: string
  accountId: string
  budgetId: string
  category: TransactionCategory
}

export interface TransactionCategoryMeta {
  label: string
  badgeClass: string
  icon: string
}

export interface WalletVisuals {
  icon: string
  iconBg: string
}

export interface WalletSummary extends WalletVisuals {
  id: string
  name: string
  balance: number
  goal: number
}

export interface BudgetVisuals {
  icon: string
  iconBg: string
  barClass: string
}

export type BudgetWithVisuals = Budget & BudgetVisuals

export interface PersistedAppStoreState {
  count: number
  accounts: Account[]
  transactions: Transaction[]
  budgets: Budget[]
}

export interface AddAccountInput {
  name: string
  balance: number
  type?: string
  goal?: number
}

export interface UpdateAccountInput {
  id: string
  name?: string
  balance: number
  goal?: number | null
}

export interface AddBudgetInput {
  name: string
  limit: number
  spent?: number
  description?: string
  category?: string
  priority?: string
  dueDate?: string
}

export interface UpdateBudgetInput {
  id: string
  name?: string
  limit?: number | null
  description?: string
  category?: string
  priority?: string
  dueDate?: string
}

export interface AddBudgetExpenseInput {
  id: string
  amount: number
  accountId?: string | null
}

export interface AddTransactionInput {
  description: string
  amount: number
  accountId: string
  date?: string
  category?: string
  type?: TransactionType
}

export interface UpdateTransactionInput {
  id: EntityIdentifier
  description?: string
  amount?: number
  date?: string
  accountId?: string | null
}

export interface AppStoreState extends PersistedAppStoreState {
  increase: () => void
  decrease: () => void
  resetStore: () => void
  addAccount: (input: AddAccountInput) => void
  updateAccount: (input: UpdateAccountInput) => void
  deleteAccount: (id: string) => void
  addBudget: (input: AddBudgetInput) => void
  updateBudget: (input: UpdateBudgetInput) => void
  deleteBudget: (id: string) => void
  addBudgetExpense: (input: AddBudgetExpenseInput) => void
  addTransaction: (input: AddTransactionInput) => void
  updateTransaction: (input: UpdateTransactionInput) => void
  deleteTransaction: (id: EntityIdentifier) => void
}
