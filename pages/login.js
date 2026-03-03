import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getSession, login } from '../src/services/authService'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  useEffect(() => {
    const session = getSession()

    if (session) {
      router.replace('/transacciones')
      return
    }

    setIsCheckingSession(false)
  }, [router])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Correo y contraseña son obligatorios')
      return
    }

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 450))

    const user = login(email, password)

    if (!user) {
      setError('Correo o contraseña incorrectos')
      setIsLoading(false)
      return
    }

    router.push('/transacciones')
  }

  if (isCheckingSession) {
    return (
      <div className="d-flex min-vh-100 align-items-center justify-content-center bg-body-tertiary text-secondary small fw-medium">
        Cargando sesión...
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Mis Finanzas - Iniciar sesión</title>
      </Head>

      <div className="container-fluid min-vh-100 bg-body-tertiary">
        <div className="row g-0 min-vh-100">
          <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center p-5 bg-light border-end">
            <div className="text-primary d-flex align-items-center gap-2 mb-4">
              <span className="material-symbols-outlined fs-2">account_balance_wallet</span>
              <h2 className="h3 fw-bold mb-0">Mi Finanzas</h2>
            </div>

            <div className="mb-4">
              <h1 className="display-5 fw-bold text-dark mb-3">
                Controla tus <br />
                <span className="text-primary">finanzas personales</span>
              </h1>
              <p className="lead text-secondary mb-0">
                Registra movimientos, controla tus presupuestos y toma mejores decisiones cada mes.
              </p>
            </div>

            <div className="row g-3 pt-2">
              <div className="col-md-6">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <span className="material-symbols-outlined text-primary mb-2">query_stats</span>
                    <h4 className="h6 fw-bold mb-2">Seguimiento claro</h4>
                    <p className="small text-secondary mb-0">Visualiza tus ingresos y gastos en un solo lugar.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <span className="material-symbols-outlined text-primary mb-2">shield</span>
                    <h4 className="h6 fw-bold mb-2">Acceso seguro</h4>
                    <p className="small text-secondary mb-0">Tu sesión se guarda localmente para continuar rápido.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-3 p-lg-5">
            <div className="card border-0 shadow-sm w-100" style={{ maxWidth: '480px' }}>
              <div className="card-body p-4 p-lg-5">
                <div className="d-flex align-items-center justify-content-center gap-2 text-primary mb-4 d-lg-none">
                  <span className="material-symbols-outlined fs-3">account_balance_wallet</span>
                  <h2 className="h5 fw-bold mb-0">Mi Finanzas</h2>
                </div>

                <ul className="nav nav-tabs mb-4" role="tablist">
                  <li className="nav-item flex-fill" role="presentation">
                    <button className="nav-link active w-100 fw-semibold" type="button">
                      Iniciar sesión
                    </button>
                  </li>
                  <li className="nav-item flex-fill" role="presentation">
                    <button className="nav-link disabled w-100" type="button" disabled>
                      Registrarse
                    </button>
                  </li>
                </ul>

                <form className="d-grid gap-3" onSubmit={handleSubmit}>
                  <div>
                    <label className="form-label">Correo electrónico</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <span className="material-symbols-outlined fs-6">mail</span>
                      </span>
                      <input
                        className="form-control"
                        placeholder="correo@ejemplo.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Contraseña</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <span className="material-symbols-outlined fs-6">lock</span>
                      </span>
                      <input
                        className="form-control"
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <span className="material-symbols-outlined fs-6">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger py-2 mb-0" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="d-flex align-items-center justify-content-between">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="recordarme" />
                      <label className="form-check-label small text-secondary" htmlFor="recordarme">
                        Recordarme
                      </label>
                    </div>
                    <a className="small text-decoration-none" href="#">
                      ¿Olvidaste tu contraseña?
                    </a>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
