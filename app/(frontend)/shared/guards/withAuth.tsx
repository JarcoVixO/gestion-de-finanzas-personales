"use client"

import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getSession } from '../../modules/auth/services/authService'
import StatusScreen from '../components/StatusScreen'

export default function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  function ProtectedPage(props: P) {
    const router = useRouter()
    const pathname = usePathname()
    const [isChecking, setIsChecking] = useState<boolean>(true)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

    useEffect(() => {
      const session = getSession()

      if (!session) {
        router.replace('/login')
        return
      }

      setIsAuthenticated(true)
      setIsChecking(false)
    }, [pathname, router])

    if (isChecking || !isAuthenticated) {
      return <StatusScreen message="Cargando sesión..." />
    }

    return <WrappedComponent {...props} />
  }

  ProtectedPage.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return ProtectedPage
}
