import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ModesSectionProps {
  className?: string;
}

const ModesSection = ({ className = '' }: ModesSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const craftRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const modesRef = useRef<HTMLDivElement>(null);

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
        }
      });

      // ENTRANCE (0-30%)
      // Craft enters from bottom
      scrollTl.fromTo(
        craftRef.current,
        { y: '60vh', scale: 0.8, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, ease: 'none' },
        0
      );

      // Headline words reveal
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        scrollTl.fromTo(
          words,
          { y: '14vh', opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.025, ease: 'none' },
          0.10
        );
      }

      // Subheadline
      scrollTl.fromTo(
        subheadlineRef.current,
        { y: '8vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.18
      );

      // Modes cards
      if (modesRef.current) {
        const cards = modesRef.current.querySelectorAll('.mode-card');
        scrollTl.fromTo(
          cards,
          { y: '6vh', opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.03, ease: 'none' },
          0.20
        );
      }

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      // Craft exits to left
      scrollTl.fromTo(
        craftRef.current,
        { x: 0, rotation: 0, opacity: 1 },
        { x: '-55vw', rotation: -10, opacity: 0, ease: 'power2.in' },
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

      // Modes cards exit
      if (modesRef.current) {
        const cards = modesRef.current.querySelectorAll('.mode-card');
        scrollTl.fromTo(
          cards,
          { y: 0, opacity: 1 },
          { y: '-4vh', opacity: 0, stagger: 0.02, ease: 'power2.in' },
          0.70
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const headlineWords = 'THREE MODES. ONE MISSION.'.split(' ');

  const modes = [
    { name: 'Plan', description: 'Maps the work', color: '#2D6BFF' },
    { name: 'Build', description: 'Writes the code', color: '#00D4AA' },
    { name: 'Review', description: 'Validates before merge', color: '#FF6B35' },
  ];

  return (
    <section
      ref={sectionRef}
      id="modes"
      className={`section-pinned ${className}`}
      style={{ background: 'linear-gradient(180deg, #0B1A2A 0%, #05060B 100%)' }}
    >
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(45, 107, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45, 107, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Craft Glow */}
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[min(70vw,900px)] h-[min(45vw,550px)] pointer-events-none">
        <div className="craft-glow" />
      </div>

      {/* Craft Image */}
      <img
        ref={craftRef}
        src="/images/craft_wireframe.png"
        alt="Aether AI Craft"
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[min(60vw,800px)] z-10"
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        {/* Headline */}
        <h2
          ref={headlineRef}
          className="headline-section text-white text-center px-4 mt-[32vh]"
          style={{ width: 'min(90vw, 1000px)' }}
        >
          {headlineWords.map((word, i) => (
            <span 
              key={i} 
              className={`word inline-block mr-[0.2em] ${word === 'MISSION.' ? 'keyword-pill' : ''}`}
            >
              {word}
            </span>
          ))}
        </h2>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mt-6 text-center text-[#A6AEBB] text-base md:text-lg max-w-[min(58vw,660px)] px-4 leading-relaxed"
        >
          Plan mode maps the work. Build mode writes the code. Review mode validates before you merge.
        </p>

        {/* Mode Cards */}
        <div 
          ref={modesRef}
          className="mt-10 flex flex-wrap justify-center gap-4 px-4"
        >
          {modes.map((mode, i) => (
            <div
              key={i}
              className="mode-card glass rounded-2xl px-6 py-4 flex items-center gap-3 hover:border-white/20 transition-all duration-300"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: mode.color, boxShadow: `0 0 12px ${mode.color}` }}
              />
              <div>
                <span className="text-white font-semibold text-sm">{mode.name}</span>
                <span className="text-[#A6AEBB] text-sm ml-2">{mode.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModesSection;
