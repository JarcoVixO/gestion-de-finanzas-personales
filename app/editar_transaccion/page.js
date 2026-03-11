"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../../components/Layout'

export default function EditarTransaccion() {
  const router = useRouter()
  const [description, setDescription] = useState('Supermercado Central')
  const [amount, setAmount] = useState('85.40')

  return (
    <Layout title="Editar Transacción - Mi Finanzas">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h3 className="text-xl font-bold text-slate-900">Editar Transacción</h3>
            <button
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              onClick={() => router.push('/transacciones')}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Descripción</label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:border-primary focus:ring-primary text-base py-2.5 px-4"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Monto ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:border-primary focus:ring-primary text-base py-2.5 pl-8 pr-4"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                className="flex-1 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl transition-colors"
                onClick={() => router.push('/transacciones')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-[2] bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">save</span>
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
