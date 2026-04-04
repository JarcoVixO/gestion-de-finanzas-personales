"use client"

import type { FormEvent, MouseEvent } from 'react'
import { useMemo, useState } from 'react'
import { formatBudgetDueDate, mapBudgetsWithVisuals } from '@/src/modules/presupuestos/presupuesto.actions'
import AppLayout from '@/src/shared/components/AppLayout'
import withAuth from '@/src/shared/hooks/withAuth'
import { useAppStore } from '@/src/shared/hooks/useAppStore'
import type { BudgetWithVisuals } from '@/src/shared/types/finance'

function Presupuestos() {
  const { accounts, budgets, addBudget, updateBudget, deleteBudget, addBudgetExpense } = useAppStore()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState<boolean>(false)

  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null)
  const [selectedBudget, setSelectedBudget] = useState<BudgetWithVisuals | null>(null)

  const [budgetName, setBudgetName] = useState<string>('')
  const [budgetLimit, setBudgetLimit] = useState<string>('')
  const [expenseAmount, setExpenseAmount] = useState<string>('')
  const [expenseAccountId, setExpenseAccountId] = useState<string>('')

  const [createTitle, setCreateTitle] = useState<string>('')
  const [createDueDate, setCreateDueDate] = useState<string>('')
  const [createLimit, setCreateLimit] = useState<string>('')

  const totalBudgeted = budgets.reduce((sum, budget) => sum + (budget.limit || 0), 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0)
  const potentialSavings = totalBudgeted - totalSpent
  const spendingPercent = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0

  const budgetsWithVisuals = useMemo(() => mapBudgetsWithVisuals(budgets), [budgets])

  const resetCreateForm = (): void => {
    setCreateTitle('')
    setCreateDueDate('')
    setCreateLimit('')
  }

  const openCreatePanel = (): void => {
    setIsCreatePanelOpen(true)
    resetCreateForm()
  }

  const closeCreatePanel = (): void => {
    setIsCreatePanelOpen(false)
    resetCreateForm()
  }

  const handleCreateBudget = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const trimmedTitle = createTitle.trim()
    const parsedLimit = Number.parseFloat(createLimit || '0')

    if (!trimmedTitle || !Number.isFinite(parsedLimit) || parsedLimit <= 0) {
      return
    }

    addBudget({
      name: trimmedTitle,
      limit: parsedLimit,
      spent: 0,
      dueDate: createDueDate
    })

    closeCreatePanel()
  }

  const openEditBudgetModal = (budget: BudgetWithVisuals): void => {
    setEditingBudgetId(budget.id)
    setBudgetName(budget.name)
    setBudgetLimit(String(budget.limit))
    setIsEditModalOpen(true)
    setOpenMenuId(null)
  }

  const closeEditModal = (): void => {
    setIsEditModalOpen(false)
    setEditingBudgetId(null)
    setBudgetName('')
    setBudgetLimit('')
  }

  const handleSaveBudget = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const trimmedName = budgetName.trim()
    const parsedLimit = Number.parseFloat(budgetLimit || '0')

    if (!editingBudgetId || !trimmedName || !Number.isFinite(parsedLimit) || parsedLimit <= 0) {
      return
    }

    updateBudget({ id: editingBudgetId, name: trimmedName, limit: parsedLimit })
    closeEditModal()
  }

  const closeExpenseModal = (): void => {
    setIsExpenseModalOpen(false)
    setSelectedBudget(null)
    setExpenseAmount('')
    setExpenseAccountId('')
  }

  const handleAddExpense = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    if (!selectedBudget) {
      return
    }

    const parsedAmount = Number.parseFloat(expenseAmount || '0')

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || !expenseAccountId) {
      return
    }

    addBudgetExpense({ id: selectedBudget.id, amount: parsedAmount, accountId: expenseAccountId })
    closeExpenseModal()
  }

  const openDeleteBudgetModal = (budget: BudgetWithVisuals): void => {
    setSelectedBudget(budget)
    setIsDeleteModalOpen(true)
    setOpenMenuId(null)
  }

  const closeDeleteBudgetModal = (): void => {
    setSelectedBudget(null)
    setIsDeleteModalOpen(false)
  }

  const confirmDeleteBudget = (): void => {
    if (!selectedBudget) {
      return
    }

    deleteBudget(selectedBudget.id)
    closeDeleteBudgetModal()
  }

  const toggleBudgetMenu = (budgetId: string): void => {
    setOpenMenuId((current) => (current === budgetId ? null : budgetId))
  }

  return (
    <AppLayout title="Presupuestos - Mi Finanzas">
      <div className="container-xl py-4 py-lg-5">
        <header className="page-header-panel">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <h2 className="h2 fw-bold mb-1">Mis Presupuestos ({budgets.length})</h2>
              <p className="text-secondary mb-0">Gestiona tus límites de gasto mensuales y ahorra más.</p>
            </div>
            <button className="btn btn-primary" type="button" onClick={openCreatePanel}>
              + Nuevo Presupuesto
            </button>
          </div>
        </header>

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <p className="small text-secondary mb-1">Total Presupuestado</p>
                <div className="d-flex align-items-center gap-2">
                  <span className="h4 fw-bold mb-0">${totalBudgeted.toLocaleString()}.00</span>
                  <span className="badge text-bg-success">100%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <p className="small text-secondary mb-1">Total Gastado</p>
                <div className="d-flex align-items-center gap-2">
                  <span className="h4 fw-bold mb-0">${totalSpent.toLocaleString()}.00</span>
                  <span className={`badge ${spendingPercent > 100 ? 'text-bg-danger' : 'text-bg-warning text-dark'}`}>
                    {spendingPercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <p className="small text-secondary mb-1">Ahorro Potencial</p>
                <div className="d-flex align-items-center gap-2">
                  <span className="h4 fw-bold mb-0">${potentialSavings.toLocaleString()}.00</span>
                  <span className={`badge ${potentialSavings >= 0 ? 'text-bg-primary' : 'text-bg-danger'}`}>
                    {potentialSavings >= 0 ? 'Disponible' : 'Sobrepasado'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary">analytics</span>
          <h3 className="h5 fw-bold mb-0">Detalle por categoría</h3>
        </div>

        {budgetsWithVisuals.length > 0 ? (
          <div className="list-group shadow-sm budgets-list">
            {budgetsWithVisuals.map((budget) => {
              const percentRaw = budget.limit > 0 ? Math.round((budget.spent / budget.limit) * 100) : 0
              const percent = Math.min(100, Math.max(0, percentRaw))
              const percentClass = percentRaw >= 100 ? 'text-danger fw-bold' : percentRaw >= 80 ? 'text-warning fw-semibold' : 'text-secondary'
              const metadata: string[] = [budget.category || 'General', `Prioridad ${budget.priority || 'Media'}`]

              if (budget.dueDate) {
                metadata.push(`Vence ${formatBudgetDueDate(budget.dueDate)}`)
              }

              return (
                <div key={budget.id} className="list-group-item py-3">
                  <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">
                    <div className="d-flex align-items-center gap-3 flex-grow-1">
                      <div className={`rounded p-2 d-inline-flex align-items-center justify-content-center ${budget.iconBg}`}>
                        <span className="material-symbols-outlined">{budget.icon}</span>
                      </div>
                      <div>
                        <h4 className="h6 fw-bold mb-1">{budget.name}</h4>
                        <p className="mb-0 text-secondary small">{metadata.join(' • ')}</p>
                      </div>
                    </div>

                    <div className="w-100 w-lg-50">
                      <div className="d-flex justify-content-between small mb-2">
                        <span className="text-secondary">${(budget.spent || 0).toFixed(2)} de ${(budget.limit || 0).toFixed(2)}</span>
                        <span className={percentClass}>{percentRaw}%</span>
                      </div>
                      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
                        <div className={`progress-bar ${budget.barClass}`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2 ms-lg-auto">
                      <div className="position-relative">
                        <button
                          className="btn btn-link text-secondary p-0"
                          type="button"
                          onClick={() => toggleBudgetMenu(budget.id)}
                          aria-expanded={openMenuId === budget.id}
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                        <div className={`dropdown-menu dropdown-menu-end budget-actions-menu ${openMenuId === budget.id ? 'show' : ''}`}>
                          <button className="dropdown-item" type="button" onClick={() => openEditBudgetModal(budget)}>
                            Editar
                          </button>
                          <button className="dropdown-item text-danger" type="button" onClick={() => openDeleteBudgetModal(budget)}>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="alert alert-secondary mb-0">
            No hay presupuestos creados.
          </div>
        )}
      </div>

      {isCreatePanelOpen && (
        <>
          <div
            className="modal d-block wallet-modal"
            tabIndex={-1}
            role="dialog"
            style={{ zIndex: 1085 }}
            onClick={(event: MouseEvent<HTMLDivElement>) => {
              if (event.target === event.currentTarget) {
                closeCreatePanel()
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Nuevo presupuesto</h5>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeCreatePanel} />
                </div>
                <form onSubmit={handleCreateBudget}>
                  <div className="modal-body d-grid gap-3">
                    <div>
                      <label className="form-label fw-semibold">Título *</label>
                      <input
                        className="form-control"
                        placeholder="Ej: Presupuesto mensual del hogar"
                        type="text"
                        value={createTitle}
                        onChange={(event) => setCreateTitle(event.target.value)}
                        required
                        autoFocus
                      />
                    </div>

                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">Fecha de vencimiento</label>
                        <div className="input-group">
                          <input
                            className="form-control"
                            type="date"
                            value={createDueDate}
                            onChange={(event) => setCreateDueDate(event.target.value)}
                          />
                          <span className="input-group-text">
                            <span className="material-symbols-outlined fs-6">calendar_today</span>
                          </span>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">Límite mensual ($) *</label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input
                            className="form-control"
                            type="number"
                            min="1"
                            step="0.01"
                            placeholder="Ej. 500"
                            value={createLimit}
                            onChange={(event) => setCreateLimit(event.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={closeCreatePanel}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Crear presupuesto
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1080 }} />
        </>
      )}

      {isEditModalOpen && (
        <>
          <div
            className="modal d-block wallet-modal"
            tabIndex={-1}
            role="dialog"
            style={{ zIndex: 1085 }}
            onClick={(event: MouseEvent<HTMLDivElement>) => {
              if (event.target === event.currentTarget) {
                closeEditModal()
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Editar presupuesto</h5>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeEditModal} />
                </div>
                <form onSubmit={handleSaveBudget}>
                  <div className="modal-body d-grid gap-3">
                    <div>
                      <label className="form-label fw-semibold">Nombre del presupuesto</label>
                      <input
                        className="form-control"
                        placeholder="Ej. Alimentación"
                        type="text"
                        value={budgetName}
                        onChange={(event) => setBudgetName(event.target.value)}
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="form-label fw-semibold">Límite mensual en dolares</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          className="form-control"
                          placeholder="Ej. 500"
                          type="number"
                          min="1"
                          value={budgetLimit}
                          onChange={(event) => setBudgetLimit(event.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={closeEditModal}>
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
          <div className="modal-backdrop fade show" style={{ zIndex: 1080 }} />
        </>
      )}

      {isExpenseModalOpen && (
        <>
          <div
            className="modal d-block wallet-modal"
            tabIndex={-1}
            role="dialog"
            style={{ zIndex: 1095 }}
            onClick={(event: MouseEvent<HTMLDivElement>) => {
              if (event.target === event.currentTarget) {
                closeExpenseModal()
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Registrar gasto</h5>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeExpenseModal} />
                </div>
                <form onSubmit={handleAddExpense}>
                  <div className="modal-body d-grid gap-3">
                    <p className="mb-1 text-secondary small">
                      Presupuesto: <span className="fw-semibold text-dark">{selectedBudget?.name}</span>
                    </p>
                    {accounts.length > 0 ? (
                      <div>
                        <label className="form-label fw-semibold">Cartera origen del gasto</label>
                        <select
                          className="form-select"
                          value={expenseAccountId}
                          onChange={(event) => setExpenseAccountId(event.target.value)}
                          required
                        >
                          {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.name} (Saldo: ${account.balance.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="alert alert-warning py-2 mb-0">
                        No tienes carteras disponibles para descontar este gasto.
                      </div>
                    )}
                    <div>
                      <label className="form-label fw-semibold">Monto del gasto</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          className="form-control"
                          placeholder="Ej. 25.50"
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={expenseAmount}
                          onChange={(event) => setExpenseAmount(event.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={closeExpenseModal}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={accounts.length === 0}>
                      Guardar gasto
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1090 }} />
        </>
      )}

      {isDeleteModalOpen && (
        <>
          <div
            className="modal d-block wallet-modal"
            tabIndex={-1}
            role="dialog"
            style={{ zIndex: 1105 }}
            onClick={(event: MouseEvent<HTMLDivElement>) => {
              if (event.target === event.currentTarget) {
                closeDeleteBudgetModal()
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar eliminacion</h5>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeDeleteBudgetModal} />
                </div>
                <div className="modal-body">
                  <p className="mb-0">
                    ¿Seguro que deseas eliminar el presupuesto{' '}
                    <span className="fw-semibold">{selectedBudget?.name}</span>?
                  </p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={closeDeleteBudgetModal}>
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-danger" onClick={confirmDeleteBudget}>
                    Eliminar presupuesto
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1100 }} />
        </>
      )}
    </AppLayout>
  )
}

export default withAuth(Presupuestos)

