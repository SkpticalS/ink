import { useState, useEffect, useRef } from "react";
import type { JSX } from "react";
import gsap from "gsap";
import type { Message, Member } from "../lib/data";
import SlidesPlayer from "./SlidesPlayer";
import QuizSection from "./QuizSection";
import WhiteboardSection from "./WhiteboardSection";
import SettingsPanel from "./SettingsPanel";
import VideoConference from "./VideoConference";

interface InClassSectionProps {
  onComplete?: () => void;
  messages?: Message[];
  members?: Member[];
  participants?: import('../lib/data').VideoParticipant[];
}

type ClassTab = "slides" | "discussion" | "quiz" | "whiteboard";

type ExpertStatus = "pending" | "approved" | "rejected";

/* ─── Demo data ─── */
const DEMO_MESSAGES: Message[] = [
  { id: 1, sender: "系统", avatar: "系", role: "system", content: "欢迎来到「宋代山水画赏析」课堂。AI讲师已就绪，课件已生成。", time: "14:00" },
  { id: 2, sender: "李老师", avatar: "李", role: "teacher", content: "同学们好，今天我们来赏析宋代山水画的巅峰之作。首先请大家看第一页幻灯片——宋代山水画的整体概述。", time: "14:01" },
  { id: 3, sender: "AI讲师", avatar: "AI", role: "ai", content: "补充一点：北宋山水画以'全景式'构图著称，画家常将人物置于宏大的自然景观之中，体现出'天人合一'的哲学思想。代表画家有范宽、郭熙等。", time: "14:02" },
  { id: 4, sender: "张小雨", avatar: "张", role: "student", content: "请问老师，范宽的《溪山行旅图》为什么被称为北宋山水第一？", time: "14:03" },
  { id: 5, sender: "李老师", avatar: "李", role: "teacher", content: "好问题！《溪山行旅图》之所以被推为北宋山水第一，主要有三点：一是构图雄伟，主峰占据画面三分之二；二是笔墨浑厚，雨点皴的技法出神入化；三是意境深远，商旅行于山脚下的细节更衬托出山之巍峨。", time: "14:04" },
  { id: 6, sender: "王诗涵", avatar: "王", role: "student", content: "我注意到画中的小人只在山脚，这是不是体现了'丈山尺树，寸马分人'的比例法则？", time: "14:05" },
  { id: 7, sender: "AI讲师", avatar: "AI", role: "ai", content: "正是！郭熙在《林泉高致》中提出的'三远法'——高远、深远、平远，正是对这种空间处理的理论总结。范宽此作正是'高远'之法的典范。", time: "14:06" },
];

const DEMO_MEMBERS: Member[] = [
  { id: 1, name: "李老师", role: "teacher", online: true, avatar: "李" },
  { id: 2, name: "AI讲师", role: "ai", online: true, avatar: "AI" },
  { id: 3, name: "张小雨", role: "student", online: true, avatar: "张" },
  { id: 4, name: "王诗涵", role: "student", online: true, avatar: "王" },
  { id: 5, name: "陈明远", role: "student", online: true, avatar: "陈" },
  { id: 6, name: "赵文静", role: "student", online: false, avatar: "赵" },
];

