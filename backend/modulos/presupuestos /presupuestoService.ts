import type {
  BudgetRecord,
  CreateBudgetPayload,
  DomainIdentifier,
  UpdateBudgetPayload
} from '../../types/domain'
import type { ServiceResult } from '../../types/http'

export interface PresupuestoServiceContract {
  list: () => Promise<ServiceResult<BudgetRecord[]>>
  getById: (id: DomainIdentifier) => Promise<ServiceResult<BudgetRecord | null>>
  create: (payload: CreateBudgetPayload) => Promise<ServiceResult<BudgetRecord>>
  update: (id: DomainIdentifier, payload: UpdateBudgetPayload) => Promise<ServiceResult<BudgetRecord | null>>
  remove: (id: DomainIdentifier) => Promise<ServiceResult<{ deleted: boolean }>>
}
