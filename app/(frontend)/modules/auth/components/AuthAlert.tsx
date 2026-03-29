interface AuthAlertProps {
  message: string
  variant?: 'danger' | 'success'
}

export default function AuthAlert({ message, variant = 'danger' }: AuthAlertProps) {
  if (!message) {
    return null
  }

  return (
    <div className={`alert alert-${variant} py-2 mb-0`} role="alert">
      {message}
    </div>
  )
}
