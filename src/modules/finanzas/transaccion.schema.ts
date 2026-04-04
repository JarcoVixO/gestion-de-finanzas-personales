import type { CreateTransactionPayload, DomainIdentifier, UpdateTransactionPayload } from '../../shared/types/domain'
import type { ValidationResult } from '../../shared/types/http'

export interface FinanzasValidatorContract {
  validateId: (id: DomainIdentifier) => ValidationResult<DomainIdentifier>
  validateCreate: (payload: CreateTransactionPayload) => ValidationResult<CreateTransactionPayload>
  validateUpdate: (payload: UpdateTransactionPayload) => ValidationResult<UpdateTransactionPayload>
}