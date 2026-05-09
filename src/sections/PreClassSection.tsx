import { useState, useEffect, useRef, useCallback } from "react";
import type { JSX } from "react";
import gsap from "gsap";
import type { Source } from "../lib/data";
import GenerationDetail from "./GenerationDetail";

// =============================
// 类型定义
// =============================

interface Perspective { id: number; title: string; description: string; icon: string; }

interface LLMProvider {
  id: string;
  name: string;
  icon: string;
  models: { id: string; name: string; capabilities: string[] }[];
}

interface AgentConfig {
  id: string;
  name: string;
  role: "teacher" | "assistant" | "student";
  avatar: string;
  persona: string;
  color: string;
}

interface PreClassSectionProps {
  onComplete?: () => void;
  sources?: Source[];
  perspectives?: Perspective[];
  outline?: string[];
  onStartSearch?: (topic: string) => void;
  onSelectSources?: (ids: number[]) => void;
  onSelectPerspective?: (id: number) => void;
}

// =============================
// 预设数据（用于预览）
// =============================

const PREVIEW_PROVIDERS: LLMProvider[] = [
  { id: "openai", name: "OpenAI", icon: "O", models: [
    { id: "gpt-4o", name: "GPT-4o", capabilities: ["vision", "tools", "streaming"] },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", capabilities: ["vision", "streaming"] },
    { id: "o1-preview", name: "o1-preview", capabilities: ["reasoning"] },
  ]},
  { id: "anthropic", name: "Anthropic", icon: "A", models: [
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet", capabilities: ["vision", "tools", "streaming"] },
    { id: "claude-3-haiku", name: "Claude 3 Haiku", capabilities: ["streaming"] },
  ]},
  { id: "google", name: "Google", icon: "G", models: [
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", capabilities: ["vision", "tools", "streaming"] },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", capabilities: ["vision", "streaming"] },
  ]},
  { id: "deepseek", name: "DeepSeek", icon: "D", models: [
    { id: "deepseek-chat", name: "DeepSeek Chat", capabilities: ["streaming"] },
    { id: "deepseek-reasoner", name: "DeepSeek Reasoner", capabilities: ["reasoning"] },
  ]},
];

const PREVIEW_AGENTS: AgentConfig[] = [
  { id: "t1", name: "李明德 教授", role: "teacher", avatar: "李", persona: "中央美术学院教授，专注中国山水画研究30年", color: "#C4963D" },
  { id: "a1", name: "学术助教", role: "assistant", avatar: "助", persona: "协助组织课堂讨论，补充学术背景知识", color: "#5A7A96" },
  { id: "s1", name: "张同学", role: "student", avatar: "张", persona: "中国画专业研究生，热爱传统绘画", color: "#6B8E6B" },
  { id: "s2", name: "王同学", role: "student", avatar: "王", persona: "艺术史本科生，善于跨学科思考", color: "#7B6F5D" },
];

const DEMO_SOURCES: Source[] = [
  { id: 1, title: "宋代山水画研究综述", url: "https://example.com/1", snippet: "本文系统梳理了北宋至南宋山水画的发展历程，重点分析了范宽、郭熙、马远等代表画家的艺术成就...", checked: false },
  { id: 2, title: "《林泉高致》中的三远法", url: "https://example.com/2", snippet: "郭熙在《林泉高致》中提出的“高远、深远、平远”三种构图法则，是中国山水画理论的重要基石...", checked: false },
  { id: 3, title: "台北故宫藏范宽《溪山行旅图》鉴赏", url: "https://example.com/3", snippet: "范宽的传世名作《溪山行旅图》以雄健的笔法和雨点皴技法，展现了北方山水的雄浑气势...", checked: false },
  { id: 4, title: "边角构图：南宋绘画的审美转向", url: "https://example.com/4", snippet: "马远、夏圭开创的“一角半边”构图范式，打破了北宋全景式构图传统，体现了南宋文人新的审美追求...", checked: false },
  { id: 5, title: "中国绘画史：宋元卷", url: "https://example.com/5", snippet: "该书以时间为线索，系统论述了宋代绘画从院体画到文人画的转变过程，对理解宋代山水画有重要参考价值...", checked: false },
];

