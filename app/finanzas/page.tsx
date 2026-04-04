'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import AppLayout from '@/src/shared/components/AppLayout'
import { useTransacciones } from '@/src/modules/finanzas/hooks/useTransacciones'
import { useCarteraStore } from '@/src/modules/carteras/hooks/useCarteraStore'
import TransaccionTabs from '@/src/modules/finanzas/components/TransaccionTabs'
import TransaccionTable from '@/src/modules/finanzas/components/TransaccionTable'
import TransaccionFormModal from '@/src/modules/finanzas/components/TransaccionFormModal'
import TransaccionDeleteModal from '@/src/modules/finanzas/components/TransaccionDeleteModal'
import {
  createEmptyForm,
  formFromTransaccion,
  getSignedAmount
} from '@/src/modules/finanzas/transaccion.schema'
import type {
  Transaccion,
  TransaccionFormState
} from '@/src/modules/finanzas/transaccion.schema'

export default function FinanzasPage() {
  const { transacciones, filtradas, isLoading, crear, actualizar, eliminar } = useTransacciones()
  const { carteras } = useCarteraStore()

  const [transaccionToEdit, setTransaccionToEdit] = useState<Transaccion | null>(null)
  const [transaccionToDelete, setTransaccionToDelete] = useState<Transaccion | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState<TransaccionFormState>(createEmptyForm())

  const openCreateForm = () => {
    setTransaccionToEdit(null)
    setForm(createEmptyForm())
    setIsFormOpen(true)
  }

  const openEditForm = (tx: Transaccion) => {
    setTransaccionToEdit(tx)
    setForm(formFromTransaccion(tx))
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setTransaccionToEdit(null)
    setForm(createEmptyForm())
  }

  const handleFieldChange = <K extends keyof TransaccionFormState>(
    field: K,
    value: TransaccionFormState[K]
  ) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const amount = getSignedAmount(Number.parseFloat(form.amount), form.type)

    if (transaccionToEdit) {
      actualizar(transaccionToEdit.id, {
        description: form.description,
        amount,
        date: form.date,
        accountId: form.accountId,
        category: form.category
      })
    } else {
      crear({
        description: form.description,
        amount,
        date: form.date,
        accountId: form.accountId,
        category: form.category
      })
    }
    closeForm()
  }

  const handleConfirmDelete = () => {
    if (!transaccionToDelete) return
    eliminar(transaccionToDelete.id)
    setTransaccionToDelete(null)
  }

  return (
    <AppLayout title="Transacciones - Mi Finanzas">
      <div className="container-xl py-4 py-lg-5">

        {/* Header */}
        <header className="page-header-panel">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <h2 className="h2 fw-bold mb-1">Transacciones</h2>
              <p className="text-secondary mb-0">Gestiona y analiza tus movimientos financieros</p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-primary d-inline-flex align-items-center gap-2"
                type="button"
                onClick={openCreateForm}
              >
                <span className="material-symbols-outlined fs-6">add</span>
                Nueva Transacción
              </button>
            </div>
          </div>
        </header>

        <TransaccionTabs />

        <TransaccionTable
          transacciones={filtradas}
          total={transacciones.length}
          isLoading={isLoading}
          onEdit={openEditForm}
          onDelete={setTransaccionToDelete}
        />

      </div>

      {isFormOpen && (
        <TransaccionFormModal
          form={form}
          carteras={carteras}
          mode={transaccionToEdit ? 'edit' : 'create'}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}

      {transaccionToDelete && (
        <TransaccionDeleteModal
          transaccion={transaccionToDelete}
          onConfirm={handleConfirmDelete}
          onClose={() => setTransaccionToDelete(null)}
        />
      )}
    </AppLayout>
  )
}