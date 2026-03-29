import type {
  BudgetRecord,
  CreateBudgetPayload,
  DomainIdentifier,
  UpdateBudgetPayload
} from '../../types/domain'

export interface PresupuestoRepositoryContract {
  list: () => Promise<BudgetRecord[]>
  getById: (id: DomainIdentifier) => Promise<BudgetRecord | null>
  create: (payload: CreateBudgetPayload) => Promise<BudgetRecord>
  update: (id: DomainIdentifier, payload: UpdateBudgetPayload) => Promise<BudgetRecord | null>
  remove: (id: DomainIdentifier) => Promise<boolean>
}
