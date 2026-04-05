// Tipos de dominio
export interface Cartera {
  id: string
  user_id: string
  name: string
  balance: number
  goal: number
  created_at?: string
}

export interface CarteraOption {
  id: string
  name: string
}

export interface CreateCarteraInput {
  name: string
  balance: number
  goal?: number | null
}

export interface UpdateCarteraInput {
  id: string
  name?: string
  balance?: number
  goal?: number | null
}

// Tipos visuales
export interface CarteraVisuals {
  icon: string
  iconBg: string
}

export interface CarteraSummary extends CarteraVisuals {
  id: string
  name: string
  balance: number
  goal: number
}

// Mappers visuales
export function getCarteraVisuals(name: string): CarteraVisuals {
  const normalized = (name ?? '').toLowerCase()
  if (normalized.includes('banco'))
    return { icon: 'account_balance', iconBg: 'bg-secondary bg-opacity-10 text-secondary' }
  if (normalized.includes('efectivo'))
    return { icon: 'savings', iconBg: 'bg-primary bg-opacity-10 text-primary' }
  return { icon: 'account_balance_wallet', iconBg: 'bg-warning bg-opacity-25 text-warning-emphasis' }
}

export function toCarteraSummary(cartera: Cartera): CarteraSummary {
  const visuals = getCarteraVisuals(cartera.name)
  return {
    id: cartera.id,
    name: cartera.name,
    balance: cartera.balance,
    goal: cartera.goal,
    ...visuals
  }
}