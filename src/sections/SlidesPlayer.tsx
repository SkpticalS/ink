import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import type { Slide } from "../lib/data";

interface SlidesPlayerProps {
  slides?: Slide[];
}

/* ─── Demo slides ─── */
const DEMO_SLIDES: Slide[] = [
  {
    id: 1, title: "宋代山水画概述",
    content: "宋代（960—1279年）是中国山水画发展的黄金时代。北宋画家以宏大的构图和精湛的笔墨技法，将山水画推向前所未有的高度。",
    bulletPoints: ["全景式构图：主峰占据画面主体，气势雄伟", "皴法成熟：雨点皴、披麻皴等技法体系完善", "意境追求：从写实走向写意，注重精神内涵"],
    note: "重点引导学生体会北宋山水'大山堂堂'的构图特点，对比南宋'边角之景'的差异。",
  },
  {
    id: 2, title: "范宽与《溪山行旅图》",
    content: "范宽是北宋初年最杰出的山水画家之一，代表作《溪山行旅图》现藏台北故宫博物院，被誉为北宋山水画的巅峰之作。",
    bulletPoints: ["范宽（约950—1032年），字中立，华原人", "《溪山行旅图》：绢本设色，纵206.3厘米，横103.3厘米", "雨点皴技法：以密集墨点表现山石的质感与体积", "构图特点：高远法，主峰占据画面上三分之二"],
    note: "可让学生观察画幅下方的商旅队伍，体会'以小衬大'的手法。",
  },
  {
    id: 3, title: "郭熙与'三远法'",
    content: "郭熙（约1020—1090年）是北宋中期重要的山水画家和理论家，其子郭思整理的《林泉高致》是中国画论的重要经典。",
    bulletPoints: ["三远法：高远、深远、平远——中国山水画空间表现的理论总结", "《早春图》：表现冬去春来的季节转换，充满生机", "云头皴：以卷曲的笔触表现山石的阴阳向背"],
    note: "三远法是中国山水画独有的空间处理体系，与西方透视法形成鲜明对比。",
  },
  {
    id: 4, title: "南宋边角构图",
    content: "南宋（1127—1279年）山水画在构图上发生了重大转变，从北宋的全景式大幅转向边角式小景，代表画家有马远、夏圭。",
    bulletPoints: ["马远（约1140—1225年）：人称'马一角'，善用边角构图", "夏圭（约1180—1230年）：人称'夏半边'，水墨淋漓", "构图特征：留白增多，意境空灵，诗画结合", "《踏歌图》：马远代表作，体现'诗中有画'的境界"],
    note: "对比北宋'大山堂堂'与南宋'边角之景'的审美差异，引导学生思考时代变迁对艺术风格的影响。",
  },
];

