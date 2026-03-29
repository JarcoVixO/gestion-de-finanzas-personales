"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Layout from '../../../../components/Layout'
import { useStore } from '../../../../hooks/useStore'
import withAuth from '../../../../src/guards/withAuth'

const toInputDate = (value) => {
  if (!value) {
    return new Date().toISOString().slice(0, 10)
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10)
  }

  return parsed.toISOString().slice(0, 10)
}

function EditarTransaccion() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { transactions, accounts, updateTransaction } = useStore()
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [type, setType] = useState('expense')
  const [accountId, setAccountId] = useState('')
  const transactionId = searchParams.get('id')

  const transaction = useMemo(
    () => transactions.find((tx) => String(tx.id) === String(transactionId)),
    [transactionId, transactions]
  )

  useEffect(() => {
    if (!transactionId) {
      router.replace('/transacciones')
    }
  }, [router, transactionId])

  useEffect(() => {
    if (!transaction) {
      return
    }

    setDescription(transaction.description || '')
    setAmount(String(Math.abs(Number(transaction.amount) || 0)))
    setDate(toInputDate(transaction.date))
    setType((Number(transaction.amount) || 0) < 0 ? 'expense' : 'income')
    setAccountId(transaction.accountId || '')
  }, [transaction])

  const closeModal = () => {
    router.push('/transacciones')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!transaction) {
      return
    }

    const trimmedDescription = description.trim()
    const parsedAmount = Number.parseFloat(amount || '0')

    if (!trimmedDescription || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return
    }

    const finalAmount = type === 'expense' ? -Math.abs(parsedAmount) : Math.abs(parsedAmount)

    updateTransaction({
      id: transaction.id,
      description: trimmedDescription,
      amount: finalAmount,
      date,
      accountId: accountId || null
    })

    closeModal()
  }

  if (transactionId && !transaction) {
    return (
      <Layout title="Editar Transacción - Mi Finanzas">
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
      </Layout>
    )
  }

  return (
    <Layout title="Editar Transacción - Mi Finanzas">
      <div className="container-xl py-4 py-lg-5">
        <header className="page-header-panel">
          <div>
            <h2 className="h2 fw-bold mb-1">Editar transacción</h2>
            <p className="text-secondary mb-0">Actualiza los datos del movimiento seleccionado.</p>
          </div>
        </header>
      </div>

      <div
        className="modal d-block wallet-modal"
        tabIndex="-1"
        role="dialog"
        style={{ zIndex: 1085 }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeModal()
          }
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar transacción</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeModal} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body d-grid gap-3">
                <div>
                  <label className="form-label fw-semibold">Tipo</label>
                  <div className="btn-group w-100" role="group" aria-label="Tipo de transacción">
                    <input
                      checked={type === 'expense'}
                      className="btn-check"
                      id="edit-tx-type-expense"
                      name="edit-tx-type"
                      type="radio"
                      value="expense"
                      onChange={() => setType('expense')}
                    />
                    <label className="btn btn-outline-danger" htmlFor="edit-tx-type-expense">
                      Gasto
                    </label>

                    <input
                      checked={type === 'income'}
                      className="btn-check"
                      id="edit-tx-type-income"
                      name="edit-tx-type"
                      type="radio"
                      value="income"
                      onChange={() => setType('income')}
                    />
                    <label className="btn btn-outline-success" htmlFor="edit-tx-type-income">
                      Ingreso
                    </label>
                  </div>
                </div>

                <div>
                  <label className="form-label fw-semibold">Descripción / Nombre</label>
                  <input
                    className="form-control"
                    placeholder="Ej. Compra semanal"
                    type="text"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    autoFocus
                  />
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Monto ($)</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        className="form-control"
                        placeholder="0.00"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Fecha</label>
                    <input
                      className="form-control"
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label fw-semibold">Cuenta / Cartera</label>
                  <select
                    className="form-select"
                    value={accountId}
                    onChange={(event) => setAccountId(event.target.value)}
                  >
                    <option value="">Sin cuenta</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: 1080 }}></div>
    </Layout>
  )
}

export default withAuth(EditarTransaccion)
