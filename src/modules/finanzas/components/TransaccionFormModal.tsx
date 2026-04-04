'use client'

import type { ChangeEvent, FormEvent, MouseEvent } from 'react'
import type { CarteraOption } from '@/src/modules/carteras/cartera.schema'
import type { TransaccionFormState } from '../transaccion.schema'

interface TransaccionFormModalProps {
  form: TransaccionFormState
  carteras: CarteraOption[]
  mode?: 'create' | 'edit'
  onFieldChange: <K extends keyof TransaccionFormState>(field: K, value: TransaccionFormState[K]) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

export default function TransaccionFormModal({
  form,
  carteras,
  mode = 'create',
  onFieldChange,
  onSubmit,
  onClose
}: TransaccionFormModalProps) {
  const updateField = <K extends keyof TransaccionFormState>(field: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onFieldChange(field, e.target.value as TransaccionFormState[K])

  return (
    <>
      <div
        className="modal d-block"
        role="dialog"
        style={{ zIndex: 1085 }}
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {mode === 'edit' ? 'Editar transacción' : 'Nueva transacción'}
              </h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body d-grid gap-3">

                {/* Tipo */}
                <div>
                  <label className="form-label fw-semibold">Tipo</label>
                  <div className="btn-group w-100" role="group">
                    <input
                      className="btn-check"
                      id={`${mode}-type-expense`}
                      name={`${mode}-type`}
                      type="radio"
                      value="expense"
                      checked={form.type === 'expense'}
                      onChange={() => onFieldChange('type', 'expense')}
                    />
                    <label className="btn btn-outline-danger" htmlFor={`${mode}-type-expense`}>
                      Gasto
                    </label>
                    <input
                      className="btn-check"
                      id={`${mode}-type-income`}
                      name={`${mode}-type`}
                      type="radio"
                      value="income"
                      checked={form.type === 'income'}
                      onChange={() => onFieldChange('type', 'income')}
                    />
                    <label className="btn btn-outline-success" htmlFor={`${mode}-type-income`}>
                      Ingreso
                    </label>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="form-label fw-semibold">Descripción</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Ej. Compra semanal"
                    value={form.description}
                    onChange={updateField('description')}
                    autoFocus
                  />
                </div>

                {/* Monto + Fecha */}
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Monto ($)</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        className="form-control"
                        type="number"
                        placeholder="0.00"
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

                {/* Cuenta */}
                <div>
                  <label className="form-label fw-semibold">Cuenta / Cartera</label>
                  <select
                    className="form-select"
                    value={form.accountId}
                    onChange={updateField('accountId')}
                    required
                  >
                    {carteras.length === 0 && (
                      <option value="">No hay carteras disponibles</option>
                    )}
                    {carteras.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Categoría */}
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

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {mode === 'edit' ? 'Guardar cambios' : 'Crear transacción'}
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