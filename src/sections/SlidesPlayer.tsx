import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import VideoConference from "./VideoConference";

interface Slide {
  id: number;
  title: string;
  content: string;
  bulletPoints?: string[];
  image?: string;
  note?: string;
}

const DEMO_SLIDES: Slide[] = [
  {
    id: 1,
    title: "第一章 宋代山水画概述",
    content: "宋代（960-1279）是中国山水画发展的黄金时代。",
    bulletPoints: [
      "北宋（960-1127）：写实主义巅峰",
      "南宋（1127-1279）：诗意化转向",
      "宫廷画院制度的推动作用",
      "文人画理论的萌芽"
    ],
    note: "着重介绍范宽、郭熙两位代表性画家",
  },
  {
    id: 2,
    title: "范宽与《溪山行旅图》",
    content: "范宽（约950-1032），字中立，华原人，北宋山水画代表人物。",
    bulletPoints: [
      "\"雨点皴\"技法的开创者",
      "\"远望不离坐外\"的构图特点",
      "《溪山行旅图》：绢本水墨，206.3×103.3cm",
      "台北故宫博物院藏"
    ],
    note: "可对比李成、关仝的构图差异",
    image: "/images/hero-ink-landscape.jpg",
  },
  {
    id: 3,
    title: "郭熙与\"三远法\"",
    content: "郭熙（约1020-1100），河南温县人，北宋神宗时期画院待诏。",
    bulletPoints: [
      "\"高远、深远、平远\"—空间构图三大法则",
      "《林泉高致》：中国画论经典",
      "\"卷云皴\"：表现土质山体的柔和纹理",
      "强调\"外师造化，中得心源\""
    ],
    note: "三远法影响了后世数百年的山水画创作",
  },
  {
    id: 4,
    title: "边角构图：马远与夏圭",
    content: "南宋画家马远、夏圭开创了\"一角半边\"的新构图范式。",
    bulletPoints: [
      "马远（1140-1225）：\"马一角\"，集中画面一角",
      "夏圭（1180-1230）：\"夏半边\"，留白半边",
      "打破北宋全景式构图传统",
      "开启山水画的诗意化、抒情化新境界"
    ],
    note: "边角构图与南宋偏安的政治环境密切相关",
    image: "/images/plum-blossom.jpg",
  },
];

type SlideLayout = "ppt-main" | "gallery" | "ppt-only";

interface SlidesPlayerProps {
  onComplete?: () => void;
}

