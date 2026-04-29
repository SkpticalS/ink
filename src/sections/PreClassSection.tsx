import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { DEMO_MEMBERS } from "../lib/data";

// 10 mock search results for user to review
const MOCK_SOURCES = [
  { id: 1, title: "《溪山行旅图》与宋代北方山水画", source: "中国美术史研究", url: "cgtn.com", snippet: "范宽代表作以雄浑壮阔的北方山水著称，运用\"雨点皴\"表现山石质感，体现了宋代山水画的写实巅峰。", checked: true },
  { id: 2, title: "宋代山水画空间营造与\"三远法\"", source: "艺术学研究期刊", url: "art-research.cn", snippet: "郭熙提出的\"高远、深远、平远\"三远法，成为宋代山水画构图的重要理论基石，影响后世数百年。", checked: true },
  { id: 3, title: "北宋院体山水画的宫廷审美", source: "故宫博物院", url: "dpm.org.cn", snippet: "北宋宫廷画院制度促进了山水画的高度发展，王希孟《千里江山图》代表了青绿山水的最高成就。", checked: false },
  { id: 4, title: "南宋\'马一角\'\'夏半边\'构图创新", source: "中央美术学院学报", url: "cafa.edu.cn", snippet: "马远、夏圭创造的边角构图打破了全景式山水传统，开启了山水画的诗意化、抒情化新境界。", checked: true },
  { id: 5, title: "《清明上河图》中的市井山水", source: "国家博物馆", url: "chnmuseum.cn", snippet: "张择端将山水与城市景观融合，展现了北宋汴京的繁华景象，是风俗画与山水画结合的典范。", checked: false },
  { id: 6, title: "文人画兴起与苏轼\"墨戏\"理论", source: "中国美学理论", url: "aesthetics.cn", snippet: "苏轼提出\"论画以形似，见与儿童邻\"，奠定了文人画重意境轻形似的理论基础。", checked: true },
  { id: 7, title: "元四家：从宋法到元人笔墨", source: "艺术百科", url: "art-baike.cn", snippet: "黄公望、吴镇、倪瓒、王蒙四人承前启后，将宋代写实山水转变为元代抒情写意的新风貌。", checked: false },
  { id: 8, title: "山水画皴法体系与地质学关联", source: "地质与文化", url: "geo-culture.cn", snippet: "不同皴法对应不同地质结构：披麻皴对应土质山，斧劈皴对应石质山，雨点皴表现北方坚硬岩石。", checked: true },
  { id: 9, title: "\'外师造化，中得心源\'创作论", source: "中国画论研究", url: "painting-theory.cn", snippet: "张璪提出的创作理论，强调画家既要师法自然，又要融入主观情感，是中国画创作的核心法则。", checked: false },
  { id: 10, title: "《林泉高致》——山水画论集大成", source: "古典文献", url: "classics.cn", snippet: "郭熙之子郭思整理的《林泉高致》，系统总结了北宋山水画创作理论，至今仍是研习山水画的必读经典。", checked: true },
];

// 3 perspective angles
const PERSPECTIVES = [
  { id: 1, title: "技法演变视角", subtitle: "从\"写实\"到\"写意\"的笔墨转型", desc: "聚焦宋代至元代山水画技法的变化，分析范宽雨点皴、郭熙卷云皴到元代披麻皴的演变脉络，探讨技法如何承载审美理想。" },
  { id: 2, title: "空间美学视角", subtitle: "\"三远法\"与山水意境营造", desc: "从郭熙\"三远法\"出发，探讨宋代山水画如何通过构图创造深度感和意境，以及边角构图对抒情氛围的强化。" },
  { id: 3, title: "文人精神视角", subtitle: "山水画中的士人情怀", desc: "从苏轼\"士人画\"理论切入，探讨山水画如何成为文人表达情感、寄托理想的载体，以及\"外师造化\"的创作哲学。" },
];

