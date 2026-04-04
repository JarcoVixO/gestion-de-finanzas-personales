import {
  AUTH_ACCESS_TOKEN_COOKIE,
  AUTH_REFRESH_TOKEN_COOKIE,
  authCookieOptions,
  createSupabaseServerAuthClient
} from '@/src/lib/supabaseClient'
import type { AuthenticatedUser } from '@/src/shared/types/auth'

interface CookieStoreLike {
  get: (name: string) => { value: string } | undefined
  set: (
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean
      maxAge?: number
      path?: string
      sameSite?: 'lax' | 'strict' | 'none'
      secure?: boolean
    }
  ) => void
}

export interface BackendAuthResult {
  success: boolean
  message?: string
  user?: AuthenticatedUser
}

interface LoginInput {
  email: string
  password: string
}

interface RegisterInput {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const toSpanishAuthMessage = (message?: string): string => {
  if (!message) {
    return 'No se pudo completar la operación de autenticación.'
  }

  const normalized = message.trim().toLowerCase()

  if (normalized === 'invalid login credentials') {
    return 'Correo o contraseña incorrectos.'
  }

  if (normalized === 'email not confirmed') {
    return 'Debes confirmar tu correo antes de iniciar sesión.'
  }

  if (normalized === 'user already registered') {
    return 'Ya existe una cuenta con ese correo.'
  }

  if (normalized === 'invalid api key') {
    return 'La configuración de Supabase es inválida en el servidor. Verifica las variables de entorno.'
  }

  if (normalized.includes('password should be at least')) {
    return 'La contraseña no cumple el mínimo de caracteres requerido.'
  }

  if (normalized.includes('unable to validate email address')) {
    return 'El formato del correo electrónico no es válido.'
  }

  return message
}

const clearAuthCookies = (cookieStore: CookieStoreLike): void => {
  cookieStore.set(AUTH_ACCESS_TOKEN_COOKIE, '', { ...authCookieOptions, maxAge: 0 })
  cookieStore.set(AUTH_REFRESH_TOKEN_COOKIE, '', { ...authCookieOptions, maxAge: 0 })
}

export async function loginWithPassword(input: LoginInput, cookieStore: CookieStoreLike): Promise<BackendAuthResult> {
  const { email, password } = input

  if (!email || !password) {
    return { success: false, message: 'Correo y contraseña son obligatorios.' }
  }

  try {
    const supabase = createSupabaseServerAuthClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.session || !data.user) {
      return { success: false, message: toSpanishAuthMessage(error?.message) || 'No se pudo iniciar sesión.' }
    }

    cookieStore.set(AUTH_ACCESS_TOKEN_COOKIE, data.session.access_token, {
      ...authCookieOptions,
      maxAge: data.session.expires_in
    })
    cookieStore.set(AUTH_REFRESH_TOKEN_COOKIE, data.session.refresh_token, {
      ...authCookieOptions,
      maxAge: 60 * 60 * 24 * 30
    })

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email || email,
        nombre: (data.user.user_metadata?.full_name as string) || (data.user.user_metadata?.name as string) || 'Usuario'
      }
    }
  } catch {
    return { success: false, message: 'Error inesperado al iniciar sesión.' }
  }
}

export async function requestPasswordReset(email: string): Promise<BackendAuthResult> {
  if (!email) {
    return { success: false, message: 'Debes ingresar un correo electrónico.' }
  }

  try {
    const supabase = createSupabaseServerAuthClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      return { success: false, message: toSpanishAuthMessage(error.message) || 'No se pudo procesar la solicitud.' }
    }

    return {
      success: true,
      message: 'Te enviamos un correo para restablecer tu contraseña.'
    }
  } catch {
    return { success: false, message: 'Error inesperado al solicitar el restablecimiento.' }
  }
}

export async function registerWithPassword(input: RegisterInput): Promise<BackendAuthResult> {
  const { name, email, password, confirmPassword } = input

  if (!name || !email || !password || !confirmPassword) {
    return { success: false, message: 'Todos los campos son obligatorios.' }
  }

  if (password.length < 8) {
    return { success: false, message: 'La contraseña debe tener al menos 8 caracteres.' }
  }

  if (password !== confirmPassword) {
    return { success: false, message: 'Las contraseñas no coinciden.' }
  }

  try {
    const supabase = createSupabaseServerAuthClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    })

    if (error) {
      return { success: false, message: toSpanishAuthMessage(error.message) || 'No se pudo crear la cuenta.' }
    }

    return {
      success: true,
      message: 'Cuenta creada correctamente. Ahora inicia sesión con tu correo y contraseña.',
      user: data.user
        ? {
          id: data.user.id,
          email: data.user.email || email,
          nombre: name
        }
        : undefined
    }
  } catch {
    return { success: false, message: 'Error inesperado al crear la cuenta.' }
  }
}

export async function logoutCurrentUser(cookieStore: CookieStoreLike): Promise<void> {
  const accessToken = cookieStore.get(AUTH_ACCESS_TOKEN_COOKIE)?.value

  if (accessToken) {
    try {
      const supabase = createSupabaseServerAuthClient()
      await supabase.auth.signOut()
    } catch {
      // Limpiar las cookies de todos modos, incluso si ocurre un error en Supabase.
    }
  }

  clearAuthCookies(cookieStore)
}

export async function getCurrentUserFromCookie(cookieStore: CookieStoreLike): Promise<AuthenticatedUser | null> {
  const accessToken = cookieStore.get(AUTH_ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return null
  }

  try {
    const supabase = createSupabaseServerAuthClient()
    const { data, error } = await supabase.auth.getUser(accessToken)

    if (error || !data.user) {
      return null
    }

    return {
      id: data.user.id,
      email: data.user.email || '',
      nombre: (data.user.user_metadata?.full_name as string) || (data.user.user_metadata?.name as string) || 'Usuario'
    }
  } catch {
    return null
  }
}
