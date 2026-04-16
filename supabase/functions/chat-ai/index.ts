// ISORA X – Edge Function: Chat con IA Real
// Desarrollado por: Isander Yaxiel Devs
//
// Esta función serverless maneja:
// 1. Llamadas a HuggingFace (Llama, Mistral, etc.)
// 2. Control de créditos/límites por usuario
// 3. Registro de uso en base de datos
// 4. Fallback entre modelos

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Modelos disponibles en HuggingFace Inference API
const MODELS = {
  llama3: 'meta-llama/Llama-2-70b-chat-hf',
  mistral: 'mistralai/Mistral-7B-Instruct-v0.2',
  codellama: 'codellama/CodeLlama-34b-Instruct-hf',
  neural: 'HuggingFaceH4/zephyr-7b-beta',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Verificar autenticación
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
        JSON.stringify({ error: 'No autorizado. Inicia sesión primero.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // 2. Obtener perfil y verificar créditos
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Perfil no encontrado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Verificar límites del plan
    const planLimits: Record<string, { messages: number }> = {
      free: { messages: 50 },
      basic: { messages: 200 },
      pro: { messages: 1000 },
      ultra: { messages: -1 }, // Ilimitado
    }

    const limit = planLimits[profile.plan]?.messages ?? 50
    
    if (limit !== -1 && profile.messages_used >= limit) {
      return new Response(
        JSON.stringify({ 
          error: 'Límite de mensajes alcanzado',
          plan: profile.plan,
          used: profile.messages_used,
          limit: limit,
          upgrade_url: '/pricing'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      )
    }

    // 3. Obtener mensaje del request
    const { message, model = 'mistral', history = [] } = await req.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Mensaje requerido' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // 4. Preparar prompt para la IA
    const systemPrompt = `Eres ISORA X, un asistente de IA avanzado. El usuario tiene el plan ${profile.plan}. Responde de manera útil, precisa y concisa.`
    
    const fullPrompt = history.length > 0
      ? `${systemPrompt}\n\nHistorial:\n${history.map((h: any) => `${h.role}: ${h.content}`).join('\n')}\n\nUsuario: ${message}\nISORA X:`
      : `${systemPrompt}\n\nUsuario: ${message}\nISORA X:`

    // 5. Llamar a HuggingFace Inference API
    const hfToken = Deno.env.get('HUGGINGFACE_API_TOKEN')
    
    if (!hfToken) {
      // Si no hay token, usar respuesta simulada pero indicar el problema
      console.error('HUGGINGFACE_API_TOKEN no configurado')
      
      // Simular delay de IA
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockResponse = `[MODO DEMO - HuggingFace no configurado] Como usuario del plan ${profile.plan}, entiendo tu mensaje: "${message}". En producción con HuggingFace conectado, esto sería una respuesta real de ${model}. Configura tu API token en las variables de entorno de Supabase.`
      
      // Actualizar contador de mensajes (incluso en demo)
      await supabaseClient
        .from('profiles')
        .update({ messages_used: profile.messages_used + 1 })
        .eq('id', user.id)
      
      return new Response(
        JSON.stringify({ 
          response: mockResponse,
          model: model,
          demo: true,
          credits_left: limit === -1 ? 'unlimited' : limit - profile.messages_used - 1
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Llamada real a HuggingFace
    const modelId = MODELS[model as keyof typeof MODELS] || MODELS.mistral
    
    const hfResponse = await fetch(
      `https://api-inference.huggingface.co/models/${modelId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false,
          },
        }),
      }
    )

    if (!hfResponse.ok) {
      const error = await hfResponse.text()
      console.error('HuggingFace error:', error)
      
      // Fallback a respuesta de error
      return new Response(
        JSON.stringify({ 
          error: 'El modelo de IA está cargando o no disponible. Intenta en unos segundos.',
          details: error
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 503 }
      )
    }

    const hfResult = await hfResponse.json()
    
    // HuggingFace devuelve array de objetos
    const aiResponse = Array.isArray(hfResult) 
      ? hfResult[0]?.generated_text 
      : hfResult.generated_text

    // 6. Registrar uso en base de datos
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ 
        messages_used: profile.messages_used + 1,
        last_message_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error actualizando uso:', updateError)
    }

    // Registrar en tabla de logs (opcional)
    await supabaseClient
      .from('chat_logs')
      .insert({
        user_id: user.id,
        message: message.slice(0, 500), // Limitar tamaño
        response: aiResponse?.slice(0, 1000) ?? '',
        model: model,
        created_at: new Date().toISOString()
      })
      .catch(console.error) // No fallar si esto falla

    // 7. Responder al cliente
    return new Response(
      JSON.stringify({ 
        response: aiResponse?.trim() || 'No se pudo generar respuesta',
        model: model,
        credits_left: limit === -1 ? 'unlimited' : limit - profile.messages_used - 1,
        demo: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
