"use client"

import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TransactionFormModal from '@/features/finanzas/TransactionFormModal'
import {
  createEmptyTransactionForm,
  createTransactionFormFromTransaction,
  getSignedTransactionAmount
} from '@/features/finanzas/transactions'
import AppLayout from '@/shared/components/AppLayout'
import withAuth from '@/shared/guards/withAuth'
import { useAppStore } from '@/shared/hooks/useAppStore'
import type { Transaction, TransactionFormState } from '@/shared/types/finance'

function EditarTransaccion() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { transactions, accounts, updateTransaction } = useAppStore()
  const [form, setForm] = useState<TransactionFormState>(createEmptyTransactionForm())
  const transactionId = searchParams.get('id')

  const transaction = useMemo<Transaction | undefined>(
    () => transactions.find((tx) => String(tx.id) === String(transactionId)),
    [transactionId, transactions]
  )

  useEffect(() => {
    if (!transactionId) {
      router.replace('/finanzas')
    }
  }, [router, transactionId])

  useEffect(() => {
    if (!transaction) {
      return
    }

    setForm(createTransactionFormFromTransaction(transaction))
  }, [transaction])

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

    if (!transaction) {
      return
    }

    const trimmedDescription = form.description.trim()
    const parsedAmount = Number.parseFloat(form.amount || '0')

    if (!trimmedDescription || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return
    }

    updateTransaction({
      id: transaction.id,
      description: trimmedDescription,
      amount: getSignedTransactionAmount(parsedAmount, form.type),
      date: form.date,
      accountId: form.accountId || null
    })

    closeModal()
  }

  if (transactionId && !transaction) {
    return (
      <AppLayout title="Editar Transacción - Mi Finanzas">
        <div className="container-xl py-4 py-lg-5">
          <header className="page-header-panel">
            <div>
              <h2 className="h2 fw-bold mb-1">Editar transacción</h2>
              <p className="text-secondary mb-0">No encontramos esa transacción.</p>
            </div>
          </header>
          <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
            Volver a transacciones
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout title="Editar Transacción - Mi Finanzas">
      <div className="container-xl py-4 py-lg-5">
        <header className="page-header-panel">
          <div>
            <h2 className="h2 fw-bold mb-1">Editar transacción</h2>
            <p className="text-secondary mb-0">Actualiza los datos del movimiento seleccionado.</p>
          </div>
        </header>
      </div>

      <TransactionFormModal
        accounts={accounts}
        allowEmptyAccount
        form={form}
        mode="edit"
        showBudgetField={false}
        showCategoryField={false}
        submitLabel="Guardar cambios"
        onClose={closeModal}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
      />
    </AppLayout>
  )
}

export default withAuth(EditarTransaccion)

