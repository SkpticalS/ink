import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

interface LobbyPageProps {
  onEnterClassroom: () => void;
}

const demoClassrooms = [
  { id: 1, name: "宋代山水画鉴赏", topic: "探讨宋代山水画的写实与意境", status: "进行中", students: 12, code: "SONG23" },
  { id: 2, name: "元代文人画研究", topic: "元四家艺术风格比较分析", status: "等待中", students: 5, code: "YUAN45" },
  { id: 3, name: "中国花鸟画入门", topic: "工笔与写意技法基础", status: "进行中", students: 28, code: "BIRD78" },
];

export default function LobbyPage({ onEnterClassroom }: LobbyPageProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [goal, setGoal] = useState("");
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".lobby-anim", { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out", delay: 0.15 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleCreate = () => {
    setAnimating(true);
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 0.5,
      ease: "power2.in",
      onComplete: onEnterClassroom,
    });
  };

  const handleJoin = () => {
    setAnimating(true);
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 0.5,
      ease: "power2.in",
      onComplete: onEnterClassroom,
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-xuan-warm relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/images/window-lattice.jpg" alt="" className="absolute top-0 left-0 w-full h-full object-cover opacity-[0.04]" />
        <div className="absolute inset-0 bg-gradient-to-b from-xuan-warm via-xuan-warm/95 to-xuan-white" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="lobby-anim mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10">
                <img src="/images/seal-logo.png" alt="墨课" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="font-title text-ink-900 tracking-widest">墨课</h1>
                <p className="text-xs text-ink-400 tracking-wider">在线课堂大厅</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-btn bg-xuan-aged/60 hover:bg-xuan-aged text-ink-500 hover:text-ink-700 transition-all text-sm border border-gold-600/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                课程记录
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-btn bg-cinnabar/10 hover:bg-cinnabar/20 text-cinnabar hover:text-cinnabar transition-all text-sm border border-cinnabar/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                登出
              </button>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="lobby-anim mb-8">
          <div className="bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gold-600/10 border-2 border-gold-600/30 flex items-center justify-center text-xl text-gold-600 font-title">
                罗
              </div>
              <div>
                <p className="text-xs text-ink-400 mb-0.5">登录用户</p>
                <p className="font-title text-xl text-ink-900 tracking-wider">罗文韬</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-ink-400">
              <span className="w-2 h-2 rounded-full bg-stone-green" />
              在线
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Create Classroom */}
          <div className="lg:col-span-5 lobby-anim">
            <div className="bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10 h-full">
              <h3 className="font-title text-xl text-ink-900 mb-6 flex items-center gap-2 tracking-wider">
                <span className="w-6 h-6 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-sm">+</span>
                新建教室
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-ink-500 mb-2 font-medium">教室标题</label>
                  <div className="ink-input">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="请输入教室标题"
                      className="w-full bg-transparent py-3 text-ink-900 placeholder:text-ink-300 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-ink-500 mb-2 font-medium">教室简介</label>
                  <div className="ink-input">
                    <textarea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="请输入教室简介"
                      rows={3}
                      className="w-full bg-transparent py-3 text-ink-900 placeholder:text-ink-300 outline-none resize-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-ink-500 mb-2 font-medium">探讨目标</label>
                  <div className="ink-input">
                    <textarea
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="请输入探讨目标"
                      rows={2}
                      className="w-full bg-transparent py-3 text-ink-900 placeholder:text-ink-300 outline-none resize-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleCreate}
                  disabled={animating}
                  className="w-full py-3.5 bg-gold-600 text-white text-base rounded-btn gold-btn tracking-wider font-title flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  创建并进入教室
                </button>
              </div>
            </div>
          </div>

          {/* Right: Classroom List */}
          <div className="lg:col-span-7 lobby-anim">
            <div className="bg-xuan-white/90 backdrop-blur-sm rounded-card p-6 shadow-paper border border-gold-600/10 h-full">
              <h3 className="font-title text-xl text-ink-900 mb-6 flex items-center gap-2 tracking-wider">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-600"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                在线教室列表
              </h3>

              <div className="space-y-4">
                {demoClassrooms.map((room) => (
                  <div
                    key={room.id}
                    className="relative bg-xuan-aged/30 rounded-card p-5 hover:bg-xuan-aged/50 transition-all duration-300 border border-transparent hover:border-gold-600/20 card-lift"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-chapter text-lg text-ink-900 tracking-wider">{room.name}</h4>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full ${room.status === "进行中" ? "bg-stone-green/15 text-stone-green" : "bg-gold-600/15 text-gold-600"}`}>
                            {room.status}
                          </span>
                        </div>
                        <p className="text-sm text-ink-500 mb-3">{room.topic || "暂无简介"}</p>
                        <div className="flex items-center gap-4 text-xs text-ink-400">
                          <span className="flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                            {room.students} 名同学在课堂中
                          </span>
                          <span className="flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            邀请码: <span className="text-gold-600 font-mono">{room.code}</span>
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleJoin}
                        className="flex-shrink-0 px-5 py-2.5 bg-cinnabar/10 hover:bg-cinnabar text-cinnabar hover:text-white rounded-btn transition-all duration-300 text-sm font-medium tracking-wider seal-btn border border-cinnabar/20 hover:border-cinnabar"
                      >
                        加入教室
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
