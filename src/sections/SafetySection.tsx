import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, GitPullRequest, ClipboardList } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SafetySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Text block animation
      gsap.fromTo(
        textBlockRef.current,
        { x: '-8vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textBlockRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          }
        }
      );

      // Image animation
      gsap.fromTo(
        imageRef.current,
        { x: '8vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          }
        }
      );

      // Features stagger
      const features = featuresRef.current?.querySelectorAll('.feature-card');
      if (features) {
        gsap.fromTo(
          features,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Policy engine',
      description: 'Block risky patterns before they\'re generated',
    },
    {
      icon: GitPullRequest,
      title: 'Diff review',
      description: 'Every change presented as a clean PR',
    },
    {
      icon: ClipboardList,
      title: 'Audit log',
      description: 'Full traceability for compliance',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="safety"
      className="relative min-h-screen bg-[#05060B] grid-bg py-24 md:py-32"
    >
      <div className="w-full px-6 lg:px-16 xl:px-24">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[70vh]">
          {/* Text Block */}
          <div ref={textBlockRef} className="order-2 lg:order-1">
            <h2 className="headline-section text-white mb-6">
              BUILT FOR TEAMS THAT SHIP
            </h2>
            <p className="text-[#A6AEBB] text-lg leading-relaxed max-w-lg">
              Aether runs in your environment with guardrails you define. Approve changes, review diffs, and keep full audit history.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="btn-primary text-white text-sm">
                Explore safety features
              </button>
              <button className="btn-outline text-white text-sm">
                View documentation
              </button>
            </div>
          </div>

          {/* Image Card */}
          <div 
            ref={imageRef}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative rounded-[22px] overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="/images/safety_dashboard.jpg"
                alt="Safety Dashboard"
                className="w-full h-auto object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#05060B]/40 to-transparent" />
            </div>
            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-[#2D6BFF]/10 rounded-[32px] blur-3xl -z-10" />
          </div>
        </div>

        {/* Features Grid */}
        <div 
          ref={featuresRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card glass rounded-[22px] p-8 hover:border-[#2D6BFF]/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#2D6BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#2D6BFF]/20 transition-colors">
                <feature.icon className="w-6 h-6 text-[#2D6BFF]" />
              </div>
              <h3 className="text-white font-display font-semibold text-lg mb-3">
                {feature.title}
              </h3>
              <p className="text-[#A6AEBB] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SafetySection;
