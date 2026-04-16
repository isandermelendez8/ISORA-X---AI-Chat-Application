import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CraftSectionProps {
  className?: string;
}

const CraftSection = ({ className = '' }: CraftSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const craftRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

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
      // Craft enters from left
      scrollTl.fromTo(
        craftRef.current,
        { x: '-60vw', y: '10vh', rotation: -10, scale: 0.85, opacity: 0 },
        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, ease: 'none' },
        0
      );

      // Headline words reveal
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        scrollTl.fromTo(
          words,
          { y: '18vh', opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.05
        );
      }

      // Subheadline
      scrollTl.fromTo(
        subheadlineRef.current,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.15
      );

      // Background parallax
      scrollTl.fromTo(
        bgRef.current,
        { y: 0 },
        { y: '-6vh', ease: 'none' },
        0
      );

      // SETTLE (30-70%): Elements hold position

      // EXIT (70-100%)
      // Craft exits to right
      scrollTl.fromTo(
        craftRef.current,
        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 },
        { x: '55vw', y: '-8vh', rotation: 8, scale: 0.92, opacity: 0, ease: 'power2.in' },
        0.70
      );

      // Headline exits
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        scrollTl.fromTo(
          words,
          { y: 0, opacity: 1 },
          { y: '-10vh', opacity: 0, stagger: 0.01, ease: 'power2.in' },
          0.72
        );
      }

      // Subheadline exits
      scrollTl.fromTo(
        subheadlineRef.current,
        { y: 0, opacity: 1 },
        { y: '-6vh', opacity: 0, ease: 'power2.in' },
        0.70
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const headlineWords = 'YOUR AUTONOMOUS CODING ENGINE'.split(' ');

  return (
    <section
      ref={sectionRef}
      id="craft"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div ref={bgRef} className="absolute inset-0 scale-110">
        <img
          src="/images/yard_aerial.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060B]/70 via-[#05060B]/50 to-[#05060B]/90" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(5,6,11,0.8)_100%)]" />
      </div>

      {/* Craft Glow */}
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[min(80vw,1000px)] h-[min(50vw,600px)] pointer-events-none">
        <div className="craft-glow" />
      </div>

      {/* Craft Image */}
      <img
        ref={craftRef}
        src="/images/craft_wireframe.png"
        alt="Aether AI Craft"
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[min(68vw,920px)] z-10"
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        {/* Headline */}
        <h2
          ref={headlineRef}
          className="headline-section text-white text-center px-4 mt-[32vh]"
          style={{ width: 'min(90vw, 1100px)' }}
        >
          {headlineWords.map((word, i) => (
            <span 
              key={i} 
              className={`word inline-block mr-[0.2em] ${word === 'AUTONOMOUS' ? 'keyword-pill' : ''}`}
            >
              {word}
            </span>
          ))}
        </h2>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mt-8 text-center text-[#A6AEBB] text-base md:text-lg max-w-[min(60vw,680px)] px-4 leading-relaxed"
        >
          It reads your specs, navigates your codebase, and generates changes with context—like a senior engineer who never sleeps.
        </p>
      </div>
    </section>
  );
};

export default CraftSection;
