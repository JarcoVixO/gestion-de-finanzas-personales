import type {
  CreateTransactionPayload,
  DomainIdentifier,
  TransactionRecord,
  UpdateTransactionPayload
} from '../../types/domain'

export interface FinanzasRepositoryContract {
  list: () => Promise<TransactionRecord[]>
  getById: (id: DomainIdentifier) => Promise<TransactionRecord | null>
  create: (payload: CreateTransactionPayload) => Promise<TransactionRecord>
  update: (id: DomainIdentifier, payload: UpdateTransactionPayload) => Promise<TransactionRecord | null>
  remove: (id: DomainIdentifier) => Promise<boolean>
}
