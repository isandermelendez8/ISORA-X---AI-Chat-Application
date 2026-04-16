// ISORA X - Menú de Usuario
// Desarrollado por: Isander Yaxiel Devs
// 
// Menú desplegable con información del usuario y opciones de cuenta.

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, LogOut, Settings, Crown, Sparkles, Shield } from 'lucide-react'
import { PricingModal } from './PricingModal'
import { SettingsPanel } from './SettingsPanel'
import { AdminPanel } from './AdminPanel'

// Email del administrador maestro
const MASTER_EMAIL = 'isandermelendez8@gmail.com'

export function UserMenu() {
  const { user, profile, signOut } = useAuth()
  const [showPricing, setShowPricing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  
  // Verificar si es admin maestro
  const isMaster = user?.email === MASTER_EMAIL

  if (!user) {
    return null
  }

  const initials = user.email?.charAt(0).toUpperCase() || 'U'
  const planName = profile?.plan || 'free'
  const planColors: Record<string, string> = {
    free: 'bg-gray-500',
    basic: 'bg-blue-500',
    pro: 'bg-purple-500',
    ultra: 'bg-amber-500'
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
            <Avatar className="h-9 w-9 border-2 border-[#2A2D45]">
              <AvatarFallback className={`${planColors[planName]} text-white text-sm font-medium`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            {planName !== 'free' && (
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${planColors[planName]} border-2 border-[#0A0B14]`} />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-[#1E2030] border-[#2A2D45] text-white" align="end">
          <div className="flex items-center gap-3 p-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={`${planColors[planName]} text-white`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {planName === 'free' ? (
                  <span className="text-xs text-gray-400">Plan Gratis</span>
                ) : planName === 'basic' ? (
                  <span className="text-xs text-blue-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Basic
                  </span>
                ) : planName === 'pro' ? (
                  <span className="text-xs text-purple-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Pro
                  </span>
                ) : (
                  <span className="text-xs text-amber-400 flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Ultra
                  </span>
                )}
              </div>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-[#2A2D45]" />

          {/* Uso del plan */}
          {profile && (
            <div className="px-3 py-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Mensajes</span>
                  <span className="text-gray-300">
                    {profile.messages_used} / {profile.messages_limit === -1 ? '∞' : profile.messages_limit}
                  </span>
                </div>
                <div className="h-1.5 bg-[#2A2D45] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] transition-all"
                    style={{ width: `${profile.messages_limit === -1 ? 0 : (profile.messages_used / profile.messages_limit) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <DropdownMenuSeparator className="bg-[#2A2D45]" />

          <DropdownMenuItem 
            className="cursor-pointer focus:bg-[#2A2D45] focus:text-white"
            onClick={() => setShowPricing(true)}
          >
            <Crown className="mr-2 h-4 w-4" />
            Planes y Precios
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="cursor-pointer focus:bg-[#2A2D45] focus:text-white"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </DropdownMenuItem>

          {/* Admin Panel - Solo para maestro */}
          {isMaster && (
            <>
              <DropdownMenuItem 
                className="cursor-pointer focus:bg-red-500/20 focus:text-red-400"
                onClick={() => setShowAdmin(true)}
              >
                <Shield className="mr-2 h-4 w-4" />
                <span className="font-semibold">Admin Control</span>
                <span className="ml-auto text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded">MASTER</span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="bg-[#2A2D45]" />

          <DropdownMenuItem 
            className="cursor-pointer focus:bg-red-500/20 focus:text-red-400"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      {isMaster && (
        <AdminPanel isOpen={showAdmin} onClose={() => setShowAdmin(false)} />
      )}
    </>
  )
}
