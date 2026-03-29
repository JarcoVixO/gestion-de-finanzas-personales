"use client"

import type { FormEvent } from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthAlert from '../../modules/auth/components/AuthAlert'
import AuthFormField from '../../modules/auth/components/AuthFormField'
import AuthPasswordField from '../../modules/auth/components/AuthPasswordField'
import AuthShell from '../../modules/auth/components/AuthShell'
import ResetPasswordModal from '../../modules/auth/components/ResetPasswordModal'
import { useRedirectIfAuthenticated } from '../../modules/auth/hooks/useRedirectIfAuthenticated'
import { login } from '../../modules/auth/services/authService'
import { authUiDelay, clearAuthFlash, readAuthFlash } from '../../modules/auth/utils/authUi'
import StatusScreen from '../../shared/components/StatusScreen'

interface ResetPasswordSuccessPayload {
  email: string
  message: string
}

export default function LoginPage() {
  const router = useRouter()
  const isCheckingSession = useRedirectIfAuthenticated()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false)

  useEffect(() => {
    document.title = 'Mis Finanzas - Iniciar sesión'
  }, [])

  useEffect(() => {
    const flash = readAuthFlash()

    if (!flash) {
      return
    }

    if (flash.email) {
      setEmail(flash.email)
    }

    if (flash.message) {
      setSuccess(flash.message)
    }

    clearAuthFlash()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim() || !password.trim()) {
      setError('Correo y contraseña son obligatorios.')
      return
    }

    setIsLoading(true)
    await authUiDelay()

    const user = login(email, password)

    if (!user) {
      setError('Correo o contraseña incorrectos.')
      setIsLoading(false)
      return
    }

    router.push('/finanzas')
  }

  const handleResetSuccess = ({ email: nextEmail, message }: ResetPasswordSuccessPayload): void => {
    setEmail(nextEmail)
    setPassword('')
    setError('')
    setSuccess(message)
  }

  if (isCheckingSession) {
    return <StatusScreen message="Cargando sesión..." />
  }

  return (
    <>
      <AuthShell
        activeView="login"
        title="Inicia sesión"
        description="Accede a tus transacciones, carteras y presupuestos."
        footer={(
          <p className="small text-secondary mb-0 mt-4 text-center">
            ¿Aún no tienes una cuenta?{' '}
            <Link className="text-decoration-none fw-semibold" href="/register">
              Crea una cuenta
            </Link>
          </p>
        )}
      >
        <form className="d-grid gap-3" onSubmit={handleSubmit}>
          <AuthFormField
            autoComplete="email"
            autoFocus
            icon="mail"
            id="login-email"
            label="Correo electrónico"
            placeholder="correo@ejemplo.com"
            required
            type="email"
            value={email}
            onChange={setEmail}
          />

          <AuthPasswordField
            autoComplete="current-password"
            id="login-password"
            label="Contraseña"
            placeholder="••••••••"
            required
            value={password}
            onChange={setPassword}
          />

          <AuthAlert message={error} />
          <AuthAlert message={success} variant="success" />

          <div className="d-flex align-items-center justify-content-between">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="recordarme" />
              <label className="form-check-label small text-secondary" htmlFor="recordarme">
                Recordarme
              </label>
            </div>
            <button
              className="btn btn-link text-decoration-none small p-0"
              type="button"
              onClick={() => setIsResetModalOpen(true)}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Iniciar sesión'}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </form>
      </AuthShell>

      {isResetModalOpen && (
        <ResetPasswordModal
          defaultEmail={email.trim()}
          onClose={() => setIsResetModalOpen(false)}
          onSuccess={handleResetSuccess}
        />
      )}
    </>
  )
}