const DEMO_PERSPECTIVES: Perspective[] = [
  { id: 1, title: "从技法视角切入", description: "聚焦“雨点皴”、“卷云皴”等具体笔墨技法的发展演变，适合有一定绘画基础的学生", icon: "技" },
  { id: 2, title: "从空间构图视角切入", description: "以郭熙“三远法”为核心，探讨宋代山水画的空间叙事逻辑，适合理论研究方向", icon: "构" },
  { id: 3, title: "从审美转向视角切入", description: "对比北宋全景式构图与南宋边角构图，分析政治环境对艺术风格的影响，适合跨学科研究", icon: "美" },
];

const DEMO_OUTLINE = [
  "第一章：宋代山水画概述（960-1279）",
  "第二章：范宽与《溪山行旅图》",
  "第三章：郭熙与“三远法”构图理论",
  "第四章：边角构图：马远与夏圭",
  "第五章：北宋与南宋山水画审美比较",
  "第六章：课堂讨论与创作实践",
];

// =============================
// 步骤常量
// =============================

const STEPS = ["探讨主题", "搜索资料", "选择视角", "课件大纲", "课件预览", "课件生成"];

// =============================
// 蓝紫色弹窗公共样式
// =============================

const panelBase = "rounded-xl overflow-hidden shadow-2xl border border-white/10";
const panelGradient = "bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95]";

// =============================
// 空状态组件
// =============================
function EmptyState({ icon, title, subtitle }: { icon: JSX.Element; title: string; subtitle: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-14 h-14 rounded-full bg-xuan-aged flex items-center justify-center mx-auto mb-3">{icon}</div>
      <p className="text-ink-500 text-sm mb-1">{title}</p>
      <p className="text-ink-300 text-xs">{subtitle}</p>
    </div>
  );
}

