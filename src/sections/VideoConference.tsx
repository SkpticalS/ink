import { useState } from "react";
import type { VideoParticipant } from "../lib/data";

interface VideoConferenceProps {
  participants?: VideoParticipant[];
}

/** Get surname (first character) from full name */
function getSurname(name: string): string {
  return name.charAt(0);
}

/** Avatar background color by role */
function avatarBg(role: VideoParticipant["role"]) {
  switch (role) {
    case "host": return "bg-gold-600 text-white";
    case "ai": return "bg-violet-500 text-white";
    case "expert": return "bg-cinnabar text-white";
    default: return "bg-ink-600 text-white/80";
  }
}

function roleBadge(role: VideoParticipant["role"]) {
  switch (role) {
    case "host": return <span className="px-1 py-0.5 rounded bg-gold-600/80 text-white text-[10px]">房主</span>;
    case "ai": return <span className="px-1 py-0.5 rounded bg-violet-500/80 text-white text-[10px]">AI</span>;
    case "expert": return <span className="px-1 py-0.5 rounded bg-cinnabar/80 text-white text-[10px]">专家</span>;
    default: return <span className="px-1 py-0.5 rounded bg-white/15 text-white/60 text-[10px]">学员</span>;
  }
}

function VideoTile({ p, onClick }: { p: VideoParticipant; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group
        ${p.isSpeaking ? "ring-2 ring-stone-green/80 shadow-lg shadow-stone-green/15" : "ring-1 ring-white/5 hover:ring-gold-600/40"}`}
      style={{ aspectRatio: "4/3" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950"></div>
      {!p.isCameraOn && (
        <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-[1px] flex items-center justify-center z-10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30">
            <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/>
            <path d="M16 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-3"/>
            <path d="M22 12h-8"/>
          </svg>
        </div>
      )}
      <div className="absolute inset-0 bg-ink-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
        <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg group-hover:scale-110 transition-transform ${avatarBg(p.role)}`}>
          {getSurname(p.name)}
        </div>
      </div>
      {p.isSpeaking && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full border-2 border-stone-green/40 animate-ping"></div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between">
        <span className="text-[11px] text-white/90 font-medium truncate pr-1">{p.name}</span>
        {!p.isMicOn && (
          <div className="w-4 h-4 rounded-full bg-black/50 flex items-center justify-center flex-shrink-0">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-400">
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

function VideoDetailModal({ p, onClose }: { p: VideoParticipant; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
      <div className="relative bg-ink-900/95 rounded-2xl border border-white/10 shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-8 flex flex-col items-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-3 shadow-lg ${avatarBg(p.role)}`}>
            {getSurname(p.name)}
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white text-lg font-semibold">{p.name}</span>
            {roleBadge(p.role)}
          </div>
          {p.isSpeaking && (
            <span className="text-xs text-stone-green flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-green animate-pulse"></div>
              正在发言
            </span>
          )}
        </div>
        <div className="px-6 pb-6 space-y-3">
          <div className="flex items-center gap-3 justify-center">
            <button className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${p.isMicOn ? "bg-ink-800 text-white border border-white/10 hover:bg-ink-700" : "bg-red-500/20 text-red-400 border border-red-500/20"}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>
            <button className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${p.isCameraOn ? "bg-ink-800 text-white border border-white/10 hover:bg-ink-700" : "bg-red-500/20 text-red-400 border border-red-500/20"}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <button className="w-12 h-12 rounded-full bg-ink-800 border border-white/10 flex items-center justify-center text-white/70 hover:bg-ink-700 transition-all" title="共享屏幕">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </button>
            <button className="w-12 h-12 rounded-full bg-ink-800 border border-white/10 flex items-center justify-center text-white/70 hover:bg-ink-700 transition-all" title="聊天">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
            <button className="w-12 h-12 rounded-full bg-red-500/90 border border-red-400/30 flex items-center justify-center text-white hover:bg-red-600 transition-all" title="挂断">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.68 13.31a6 6 0 0 0 8.76-1.66l-8.76 1.66z"/><path d="M14.31 10.68a6 6 0 0 0-8.76 1.66l8.76-1.66z"/><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
          </div>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  );
}

function EmptyVideoState() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="w-10 h-10 rounded-full bg-ink-800 flex items-center justify-center mb-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500">
          <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
      </div>
      <p className="text-xs text-slate-500">等待加入</p>
    </div>
  );
}

export default function VideoConference({ participants = [] }: VideoConferenceProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<VideoParticipant | null>(null);

  return (
    <>
      <div className="flex flex-col gap-2">
        {participants.length === 0 ? (
          <EmptyVideoState />
        ) : (
          participants.map(p => (
            <VideoTile key={p.id} p={p} onClick={() => setSelectedParticipant(p)} />
          ))
        )}
      </div>
      {selectedParticipant && (
        <VideoDetailModal p={selectedParticipant} onClose={() => setSelectedParticipant(null)} />
      )}
    </>
  );
}
