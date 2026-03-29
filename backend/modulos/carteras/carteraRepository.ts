import type {
  CreateWalletPayload,
  DomainIdentifier,
  UpdateWalletPayload,
  WalletRecord
} from '../../types/domain'

export interface CarteraRepositoryContract {
  list: () => Promise<WalletRecord[]>
  getById: (id: DomainIdentifier) => Promise<WalletRecord | null>
  create: (payload: CreateWalletPayload) => Promise<WalletRecord>
  update: (id: DomainIdentifier, payload: UpdateWalletPayload) => Promise<WalletRecord | null>
  remove: (id: DomainIdentifier) => Promise<boolean>
}
