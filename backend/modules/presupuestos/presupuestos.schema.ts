import type { CreateBudgetPayload, DomainIdentifier, UpdateBudgetPayload } from '../../types/domain'
import type { ValidationResult } from '../../types/http'

export interface PresupuestoValidatorContract {
  validateId: (id: DomainIdentifier) => ValidationResult<DomainIdentifier>
  validateCreate: (payload: CreateBudgetPayload) => ValidationResult<CreateBudgetPayload>
  validateUpdate: (payload: UpdateBudgetPayload) => ValidationResult<UpdateBudgetPayload>
}