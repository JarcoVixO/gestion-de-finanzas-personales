'use client'

import { useTransaccionStore } from '../hooks/useTransaccionStore'
import type { TransaccionTab } from '../transaccion.schema'

const TABS: { key: TransaccionTab; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'income', label: 'Ingresos' },
  { key: 'expense', label: 'Gastos' }
]

export default function TransaccionTabs() {
  const { activeTab, setActiveTab } = useTransaccionStore()

  return (
    <section className="card border-0 shadow-sm mb-4">
      <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
        <ul className="nav nav-tabs border-0">
          {TABS.map((tab) => (
            <li key={tab.key} className="nav-item">
              <button
                className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        <div>
          <label className="form-label text-uppercase small text-secondary fw-semibold mb-1">
            Periodo
          </label>
          <select className="form-select form-select-sm">
            <option>Octubre 2023</option>
            <option>Septiembre 2023</option>
            <option>Agosto 2023</option>
            <option>Últimos 90 días</option>
          </select>
        </div>
      </div>
    </section>
  )
}