import type { BudgetRecord, CreateBudgetPayload, UpdateBudgetPayload } from '../../types/domain'
import type { ApiHandler, ServiceResult } from '../../types/http'

export interface PresupuestoControllerContract {
  list: ApiHandler<unknown, ServiceResult<BudgetRecord[]>>
  getById: ApiHandler<unknown, ServiceResult<BudgetRecord | null>, { id: string }>
  create: ApiHandler<CreateBudgetPayload, ServiceResult<BudgetRecord>>
  update: ApiHandler<UpdateBudgetPayload, ServiceResult<BudgetRecord | null>, { id: string }>
  remove: ApiHandler<unknown, ServiceResult<{ deleted: boolean }>, { id: string }>
}
