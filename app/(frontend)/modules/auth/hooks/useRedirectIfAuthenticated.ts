"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '../services/authService'

export function useRedirectIfAuthenticated(destination = '/finanzas'): boolean {
  const router = useRouter()
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true)

  useEffect(() => {
    const session = getSession()

    if (session) {
      router.replace(destination)
      return
    }

    setIsCheckingSession(false)
  }, [destination, router])

  return isCheckingSession
}
