import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  className?: string;
}

const HeroSection = ({ className = '' }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const craftRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Auto-play entrance animation on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Glow animation
      tl.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2 },
        0
      );

      // Craft entrance
      tl.fromTo(
        craftRef.current,
        { y: '18vh', scale: 0.92, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1 },
        0.2
      );

      // Headline word reveal
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        tl.fromTo(
          words,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.03 },
          0.4
        );
      }

      // Subheadline
      tl.fromTo(
        subheadlineRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.8
      );

      // CTA
      tl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        1
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back
            gsap.set([craftRef.current, headlineRef.current, subheadlineRef.current, ctaRef.current], {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              rotation: 0
            });
          }
        }
      });

      // ENTRANCE (0-30%): Hold - elements already visible from load animation
      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      // Headline exits
      scrollTl.fromTo(
        headlineRef.current,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.70
      );

      // Subheadline exits
      scrollTl.fromTo(
        subheadlineRef.current,
        { y: 0, opacity: 1 },
        { y: '-6vh', opacity: 0, ease: 'power2.in' },
        0.68
      );

      // CTA exits
      scrollTl.fromTo(
        ctaRef.current,
        { y: 0, opacity: 1 },
        { y: '-4vh', opacity: 0, ease: 'power2.in' },
        0.65
      );

      // Craft exits with rotation
      scrollTl.fromTo(
        craftRef.current,
        { x: 0, y: 0, rotation: 0, opacity: 1 },
        { x: '18vw', y: '-6vh', rotation: 6, opacity: 0, ease: 'power2.in' },
        0.72
      );

      // Glow fades
      scrollTl.fromTo(
        glowRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const headlineWords = 'CODE AT THE SPEED OF THOUGHT'.split(' ');

  return (
    <section
      ref={sectionRef}
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero_bg_dusk.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060B]/60 via-[#05060B]/40 to-[#05060B]/90" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(5,6,11,0.7)_100%)]" />
      </div>

      {/* Craft Glow */}
      <div
        ref={glowRef}
        className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2 w-[min(80vw,1000px)] h-[min(50vw,600px)] pointer-events-none"
      >
        <div className="craft-glow" />
      </div>

      {/* Craft Image */}
      <img
        ref={craftRef}
        src="/images/craft_wireframe.png"
        alt="Aether AI Craft"
        className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2 w-[min(72vw,980px)] z-10"
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        {/* Headline */}
        <h1
          ref={headlineRef}
          className="headline-hero text-white text-center px-4 mt-[28vh]"
          style={{ width: 'min(90vw, 1200px)' }}
        >
          {headlineWords.map((word, i) => (
            <span key={i} className="word inline-block mr-[0.25em]">
              {word}
            </span>
          ))}
        </h1>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mt-8 text-center text-[#A6AEBB] text-base md:text-lg max-w-[min(64vw,720px)] px-4"
        >
          An AI-native pair programmer that plans, writes, tests, and deploys—end to end.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="mt-8 flex items-center gap-4">
          <button className="flex items-center gap-2 text-[#2D6BFF] hover:text-white transition-colors group">
            <span className="w-10 h-10 rounded-full border border-[#2D6BFF]/50 flex items-center justify-center group-hover:bg-[#2D6BFF]/20 transition-colors">
              <Play size={16} fill="currentColor" />
            </span>
            <span className="text-sm font-medium">Watch the demo</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
