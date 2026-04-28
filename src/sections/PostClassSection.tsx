import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { DEMO_KNOWLEDGE_TREE, DEMO_TIMELINE } from "../lib/data";

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

export default function PostClassSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["root"]));
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);
  const [videoProgress, setVideoProgress] = useState(35);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".post-anim").forEach((el, i) => {
        gsap.fromTo(el, { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, delay: i * 0.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const renderTree = (node: TreeNode, level = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    return (
      <div key={node.id}>
        <div
          onClick={() => hasChildren && toggleNode(node.id)}
          className={`flex items-center gap-2 cursor-pointer py-2.5 px-4 rounded-card transition-all duration-300 ${level === 0 ? "bg-gold-600 text-white shadow-md" : "bg-xuan-aged/50 text-ink-900 hover:bg-xuan-aged hover:shadow-sm"}`}
          style={{ marginLeft: level * 18 }}
        >
          {hasChildren && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
          <span className={`${level === 0 ? "font-semibold text-base" : "text-sm"}`}>{node.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1 overflow-hidden">
            {node.children!.map((child) => renderTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={sectionRef} className="relative min-h-screen py-24 px-4 md:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/images/palace-wall.jpg" alt="" className="w-full h-full object-cover opacity-[0.05]" />
        <div className="absolute inset-0 bg-gradient-to-b from-xuan-white via-transparent to-xuan-white" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-14 post-anim">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-600/40" />
            <div className="w-3 h-3 rounded-full bg-gold-600/60" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-600/40" />
          </div>
          <h2 className="text-title text-ink-900 mb-3">课后归档</h2>
          <p className="text-annotation text-ink-500 tracking-[0.15em]">温故知新 · 知识成体系</p>
        </div>

        {/* Banner */}
        <div className="post-anim mb-10 chinese-frame shadow-frame max-w-5xl mx-auto">
          <div className="chinese-frame-inner aspect-[21/9] relative overflow-hidden">
            <img src="/images/palace-wall.jpg" alt="" className="w-full h-full object-cover opacity-40 hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-900/50 via-ink-900/20 to-transparent" />
            <div className="absolute bottom-5 left-6">
              <p className="text-gold-300 text-xs tracking-[0.2em] mb-1">KNOWLEDGE ARCHIVE</p>
              <p className="text-white text-lg font-semibold tracking-wider" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                宫墙内外 · 学海无涯
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Knowledge Tree */}
          <div className="post-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-chapter text-ink-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-gold-600 rounded-full" />
                知识梳理
              </h3>
              <span className="text-xs text-ink-400">点击节点展开详情</span>
            </div>
            <div className="max-w-2xl">{renderTree(DEMO_KNOWLEDGE_TREE)}</div>
          </div>

          {/* Timeline + Video */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="post-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-chapter text-ink-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gold-600 rounded-full" />
                  课堂讨论归档
                </h3>
                <div className="ink-input">
                  <input type="text" placeholder="检..." className="w-20 bg-transparent py-1 text-sm text-ink-900 placeholder:text-ink-300 outline-none" />
                </div>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-gold-600 via-gold-300 to-transparent" />
                <div className="space-y-4">
                  {DEMO_TIMELINE.map((record) => (
                    <div key={record.id} className="relative">
                      <div
                        className={`absolute -left-6 top-2 w-3.5 h-3.5 rounded-full border-2 border-gold-600 bg-white transition-all cursor-pointer hover:scale-150 hover:bg-gold-600 hover:shadow-[0_0_0_8px_rgba(196,150,61,0.15)] ${expandedRecord === record.id ? "bg-gold-600" : ""}`}
                        onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                      />
                      <div
                        className={`rounded-card p-3.5 cursor-pointer transition-all duration-300 ${expandedRecord === record.id ? "bg-gold-100/50 border border-gold-600/20" : "hover:bg-xuan-aged/30 border border-transparent"}`}
                        onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                      >
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-xs text-ink-300 font-mono">{record.time}</span>
                          <div className="w-5 h-5 rounded-full bg-xuan-aged flex items-center justify-center text-xs text-ink-500">{record.speaker[0]}</div>
                          <span className="text-xs text-ink-500">{record.speaker}</span>
                          <span className="text-xs px-2 py-0.5 rounded-btn bg-xuan-aged text-ink-400">{record.topic}</span>
                        </div>
                        <p className="text-sm text-ink-700 leading-relaxed">{record.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Video */}
            <div className="post-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10">
              <h3 className="text-chapter text-ink-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gold-600 rounded-full" />
                课程回放
              </h3>
              <div className="relative">
                <div className="h-4 bg-gradient-to-r from-ink-900 via-ink-700 to-ink-900 rounded-t-card" />
                <div className="relative aspect-video bg-ink-900/5 overflow-hidden">
                  <img src="/images/replay-scene.jpg" alt="课程回放" className="w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 rounded-full bg-cinnabar/90 text-white flex items-center justify-center hover:scale-110 transition-transform seal-btn shadow-seal">
                      {isPlaying ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                      ) : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="h-4 bg-gradient-to-r from-ink-900 via-ink-700 to-ink-900 rounded-b-card" />

                <div className="mt-4 px-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-ink-400 font-mono">15:45</span>
                    <div className="flex-1 relative">
                      <div className="h-1.5 bg-xuan-aged rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full relative transition-all" style={{ width: `${videoProgress}%` }}>
                          {[15, 30, 50, 70].map((pos) => (
                            <div key={pos} className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-gold-600 rounded-full cursor-pointer hover:scale-175 transition-transform border border-xuan-white" style={{ left: `${pos}%` }} />
                          ))}
                        </div>
                      </div>
                      <input type="range" min="0" max="100" value={videoProgress} onChange={(e) => setVideoProgress(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                    <span className="text-xs text-ink-400 font-mono">45:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
