import { useState } from "react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

interface GenerationStep {
  id: string;
  label: string;
  status: "pending" | "running" | "completed" | "error";
  detail: string;
  logs: string[];
  duration?: string;
}

const INITIAL_STEPS: GenerationStep[] = [
  { id: "outline", label: "大纲生成", status: "completed", detail: "AI 分析主题并生成结构化课堂大纲", logs: ["[14:32:01] 开始分析主题：宋代山水画", "[14:32:03] 提取关键词：范宽、郭熙、三远法、院体画", "[14:32:08] 生成大纲结构：4章12节", "[14:32:15] 大纲生成完成"], duration: "14s" },
  { id: "slides", label: "幻灯片生成", status: "completed", detail: "将大纲条目渲染为带视觉元素的幻灯片", logs: ["[14:32:16] 开始生成第1章幻灯片", "[14:32:28] 生成配图：宋代山水画概述（4张）", "[14:32:45] 生成第2章：范宽与溪山行旅图", "[14:33:02] 生成第3章：郭熙与三远法", "[14:33:18] 生成第4章：边角构图", "[14:33:35] 幻灯片生成完成，共12页"], duration: "1m19s" },
  { id: "quiz", label: "测验生成", status: "completed", detail: "为每个知识点生成交互式测验题目", logs: ["[14:33:36] 分析关键知识点", "[14:33:42] 生成单选题：雨点皴、三远法", "[14:33:50] 生成多选题：边角构图特点", "[14:33:58] 生成简答题：写实主义成因", "[14:34:05] 测验生成完成，共4题"], duration: "29s" },
  { id: "interactive", label: "交互场景", status: "running", detail: "生成 HTML 交互式模拟实验", logs: ["[14:34:06] 开始构建交互场景", "[14:34:15] 生成皴法对比交互组件", "[14:34:28] 生成三远法空间演示", "[14:34:40] 渲染可视化图表..."], duration: "进行中" },
  { id: "tts", label: "语音合成", status: "pending", detail: "为 AI 讲师生成语音讲解", logs: [] },
  { id: "export", label: "课件导出", status: "pending", detail: "生成可下载的 PPTX 与 HTML", logs: [] },
];

export default function GenerationDetail() {
  const [steps, setSteps] = useState<GenerationStep[]>(INITIAL_STEPS);
  const [expandedStep, setExpandedStep] = useState<string | null>("slides");
  const [overallProgress, setOverallProgress] = useState(58);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gen-anim").forEach((el, i) => {
        gsap.fromTo(el, { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, delay: i * 0.08, ease: "power2.out" }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const statusIcon = (status: GenerationStep["status"]) => {
    switch (status) {
      case "completed": return <span className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs">✓</span>;
      case "running": return <span className="w-6 h-6 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />;
      case "error": return <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs">✗</span>;
      default: return <span className="w-6 h-6 rounded-full bg-slate-700/50 text-slate-500 flex items-center justify-center text-xs">○</span>;
    }
  };

  const statusLabel = (status: GenerationStep["status"]) => {
    switch (status) {
      case "completed": return <span className="text-xs text-violet-300">已完成</span>;
      case "running": return <span className="text-xs text-amber-300 animate-pulse">进行中...</span>;
      case "error": return <span className="text-xs text-red-400">失败</span>;
      default: return <span className="text-xs text-slate-500">等待中</span>;
    }
  };

  return (
    <div ref={containerRef} className="w-full rounded-xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)" }}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm tracking-wide">课件生成流水线</h3>
              <p className="text-slate-400 text-xs mt-0.5">两阶段：大纲生成 → 场景生成</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-violet-300 text-sm font-medium">{overallProgress}%</span>
            <p className="text-slate-500 text-xs">总体进度</p>
          </div>
        </div>
        <div className="mt-4 h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-violet-400 transition-all duration-1000" style={{ width: `${overallProgress}%` }} />
        </div>
      </div>

      {/* Steps */}
      <div className="p-4 space-y-2 max-h-[420px] overflow-y-auto">
        {steps.map((step, idx) => (
          <div key={step.id} className="gen-anim">
            <button
              onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
              className={`w-full text-left rounded-lg border transition-all duration-300 ${
                expandedStep === step.id
                  ? "bg-white/10 border-violet-400/30 shadow-lg shadow-violet-900/20"
                  : "bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/10"
              }`}
            >
              <div className="px-4 py-3 flex items-center gap-3">
                <div className="flex-shrink-0">{statusIcon(step.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${step.status === "completed" ? "text-slate-200" : step.status === "running" ? "text-white" : "text-slate-500"}`}>
                      {idx + 1}. {step.label}
                    </span>
                    <div className="flex items-center gap-3">
                      {statusLabel(step.status)}
                      {step.duration && <span className="text-xs text-slate-600 font-mono">{step.duration}</span>}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`text-slate-500 transition-transform duration-300 ${expandedStep === step.id ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{step.detail}</p>
                </div>
              </div>

              {/* Expanded logs */}
              {expandedStep === step.id && step.logs.length > 0 && (
                <div className="px-4 pb-3 pt-1">
                  <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                    <div className="space-y-1">
                      {step.logs.map((log, li) => (
                        <p key={li} className="text-xs text-slate-400 font-mono leading-relaxed">{log}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs text-slate-400">AI 正在生成交互场景...</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs hover:bg-white/10 transition-all">
            暂停生成
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-900/30">
            查看课件
          </button>
        </div>
      </div>
    </div>
  );
}
