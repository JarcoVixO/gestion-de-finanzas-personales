import type { AuthenticatedUser } from './auth'

export type RouteParams = Record<string, string>
export type QueryParams = Record<string, string | string[] | undefined>
export type NextHandler = (error?: unknown) => void

export interface ApiRequest<
  TBody = unknown,
  TParams extends RouteParams = RouteParams,
  TQuery extends QueryParams = QueryParams,
  TUser = AuthenticatedUser | null
> {
  body: TBody
  params: TParams
  query: TQuery
  headers: Record<string, string | string[] | undefined>
  user?: TUser
}

export interface ApiResponse<TData = unknown> {
  status: (code: number) => ApiResponse<TData>
  json: (body: TData) => ApiResponse<TData>
}

export type ApiHandler<
  TBody = unknown,
  TResponse = unknown,
  TParams extends RouteParams = RouteParams,
  TQuery extends QueryParams = QueryParams
> = (
  req: ApiRequest<TBody, TParams, TQuery>,
  res: ApiResponse<TResponse>,
  next: NextHandler
) => Promise<void> | void

export type MiddlewareHandler<
  TBody = unknown,
  TParams extends RouteParams = RouteParams,
  TQuery extends QueryParams = QueryParams
> = (
  req: ApiRequest<TBody, TParams, TQuery>,
  res: ApiResponse<unknown>,
  next: NextHandler
) => Promise<void> | void

export interface ValidationSuccess<T> {
  success: true
  data: T
}

export interface ValidationFailure {
  success: false
  errors: string[]
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure

export interface ServiceSuccess<T> {
  ok: true
  data: T
  message?: string
}

export interface ServiceFailure {
  ok: false
  message: string
}

export type ServiceResult<T> = ServiceSuccess<T> | ServiceFailure
