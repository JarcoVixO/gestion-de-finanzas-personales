import type { AuthenticatedUser } from '../types/auth'
import type { ApiRequest, MiddlewareHandler, QueryParams, RouteParams } from '../types/http'

export type AuthenticatedRequest<
  TBody = unknown,
  TParams extends RouteParams = RouteParams,
  TQuery extends QueryParams = QueryParams
> = ApiRequest<TBody, TParams, TQuery, AuthenticatedUser>

export interface AuthMiddlewareContract {
  requireAuth: MiddlewareHandler
  optionalAuth: MiddlewareHandler
}
