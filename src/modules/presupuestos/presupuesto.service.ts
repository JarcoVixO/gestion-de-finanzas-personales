import type { BudgetRecord, CreateBudgetPayload, DomainIdentifier, UpdateBudgetPayload } from '../../shared/types/domain'
import type { ServiceResult } from '../../shared/types/http'

export interface PresupuestoServiceContract {
  list: () => Promise<ServiceResult<BudgetRecord[]>>
  getById: (id: DomainIdentifier) => Promise<ServiceResult<BudgetRecord | null>>
  create: (payload: CreateBudgetPayload) => Promise<ServiceResult<BudgetRecord>>
  update: (id: DomainIdentifier, payload: UpdateBudgetPayload) => Promise<ServiceResult<BudgetRecord | null>>
  remove: (id: DomainIdentifier) => Promise<ServiceResult<{ deleted: boolean }>>
}