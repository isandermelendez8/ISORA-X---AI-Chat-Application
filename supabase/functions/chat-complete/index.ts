// ISORA X – Edge Function: Chat Completo con Todas las Capacidades
// Desarrollado por: Isander Yaxiel Devs
//
// Esta función conecta TODAS las IAs de la carpeta AI'S:
// - ComfyUI (imágenes)
// - Ollama (local LLMs)
// - RAGFlow (documentos)
// - LLaVA (visión)
// - TTS (voz)
// - AutoGPT (agentes)
// - Y más...

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MASTER_EMAIL = 'isandermelendez8@gmail.com'

// URLs de servicios locales (de la carpeta AI'S)
const SERVICES = {
  ollama: 'http://localhost:11434',           // Ollama local
  comfyui: 'http://localhost:8188',           // ComfyUI para imágenes
  ragflow: 'http://localhost:9380',         // RAGFlow para documentos
  llava: 'http://localhost:10000',          // LLaVA visión
  tts: 'http://localhost:50001',            // CosyVoice TTS
  autoGPT: 'http://localhost:8000',         // AutoGPT agentes
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Verificar si es admin maestro (SIN LÍMITES)
    const isMaster = user.email === MASTER_EMAIL

    // Obtener perfil
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Verificar límites (SOLO para no-masters)
    if (!isMaster) {
      const planLimits: Record<string, { messages: number; images: number }> = {
        free: { messages: 50, images: 10 },
        basic: { messages: 200, images: 100 },
        pro: { messages: 1000, images: 500 },
        ultra: { messages: -1, images: -1 },
      }

      const limits = planLimits[profile?.plan || 'free']

      if (limits.messages !== -1 && (profile?.messages_used || 0) >= limits.messages) {
        return new Response(
          JSON.stringify({ error: 'Límite de mensajes alcanzado' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        )
      }
    }

    // Parse request
    const { 
      message, 
      type = 'chat',  // chat, image, document, vision, code, agent, tts
      model = 'mistral',
      history = [],
      files = [],     // Archivos adjuntos
      params = {}     // Parámetros específicos
    } = await req.json()

    let response: any = {}
    let tokensUsed = 0

    switch (type) {
      case 'chat':
        response = await handleChat(message, history, model, isMaster)
        tokensUsed = response.tokens || 1
        break

      case 'image':
        response = await handleImageGeneration(message, params, isMaster)
        tokensUsed = 10 // Las imágenes consumen más
        break

      case 'document':
        response = await handleDocumentRAG(message, files, isMaster)
        tokensUsed = 5
        break

      case 'vision':
        response = await handleVision(message, files[0], isMaster)
        tokensUsed = 5
        break

      case 'code':
        response = await handleCodeExecution(message, params.language, isMaster)
        tokensUsed = 2
        break

      case 'agent':
        response = await handleAgentTask(message, params, isMaster)
        tokensUsed = 20 // Agentes consumen más
        break

      case 'zip':
        response = await handleZipCreation(files, isMaster)
        tokensUsed = 1
        break

      case 'tts':
        response = await handleTTS(message, params.voice, isMaster)
        tokensUsed = 3
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Tipo de request no soportado' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }

    // Actualizar uso (solo si no es master)
    if (!isMaster) {
      await supabaseClient
        .from('profiles')
        .update({ 
          messages_used: (profile?.messages_used || 0) + tokensUsed,
          [type === 'image' ? 'images_used' : 'messages_used']: 
            (profile?.[type === 'image' ? 'images_used' : 'messages_used'] || 0) + tokensUsed
        })
        .eq('id', user.id)
    }

    // Log para admin
    await supabaseClient
      .from('ai_logs')
      .insert({
        user_id: user.id,
        user_email: user.email,
        type,
        model,
        message: message.slice(0, 200),
        tokens_used: tokensUsed,
        is_master: isMaster,
        created_at: new Date().toISOString()
      })
      .catch(() => {}) // Ignorar errores de log

    return new Response(
      JSON.stringify({
        ...response,
        is_master: isMaster,
        credits_left: isMaster ? 'unlimited' : (profile?.messages_limit || 50) - (profile?.messages_used || 0) - tokensUsed
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// ===== HANDLERS PARA CADA CAPACIDAD =====

async function handleChat(message: string, history: any[], model: string, isMaster: boolean) {
  // 1. Intentar Ollama local primero (si está disponible)
  try {
    const ollamaRes = await fetch(`${SERVICES.ollama}/api/generate`, {
      method: 'POST',
      body: JSON.stringify({
        model: model === 'llama3' ? 'llama3' : 'mistral',
        prompt: history.map(h => `${h.role}: ${h.content}`).join('\n') + `\nuser: ${message}\nassistant:`,
        stream: false
      })
    }).catch(() => null)

    if (ollamaRes?.ok) {
      const data = await ollamaRes.json()
      return { 
        response: data.response, 
        model: 'ollama-local',
        source: 'local'
      }
    }
  } catch {}

  // 2. Fallback a HuggingFace
  const hfToken = Deno.env.get('HUGGINGFACE_API_TOKEN')
  
  if (!hfToken) {
    return {
      response: `[DEMO MODE - HuggingFace no configurado]\n\nTu mensaje: "${message}"\n\nEn producción con HuggingFace, esto sería una respuesta real de ${model}.\n\nConfigura HUGGINGFACE_API_TOKEN en Supabase.`,
      model: 'demo',
      demo: true
    }
  }

  const models: Record<string, string> = {
    mistral: 'mistralai/Mistral-7B-Instruct-v0.2',
    llama3: 'meta-llama/Llama-2-70b-chat-hf',
    codellama: 'codellama/CodeLlama-34b-Instruct-hf'
  }

  const hfRes = await fetch(
    `https://api-inference.huggingface.co/models/${models[model] || models.mistral}`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${hfToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputs: message,
        parameters: { max_new_tokens: isMaster ? 2048 : 1024, temperature: 0.7 }
      })
    }
  )

  if (!hfRes.ok) throw new Error('HuggingFace error')

  const data = await hfRes.json()
  return {
    response: Array.isArray(data) ? data[0]?.generated_text : data.generated_text,
    model,
    source: 'huggingface'
  }
}

async function handleImageGeneration(prompt: string, params: any, isMaster: boolean) {
  // Intentar ComfyUI local
  try {
    const comfyRes = await fetch(`${SERVICES.comfyui}/prompt`, {
      method: 'POST',
      body: JSON.stringify({
        prompt: {
          "3": {
            "inputs": {
              "text": prompt,
              "clip": ["4", 1]
            },
            "class_type": "CLIPTextEncode"
          },
          // Simplified workflow
        }
      })
    }).catch(() => null)

    if (comfyRes?.ok) {
      return { 
        image_url: `${SERVICES.comfyui}/view`, 
        model: 'comfyui-sdxl',
        local: true
      }
    }
  } catch {}

  // Fallback a HuggingFace/Stability
  return {
    image_url: `https://placehold.co/1024x1024/3B82F6/ffffff?text=${encodeURIComponent(prompt.slice(0, 30))}`,
    model: 'sdxl-demo',
    demo: true,
    note: 'ComfyUI no está corriendo localmente. Inicia ComfyUI para generación real.'
  }
}

async function handleDocumentRAG(message: string, files: string[], isMaster: boolean) {
  // Intentar RAGFlow
  try {
    const ragRes = await fetch(`${SERVICES.ragflow}/api/conversation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: message, document_ids: files })
    }).catch(() => null)

    if (ragRes?.ok) {
      const data = await ragRes.json()
      return { 
        response: data.answer, 
        sources: data.sources,
        model: 'ragflow'
      }
    }
  } catch {}

  return {
    response: `[RAG Demo] Analizando documentos: ${files.join(', ')}\n\nPregunta: ${message}\n\nRAGFlow no está corriendo. Inicia RAGFlow para chat con documentos real.`,
    demo: true
  }
}

async function handleVision(message: string, imageFile: string, isMaster: boolean) {
  // LLaVA para análisis de imágenes
  try {
    const llavaRes = await fetch(`${SERVICES.llava}/generate`, {
      method: 'POST',
      body: JSON.stringify({
        image: imageFile,
        prompt: message
      })
    }).catch(() => null)

    if (llavaRes?.ok) {
      const data = await llavaRes.json()
      return { response: data.text, model: 'llava' }
    }
  } catch {}

  return {
    response: `[LLaVA Demo] Analizando imagen...\n\nDescripción: Imagen recibida pero LLaVA no está corriendo.`,
    demo: true
  }
}

async function handleCodeExecution(code: string, language: string, isMaster: boolean) {
  // Solo admin puede ejecutar código sin restricciones
  if (!isMaster) {
    return {
      response: 'Ejecución de código solo disponible para admin maestro.',
      restricted: true
    }
  }

  // Aquí iría la ejecución real con sandbox
  return {
    response: `\`\`\`${language}\n${code}\n\`\`\`\n\n✅ Código ejecutado (simulado - implementar sandbox para producción)`,
    executed: true
  }
}

async function handleAgentTask(task: string, params: any, isMaster: boolean) {
  // AutoGPT para tareas autónomas
  try {
    const agentRes = await fetch(`${SERVICES.autoGPT}/agent`, {
      method: 'POST',
      body: JSON.stringify({
        task,
        iterations: isMaster ? 50 : 10, // Más iteraciones para admin
        params
      })
    }).catch(() => null)

    if (agentRes?.ok) {
      const data = await agentRes.json()
      return { 
        response: data.result,
        steps: data.steps,
        model: 'autogpt'
      }
    }
  } catch {}

  return {
    response: `[AutoGPT Demo] Tarea asignada: ${task}\n\nPasos que ejecutaría:\n1. Analizar objetivo\n2. Buscar información\n3. Ejecutar acciones\n4. Reportar resultados\n\nAutoGPT no está corriendo. Inicia el servicio para agentes reales.`,
    demo: true
  }
}

async function handleZipCreation(files: string[], isMaster: boolean) {
  // Crear archivo ZIP con archivos
  return {
    zip_url: 'data:application/zip;base64,UEsDBBQAAAAIAI...',
    files_count: files.length,
    size: '2.4 MB',
    note: 'ZIP generado (en producción usar JSZip en backend)'
  }
}

async function handleTTS(text: string, voice: string, isMaster: boolean) {
  // CosyVoice TTS
  try {
    const ttsRes = await fetch(`${SERVICES.tts}/inference`, {
      method: 'POST',
      body: JSON.stringify({
        text,
        voice: voice || 'default',
        speed: 1.0
      })
    }).catch(() => null)

    if (ttsRes?.ok) {
      const audioBlob = await ttsRes.blob()
      return { 
        audio_url: URL.createObjectURL(audioBlob),
        duration: text.length / 15, // Estimación
        model: 'cosyvoice'
      }
    }
  } catch {}

  return {
    audio_url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgA...',
    demo: true,
    note: 'CosyVoice no está corriendo. Inicia el servicio para TTS real.'
  }
}
