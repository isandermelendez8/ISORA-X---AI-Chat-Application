import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';
import { AuthProvider } from '@/contexts/AuthContext';

// Import sections
import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import CraftSection from './sections/CraftSection';
import CapabilitiesSection from './sections/CapabilitiesSection';
import SafetySection from './sections/SafetySection';
import ModesSection from './sections/ModesSection';
import IntegrationsSection from './sections/IntegrationsSection';
import CTASection from './sections/CTASection';
import FloatingChat from './sections/FloatingChat';

// Import Pages
import ChatPage from './pages/ChatPage';

gsap.registerPlugin(ScrollTrigger);

// ISORA X - Aplicación Principal
// Desarrollado por: Isander Yaxiel Devs
// 
// Sistema de inteligencia artificial de nueva generación con autenticación
// integrada mediante Supabase Auth.

function AppContent() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for all sections to mount before setting up global snap
    const timer = setTimeout(() => {
      setupGlobalSnap();
    }, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const setupGlobalSnap = () => {
    const pinned = ScrollTrigger.getAll()
      .filter(st => st.vars.pin)
      .sort((a, b) => a.start - b.start);
    
    const maxScroll = ScrollTrigger.maxScroll(window);
    
    if (!maxScroll || pinned.length === 0) return;

    const pinnedRanges = pinned.map(st => ({
      start: st.start / maxScroll,
      end: (st.end ?? st.start) / maxScroll,
      center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
    }));

    ScrollTrigger.create({
      snap: {
        snapTo: (value: number) => {
          const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
          if (!inPinned) return value;

          const target = pinnedRanges.reduce((closest, r) =>
            Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
            pinnedRanges[0]?.center ?? 0
          );
          return target;
        },
        duration: { min: 0.15, max: 0.35 },
        delay: 0,
        ease: "power2.out"
      }
    });
  };

  return (
    <div ref={mainRef} className="relative bg-[#05060B] min-h-screen">
      {/* Noise Overlay */}
      <div className="noise-overlay" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative">
        {/* Section 1: Hero */}
        <HeroSection className="z-10" />
        
        {/* Section 2: The Craft */}
        <CraftSection className="z-20" />
        
        {/* Section 3: Capabilities */}
        <CapabilitiesSection className="z-30" />
        
        {/* Section 4: Safety */}
        <SafetySection />
        
        {/* Section 5: Modes */}
        <ModesSection className="z-40" />
        
        {/* Section 6: Integrations */}
        <IntegrationsSection />
        
        {/* Section 7: CTA */}
        <CTASection />
      </main>
      
      {/* Floating Chat */}
      <FloatingChat />
    </div>
  );
}

// Landing Page Component
function LandingPage() {
  return (
    <>
      <Navigation />
      <main className="relative">
        <HeroSection className="z-10" />
        <CraftSection className="z-20" />
        <CapabilitiesSection className="z-30" />
        <SafetySection />
        <ModesSection className="z-40" />
        <IntegrationsSection />
        <CTASection />
      </main>
      <FloatingChat />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/app" element={<ChatPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
