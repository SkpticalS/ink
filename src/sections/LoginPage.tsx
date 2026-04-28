import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".login-anim", { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleLogin = () => {
    if (!account.trim()) return;
    setAnimating(true);
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 0.5,
      ease: "power2.in",
      onComplete: onLogin,
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-xuan-warm relative overflow-hidden flex items-center justify-center">
      {/* Background layers */}
      <div className="absolute inset-0 z-0">
        <img src="/images/hero-ink-landscape.jpg" alt="" className="absolute top-0 left-0 w-full h-full object-cover opacity-[0.08]" />
        <img src="/images/plum-blossom.jpg" alt="" className="absolute top-0 right-0 w-[50%] h-[70%] object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-gradient-to-b from-xuan-warm via-xuan-warm/90 to-xuan-white" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="login-anim text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14">
              <img src="/images/seal-logo.png" alt="墨课" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <h1 className="font-lishu text-3xl text-ink-900 tracking-widest">墨课</h1>
              <p className="text-xs text-ink-400 tracking-[0.15em] mt-0.5">中国艺术学AI平台</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-gold-600/30" />
            <div className="w-2 h-2 rounded-full bg-gold-600/50" />
            <div className="w-12 h-px bg-gold-600/30" />
          </div>
        </div>

        {/* Login Card */}
        <div className="login-anim chinese-frame shadow-frame">
          <div className="chinese-frame-inner p-8">
            <h2 className="font-lishu text-2xl text-ink-900 text-center mb-8 tracking-widest">登入墨堂</h2>

            {/* Account */}
            <div className="mb-6">
              <label className="block text-sm text-ink-500 mb-2 font-medium">账号</label>
              <div className="ink-input">
                <input
                  type="text"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="请输入账号"
                  className="w-full bg-transparent py-3 text-ink-900 placeholder:text-ink-300 outline-none font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-8">
              <label className="block text-sm text-ink-500 mb-2 font-medium">密码</label>
              <div className="ink-input">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full bg-transparent py-3 text-ink-900 placeholder:text-ink-300 outline-none font-medium"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={animating}
              className="w-full py-3.5 bg-cinnabar text-white text-lg rounded-btn seal-btn tracking-widest font-lishu"
            >
              {animating ? "登入中..." : "登入"}
            </button>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-ink-400">
              <button className="hover:text-gold-600 transition-colors">忘记密码</button>
              <span className="w-px h-3 bg-ink-300/30" />
              <button className="hover:text-gold-600 transition-colors">注册新账号</button>
            </div>
          </div>
        </div>

        {/* Bottom seal */}
        <div className="login-anim mt-10 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-ink-300 tracking-widest">
            <span>以科技传艺道</span>
            <span className="w-1 h-1 rounded-full bg-gold-600/40" />
            <span>以墨笔育新人</span>
          </div>
        </div>
      </div>
    </div>
  );
}
