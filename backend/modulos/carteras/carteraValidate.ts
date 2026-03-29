import type { CreateWalletPayload, DomainIdentifier, UpdateWalletPayload } from '../../types/domain'
import type { ValidationResult } from '../../types/http'

export interface CarteraValidatorContract {
  validateId: (id: DomainIdentifier) => ValidationResult<DomainIdentifier>
  validateCreate: (payload: CreateWalletPayload) => ValidationResult<CreateWalletPayload>
  validateUpdate: (payload: UpdateWalletPayload) => ValidationResult<UpdateWalletPayload>
}
