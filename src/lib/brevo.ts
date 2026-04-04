export interface BrevoEmailRecipient {
  email: string
  nombre?: string
}

export interface BrevoTransactionalEmailPayload {
  to: BrevoEmailRecipient[]
  subject: string
  htmlContent: string
  textContent?: string
}

export interface BrevoClientContract {
  sendTransactionalEmail: (payload: BrevoTransactionalEmailPayload) => Promise<void>
}