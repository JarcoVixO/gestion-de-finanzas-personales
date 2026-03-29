import type {
  AuthUser,
  RegisterUserInput,
  RegisterUserResult,
  ResetPasswordResult,
  StoredAuthUser
} from '../types'
import { root } from '../data/authData'

const STORAGE_KEY = 'usuarioActivo'
const PASSWORD_OVERRIDES_KEY = 'passwordOverrides'
const REGISTERED_USERS_KEY = 'registeredUsers'

const isBrowser = (): boolean => typeof window !== 'undefined'

const sanitizeUser = (user: AuthUser | StoredAuthUser | null): AuthUser | null => {
  if (!user) {
    return null
  }

  if ('password' in user) {
    const { password: _password, ...safeUser } = user
    return safeUser
  }

  return user
}

const normalizeEmail = (email: string | null | undefined): string => String(email || '').trim().toLowerCase()

const isSeedUserEmail = (email: string): boolean => {
  const normalizedEmail = normalizeEmail(email)
  return root.some((item) => item.email.toLowerCase() === normalizedEmail)
}

const normalizeRegisteredUser = (user: unknown): StoredAuthUser | null => {
  if (!user || typeof user !== 'object') {
    return null
  }

  const candidate = user as Partial<StoredAuthUser>
  const email = normalizeEmail(candidate.email)
  const password = typeof candidate.password === 'string' ? candidate.password : ''
  const nombre = typeof candidate.nombre === 'string' && candidate.nombre.trim() ? candidate.nombre.trim() : 'Usuario'

  if (!email || !password) {
    return null
  }

  return {
    id: typeof candidate.id === 'number' && Number.isFinite(candidate.id) ? candidate.id : Date.now(),
    nombre,
    email,
    password
  }
}

const getRegisteredUsers = (): StoredAuthUser[] => {
  if (!isBrowser()) {
    return []
  }

  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as unknown

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map((item) => normalizeRegisteredUser(item))
      .filter((item): item is StoredAuthUser => Boolean(item))
  } catch (error) {
    return []
  }
}

const saveRegisteredUsers = (users: StoredAuthUser[]): boolean => {
  if (!isBrowser()) {
    return false
  }

  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users))
    return true
  } catch (error) {
    return false
  }
}

const getPasswordOverrides = (): Record<string, string> => {
  if (!isBrowser()) {
    return {}
  }

  try {
    const raw = localStorage.getItem(PASSWORD_OVERRIDES_KEY)

    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw) as unknown

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }

    return Object.entries(parsed).reduce<Record<string, string>>((accumulator, [key, value]) => {
      if (typeof value === 'string') {
        accumulator[key] = value
      }

      return accumulator
    }, {})
  } catch (error) {
    return {}
  }
}

const savePasswordOverrides = (overrides: Record<string, string>): boolean => {
  if (!isBrowser()) {
    return false
  }

  try {
    localStorage.setItem(PASSWORD_OVERRIDES_KEY, JSON.stringify(overrides))
    return true
  } catch (error) {
    return false
  }
}

const getUserByEmail = (email: string): StoredAuthUser | null => {
  const normalizedEmail = normalizeEmail(email)
  const registeredUser = getRegisteredUsers().find((item) => item.email === normalizedEmail)

  if (registeredUser) {
    return registeredUser
  }

  return root.find((item) => item.email.toLowerCase() === normalizedEmail) || null
}

const getExpectedPassword = (email: string): string | null => {
  const normalizedEmail = normalizeEmail(email)
  const user = getUserByEmail(normalizedEmail)

  if (!user) {
    return null
  }

  if (!isSeedUserEmail(normalizedEmail)) {
    return user.password || null
  }

  const overrides = getPasswordOverrides()
  return overrides[normalizedEmail] || user.password || null
}

export function login(email: string, password: string): AuthUser | null {
  if (!isBrowser()) {
    return null
  }

  const normalizedEmail = normalizeEmail(email)
  const user = getUserByEmail(normalizedEmail)
  const expectedPassword = getExpectedPassword(normalizedEmail)

  if (!user || expectedPassword !== password) {
    return null
  }

  const safeUser = sanitizeUser(user)

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
  } catch (error) {
    return null
  }

  return safeUser
}

