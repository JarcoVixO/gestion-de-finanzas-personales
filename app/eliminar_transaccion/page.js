"use client"

import { useRouter } from 'next/navigation'
import Layout from '../../components/Layout'

export default function EliminarTransaccion() {
  const router = useRouter()

  return (
    <Layout title="Eliminar Transacción - Mi Finanzas">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-red-600 text-3xl">warning</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Eliminar Transacción</h3>
            <p className="text-slate-500">¿Estás seguro que quieres eliminar esta transacción? Esta acción no se puede deshacer.</p>
          </div>

          <div className="px-6 pb-6 flex gap-3">
            <button
              className="flex-1 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl transition-colors"
              onClick={() => router.push('/transacciones')}
            >
              Cancelar
            </button>
            <button
              className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
