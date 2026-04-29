import { useState } from "react";

type QuestionType = "single" | "multiple" | "essay";

interface QuizQuestion {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: number[];
  explanation: string;
}

const DEMO_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: "single",
    question: "范宽的代表作《溪山行旅图》采用的是哪种皴法？",
    options: ["披麻皴", "雨点皴", "斧劈皴", "卷云皴"],
    correctAnswer: [1],
    explanation: "范宽开创了\"雨点皴\"（又称\"豆瓣皴\"），以密集的点状笔触表现山石的坚硬质感和体积感。",
  },
  {
    id: 2,
    type: "single",
    question: "郭熙提出的\"三远法\"不包括以下哪一项？",
    options: ["高远", "深远", "平远", "幽远"],
    correctAnswer: [3],
    explanation: "三远法包括：高远（自山下而仰山巅）、深远（自山前而窥山后）、平远（自近山而望远山）。",
  },
  {
    id: 3,
    type: "multiple",
    question: "以下哪些是南宋\"边角构图\"的特点？（多选）",
    options: [
      "画面集中在画面一角",
      "大面积留白",
      "追求写实全景",
      "强调诗意抒情",
    ],
    correctAnswer: [0, 1, 3],
    explanation: "边角构图的特点是画面集中在一角或半边、大面积留白、强调诗意抒情。全景式写实是北宋的特点。",
  },
  {
    id: 4,
    type: "essay",
    question: "请简述北宋山水画的写实主义特征及其成因。",
    explanation: "北宋山水画强调\"师法自然\"，注重对自然山川的真实描绘。成因包括：宫廷画院制度的推动、理学\"格物致知\"思想的影响、以及画家深入自然写生的传统。",
  },
];

interface QuizSectionProps {
  onComplete?: () => void;
}

