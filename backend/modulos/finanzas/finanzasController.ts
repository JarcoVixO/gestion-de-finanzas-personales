import type {
  CreateTransactionPayload,
  TransactionRecord,
  UpdateTransactionPayload
} from '../../types/domain'
import type { ApiHandler, ServiceResult } from '../../types/http'

export interface FinanzasControllerContract {
  list: ApiHandler<unknown, ServiceResult<TransactionRecord[]>>
  getById: ApiHandler<unknown, ServiceResult<TransactionRecord | null>, { id: string }>
  create: ApiHandler<CreateTransactionPayload, ServiceResult<TransactionRecord>>
  update: ApiHandler<UpdateTransactionPayload, ServiceResult<TransactionRecord | null>, { id: string }>
  remove: ApiHandler<unknown, ServiceResult<{ deleted: boolean }>, { id: string }>
}
