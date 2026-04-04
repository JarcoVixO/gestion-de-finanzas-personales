"use client"

import type { ComponentType } from 'react'

export default function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  function ProtectedPage(props: P) {
    // Route access is enforced by root middleware.
    return <WrappedComponent {...props} />
  }

  ProtectedPage.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return ProtectedPage
}