export default function QuizSection({ onComplete }: QuizSectionProps) {
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [essays, setEssays] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [expandedExplanation, setExpandedExplanation] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const handleSelect = (questionId: number, optionIndex: number, isMultiple: boolean) => {
    if (submitted) return;
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (isMultiple) {
        const exists = current.includes(optionIndex);
        return { ...prev, [questionId]: exists ? current.filter(i => i !== optionIndex) : [...current, optionIndex] };
      }
      return { ...prev, [questionId]: [optionIndex] };
    });
  };

  const handleSubmit = () => {
    let correct = 0;
    let totalGradable = 0;
    DEMO_QUESTIONS.forEach(q => {
      if (q.type === "essay") return;
      totalGradable++;
      const ans = answers[q.id] || [];
      if (q.correctAnswer && JSON.stringify(ans.sort()) === JSON.stringify([...q.correctAnswer].sort())) {
        correct++;
      }
    });
    setScore(totalGradable > 0 ? Math.round((correct / totalGradable) * 100) : 0);
    setSubmitted(true);
  };

  const isCorrect = (q: QuizQuestion): boolean | null => {
    if (!submitted || q.type === "essay" || !q.correctAnswer) return null;
    const ans = answers[q.id] || [];
    return JSON.stringify(ans.sort()) === JSON.stringify([...q.correctAnswer].sort());
  };

  const isOptionCorrect = (q: QuizQuestion, optIdx: number): boolean | null => {
    if (!submitted || !q.correctAnswer) return null;
    return q.correctAnswer.includes(optIdx);
  };

  const isOptionSelected = (qId: number, optIdx: number): boolean => {
    return (answers[qId] || []).includes(optIdx);
  };

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-chapter text-ink-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-cinnabar rounded-full" />
            课堂测验
          </h3>
          <p className="text-xs text-ink-400 mt-1">共 {DEMO_QUESTIONS.length} 题 · AI 实时判分</p>
        </div>
        {score !== null && (
          <div className={`px-4 py-2 rounded-card font-title text-lg ${score >= 60 ? "bg-stone-green/10 text-stone-green border border-stone-green/20" : "bg-cinnabar/10 text-cinnabar border border-cinnabar/20"}`}>
            {score >= 60 ? "通过" : "未通过"} · {score}分
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {DEMO_QUESTIONS.map((q, qIdx) => {
          const correct = isCorrect(q);
          return (
            <div
              key={q.id}
              className={`bg-xuan-white/95 backdrop-blur-sm rounded-card p-6 shadow-paper border transition-all duration-300 ${
                correct === true ? "border-stone-green/30" : correct === false ? "border-cinnabar/30" : "border-gold-600/10"
              }`}
            >
              {/* Question header */}
              <div className="flex items-start gap-3 mb-4">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  correct === true ? "bg-stone-green text-white" : correct === false ? "bg-cinnabar text-white" : "bg-gold-600/10 text-gold-600"
                }`}>
                  {correct === true ? "✓" : correct === false ? "✗" : qIdx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-base text-ink-900 leading-relaxed">{q.question}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-btn bg-xuan-aged text-ink-400">
                    {q.type === "single" ? "单选题" : q.type === "multiple" ? "多选题" : "简答题"}
                  </span>
                </div>
              </div>

              {/* Options */}
              {q.options && (
                <div className="space-y-2 ml-10">
                  {q.options.map((opt, optIdx) => {
                    const selected = isOptionSelected(q.id, optIdx);
                    const optCorrect = isOptionCorrect(q, optIdx);
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(q.id, optIdx, q.type === "multiple")}
                        disabled={submitted}
                        className={`w-full text-left px-4 py-3 rounded-card border-2 transition-all duration-300 flex items-center gap-3 ${
                          optCorrect === true
                            ? "border-stone-green bg-stone-green/5"
                            : optCorrect === false && selected
                            ? "border-cinnabar bg-cinnabar/5"
                            : selected
                            ? "border-gold-600 bg-gold-100/30"
                            : "border-transparent bg-xuan-aged/30 hover:bg-xuan-aged/50"
                        } ${submitted ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                          optCorrect === true
                            ? "border-stone-green bg-stone-green text-white"
                            : optCorrect === false && selected
                            ? "border-cinnabar bg-cinnabar text-white"
                            : selected
                            ? "border-gold-600 bg-gold-600 text-white"
                            : "border-ink-300"
                        }`}>
                          {optCorrect === true ? "✓" : optCorrect === false && selected ? "✗" : String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className={`text-sm ${
                          optCorrect === true ? "text-stone-green font-medium" : optCorrect === false && selected ? "text-cinnabar" : "text-ink-700"
                        }`}>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Essay input */}
              {q.type === "essay" && (
                <div className="ml-10">
                  <textarea
                    value={essays[q.id] || ""}
                    onChange={e => setEssays(prev => ({ ...prev, [q.id]: e.target.value }))}
                    disabled={submitted}
                    placeholder="请输入你的答案..."
                    className="w-full h-32 p-4 rounded-card border border-gold-600/15 bg-xuan-aged/20 text-sm text-ink-700 placeholder:text-ink-300 resize-none focus:outline-none focus:border-gold-600/40 transition-colors"
                  />
                </div>
              )}

              {/* Explanation */}
              {submitted && q.explanation && (
                <div className="mt-4 ml-10">
                  <button
                    onClick={() => setExpandedExplanation(expandedExplanation === q.id ? null : q.id)}
                    className="text-xs text-gold-600 hover:text-gold-700 flex items-center gap-1.5 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    {expandedExplanation === q.id ? "收起解析" : "查看解析"}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${expandedExplanation === q.id ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  {expandedExplanation === q.id && (
                    <div className="mt-2 p-4 bg-gold-100/30 rounded-card border border-gold-600/10 text-sm text-ink-600 leading-relaxed">
                      {q.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit */}
      <div className="mt-8 flex items-center justify-between">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-cinnabar text-white rounded-btn tracking-wider font-chapter flex items-center gap-2 hover:bg-cinnabar/90 transition-all seal-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            提交作答
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium ${score! >= 60 ? "text-stone-green" : "text-cinnabar"}`}>
              {score! >= 60 ? "恭喜通过！" : "继续努力！"}
            </span>
            {onComplete && (
              <button
                onClick={onComplete}
                className="px-6 py-2.5 bg-ink-900 text-white rounded-btn text-sm hover:bg-ink-800 transition-all flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                继续课堂
              </button>
            )}
          </div>
        )}
        {submitted && (
          <button
            onClick={() => { setSubmitted(false); setScore(null); setAnswers({}); setEssays({}); setExpandedExplanation(null); }}
            className="px-4 py-2 text-sm text-ink-500 hover:text-gold-600 transition-colors border border-ink-300/20 rounded-btn hover:bg-xuan-aged"
          >
            重新答题
          </button>
        )}
      </div>
    </div>
  );
}
