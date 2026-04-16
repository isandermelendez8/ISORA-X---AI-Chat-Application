# 🚀 ISORA X – Guía de Deploy a Google (Firebase + Hosting)

**Desarrollado por: Isander Yaxiel Devs**  
**Email Maestro: isandermelendez8@gmail.com**

---

## 📋 Índice

1. [Preparativos](#1-preparativos)
2. [Firebase Setup](#2-firebase-setup)
3. [Supabase Configuración](#3-supabase-configuración)
4. [Build y Deploy](#4-build-y-deploy)
5. [Admin Panel - Gestión de Usuarios](#5-admin-panel---gestión-de-usuarios)
6. [Conectar IAs](#6-conectar-ias)
7. [Dominio Personalizado](#7-dominio-personalizado)
8. [Solución de Problemas](#8-solución-de-problemas)

---

## 1. Preparativos

### Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

### Login en Firebase
```bash
firebase login
# Usa tu cuenta: isandermelendez8@gmail.com
```

### Instalar dependencias del proyecto
```bash
cd "ISORA X WEBSITE"
npm install
```

---

## 2. Firebase Setup

### Crear proyecto en Firebase Console
1. Ve a https://console.firebase.google.com/
2. Clic en "Add project"
3. Nombre: `isora-x-prod`
4. Habilita Google Analytics (opcional)

### Inicializar Firebase en el proyecto
```bash
firebase init
```

**Seleccionar:**
- ✅ Hosting: Configure files for Firebase Hosting
- ✅ Use an existing project → `isora-x-prod`
- What do you want to use as your public directory? → `dist`
- Configure as a single-page app? → `Yes`
- Set up automatic builds and deploys with GitHub? → `No` (por ahora)

### firebase.json resultante
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 3. Supabase Configuración

### Variables de entorno en producción

Crea archivo `.env.production`:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publico
```

**IMPORTANTE:** Nunca subas la SERVICE ROLE KEY a Git. Úsala solo en el Admin Panel backend.

### SQL para tabla de perfiles (ejecutar en SQL Editor de Supabase)

```sql
-- Tabla de perfiles de usuarios
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  plan TEXT DEFAULT 'free',
  messages_used INTEGER DEFAULT 0,
  messages_limit INTEGER DEFAULT 50,
  images_used INTEGER DEFAULT 0,
  images_limit INTEGER DEFAULT 10,
  documents_used INTEGER DEFAULT 0,
  documents_limit INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de seguridad (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Política: Usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, plan)
  VALUES (NEW.id, NEW.email, 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Configurar Auth Providers

En Supabase Dashboard → Authentication → Providers:

**Habilitar:**
- ✅ Email (sin confirmación para fácil acceso)
- ✅ Google OAuth
- ✅ GitHub OAuth

**Google OAuth Setup:**
1. Ve a https://console.cloud.google.com/
2. APIs & Services → Credentials
3. Create Credentials → OAuth client ID
4. Tipo: Web application
5. Authorized redirect URIs: `https://tu-proyecto.supabase.co/auth/v1/callback`
6. Copia Client ID y Secret a Supabase

---

## 4. Build y Deploy

### Build de producción
```bash
npm run build
```

Esto crea carpeta `dist/` con los archivos optimizados.

### Deploy a Firebase
```bash
firebase deploy
```

**Resultado:**
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/isora-x-prod/overview
Hosting URL: https://isora-x-prod.web.app
```

### Deploy con mensaje personalizado
```bash
firebase deploy -m "Release v2.0 - Auth completo"
```

---

## 5. Admin Panel - Gestión de Usuarios

### Acceso al Admin Panel

El panel está protegido y **SOLO** accesible con:  
📧 `isandermelendez8@gmail.com`

**URL de acceso:**
```
https://tu-web-app.com/admin
```

O desde el menú de usuario → "Admin Control" (aparece solo para el admin)

### Funcionalidades del Admin Panel

#### 📊 Dashboard
- Total de usuarios registrados
- Usuarios activos hoy
- Nuevos registros hoy
- Total de mensajes enviados
- Distribución por planes (Free/Basic/Pro/Ultra)

#### 👥 Gestión de Usuarios
Para cada usuario puedes:

| Acción | Cómo hacerlo |
|--------|--------------|
| **Ver datos** | Clic en "Gestionar" → Ver email, ID, plan |
| **Desactivar cuenta** | Botón "Desactivar" → Banea por 1 año |
| **Activar cuenta** | Botón "Activar" → Quita el ban |
| **Cambiar email** | Input nuevo email → "Cambiar" |
| **Cambiar contraseña** | Input nueva contraseña → "Actualizar" |
| **Eliminar usuario** | Botón "Eliminar" → Borra permanentemente |

#### 📈 Estadísticas de Uso
- Mensajes totales del sistema
- Imágenes generadas
- Documentos procesados
- Storage usado

#### ⚙️ Sistema
- Estado de Supabase
- Servicios conectados
- Limpieza de cache
- Modo mantenimiento
- Backup de base de datos

### Cómo ver todos los datos de un usuario

1. Ve a la pestaña "Usuarios"
2. Busca por email o ID
3. Clic en "Gestionar"
4. Verás:
   - Email actual
   - ID único (UUID)
   - Plan contratado
   - Mensajes usados/límite
   - Imágenes usadas/límite
   - Documentos usados/límite
   - Fecha de registro
   - Último login
   - Provider (email/google/github)
   - Estado (Activo/Bloqueado)

### Exportar lista de usuarios

En la pestaña "Usuarios":
1. Botón "Exportar" → Descarga CSV con:
   - Emails
   - Planes
   - Fechas de registro
   - Estado de actividad

---

## 6. Conectar TODAS las IAs (De carpeta AI'S)

### 🔧 Servicios Locales a Configurar

#### 1. Ollama (LLMs Locales)
```bash
# Descargar de https://ollama.com/download
ollama pull llama3
ollama pull mistral
ollama pull codellama
ollama pull llava  # Para visión

# Verificar
ollama list
# Debe mostrar los modelos descargados
```

**Puerto:** 11434

#### 2. ComfyUI (Generación de Imágenes)
```bash
cd "AI'S/ComfyUI-0.19.1"
pip install -r requirements.txt
python main.py --listen 0.0.0.0 --port 8188
```

**Puerto:** 8188
**URL:** http://localhost:8188

#### 3. RAGFlow (Chat con Documentos)
```bash
cd "AI'S/ragflow-0.24.0"
docker compose -f docker/docker-compose.yml up -d
```

**Puerto:** 9380
**URL:** http://localhost:9380

#### 4. LLaVA (Visión - Análisis de Imágenes)
```bash
cd "AI'S/LLaVA-1.2.0"
pip install -e .
python -m llava.serve.gradio_web_server --controller http://localhost:10000
```

**Puerto:** 10000

#### 5. CosyVoice (Texto a Voz)
```bash
cd "AI'S/CosyVoice-main"
pip install -r requirements.txt
python webui.py
```

**Puerto:** 50001

#### 6. AutoGPT (Agentes Autónomos)
```bash
cd "AI'S/AutoGPT-autogpt-platform-beta-v0.6.56"
cd autogpt
pip install -e .
./autogpt.sh run
```

**Puerto:** 8000

#### 7. Tesseract (OCR)
```bash
# Windows: Descargar instalador
cd "AI'S/tesseract-5.5.2"
# Agregar a PATH
```

### Hugging Face (Gratis, Open Source)

1. Crea cuenta en https://huggingface.co/
2. Ve a Settings → Access Tokens
3. Genera nuevo token
4. Añade a variables de entorno:
   ```env
   HUGGINGFACE_API_TOKEN=hf_tu_token_aqui
   ```

### Variables de Entorno de Supabase (Secrets)

```bash
supabase secrets set HUGGINGFACE_API_TOKEN=hf_xxxx
supabase secrets set OPENAI_API_KEY=sk-xxxx
supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxxx
supabase secrets set STABILITY_API_KEY=sk-xxxx
```

### Deploy Edge Functions

```bash
# Deploy todas las functions
supabase functions deploy chat-ai
supabase functions deploy chat-complete
supabase functions deploy generate-image

# Verificar
supabase functions list
```

### Modelos disponibles:
```javascript
const MODELS = {
  chat: 'meta-llama/Llama-2-70b-chat-hf',
  code: 'bigcode/starcoder',
  images: 'stabilityai/stable-diffusion-xl-base-1.0'
}
```

### Ollama (Local, 100% privado)

Para correr IA en tu propio servidor:

```bash
# Instalar Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Descargar modelos
ollama pull llama3
ollama pull codellama
ollama pull llava  # visión
```

En el código:
```javascript
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'llama3',
    prompt: 'Tu mensaje aquí'
  })
})
```

### OpenAI API (Pro)

Para usuarios Ultra con GPT-4:

```env
VITE_OPENAI_API_KEY=sk-tu-key-aqui
```

---

## 7. Dominio Personalizado

### Configurar dominio propio en Firebase

1. Firebase Console → Hosting
2. Clic en "Add custom domain"
3. Ingresa: `isora-x.com` (o tu dominio)
4. Sigue los pasos para verificar:
   - Agrega registros TXT en tu DNS
   - Agrega registros A para apuntar a Firebase

### DNS Records necesarios

```
Tipo: A
Nombre: @
Valor: 151.101.65.195
       151.101.1.195

Tipo: A
Nombre: www
Valor: 151.101.65.195
       151.101.1.195

Tipo: TXT
Nombre: @
Valor: google-site-verification=xxxxxxxx
```

---

## 8. Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Supabase connection failed
- Verifica que las variables de entorno estén correctas
- Confirma que la tabla `profiles` existe
- Verifica que RLS policies estén configuradas

### Error: Admin Panel no aparece
- Debes estar logueado con: `isandermelendez8@gmail.com`
- El email debe coincidir exactamente
- Verificar en Supabase que el usuario tenga ese email

### Error: OAuth no funciona
- Verifica Authorized redirect URIs en Google Console
- Confirma Client ID y Secret en Supabase
- Prueba en modo incógnito

### Build falla
```bash
# Limpiar cache
npm run build -- --force

# O manualmente
rm -rf dist
npm run build
```

---

## 📞 Soporte

Para cualquier problema:

1. Revisa los logs de Firebase:
   ```bash
   firebase hosting:clone isora-x-prod
   ```

2. Revisa logs de Supabase:
   - Supabase Dashboard → Logs

3. Contacto: isandermelendez8@gmail.com

---

## 🎉 Checklist Final

- [ ] Firebase proyecto creado
- [ ] Supabase proyecto creado
- [ ] Tabla `profiles` configurada
- [ ] Auth providers habilitados (Email, Google)
- [ ] Variables de entorno en `.env.production`
- [ ] Build exitoso (`npm run build`)
- [ ] Deploy a Firebase (`firebase deploy`)
- [ ] Dominio personalizado configurado (opcional)
- [ ] Admin Panel accesible con email maestro
- [ ] IAs conectadas (Hugging Face / Ollama)

---

## 🔐 Seguridad Importante

**NUNCA subas estos archivos a Git:**
```
.env.local
.env.production
.env
serviceAccountKey.json
```

**Añade a `.gitignore`:**
```gitignore
# Environment
.env
.env.local
.env.production

# Firebase
.firebase/
firebase-debug.log

# Build
dist/
```

---

**© 2026 ISORA X - Desarrollado por Isander Yaxiel Devs**
