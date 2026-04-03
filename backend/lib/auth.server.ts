import { createClient } from '@supabase/supabase-js'

export const AUTH_ACCESS_TOKEN_COOKIE = 'auth-access-token'
export const AUTH_REFRESH_TOKEN_COOKIE = 'auth-refresh-token'

export const authCookieOptions = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production'
}

const getSupabaseEnv = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Faltan las variables de entorno de Supabase.')
  }

  return { url, anonKey }
}

export const createSupabaseServerAuthClient = () => {
  const { url, anonKey } = getSupabaseEnv()
  return createClient(url, anonKey)
}

export const verifyAccessToken = async (accessToken: string): Promise<boolean> => {
  const supabase = createSupabaseServerAuthClient()

  const { data, error } = await supabase.auth.getUser(accessToken)
  return Boolean(data.user && !error)
}
