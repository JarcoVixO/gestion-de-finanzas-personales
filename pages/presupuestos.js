import Layout from '../components/Layout'
import withAuth from '../src/guards/withAuth'

function Presupuestos() {
  const budgets = [
    { id: 1, name: 'Alimentación', icon: 'restaurant', iconBg: 'bg-primary bg-opacity-10 text-primary', spent: 600, limit: 800, barColor: 'bg-primary' },
    { id: 2, name: 'Transporte', icon: 'directions_car', iconBg: 'bg-warning bg-opacity-25 text-warning-emphasis', spent: 120, limit: 300, barColor: 'bg-warning' },
    { id: 3, name: 'Entretenimiento', icon: 'movie', iconBg: 'bg-danger bg-opacity-10 text-danger', spent: 245, limit: 250, barColor: 'bg-danger' },
    { id: 4, name: 'Servicios del Hogar', icon: 'bolt', iconBg: 'bg-info bg-opacity-10 text-info', spent: 180, limit: 500, barColor: 'bg-info' },
  ]

  const totalBudgeted = 3500
  const totalSpent = 2150
  const potentialSavings = totalBudgeted - totalSpent

  return (
    <Layout title="Presupuestos - Mi Finanzas">
      <div className="container-xl py-4 py-lg-5 overflow-auto">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h2 className="h2 fw-bold mb-1">Presupuestos</h2>
            <p className="text-secondary mb-0">Gestiona tus límites de gasto mensuales y ahorra más.</p>
          </div>
          <button className="btn btn-primary d-inline-flex align-items-center gap-2" type="button">
            <span className="material-symbols-outlined fs-6">add_circle</span>
            Crear Presupuesto
          </button>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <p className="small text-secondary mb-1">Total Presupuestado</p>
                <div className="d-flex align-items-center gap-2">
                  <span className="h4 fw-bold mb-0">${totalBudgeted.toLocaleString()}.00</span>
                  <span className="badge text-bg-success">0.0%</span>
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
                  <span className="badge text-bg-danger">-12.5%</span>
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
                  <span className="badge text-bg-primary">+5.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary">analytics</span>
          <h3 className="h5 fw-bold mb-0">Detalle por categoría</h3>
        </div>

        <div className="d-grid gap-3">
          {budgets.map((budget) => {
            const percent = Math.round((budget.spent / budget.limit) * 100)
            const percentClass = percent >= 90 ? 'text-danger fw-bold' : percent >= 70 ? 'text-primary fw-semibold' : 'text-secondary'

            return (
              <div key={budget.id} className="card border-0 shadow-sm">
                <div className="card-body d-flex flex-column flex-sm-row align-items-sm-center gap-3">
                  <div className="d-flex align-items-center gap-3 flex-grow-1">
                    <div className={`rounded p-2 d-inline-flex align-items-center justify-content-center ${budget.iconBg}`}>
                      <span className="material-symbols-outlined">{budget.icon}</span>
                    </div>
                    <div>
                      <h4 className="h6 fw-bold mb-1">{budget.name}</h4>
                      <p className="small text-uppercase text-secondary mb-0">Mensual</p>
                    </div>
                  </div>

                  <div className="flex-grow-1 w-100">
                    <div className="d-flex justify-content-between small mb-2">
                      <span className="text-secondary">${budget.spent.toFixed(2)} de ${budget.limit.toFixed(2)}</span>
                      <span className={percentClass}>{percent}%</span>
                    </div>
                    <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}>
                      <div className={`progress-bar ${budget.barColor}`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="card border-dashed mt-4">
          <div className="card-body text-center p-4">
            <div className="empty-state-icon rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3">
              <span className="material-symbols-outlined text-secondary">lightbulb</span>
            </div>
            <h4 className="h6 fw-bold">¿Necesitas ayuda con tus ahorros?</h4>
            <p className="text-secondary small mx-auto mb-3" style={{ maxWidth: '420px' }}>
              Prueba nuestra herramienta de auto-presupuesto basada en tus gastos del mes anterior.
            </p>
            <button className="btn btn-link text-decoration-none fw-semibold" type="button">
              Sugerir presupuesto inteligente
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withAuth(Presupuestos)