const STEPS = ["主题选定", "选择参考资料", "选题", "大纲", "场景", "就绪"];

interface PreClassSectionProps {
  onComplete?: () => void;
}

export default function PreClassSection({ onComplete }: PreClassSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Core states
  const [title, setTitle] = useState("宋代山水画");
  const [desc, setDesc] = useState("学习并了解宋代山水画的历史");
  const [topic, setTopic] = useState("让学生了解并掌握宋代山水画历史");

  // Workflow phase
  const [phase, setPhase] = useState<"info" | "searching" | "review" | "perspective" | "outline" | "ready">("info");
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([{ id: 1, type: "system", content: "等待房主开始生成课程内容。" }]);

  // Sources & review
  const [sources, setSources] = useState(MOCK_SOURCES);
  const [selectAll, setSelectAll] = useState(false);

  // Perspectives
  const [literatureReview, setLiteratureReview] = useState("");
  const [selectedPerspective, setSelectedPerspective] = useState<number | null>(null);

  // Outline
  const [outline, setOutline] = useState<string[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".pre-anim").forEach((el, i) => {
        gsap.fromTo(el, { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, delay: i * 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [phase]);

  // Toggle source checkbox
  const toggleSource = (id: number) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  const handleSelectAll = () => {
    const newState = !selectAll;
    setSelectAll(newState);
    setSources(prev => prev.map(s => ({ ...s, checked: newState })));
  };

  const checkedCount = sources.filter(s => s.checked).length;

  // Start searching
  const handleStartSearch = () => {
    setPhase("searching");
    setStepIndex(1);
    setProgress(15);
    setLogs(prev => [...prev, { id: prev.length + 1, type: "model", content: "已开启检索，系统会先查找相关依据，再组织课程内容。" }]);

    // Simulate search delay
    setTimeout(() => {
      setPhase("review");
      setProgress(30);
      setLogs(prev => [...prev, { id: prev.length + 1, type: "system", content: `联网检索完成，已找到${MOCK_SOURCES.length}个结果。` }]);
    }, 2500);
  };

  // Confirm sources, generate review + perspectives
  const handleConfirmSources = () => {
    setPhase("perspective");
    setStepIndex(2);
    setProgress(50);
    setLogs(prev => [...prev, { id: prev.length + 1, type: "model", content: `已确认${checkedCount}条参考资料，正在生成文献综述...` }]);

    // Generate literature review
    setLiteratureReview("基于选取的文献资料，宋代山水画研究呈现出三个主要脉络：一是以范宽、郭熙为代表的北方写实传统，强调\"外师造化\"的自然观察；二是以苏轼、米芾为核心的文人画理论建构，追求\"中得心源\"的精神表达；三是从全景式构图到边角式构图的形式演变，体现了审美趣味从雄浑壮阔向诗意抒情转变的历史轨迹。");

    setLogs(prev => [...prev, { id: prev.length + 1, type: "system", content: "文献综述生成完成，已提取3个选题视角。" }]);
  };

  // Select perspective & generate outline
  const handleSelectPerspective = (id: number) => {
    setSelectedPerspective(id);
  };

  const handleGenerateOutline = () => {
    if (!selectedPerspective) return;
    setPhase("outline");
    setStepIndex(3);
    setProgress(70);
    setLogs(prev => [...prev, { id: prev.length + 1, type: "model", content: `已选择视角"${PERSPECTIVES.find(p => p.id === selectedPerspective)?.title}"，正在生成大纲...` }]);

    // Mock outline based on selected perspective
    const outlines: Record<number, string[]> = {
      1: ["第一章 宋代写实传统：范宽与北方山水", "第二章 郭熙三远法与卷云皴", "第三章 元代转型：从写实到写意", "第四章 披麻皴与文人笔墨"],
      2: ["第一章 郭熙三远法的空间美学", "第二章 全景式构图的深度营造", "第三章 边角构图：马远夏圭的诗意革新", "第四章 留白与意境：空间美学的哲学基础"],
      3: ["第一章 苏轼\"士人画\"理论的提出", "第二章 \"外师造化，中得心源\"创作论", "第三章 山水画中的隐逸情怀", "第四章 元代文人画的理想寄托"],
    };
    setOutline(outlines[selectedPerspective] || []);

    setTimeout(() => {
      setPhase("ready");
      setStepIndex(5);
      setProgress(100);
      setLogs(prev => [...prev, { id: prev.length + 1, type: "system", content: "课程大纲生成完成，课堂准备就绪！" }]);
    }, 1500);
  };

  return (
    <div ref={sectionRef} className="relative min-h-screen py-20 px-4 md:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/images/plum-blossom.jpg" alt="" className="w-full h-full object-cover opacity-[0.04]" />
        <div className="absolute inset-0 bg-gradient-to-b from-xuan-white via-transparent to-xuan-white" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* ====== HEADER BAR ====== */}
        <div className="pre-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-5 shadow-paper border border-gold-600/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-title text-2xl text-ink-900 tracking-wider mb-1">{title}</h2>
            <div className="flex items-center gap-2 text-sm text-ink-400">
              <span>教室状态：</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${phase === "ready" ? "bg-stone-green/15 text-stone-green" : phase !== "info" ? "bg-gold-100 text-gold-600" : "bg-xuan-aged text-ink-500"}`}>
                {phase === "ready" ? "就绪" : phase === "info" ? "waiting" : "生成中"}
              </span>
              <span className="text-ink-300">|</span>
              <span>已连接到在线课堂服务器</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-xuan-aged/60 rounded-card border border-gold-600/10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-600"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span className="text-sm text-ink-500">邀请码：</span>
              <span className="text-sm font-mono font-semibold text-gold-600 tracking-wider">YUFUXTPB</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ====== LEFT COLUMN ====== */}
          <div className="lg:col-span-7 space-y-6">

            {/* Phase: INFO - Classroom Info + Topic */}
            {phase === "info" && (
              <>
                <div className="pre-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10">
                  <h3 className="font-chapter text-lg text-ink-900 mb-5 flex items-center gap-2 tracking-wider">
                    <span className="w-1 h-5 bg-gold-600 rounded-full" />教室信息
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-ink-500 mb-2">教室标题</label>
                      <div className="ink-input"><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-transparent py-2.5 text-ink-900 outline-none" /></div>
                    </div>
                    <div>
                      <label className="block text-sm text-ink-500 mb-2">教室简介</label>
                      <div className="ink-input"><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} className="w-full bg-transparent py-2.5 text-ink-900 outline-none resize-none" /></div>
                    </div>
                  </div>
                </div>

                <div className="pre-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-chapter text-lg text-ink-900 tracking-wider">探讨主题</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-400">准备好一起学习了吗？</span>
                      {DEMO_MEMBERS.slice(0, 3).map(m => (
                        <div key={m.id} className="w-8 h-8 rounded-full bg-gold-600/10 border border-gold-600/30 flex items-center justify-center text-xs text-gold-600 font-bold">{m.avatar}</div>
                      ))}
                    </div>
                  </div>
                  <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={4} className="w-full bg-xuan-aged/20 rounded-card p-4 text-ink-900 outline-none focus:bg-xuan-aged/40 transition-colors resize-none border border-transparent focus:border-gold-600/20 mb-4" />
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-2 bg-gold-600/10 text-gold-600 rounded-btn text-sm border border-gold-600/20 hover:bg-gold-600 hover:text-white transition-all flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 12l8-2"/></svg>配置模型</button>
                      <button className="px-3 py-2 rounded-btn border border-ink-300/20 text-ink-500 text-sm hover:border-gold-600 hover:text-gold-600 transition-all flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>模型设置</button>
                    </div>
                    <button onClick={handleStartSearch} className="px-8 py-2.5 bg-cinnabar text-white rounded-btn seal-btn tracking-wider font-chapter flex items-center gap-2">
                      开始检索<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Phase: SEARCHING */}
            {phase === "searching" && (
              <div className="pre-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-10 shadow-paper border border-gold-600/10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-600/10 flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-gold-600/30 border-t-gold-600 rounded-full animate-spin" />
                </div>
                <h3 className="font-title text-xl text-ink-900 mb-2 tracking-wider">正在检索资料...</h3>
                <p className="text-sm text-ink-500">系统正在联网搜索相关文献和资料</p>
                <div className="mt-6 h-2 bg-xuan-aged rounded-full overflow-hidden max-w-md mx-auto">
                  <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full animate-pulse" style={{ width: "60%" }} />
                </div>
              </div>
            )}

            {/* Phase: REVIEW - 10 Sources with checkboxes */}
            {(phase === "review" || phase === "perspective" || phase === "outline" || phase === "ready") && (
              <div className="pre-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-chapter text-lg text-ink-900 flex items-center gap-2 tracking-wider">
                    <span className="w-1 h-5 bg-gold-600 rounded-full" />
                    课前资料与选题
                  </h3>
                  <span className="text-xs text-ink-400">联网检索结果，已找到{sources.length}个结果</span>
                </div>

                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <button onClick={handleSelectAll} className="flex items-center gap-2 text-sm text-ink-500 hover:text-gold-600 transition-colors">
                      <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all ${selectAll ? "bg-gold-600 border-gold-600" : "border-ink-300"}`}>
                        {selectAll && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      全选
                    </button>
                    <span className="text-xs text-ink-400">已选 {checkedCount} / {sources.length} 条</span>
                  </div>
                  <span className="text-xs text-ink-400">网络资源</span>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {sources.map((source) => (
                    <div
                      key={source.id}
                      onClick={() => toggleSource(source.id)}
                      className={`relative p-4 rounded-card border-2 cursor-pointer transition-all duration-300 ${source.checked ? "border-gold-600/40 bg-gold-100/30" : "border-transparent bg-xuan-aged/30 hover:bg-xuan-aged/50"}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-sm border-2 flex items-center justify-center mt-0.5 transition-all ${source.checked ? "bg-gold-600 border-gold-600" : "border-ink-300"}`}>
                          {source.checked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`text-sm font-semibold truncate ${source.checked ? "text-ink-900" : "text-ink-600"}`}>{source.title}</h4>
                            <span className="flex-shrink-0 text-xs text-gold-600 hover:text-gold-700 flex items-center gap-1 cursor-pointer">
                              在线阅读<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            </span>
                          </div>
                          <p className="text-xs text-ink-400 mt-1">来源：{source.source} · {source.url}</p>
                          <p className="text-xs text-ink-500 mt-1.5 leading-relaxed">{source.snippet}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {phase === "review" && (
                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={handleConfirmSources}
                      disabled={checkedCount === 0}
                      className="px-8 py-3 bg-cinnabar text-white rounded-btn seal-btn tracking-wider font-chapter flex items-center gap-2 disabled:opacity-50"
                    >
                      确认选题<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Phase: PERSPECTIVE - Literature review + 3 perspectives */}
            {(phase === "perspective" || phase === "outline" || phase === "ready") && (
              <div className="pre-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10">
                <h3 className="font-chapter text-lg text-ink-900 mb-4 flex items-center gap-2 tracking-wider">
                  <span className="w-1 h-5 bg-gold-600 rounded-full" />
                  文献综述与选题视角
                </h3>

                {/* Literature review */}
                <div className="bg-xuan-aged/30 rounded-card p-5 mb-6 border-l-3 border-gold-600">
                  <h4 className="text-sm font-semibold text-ink-700 mb-2 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    文献综述
                  </h4>
                  <p className="text-sm text-ink-600 leading-relaxed">{literatureReview}</p>
                </div>

                {/* 3 Perspectives */}
                <p className="text-sm text-ink-500 mb-3">请选择一个选题视角，系统将据此生成课程大纲：</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PERSPECTIVES.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPerspective(p.id)}
                      className={`relative p-5 rounded-card border-2 cursor-pointer transition-all duration-300 card-lift ${selectedPerspective === p.id ? "border-gold-600 bg-gold-100/30 shadow-md" : "border-transparent bg-xuan-aged/30 hover:bg-xuan-aged/50 hover:border-gold-600/20"}`}
                    >
                      {selectedPerspective === p.id && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold-600 text-white flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                      )}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-3 ${selectedPerspective === p.id ? "bg-gold-600 text-white" : "bg-gold-600/10 text-gold-600"}`}>
                        {["一", "二", "三"][p.id - 1]}
                      </div>
                      <h5 className="font-chapter text-base text-ink-900 mb-1 tracking-wider">{p.title}</h5>
                      <p className="text-xs text-gold-600 mb-2">{p.subtitle}</p>
                      <p className="text-xs text-ink-500 leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>

                {phase === "perspective" && (
                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={handleGenerateOutline}
                      disabled={!selectedPerspective}
                      className="px-8 py-3 bg-cinnabar text-white rounded-btn seal-btn tracking-wider font-chapter flex items-center gap-2 disabled:opacity-50"
                    >
                      下一步：生成大纲<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Phase: OUTLINE */}
            {(phase === "outline" || phase === "ready") && (
              <div className="pre-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10">
                <h3 className="font-chapter text-lg text-ink-900 mb-5 flex items-center gap-2 tracking-wider">
                  <span className="w-1 h-5 bg-gold-600 rounded-full" />
                  课程大纲
                </h3>
                <div className="space-y-3">
                  {outline.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-xuan-aged/30 rounded-card hover:bg-xuan-aged/50 transition-all border-l-3 border-gold-600/40">
                      <span className="flex-shrink-0 w-8 h-8 bg-gold-600/10 text-gold-600 rounded-full flex items-center justify-center text-sm font-bold font-chapter">{idx + 1}</span>
                      <span className="text-sm text-ink-900">{item}</span>
                    </div>
                  ))}
                </div>
                {phase === "ready" && (
                  <div className="mt-5 p-4 bg-stone-green/10 rounded-card border border-stone-green/20 text-center">
                    <p className="text-sm text-stone-green font-semibold flex items-center justify-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      课程准备完成！可以开始上课了
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Ready banner */}
            {phase === "ready" && (
              <div className="pre-anim chinese-frame shadow-frame">
                <div className="chinese-frame-inner aspect-[21/9] relative overflow-hidden">
                  <img src="/images/study-room.jpg" alt="" className="w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 bg-gradient-to-r from-ink-900/60 via-ink-900/30 to-transparent flex items-center">
                    <div className="px-8">
                      <p className="text-gold-300 text-xs tracking-[0.2em] mb-2">READY TO START</p>
                      <p className="font-title text-2xl text-white tracking-wider mb-3">一切准备就绪</p>
                      <p className="text-sm text-white/70 mb-4">课程大纲已生成 · 参考资料已确认 · 选题视角已选定</p>
                      {onComplete && (
                        <button
                          onClick={onComplete}
                          className="px-8 py-3 bg-cinnabar text-white rounded-btn seal-btn tracking-wider font-chapter flex items-center gap-2 hover:bg-cinnabar/90 transition-all"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          开始课堂
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ====== RIGHT COLUMN ====== */}
          <div className="lg:col-span-5 space-y-6">
            {/* Progress Panel */}
            <div className="pre-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10">
              <h3 className="font-chapter text-lg text-ink-900 mb-5 flex items-center gap-2 tracking-wider">
                <span className="w-1 h-5 bg-gold-600 rounded-full" />
                课堂准备状态
              </h3>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-ink-700">
                    {phase === "info" ? "等待开始生成" : phase === "searching" ? "正在检索中..." : phase === "review" ? "等待确认参考资料" : phase === "perspective" ? "等待选择选题视角" : phase === "outline" ? "正在生成大纲..." : "课程准备完成"}
                  </p>
                  <p className="text-xs text-ink-400 mt-0.5">
                    {phase === "info" ? "点击开始检索启动课前准备流程" : phase === "ready" ? "所有步骤已完成" : "正在进行课前准备工作..."}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gold-600 font-mono">{Math.round(progress)}%</p>
                  <p className="text-xs text-ink-400">总体进度</p>
                </div>
              </div>

              <div className="h-3 bg-xuan-aged rounded-full overflow-hidden mb-5">
                <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-700 relative" style={{ width: `${progress}%` }}>
                  {phase !== "info" && phase !== "ready" && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                </div>
              </div>

              {/* Step tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {STEPS.map((step, idx) => (
                  <span key={step} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    idx === stepIndex ? "bg-gold-600 text-white shadow-sm" : idx < stepIndex ? "bg-stone-green/15 text-stone-green" : "bg-xuan-aged text-ink-400"
                  }`}>
                    {step}
                  </span>
                ))}
              </div>

              {/* Logs */}
              <div className="bg-xuan-aged/30 rounded-card p-4">
                <h4 className="text-sm font-semibold text-ink-700 mb-3 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  最新日志
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 text-sm">
                      <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs ${log.type === "system" ? "bg-gold-600/10 text-gold-600" : "bg-stone-blue/10 text-stone-blue"}`}>{log.type === "system" ? "系统" : "模型"}</span>
                      <span className="text-ink-600">{log.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="pre-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10">
              <h3 className="font-chapter text-lg text-ink-900 mb-4 flex items-center gap-2 tracking-wider">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-600"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                教室成员 ({DEMO_MEMBERS.filter(m => m.online).length}/30)
              </h3>
              <div className="space-y-2">
                {DEMO_MEMBERS.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 bg-xuan-aged/30 rounded-card hover:bg-xuan-aged/50 transition-all cursor-pointer group">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all group-hover:scale-110 ${member.role === "房主" ? "bg-gold-600 text-white shadow-md" : "bg-xuan-aged text-ink-500"}`}>{member.avatar}</div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-xuan-white ${member.online ? "bg-stone-green" : "bg-ink-300"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink-900 group-hover:text-gold-600 transition-colors">{member.name}</p>
                      <p className="text-xs text-ink-400">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-class Discussion */}
            <div className="pre-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10">
              <h3 className="font-chapter text-lg text-ink-900 mb-4 tracking-wider">课前讨论</h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3 p-3 bg-xuan-aged/30 rounded-card">
                  <div className="w-8 h-8 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-xs font-bold flex-shrink-0">张</div>
                  <div>
                    <p className="text-xs font-semibold text-ink-700 mb-0.5">张同学</p>
                    <p className="text-sm text-ink-600">宋代山水画和元代文人画有什么区别呢？</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-xuan-aged/30 rounded-card">
                  <div className="w-8 h-8 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-xs font-bold flex-shrink-0">王</div>
                  <div>
                    <p className="text-xs font-semibold text-ink-700 mb-0.5">王同学</p>
                    <p className="text-sm text-ink-600">我觉得元代更注重写意，宋代更写实一些。</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input placeholder="和小伙伴讨论一下课堂内容吧" className="flex-1 bg-xuan-aged/20 rounded-card px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 outline-none focus:bg-xuan-aged/40 transition-colors border border-transparent focus:border-gold-600/20" />
                <button className="w-10 h-10 flex-shrink-0 rounded-full bg-cinnabar text-white flex items-center justify-center hover:scale-110 transition-transform seal-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
