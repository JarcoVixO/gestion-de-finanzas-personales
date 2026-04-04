import type { CreateWalletPayload, DomainIdentifier, UpdateWalletPayload } from '../../shared/types/domain'
import type { ValidationResult } from '../../shared/types/http'

export interface CarteraValidatorContract {
  validateId: (id: DomainIdentifier) => ValidationResult<DomainIdentifier>
  validateCreate: (payload: CreateWalletPayload) => ValidationResult<CreateWalletPayload>
  validateUpdate: (payload: UpdateWalletPayload) => ValidationResult<UpdateWalletPayload>
}