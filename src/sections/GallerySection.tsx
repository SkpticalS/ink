import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const galleryImages = [
  { src: "/images/plum-blossom.jpg", title: "笔墨丹青", subtitle: "传统书画艺术" },
  { src: "/images/window-lattice.jpg", title: "园林雅韵", subtitle: "古典建筑之美" },
  { src: "/images/palace-wall.jpg", title: "宫墙花影", subtitle: "宫廷艺术巡礼" },
  { src: "/images/cherry-banana.jpg", title: "红了樱桃", subtitle: "东方美学意境" },
  { src: "/images/hero-ink-landscape.jpg", title: "山水意境", subtitle: "水墨山水情怀" },
  { src: "/images/study-room.jpg", title: "书香墨韵", subtitle: "文人书房雅趣" },
];

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".gallery-title",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Auto-play
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      goTo((activeIndex + 1) % galleryImages.length);
    }, 5000);
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [activeIndex]);

  const goTo = (index: number) => {
    if (index === activeIndex || isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  return (
    <section ref={sectionRef} className="py-20 px-4 md:px-8 bg-xuan-warm">
      {/* Title */}
      <div className="text-center mb-12 gallery-title">
        <h2 className="text-title text-ink-900 mb-3">艺境巡礼</h2>
        <p className="text-annotation text-ink-500 tracking-widest">一画一世界 · 一艺一境界</p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="w-12 h-px bg-gold-600/40" />
          <div className="w-2 h-2 rounded-full bg-gold-600/60" />
          <div className="w-12 h-px bg-gold-600/40" />
        </div>
      </div>

      {/* Main Gallery - Crossfade */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Large featured image with crossfade */}
          <div className="lg:col-span-8">
            <div className="chinese-frame">
              <div className="chinese-frame-inner aspect-[16/10] relative overflow-hidden">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      idx === activeIndex
                        ? "opacity-100 scale-100 filter blur-0"
                        : "opacity-0 scale-105 filter blur-sm"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
                    {/* Title on image */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wider mb-1"
                          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
                        {img.title}
                      </h3>
                      <p className="text-sm text-white/80 tracking-widest">{img.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Thumbnail navigation */}
            <div className="flex gap-3 mt-4 justify-center">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`relative w-16 h-12 md:w-20 md:h-14 rounded-btn overflow-hidden transition-all duration-300 ${
                    idx === activeIndex
                      ? "ring-2 ring-gold-600 ring-offset-2 ring-offset-xuan-warm scale-105"
                      : "opacity-60 hover:opacity-90 hover:scale-105"
                  }`}
                >
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Side images grid */}
          <div className="lg:col-span-4 grid grid-rows-3 gap-4">
            {[1, 2, 3].map((offset) => {
              const idx = (activeIndex + offset) % galleryImages.length;
              return (
                <div
                  key={`side-${offset}`}
                  className="chinese-frame opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => goTo(idx)}
                >
                  <div className="chinese-frame-inner aspect-[4/3] relative overflow-hidden">
                    <img
                      src={galleryImages[idx].src}
                      alt={galleryImages[idx].title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <p className="text-xs text-white/90 tracking-wider">{galleryImages[idx].title}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
