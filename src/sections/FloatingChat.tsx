import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { useAI } from '@/hooks/useAI';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const { user, profile, canUseFeature, refreshProfile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      text: '¡Hola! Soy ISORA X 🤖\n\nEstoy conectado a IA real (HuggingFace) con modelos Llama, Mistral y más.\n\nInicia sesión para comenzar.', 
      isUser: false, 
      timestamp: new Date() 
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isLoading, error } = useAI({
    onCreditUpdate: (remaining) => {
      // Refrescar perfil para mostrar créditos actualizados
      refreshProfile?.();
    }
  });

  // Scroll to bottom cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    // Verificar si el usuario está autenticado
    if (!user) {
      setShowAuth(true);
      return;
    }
    
    // Verificar límites del plan
    if (!canUseFeature('messages')) {
      setMessages(prev => [...prev, { 
        text: '⚠️ Has alcanzado el límite de mensajes de tu plan. Actualiza a un plan superior para continuar.', 
        isUser: false,
        timestamp: new Date()
      }]);
      return;
    }
    
    // Guardar mensaje del usuario
    const userMessage = message;
    setMessages(prev => [...prev, { 
      text: userMessage, 
      isUser: true,
      timestamp: new Date()
    }]);
    setMessage('');
    
    // Preparar historial para la IA
    const history = messages
      .filter(m => m.text !== '¡Hola! Soy ISORA X 🤖\n\nEstoy conectado a IA real (HuggingFace) con modelos Llama, Mistral y más.\n\nInicia sesión para comenzar.')
      .map(m => ({ role: m.isUser ? 'user' : 'assistant' as const, content: m.text }));
    
    // Llamar a la IA real
    const aiResponse = await sendMessage(userMessage, history, 'mistral');
    
    if (aiResponse) {
      setMessages(prev => [...prev, { 
        text: aiResponse, 
        isUser: false,
        timestamp: new Date()
      }]);
    } else if (error) {
      setMessages(prev => [...prev, { 
        text: `❌ Error: ${error}`, 
        isUser: false,
        timestamp: new Date()
      }]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[90] flex items-center gap-2 px-4 py-3 rounded-full glass-strong transition-all duration-300 hover:scale-105 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <MessageCircle size={18} className="text-[#2D6BFF]" />
        <span className="text-white text-sm font-medium">Chatear con ISORA X</span>
        {!user && <Lock size={12} className="text-amber-400" />}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-6 right-6 z-[90] w-[360px] max-w-[calc(100vw-48px)] rounded-[22px] glass-strong overflow-hidden transition-all duration-300 ${
          isOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2D6BFF]/20 flex items-center justify-center">
              <Sparkles size={16} className="text-[#2D6BFF]" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">ISORA X</h4>
              <p className="text-[#A6AEBB] text-xs">
                {user ? `Plan: ${profile?.plan || 'free'}` : 'Inicia sesión para chatear'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-[#A6AEBB]" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-[280px] overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.isUser
                    ? 'bg-[#2D6BFF] text-white rounded-br-md'
                    : 'glass text-[#F4F6FF] rounded-bl-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={user ? "Escribe un mensaje..." : "Inicia sesión para chatear..."}
              className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#A6AEBB]/60 focus:outline-none focus:ring-2 focus:ring-[#2D6BFF]/50 border border-white/10"
            />
            <button
              onClick={handleSend}
              disabled={!user}
              className="w-10 h-10 rounded-xl bg-[#2D6BFF] flex items-center justify-center hover:bg-[#1E52CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {user ? (
                <Send size={16} className="text-white" />
              ) : (
                <Lock size={16} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)}
        requireAuth={true}
      />
    </>
  );
};

export default FloatingChat;
