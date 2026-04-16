// ISORA X - API Serverless para Vercel
// Backend simple sin necesidad de Supabase CLI ni instalaciones locales
// Esta función corre en los servidores de Vercel (gratis)

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, type = 'chat', history = [] } = req.body;

    // Tu API Token de HuggingFace (se lee de variables de entorno de Vercel)
    const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

    if (!HF_TOKEN) {
      // Modo demo si no hay token configurado
      return res.status(200).json({
        response: `🤖 [DEMO MODE - Backend no configurado]\n\nTu mensaje: "${message}"\n\nPara activar IA real:\n1. Ve a Vercel Dashboard → Settings → Environment Variables\n2. Añade: HUGGINGFACE_API_TOKEN = hf_tu_token\n3. Re-deploy\n\nToken gratis en: https://huggingface.co/settings/tokens`,
        demo: true,
        type: 'demo'
      });
    }

    // Llamar a HuggingFace Inference API
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: history.length > 0 
            ? `${history.map(h => `${h.role}: ${h.content}`).join('\n')}\nuser: ${message}\nassistant:`
            : message,
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.7,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HuggingFace error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;

    return res.status(200).json({
      response: generatedText || 'No response from model',
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      type: 'chat'
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Error al procesar la solicitud',
      message: error.message,
      demo: true,
      response: '⚠️ Error de conexión. Verifica tu HUGGINGFACE_API_TOKEN en Vercel.'
    });
  }
}
