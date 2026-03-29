import type { Account, WalletSummary, WalletVisuals } from '../../../shared/types/finance'

export function getWalletGoal(balance: number, goal?: number | null): number {
  const safeGoal = typeof goal === 'number' && Number.isFinite(goal) ? goal : null

  if (safeGoal && safeGoal > 0) {
    return safeGoal
  }

  return Math.max(Math.round(Math.abs(balance) * 1.2), 100)
}

export function getWalletVisuals(account: Account): WalletVisuals {
  const normalizedType = (account.type || '').toLowerCase()

  if (normalizedType.includes('banco')) {
    return { icon: 'account_balance', iconBg: 'bg-secondary bg-opacity-10 text-secondary' }
  }

  if (normalizedType.includes('efectivo')) {
    return { icon: 'savings', iconBg: 'bg-primary bg-opacity-10 text-primary' }
  }

  return { icon: 'account_balance_wallet', iconBg: 'bg-warning bg-opacity-25 text-warning-emphasis' }
}

export function mapWallets(accounts: Account[]): WalletSummary[] {
  return accounts.map((account) => {
    const visuals = getWalletVisuals(account)

    return {
      id: account.id,
      name: account.name,
      balance: account.balance,
      goal: getWalletGoal(account.balance, account.goal),
      icon: visuals.icon,
      iconBg: visuals.iconBg
    }
  })
}
