// ISORA X – Panel de Administración (Master Control)
// Desarrollado por: Isander Yaxiel Devs
//
// Panel exclusivo para isandermelendez8@gmail.com
// Gestión completa de usuarios, estadísticas, y control del sistema

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  X, Users, UserCog, BarChart3, Shield, Mail, Lock, Eye, EyeOff,
  Trash2, Ban, CheckCircle, AlertTriangle, Activity, Database,
  Server, Zap, TrendingUp, Search, Filter, Download, RefreshCw,
  Settings, LogOut, Crown, MessageSquare, Image, FileText,
  Globe, Clock, Smartphone, HardDrive, Cpu, AlertCircle
} from 'lucide-react'

// Email del administrador maestro
const MASTER_EMAIL = 'isandermelendez8@gmail.com'

interface UserData {
  id: string
  email: string
  plan: string
  messages_used: number
  messages_limit: number
  images_used: number
  images_limit: number
  documents_used: number
  documents_limit: number
  created_at: string
  last_sign_in: string | null
  is_active: boolean
  provider: string
}

interface SystemStats {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  totalMessages: number
  totalImages: number
  totalDocuments: number
  revenue: number
  totalTokens: number
  avgResponseTime: number
}

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { user } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [users, setUsers] = useState<UserData[]>([])
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newPassword, setNewPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')

  // Verificar si es admin maestro
  useEffect(() => {
    if (user?.email === MASTER_EMAIL) {
      setIsAuthorized(true)
      fetchUsers()
      fetchStats()
    } else {
      setIsAuthorized(false)
      setLoading(false)
    }
  }, [user])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Obtener datos de auth de Supabase
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        // Si no podemos obtener auth users, usar los de profiles
        setUsers(data || [])
      } else {
        // Combinar datos
        const combinedUsers = (data || []).map((profile: any) => {
          const authUser = authUsers?.users?.find((u: any) => u.id === profile.id)
          return {
            ...profile,
            last_sign_in: authUser?.last_sign_in_at,
            provider: authUser?.app_metadata?.provider || 'email',
            is_active: !authUser?.banned_until
          }
        })
        setUsers(combinedUsers)
      }
    } catch (error) {
      toast.error('Error cargando usuarios')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Estadísticas de usuarios
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const today = new Date().toISOString().split('T')[0]
      const { count: newUsersToday } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)

      // Estadísticas de uso
      const { data: usageData } = await supabase
        .from('profiles')
        .select('messages_used, images_used, documents_used')

      const totalMessages = usageData?.reduce((acc, u) => acc + (u.messages_used || 0), 0) || 0
      const totalImages = usageData?.reduce((acc, u) => acc + (u.images_used || 0), 0) || 0
      const totalDocuments = usageData?.reduce((acc, u) => acc + (u.documents_used || 0), 0) || 0

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: totalUsers || 0,
        newUsersToday: newUsersToday || 0,
        totalMessages,
        totalImages,
        totalDocuments,
        revenue: 0 // Se calcularía con datos de pagos
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleDeactivateUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: '8760h' // 1 año
      })

      if (error) throw error

      toast.success('Usuario desactivado')
      fetchUsers()
    } catch (error) {
      toast.error('Error desactivando usuario')
    }
  }

  const handleActivateUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: '0'
      })

      if (error) throw error

      toast.success('Usuario activado')
      fetchUsers()
    } catch (error) {
      toast.error('Error activando usuario')
    }
  }

  const handleChangePassword = async () => {
    if (!selectedUser || !newPassword) return

    try {
      const { error } = await supabase.auth.admin.updateUserById(selectedUser.id, {
        password: newPassword
      })

      if (error) throw error

      toast.success('Contraseña actualizada')
      setNewPassword('')
      setShowUserDialog(false)
    } catch (error) {
      toast.error('Error cambiando contraseña')
    }
  }

  const handleChangeEmail = async () => {
    if (!selectedUser || !newEmail) return

    try {
      const { error } = await supabase.auth.admin.updateUserById(selectedUser.id, {
        email: newEmail
      })

      if (error) throw error

      // Actualizar también en profiles
      await supabase
        .from('profiles')
        .update({ email: newEmail })
        .eq('id', selectedUser.id)

      toast.success('Email actualizado')
      setNewEmail('')
      setShowUserDialog(false)
      fetchUsers()
    } catch (error) {
      toast.error('Error cambiando email')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro? Esta acción no se puede deshacer.')) return

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId)

      if (error) throw error

      toast.success('Usuario eliminado permanentemente')
      fetchUsers()
    } catch (error) {
      toast.error('Error eliminando usuario')
    }
  }

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id?.includes(searchQuery)
  )

  if (!isOpen) return null

  // Si no está autorizado
  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80">
        <div className="p-8 rounded-2xl bg-[#0A0B14] border border-red-500/30 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Acceso Denegado</h2>
          <p className="text-gray-400 mb-4">
            Solo el administrador maestro puede acceder a este panel.
          </p>
          <p className="text-sm text-gray-500">
            Tu email: {user?.email}
          </p>
          <Button onClick={onClose} className="mt-4 bg-red-500 hover:bg-red-600">
            Cerrar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[300] flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/70" onClick={onClose} />
      
      {/* Panel */}
      <div className="w-[90%] max-w-6xl h-full bg-[#0A0B14] border-l border-[#1E2030] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1E2030] bg-gradient-to-r from-[#1E2030] to-[#0A0B14]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-white flex items-center gap-2">
                Admin Control
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">MASTER</Badge>
              </h2>
              <p className="text-xs text-gray-400">{MASTER_EMAIL}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchUsers} className="border-[#2A2D45] text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refrescar
            </Button>
            <button onClick={onClose} className="p-2 hover:bg-[#1E2030] rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b border-[#1E2030] bg-[#0A0B14] p-0 h-auto">
            {[
              { id: 'overview', icon: BarChart3, label: 'Dashboard' },
              { id: 'users', icon: Users, label: 'Usuarios' },
              { id: 'activity', icon: Activity, label: 'Actividad' },
              { id: 'system', icon: Server, label: 'Sistema' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-1 py-4 data-[state=active]:bg-[#1E2030] data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-[#3B82F6]"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="flex-1">
            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="m-0 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Usuarios', value: stats?.totalUsers || 0, icon: Users, color: 'blue' },
                  { label: 'Activos Hoy', value: stats?.activeUsers || 0, icon: Activity, color: 'green' },
                  { label: 'Nuevos Hoy', value: stats?.newUsersToday || 0, icon: TrendingUp, color: 'purple' },
                  { label: 'Mensajes IA', value: stats?.totalMessages || 0, icon: MessageSquare, color: 'amber' },
                  { label: 'Imágenes Gen.', value: stats?.totalImages || 0, icon: Image, color: 'pink' },
                  { label: 'Tokens Usados', value: stats?.totalTokens || 0, icon: Zap, color: 'indigo' },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl bg-[#1E2030] border border-[#2A2D45] hover:border-[#3B82F6]/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                      <Badge variant="outline" className="text-xs border-[#2A2D45]">+12%</Badge>
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Uso del Sistema */}
                <div className="p-5 rounded-xl bg-[#1E2030] border border-[#2A2D45]">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Uso del Sistema
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Mensajes de Chat', value: stats?.totalMessages || 0, max: 100000, color: 'bg-blue-500' },
                      { label: 'Imágenes Generadas', value: stats?.totalImages || 0, max: 50000, color: 'bg-purple-500' },
                      { label: 'Documentos Procesados', value: stats?.totalDocuments || 0, max: 25000, color: 'bg-green-500' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="text-white">{item.value.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-[#2A2D45] rounded-full overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distribución de Planes */}
                <div className="p-5 rounded-xl bg-[#1E2030] border border-[#2A2D45]">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    Distribución de Planes
                  </h3>
                  <div className="space-y-3">
                    {[
                      { plan: 'Free', count: users.filter(u => u.plan === 'free').length, color: 'bg-gray-500' },
                      { plan: 'Basic', count: users.filter(u => u.plan === 'basic').length, color: 'bg-blue-500' },
                      { plan: 'Pro', count: users.filter(u => u.plan === 'pro').length, color: 'bg-purple-500' },
                      { plan: 'Ultra', count: users.filter(u => u.plan === 'ultra').length, color: 'bg-amber-500' },
                    ].map((item) => (
                      <div key={item.plan} className="flex items-center justify-between p-3 rounded-lg bg-[#2A2D45]/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-white font-medium">{item.plan}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400">{item.count} usuarios</span>
                          <Badge className="bg-[#3B82F6]/20 text-[#3B82F6]">
                            {((item.count / (users.length || 1)) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* USERS TAB */}
            <TabsContent value="users" className="m-0 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por email o ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-[#1E2030] border-[#2A2D45] text-white"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="border-[#2A2D45] text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                  <Button variant="outline" size="sm" className="border-[#2A2D45] text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-[#2A2D45] overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#1E2030]">
                    <TableRow className="border-[#2A2D45] hover:bg-transparent">
                      <TableHead className="text-gray-400">Usuario</TableHead>
                      <TableHead className="text-gray-400">Plan</TableHead>
                      <TableHead className="text-gray-400">Uso</TableHead>
                      <TableHead className="text-gray-400">Registro</TableHead>
                      <TableHead className="text-gray-400">Estado</TableHead>
                      <TableHead className="text-gray-400 text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((userData) => (
                      <TableRow key={userData.id} className="border-[#2A2D45] hover:bg-[#1E2030]">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{userData.email}</p>
                            <p className="text-xs text-gray-500 font-mono">{userData.id.slice(0, 8)}...</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            userData.plan === 'free' ? 'bg-gray-500/20 text-gray-400' :
                            userData.plan === 'basic' ? 'bg-blue-500/20 text-blue-400' :
                            userData.plan === 'pro' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-amber-500/20 text-amber-400'
                          }>
                            {userData.plan.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-gray-400">
                            <p>{userData.messages_used} msgs</p>
                            <p>{userData.images_used} imgs</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(userData.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={userData.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {userData.is_active ? 'Activo' : 'Bloqueado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedUser(userData)
                              setShowUserDialog(true)
                            }}
                            className="text-[#3B82F6] hover:bg-[#3B82F6]/10"
                          >
                            <UserCog className="w-4 h-4 mr-1" />
                            Gestionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* ACTIVITY TAB */}
            <TabsContent value="activity" className="m-0 p-6">
              <div className="p-8 text-center">
                <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Monitoreo de Actividad</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  El registro detallado de actividad se implementa con Supabase Realtime.
                  Conecta tu base de datos para ver actividad en tiempo real.
                </p>
              </div>
            </TabsContent>

            {/* SYSTEM TAB */}
            <TabsContent value="system" className="m-0 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-[#1E2030] border border-[#2A2D45]">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#3B82F6]" />
                    Base de Datos (Supabase)
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Estado</span>
                      <Badge className="bg-green-500/20 text-green-400">Conectado</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Proyecto</span>
                      <span className="text-white">ISORA X Production</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Región</span>
                      <span className="text-white">us-east-1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tablas</span>
                      <span className="text-white">profiles, auth, storage</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#1E2030] border border-[#2A2D45]">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#8B5CF6]" />
                    Servicios Conectados
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Supabase Auth', status: 'Activo', color: 'green' },
                      { name: 'Supabase Storage', status: 'Activo', color: 'green' },
                      { name: 'Hugging Face API', status: 'Configurar', color: 'yellow' },
                      { name: 'Stripe Payments', status: 'Desactivado', color: 'gray' },
                    ].map((service) => (
                      <div key={service.name} className="flex items-center justify-between p-2 rounded-lg bg-[#2A2D45]/50">
                        <span className="text-sm text-white">{service.name}</span>
                        <Badge className={`bg-${service.color}-500/20 text-${service.color}-400 text-xs`}>
                          {service.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#1E2030] border border-[#2A2D45] md:col-span-2">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Zona Peligrosa
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Limpiar Cache
                    </Button>
                    <Button variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
                      <Ban className="w-4 h-4 mr-2" />
                      Modo Mantenimiento
                    </Button>
                    <Button variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
                      <Database className="w-4 h-4 mr-2" />
                      Backup DB
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* User Management Dialog */}
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent className="bg-[#0A0B14] border-[#2A2D45] text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCog className="w-5 h-5 text-[#3B82F6]" />
                Gestionar Usuario
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {selectedUser?.email}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Cambiar Email */}
              <div className="p-4 rounded-lg bg-[#1E2030] border border-[#2A2D45]">
                <Label className="text-white mb-2 block flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#3B82F6]" />
                  Cambiar Email
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="nuevo@email.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="bg-[#2A2D45] border-[#3B82F6]/30 text-white"
                  />
                  <Button onClick={handleChangeEmail} size="sm" className="bg-[#3B82F6]">
                    Cambiar
                  </Button>
                </div>
              </div>

              {/* Cambiar Contraseña */}
              <div className="p-4 rounded-lg bg-[#1E2030] border border-[#2A2D45]">
                <Label className="text-white mb-2 block flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#8B5CF6]" />
                  Nueva Contraseña
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-[#2A2D45] border-[#8B5CF6]/30 text-white"
                  />
                  <Button onClick={handleChangePassword} size="sm" className="bg-[#8B5CF6]">
                    Actualizar
                  </Button>
                </div>
              </div>

              {/* Acciones */}
              <div className="grid grid-cols-2 gap-2">
                {selectedUser?.is_active ? (
                  <Button
                    variant="destructive"
                    onClick={() => selectedUser && handleDeactivateUser(selectedUser.id)}
                    className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Desactivar
                  </Button>
                ) : (
                  <Button
                    onClick={() => selectedUser && handleActivateUser(selectedUser.id)}
                    className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activar
                  </Button>
                )}
                
                <Button
                  variant="destructive"
                  onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
                  className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUserDialog(false)} className="border-[#2A2D45] text-white">
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
