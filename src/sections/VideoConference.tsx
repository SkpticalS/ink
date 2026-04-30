import { useState, useEffect, useRef } from "react";

interface VideoParticipant {
  id: number;
  name: string;
  role: "host" | "student" | "expert" | "ai";
  avatar: string;
  isSpeaking?: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
}

const DEMO_PARTICIPANTS: VideoParticipant[] = [
  { id: 1, name: "罗文韬", role: "host", avatar: "罗", isSpeaking: false, isCameraOn: true, isMicOn: true },
  { id: 2, name: "李教授", role: "ai", avatar: "李", isSpeaking: true, isCameraOn: true, isMicOn: true },
  { id: 3, name: "张同学", role: "student", avatar: "张", isSpeaking: false, isCameraOn: true, isMicOn: false },
  { id: 4, name: "王同学", role: "student", avatar: "王", isSpeaking: false, isCameraOn: true, isMicOn: true },
  { id: 5, name: "赵同学", role: "student", avatar: "赵", isSpeaking: false, isCameraOn: false, isMicOn: true },
  { id: 6, name: "周文博", role: "expert", avatar: "周", isSpeaking: false, isCameraOn: true, isMicOn: true },
];

interface VideoConferenceProps {
  layout: "sidebar" | "gallery";
  onLayoutChange: (layout: "sidebar" | "gallery") => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
}

