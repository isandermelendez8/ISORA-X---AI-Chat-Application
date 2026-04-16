// ISORA X - API Serverless para generación de imágenes
// Funciona en Vercel sin necesidad de backend local

export default async function handler(req, res) {
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
    const { prompt, width = 1024, height = 1024 } = req.body;

    const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

    if (!HF_TOKEN) {
      // Demo mode - retorna placeholder
      return res.status(200).json({
        image_url: `https://placehold.co/${width}x${height}/3B82F6/ffffff?text=${encodeURIComponent(prompt.slice(0, 30))}`,
        demo: true,
        note: 'Para imágenes reales, configura HUGGINGFACE_API_TOKEN en Vercel'
      });
    }

    // Llamar a Stable Diffusion en HuggingFace
    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width,
            height,
            num_inference_steps: 50,
            guidance_scale: 7.5
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HuggingFace error: ${response.status}`);
    }

    // HuggingFace retorna la imagen como blob
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    return res.status(200).json({
      image_url: dataUrl,
      model: 'stable-diffusion-xl',
      prompt
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(200).json({
      image_url: `https://placehold.co/1024x1024/ef4444/ffffff?text=Error:+${encodeURIComponent(error.message)}`,
      error: error.message,
      demo: true
    });
  }
}
