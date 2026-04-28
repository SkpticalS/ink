import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { DEMO_MESSAGES, DEMO_MEMBERS } from "../lib/data";

export default function InClassSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [handRaised, setHandRaised] = useState(false);
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

  const tools = [
    { id: "hand", label: "举手发言", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg> },
    { id: "barrage", label: "弹幕提问", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { id: "notes", label: "课堂笔记", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { id: "handout", label: "查看讲义", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  ];

  return (
    <div ref={sectionRef} className="relative min-h-screen py-24 px-4 md:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/images/window-lattice.jpg" alt="" className="w-full h-full object-cover opacity-[0.05]" />
        <div className="absolute inset-0 bg-gradient-to-b from-xuan-white via-transparent to-xuan-white" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-14 in-anim">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-cinnabar/40" />
            <div className="w-3 h-3 rounded-full bg-cinnabar/60" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-cinnabar/40" />
          </div>
          <h2 className="text-title text-ink-900 mb-3">课中互动</h2>
          <p className="text-annotation text-ink-500 tracking-[0.15em]">雅集论道 · 名师解惑</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Discussion */}
          <div className="lg:col-span-3 in-anim">
            <div className="bg-[#FFFDF8]/95 backdrop-blur-sm rounded-card shadow-paper h-[calc(100vh-280px)] min-h-[400px] flex flex-col border border-gold-600/10">
              <div className="p-4 border-b border-red-900/10 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-ink-900">主题讨论</h3>
                  <span className="text-xs text-ink-300">宋代山水画专题</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-stone-green animate-breathe" />
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={msg.id}
                    className={`${msg.role === "expert" ? "bg-gold-100/60 border-l-3 border-gold-600" : "bg-white border-l-3 border-ink-300/20"} rounded-card p-3 shadow-sm animate-float-in`}
                    style={{ animationDelay: `${idx * 50}ms`, transform: `rotate(${msg.role === "student" ? "0.3" : "-0.2"}deg)` }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${msg.role === "expert" ? "bg-gold-600 text-white" : "bg-xuan-aged text-ink-500"}`}>
                        {msg.avatar}
                      </div>
                      <span className="text-xs font-semibold text-ink-700">{msg.sender}</span>
                      <span className="text-xs text-ink-300 ml-auto">{msg.time}</span>
                    </div>
                    <p className="text-sm text-ink-700 leading-relaxed">{msg.content}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-ink-300/10">
                <div className="flex gap-2">
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="在此发言..."
                    className="flex-1 bg-transparent py-2.5 px-3 text-sm border-b-2 border-ink-300/20 focus:border-gold-600 outline-none transition-colors"
                  />
                  <button onClick={handleSend} className="w-10 h-10 flex-shrink-0 rounded-full bg-cinnabar text-white flex items-center justify-center hover:scale-110 transition-transform seal-btn shadow-seal">
                    <img src="/images/seal-send.png" alt="发送" className="w-5 h-5 object-contain" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="lg:col-span-6 in-anim">
            {/* Banner */}
            <div className="chinese-frame shadow-frame mb-6">
              <div className="chinese-frame-inner aspect-[21/9] relative overflow-hidden">
                <img src="/images/expert-video-bg.jpg" alt="" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink-900/40 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <p className="text-gold-300 text-xs tracking-widest">LIVE CLASS</p>
                  <p className="text-white text-sm tracking-wider">实时互动课堂</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="chinese-frame">
                <div className="chinese-frame-inner">
                  <div className="relative aspect-video bg-ink-900/5 overflow-hidden">
                    <img src="/images/expert-video-bg.jpg" alt="专家讲解" className="w-full h-full object-cover opacity-85" />
                    <div className="absolute inset-0 bg-ink-900/15 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-ink-pulse cursor-pointer hover:scale-110 transition-transform">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        </div>
                        <p className="text-white text-lg font-semibold tracking-wider" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>专家讲解中</p>
                        <p className="text-white/60 text-sm mt-1 tracking-widest">宋代山水画的写实与意境</p>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-xuan-white/90 backdrop-blur-sm px-4 py-2 rounded-card shadow-paper flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gold-600 text-white flex items-center justify-center text-sm font-bold">李</div>
                      <div><p className="text-sm font-semibold text-ink-900">李明德 教授</p><p className="text-xs text-ink-400">中央美术学院</p></div>
                      <img src="/images/seal-confirm.png" alt="" className="w-5 h-5 object-contain opacity-60 ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 px-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-400 font-mono">00:00</span>
                  <div className="flex-1 h-1.5 bg-xuan-aged rounded-full overflow-hidden relative">
                    <div className="h-full w-1/3 bg-gradient-to-r from-gold-600 to-gold-400 rounded-full relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-gold-600 rounded-full shadow-md border-2 border-xuan-white cursor-pointer hover:scale-150 transition-transform" />
                    </div>
                  </div>
                  <span className="text-xs text-ink-400 font-mono">45:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Members + Tools */}
          <div className="lg:col-span-3 space-y-6">
            <div className="in-anim bg-xuan-white/95 backdrop-blur-sm rounded-card p-5 shadow-paper border border-gold-600/10">
              <h3 className="text-sm font-semibold text-ink-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-gold-600 rounded-full" />
                同席学友
              </h3>
              <div className="space-y-3">
                {DEMO_MEMBERS.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all group-hover:scale-110 ${member.role === "主讲" ? "bg-gold-600 text-white shadow-md" : "bg-xuan-aged text-ink-500"}`}>
                        {member.name[0]}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-xuan-white ${member.online ? "bg-stone-green" : "bg-ink-300"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink-900 truncate group-hover:text-gold-600 transition-colors">{member.name}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-btn ${member.role === "主讲" ? "bg-gold-100 text-gold-600 font-medium" : "bg-xuan-aged text-ink-400"}`}>{member.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="in-anim bg-xuan-white/95 backdrop-blur-sm rounded-card p-5 shadow-paper border border-gold-600/10">
              <h3 className="text-sm font-semibold text-ink-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-gold-600 rounded-full" />
                互动工具
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => { setActiveTool(activeTool === tool.id ? null : tool.id); if (tool.id === "hand") setHandRaised(!handRaised); }}
                    className={`flex flex-col items-center gap-2 py-4 px-3 rounded-card border-2 transition-all duration-300 ${activeTool === tool.id ? "border-gold-600 bg-gold-100 text-gold-600 shadow-md" : "border-ink-300/15 text-ink-500 hover:border-gold-400 hover:text-ink-700 hover:bg-xuan-warm"}`}
                  >
                    {tool.icon}
                    <span className="text-xs font-medium">{tool.label}</span>
                  </button>
                ))}
              </div>
              {handRaised && (
                <div className="mt-3 p-3 bg-gold-100 rounded-card text-center text-xs text-gold-600 animate-float-in border border-gold-600/20">
                  <span className="inline-block w-2 h-2 bg-gold-600 rounded-full mr-2 animate-pulse" />
                  已举手，等待专家回应...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
