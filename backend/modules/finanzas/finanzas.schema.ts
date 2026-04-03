import type { CreateTransactionPayload, DomainIdentifier, UpdateTransactionPayload } from '../../types/domain'
import type { ValidationResult } from '../../types/http'

export interface FinanzasValidatorContract {
  validateId: (id: DomainIdentifier) => ValidationResult<DomainIdentifier>
  validateCreate: (payload: CreateTransactionPayload) => ValidationResult<CreateTransactionPayload>
  validateUpdate: (payload: UpdateTransactionPayload) => ValidationResult<UpdateTransactionPayload>
}