import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { DEMO_MESSAGES, DEMO_MEMBERS } from "../lib/data";
import SlidesPlayer from "./SlidesPlayer";
import QuizSection from "./QuizSection";
import WhiteboardSection from "./WhiteboardSection";
import SettingsPanel from "./SettingsPanel";

interface InClassSectionProps {
  onComplete?: () => void;
}

type ClassTab = "slides" | "discussion" | "quiz" | "whiteboard";

export default function InClassSection({ onComplete }: InClassSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<ClassTab>("slides");
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [activeTool, setActiveTool] = useState<string | null>(null);
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
        content: `${expert.name}（${expert.institution}）已获准进入课堂进行点评。`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, newMsg]);
    }
  };

  const handleRejectExpert = (id: number) => {
    setExpertRequests(prev => prev.map(e => e.id === id ? { ...e, status: "rejected" as const } : e));
  };

  const tools = [
    { id: "hand", label: "举手发言", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg> },
    { id: "barrage", label: "弹幕提问", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { id: "notes", label: "课堂笔记", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { id: "handout", label: "查看讲义", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  ];

  const tabs: { id: ClassTab; label: string; icon: JSX.Element }[] = [
    { id: "slides", label: "幻灯片", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg> },
    { id: "discussion", label: "课堂讨论", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { id: "quiz", label: "课堂测验", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { id: "whiteboard", label: "白板", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg> },
  ];

  return (
    <div ref={sectionRef} className="relative min-h-screen py-24 px-4 md:px-8 overflow-hidden">
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/images/window-lattice.jpg" alt="" className="w-full h-full object-cover opacity-[0.05]" />
        <div className="absolute inset-0 bg-gradient-to-b from-xuan-white via-transparent to-xuan-white" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-10 in-anim">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-cinnabar/40" />
            <div className="w-3 h-3 rounded-full bg-cinnabar/60" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-cinnabar/40" />
          </div>
          <h2 className="text-title text-ink-900 mb-3">课中互动</h2>
          <p className="text-annotation text-ink-500 tracking-[0.15em]">雅集论道 · 名师解惑</p>
        </div>

        {/* Expert Requests Banner */}
        {expertRequests.some(e => e.status === "pending") && (
          <div className="mb-8 in-anim">
            <div className="bg-xuan-white/95 backdrop-blur-sm rounded-card p-5 shadow-paper border border-gold-600/10">
              <h3 className="text-sm font-semibold text-ink-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-gold-600 rounded-full" />
                专家申请进入课堂
                <span className="text-xs text-ink-400 font-normal">（房主审核）</span>
              </h3>
              <div className="space-y-3">
                {expertRequests.filter(e => e.status === "pending").map((expert) => (
                  <div key={expert.id} className="flex items-center justify-between p-4 bg-xuan-aged/30 rounded-card border border-gold-600/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-sm font-bold">
                        {expert.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{expert.name}</p>
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
                        className="px-4 py-2 text-sm bg-stone-green text-white rounded-btn hover:bg-stone-green/90 transition-all flex items-center gap-1"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                        允许进入
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8 in-anim">
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
          {/* Slides Tab */}
          {activeTab === "slides" && <SlidesPlayer />}

          {/* Discussion Tab */}
          {activeTab === "discussion" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Chat */}
              <div className="lg:col-span-8">
                <div className="bg-xuan-white/95 backdrop-blur-sm rounded-card shadow-paper border border-gold-600/10 h-[600px] flex flex-col">
                  <div className="p-5 border-b border-gold-600/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-chapter text-ink-900">讨论区</h3>
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
                        <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${msg.role === "teacher" ? "bg-gold-600 text-white shadow-md" : msg.role === "ai" ? "bg-ink-900 text-white" : msg.role === "system" ? "bg-cinnabar text-white" : "bg-xuan-aged text-ink-500"}`}>
                          {msg.avatar}
                        </div>
                        <div className={`max-w-[70%] ${msg.role === "student" && msg.sender === "我" ? "text-right" : ""}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-ink-400">{msg.sender}</span>
                            <span className="text-xs text-ink-300">{msg.time}</span>
                          </div>
                          <div className={`inline-block px-4 py-2.5 rounded-card text-sm leading-relaxed ${msg.role === "system" ? "bg-cinnabar/10 text-cinnabar border border-cinnabar/20" : "bg-xuan-aged/50 text-ink-700 border border-gold-600/5"}`}>
                            {msg.content}
                          </div>
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

              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-5">
                {/* Members */}
                <div className="bg-xuan-white/95 backdrop-blur-sm rounded-card p-5 shadow-paper border border-gold-600/10">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-semibold text-ink-900">课堂成员</h3>
                    <span className="text-xs text-ink-400">{DEMO_MEMBERS.length + activeExperts.length} 人</span>
                  </div>
                  <div className="space-y-3">
                    {DEMO_MEMBERS.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all group-hover:scale-110 ${member.role === "主讲" ? "bg-gold-600 text-white shadow-md" : "bg-xuan-aged text-ink-500"}`}>{member.name[0]}</div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-xuan-white ${member.online ? "bg-stone-green" : "bg-ink-300"}`} />
                        </div>
                        <div className="flex-1 min-w-0"><p className="text-sm text-ink-900 truncate group-hover:text-gold-600 transition-colors">{member.name}</p></div>
                        <span className={`text-xs px-2.5 py-1 rounded-btn ${member.role === "主讲" ? "bg-gold-100 text-gold-600 font-medium" : "bg-xuan-aged text-ink-400"}`}>{member.role}</span>
                      </div>
                    ))}
                    {activeExperts.map((expert) => (
                      <div key={`expert-${expert.id}`} className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all group-hover:scale-110 bg-cinnabar text-white shadow-md">{expert.name[0]}</div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-xuan-white bg-stone-green" />
                        </div>
                        <div className="flex-1 min-w-0"><p className="text-sm text-ink-900 truncate group-hover:text-gold-600 transition-colors">{expert.name}</p></div>
                        <span className="text-xs px-2.5 py-1 rounded-btn bg-cinnabar/10 text-cinnabar font-medium">点评专家</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools */}
                <div className="bg-xuan-white/95 backdrop-blur-sm rounded-card p-5 shadow-paper border border-gold-600/10">
                  <h3 className="text-sm font-semibold text-ink-900 mb-4">互动工具</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {tools.map(tool => (
                      <button key={tool.id} onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)} className={`p-3 rounded-card border-2 transition-all flex flex-col items-center gap-1.5 ${activeTool === tool.id ? "border-gold-600 bg-gold-100/20 text-gold-600" : "border-transparent bg-xuan-aged/30 text-ink-500 hover:bg-xuan-aged/50"}`}>
                        {tool.icon}
                        <span className="text-xs">{tool.label}</span>
                      </button>
                    ))}
                  </div>
                  {handRaised && <div className="mt-4 p-3 bg-cinnabar/10 rounded-card border border-cinnabar/20 text-center"><span className="text-xs text-cinnabar animate-pulse">你已举手发言，等待老师点名...</span></div>}
                </div>

                {/* Quick Actions */}
                <div className="bg-xuan-white/95 backdrop-blur-sm rounded-card p-5 shadow-paper border border-gold-600/10">
                  <h3 className="text-sm font-semibold text-ink-900 mb-4">快捷操作</h3>
                  <div className="space-y-2.5">
                    <button onClick={() => setHandRaised(!handRaised)} className={`w-full py-2.5 px-3 rounded-btn text-xs font-medium transition-all flex items-center gap-2 border ${handRaised ? "bg-cinnabar/10 text-cinnabar border-cinnabar/20" : "bg-xuan-aged/30 text-ink-600 border-transparent hover:bg-xuan-aged/50"}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
                      {handRaised ? "放下举手" : "举手发言"}
                    </button>
                    <button className="w-full py-2.5 px-3 rounded-btn bg-xuan-aged/30 text-ink-600 text-xs font-medium hover:bg-xuan-aged/50 transition-all flex items-center gap-2 border border-transparent">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      下载课堂讲义
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === "quiz" && <QuizSection />}

          {/* Whiteboard Tab */}
          {activeTab === "whiteboard" && <WhiteboardSection />}
        </div>

        {/* End Class Button */}
        {onComplete && (
          <div className="mt-12 flex justify-center in-anim">
            <button
              onClick={onComplete}
              className="px-12 py-4 bg-ink-900 text-white rounded-btn tracking-wider font-title flex items-center gap-3 hover:bg-ink-800 transition-all shadow-lg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              结束课程，进入课后归档
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
