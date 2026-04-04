'use client'

import { formatPresupuestoDate } from '../presupuesto.schema'
import type { PresupuestoSummary } from '../presupuesto.schema'
import { usePresupuestoStore } from '../hooks/usePresupuestoStore'

interface PresupuestoCardProps {
  presupuesto: PresupuestoSummary
  onEdit: () => void
  onDelete: () => void
}

export default function PresupuestoCard({
  presupuesto,
  onEdit,
  onDelete
}: PresupuestoCardProps) {
  const { openMenuId, toggleMenu, closeMenu } = usePresupuestoStore()
  const isMenuOpen = openMenuId === presupuesto.id

  return (
    <div className="list-group-item py-3">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">

        {/* Ícono + nombre + fechas */}
        <div className="d-flex align-items-center gap-3 flex-grow-1">
          <div className={`rounded p-2 d-inline-flex align-items-center justify-content-center ${presupuesto.iconBg}`}>
            <span className="material-symbols-outlined">{presupuesto.icon}</span>
          </div>
          <div>
            <h4 className="h6 fw-bold mb-1">{presupuesto.nombre}</h4>
            <p className="mb-0 text-secondary small">
              {formatPresupuestoDate(presupuesto.fecha_inicio)}
              {presupuesto.fecha_fin
                ? ` a ${formatPresupuestoDate(presupuesto.fecha_fin)}`
                : ' (sin vencimiento)'}
            </p>
          </div>
        </div>

        {/* Monto límite */}
        <div className="text-lg-end">
          <p className="small text-secondary mb-1">Límite</p>
          <p className="h5 fw-bold mb-0">
            ${presupuesto.monto_limite.toLocaleString('es-SV', { maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Menú acciones */}
        <div className="position-relative">
          <button
            className="btn btn-link text-secondary p-0"
            type="button"
            aria-expanded={isMenuOpen}
            onClick={() => toggleMenu(presupuesto.id)}
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>
          {isMenuOpen && (
            <div className="dropdown-menu dropdown-menu-end show">
              <button
                className="dropdown-item"
                type="button"
                onClick={() => { closeMenu(); onEdit() }}
              >
                Editar
              </button>
              <button
                className="dropdown-item text-danger"
                type="button"
                onClick={() => { closeMenu(); onDelete() }}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}