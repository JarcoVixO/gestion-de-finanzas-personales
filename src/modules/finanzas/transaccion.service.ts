import type {
  CreateTransactionPayload,
  DomainIdentifier,
  TransactionRecord,
  UpdateTransactionPayload
} from '../../shared/types/domain'
import type { ServiceResult } from '../../shared/types/http'

export interface FinanzasServiceContract {
  list: () => Promise<ServiceResult<TransactionRecord[]>>
  getById: (id: DomainIdentifier) => Promise<ServiceResult<TransactionRecord | null>>
  create: (payload: CreateTransactionPayload) => Promise<ServiceResult<TransactionRecord>>
  update: (id: DomainIdentifier, payload: UpdateTransactionPayload) => Promise<ServiceResult<TransactionRecord | null>>
  remove: (id: DomainIdentifier) => Promise<ServiceResult<{ deleted: boolean }>>
}