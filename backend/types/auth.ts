export interface AuthenticatedUser {
  id: number
  nombre: string
  email: string
}

export interface AuthSession {
  user: AuthenticatedUser
  token: string
}

export interface LoginRequestBody {
  email: string
  password: string
}

export interface RegisterRequestBody {
  nombre: string
  email: string
  password: string
  confirmPassword: string
}

export interface ResetPasswordRequestBody {
  email: string
  newPassword: string
}
