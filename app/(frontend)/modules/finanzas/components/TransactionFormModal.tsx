"use client"

import type { ChangeEvent, FormEvent, MouseEvent } from 'react'
import type { Account, Budget, TransactionFormState } from '../../../shared/types/finance'

type TransactionModalMode = 'create' | 'edit'

interface TransactionFormModalProps {
  accounts: Account[]
  allowEmptyAccount?: boolean
  budgets?: Budget[]
  disableSubmit?: boolean
  form: TransactionFormState
  mode?: TransactionModalMode
  onClose: () => void
  onFieldChange: <K extends keyof TransactionFormState>(field: K, value: TransactionFormState[K]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  showBudgetField?: boolean
  showCategoryField?: boolean
  submitLabel: string
}

export default function TransactionFormModal({
  accounts,
  allowEmptyAccount = false,
  budgets = [],
  disableSubmit = false,
  form,
  mode = 'create',
  onClose,
  onFieldChange,
  onSubmit,
  showBudgetField = true,
  showCategoryField = true,
  submitLabel
}: TransactionFormModalProps) {
  const updateField = <K extends keyof TransactionFormState>(field: K) => (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onFieldChange(field, event.target.value as TransactionFormState[K])
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
              <h5 className="modal-title">{mode === 'edit' ? 'Editar transacción' : 'Nueva transacción'}</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body d-grid gap-3">
                <div>
                  <label className="form-label fw-semibold">Tipo</label>
                  <div className="btn-group w-100" role="group" aria-label="Tipo de transacción">
                    <input
                      checked={form.type === 'expense'}
                      className="btn-check"
                      id={`${mode}-tx-type-expense`}
                      name={`${mode}-tx-type`}
                      type="radio"
                      value="expense"
                      onChange={() => onFieldChange('type', 'expense')}
                    />
                    <label className="btn btn-outline-danger" htmlFor={`${mode}-tx-type-expense`}>
                      Gasto
                    </label>

                    <input
                      checked={form.type === 'income'}
                      className="btn-check"
                      id={`${mode}-tx-type-income`}
                      name={`${mode}-tx-type`}
                      type="radio"
                      value="income"
                      onChange={() => onFieldChange('type', 'income')}
                    />
                    <label className="btn btn-outline-success" htmlFor={`${mode}-tx-type-income`}>
                      Ingreso
                    </label>
                  </div>
                </div>

                <div>
                  <label className="form-label fw-semibold">Descripción / Nombre</label>
                  <input
                    autoFocus
                    className="form-control"
                    placeholder="Ej. Compra semanal"
                    type="text"
                    value={form.description}
                    onChange={updateField('description')}
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
                        value={form.amount}
                        onChange={updateField('amount')}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Fecha</label>
                    <input
                      className="form-control"
                      type="date"
                      value={form.date}
                      onChange={updateField('date')}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label fw-semibold">Cuenta / Cartera</label>
                  <select
                    className="form-select"
                    value={form.accountId}
                    onChange={updateField('accountId')}
                    required={!allowEmptyAccount}
                  >
                    {allowEmptyAccount && <option value="">Sin cuenta</option>}
                    {!allowEmptyAccount && accounts.length === 0 && (
                      <option value="">No hay carteras disponibles</option>
                    )}
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>

                {showBudgetField && (
                  <div>
                    <label className="form-label fw-semibold">Presupuesto</label>
                    <select
                      className="form-select"
                      value={form.budgetId}
                      onChange={updateField('budgetId')}
                      aria-describedby="budget-help-text"
                    >
                      <option value="">Sin presupuesto</option>
                      {budgets.map((budget) => (
                        <option key={budget.id} value={budget.id}>
                          {budget.name}
                        </option>
                      ))}
                    </select>
                    <p id="budget-help-text" className="form-text text-secondary opacity-75 mb-0">
                      Este campo es opcional
                    </p>
                  </div>
                )}

                {showCategoryField && (
                  <div>
                    <label className="form-label fw-semibold">Categoría</label>
                    <select
                      className="form-select"
                      value={form.category}
                      onChange={updateField('category')}
                    >
                      <option value="food">Comida y Restaurantes</option>
                      <option value="transport">Transporte</option>
                      <option value="savings">Ahorros</option>
                      <option value="salary">Salario</option>
                      <option value="leisure">Ocio</option>
                      <option value="other">Otros</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={disableSubmit}>
                  {submitLabel}
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
