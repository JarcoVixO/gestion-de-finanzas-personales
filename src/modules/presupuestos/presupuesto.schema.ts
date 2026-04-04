import type { CreateBudgetPayload, DomainIdentifier, UpdateBudgetPayload } from '../../shared/types/domain'
import type { ValidationResult } from '../../shared/types/http'

export interface PresupuestoValidatorContract {
  validateId: (id: DomainIdentifier) => ValidationResult<DomainIdentifier>
  validateCreate: (payload: CreateBudgetPayload) => ValidationResult<CreateBudgetPayload>
  validateUpdate: (payload: UpdateBudgetPayload) => ValidationResult<UpdateBudgetPayload>
}