'use client'

import { ReactNode, useEffect } from 'react'
import { SessionProvider, signOut, useSession } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      <SessionErrorWatcher />
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </SessionProvider>
  )
}

function SessionErrorWatcher() {
  const { data: session } = useSession()

  useEffect(() => {
    if (
      session?.error === 'RefreshAccessTokenError' ||
      session?.error === 'MissingRefreshToken'
    ) {
      signOut({ callbackUrl: '/auth/login' })
    }
  }, [session?.error])

  return null
}
