import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Mail, Twitter, Github, Linkedin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ctaRef.current,
        { y: '6vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const footerLinks = {
    Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Resources: ['Documentation', 'API Reference', 'Community', 'Support'],
    Legal: ['Privacy', 'Terms', 'Security'],
  };

  const socialLinks = [
    { icon: Twitter, href: '#' },
    { icon: Github, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Mail, href: '#' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#05060B] pt-24 pb-12"
    >
      {/* CTA Block */}
      <div 
        ref={ctaRef}
        className="w-full px-6 lg:px-16 xl:px-24 mb-24"
      >
        <div className="relative rounded-[32px] overflow-hidden border border-white/10">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1A2A] via-[#05060B] to-[#0B1A2A]" />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(45, 107, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(45, 107, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#2D6BFF]/10 rounded-full blur-[100px]" />

          {/* Content */}
          <div className="relative z-10 py-20 md:py-28 px-6 md:px-12 text-center">
            <h2 className="headline-section text-white mb-6">
              START BUILDING WITH AETHER
            </h2>
            <p className="text-[#A6AEBB] text-lg max-w-xl mx-auto mb-10">
              Get early access and ship your next feature in hours—not weeks.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn-primary text-white flex items-center gap-2 group">
                Request early access
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-outline text-white">
                Contact sales
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full px-6 lg:px-16 xl:px-24 border-t border-white/5 pt-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="font-display font-bold text-2xl text-white hover:text-[#2D6BFF] transition-colors">
              Aether
            </a>
            <p className="text-[#A6AEBB] text-sm mt-4 max-w-xs">
              AI-native coding assistant that plans, writes, tests, and deploys.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#2D6BFF]/20 hover:text-[#2D6BFF] transition-all text-[#A6AEBB]"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[#A6AEBB] text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-white/5">
          <p className="text-[#A6AEBB] text-sm">
            © 2026 AetherAI. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-[#A6AEBB] text-sm hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[#A6AEBB] text-sm hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default CTASection;
