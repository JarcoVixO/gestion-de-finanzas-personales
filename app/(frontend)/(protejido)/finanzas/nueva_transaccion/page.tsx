"use client"

import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TransactionFormModal from '../../../modules/finanzas/components/TransactionFormModal'
import { createEmptyTransactionForm, getSignedTransactionAmount } from '../../../modules/finanzas/utils/transactions'
import AppLayout from '../../../shared/components/AppLayout'
import withAuth from '../../../shared/guards/withAuth'
import { useAppStore } from '../../../shared/hooks/useAppStore'
import type { TransactionFormState } from '../../../shared/types/finance'

function NuevaTransaccion() {
  const { accounts, budgets, addTransaction } = useAppStore()
  const [form, setForm] = useState<TransactionFormState>(createEmptyTransactionForm())
  const router = useRouter()

  useEffect(() => {
    if (!form.accountId && accounts.length > 0) {
      setForm((current) => ({
        ...current,
        accountId: accounts[0].id
      }))
    }
  }, [accounts, form.accountId])

  const closeModal = (): void => {
    router.push('/finanzas')
  }

  const handleFieldChange = <K extends keyof TransactionFormState>(
    field: K,
    value: TransactionFormState[K]
  ): void => {
    setForm((current) => ({
      ...current,
      [field]: value
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const trimmedDescription = form.description.trim()
    const parsedAmount = Number.parseFloat(form.amount || '0')

    if (!trimmedDescription || !form.accountId || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return
    }

    addTransaction({
      description: trimmedDescription,
      amount: getSignedTransactionAmount(parsedAmount, form.type),
      accountId: form.accountId,
      date: form.date,
      category: form.category,
      type: form.type
    })

    closeModal()
  }

  return (
    <AppLayout title="Nueva Transacción - Mi Finanzas">
      <div className="container-xl py-4 py-lg-5">
        <header className="page-header-panel">
          <div>
            <h2 className="h2 fw-bold mb-1">Nueva transacción</h2>
            <p className="text-secondary mb-0">Completa los datos para registrar un movimiento financiero.</p>
          </div>
        </header>
      </div>

      <TransactionFormModal
        accounts={accounts}
        budgets={budgets}
        disableSubmit={accounts.length === 0}
        form={form}
        mode="create"
        submitLabel="Guardar transacción"
        onClose={closeModal}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
      />
    </AppLayout>
  )
}

export default withAuth(NuevaTransaccion)