export default function InClassSection({ onComplete, messages: propMessages, members: propMembers }: InClassSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<ClassTab>("slides");
  const [showVideo, setShowVideo] = useState(false);
  const [showFloatingPanel, setShowFloatingPanel] = useState(false);
  const [messages, setMessages] = useState<Message[]>(propMessages || DEMO_MESSAGES);
  const allMembers = propMembers || DEMO_MEMBERS;
  const [inputValue, setInputValue] = useState("");
  const [showSettings, setShowSettings] = useState(false);
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
      setShowVideo(true);
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
        <div className="absolute inset-0 bg-gradient-to-b from-xuan-white via-transparent to-xuan-white" ></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Title */}
        <div className="text-center mb-8 in-anim">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-cinnabar/40" ></div>
            <div className="w-3 h-3 rounded-full bg-cinnabar/60" ></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-cinnabar/40" ></div>
          </div>
          <h2 className="font-title text-ink-900 mb-2">课中互动</h2>
          <p className="font-annotation text-ink-500 tracking-[0.15em]">雅集论道 · 名师解惑</p>
        </div>

        {/* Expert Requests Banner */}
        {expertRequests.some(e => e.status === "pending") && (
          <div className="mb-6 in-anim">
            <div className="bg-gradient-to-r from-cinnabar/5 to-gold-100/20 backdrop-blur-sm rounded-card p-5 shadow-paper border border-cinnabar/15">
              <h3 className="text-sm font-semibold text-ink-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-cinnabar rounded-full" ></span>
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
        {activeExperts.length > 0 && !showVideo && (
          <div className="mb-4 in-anim">
            <button
              onClick={() => setShowVideo(true)}
              className="w-full py-2.5 rounded-card bg-gradient-to-r from-ink-800 to-ink-900 text-white text-sm flex items-center justify-center gap-2 hover:from-ink-700 hover:to-ink-800 transition-all"
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
            <div className="flex-1" ></div>
            {/* Video toggle — only on slides tab */}
            {activeTab === "slides" && (
              <button
                onClick={() => setShowVideo(!showVideo)}
                className={`px-2.5 py-1.5 rounded-btn text-xs transition-all flex items-center gap-1 mr-1 ${showVideo ? "bg-ink-800 text-white" : "text-ink-500 hover:text-ink-700 hover:bg-xuan-aged/50"}`}
                title="视频会议"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                视频
              </button>
            )}
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* SlidesPlayer + floating panel — left side */}
              <div className="lg:col-span-9 relative">
                <SlidesPlayer />

                {/* Floating AI tutor / export panel */}
                <div className={`absolute bottom-4 right-4 z-20 transition-all duration-300 ${showFloatingPanel ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0 pointer-events-none"}`}>
                  <div className="bg-xuan-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-gold-600/15 w-56">
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-ink-700 mb-3 flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-600"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>AI 讲师
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gold-600 text-white flex items-center justify-center text-xs font-bold">AI</div>
                        <div>
                          <p className="text-xs font-medium text-ink-900">AI 讲师</p>
                          <p className="text-[10px] text-ink-400">课件讲解中</p>
                        </div>
                      </div>
                      <button className="w-full py-1.5 rounded-btn text-xs font-medium bg-gold-600 text-white hover:bg-gold-700 transition-all flex items-center justify-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>播放讲解
                      </button>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-ink-700 mb-2">导出</h4>
                      <div className="space-y-1.5">
                        <button className="w-full py-1.5 px-2.5 rounded-btn bg-xuan-aged/60 text-ink-600 text-xs hover:bg-xuan-aged transition-all flex items-center gap-2 border border-gold-600/10">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          下载 PPTX
                        </button>
                        <button className="w-full py-1.5 px-2.5 rounded-btn bg-xuan-aged/60 text-ink-600 text-xs hover:bg-xuan-aged transition-all flex items-center gap-2 border border-gold-600/10">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          导出 HTML
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating panel toggle */}
                <button
                  onClick={() => setShowFloatingPanel(!showFloatingPanel)}
                  className={`absolute bottom-4 right-4 z-30 w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                    showFloatingPanel ? "bg-ink-900 text-white rotate-45" : "bg-xuan-white text-ink-500 hover:bg-gold-600 hover:text-white"
                  }`}
                  title={showFloatingPanel ? "收起" : "AI讲师 & 导出"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>

              {/* Video column — right side, vertical list of 4:3 tiles */}
              <div className="lg:col-span-3">
                <div className="bg-ink-900 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">视频会议</span>
                    {showVideo && (
                      <button onClick={() => setShowVideo(false)} className="text-xs text-slate-500 hover:text-cinnabar transition-colors">收起</button>
                    )}
                  </div>
                  {showVideo ? (
                    <VideoConference />
                  ) : (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="w-full py-8 rounded-xl border-2 border-dashed border-slate-700 hover:border-gold-600/40 transition-all flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-gold-400"
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                      <span className="text-xs">开启视频会议</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "discussion" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-12">
                <div className="bg-xuan-white/95 backdrop-blur-sm rounded-card shadow-paper border border-gold-600/10 h-[600px] flex flex-col">
                  <div className="p-5 border-b border-gold-600/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-chapter text-ink-900">讨论区</h3>
                        <p className="text-xs text-ink-400 mt-1">{messages.length} 条消息 · {allMembers.filter(m => m.online).length} 人在线</p>
                      </div>
                      <div className="flex -space-x-2">
                        {allMembers.filter(m => m.online).slice(0, 4).map(m => (
                          <div key={m.id} className="w-8 h-8 rounded-full bg-xuan-aged border-2 border-xuan-white flex items-center justify-center text-xs text-ink-500 font-bold">{m.name[0]}</div>
                        ))}
                        {allMembers.filter(m => m.online).length > 4 && (
                          <div className="w-8 h-8 rounded-full bg-gold-600 border-2 border-xuan-white flex items-center justify-center text-xs text-white font-bold">+{allMembers.filter(m => m.online).length - 4}</div>
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
                    <div ref={messagesEndRef}></div>
                  </div>
                  <div className="p-5 border-t border-gold-600/10">
                    <div className="flex gap-3">
                      <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="输入消息..." className="flex-1 px-4 py-3 rounded-card border border-gold-600/15 bg-xuan-aged/20 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-gold-600/40 transition-colors" />
                      <button onClick={handleSend} className="px-5 py-3 bg-gold-600 text-white rounded-btn hover:bg-gold-700 transition-all text-sm font-medium">发送</button>
                    </div>
                  </div>
              </div>
            </div>
            </div>
          )}

          {activeTab === "quiz" && <QuizSection />}
          {activeTab === "whiteboard" && <WhiteboardSection />}
        </div>

        {/* End Class */}
        {onComplete && (
          <div className="mt-10 flex justify-center in-anim">
            <button onClick={onComplete} className="px-8 py-2.5 bg-ink-900 text-white rounded-btn text-sm tracking-wider flex items-center gap-2 hover:bg-ink-800 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              结束课程，进入课后归档
            </button>
          </div>
        )}
      </div>
    </div>
  );
}