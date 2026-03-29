export type AuthView = 'login' | 'register'

export interface AuthUser {
  id: number
  nombre: string
  email: string
}

export interface StoredAuthUser extends AuthUser {
  password: string
}

export interface RegisterUserInput {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthFailureResult {
  ok: false
  message: string
}

export interface RegisterUserSuccessResult {
  ok: true
  message: string
  user: AuthUser
}

export interface ResetPasswordSuccessResult {
  ok: true
  message: string
}

export type RegisterUserResult = RegisterUserSuccessResult | AuthFailureResult
export type ResetPasswordResult = ResetPasswordSuccessResult | AuthFailureResult

export interface AuthFlashMessage {
  email?: string
  message?: string
}
