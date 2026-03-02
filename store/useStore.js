import { create } from 'zustand'

export const useStore = create((set) => ({
  count: 0,
  increase: () => set((s) => ({ count: s.count + 1 })),
  decrease: () => set((s) => ({ count: s.count - 1 })),

  accounts: [
    { id: 'acc1', name: 'Caja', balance: 1200.0, type: 'Efectivo' },
    { id: 'acc2', name: 'Cuenta Banco', balance: 3400.5, type: 'Banco' }
  ],

  transactions: [
    { id: 't1', date: '2026-03-01', description: 'Compra supermercado', amount: -45.6, accountId: 'acc1', accountName: 'Caja' },
    { id: 't2', date: '2026-03-02', description: 'Sueldo', amount: 1500.0, accountId: 'acc2', accountName: 'Cuenta Banco' }
  ],

  budgets: [
    { id: 'b1', name: 'Comida', limit: 300 },
    { id: 'b2', name: 'Transporte', limit: 100 }
  ],

  addTransaction: (tx) => set((state) => {
    const id = 't' + (state.transactions.length + 1)
    const account = state.accounts.find(a => a.id === tx.accountId) || { name: 'Desconocida' }
    const newTx = {
      id,
      date: new Date().toISOString().slice(0,10),
      description: tx.description,
      amount: tx.amount,
      accountId: tx.accountId,
      accountName: account.name
    }
    return { transactions: [newTx, ...state.transactions] }
  })
}))
