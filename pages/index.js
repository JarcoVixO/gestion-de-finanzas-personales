import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Saltar el login al iniciar y llevar al usuario a la vista principal
    router.replace('/transacciones')
  }, [router])

  return null
}
