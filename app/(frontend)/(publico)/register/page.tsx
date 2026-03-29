"use client"

import type { FormEvent } from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthAlert from '../../modules/auth/components/AuthAlert'
import AuthFormField from '../../modules/auth/components/AuthFormField'
import AuthPasswordField from '../../modules/auth/components/AuthPasswordField'
import AuthShell from '../../modules/auth/components/AuthShell'
import { useRedirectIfAuthenticated } from '../../modules/auth/hooks/useRedirectIfAuthenticated'
import { registerUser } from '../../modules/auth/services/authService'
import { authUiDelay, writeAuthFlash } from '../../modules/auth/utils/authUi'
import StatusScreen from '../../shared/components/StatusScreen'

export default function CrearCuenta() {
  const router = useRouter()
  const isCheckingSession = useRedirectIfAuthenticated()
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    document.title = 'Mis Finanzas - Registrarse'
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    await authUiDelay()

    const result = registerUser({
      name,
      email,
      password,
      confirmPassword
    })

    if (!result.ok) {
      setError(result.message)
      setIsLoading(false)
      return
    }

    writeAuthFlash({
      email: result.user.email || email.trim().toLowerCase(),
      message: 'Cuenta creada correctamente. Ahora inicia sesión con tu correo y contraseña.'
    })

    router.push('/login')
  }

  if (isCheckingSession) {
    return <StatusScreen message="Cargando sesión..." />
  }

  return (
    <AuthShell
      activeView="register"
      title="Crea tu cuenta"
      description="Empieza a organizar tus finanzas con una cuenta personal."
      footer={(
        <p className="small text-secondary mb-0 mt-4 text-center">
          ¿Ya tienes una cuenta?{' '}
          <Link className="text-decoration-none fw-semibold" href="/login">
            Inicia sesión
          </Link>
        </p>
      )}
    >
      <form className="d-grid gap-3" onSubmit={handleSubmit}>
        <AuthFormField
          autoComplete="name"
          autoFocus
          icon="person"
          id="register-name"
          label="Nombre completo"
          placeholder="Tu nombre"
          required
          value={name}
          onChange={setName}
        />

        <AuthFormField
          autoComplete="email"
          icon="mail"
          id="register-email"
          label="Correo electrónico"
          placeholder="correo@ejemplo.com"
          required
          type="email"
          value={email}
          onChange={setEmail}
        />

        <AuthPasswordField
          autoComplete="new-password"
          id="register-password"
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          required
          value={password}
          onChange={setPassword}
        />

        <AuthPasswordField
          autoComplete="new-password"
          id="register-confirm-password"
          label="Confirmar contraseña"
          placeholder="Repite la contraseña"
          required
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        <AuthAlert message={error} />

        <button
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          <span className="material-symbols-outlined">person_add</span>
        </button>
      </form>
    </AuthShell>
  )
}
