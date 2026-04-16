// ISORA X – Edge Function: Generación de Imágenes
// Desarrollado por: Isander Yaxiel Devs
//
// Genera imágenes usando Stability AI o HuggingFace

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { data: { user } } = await supabaseClient.auth.getUser()
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Obtener perfil
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Verificar límite de imágenes
    const imageLimits: Record<string, number> = {
      free: 10,
      basic: 100,
      pro: 500,
      ultra: -1,
    }

    const limit = imageLimits[profile?.plan || 'free']
    
    if (limit !== -1 && (profile?.images_used || 0) >= limit) {
      return new Response(
        JSON.stringify({ error: 'Límite de imágenes alcanzado', upgrade_url: '/pricing' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      )
    }

    const { prompt, width = 512, height = 512 } = await req.json()

    // Llamar a Stability AI (o HuggingFace como fallback)
    const stabilityKey = Deno.env.get('STABILITY_API_KEY')
    
    if (!stabilityKey) {
      // Demo mode
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      await supabaseClient
        .from('profiles')
        .update({ images_used: (profile?.images_used || 0) + 1 })
        .eq('id', user.id)

      return new Response(
        JSON.stringify({ 
          image_url: `https://placehold.co/${width}x${height}/3B82F6/ffffff?text=ISORA+X+AI+Image`,
          demo: true,
          message: `[MODO DEMO] En producción con Stability AI, generaría: "${prompt}"`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Llamada real a Stability AI
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${stabilityKey}`,
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: height,
        width: width,
        samples: 1,
        steps: 30,
      }),
    })

    if (!response.ok) {
      throw new Error(`Stability API error: ${response.status}`)
    }

    const result = await response.json()
    const imageBase64 = result.artifacts[0].base64

    // Actualizar contador
    await supabaseClient
      .from('profiles')
      .update({ images_used: (profile?.images_used || 0) + 1 })
      .eq('id', user.id)

    return new Response(
      JSON.stringify({ 
        image_data: imageBase64,
        demo: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
