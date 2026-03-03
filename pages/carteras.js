import { useState } from 'react'
import Layout from '../components/Layout'
import { useStore } from '../store/useStore'
import withAuth from '../src/guards/withAuth'

function Carteras() {
  const { accounts } = useStore()
  const [walletName, setWalletName] = useState('')
  const [initialAmount, setInitialAmount] = useState('')

  const wallets = [
    { id: 1, name: 'Ahorros Personal', balance: 4200, goal: 5000, icon: 'savings', iconBg: 'bg-primary bg-opacity-10 text-primary' },
    { id: 2, name: 'Gastos de Negocio', balance: 6800, goal: 10000, icon: 'business_center', iconBg: 'bg-secondary bg-opacity-10 text-secondary' },
    { id: 3, name: 'Fondo de Viajes', balance: 1450, goal: 3000, icon: 'flight', iconBg: 'bg-warning bg-opacity-25 text-warning-emphasis' },
  ]

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0)

  return (
    <Layout title="Carteras - Mi Finanzas">
      <header className="bg-white border-bottom sticky-top z-1 px-4 px-lg-5 py-3">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <h2 className="h4 fw-bold mb-0">Mis Carteras</h2>
          <div className="d-flex align-items-center gap-2 w-100 flex-grow-1 flex-md-grow-0 justify-content-md-end">
            <div className="input-group wallet-search">
              <span className="input-group-text bg-body">
                <span className="material-symbols-outlined fs-6 text-secondary">search</span>
              </span>
              <input className="form-control" placeholder="Buscar carteras..." type="text" />
            </div>
            <button className="btn btn-outline-secondary position-relative d-inline-flex align-items-center" type="button">
              <span className="material-symbols-outlined">notifications</span>
              <span className="notification-dot" />
            </button>
          </div>
        </div>
      </header>

      <div className="container-xl py-4 py-lg-5 overflow-auto">
        <div className="card text-bg-primary border-0 shadow-sm mb-4">
          <div className="card-body position-relative overflow-hidden p-4 p-lg-5">
            <div className="position-relative z-1">
              <p className="small fw-medium mb-1">Balance Total Combinado</p>
              <h3 className="display-6 fw-bold mb-0">${totalBalance.toLocaleString()}.00</h3>
              <div className="d-inline-flex align-items-center gap-2 mt-3 px-3 py-1 rounded-pill bg-white bg-opacity-25">
                <span className="material-symbols-outlined fs-6">trending_up</span>
                <span className="small fw-medium">+5.2% este mes</span>
              </div>
            </div>
            <div className="wallet-hero-gradient position-absolute top-0 end-0 h-100" />
            <span className="material-symbols-outlined wallet-hero-icon">account_balance</span>
          </div>
        </div>

        <section className="mb-4">
          <div className="card border-dashed shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex align-items-center justify-content-center p-2">
                  <span className="material-symbols-outlined">add_circle</span>
                </div>
                <h3 className="h5 fw-bold mb-0">Crear Nueva Cartera</h3>
              </div>

              <form className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Nombre de la Cartera</label>
                  <input
                    className="form-control"
                    placeholder="Ej. Ahorros Navidad"
                    type="text"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Monto Inicial</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      className="form-control"
                      placeholder="0.00"
                      type="number"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-12 d-flex justify-content-end">
                  <button className="btn btn-primary d-inline-flex align-items-center gap-2 px-4" type="submit">
                    <span className="material-symbols-outlined fs-6">add</span>
                    <span>Crear Cartera</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="h5 fw-bold mb-0">Tus Carteras Activas</h3>
            <span className="small text-secondary">{wallets.length} carteras totales</span>
          </div>

          <div className="row g-3 g-lg-4">
            {wallets.map((wallet) => {
              const percent = Math.round((wallet.balance / wallet.goal) * 100)
              return (
                <div key={wallet.id} className="col-12 col-md-6 col-xl-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className={`rounded p-2 d-inline-flex align-items-center justify-content-center ${wallet.iconBg}`}>
                          <span className="material-symbols-outlined">{wallet.icon}</span>
                        </div>
                        <button className="btn btn-link text-secondary p-0" type="button">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </div>

                      <h4 className="h6 fw-bold mb-1">{wallet.name}</h4>
                      <p className="h4 fw-bold mb-3">${wallet.balance.toLocaleString()}.00</p>

                      <div className="d-flex justify-content-between small mb-2">
                        <span className="text-secondary">Meta: ${wallet.goal.toLocaleString()}.00</span>
                        <span className="text-primary fw-semibold">{percent}%</span>
                      </div>
                      <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}>
                        <div className="progress-bar bg-primary" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default withAuth(Carteras)
