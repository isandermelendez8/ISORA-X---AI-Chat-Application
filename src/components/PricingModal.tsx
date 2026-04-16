// ISORA X - Modal de Planes y Precios
// Desarrollado por: Isander Yaxiel Devs
// 
// Muestra los límites del plan gratis y las opciones de upgrade.
// Diseño inspirado en las mejores prácticas de SaaS modernos.

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Check, X, Sparkles, Zap, Crown, Infinity } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

const FREE_TIER_LIMITS = [
  {
    category: '💬 Chat / Inteligencia',
    items: [
      { text: '20–50 mensajes al día', available: true },
      { text: 'Modelos básicos (Llama 3 / Mistral)', available: true },
      { text: 'Sin acceso a GPT-4 / Claude avanzado', available: false },
      { text: 'Sin memoria permanente larga', available: false }
    ]
  },
  {
    category: '📚 Documentos (RAG)',
    items: [
      { text: '3–5 documentos por día', available: true },
      { text: 'Máximo 5–10MB por archivo', available: true },
      { text: 'Solo análisis básico', available: true },
      { text: 'Sin bases de conocimiento ilimitadas', available: false }
    ]
  },
  {
    category: '🤖 Agentes / Automatización',
    items: [
      { text: '3 tareas automáticas por día', available: true },
      { text: 'Solo tareas simples', available: true },
      { text: 'Sin multi-agentes', available: false },
      { text: 'Sin workflows complejos', available: false }
    ]
  },
  {
    category: '🎨 Generación Multimedia',
    items: [
      { text: '5–10 imágenes por día', available: true },
      { text: 'Resolución media (512–768px)', available: true },
      { text: 'Sin video generation', available: false },
      { text: 'Sin voice cloning', available: false },
      { text: 'Sin edición avanzada', available: false }
    ]
  },
  {
    category: '💼 Productividad',
    items: [
      { text: '10 tareas por día', available: true },
      { text: 'Archivos pequeños básicos', available: true },
      { text: 'Sin análisis pesado de datos', available: false }
    ]
  },
  {
    category: '🔧 Desarrollo',
    items: [
      { text: 'Código básico (200–300 líneas)', available: true },
      { text: 'Debug simple', available: true },
      { text: 'Sin generación de APIs completas', available: false },
      { text: 'Sin integración Git automática', available: false }
    ]
  },
  {
    category: '🌐 Web / Navegación',
    items: [
      { text: '5 búsquedas web por día', available: true },
      { text: 'Resúmenes simples', available: true },
      { text: 'Sin scraping completo de sitios', available: false }
    ]
  },
  {
    category: '⚡ Rendimiento',
    items: [
      { text: 'Cola lenta (low priority)', available: true },
      { text: 'Uso compartido de GPU', available: true },
      { text: 'Sin acceso a modelos premium', available: false }
    ]
  }
]

const PAID_PLANS = [
  {
    name: 'Basic',
    price: '$5-10',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    features: [
      '200 mensajes/día',
      'Imágenes ilimitadas suaves',
      '1GB documentos',
      'Chat mejorado',
      'Prioridad normal'
    ]
  },
  {
    name: 'Pro',
    price: '$15-25',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    popular: true,
    features: [
      'GPT-4 / Modelos avanzados',
      'Agentes automáticos ilimitados',
      'Video + voz básica',
      '10GB almacenamiento RAG',
      'Multi-agentes simples',
      'Prioridad alta'
    ]
  },
  {
    name: 'Ultra',
    price: '$40+',
    icon: Crown,
    color: 'from-amber-500 to-orange-500',
    features: [
      'Todo ilimitado razonable',
      'Multi-agente completo',
      'Automatización real (workflows)',
      'API access',
      'Voice cloning',
      'Video generation',
      'GPU dedicado'
    ]
  }
]

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { profile, getUsagePercent } = useAuth()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-[#0A0B14] border-[#1E2030] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Infinity className="w-6 h-6 text-[#3B82F6]" />
            ISORA X – Planes y Límites
          </DialogTitle>
        </DialogHeader>

        {/* Uso actual (si está logueado) */}
        {profile && (
          <div className="mb-6 p-4 bg-[#1E2030] rounded-lg border border-[#2A2D45]">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              Tu uso hoy (Plan {profile.plan})
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Mensajes</span>
                  <span>{profile.messages_used} / {profile.messages_limit === -1 ? '∞' : profile.messages_limit}</span>
                </div>
                <Progress value={getUsagePercent('messages')} className="h-2 bg-[#2A2D45]" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Imágenes</span>
                  <span>{profile.images_used} / {profile.images_limit === -1 ? '∞' : profile.images_limit}</span>
                </div>
                <Progress value={getUsagePercent('images')} className="h-2 bg-[#2A2D45]" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Documentos</span>
                  <span>{profile.documents_used} / {profile.documents_limit === -1 ? '∞' : profile.documents_limit}</span>
                </div>
                <Progress value={getUsagePercent('documents')} className="h-2 bg-[#2A2D45]" />
              </div>
            </div>
          </div>
        )}

        {/* Planes de pago */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {PAID_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-4 rounded-lg border ${
                plan.popular
                  ? 'border-[#8B5CF6] bg-gradient-to-b from-[#1E2030] to-[#2A2D45]'
                  : 'border-[#2A2D45] bg-[#1E2030]'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#8B5CF6] text-white text-xs">
                  Más Popular
                </Badge>
              )}
              <div className="text-center mb-4">
                <plan.icon className={`w-8 h-8 mx-auto mb-2 bg-gradient-to-r ${plan.color} rounded-lg p-1.5`} />
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <p className="text-2xl font-bold text-[#3B82F6]">{plan.price}<span className="text-sm text-gray-400">/mes</span></p>
              </div>
              <ul className="space-y-2 text-sm">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full mt-4 bg-gradient-to-r ${plan.color} hover:opacity-90`}
                onClick={() => alert('Próximamente: Pasarela de pagos')}
              >
                Elegir {plan.name}
              </Button>
            </div>
          ))}
        </div>

        {/* Límites del plan gratis */}
        <div className="border-t border-[#2A2D45] pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🎁 Plan Gratis – Límites Detallados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FREE_TIER_LIMITS.map((section, idx) => (
              <div key={idx} className="p-3 bg-[#1E2030] rounded-lg border border-[#2A2D45]">
                <h4 className="font-medium text-sm mb-2 text-[#3B82F6]">{section.category}</h4>
                <ul className="space-y-1 text-xs">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-1.5">
                      {item.available ? (
                        <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={item.available ? 'text-gray-300' : 'text-gray-500'}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Desarrollado por <span className="text-[#3B82F6]">Isander Yaxiel Devs</span>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            © 2026 ISORA X – Inteligencia Artificial de Nueva Generación
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