export default function SlidesPlayer({ onComplete }: SlidesPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [spotlightActive, setSpotlightActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [layout, setLayout] = useState<SlideLayout>("ppt-main");
  const slideRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalSlides = DEMO_SLIDES.length;

  const currentSlide = DEMO_SLIDES[currentIndex];

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (currentIndex < totalSlides - 1) {
              setCurrentIndex(c => c + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 0.5;
        });
      }, 100);
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current);
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying, currentIndex, totalSlides]);

  useEffect(() => {
    setProgress(0);
    if (slideRef.current) {
      gsap.fromTo(slideRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [currentIndex]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) setCurrentIndex(index);
  }, [totalSlides]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleSpotlight = () => setSpotlightActive(!spotlightActive);

  // Layout switcher UI
  const LayoutSwitcher = () => (
    <div className="flex items-center gap-1.5 bg-xuan-aged/50 rounded-card p-1 border border-gold-600/10">
      <button
        onClick={() => setLayout("ppt-main")}
        className={`px-2.5 py-1.5 rounded-btn text-xs transition-all flex items-center gap-1 ${layout === "ppt-main" ? "bg-gold-600 text-white" : "text-ink-500 hover:text-ink-700"}`}
        title="PPT中央 + 视频边栏"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="12" height="18" rx="2"/><rect x="17" y="7" width="4" height="10" rx="1"/></svg>
        PPT
      </button>
      <button
        onClick={() => setLayout("gallery")}
        className={`px-2.5 py-1.5 rounded-btn text-xs transition-all flex items-center gap-1 ${layout === "gallery" ? "bg-gold-600 text-white" : "text-ink-500 hover:text-ink-700"}`}
        title="视频画廊（大屏）"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        画廊
      </button>
      <button
        onClick={() => setLayout("ppt-only")}
        className={`px-2.5 py-1.5 rounded-btn text-xs transition-all flex items-center gap-1 ${layout === "ppt-only" ? "bg-gold-600 text-white" : "text-ink-500 hover:text-ink-700"}`}
        title="仅PPT"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
        全屏
      </button>
    </div>
  );

  // Gallery layout: video takes over the whole area
  if (layout === "gallery") {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-400 font-mono">{currentIndex + 1} / {totalSlides}</span>
            <div className="w-32 h-1.5 bg-xuan-aged rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }} />
            </div>
          </div>
          <LayoutSwitcher />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <VideoConference layout="gallery" onLayoutChange={(l) => setLayout(l === "sidebar" ? "ppt-main" : "gallery")} />
          </div>
          <div className="lg:col-span-4 space-y-4">
            {/* Mini slide thumbnail */}
            <div className="bg-xuan-white/90 rounded-card p-4 shadow-paper border border-gold-600/10">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-ink-700">当前幻灯片</h4>
                <button onClick={() => setLayout("ppt-main")} className="text-xs text-gold-600 hover:text-gold-700">切换回PPT</button>
              </div>
              <div className="chinese-frame shadow-frame">
                <div className="chinese-frame-inner p-4 bg-xuan-white">
                  <span className="text-xs text-gold-600 tracking-widest">SLIDE {currentIndex + 1}</span>
                  <h5 className="font-title text-base text-ink-900 mt-2 mb-2">{currentSlide.title}</h5>
                  <p className="text-xs text-ink-500 line-clamp-3">{currentSlide.content}</p>
                </div>
              </div>
            </div>
            {/* Slide thumbnails */}
            <div className="bg-xuan-white/90 rounded-card p-4 shadow-paper border border-gold-600/10">
              <h4 className="text-xs font-semibold text-ink-700 mb-3">幻灯片列表</h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {DEMO_SLIDES.map((slide, idx) => (
                  <button key={slide.id} onClick={() => goToSlide(idx)} className={`w-full text-left p-2.5 rounded-card border-2 transition-all text-xs ${idx === currentIndex ? "border-gold-600 bg-gold-100/20" : "border-transparent bg-xuan-aged/20 hover:bg-xuan-aged/40"}`}>
                    <span className={`inline-block w-5 h-5 rounded-full text-center leading-5 text-[10px] mr-2 ${idx === currentIndex ? "bg-gold-600 text-white" : "bg-xuan-aged text-ink-400"}`}>{idx + 1}</span>
                    <span className={idx === currentIndex ? "text-ink-900 font-medium" : "text-ink-500"}>{slide.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PPT-main or PPT-only layout
  return (
    <div className="relative w-full">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-400 font-mono">{currentIndex + 1} / {totalSlides}</span>
          <div className="w-32 h-1.5 bg-xuan-aged rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LayoutSwitcher />
          <button onClick={toggleSpotlight} className={`px-3 py-1.5 rounded-btn text-xs transition-all flex items-center gap-1.5 ${spotlightActive ? "bg-gold-600 text-white" : "bg-xuan-aged text-ink-500 hover:bg-xuan-aged/80"}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            聚光灯
          </button>
          <button onClick={() => setShowNotes(!showNotes)} className={`px-3 py-1.5 rounded-btn text-xs transition-all flex items-center gap-1.5 ${showNotes ? "bg-gold-600 text-white" : "bg-xuan-aged text-ink-500 hover:bg-xuan-aged/80"}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            讲稿
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Thumbnail sidebar */}
        {layout !== "ppt-only" && (
          <div className="lg:col-span-2 space-y-2">
            {DEMO_SLIDES.map((slide, idx) => (
              <button key={slide.id} onClick={() => goToSlide(idx)} className={`w-full text-left p-3 rounded-card transition-all duration-300 border-2 ${idx === currentIndex ? "border-gold-600 bg-gold-100/30 shadow-md" : "border-transparent bg-xuan-aged/30 hover:bg-xuan-aged/50"}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${idx === currentIndex ? "bg-gold-600 text-white" : "bg-xuan-aged text-ink-400"}`}>{idx + 1}</span>
                  <span className={`text-xs truncate ${idx === currentIndex ? "text-ink-900 font-medium" : "text-ink-500"}`}>{slide.title}</span>
                </div>
              </button>
            ))}
            <div className="pt-4 border-t border-gold-600/10">
              <div className="flex items-center gap-2 justify-center">
                <button onClick={() => goToSlide(currentIndex - 1)} disabled={currentIndex === 0} className="w-8 h-8 rounded-full bg-xuan-aged flex items-center justify-center text-ink-500 hover:bg-gold-600 hover:text-white transition-all disabled:opacity-30"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
                <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-cinnabar text-white flex items-center justify-center hover:scale-110 transition-transform seal-btn">{isPlaying ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>}</button>
                <button onClick={() => goToSlide(currentIndex + 1)} disabled={currentIndex === totalSlides - 1} className="w-8 h-8 rounded-full bg-xuan-aged flex items-center justify-center text-ink-500 hover:bg-gold-600 hover:text-white transition-all disabled:opacity-30"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
              </div>
              <div className="mt-3 h-1 bg-xuan-aged rounded-full overflow-hidden"><div className="h-full bg-gold-600 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
            </div>
            {/* Video sidebar */}
            <div className="mt-4">
              <VideoConference layout="sidebar" onLayoutChange={(l) => setLayout(l === "gallery" ? "gallery" : "ppt-main")} onToggleExpand={() => setLayout("gallery")} isExpanded={false} />
            </div>
          </div>
        )}

        {/* Main slide */}
        <div className={layout === "ppt-only" ? "lg:col-span-12" : "lg:col-span-7"}>
          <div ref={slideRef} className="chinese-frame shadow-frame relative">
            <div className="chinese-frame-inner bg-xuan-white relative overflow-hidden" style={{ minHeight: layout === "ppt-only" ? "520px" : "420px" }}>
              {spotlightActive && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div className="absolute inset-0 bg-ink-900/60" />
                  <div className="absolute w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, transparent 30%, rgba(26,26,26,0.6) 70%)", top: "30%", left: "50%", transform: "translate(-50%, -50%)" }} />
                </div>
              )}
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs text-gold-600 tracking-widest">SLIDE {currentIndex + 1}</span>
                  <div className="flex-1 h-px bg-gold-600/20" />
                </div>
                <h2 className="font-title text-2xl md:text-3xl text-ink-900 tracking-wider mb-4">{currentSlide.title}</h2>
                <p className="text-base text-ink-600 leading-relaxed mb-6">{currentSlide.content}</p>
                {currentSlide.bulletPoints && (
                  <ul className="space-y-3">
                    {currentSlide.bulletPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                        <span className="text-sm text-ink-700 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {currentSlide.image && (
                  <div className="mt-6 rounded-card overflow-hidden border border-gold-600/10">
                    <img src={currentSlide.image} alt={currentSlide.title} className="w-full h-48 object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-gold-600 text-white flex items-center justify-center hover:scale-110 transition-transform">
              {isPlaying ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
            </button>
            <div className="flex-1 h-1 bg-xuan-aged rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full relative" style={{ width: `${progress}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gold-600 rounded-full shadow-md border-2 border-xuan-white" />
              </div>
            </div>
            <span className="text-xs text-ink-400 font-mono">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Right sidebar: notes + AI teacher + video (if ppt-only) */}
        <div className={layout === "ppt-only" ? "hidden" : "lg:col-span-3 space-y-4"}>
          {showNotes && currentSlide.note && (
            <div className="bg-gold-100/40 rounded-card p-4 border border-gold-600/15">
              <h4 className="text-xs font-semibold text-gold-600 mb-2 flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                讲稿备注
              </h4>
              <p className="text-sm text-ink-600 leading-relaxed">{currentSlide.note}</p>
            </div>
          )}
          <div className="bg-xuan-white/90 rounded-card p-4 shadow-paper border border-gold-600/10">
            <h4 className="text-xs font-semibold text-ink-700 mb-3 flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-600"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              AI 讲师
            </h4>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gold-600 text-white flex items-center justify-center text-sm font-bold">李</div>
              <div>
                <p className="text-sm font-medium text-ink-900">李明德 教授</p>
                <p className="text-xs text-ink-400">中央美术学院</p>
              </div>
            </div>
            <button onClick={togglePlay} className={`w-full py-2 rounded-btn text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${isPlaying ? "bg-cinnabar/10 text-cinnabar border border-cinnabar/20" : "bg-gold-600 text-white"}`}>
              {isPlaying ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> 暂停语音</> : <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> 播放讲解</>}
            </button>
          </div>
          <div className="bg-xuan-white/90 rounded-card p-4 shadow-paper border border-gold-600/10">
            <h4 className="text-xs font-semibold text-ink-700 mb-3">导出</h4>
            <div className="space-y-2">
              <button className="w-full py-2 px-3 rounded-btn bg-xuan-aged/60 text-ink-600 text-xs hover:bg-xuan-aged transition-all flex items-center gap-2 border border-gold-600/10"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>下载 PPTX</button>
              <button className="w-full py-2 px-3 rounded-btn bg-xuan-aged/60 text-ink-600 text-xs hover:bg-xuan-aged transition-all flex items-center gap-2 border border-gold-600/10"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>导出 HTML</button>
            </div>
          </div>
          {spotlightActive && <div className="bg-gold-100/50 rounded-card p-3 border border-gold-600/15 text-center"><span className="text-xs text-gold-600 animate-pulse">● 聚光灯模式已开启</span></div>}
        </div>
      </div>
    </div>
  );
}
