# 🧠 ISORA X – Plataforma de Inteligencia Artificial de Nueva Generación

**Desarrollado por: [Isander Yaxiel Devs](https://github.com/isandermelendez8)**

ISORA X es una plataforma de inteligencia artificial de nueva generación que combina múltiples capacidades AI en una sola interfaz moderna y elegante. Incluye chat inteligente, RAG (chat con documentos), agentes autónomos, generación multimedia y más.

## ✨ Características Principales

- **🤖 Chat Inteligente** – Interactúa con LLMs locales y de la nube
- **📚 RAG (Retrieval Augmented Generation)** – Chatea con tus documentos
- **🤖 Agentes Autónomos** – Automatización de tareas complejas
- **🎨 Generación Multimedia** – Imágenes, video y voz con AI
- **🔐 Autenticación Segura** – Sistema completo con Supabase Auth
- **💎 Planes Flexibles** – Desde gratis hasta ultra con todo ilimitado

## 🚀 Tecnologías Utilizadas

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Animaciones:** GSAP + ScrollTrigger
- **Autenticación:** Supabase Auth
- **Estado:** React Context + Hooks
- **UI Components:** Radix UI

## 📋 Planes Disponibles

| Plan | Precio | Mensajes | Imágenes | Almacenamiento |
|------|--------|----------|----------|----------------|
| 🆓 Free | $0/mes | 50/día | 10/día | 100MB |
| 🔵 Basic | $5-10/mes | 200/día | Ilimitadas* | 1GB |
| 🟣 Pro | $15-25/mes | 1000/día | Ilimitadas | 10GB |
| 🟡 Ultra | $40+/mes | Ilimitados | Ilimitadas | 100GB |

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/isandermelendez8/trapcity-rp-website-v2.git
cd "ISORA X/ISORA X WEBSITE"
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Edita `.env.local` y añade tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 4. Configurar Supabase
1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a Authentication > Settings y habilita los providers que desees (Email, Google, GitHub)
3. Crea la tabla `profiles` en la base de datos:

```sql
create table profiles (
  id uuid references auth.users primary key,
  email text,
  plan text default 'free',
  messages_used int default 0,
  messages_limit int default 50,
  images_used int default 0,
  images_limit int default 10,
  documents_used int default 0,
  documents_limit int default 5,
  created_at timestamp default now()
);
```

### 5. Iniciar desarrollo
```bash
npm run dev
```

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── AuthModal.tsx   # Modal de login/registro
│   ├── PricingModal.tsx # Modal de planes y precios
│   └── UserMenu.tsx    # Menú de usuario
├── contexts/
│   └── AuthContext.tsx  # Contexto de autenticación
├── lib/
│   └── supabase.ts      # Cliente de Supabase
├── sections/            # Secciones de la landing
└── env.d.ts            # Tipos de entorno
```

## 👨‍💻 Desarrollador

**Isander Yaxiel Devs**
- GitHub: [@isandermelendez8](https://github.com/isandermelendez8)
- Proyecto: ISORA X – Plataforma de IA de Nueva Generación

## 📝 Licencia

Este proyecto es propietario y fue desarrollado por Isander Yaxiel Devs.

## 🙏 Créditos

- [Supabase](https://supabase.com) – Autenticación y base de datos
- [shadcn/ui](https://ui.shadcn.com) – Componentes UI
- [Radix UI](https://radix-ui.com) – Primitives accesibles
- [GSAP](https://greensock.com/gsap) – Animaciones de alto rendimiento

---

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
