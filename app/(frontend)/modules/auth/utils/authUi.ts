import type { AuthFlashMessage } from '../types'

const AUTH_FLASH_KEY = 'authFlash'

const isBrowser = (): boolean => typeof window !== 'undefined'

const isAuthFlashMessage = (value: unknown): value is AuthFlashMessage => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as AuthFlashMessage

  return (
    (candidate.email === undefined || typeof candidate.email === 'string') &&
    (candidate.message === undefined || typeof candidate.message === 'string')
  )
}

export const authUiDelay = (duration = 450): Promise<void> => (
  new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
)

export function readAuthFlash(): AuthFlashMessage | null {
  if (!isBrowser()) {
    return null
  }

  try {
    const raw = sessionStorage.getItem(AUTH_FLASH_KEY)

    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)

    if (!isAuthFlashMessage(parsed)) {
      return null
    }

    return parsed
  } catch (error) {
    return null
  }
}

export function writeAuthFlash(payload: AuthFlashMessage): void {
  if (!isBrowser()) {
    return
  }

  try {
    sessionStorage.setItem(AUTH_FLASH_KEY, JSON.stringify(payload))
  } catch (error) {
    return
  }
}

export function clearAuthFlash(): void {
  if (!isBrowser()) {
    return
  }

  try {
    sessionStorage.removeItem(AUTH_FLASH_KEY)
  } catch (error) {
    return
  }
}