export default function VideoConference({ layout, onLayoutChange, onToggleExpand, isExpanded }: VideoConferenceProps) {
  const [participants, setParticipants] = useState<VideoParticipant[]>(DEMO_PARTICIPANTS);
  const [activeSpeaker, setActiveSpeaker] = useState<number>(2);
  const videoRef = useRef<HTMLDivElement>(null);

  // Simulate speaking indicator rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants(prev => prev.map(p => ({
        ...p,
        isSpeaking: p.id === activeSpeaker && p.isMicOn,
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, [activeSpeaker]);

  const roleBadge = (role: VideoParticipant["role"]) => {
    switch (role) {
      case "host": return <span className="px-1.5 py-0.5 rounded bg-gold-600/80 text-white text-[10px]">房主</span>;
      case "ai": return <span className="px-1.5 py-0.5 rounded bg-ink-900/60 text-gold-300 text-[10px]">AI 讲师</span>;
      case "expert": return <span className="px-1.5 py-0.5 rounded bg-cinnabar/80 text-white text-[10px]">专家</span>;
      default: return <span className="px-1.5 py-0.5 rounded bg-xuan-aged/60 text-ink-500 text-[10px]">学生</span>;
    }
  };

  // Sidebar layout: vertical strip on the right side
  if (layout === "sidebar") {
    return (
      <div className="flex flex-col gap-2 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-ink-400">视频会议 · {participants.filter(p => p.isCameraOn).length} 人在线</span>
          <div className="flex items-center gap-1">
            <button onClick={() => onLayoutChange("gallery")} className="p-1 rounded hover:bg-xuan-aged text-ink-400 hover:text-gold-600 transition-all" title="画廊视图">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </button>
            {onToggleExpand && (
              <button onClick={onToggleExpand} className="p-1 rounded hover:bg-xuan-aged text-ink-400 hover:text-gold-600 transition-all" title={isExpanded ? "收起" : "展开"}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{isExpanded ? <><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></> : <><path d="M15 3h3a2 2 0 0 1 2 2v3"/><path d="M9 21H6a2 2 0 0 1-2-2v-3"/><path d="M21 9v3a2 2 0 0 1-2 2h-3"/><path d="M3 15V12a2 2 0 0 1 2-2h3"/></>}</svg>
              </button>
            )}
          </div>
        </div>

        {/* Video strip */}
        <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-0.5">
          {participants.map((p) => (
            <div key={p.id} className={`relative rounded-card overflow-hidden border-2 transition-all duration-300 ${p.isSpeaking ? "border-gold-600 shadow-md shadow-gold-600/10" : "border-transparent"}`}>
              <div className="aspect-video bg-gradient-to-br from-ink-800 to-ink-900 flex items-center justify-center relative">
                {p.isCameraOn ? (
                  <>
                    <div className="w-full h-full bg-gradient-to-br from-ink-700 to-ink-900" />
                    {/* Simulated video placeholder with avatar */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${p.role === "expert" ? "bg-cinnabar text-white" : p.role === "ai" ? "bg-gold-600 text-white" : "bg-xuan-aged text-ink-500"}`}>
                        {p.avatar}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${p.role === "expert" ? "bg-cinnabar text-white" : p.role === "ai" ? "bg-gold-600 text-white" : "bg-xuan-aged text-ink-500"}`}>
                      {p.avatar}
                    </div>
                    <div className="absolute inset-0 bg-ink-900/60 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><path d="M16 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-3"/><path d="M22 12h-8"/></svg>
                    </div>
                  </div>
                )}

                {/* Speaking indicator */}
                {p.isSpeaking && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gold-600/80">
                    <div className="flex items-end gap-0.5 h-3">
                      <div className="w-0.5 bg-white rounded-full animate-[bounce_0.6s_infinite]" style={{ height: "40%" }} />
                      <div className="w-0.5 bg-white rounded-full animate-[bounce_0.5s_infinite_0.1s]" style={{ height: "70%" }} />
                      <div className="w-0.5 bg-white rounded-full animate-[bounce_0.4s_infinite_0.2s]" style={{ height: "100%" }} />
                    </div>
                  </div>
                )}

                {/* Mic status */}
                <div className="absolute top-2 right-2">
                  {!p.isMicOn ? (
                    <div className="w-5 h-5 rounded-full bg-ink-900/60 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    </div>
                  ) : p.isSpeaking ? (
                    <div className="w-5 h-5 rounded-full bg-gold-600/60 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Name bar */}
              <div className="px-2 py-1.5 bg-ink-900/90 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-white font-medium truncate">{p.name}</span>
                  {roleBadge(p.role)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Gallery layout: grid of video tiles (like Tencent Meeting)
  return (
    <div ref={videoRef} className="w-full h-full flex flex-col">
      {/* Header toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-ink-900/95 rounded-t-xl border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white font-medium">视频会议</span>
          <span className="text-xs text-slate-400">{participants.length} 人</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onLayoutChange("sidebar")} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs hover:bg-white/10 transition-all flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/></svg>
            边栏模式
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs hover:bg-white/10 transition-all flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/></svg>
            邀请专家
          </button>
        </div>
      </div>

      {/* Video grid */}
      <div className="flex-1 bg-ink-900 p-4 rounded-b-xl overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-full">
          {participants.map((p) => (
            <div key={p.id} className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${p.isSpeaking ? "border-gold-500 shadow-lg shadow-gold-500/20" : "border-white/5"}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-ink-700 to-ink-900" />
              
              {/* Avatar center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${p.role === "expert" ? "bg-cinnabar/20 text-cinnabar" : p.role === "ai" ? "bg-gold-600/20 text-gold-300" : "bg-white/10 text-slate-300"}`}>
                  {p.avatar}
                </div>
              </div>

              {/* Speaking waves */}
              {p.isSpeaking && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 rounded-full border border-gold-500/30 animate-ping" />
                  <div className="absolute w-20 h-20 rounded-full border border-gold-500/20 animate-ping" style={{ animationDelay: "0.2s" }} />
                </div>
              )}

              {/* Bottom info bar */}
              <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-medium">{p.name}</span>
                  {roleBadge(p.role)}
                </div>
                <div className="flex items-center gap-1.5">
                  {!p.isMicOn && (
                    <div className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/></svg>
                    </div>
                  )}
                  {!p.isCameraOn && (
                    <div className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><path d="M16 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-3"/><path d="M22 12h-8"/></svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Speaking badge */}
              {p.isSpeaking && (
                <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-gold-600/80 flex items-center gap-1">
                  <div className="flex items-end gap-0.5 h-3">
                    <div className="w-0.5 bg-white rounded-full animate-[bounce_0.5s_infinite]" style={{ height: "40%" }} />
                    <div className="w-0.5 bg-white rounded-full animate-[bounce_0.4s_infinite_0.1s]" style={{ height: "70%" }} />
                    <div className="w-0.5 bg-white rounded-full animate-[bounce_0.3s_infinite_0.2s]" style={{ height: "100%" }} />
                  </div>
                  <span className="text-[10px] text-white">发言中</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom control bar */}
      <div className="mt-3 flex items-center justify-center gap-4">
        <button className="w-12 h-12 rounded-full bg-ink-900/80 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-ink-800 hover:text-white transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </button>
        <button className="w-12 h-12 rounded-full bg-ink-900/80 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-ink-800 hover:text-white transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </button>
        <button className="w-12 h-12 rounded-full bg-red-500/80 border border-red-400/30 flex items-center justify-center text-white hover:bg-red-500 transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.68 13.31a6 6 0 0 0 8.76-1.66l-8.76 1.66z"/><path d="M14.31 10.68a6 6 0 0 0-8.76 1.66l8.76-1.66z"/><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </button>
        <button className="w-12 h-12 rounded-full bg-ink-900/80 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-ink-800 hover:text-white transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
        <button className="px-4 py-2 rounded-full bg-red-600 text-white text-sm hover:bg-red-700 transition-all">
          挂断
        </button>
      </div>
    </div>
  );
}
