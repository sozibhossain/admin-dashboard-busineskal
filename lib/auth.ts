import { Buffer } from 'buffer'
import type { NextAuthConfig, Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: string
    user?: {
      id: string
      email: string
      name: string
      role: string
    }
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/v1'
const EXPIRY_SKEW_MS = 60 * 1000
let refreshPromise: Promise<JWT> | null = null

type AuthResponse = {
  accessToken: string
  refreshToken: string
  name: string
  email: string
  role: string
  _id: string
}

const decodeJwt = (token: string): { exp?: number } | null => {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'))
  } catch {
    return null
  }
}

const getAccessTokenExpires = (token: string): number => {
  const decoded = decodeJwt(token)
  if (decoded?.exp) {
    return decoded.exp * 1000
  }
  return Date.now() + 15 * 60 * 1000
}

const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  if (refreshPromise) {
    return refreshPromise
  }
  refreshPromise = (async () => {
    try {
      if (!token.refreshToken) {
        return { ...token, error: 'MissingRefreshToken' }
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      })

      const result = await response.json()
      if (!response.ok || !result?.data?.accessToken) {
        return { ...token, error: 'RefreshAccessTokenError' }
      }

      return {
        ...token,
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken ?? token.refreshToken,
        accessTokenExpires: getAccessTokenExpires(result.data.accessToken),
        error: undefined,
      }
    } catch {
      return { ...token, error: 'RefreshAccessTokenError' }
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const result = await response.json()
          const data: AuthResponse | undefined = result?.data

          if (!response.ok || !data?.accessToken) {
            throw new Error(result?.message || 'Invalid credentials')
          }

          return {
            id: data._id,
            email: data.email,
            name: data.name,
            role: data.role,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            accessTokenExpires: getAccessTokenExpires(data.accessToken),
          }
        } catch {
          throw new Error('Invalid credentials')
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpires = user.accessTokenExpires
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
      if (token.error) {
        return token
      }
      if (!token.accessTokenExpires && token.accessToken) {
        token.accessTokenExpires = getAccessTokenExpires(token.accessToken)
      }
      if (
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires - EXPIRY_SKEW_MS
      ) {
        return token
      }
      return refreshAccessToken(token)
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.accessToken = token.accessToken
        session.refreshToken = token.refreshToken
        session.accessTokenExpires = token.accessTokenExpires
        session.error = token.error
        session.user = token.user || session.user
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} satisfies NextAuthConfig
