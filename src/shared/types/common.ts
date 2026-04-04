export type ID = string
export type DomainIdentifier = string | number

// Resultado estándar que devuelven todos los services y actions
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