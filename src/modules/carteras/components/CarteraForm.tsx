'use client'

import type { FormEvent, MouseEvent } from 'react'
import type { CarteraSummary, CreateCarteraInput, UpdateCarteraInput } from '../cartera.schema'
import { useState, useEffect } from 'react'

interface CarteraFormProps {
  carteraToEdit?: CarteraSummary | null
  onSave: (input: CreateCarteraInput) => void
  onClose: () => void
}

export default function CarteraForm({ carteraToEdit, onSave, onClose }: CarteraFormProps) {
  const isEditing = Boolean(carteraToEdit)

  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [goal, setGoal] = useState('')

  useEffect(() => {
    if (carteraToEdit) {
      setName(carteraToEdit.name)
      setAmount(String(carteraToEdit.balance))
      setGoal(String(carteraToEdit.goal))
    } else {
      setName('')
      setAmount('')
      setGoal('')
    }
  }, [carteraToEdit])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return

    const parsedAmount = Number.parseFloat(amount || '0')
    const parsedGoal = Number.parseFloat(goal || '0')

    onSave({
      name: trimmedName,
      balance: Number.isFinite(parsedAmount) ? parsedAmount : 0,
      goal: parsedGoal > 0 ? parsedGoal : undefined
    })
  }

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <>
      <div
        className="modal d-block"
        role="dialog"
        style={{ zIndex: 1085 }}
        onClick={handleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isEditing ? 'Editar cartera' : 'Crear cartera'}
              </h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body d-grid gap-3">
                <div>
                  <label className="form-label fw-semibold">Nombre de la cartera</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Ej. Ahorros Navidad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="form-label fw-semibold">Monto inicial</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label fw-semibold">Meta</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      className="form-control"
                      type="number"
                      min="1"
                      placeholder="Ej. 5000"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Guardar cambios' : 'Crear cartera'}
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