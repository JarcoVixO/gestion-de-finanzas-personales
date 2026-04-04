import type { Budget, BudgetVisuals, BudgetWithVisuals } from '../../shared/types/finance'

export function formatBudgetDueDate(value: string | null | undefined): string {
  if (!value) {
    return ''
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

export function getBudgetVisuals(name: string): BudgetVisuals {
  const normalizedName = name.toLowerCase()

  if (normalizedName.includes('aliment')) {
    return { icon: 'restaurant', iconBg: 'bg-primary bg-opacity-10 text-primary', barClass: 'bg-primary' }
  }

  if (normalizedName.includes('transport')) {
    return { icon: 'directions_car', iconBg: 'bg-warning bg-opacity-25 text-warning-emphasis', barClass: 'bg-warning' }
  }

  if (normalizedName.includes('entreten')) {
    return { icon: 'movie', iconBg: 'bg-danger bg-opacity-10 text-danger', barClass: 'bg-danger' }
  }

  if (normalizedName.includes('hogar') || normalizedName.includes('servicio')) {
    return { icon: 'bolt', iconBg: 'bg-info bg-opacity-10 text-info', barClass: 'bg-info' }
  }

  return { icon: 'savings', iconBg: 'bg-secondary bg-opacity-10 text-secondary', barClass: 'bg-secondary' }
}

export function mapBudgetsWithVisuals(budgets: Budget[]): BudgetWithVisuals[] {
  return budgets.map((budget) => ({
    ...budget,
    ...getBudgetVisuals(budget.name)
  }))
}
