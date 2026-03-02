import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useStore } from '../store/useStore'

export default function NuevaTransaccion() {
  const { accounts, addTransaction } = useStore()
  const [type, setType] = useState('expense')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [accountId, setAccountId] = useState('main')
  const [category, setCategory] = useState('food')
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    const finalAmount = type === 'expense' ? -Math.abs(parseFloat(amount || 0)) : Math.abs(parseFloat(amount || 0))
    addTransaction({ description, amount: finalAmount, accountId })
    router.push('/transacciones')
  }

  return (
    <Layout title="Nueva Transacción - Mi Finanzas">
      {/* Background Content */}
      <header className="flex items-center justify-between border-b border-primary/10 bg-white px-6 py-3 lg:px-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">account_balance_wallet</span>
            <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">FinanceFlow</h2>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 lg:px-10 relative">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Transacciones</h1>
            <p className="text-slate-500 mt-1">Historial detallado de tus movimientos</p>
          </div>
        </div>

        {/* Modal Overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => router.push('/transacciones')}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary/5">
              <h3 className="text-xl font-bold text-slate-900">Nueva Transacción</h3>
              <button
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                onClick={() => router.push('/transacciones')}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              {/* Type Toggle */}
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <label className="relative flex-1 cursor-pointer">
                  <input
                    checked={type === 'expense'}
                    className="sr-only peer"
                    name="type"
                    type="radio"
                    value="expense"
                    onChange={() => setType('expense')}
                  />
                  <div className="flex items-center justify-center py-2 text-sm font-bold rounded-lg peer-checked:bg-white peer-checked:text-primary text-slate-500 peer-checked:shadow-sm transition-all">
                    <span className="material-symbols-outlined text-lg mr-2">remove_circle</span>
                    Gasto
                  </div>
                </label>
                <label className="relative flex-1 cursor-pointer">
                  <input
                    checked={type === 'income'}
                    className="sr-only peer"
                    name="type"
                    type="radio"
                    value="income"
                    onChange={() => setType('income')}
                  />
                  <div className="flex items-center justify-center py-2 text-sm font-bold rounded-lg peer-checked:bg-white peer-checked:text-green-600 text-slate-500 peer-checked:shadow-sm transition-all">
                    <span className="material-symbols-outlined text-lg mr-2">add_circle</span>
                    Ingreso
                  </div>
                </label>
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Descripción / Nombre</label>
                <input
                  className="w-full bg-slate-50 border border-primary/10 rounded-lg focus:border-primary focus:ring-primary text-base py-2.5 px-4"
                  placeholder="Ej: Compra semanal"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Amount & Date Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Monto ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                      className="w-full bg-slate-50 border border-primary/10 rounded-lg focus:border-primary focus:ring-primary text-base py-2.5 pl-8 pr-4"
                      placeholder="0.00"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Fecha</label>
                  <input
                    className="w-full bg-slate-50 border border-primary/10 rounded-lg focus:border-primary focus:ring-primary text-base py-2.5 px-4"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Wallet & Category Selection */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Cuenta / Cartera</label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-slate-50 border border-primary/10 rounded-lg focus:border-primary focus:ring-primary text-base py-2.5 px-4"
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                    >
                      <option value="main">Nómina Principal</option>
                      <option value="savings">Ahorros Digitales</option>
                      <option value="cash">Efectivo</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Categoría</label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-slate-50 border border-primary/10 rounded-lg focus:border-primary focus:ring-primary text-base py-2.5 px-4"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="food">🍕 Comida & Restaurantes</option>
                      <option value="transport">🚗 Transporte</option>
                      <option value="savings">💰 Ahorros</option>
                      <option value="salary">💼 Salario</option>
                      <option value="leisure">🎮 Ocio</option>
                      <option value="other">📦 Otros</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  className="order-2 sm:order-1 flex-1 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => router.push('/transacciones')}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="order-1 sm:order-2 flex-[2] bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">check</span>
                  Guardar Transacción
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  )
}
