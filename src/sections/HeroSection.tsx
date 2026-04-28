import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function HeroSection({ onStart }: { onStart: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.4 });
      tl.fromTo(".hero-title", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
        .fromTo(".hero-sub", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .fromTo(".hero-btn", { scale: 1.6, opacity: 0, rotate: -5 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: "back.out(1.7)" }, "-=0.3")
        .fromTo(".hero-frame", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.8")
        .fromTo(".hero-seal", { scale: 2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, "-=0.4");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden bg-xuan-warm">
      {/* Background layers */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/cherry-banana.jpg"
          alt=""
          className={`absolute top-0 right-0 w-[60%] h-full object-cover object-left transition-all duration-1500 ease-out ${loaded ? "opacity-25 translate-x-0" : "opacity-0 translate-x-20"}`}
        />
        <img
          src="/images/hero-ink-landscape.jpg"
          alt=""
          className={`absolute bottom-0 left-0 w-[50%] h-[60%] object-cover transition-all duration-1500 delay-300 ease-out ${loaded ? "opacity-15 translate-y-0" : "opacity-0 translate-y-20"}`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-12 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-left">
            <div className="hero-title opacity-0">
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                <div className="w-12 h-12">
                  <img src="/images/seal-logo.png" alt="墨课" className="w-full h-full object-contain" />
                </div>
                <span className="text-3xl font-bold text-ink-900 tracking-[0.2em]">墨课</span>
              </div>
              <h1 className="text-display text-ink-900 mb-4 leading-tight">
                以墨为引
                <br />
                <span className="text-gold-600">以AI为笔</span>
              </h1>
            </div>

            <p className="hero-sub text-lg md:text-xl text-ink-500 mb-4 tracking-wider opacity-0">
              中国艺术学自主知识体系
            </p>
            <p className="hero-sub text-annotation text-ink-400 mb-10 tracking-widest opacity-0">
              AI赋能教育平台 · 传承东方美学
            </p>

            <div className="hero-btn opacity-0">
              <button
                onClick={onStart}
                className="seal-btn inline-flex items-center gap-3 px-10 py-4 bg-cinnabar text-white text-lg font-semibold rounded-btn shadow-seal"
              >
                <span className="tracking-[0.15em]">开启一堂新课</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Decorative seal */}
            <div className="hero-seal mt-8 opacity-0 hidden lg:block">
              <div className="w-20 h-20 border-2 border-gold-600/30 rounded-sm flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">
                <span className="text-gold-600/50 text-sm font-bold tracking-[0.1em]" style={{ writingMode: "vertical-rl" }}>
                  教学相长
                </span>
              </div>
            </div>
          </div>

          {/* Right: Framed showcase image */}
          <div className="hero-frame opacity-0 hidden lg:block">
            <div className="chinese-frame shadow-frame">
              <div className="chinese-frame-inner">
                <div className="relative aspect-[3/4] max-h-[70vh]">
                  <img
                    src="/images/folding-fan.jpg"
                    alt="东方美学"
                    className="w-full h-full object-cover"
                  />
                  {/* Floating label */}
                  <div className="absolute top-6 right-6 bg-xuan-white/90 backdrop-blur-sm px-5 py-3 rounded-card shadow-paper">
                    <p className="text-sm font-semibold text-ink-900 tracking-wider">东方美学</p>
                    <p className="text-xs text-ink-400 mt-0.5">红了樱桃 · 绿了芭蕉</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-600/30 to-transparent" />
    </section>
  );
}
