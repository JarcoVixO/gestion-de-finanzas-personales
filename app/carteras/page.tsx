"use client"

import type { FormEvent, MouseEvent } from 'react'
import { useMemo, useState } from 'react'
import { mapWallets } from '@/src/modules/carteras/cartera.actions'
import AppLayout from '@/src/shared/components/AppLayout'
import withAuth from '@/src/shared/hooks/withAuth'
import { useAppStore } from '@/src/shared/hooks/useAppStore'
import type { WalletSummary } from '@/src/shared/types/finance'

function Carteras() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAppStore()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null)
  const [walletToDelete, setWalletToDelete] = useState<WalletSummary | null>(null)
  const [walletName, setWalletName] = useState<string>('')
  const [initialAmount, setInitialAmount] = useState<string>('')
  const [walletGoal, setWalletGoal] = useState<string>('')

  const wallets = useMemo(() => mapWallets(accounts), [accounts])
  const isEditing = Boolean(editingWalletId)
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  const openCreateModal = (): void => {
    setEditingWalletId(null)
    setWalletName('')
    setInitialAmount('')
    setWalletGoal('')
    setIsWalletModalOpen(true)
  }

  const openEditModal = (wallet: WalletSummary): void => {
    setEditingWalletId(wallet.id)
    setWalletName(wallet.name)
    setInitialAmount(String(wallet.balance))
    setWalletGoal(String(wallet.goal))
    setIsWalletModalOpen(true)
  }

  const closeWalletModal = (): void => {
    setIsWalletModalOpen(false)
    setEditingWalletId(null)
    setWalletName('')
    setInitialAmount('')
    setWalletGoal('')
  }

  const handleSaveWallet = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const trimmedName = walletName.trim()
    const parsedInitialAmount = Number.parseFloat(initialAmount || '0')
    const parsedGoal = Number.parseFloat(walletGoal || '0')

    if (!trimmedName) {
      return
    }

    const safeAmount = Number.isFinite(parsedInitialAmount) ? parsedInitialAmount : 0
    const safeGoal = Number.isFinite(parsedGoal) && parsedGoal > 0
      ? parsedGoal
      : Math.max(Math.round(Math.abs(safeAmount) * 1.2), 100)

    if (editingWalletId) {
      updateAccount({ id: editingWalletId, name: trimmedName, balance: safeAmount, goal: safeGoal })
    } else {
      addAccount({ name: trimmedName, balance: safeAmount, type: 'Cartera', goal: safeGoal })
    }

    closeWalletModal()
  }

  const openDeleteModal = (wallet: WalletSummary): void => {
    setWalletToDelete(wallet)
    setIsDeleteModalOpen(true)
    setOpenMenuId(null)
  }

  const closeDeleteModal = (): void => {
    setWalletToDelete(null)
    setIsDeleteModalOpen(false)
  }

  const confirmDeleteWallet = (): void => {
    if (!walletToDelete) {
      return
    }

    deleteAccount(walletToDelete.id)
    closeDeleteModal()
  }

  const toggleWalletMenu = (walletId: string): void => {
    setOpenMenuId((currentId) => (currentId === walletId ? null : walletId))
  }

  return (
    <AppLayout title="Carteras - Mi Finanzas">
      <div className="container-xl py-4 py-lg-5">
        <header className="page-header-panel">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <h2 className="h2 fw-bold mb-1">Mis Carteras ({wallets.length})</h2>
              <p className="text-secondary mb-0">Gestiona tus saldos y metas de ahorro en un solo lugar.</p>
            </div>
            <div className="d-flex align-items-center gap-2 w-100 flex-grow-1 flex-lg-grow-0 justify-content-lg-end">
              <button
                className="btn btn-primary d-inline-flex align-items-center gap-2 px-4"
                type="button"
                onClick={openCreateModal}
              >
                <span className="material-symbols-outlined fs-6">add</span>
                <span>Crear Cartera</span>
              </button>
            </div>
          </div>
        </header>

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

        <section>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="h5 fw-bold mb-0">Tus Carteras Activas</h3>
            <span className="small text-secondary">{wallets.length} carteras totales</span>
          </div>

          {wallets.length > 0 ? (
            <div className="list-group shadow-sm wallets-list">
              {wallets.map((wallet) => {
                const percent = Math.min(100, Math.max(0, Math.round((wallet.balance / wallet.goal) * 100)))

                return (
                  <div key={wallet.id} className="list-group-item py-3">
                    <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">
                      <div className="d-flex align-items-center gap-3 flex-grow-1">
                        <div className={`rounded p-2 d-inline-flex align-items-center justify-content-center ${wallet.iconBg}`}>
                          <span className="material-symbols-outlined">{wallet.icon}</span>
                        </div>
                        <div>
                          <h4 className="h6 fw-bold mb-1">{wallet.name}</h4>
                          <p className="mb-0 text-secondary small">Saldo disponible</p>
                        </div>
                      </div>

                      <div className="w-100 w-lg-50">
                        <div className="d-flex justify-content-between small mb-2">
                          <span className="fw-semibold">${wallet.balance.toLocaleString()}.00</span>
                          <span className="text-secondary">Meta: ${wallet.goal.toLocaleString()}.00</span>
                        </div>
                        <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
                          <div className="progress-bar bg-primary" style={{ width: `${percent}%` }} />
                        </div>
                      </div>

                      <div className="position-relative ms-lg-auto">
                        <button
                          className="btn btn-link text-secondary p-0"
                          type="button"
                          onClick={() => toggleWalletMenu(wallet.id)}
                          aria-expanded={openMenuId === wallet.id}
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                        <div className={`dropdown-menu dropdown-menu-end wallet-actions-menu ${openMenuId === wallet.id ? 'show' : ''}`}>
                          <button
                            className="dropdown-item"
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null)
                              openEditModal(wallet)
                            }}
                          >
                            Editar
                          </button>
                          <button
                            className="dropdown-item text-danger"
                            type="button"
                            onClick={() => openDeleteModal(wallet)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="alert alert-secondary mb-0">
              Aun no has creado carteras.
            </div>
          )}
        </section>
      </div>

      {isWalletModalOpen && (
        <>
          <div
            className="modal d-block wallet-modal"
            tabIndex={-1}
            role="dialog"
            style={{ zIndex: 1085 }}
            onClick={(event: MouseEvent<HTMLDivElement>) => {
              if (event.target === event.currentTarget) {
                closeWalletModal()
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{isEditing ? 'Editar cartera' : 'Crear cartera'}</h5>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeWalletModal} />
                </div>
                <form onSubmit={handleSaveWallet}>
                  <div className="modal-body d-grid gap-3">
                    <div>
                      <label className="form-label fw-semibold">Nombre de la cartera</label>
                      <input
                        className="form-control"
                        placeholder="Ej. Ahorros Navidad"
                        type="text"
                        value={walletName}
                        onChange={(event) => setWalletName(event.target.value)}
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="form-label fw-semibold">Monto inicial</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          className="form-control"
                          placeholder="0.00"
                          type="number"
                          value={initialAmount}
                          onChange={(event) => setInitialAmount(event.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label fw-semibold">Meta</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          className="form-control"
                          placeholder="Ej. 5000"
                          type="number"
                          min="1"
                          value={walletGoal}
                          onChange={(event) => setWalletGoal(event.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={closeWalletModal}>
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
      )}

      {isDeleteModalOpen && (
        <>
          <div
            className="modal d-block wallet-modal"
            tabIndex={-1}
            role="dialog"
            style={{ zIndex: 1095 }}
            onClick={(event: MouseEvent<HTMLDivElement>) => {
              if (event.target === event.currentTarget) {
                closeDeleteModal()
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar eliminacion</h5>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeDeleteModal} />
                </div>
                <div className="modal-body">
                  <p className="mb-0">
                    ¿Seguro que deseas eliminar la cartera{' '}
                    <span className="fw-semibold">{walletToDelete?.name}</span>?
                  </p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={closeDeleteModal}>
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-danger" onClick={confirmDeleteWallet}>
                    Eliminar cartera
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1090 }} />
        </>
      )}
    </AppLayout>
  )
}

export default withAuth(Carteras)