export default function SlidesPlayer({ slides: propSlides }: SlidesPlayerProps) {
  const slides = propSlides && propSlides.length > 0 ? propSlides : DEMO_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const totalSlides = slides.length;
  const currentSlide = slides[currentIndex];

  useEffect(() => {
    if (slideRef.current && totalSlides > 0) {
      gsap.fromTo(slideRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
    }
  }, [currentIndex, totalSlides]);

  const goToSlide = useCallback((index: number) => { if (index >= 0 && index < totalSlides) setCurrentIndex(index); }, [totalSlides]);

  const handleFullscreen = () => {
    const el = slideRef.current?.closest('.chinese-frame');
    if (el) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        el.requestFullscreen().catch(() => {});
      }
    }
  };

  // Empty state
  if (totalSlides === 0) {
    return (
      <div className="w-full">
        <div className="chinese-frame shadow-frame">
          <div className="chinese-frame-inner bg-xuan-white flex items-center justify-center" style={{ aspectRatio: "16/9" }}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-xuan-aged flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-400"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
              </div>
              <p className="text-ink-500 text-sm mb-1">课件生成后，幻灯片将在此展示</p>
              <p className="text-ink-300 text-xs">请先在课前准备中完成课件生成</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Top bar */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-400 font-mono">{currentIndex + 1} / {totalSlides}</span>
          <div className="w-32 h-1.5 bg-xuan-aged rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }} ></div>
          </div>
        </div>
        <button onClick={() => setShowNotes(!showNotes)} className={`px-3 py-1.5 rounded-btn text-xs transition-all flex items-center gap-1.5 ${showNotes ? "bg-gold-600 text-white" : "bg-xuan-aged text-ink-500 hover:bg-xuan-aged/80"}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>讲稿
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Thumbnail sidebar */}
        <div className="lg:col-span-2 space-y-1.5">
          {slides.map((slide, idx) => (
            <button key={slide.id} onClick={() => goToSlide(idx)} className={`w-full text-left p-2 rounded-card transition-all duration-300 border-2 ${idx === currentIndex ? "border-gold-600 bg-gold-100/30 shadow-md" : "border-transparent bg-xuan-aged/30 hover:bg-xuan-aged/50"}`}>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${idx === currentIndex ? "bg-gold-600 text-white" : "bg-xuan-aged text-ink-400"}`}>{idx + 1}</span>
                <span className={`text-xs truncate ${idx === currentIndex ? "text-ink-900 font-medium" : "text-ink-500"}`}>{slide.title}</span>
              </div>
            </button>
          ))}
          <div className="pt-3 border-t border-gold-600/10">
            <div className="flex items-center gap-2 justify-center">
              <button onClick={() => goToSlide(currentIndex - 1)} disabled={currentIndex === 0} className="w-7 h-7 rounded-full bg-xuan-aged flex items-center justify-center text-ink-500 hover:bg-gold-600 hover:text-white transition-all disabled:opacity-30">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <span className="text-xs text-ink-400 font-mono">{currentIndex + 1}/{totalSlides}</span>
              <button onClick={() => goToSlide(currentIndex + 1)} disabled={currentIndex === totalSlides - 1} className="w-7 h-7 rounded-full bg-xuan-aged flex items-center justify-center text-ink-500 hover:bg-gold-600 hover:text-white transition-all disabled:opacity-30">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main slide — 16:9 */}
        <div className="lg:col-span-10">
          <div ref={slideRef} className="chinese-frame shadow-frame relative">
            {showNotes && currentSlide?.note && (
              <div className="absolute top-3 left-3 right-3 z-10 bg-gold-100/95 backdrop-blur-sm rounded-card p-3 border border-gold-600/20 shadow-md text-xs text-ink-600 leading-relaxed max-h-24 overflow-y-auto">
                <span className="font-semibold text-gold-600">讲稿：</span>{currentSlide.note}
              </div>
            )}
            <div className="chinese-frame-inner bg-xuan-white relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                  <span className="text-xs text-gold-600 tracking-widest">SLIDE {currentIndex + 1}</span>
                  <div className="flex-1 h-px bg-gold-600/20" ></div>
                </div>
                <h2 className="font-title text-xl md:text-2xl text-ink-900 tracking-wider mb-3 flex-shrink-0">{currentSlide?.title}</h2>
                <p className="text-sm md:text-base text-ink-600 leading-relaxed mb-4 flex-shrink-0">{currentSlide?.content}</p>
                {currentSlide?.bulletPoints && (
                  <ul className="space-y-2 flex-1 overflow-y-auto">
                    {currentSlide.bulletPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                        <span className="text-sm text-ink-700 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {currentSlide?.image && (
                  <div className="mt-4 rounded-card overflow-hidden border border-gold-600/10 flex-shrink-0" style={{ maxHeight: "35%" }}>
                    <img src={currentSlide.image} alt={currentSlide.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Fullscreen button — bottom-right */}
            <button
              onClick={handleFullscreen}
              className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-ink-900/60 backdrop-blur-sm text-white/70 hover:bg-ink-900 hover:text-white flex items-center justify-center transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
              style={{ opacity: 0 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
              title="全屏放映"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            </button>
          </div>

          {/* Slide navigation dots */}
          <div className="mt-3 flex justify-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-gold-600 w-4" : "bg-ink-300/30 hover:bg-ink-400/50"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
