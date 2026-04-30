import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { DEMO_MESSAGES, DEMO_MEMBERS } from "../lib/data";
import SlidesPlayer from "./SlidesPlayer";
import QuizSection from "./QuizSection";
import WhiteboardSection from "./WhiteboardSection";
import SettingsPanel from "./SettingsPanel";
import VideoConference from "./VideoConference";

interface InClassSectionProps {
  onComplete?: () => void;
}

type ClassTab = "slides" | "discussion" | "quiz" | "whiteboard";
type VideoLayout = "hidden" | "sidebar" | "gallery";

export default function InClassSection({ onComplete }: InClassSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<ClassTab>("slides");
  const [videoLayout, setVideoLayout] = useState<VideoLayout>("sidebar");
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [handRaised, setHandRaised] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  type ExpertStatus = "pending" | "approved" | "rejected";
  const [expertRequests, setExpertRequests] = useState<{id:number,name:string,institution:string,specialty:string,status:ExpertStatus}[]>([
    { id: 1, name: "周文博", institution: "故宫博物院", specialty: "古书画鉴定", status: "pending" },
    { id: 2, name: "林墨涵", institution: "中国美术学院", specialty: "山水画创作", status: "pending" },
  ]);
  const [activeExperts, setActiveExperts] = useState<{id:number,name:string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".in-anim").forEach((el, i) => {
        gsap.fromTo(el, { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, delay: i * 0.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      sender: "我", avatar: "我", role: "student" as const,
      content: inputValue,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, newMsg]);
    setInputValue("");
  };

  const handleApproveExpert = (id: number) => {
    const expert = expertRequests.find(e => e.id === id);
    if (expert && expert.status === "pending") {
      setExpertRequests(prev => prev.map(e => e.id === id ? { ...e, status: "approved" as const } : e));
      setActiveExperts(prev => [...prev, { id: expert.id, name: expert.name }]);
      const newMsg = {
        id: messages.length + 1,
        sender: "系统", avatar: "系", role: "system" as const,
        content: `${expert.name}（${expert.institution}）已获准进入课堂进行点评。当前教室已开启视频会议，专家画面对所有学员可见。`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, newMsg]);
      // Auto switch to sidebar video when expert joins
      setVideoLayout("sidebar");
    }
  };

  const handleRejectExpert = (id: number) => {
    setExpertRequests(prev => prev.map(e => e.id === id ? { ...e, status: "rejected" as const } : e));
  };

  const tabs: { id: ClassTab; label: string; icon: JSX.Element }[] = [
    { id: "slides", label: "幻灯片", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg> },
    { id: "discussion", label: "课堂讨论", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { id: "quiz", label: "课堂测验", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { id: "whiteboard", label: "白板", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg> },
  ];

  return (
    <div ref={sectionRef} className="relative min-h-screen py-20 px-4 md:px-8 overflow-hidden">
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/images/window-lattice.jpg" alt="" className="w-full h-full object-cover opacity-[0.05]" />
        <div className="absolute inset-0 bg-gradient-to-b from-xuan-white via-transparent to-xuan-white" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Title */}
        <div className="text-center mb-8 in-anim">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-cinnabar/40" />
            <div className="w-3 h-3 rounded-full bg-cinnabar/60" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-cinnabar/40" />
          </div>
          <h2 className="font-title text-ink-900 mb-2">课中互动</h2>
          <p className="font-annotation text-ink-500 tracking-[0.15em]">雅集论道 · 名师解惑</p>
        </div>

        {/* Expert Requests Banner */}
        {expertRequests.some(e => e.status === "pending") && (
          <div className="mb-6 in-anim">
            <div className="bg-gradient-to-r from-cinnabar/5 to-gold-100/20 backdrop-blur-sm rounded-card p-5 shadow-paper border border-cinnabar/15">
              <h3 className="text-sm font-semibold text-ink-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-cinnabar rounded-full" />
                专家申请进入课堂
                <span className="text-xs text-ink-400 font-normal">（房主审核）</span>
                <span className="ml-auto px-2 py-0.5 rounded bg-cinnabar/10 text-cinnabar text-xs animate-pulse">待处理</span>
              </h3>
              <div className="space-y-3">
                {expertRequests.filter(e => e.status === "pending").map((expert) => (
                  <div key={expert.id} className="flex items-center justify-between p-4 bg-xuan-white rounded-card border border-gold-600/10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-cinnabar/10 text-cinnabar flex items-center justify-center text-base font-bold border-2 border-cinnabar/20">
                        {expert.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{expert.name} <span className="text-xs text-cinnabar font-normal ml-1">[专家]</span></p>
                        <p className="text-xs text-ink-400">{expert.institution} · {expert.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRejectExpert(expert.id)}
                        className="px-4 py-2 text-sm text-ink-500 hover:text-cinnabar hover:bg-cinnabar/10 rounded-btn transition-all border border-ink-300/20"
                      >
                        拒绝
                      </button>
                      <button
                        onClick={() => handleApproveExpert(expert.id)}
                        className="px-4 py-2 text-sm bg-cinnabar text-white rounded-btn hover:bg-cinnabar/90 transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                        允许进入
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-ink-400 mt-3 pl-1">允许后，专家将直接进入视频会议，无需共享屏幕，所有学员均可看到专家画面。</p>
            </div>
          </div>
        )}

        {/* Video call quick toggle when experts are active */}
        {activeExperts.length > 0 && videoLayout === "hidden" && (
          <div className="mb-4 in-anim">
            <button
              onClick={() => setVideoLayout("sidebar")}
              className="w-full py-3 rounded-card bg-gradient-to-r from-ink-800 to-ink-900 text-white text-sm flex items-center justify-center gap-2 hover:from-ink-700 hover:to-ink-800 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              专家「{activeExperts.map(e => e.name).join("、")}」已加入，开启视频会议
            </button>
          </div>
        )}

        {/* Main Tab + Content */}
        <div className="mb-6 in-anim">
          <div className="flex items-center gap-2 bg-xuan-aged/30 rounded-card p-1.5 border border-gold-600/10 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-btn text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-gold-600 text-white shadow-md"
                    : "text-ink-500 hover:text-ink-700 hover:bg-xuan-aged/50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            <div className="flex-1" />
            {/* Video layout toggler (only show when experts active or always for demo) */}
            <div className="flex items-center gap-1 bg-xuan-aged/50 rounded-card p-1">
              <button
                onClick={() => setVideoLayout(videoLayout === "hidden" ? "sidebar" : "hidden")}
                className={`px-2.5 py-1.5 rounded-btn text-xs transition-all flex items-center gap-1 ${videoLayout !== "hidden" ? "bg-ink-800 text-white" : "text-ink-500 hover:text-ink-700"}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                视频
              </button>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="px-3 py-2.5 rounded-btn text-ink-400 hover:text-gold-600 hover:bg-xuan-aged/50 transition-all"
              title="设置"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="in-anim">
          {activeTab === "slides" && (
            <div className={videoLayout === "gallery" ? "block" : "grid grid-cols-1 lg:grid-cols-12 gap-6"}>
              {videoLayout === "gallery" ? (
                <div className="lg:col-span-12">
                  <VideoConference layout="gallery" onLayoutChange={(l) => setVideoLayout(l === "sidebar" ? "sidebar" : "gallery")} />
                </div>
              ) : (
                <>
                  <div className={videoLayout === "sidebar" ? "lg:col-span-9" : "lg:col-span-12"}>
                    <SlidesPlayer />
                  </div>
                  {videoLayout === "sidebar" && (
                    <div className="lg:col-span-3">
                      <VideoConference layout="sidebar" onLayoutChange={(l) => setVideoLayout(l === "gallery" ? "gallery" : "hidden")} />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "discussion" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className={videoLayout !== "hidden" ? "lg:col-span-8" : "lg:col-span-12"}>
                <div className="bg-xuan-white/95 backdrop-blur-sm rounded-card shadow-paper border border-gold-600/10 h-[600px] flex flex-col">
                  <div className="p-5 border-b border-gold-600/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-chapter text-ink-900">讨论区</h3>
                        <p className="text-xs text-ink-400 mt-1">{messages.length} 条消息 · {DEMO_MEMBERS.filter(m => m.online).length} 人在线</p>
                      </div>
                      <div className="flex -space-x-2">
                        {DEMO_MEMBERS.filter(m => m.online).slice(0, 4).map(m => (
                          <div key={m.id} className="w-8 h-8 rounded-full bg-xuan-aged border-2 border-xuan-white flex items-center justify-center text-xs text-ink-500 font-bold">{m.name[0]}</div>
                        ))}
                        {DEMO_MEMBERS.filter(m => m.online).length > 4 && (
                          <div className="w-8 h-8 rounded-full bg-gold-600 border-2 border-xuan-white flex items-center justify-center text-xs text-white font-bold">+{DEMO_MEMBERS.filter(m => m.online).length - 4}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-3 ${msg.role === "student" && msg.sender === "我" ? "flex-row-reverse" : ""}`}>
                        <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${msg.role === "teacher" ? "bg-gold-600 text-white shadow-md" : msg.role === "ai" ? "bg-ink-900 text-white" : msg.role === "system" ? "bg-cinnabar text-white" : "bg-xuan-aged text-ink-500"}`}>{msg.avatar}</div>
                        <div className={`max-w-[70%] ${msg.role === "student" && msg.sender === "我" ? "text-right" : ""}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-ink-400">{msg.sender}</span>
                            <span className="text-xs text-ink-300">{msg.time}</span>
                          </div>
                          <div className={`inline-block px-4 py-2.5 rounded-card text-sm leading-relaxed ${msg.role === "system" ? "bg-cinnabar/10 text-cinnabar border border-cinnabar/20" : "bg-xuan-aged/50 text-ink-700 border border-gold-600/5"}`}>{msg.content}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-5 border-t border-gold-600/10">
                    <div className="flex gap-3">
                      <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="输入消息..." className="flex-1 px-4 py-3 rounded-card border border-gold-600/15 bg-xuan-aged/20 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-gold-600/40 transition-colors" />
                      <button onClick={handleSend} className="px-5 py-3 bg-gold-600 text-white rounded-btn hover:bg-gold-700 transition-all text-sm font-medium">发送</button>
                    </div>
                  </div>
                </div>
              </div>
              {videoLayout !== "hidden" && (
                <div className="lg:col-span-4">
                  <VideoConference layout="sidebar" onLayoutChange={(l) => setVideoLayout(l === "gallery" ? "gallery" : "hidden")} />
                </div>
              )}
            </div>
          )}

          {activeTab === "quiz" && <QuizSection />}
          {activeTab === "whiteboard" && <WhiteboardSection />}
        </div>

        {/* End Class */}
        {onComplete && (
          <div className="mt-12 flex justify-center in-anim">
            <button onClick={onComplete} className="px-12 py-4 bg-ink-900 text-white rounded-btn tracking-wider font-title flex items-center gap-3 hover:bg-ink-800 transition-all shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              结束课程，进入课后归档
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
