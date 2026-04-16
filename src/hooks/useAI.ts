// ISORA X – Hook para llamar a la IA (Chat e Imágenes)
// Desarrollado por: Isander Yaxiel Devs
//
// Hook React que se conecta a las Edge Functions de Supabase

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

// Detectar si estamos en Vercel o en desarrollo local
const API_BASE_URL = import.meta.env.VERCEL_URL 
  ? `https://${import.meta.env.VERCEL_URL}` 
  : '' // Vacío = mismo origen (Vercel se encarga)

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface UseAIProps {
  onCreditUpdate?: (remaining: number | 'unlimited') => void
}

export function useAI({ onCreditUpdate }: UseAIProps = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (
    message: string,
    history: ChatMessage[] = [],
    model: 'llama3' | 'mistral' | 'codellama' | 'neural' = 'mistral'
  ): Promise<string | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      if (!token) {
        throw new Error('No estás autenticado')
      }

      // Intentar usar API de Vercel primero (sin necesidad de Supabase)
      const response = await fetch(
        `${API_BASE_URL}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            history,
            model,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          toast.error(`Límite alcanzado: ${data.used}/${data.limit} mensajes. ¡Actualiza tu plan!`)
          throw new Error('Límite de mensajes alcanzado')
        }
        throw new Error(data.error || 'Error en la respuesta de IA')
      }

      // Notificar créditos restantes
      if (onCreditUpdate && data.credits_left !== undefined) {
        onCreditUpdate(data.credits_left)
      }

      // Mostrar toast si es modo demo
      if (data.demo) {
        toast.info('⚠️ Modo Demo: HuggingFace no está configurado. Añade HUGGINGFACE_API_TOKEN en Supabase.')
      }

      return data.response

    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [onCreditUpdate])

  const generateImage = useCallback(async (
    prompt: string,
    width: number = 1024,
    height: number = 1024
  ): Promise<string | null> => {
    setIsLoading(true)
    setError(null)

    try {
      // Usar API de Vercel (sin necesidad de autenticación de Supabase)
      const response = await fetch(
        `${API_BASE_URL}/api/image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            width,
            height,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error generando imagen')
      }

      if (data.demo) {
        toast.info('⚠️ Modo Demo: Stability AI no está configurado.')
      }

      return data.image_data || data.image_url

    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    sendMessage,
    generateImage,
    isLoading,
    error,
  }
}