export function registerUser({
  name,
  email,
  password,
  confirmPassword
}: RegisterUserInput): RegisterUserResult {
  if (!isBrowser()) {
    return { ok: false, message: 'No se pudo registrar la cuenta en este entorno.' }
  }

  const normalizedName = (name || '').trim()
  const normalizedEmail = normalizeEmail(email)
  const sanitizedPassword = (password || '').trim()
  const sanitizedConfirmPassword = (confirmPassword || '').trim()

  if (!normalizedName || !normalizedEmail || !sanitizedPassword || !sanitizedConfirmPassword) {
    return { ok: false, message: 'Todos los campos son obligatorios.' }
  }

  if (sanitizedPassword.length < 8) {
    return { ok: false, message: 'La contraseña debe tener al menos 8 caracteres.' }
  }

  if (sanitizedPassword !== sanitizedConfirmPassword) {
    return { ok: false, message: 'Las contraseñas no coinciden.' }
  }

  if (getUserByEmail(normalizedEmail)) {
    return { ok: false, message: 'Ya existe una cuenta con ese correo.' }
  }

  const registeredUsers = getRegisteredUsers()
  const nextId = [...root, ...registeredUsers].reduce((max, item) => {
    const numericId = Number.parseInt(String(item.id), 10)
    return Number.isNaN(numericId) ? max : Math.max(max, numericId)
  }, 0) + 1

  const newUser: StoredAuthUser = {
    id: nextId,
    nombre: normalizedName,
    email: normalizedEmail,
    password: sanitizedPassword
  }

  if (!saveRegisteredUsers([newUser, ...registeredUsers])) {
    return { ok: false, message: 'No se pudo guardar la cuenta.' }
  }

  return {
    ok: true,
    message: 'Cuenta creada correctamente.',
    user: sanitizeUser(newUser) as AuthUser
  }
}

export function resetPassword(email: string, newPassword: string): ResetPasswordResult {
  if (!isBrowser()) {
    return { ok: false, message: 'No se pudo restablecer la contraseña en este entorno.' }
  }

  const normalizedEmail = normalizeEmail(email)
  const sanitizedPassword = (newPassword || '').trim()

  if (!normalizedEmail) {
    return { ok: false, message: 'Debes ingresar un correo electrónico.' }
  }

  if (sanitizedPassword.length < 8) {
    return { ok: false, message: 'La nueva contraseña debe tener al menos 8 caracteres.' }
  }

  const user = getUserByEmail(normalizedEmail)

  if (!user) {
    return { ok: false, message: 'No existe una cuenta con ese correo.' }
  }

  if (!isSeedUserEmail(normalizedEmail)) {
    const registeredUsers = getRegisteredUsers()
    const nextRegisteredUsers = registeredUsers.map((item) => (
      item.email === normalizedEmail
        ? { ...item, password: sanitizedPassword }
        : item
    ))

    if (!saveRegisteredUsers(nextRegisteredUsers)) {
      return { ok: false, message: 'No se pudo guardar la nueva contraseña.' }
    }

    return { ok: true, message: 'Contraseña actualizada correctamente.' }
  }

  const overrides = getPasswordOverrides()
  const nextOverrides = {
    ...overrides,
    [normalizedEmail]: sanitizedPassword
  }

  if (!savePasswordOverrides(nextOverrides)) {
    return { ok: false, message: 'No se pudo guardar la nueva contraseña.' }
  }

  return { ok: true, message: 'Contraseña actualizada correctamente.' }
}

export function logout(): void {
  if (!isBrowser()) {
    return
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    return
  }
}

export function getSession(): AuthUser | null {
  if (!isBrowser()) {
    return null
  }

  let sessionRaw: string | null = null

  try {
    sessionRaw = localStorage.getItem(STORAGE_KEY)
  } catch (error) {
    return null
  }

  if (!sessionRaw) {
    return null
  }

  try {
    const session = JSON.parse(sessionRaw) as AuthUser | StoredAuthUser
    const safeSession = sanitizeUser(session)

    if (!safeSession?.email) {
      logout()
      return null
    }

    return safeSession
  } catch (error) {
    logout()
    return null
  }
}
