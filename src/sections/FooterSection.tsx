export default function FooterSection() {
  return (
    <footer className="relative bg-ink-900 text-xuan-white py-16 px-4 md:px-8 overflow-hidden">
      {/* Decorative top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 transition-transform hover:scale-110 hover:rotate-3 duration-300">
              <img src="/images/seal-logo.png" alt="墨课" className="w-full h-full object-contain brightness-200" />
            </div>
            <div>
              <span className="text-2xl font-bold text-xuan-white tracking-[0.15em]">墨课</span>
              <p className="text-xs text-ink-400 mt-1 tracking-widest">中国艺术学自主知识体系AI平台</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            {["关于我们", "使用帮助", "隐私政策", "联系合作"].map((link) => (
              <button key={link} className="text-sm text-ink-400 hover:text-gold-400 transition-colors duration-300 relative group">
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-600 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Decorative seal */}
          <div className="hidden md:flex gap-4">
            <div className="w-16 h-16 border-2 border-gold-600/30 rounded-sm flex items-center justify-center hover:border-gold-600/60 transition-colors duration-300 cursor-pointer group">
              <span className="text-gold-600/50 text-sm font-bold tracking-[0.1em] group-hover:text-gold-600/80 transition-colors" style={{ writingMode: "vertical-rl" }}>
                教学相长
              </span>
            </div>
            <div className="w-16 h-16 border-2 border-cinnabar/20 rounded-full flex items-center justify-center hover:border-cinnabar/50 transition-colors duration-300 cursor-pointer group">
              <span className="text-cinnabar/40 text-sm font-bold group-hover:text-cinnabar/70 transition-colors">
                墨
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-ink-700/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-500 tracking-wider">© 2026 墨课平台 · 以科技传艺道</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-gold-600/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold-600/40" />
            <div className="w-8 h-px bg-gold-600/30" />
          </div>
        </div>
      </div>
    </footer>
  );
}