// =============================
// 主组件
// =============================
export default function PreClassSection({
  onComplete,
  sources: propSources = [],
  perspectives: propPerspectives = [],
  outline: propOutline = [],
  onStartSearch,
}: PreClassSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // ===== 阶段状态 =====
  const [phase, setPhase] = useState<"info" | "searching" | "review" | "perspective" | "outline" | "ready">("info");
  const [currentStep, setCurrentStep] = useState(0);

  // ===== 主题输入 =====
  const [topic, setTopic] = useState("");

  // ===== 参考资料 =====
  const [sources, setSources] = useState<Source[]>(propSources);
  const [selectedSources, setSelectedSources] = useState<Set<number>>(new Set());

  // ===== 选题 =====
  const [perspectives, setPerspectives] = useState<Perspective[]>(propPerspectives);
  const [selectedPerspective, setSelectedPerspective] = useState<number | null>(null);

  // ===== 大纲 =====
  const [outline, setOutline] = useState<string[]>(propOutline);
  const [showGenerationDetail, setShowGenerationDetail] = useState(false);

  // ===== LLM 模型弹窗 =====
  const [showModelPanel, setShowModelPanel] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string>("");

  // ===== Agent 弹窗 =====
  const [showAgentPanel, setShowAgentPanel] = useState(false);
  const [agentMode, setAgentMode] = useState<"preset" | "auto">("preset");
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(["t1"]);
  const [maxTurns, setMaxTurns] = useState(5);
  const [agents] = useState<AgentConfig[]>(PREVIEW_AGENTS);

  // ===== 附件 =====
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [webSearch, setWebSearch] = useState(true);

  // ===== GSAP 动画 =====
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".pre-anim").forEach((el, i) => {
        gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: i * 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [phase]);

  // ===== 开发者：自动填写 =====
  const handleAutoFill = useCallback(() => {
    setTopic("宋代山水画中的写实主义传统");
  }, []);

  const handleSkipPhase = useCallback(() => {
    if (phase === "info") { setPhase("searching"); setCurrentStep(1); setTimeout(() => { setPhase("review"); setCurrentStep(1); }, 500); }
    else if (phase === "searching") { setPhase("review"); setCurrentStep(1); }
    else if (phase === "review") { setPhase("perspective"); setCurrentStep(2); }
    else if (phase === "perspective") { setPhase("outline"); setCurrentStep(3); }
    else if (phase === "outline") { setPhase("ready"); setCurrentStep(5); setShowGenerationDetail(true); }
  }, [phase]);

  // ===== 开发者：填充假数据 =====
  const handleLoadDemoData = useCallback(() => {
    setSources(DEMO_SOURCES);
    setPerspectives(DEMO_PERSPECTIVES);
    setOutline(DEMO_OUTLINE);
  }, []);

  // ===== 事件处理 =====
  const handleStartSearch = () => {
    setPhase("searching");
    setCurrentStep(1);
    onStartSearch?.(topic);
  };

  const toggleSource = (id: number) => {
    setSelectedSources(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleReviewComplete = () => { setPhase("perspective"); setCurrentStep(2); };
  const handleSelectPerspective = (id: number) => { setSelectedPerspective(id); setPhase("outline"); setCurrentStep(3); };
  const handleOutlineConfirm = () => { setPhase("ready"); setCurrentStep(5); setShowGenerationDetail(true); };

  // ===== LLM 模型选择 =====
  const handleSelectProvider = (provider: LLMProvider) => { setSelectedProvider(provider); };
  const handleSelectModel = (providerId: string, modelId: string) => {
    setSelectedModelId(`${providerId}:${modelId}`);
    setSelectedProvider(null);
    setShowModelPanel(false);
  };

  // ===== Agent 选择 =====
  const toggleAgent = (id: string) => {
    if (id === "t1") return; // 教师不可取消
    setSelectedAgentIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // ===== 获取当前模型显示文本 =====
  const getModelDisplay = () => {
    if (!selectedModelId) return null;
    const [pid, mid] = selectedModelId.split(":");
    const p = PREVIEW_PROVIDERS.find(pr => pr.id === pid);
    const m = p?.models.find(mo => mo.id === mid);
    return { provider: p?.name || pid, model: m?.name || mid };
  };

  const modelDisplay = getModelDisplay();

  // ===== 获取选中的 Agent =====
  const selectedAgents = agents.filter(a => selectedAgentIds.includes(a.id));

  // ===== pill 样式 =====
  const pillMuted = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer select-none whitespace-nowrap border border-white/10 text-slate-400 hover:text-white hover:bg-white/5";
  const pillActive = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer select-none whitespace-nowrap border border-violet-300/40 bg-violet-500/10 text-violet-300";

  return (
    <div ref={sectionRef} className="relative min-h-screen py-20 px-4 md:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/images/palace-ceiling.jpg" alt="" className="w-full h-full object-cover opacity-[0.04]" />
        <div className="absolute inset-0 bg-gradient-to-b from-xuan-white via-transparent to-xuan-white"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8 pre-anim">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-600/40"></div><div className="w-3 h-3 rounded-full bg-gold-600/60"></div><div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-600/40"></div>
          </div>
          <h2 className="font-title text-ink-900 mb-2">课前准备</h2>
          <p className="font-annotation text-ink-500 tracking-[0.15em]">格物致知 · 厚积薄发</p>
        </div>

        {/* Steps */}
        <div className="pre-anim mb-8">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${i <= currentStep ? "border-gold-600 text-gold-600 bg-gold-100/20" : "border-ink-300/30 text-ink-400"}`}>{i + 1}. {s}</div>
                {i < STEPS.length - 1 && <div className={`w-4 h-px ${i < currentStep ? "bg-gold-600" : "bg-ink-300/30"}`}></div>}
              </div>
            ))}
          </div>
        </div>

        {/* ===== 开发者工具栏 ===== */}
        <div className="pre-anim mb-4 flex items-center justify-end gap-2">
          <button onClick={handleAutoFill} className="px-3 py-1.5 rounded-btn text-xs bg-gold-600/10 text-gold-600 border border-gold-600/20 hover:bg-gold-600 hover:text-white transition-all">自动填写</button>
          <button onClick={handleLoadDemoData} className="px-3 py-1.5 rounded-btn text-xs bg-violet-600/10 text-violet-400 border border-violet-600/20 hover:bg-violet-600 hover:text-white transition-all">加载假数据</button>
          <button onClick={handleSkipPhase} className="px-3 py-1.5 rounded-btn text-xs bg-xuan-aged text-ink-500 border border-ink-300/20 hover:border-cinnabar hover:text-cinnabar transition-all">跳过阶段</button>
        </div>

        {/* ===== 主体内容 ===== */}
        {phase === "info" && (
          <div className="pre-anim">
            {/* 探讨主题输入区 — RoomRequirementComposer 风格 */}
            <div className="bg-xuan-white/95 backdrop-blur-sm rounded-2xl border border-gold-600/15 shadow-xl p-6 relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-ink-400/70">探讨主题</span>
                {/* AgentBar 悬浮触发 */}
                <button
                  onClick={() => setShowAgentPanel(true)}
                  className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs transition-all hover:bg-white/5"
                >
                  <span className="text-slate-300 hidden sm:inline">课堂角色配置</span>
                  <div className="flex items-center -space-x-1.5">
                    {selectedAgents.slice(0, 3).map(a => (
                      <div key={a.id} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white/20" style={{ backgroundColor: a.color + "30", color: a.color }}>{a.avatar}</div>
                    ))}
                    {selectedAgents.length > 3 && (
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-slate-400 font-bold">+{selectedAgents.length - 3}</div>
                    )}
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
              </div>

              {/* Textarea */}
              <textarea
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="描述本次课程的主题、目标、限制条件以及教学重点..."
                className="w-full min-h-[120px] max-h-[240px] resize-none border-0 bg-transparent text-sm leading-relaxed text-ink-900 outline-none placeholder:text-ink-300 mb-4"
              />

              {/* 底部 Toolbar */}
              <div className="flex items-end gap-2 flex-wrap">
                {/* 左侧 pills */}
                <div className="flex items-center gap-1.5 flex-1 flex-wrap">
                  {/* 模型选择 Pill */}
                  <button onClick={() => setShowModelPanel(true)} className={modelDisplay ? pillActive : pillMuted} title={modelDisplay ? `${modelDisplay.provider} / ${modelDisplay.model}` : "选择模型服务商"}>
                    {modelDisplay ? (
                      <>
                        <span className="w-4 h-4 rounded-sm bg-violet-500/30 flex items-center justify-center text-[10px] text-violet-300">{modelDisplay.provider.charAt(0)}</span>
                        <span className="truncate max-w-[100px]">{modelDisplay.model}</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                        <span>配置模型</span>
                      </>
                    )}
                  </button>

                  {/* 分隔线 */}
                  <div className="w-px h-4 bg-ink-300/30 mx-0.5"></div>

                  {/* PDF Pill */}
                  <button
                    className={pdfFile ? pillActive : pillMuted}
                    onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.accept = '.pdf'; input.onchange = (e: Event) => setPdfFile((e.target as HTMLInputElement).files?.[0] || null); input.click(); }}
                    title={pdfFile ? pdfFile.name : "上传PDF"}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    {pdfFile ? pdfFile.name.slice(0, 8) + "..." : "PDF"}
                    {pdfFile && <span onClick={e => { e.stopPropagation(); setPdfFile(null); }} className="ml-0.5 hover:text-red-400"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>}
                  </button>

                  {/* 网络搜索 Pill */}
                  <button onClick={() => setWebSearch(!webSearch)} className={webSearch ? pillActive : pillMuted}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                    联网搜索
                  </button>

                  {/* RAGFlow Pill */}
                  <button className={pillMuted}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    RAGFlow
                  </button>

                  {/* 语言 Pill */}
                  <button className={pillMuted}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    中文
                  </button>

                  {/* 分隔线 */}
                  <div className="w-px h-4 bg-ink-300/30 mx-0.5"></div>

                  {/* Media: TTS / ASR */}
                  <button className={pillMuted}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                    TTS
                  </button>
                  <button className={pillMuted}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    ASR
                  </button>
                </div>

                {/* 右侧：语音 + 发送 */}
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all" title="语音输入">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                  </button>
                  <button
                    onClick={handleStartSearch}
                    disabled={!topic.trim()}
                    className={`px-4 py-2 rounded-btn flex items-center gap-1.5 text-sm font-medium transition-all ${topic.trim() ? "bg-cinnabar text-white hover:bg-cinnabar/90 seal-btn" : "bg-xuan-aged text-ink-300 cursor-not-allowed"}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>
                    开始生成
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== 其他阶段（保持不变 + 开发者跳过按钮） ===== */}
        {phase !== "info" && (
          <div className="pre-anim flex items-center justify-end gap-2 mb-4">
            <button onClick={handleSkipPhase} className="px-3 py-1.5 rounded-btn text-xs bg-xuan-aged text-ink-500 border border-ink-300/20 hover:border-cinnabar hover:text-cinnabar transition-all">跳过阶段 →</button>
          </div>
        )}

        {phase === "searching" && (
          <div className="pre-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-8 shadow-paper border border-gold-600/10 text-center">
            <div className="w-12 h-12 rounded-full bg-gold-600/10 border-2 border-gold-600/30 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-600 animate-spin"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <p className="text-ink-700 mb-2">正在检索资料...</p>
            <p className="text-ink-400 text-sm">联网搜索 + 知识库检索中，请稍候</p>
            <button onClick={() => { setPhase("review"); setCurrentStep(1); }} className="mt-6 px-6 py-2 bg-gold-600/10 text-gold-600 rounded-btn text-sm hover:bg-gold-600 hover:text-white transition-all">模拟：检索完成</button>
          </div>
        )}

        {phase === "review" && (
          <div className="pre-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10">
            <h3 className="font-chapter text-lg text-ink-900 mb-5 flex items-center gap-2 tracking-wider"><span className="w-1 h-5 bg-gold-600 rounded-full"></span>选择参考资料</h3>
            {sources.length === 0 ? (
              <EmptyState icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-400"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>} title="暂无检索结果" subtitle="点击「开始检索」后将显示联网搜索和知识库检索结果" />
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {sources.map(s => (
                    <div key={s.id} onClick={() => toggleSource(s.id)} className={`p-4 rounded-card border-2 cursor-pointer transition-all flex items-start gap-3 ${selectedSources.has(s.id) ? "border-gold-600 bg-gold-100/20" : "border-transparent bg-xuan-aged/30 hover:bg-xuan-aged/50"}`}>
                      <div className={`flex-shrink-0 w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center transition-all ${selectedSources.has(s.id) ? "bg-gold-600 border-gold-600" : "border-ink-300"}`}>{selectedSources.has(s.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ink-900 font-medium mb-1">{s.title}</p>
                        <p className="text-xs text-ink-400 mb-1.5 line-clamp-2">{s.snippet}</p>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gold-600 hover:underline">{s.url}</a>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={handleReviewComplete} disabled={selectedSources.size === 0} className="w-full py-3 bg-cinnabar text-white rounded-btn seal-btn tracking-wider font-chapter disabled:opacity-40 disabled:cursor-not-allowed">已选 {selectedSources.size} 条 · 进入选题</button>
              </>
            )}
          </div>
        )}

        {phase === "perspective" && (
          <div className="pre-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10">
            <h3 className="font-chapter text-lg text-ink-900 mb-5 flex items-center gap-2 tracking-wider"><span className="w-1 h-5 bg-gold-600 rounded-full"></span>选择选题视角</h3>
            {perspectives.length === 0 ? (
              <EmptyState icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-400"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>} title="暂无选题视角" subtitle="AI 将基于参考资料生成多个选题方向" />
            ) : (
              <div className="space-y-4">
                {perspectives.map(p => (
                  <button key={p.id} onClick={() => handleSelectPerspective(p.id)} className={`w-full text-left p-5 rounded-card border-2 transition-all ${selectedPerspective === p.id ? "border-gold-600 bg-gold-100/20 shadow-md" : "border-transparent bg-xuan-aged/30 hover:bg-xuan-aged/50 hover:border-gold-600/30"}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-10 h-10 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-lg">{p.icon}</span>
                      <h4 className="font-chapter text-base text-ink-900">{p.title}</h4>
                    </div>
                    <p className="text-sm text-ink-500 ml-[52px]">{p.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {(phase === "outline" || phase === "ready") && (
          <>
            {showGenerationDetail && <GenerationDetail />}
            <div className="pre-anim bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10 mt-6">
              <h3 className="font-chapter text-lg text-ink-900 mb-5 flex items-center gap-2 tracking-wider"><span className="w-1 h-5 bg-gold-600 rounded-full"></span>课程大纲</h3>
              {outline.length === 0 ? (
                <EmptyState icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} title="暂无课程大纲" subtitle="选题确定后，AI 将自动生成课程大纲" />
              ) : (
                <>
                  <div className="space-y-3">
                    {outline.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-xuan-aged/30 rounded-card hover:bg-xuan-aged/50 transition-all border-l-3 border-gold-600/40">
                        <span className="flex-shrink-0 w-8 h-8 bg-gold-600/10 text-gold-600 rounded-full flex items-center justify-center text-sm font-bold font-chapter">{idx + 1}</span>
                        <span className="text-sm text-ink-900">{item}</span>
                      </div>
                    ))}
                  </div>
                  {phase === "outline" && (
                    <button onClick={handleOutlineConfirm} className="mt-5 w-full py-3 bg-gold-600 text-white rounded-btn tracking-wider font-chapter flex items-center justify-center gap-2 hover:bg-gold-700 transition-all">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>确认大纲，生成课件
                    </button>
                  )}
                  {phase === "ready" && (
                    <div className="mt-5 space-y-3">
                      <div className="p-4 bg-stone-green/10 rounded-card border border-stone-green/20 text-center">
                        <p className="text-sm text-stone-green font-semibold flex items-center justify-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>课件生成完成
                        </p>
                      </div>
                      {onComplete && (
                        <button onClick={onComplete} className="w-full py-3 bg-cinnabar text-white rounded-btn tracking-wider font-chapter flex items-center justify-center gap-2 hover:bg-cinnabar/90 transition-all seal-btn">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>开始课堂
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* =============================
          LLM 模型选择弹窗 — 蓝紫色调
          ============================= */}
      {showModelPanel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => setShowModelPanel(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className={`relative ${panelBase} ${panelGradient} w-full max-w-md mx-4 max-h-[80vh] flex flex-col`} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">
                {selectedProvider ? (
                  <button onClick={() => setSelectedProvider(null)} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    {selectedProvider.name}
                  </button>
                ) : "选择模型服务商"}
              </h3>
              <button onClick={() => setShowModelPanel(false)} className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2">
              {!selectedProvider ? (
                /* 第一层：提供商列表 */
                <div className="space-y-0.5">
                  {PREVIEW_PROVIDERS.map(p => (
                    <button key={p.id} onClick={() => handleSelectProvider(p)} className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-white/5 transition-all group">
                      <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-sm font-bold text-violet-300">{p.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{p.name}</p>
                        <p className="text-[10px] text-white/40">{p.models.length} 个模型</p>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30 group-hover:text-white/60"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  ))}
                </div>
              ) : (
                /* 第二层：模型列表 */
                <div className="space-y-0.5">
                  <div className="px-3 py-2 text-[10px] text-white/40 font-medium uppercase tracking-wider">{selectedProvider.models.length} 个模型</div>
                  {selectedProvider.models.map(m => (
                    <button key={m.id} onClick={() => handleSelectModel(selectedProvider.id, m.id)} className="w-full text-left px-4 py-3 rounded-lg flex items-center justify-between hover:bg-white/5 transition-all group">
                      <div>
                        <p className="text-sm text-white font-medium font-mono">{m.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {m.capabilities.includes("vision") && <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300">Vision</span>}
                          {m.capabilities.includes("tools") && <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300">Tools</span>}
                          {m.capabilities.includes("streaming") && <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300">Stream</span>}
                        </div>
                      </div>
                      {selectedModelId === `${selectedProvider.id}:${m.id}` && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-violet-400"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =============================
          Agent 配置弹窗 — 蓝紫色调
          ============================= */}
      {showAgentPanel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => setShowAgentPanel(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className={`relative ${panelBase} ${panelGradient} w-full max-w-md mx-4 max-h-[85vh] flex flex-col`} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-300"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">课堂角色配置</h3>
                  <p className="text-[10px] text-white/40">{selectedAgentIds.length} 个角色已选中</p>
                </div>
              </div>
              <button onClick={() => setShowAgentPanel(false)} className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="px-5 pt-4">
              <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-0.5">
                <button onClick={() => setAgentMode("preset")} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${agentMode === "preset" ? "bg-violet-600 text-white" : "text-white/50 hover:text-white/80"}`}>预设模式</button>
                <button onClick={() => setAgentMode("auto")} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${agentMode === "auto" ? "bg-violet-600 text-white" : "text-white/50 hover:text-white/80"}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18"/><path d="M3 12h18"/><path d="m7 7 5 5 5-5"/><path d="m7 17 5-5 5 5"/></svg>
                  自动生成
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {agentMode === "preset" ? (
                <div className="space-y-2">
                  {agents.map(a => (
                    <div key={a.id} onClick={() => toggleAgent(a.id)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedAgentIds.includes(a.id) ? "border-violet-400/40 bg-violet-500/10" : "border-white/5 bg-white/5 hover:bg-white/8"}`}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedAgentIds.includes(a.id) ? "bg-violet-500 border-violet-500" : "border-white/20"}`}>
                        {selectedAgentIds.includes(a.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: a.color + "30", color: a.color, border: `1px solid ${a.color}40` }}>{a.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-medium">{a.name}</span>
                          {a.role === "teacher" && <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300">必需</span>}
                        </div>
                        <p className="text-[11px] text-white/40 truncate">{a.persona}</p>
                      </div>
                    </div>
                  ))}

                  {/* 模式提示 */}
                  {selectedAgentIds.length === 0 && (
                    <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">至少选择一个智能体</div>
                  )}
                  {selectedAgentIds.length === 1 && (
                    <div className="mt-3 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300">单智能体模式 — 直接回答</div>
                  )}
                  {selectedAgentIds.length > 1 && (
                    <div className="mt-3 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300">多智能体协作 — {selectedAgentIds.length} 个智能体</div>
                  )}

                  {/* Max Turns（仅多智能体时） */}
                  {selectedAgentIds.length > 1 && (
                    <div className="mt-3 border-l-4 border-violet-500 pl-4 py-2">
                      <p className="text-xs text-white/60 mb-2">最大对话轮数</p>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setMaxTurns(Math.max(1, maxTurns - 1))} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20">-</button>
                        <span className="text-sm text-white font-medium w-6 text-center">{maxTurns}</span>
                        <button onClick={() => setMaxTurns(Math.min(20, maxTurns + 1))} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20">+</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Auto 模式 */
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4 animate-pulse">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400"><path d="M12 3v18"/><path d="M3 12h18"/><path d="m7 7 5 5 5-5"/><path d="m7 17 5-5 5 5"/></svg>
                  </div>
                  <p className="text-sm text-white/70 mb-1">AI 自动生成角色</p>
                  <p className="text-xs text-white/40">系统将自动生成教师、助教和学生角色</p>
                  <p className="text-xs text-white/30 mt-2">音色将自动分配</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-white/10 flex justify-end gap-2">
              <button onClick={() => setShowAgentPanel(false)} className="px-4 py-2 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/5 transition-all">取消</button>
              <button onClick={() => setShowAgentPanel(false)} className="px-4 py-2 rounded-lg text-xs bg-violet-600 text-white hover:bg-violet-500 transition-all">保存配置</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
