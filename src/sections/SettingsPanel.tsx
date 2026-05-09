import { useState } from "react";
import type { JSX } from "react";

interface SettingsPanelProps {
  onClose: () => void;
}

type SettingTab = "llm" | "tts" | "asr" | "display";

const LLM_PROVIDERS = [
  { id: "openai", name: "OpenAI", models: ["gpt-4o", "gpt-4o-mini"] },
  { id: "anthropic", name: "Anthropic", models: ["claude-sonnet-4", "claude-haiku-4"] },
  { id: "google", name: "Google Gemini", models: ["gemini-3-flash", "gemini-3.1-pro"] },
  { id: "deepseek", name: "DeepSeek", models: ["deepseek-chat", "deepseek-reasoner"] },
];

const TTS_VOICES = [
  { id: "zh-female-1", name: "女声-清雅", desc: "温柔知性" },
  { id: "zh-male-1", name: "男声-沉稳", desc: "成熟稳重" },
  { id: "zh-female-2", name: "女声-灵动", desc: "活泼轻快" },
  { id: "zh-male-2", name: "男声-儒雅", desc: "学者气质" },
];

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [tab, setTab] = useState<SettingTab>("llm");
  const [provider, setProvider] = useState("google");
  const [model, setModel] = useState("gemini-3-flash");
  const [apiKey, setApiKey] = useState("");
  const [voice, setVoice] = useState("zh-female-1");
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<"zh" | "en">("zh");

  const tabs: { id: SettingTab; label: string; icon: JSX.Element }[] = [
    { id: "llm", label: "AI 模型", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> },
    { id: "tts", label: "语音合成", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> },
    { id: "asr", label: "语音识别", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg> },
    { id: "display", label: "显示", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onClose} ></div>

      {/* Panel */}
      <div className="relative bg-xuan-white rounded-card shadow-2xl border border-gold-600/15 w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold-600/10">
          <h3 className="text-lg font-bold text-ink-900 tracking-wider">设置</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-xuan-aged flex items-center justify-center text-ink-400 hover:text-ink-700 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar tabs */}
          <div className="w-44 border-r border-gold-600/10 py-4 flex-shrink-0">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full text-left px-5 py-3 text-sm transition-all flex items-center gap-2.5 ${
                  tab === t.id ? "text-gold-600 bg-gold-100/30 border-r-2 border-gold-600 font-medium" : "text-ink-500 hover:text-ink-700 hover:bg-xuan-aged/30"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* LLM Tab */}
            {tab === "llm" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-ink-900 mb-4">大语言模型服务商</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {LLM_PROVIDERS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setProvider(p.id); setModel(p.models[0]); }}
                        className={`p-4 rounded-card border-2 text-left transition-all ${
                          provider === p.id ? "border-gold-600 bg-gold-100/20" : "border-gold-600/10 bg-xuan-aged/20 hover:bg-xuan-aged/40"
                        }`}
                      >
                        <p className="text-sm font-medium text-ink-900">{p.name}</p>
                        <p className="text-xs text-ink-400 mt-1">{p.models.length} 个模型</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-ink-900 mb-3">模型选择</h4>
                  <select
                    value={model}
                    onChange={e => setModel(e.target.value)}
                    className="w-full p-3 rounded-card border border-gold-600/15 bg-xuan-aged/20 text-sm text-ink-900 focus:outline-none focus:border-gold-600/40"
                  >
                    {LLM_PROVIDERS.find(p => p.id === provider)?.models.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  {provider === "google" && model === "gemini-3-flash" && (
                    <p className="text-xs text-stone-green mt-2 flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      推荐：效果与速度的最佳平衡
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-ink-900 mb-3">API Key</h4>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full p-3 rounded-card border border-gold-600/15 bg-xuan-aged/20 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-gold-600/40"
                  />
                  <p className="text-xs text-ink-400 mt-2">API Key 仅保存在本地，不会上传到服务器。</p>
                </div>
              </div>
            )}

            {/* TTS Tab */}
            {tab === "tts" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-ink-900 mb-4">AI 讲师音色</h4>
                  <div className="space-y-3">
                    {TTS_VOICES.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setVoice(v.id)}
                        className={`w-full p-4 rounded-card border-2 text-left transition-all flex items-center gap-3 ${
                          voice === v.id ? "border-gold-600 bg-gold-100/20" : "border-transparent bg-xuan-aged/20 hover:bg-xuan-aged/40"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${voice === v.id ? "bg-gold-600 text-white" : "bg-xuan-aged text-ink-400"}`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink-900">{v.name}</p>
                          <p className="text-xs text-ink-400">{v.desc}</p>
                        </div>
                        {voice === v.id && (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-auto text-gold-600"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-ink-900 mb-3">语速</h4>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-ink-400">慢</span>
                    <input
                      type="range" min="0.5" max="2" step="0.1"
                      value={voiceSpeed}
                      onChange={e => setVoiceSpeed(Number(e.target.value))}
                      className="flex-1 accent-gold-600"
                    />
                    <span className="text-xs text-ink-400">快</span>
                    <span className="text-xs text-gold-600 font-mono w-8">{voiceSpeed.toFixed(1)}x</span>
                  </div>
                </div>
              </div>
            )}

            {/* ASR Tab */}
            {tab === "asr" && (
              <div className="space-y-6">
                <div className="p-6 rounded-card bg-xuan-aged/20 border border-gold-600/10 text-center">
                  <div className="w-16 h-16 rounded-full bg-xuan-aged mx-auto mb-4 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-600"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                  </div>
                  <p className="text-sm text-ink-900 font-medium mb-1">语音识别</p>
                  <p className="text-xs text-ink-400 mb-4">通过麦克风与 AI 讲师对话</p>
                  <button className="px-6 py-2.5 bg-cinnabar text-white rounded-btn text-sm hover:bg-cinnabar/90 transition-all flex items-center gap-2 mx-auto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                    开启麦克风
                  </button>
                </div>
                <p className="text-xs text-ink-400 text-center">语音数据仅用于实时转录，不会存储。</p>
              </div>
            )}

            {/* Display Tab */}
            {tab === "display" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-ink-900 mb-4">界面语言</h4>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setLang("zh")}
                      className={`px-5 py-2.5 rounded-card border-2 text-sm transition-all ${
                        lang === "zh" ? "border-gold-600 bg-gold-100/20 text-ink-900" : "border-transparent bg-xuan-aged/20 text-ink-500"
                      }`}
                    >
                      简体中文
                    </button>
                    <button
                      onClick={() => setLang("en")}
                      className={`px-5 py-2.5 rounded-card border-2 text-sm transition-all ${
                        lang === "en" ? "border-gold-600 bg-gold-100/20 text-ink-900" : "border-transparent bg-xuan-aged/20 text-ink-500"
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-ink-900 mb-4">主题</h4>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDarkMode(false)}
                      className={`p-4 rounded-card border-2 text-left transition-all w-32 ${
                        !darkMode ? "border-gold-600" : "border-transparent"
                      }`}
                    >
                      <div className="w-full h-12 rounded-card bg-xuan-white border border-gold-600/10 mb-2" ></div>
                      <p className="text-xs text-ink-700">浅色</p>
                    </button>
                    <button
                      onClick={() => setDarkMode(true)}
                      className={`p-4 rounded-card border-2 text-left transition-all w-32 ${
                        darkMode ? "border-gold-600" : "border-transparent"
                      }`}
                    >
                      <div className="w-full h-12 rounded-card bg-ink-900 border border-ink-700 mb-2" ></div>
                      <p className="text-xs text-ink-700">深色</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gold-600/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm text-ink-500 hover:text-ink-700 transition-colors rounded-btn hover:bg-xuan-aged"
          >
            取消
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm bg-gold-600 text-white rounded-btn hover:bg-gold-700 transition-all"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}
