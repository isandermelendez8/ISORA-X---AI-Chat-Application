import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CapabilitiesSectionProps {
  className?: string;
}

const CapabilitiesSection = ({ className = '' }: CapabilitiesSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const craftRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
        }
      });

      // ENTRANCE (0-30%)
      // Wireframe overlay fades in
      scrollTl.fromTo(
        overlayRef.current,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, ease: 'none' },
        0
      );

      // Craft enters from right (wireframe version)
      scrollTl.fromTo(
        craftRef.current,
        { x: '50vw', y: '12vh', rotation: 12, scale: 0.9, opacity: 0 },
        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, ease: 'none' },
        0.02
      );

      // Headline words reveal
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        scrollTl.fromTo(
          words,
          { y: '12vh', opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.08
        );
      }

      // Subheadline
      scrollTl.fromTo(
        subheadlineRef.current,
        { y: '8vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.18
      );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      // Overlay fades
      scrollTl.fromTo(
        overlayRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );

      // Craft exits upward
      scrollTl.fromTo(
        craftRef.current,
        { y: 0, scale: 1, opacity: 1 },
        { y: '-18vh', scale: 0.85, opacity: 0, ease: 'power2.in' },
        0.72
      );

      // Headline exits
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        scrollTl.fromTo(
          words,
          { y: 0, opacity: 1 },
          { y: '-8vh', opacity: 0, stagger: 0.01, ease: 'power2.in' },
          0.74
        );
      }

      // Subheadline exits
      scrollTl.fromTo(
        subheadlineRef.current,
        { y: 0, opacity: 1 },
        { y: '-4vh', opacity: 0, ease: 'power2.in' },
        0.72
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const headlineWords = 'FROM IDEA TO PRODUCTION IN ONE FLOW'.split(' ');

  return (
    <section
      ref={sectionRef}
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/yard_aerial.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060B]/60 via-[#05060B]/40 to-[#05060B]/85" />
      </div>

      {/* Wireframe Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-[5]"
      >
        <img
          src="/images/wireframe_overlay.jpg"
          alt=""
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05060B]/80" />
      </div>

      {/* Craft Glow */}
      <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[min(75vw,950px)] h-[min(48vw,580px)] pointer-events-none z-[8]">
        <div className="craft-glow" />
      </div>

      {/* Craft Image (wireframe style) */}
      <img
        ref={craftRef}
        src="/images/craft_wireframe.png"
        alt="Aether AI Craft"
        className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[min(65vw,880px)] z-10"
        style={{ filter: 'brightness(1.2) contrast(1.1)' }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        {/* Headline */}
        <h2
          ref={headlineRef}
          className="headline-section text-white text-center px-4 mt-[34vh]"
          style={{ width: 'min(92vw, 1150px)' }}
        >
          {headlineWords.map((word, i) => (
            <span 
              key={i} 
              className={`word inline-block mr-[0.2em] ${word === 'PRODUCTION' ? 'keyword-pill' : ''}`}
            >
              {word}
            </span>
          ))}
        </h2>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mt-8 text-center text-[#A6AEBB] text-base md:text-lg max-w-[min(62vw,700px)] px-4 leading-relaxed"
        >
          Generate PRDs, scaffold services, write tests, and open pull requests—automatically.
        </p>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
