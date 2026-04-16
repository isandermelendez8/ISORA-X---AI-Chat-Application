// ISORA X - Contexto de Autenticación
// Desarrollado por: Isander Yaxiel Devs
// 
// Sistema de gestión de estado de autenticación para ISORA X.
// Maneja sesiones de usuario, perfiles y límites de planes.

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase, type UserProfile, PLAN_LIMITS, type UserPlan } from '@/lib/supabase'
import type { Session, User } from '@supabase/supabase-js'

const MASTER_EMAIL = 'isandermelendez8@gmail.com'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  isLoading: boolean
  isMaster: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithOAuth: (provider: 'google' | 'github' | 'discord') => Promise<void>
  refreshProfile: () => Promise<void>
  canUseFeature: (feature: keyof typeof PLAN_LIMITS[UserPlan]) => boolean
  getUsagePercent: (feature: 'messages' | 'images' | 'documents') => number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setIsLoading(false)
    })

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // Si no existe el perfil, crear uno nuevo con plan free
        const newProfile: Partial<UserProfile> = {
          id: userId,
          plan: 'free',
          messages_used: 0,
          messages_limit: PLAN_LIMITS.free.messages,
          images_used: 0,
          images_limit: PLAN_LIMITS.free.images,
          documents_used: 0,
          documents_limit: PLAN_LIMITS.free.documents
        }
        
        const { data: created, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single()
          
        if (!createError && created) {
          setProfile(created as UserProfile)
        }
      } else {
        setProfile(data as UserProfile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signInWithOAuth = async (provider: 'google' | 'github' | 'discord') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const isMaster = user?.email === MASTER_EMAIL

  const canUseFeature = (feature: keyof typeof PLAN_LIMITS['free']) => {
    // Admin maestro tiene acceso ilimitado a TODO
    if (isMaster) return true
    
    if (!profile) return false
    const plan = profile.plan as UserPlan
    const limit = PLAN_LIMITS[plan][feature as keyof typeof PLAN_LIMITS['free']]
    
    if (limit === -1) return true // Ilimitado
    
    const used = (profile[`${feature}_used` as keyof UserProfile] as number) || 0
    const limitNum = limit as number
    return used < limitNum
  }

  const getUsagePercent = (feature: 'messages' | 'images' | 'documents') => {
    if (!profile) return 0
    const limit = profile[`${feature}_limit` as keyof UserProfile] as number
    const used = (profile[`${feature}_used` as keyof UserProfile] as number) || 0
    const limitNum = limit as number
    if (limitNum === -1) return 0 // Ilimitado
    return Math.min((used / limit) * 100, 100)
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isLoading,
      isMaster,
      signIn,
      signUp,
      signOut,
      signInWithOAuth,
      refreshProfile,
      canUseFeature,
      getUsagePercent
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
