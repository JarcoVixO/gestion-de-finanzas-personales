'use client'

import { useEffect, useTransition } from 'react'
import { toCarteraSummary } from '../cartera.schema'
import { useCarteraStore } from './useCarteraStore'
import {
  listarCarterasAction,
  crearCarteraAction,
  actualizarCarteraAction,
  eliminarCarteraAction
} from '../cartera.actions'
import type { CreateCarteraInput, UpdateCarteraInput } from '../cartera.schema'

export function useCarteras() {
  const { carteras, isLoading, setCarteras, setLoading } = useCarteraStore()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setLoading(true)
    listarCarterasAction().then((result) => {
      if (result.ok) setCarteras(result.data.map(toCarteraSummary))
      setLoading(false)
    })
  }, [])

  const crear = (input: CreateCarteraInput) =>
    startTransition(async () => {
      const result = await crearCarteraAction(input)
      if (result.ok)
        setCarteras([toCarteraSummary(result.data), ...carteras])
    })

  const actualizar = (id: string, input: Partial<UpdateCarteraInput>) =>
    startTransition(async () => {
      const result = await actualizarCarteraAction(id, input)
      if (result.ok)
        setCarteras(carteras.map((c) => c.id === id ? toCarteraSummary(result.data) : c))
    })

  const eliminar = (id: string) =>
    startTransition(async () => {
      const result = await eliminarCarteraAction(id)
      if (result.ok)
        setCarteras(carteras.filter((c) => c.id !== id))
    })

  return {
    carteras,
    isLoading: isLoading || isPending,
    crear,
    actualizar,
    eliminar
  }
}