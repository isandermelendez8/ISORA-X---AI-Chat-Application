// ISORA X - Sistema de Autenticación con Supabase
// Desarrollado por: Isander Yaxiel Devs
// 
// Este sistema de autenticación utiliza Supabase Auth para gestionar usuarios
// de manera segura y escalable. Incluye integración con proveedores OAuth
// y gestión de sesiones JWT.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || ''
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserPlan = 'free' | 'basic' | 'pro' | 'ultra'

export interface UserProfile {
  id: string
  email: string
  plan: UserPlan
  messages_used: number
  messages_limit: number
  images_used: number
  images_limit: number
  documents_used: number
  documents_limit: number
  created_at: string
}

export const PLAN_LIMITS: Record<UserPlan, {
  messages: number
  images: number
  documents: number
  agents: number
  searches: number
  storage: string
  price: string
  features: string[]
}> = {
  free: {
    messages: 50,
    images: 10,
    documents: 5,
    agents: 3,
    searches: 5,
    storage: '100MB',
    price: '$0',
    features: [
      '20-50 mensajes/día',
      'Modelos básicos (Llama 3 / Mistral)',
      '5-10 imágenes/día',
      '3-5 documentos/día',
      '3 tareas automáticas/día',
      'Resolución media (512-768px)',
      'Código básico (200-300 líneas)',
      '5 búsquedas web/día',
      'Cola lenta (low priority)'
    ]
  },
  basic: {
    messages: 200,
    images: -1, // ilimitadas suaves
    documents: 50,
    agents: 10,
    searches: 50,
    storage: '1GB',
    price: '$5-10/mes',
    features: [
      '200 mensajes/día',
      'Imágenes ilimitadas suaves',
      '1GB documentos',
      'Chat mejorado',
      'Prioridad normal',
      'Soporte por email'
    ]
  },
  pro: {
    messages: 1000,
    images: -1,
    documents: 200,
    agents: 50,
    searches: 200,
    storage: '10GB',
    price: '$15-25/mes',
    features: [
      'GPT-4 / Modelos avanzados',
      'Agentes automáticos ilimitados',
      'Video + voz básica',
      '10GB almacenamiento RAG',
      'Multi-agentes simples',
      'Prioridad alta',
      'Soporte prioritario'
    ]
  },
  ultra: {
    messages: -1,
    images: -1,
    documents: -1,
    agents: -1,
    searches: -1,
    storage: '100GB',
    price: '$40+/mes',
    features: [
      'Todo ilimitado razonable',
      'Multi-agente completo',
      'Automatización real (workflows)',
      'API access',
      'Voice cloning',
      'Video generation',
      'Inpainting/Outpainting',
      'GPU dedicado',
      'Soporte 24/7'
    ]
  }
}
