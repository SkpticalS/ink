import { useState } from "react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

import type { GenerationStep } from "../lib/data";

interface GenerationDetailProps {
  steps?: GenerationStep[];
  overallProgress?: number;
}

export default function GenerationDetail({ steps = [], overallProgress = 0 }: GenerationDetailProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
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
      case "running": return <span className="w-6 h-6 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" ></span>;
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
          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-violet-400 transition-all duration-1000" style={{ width: `${overallProgress}%` }} ></div>
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
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" ></div>
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
