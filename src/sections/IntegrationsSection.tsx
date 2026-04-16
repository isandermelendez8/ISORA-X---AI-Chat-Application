import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Gitlab, Slack, Trello, LineChart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const IntegrationsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Image animation
      gsap.fromTo(
        imageRef.current,
        { x: '-10vw', opacity: 0 },
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

      // Text animation
      gsap.fromTo(
        textRef.current,
        { x: '10vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          }
        }
      );

      // Logos stagger
      const logos = logosRef.current?.querySelectorAll('.logo-item');
      if (logos) {
        gsap.fromTo(
          logos,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: logosRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const integrations = [
    { name: 'GitHub', icon: Github },
    { name: 'GitLab', icon: Gitlab },
    { name: 'Slack', icon: Slack },
    { name: 'Jira', icon: Trello },
    { name: 'Linear', icon: LineChart },
  ];

  return (
    <section
      ref={sectionRef}
      id="integrations"
      className="relative min-h-screen bg-[#05060B] py-24 md:py-32"
    >
      <div className="w-full px-6 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[70vh]">
          {/* Image Card */}
          <div ref={imageRef} className="relative">
            <div className="relative rounded-[22px] overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="/images/integrations_nodes.jpg"
                alt="Integrations"
                className="w-full h-auto object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#05060B]/30 via-transparent to-[#2D6BFF]/10" />
            </div>
            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-[#2D6BFF]/10 rounded-[32px] blur-3xl -z-10" />
          </div>

          {/* Text Block */}
          <div ref={textRef}>
            <h2 className="headline-section text-white mb-6">
              INTEGRATES WITH YOUR STACK
            </h2>
            <p className="text-[#A6AEBB] text-lg leading-relaxed max-w-lg mb-10">
              Connect GitHub, GitLab, Jira, Linear, Slack, and your CI/CD pipeline in minutes. Aether fits into your workflow, not the other way around.
            </p>

            {/* Integration Logos */}
            <div ref={logosRef} className="flex flex-wrap gap-3">
              {integrations.map((integration, index) => (
                <div
                  key={index}
                  className="logo-item glass rounded-xl px-4 py-3 flex items-center gap-2 hover:border-[#2D6BFF]/30 transition-all duration-300 cursor-pointer group"
                >
                  <integration.icon className="w-5 h-5 text-[#A6AEBB] group-hover:text-[#2D6BFF] transition-colors" />
                  <span className="text-white text-sm font-medium">{integration.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <button className="btn-outline text-white text-sm">
                View all integrations
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
