"use client"

import type { FormEvent, MouseEvent } from 'react'
import { useState } from 'react'
import AuthAlert from './AuthAlert'
import AuthFormField from './AuthFormField'
import AuthPasswordField from './AuthPasswordField'
import { resetPassword } from '../services/authService'
import { authUiDelay } from '../utils/authUi'

interface ResetPasswordSuccessPayload {
  email: string
  message: string
}

interface ResetPasswordModalProps {
  defaultEmail?: string
  onClose: () => void
  onSuccess: (payload: ResetPasswordSuccessPayload) => void
}

export default function ResetPasswordModal({
  defaultEmail = '',
  onClose,
  onSuccess
}: ResetPasswordModalProps) {
  const [email, setEmail] = useState<string>(defaultEmail)
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Debes ingresar un correo electrónico.')
      return
    }

    if (newPassword.trim().length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setIsLoading(true)
    await authUiDelay(350)

    const result = resetPassword(email, newPassword)

    if (!result.ok) {
      setError(result.message)
      setIsLoading(false)
      return
    }

    onSuccess({
      email: email.trim().toLowerCase(),
      message: 'Contraseña restablecida. Ya puedes iniciar sesión con tu nueva contraseña.'
    })

    setIsLoading(false)
    onClose()
  }

  return (
    <>
      <div
        className="modal d-block wallet-modal"
        tabIndex={-1}
        role="dialog"
        style={{ zIndex: 1085 }}
        onClick={(event: MouseEvent<HTMLDivElement>) => {
          if (event.target === event.currentTarget) {
            onClose()
          }
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Restablecer contraseña</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body d-grid gap-3">
                <AuthFormField
                  autoFocus
                  icon="mail"
                  id="reset-email"
                  label="Correo electrónico"
                  placeholder="correo@ejemplo.com"
                  required
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
                <AuthPasswordField
                  id="reset-password"
                  label="Nueva contraseña"
                  placeholder="Mínimo 8 caracteres"
                  required
                  value={newPassword}
                  onChange={setNewPassword}
                />
                <AuthPasswordField
                  id="reset-confirm-password"
                  label="Confirmar contraseña"
                  placeholder="Repite la nueva contraseña"
                  required
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />
                <AuthAlert message={error} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar nueva contraseña'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: 1080 }} />
    </>
  )
}
