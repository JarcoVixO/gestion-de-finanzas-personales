import Link from 'next/link'
import Layout from '../components/Layout'
import { useStore } from '../store/useStore'
import withAuth from '../src/guards/withAuth'

function Transacciones() {
  const { transactions } = useStore()

  const sampleTransactions = [
    { id: 1, date: '24 Oct 2023', description: 'Suscripción Netflix', icon: 'movie', category: 'Entretenimiento', categoryColor: 'purple', account: 'Visa Débito (...4421)', amount: -15.99 },
    { id: 2, date: '23 Oct 2023', description: 'Depósito Nómina Acme Inc.', icon: 'work', category: 'Salario', categoryColor: 'green', account: 'Cuenta Corriente', amount: 2500.00 },
    { id: 3, date: '22 Oct 2023', description: 'Supermercado Central', icon: 'shopping_cart', category: 'Alimentación', categoryColor: 'amber', account: 'Efectivo', amount: -85.40 },
    { id: 4, date: '21 Oct 2023', description: 'Pago Gimnasio Power', icon: 'fitness_center', category: 'Salud', categoryColor: 'blue', account: 'Visa Débito (...4421)', amount: -45.00 },
    { id: 5, date: '20 Oct 2023', description: 'Transferencia Bizum Recibida', icon: 'swap_horiz', category: 'Otros', categoryColor: 'slate', account: 'Cuenta Corriente', amount: 20.00 },
    { id: 6, date: '19 Oct 2023', description: 'Cena Restaurante El Olivo', icon: 'restaurant', category: 'Restauración', categoryColor: 'orange', account: 'Efectivo', amount: -32.50 },
  ]

  const getCategoryClasses = (color) => {
    const colors = {
      purple: 'text-bg-primary',
      green: 'text-bg-success',
      amber: 'text-bg-warning text-dark',
      blue: 'text-bg-info text-dark',
      slate: 'text-bg-secondary',
      orange: 'text-bg-warning text-dark',
    }
    return colors[color] || colors.slate
  }

  return (
    <Layout title="Transacciones - Mi Finanzas">
      <div className="p-4 p-lg-5">
        <header className="mb-4">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
            <div>
              <h2 className="h2 fw-bold mb-1">Transacciones</h2>
              <p className="text-secondary mb-0">Gestiona y analiza tus movimientos financieros</p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-2" type="button">
                <span className="material-symbols-outlined fs-6">download</span>
                Exportar CSV
              </button>
              <Link
                href="/nueva_transaccion"
                className="btn btn-primary d-inline-flex align-items-center gap-2"
              >
                <span className="material-symbols-outlined fs-6">add</span>
                Nueva Transacción
              </Link>
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 border-bottom pb-2">
            <ul className="nav nav-tabs border-0">
              <li className="nav-item">
                <button className="nav-link active" type="button">Todos</button>
              </li>
              <li className="nav-item">
                <button className="nav-link" type="button">Ingresos</button>
              </li>
              <li className="nav-item">
                <button className="nav-link" type="button">Gastos</button>
              </li>
            </ul>
            <div>
              <label className="form-label text-uppercase small text-secondary fw-semibold mb-1">Periodo</label>
              <select className="form-select form-select-sm">
                <option>Octubre 2023</option>
                <option>Septiembre 2023</option>
                <option>Agosto 2023</option>
                <option>Últimos 90 días</option>
              </select>
            </div>
          </div>
        </header>

        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-uppercase small text-secondary fw-semibold">Fecha</th>
                  <th className="text-uppercase small text-secondary fw-semibold">Descripción</th>
                  <th className="text-uppercase small text-secondary fw-semibold">Categoría</th>
                  <th className="text-uppercase small text-secondary fw-semibold">Cuenta</th>
                  <th className="text-uppercase small text-secondary fw-semibold text-end">Monto</th>
                </tr>
              </thead>
              <tbody>
                {sampleTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="small text-secondary">{tx.date}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="transaction-icon-box rounded bg-light d-flex align-items-center justify-content-center text-secondary">
                          <span className="material-symbols-outlined fs-6">{tx.icon}</span>
                        </div>
                        <span className="fw-semibold">{tx.description}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${getCategoryClasses(tx.categoryColor)}`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="small text-secondary">{tx.account}</td>
                    <td className={`fw-bold text-end ${tx.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                      {tx.amount >= 0 ? '+' : ''}{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-footer bg-light d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2">
            <p className="small text-secondary mb-0">Mostrando 1-6 de 128 transacciones</p>
            <ul className="pagination pagination-sm mb-0">
              <li className="page-item disabled">
                <button className="page-link" type="button">Anterior</button>
              </li>
              <li className="page-item">
                <button className="page-link" type="button">Siguiente</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withAuth(Transacciones)
