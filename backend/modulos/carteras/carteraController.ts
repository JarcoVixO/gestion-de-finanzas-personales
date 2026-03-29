import type { CreateWalletPayload, UpdateWalletPayload, WalletRecord } from '../../types/domain'
import type { ApiHandler, ServiceResult } from '../../types/http'

export interface CarteraControllerContract {
  list: ApiHandler<unknown, ServiceResult<WalletRecord[]>>
  getById: ApiHandler<unknown, ServiceResult<WalletRecord | null>, { id: string }>
  create: ApiHandler<CreateWalletPayload, ServiceResult<WalletRecord>>
  update: ApiHandler<UpdateWalletPayload, ServiceResult<WalletRecord | null>, { id: string }>
  remove: ApiHandler<unknown, ServiceResult<{ deleted: boolean }>, { id: string }>
}
