import { useEffect, useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { UserMenu } from '@/components/UserMenu';
import { PricingModal } from '@/components/PricingModal';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Producto', href: '#craft' },
    { label: 'Seguridad', href: '#safety' },
    { label: 'Modos', href: '#modes' },
    { label: 'Integraciones', href: '#integrations' },
    { label: 'Planes', href: '#', onClick: () => setShowPricing(true) },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled 
            ? 'glass-strong py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="w-full px-6 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#" 
            className="font-display font-bold text-xl tracking-tight text-white hover:text-[#2D6BFF] transition-colors flex items-center gap-2"
          >
            <span className="text-2xl">🧠</span> ISORA X
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => link.onClick ? link.onClick() : scrollToSection(link.href)}
                className="text-sm text-[#A6AEBB] hover:text-white transition-colors duration-300"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA Button / User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <button 
                  onClick={() => setShowAuth(true)}
                  className="btn-outline text-sm text-white flex items-center gap-2"
                >
                  <User size={16} />
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => setShowPricing(true)}
                  className="btn-primary text-sm text-white"
                >
                  Ver Planes
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-[99] glass-strong transition-all duration-500 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="text-2xl font-display font-semibold text-white hover:text-[#2D6BFF] transition-colors"
            >
              {link.label}
            </button>
          ))}
          {user ? (
            <div className="flex flex-col items-center gap-2 mt-4">
              <UserMenu />
              <span className="text-sm text-gray-400">{user.email}</span>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuth(true)}
              className="btn-primary mt-4 text-white flex items-center gap-2"
            >
              <User size={18} />
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
      />
      <PricingModal 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
      />
    </>
  );
};

export default Navigation;
