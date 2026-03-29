import type {
  CreateWalletPayload,
  DomainIdentifier,
  UpdateWalletPayload,
  WalletRecord
} from '../../types/domain'
import type { ServiceResult } from '../../types/http'

export interface CarteraServiceContract {
  list: () => Promise<ServiceResult<WalletRecord[]>>
  getById: (id: DomainIdentifier) => Promise<ServiceResult<WalletRecord | null>>
  create: (payload: CreateWalletPayload) => Promise<ServiceResult<WalletRecord>>
  update: (id: DomainIdentifier, payload: UpdateWalletPayload) => Promise<ServiceResult<WalletRecord | null>>
  remove: (id: DomainIdentifier) => Promise<ServiceResult<{ deleted: boolean }>>
}
