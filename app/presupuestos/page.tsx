'use client'

import type { FormEvent, MouseEvent } from 'react'
import { useEffect, useState } from 'react'
import {
  createPresupuestoAction,
  deletePresupuestoAction,
  getPresupuestosAction,
  updatePresupuestoAction
} from '@/src/modules/presupuestos/presupuesto.server-actions'
import AppLayout from '@/src/shared/components/AppLayout'
import withAuth from '@/src/shared/hooks/withAuth'
import type { PresupuestoRecord } from '@/src/shared/types/domain'

function Presupuestos() {
  const [presupuestos, setPresupuestos] = useState<PresupuestoRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState<boolean>(false)

  const [editingPresupuestoId, setEditingPresupuestoId] = useState<string | null>(null)
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<PresupuestoRecord | null>(null)

  const [createNombre, setCreateNombre] = useState<string>('')
  const [createMontoLimite, setCreateMontoLimite] = useState<string>('')
  const [createFechaInicio, setCreateFechaInicio] = useState<string>('')
  const [createFechaFin, setCreateFechaFin] = useState<string>('')

  const [editNombre, setEditNombre] = useState<string>('')
  const [editMontoLimite, setEditMontoLimite] = useState<string>('')
  const [editFechaInicio, setEditFechaInicio] = useState<string>('')
  const [editFechaFin, setEditFechaFin] = useState<string>('')

  // Load presupuestos on mount
  useEffect(() => {
    loadPresupuestos()
  }, [])

  // Clear messages after 5 seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null)
        setSuccessMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage, successMessage])

  const loadPresupuestos = async (): Promise<void> => {
    setLoading(true)
    try {
      const result = await getPresupuestosAction()
      if (result.ok) {
        setPresupuestos(result.data || [])
      } else {
        setErrorMessage(result.message || 'No se pudieron cargar los presupuestos.')
      }
    } catch (err) {
      setErrorMessage('Error inesperado al cargar los presupuestos.')
    } finally {
      setLoading(false)
    }
  }

  const resetCreateForm = (): void => {
    setCreateNombre('')
    setCreateMontoLimite('')
    setCreateFechaInicio('')
    setCreateFechaFin('')
  }

  const openCreatePanel = (): void => {
    setIsCreatePanelOpen(true)
    resetCreateForm()
    setErrorMessage(null)
  }

  const closeCreatePanel = (): void => {
    setIsCreatePanelOpen(false)
    resetCreateForm()
  }

  const handleCreatePresupuesto = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setErrorMessage(null)

    const formData = new FormData()
    formData.set('nombre', createNombre)
    formData.set('monto_limite', createMontoLimite)
    formData.set('fecha_inicio', createFechaInicio)
    formData.set('fecha_fin', createFechaFin)

    console.log('[Create Presupuesto] Form data:', {
      nombre: createNombre,
      monto_limite: createMontoLimite,
      fecha_inicio: createFechaInicio,
      fecha_fin: createFechaFin
    })

    try {
      const result = await createPresupuestoAction(formData)
      console.log('[Create Presupuesto] Result:', result)
      if (result.ok) {
        setSuccessMessage(result.message || 'Presupuesto creado exitosamente.')
        closeCreatePanel()
        await loadPresupuestos()
      } else {
        setErrorMessage(result.message || 'No se pudo crear el presupuesto.')
      }
    } catch (err) {
      console.error('[Create Presupuesto] Exception:', err)
      setErrorMessage('Error inesperado al crear el presupuesto.')
    }
  }

  const openEditPresupuestoModal = (presupuesto: PresupuestoRecord): void => {
    setEditingPresupuestoId(presupuesto.id)
    setEditNombre(presupuesto.nombre)
    setEditMontoLimite(String(presupuesto.monto_limite))
    setEditFechaInicio(presupuesto.fecha_inicio)
    setEditFechaFin(presupuesto.fecha_fin || '')
    setIsEditModalOpen(true)
    setOpenMenuId(null)
    setErrorMessage(null)
  }

  const closeEditModal = (): void => {
    setIsEditModalOpen(false)
    setEditingPresupuestoId(null)
    setEditNombre('')
    setEditMontoLimite('')
    setEditFechaInicio('')
    setEditFechaFin('')
  }

  const handleSavePresupuesto = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setErrorMessage(null)

    if (!editingPresupuestoId) return

    const formData = new FormData()
    formData.set('nombre', editNombre)
    formData.set('monto_limite', editMontoLimite)
    formData.set('fecha_inicio', editFechaInicio)
    formData.set('fecha_fin', editFechaFin)

    try {
      const result = await updatePresupuestoAction(editingPresupuestoId, formData)
      if (result.ok) {
        setSuccessMessage(result.message || 'Presupuesto actualizado exitosamente.')
        closeEditModal()
        await loadPresupuestos()
      } else {
        setErrorMessage(result.message || 'No se pudo actualizar el presupuesto.')
      }
    } catch (err) {
      setErrorMessage('Error inesperado al actualizar el presupuesto.')
    }
  }

  const openDeletePresupuestoModal = (presupuesto: PresupuestoRecord): void => {
    setSelectedPresupuesto(presupuesto)
    setIsDeleteModalOpen(true)
    setOpenMenuId(null)
  }

  const closeDeletePresupuestoModal = (): void => {
    setSelectedPresupuesto(null)
    setIsDeleteModalOpen(false)
  }

  const confirmDeletePresupuesto = async (): Promise<void> => {
    if (!selectedPresupuesto) return

    setErrorMessage(null)

    try {
      const result = await deletePresupuestoAction(selectedPresupuesto.id)
      if (result.ok) {
        setSuccessMessage(result.message || 'Presupuesto eliminado exitosamente.')
        closeDeletePresupuestoModal()
        await loadPresupuestos()
      } else {
        setErrorMessage(result.message || 'No se pudo eliminar el presupuesto.')
      }
    } catch (err) {
      setErrorMessage('Error inesperado al eliminar el presupuesto.')
    }
  }

  const togglePresupuestoMenu = (presupuestoId: string): void => {
    setOpenMenuId((current) => (current === presupuestoId ? null : presupuestoId))
  }

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(`${dateStr}T00:00:00`)
      return date.toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return (
    <AppLayout title="Presupuestos - Mi Finanzas">
      <div className="container-xl py-4 py-lg-5">
        {errorMessage && (
          <div className="alert alert-danger alert-dismissible fade show mb-4">
            {errorMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setErrorMessage(null)}
            />
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show mb-4">
            {successMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMessage(null)}
            />
          </div>
        )}

        <header className="page-header-panel">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <h2 className="h2 fw-bold mb-1">Mis Presupuestos ({presupuestos.length})</h2>
              <p className="text-secondary mb-0">Gestiona tus límites de gasto por período y planifica mejor.</p>
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
                  <span className="h4 fw-bold mb-0">
                    ${presupuestos.reduce((sum, p) => sum + p.monto_limite, 0).toLocaleString('es-SV', { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <p className="small text-secondary mb-1">Presupuestos Activos</p>
                <div className="d-flex align-items-center gap-2">
                  <span className="h4 fw-bold mb-0">{presupuestos.length}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <p className="small text-secondary mb-1">Próximo Vencimiento</p>
                <p className="h6 fw-semibold mb-0">
                  {presupuestos.length > 0
                    ? presupuestos
                      .filter((p) => p.fecha_fin)
                      .sort((a, b) => (a.fecha_fin || '').localeCompare(b.fecha_fin || ''))[0]
                      ?.fecha_fin
                      ? formatDate(
                        presupuestos
                          .filter((p) => p.fecha_fin)
                          .sort((a, b) => (a.fecha_fin || '').localeCompare(b.fecha_fin || ''))[0]?.fecha_fin || ''
                      )
                      : 'Sin vencimiento'
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
            <p className="text-secondary mt-3">Cargando presupuestos...</p>
          </div>
        ) : presupuestos.length > 0 ? (
          <div className="list-group shadow-sm">
            {presupuestos.map((presupuesto) => (
              <div key={presupuesto.id} className="list-group-item py-3">
                <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">
                  <div className="d-flex align-items-center gap-3 flex-grow-1">
                    <div className="rounded p-2 d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary">
                      <span className="material-symbols-outlined">calendar_month</span>
                    </div>
                    <div>
                      <h4 className="h6 fw-bold mb-1">{presupuesto.nombre}</h4>
                      <p className="mb-0 text-secondary small">
                        {formatDate(presupuesto.fecha_inicio)} {presupuesto.fecha_fin ? `a ${formatDate(presupuesto.fecha_fin)}` : '(sin vencimiento)'}
                      </p>
                    </div>
                  </div>

                  <div className="text-lg-end">
                    <p className="small text-secondary mb-1">Límite</p>
                    <p className="h5 fw-bold mb-0">
                      ${presupuesto.monto_limite.toLocaleString('es-SV', { maximumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <div className="position-relative">
                      <button
                        className="btn btn-link text-secondary p-0"
                        type="button"
                        onClick={() => togglePresupuestoMenu(presupuesto.id)}
                        aria-expanded={openMenuId === presupuesto.id}
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                      <div
                        className={`dropdown-menu dropdown-menu-end ${openMenuId === presupuesto.id ? 'show' : ''}`}
                      >
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => openEditPresupuestoModal(presupuesto)}
                        >
                          Editar
                        </button>
                        <button
                          className="dropdown-item text-danger"
                          type="button"
                          onClick={() => openDeletePresupuestoModal(presupuesto)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-secondary mb-0">
            <p className="mb-2">No hay presupuestos creados.</p>
            <p className="mb-0 small">Crea tu primer presupuesto para comenzar a gestionar tus límites de gasto.</p>
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
                <form onSubmit={handleCreatePresupuesto}>
                  <div className="modal-body d-grid gap-3">
                    <div>
                      <label className="form-label fw-semibold">Nombre del presupuesto *</label>
                      <input
                        className="form-control"
                        placeholder="Ej: Presupuesto del mes"
                        type="text"
                        value={createNombre}
                        onChange={(event) => setCreateNombre(event.target.value)}
                        required
                        autoFocus
                      />
                    </div>

                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">Fecha de inicio *</label>
                        <div className="input-group">
                          <input
                            className="form-control"
                            type="date"
                            value={createFechaInicio}
                            onChange={(event) => setCreateFechaInicio(event.target.value)}
                            required
                          />
                          <span className="input-group-text">
                            <span className="material-symbols-outlined fs-6">calendar_today</span>
                          </span>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">Fecha de fin (opcional)</label>
                        <div className="input-group">
                          <input
                            className="form-control"
                            type="date"
                            value={createFechaFin}
                            onChange={(event) => setCreateFechaFin(event.target.value)}
                          />
                          <span className="input-group-text">
                            <span className="material-symbols-outlined fs-6">calendar_today</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="form-label fw-semibold">Monto límite ($) *</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          className="form-control"
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="Ej. 1000"
                          value={createMontoLimite}
                          onChange={(event) => setCreateMontoLimite(event.target.value)}
                          required
                        />
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
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Editar presupuesto</h5>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeEditModal} />
                </div>
                <form onSubmit={handleSavePresupuesto}>
                  <div className="modal-body d-grid gap-3">
                    <div>
                      <label className="form-label fw-semibold">Nombre del presupuesto</label>
                      <input
                        className="form-control"
                        placeholder="Ej: Presupuesto del mes"
                        type="text"
                        value={editNombre}
                        onChange={(event) => setEditNombre(event.target.value)}
                        autoFocus
                      />
                    </div>

                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">Fecha de inicio</label>
                        <div className="input-group">
                          <input
                            className="form-control"
                            type="date"
                            value={editFechaInicio}
                            onChange={(event) => setEditFechaInicio(event.target.value)}
                          />
                          <span className="input-group-text">
                            <span className="material-symbols-outlined fs-6">calendar_today</span>
                          </span>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">Fecha de fin</label>
                        <div className="input-group">
                          <input
                            className="form-control"
                            type="date"
                            value={editFechaFin}
                            onChange={(event) => setEditFechaFin(event.target.value)}
                          />
                          <span className="input-group-text">
                            <span className="material-symbols-outlined fs-6">calendar_today</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="form-label fw-semibold">Monto límite ($)</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          className="form-control"
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="Ej. 1000"
                          value={editMontoLimite}
                          onChange={(event) => setEditMontoLimite(event.target.value)}
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

      {isDeleteModalOpen && (
        <>
          <div
            className="modal d-block wallet-modal"
            tabIndex={-1}
            role="dialog"
            style={{ zIndex: 1105 }}
            onClick={(event: MouseEvent<HTMLDivElement>) => {
              if (event.target === event.currentTarget) {
                closeDeletePresupuestoModal()
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar eliminación</h5>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeDeletePresupuestoModal} />
                </div>
                <div className="modal-body">
                  <p className="mb-0">
                    ¿Seguro que deseas eliminar el presupuesto{' '}
                    <span className="fw-semibold">{selectedPresupuesto?.nombre}</span>?
                  </p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={closeDeletePresupuestoModal}>
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-danger" onClick={confirmDeletePresupuesto}>
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
