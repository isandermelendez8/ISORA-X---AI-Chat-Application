// ISORA X - Modal de Autenticación
// Desarrollado por: Isander Yaxiel Devs
// 
// Componente de login/registro con UI de Supabase Auth.
// Incluye autenticación social y detección de límites de plan.

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Loader2, Github, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  requireAuth?: boolean
}

export function AuthModal({ isOpen, onClose, onSuccess, requireAuth = false }: AuthModalProps) {
  const { signIn, signUp, signInWithOAuth, user, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')

  // Si ya está autenticado, cerrar modal
  if (user && isOpen) {
    onSuccess?.()
    onClose()
    return null
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const { error } = await signIn(email, password)
    
    if (error) {
      toast.error('Error al iniciar sesión: ' + error.message)
    } else {
      toast.success('¡Bienvenido a ISORA X!')
      onSuccess?.()
      onClose()
    }
    
    setIsLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const { error } = await signUp(email, password)
    
    if (error) {
      toast.error('Error al registrarse: ' + error.message)
    } else {
      toast.success('¡Cuenta creada! Revisa tu email para confirmar.')
      setActiveTab('login')
    }
    
    setIsLoading(false)
  }

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'discord') => {
    setIsLoading(true)
    try {
      await signInWithOAuth(provider)
    } catch (error) {
      toast.error('Error con autenticación social')
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#0A0B14] border-[#1E2030] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {requireAuth ? '🔒 Acceso Requerido' : 'ISORA X'}
          </DialogTitle>
          {requireAuth && (
            <p className="text-center text-sm text-gray-400">
              Inicia sesión para continuar usando el chat inteligente
            </p>
          )}
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#1E2030]">
            <TabsTrigger value="login" className="data-[state=active]:bg-[#2A2D45]">
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-[#2A2D45]">
              Crear Cuenta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#1E2030] border-[#2A2D45] text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#1E2030] border-[#2A2D45] text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED]"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Iniciar Sesión
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#1E2030] border-[#2A2D45] text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Contraseña</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#1E2030] border-[#2A2D45] text-white"
                  required
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED]"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Crear Cuenta Gratis
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative my-4">
          <Separator className="bg-[#2A2D45]" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A0B14] px-2 text-xs text-gray-400">
            O continuar con
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading}
            className="bg-[#1E2030] border-[#2A2D45] hover:bg-[#2A2D45] text-white"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('github')}
            disabled={isLoading}
            className="bg-[#1E2030] border-[#2A2D45] hover:bg-[#2A2D45] text-white"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>

        <div className="mt-4 p-3 bg-[#1E2030] rounded-lg border border-[#2A2D45]">
          <p className="text-xs text-center text-gray-400">
            🎁 Plan Gratis incluye: 50 mensajes/día, 10 imágenes, modelos Llama 3
          </p>
          <p className="text-xs text-center text-[#3B82F6] mt-1 cursor-pointer hover:underline">
            Ver todos los planes →
          </p>
        </div>

        <p className="text-xs text-center text-gray-500 mt-2">
          Desarrollado por <span className="text-[#3B82F6]">Isander Yaxiel Devs</span>
        </p>
      </DialogContent>
    </Dialog>
  )
}
