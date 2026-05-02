import { useState } from "react";
import type { QuizQuestion } from "../lib/data";

interface QuizSectionProps {
  questions?: QuizQuestion[];
  onComplete?: () => void;
}

/* ─── Demo quiz questions ─── */
const DEMO_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: "single",
    question: "范宽的代表作《溪山行旅图》主要采用了哪种构图方法？",
    options: ["平远法", "深远法", "高远法", "全景法"],
    correctAnswer: [2],
    explanation: "《溪山行旅图》采用'高远法'构图，主峰巍峨耸立于画面上部，占据画面三分之二的空间，体现出'大山堂堂'的气势。郭熙在《林泉高致》中提出的'三远法'包括高远、深远和平远，范宽此作是高远法的典范。",
  },
  {
    id: 2,
    type: "multiple",
    question: "以下哪些是北宋山水画的主要特征？（多选）",
    options: ["全景式构图", "雨点皴技法", "边角式留白", "水墨写意", "气势雄伟的主峰"],
    correctAnswer: [0, 1, 4],
    explanation: "北宋山水画以全景式构图、皴法技法的成熟运用和雄伟气势为主要特征。'边角式留白'是南宋马远、夏圭的风格特征，'水墨写意'更多与元代文人画相关。",
  },
  {
    id: 3,
    type: "single",
    question: "被称为'马一角'的画家是谁？",
    options: ["马远", "马麟", "夏圭", "李唐"],
    correctAnswer: [0],
    explanation: "马远（约1140—1225年）因善用边角构图，画面常从一角展开，人称'马一角'。他与被称为'夏半边'的夏圭共同代表了南宋山水画的风格特征。",
  },
  {
    id: 4,
    type: "essay",
    question: "请简要论述北宋与南宋山水画在构图上的主要差异，并举例说明。（不少于100字）",
    explanation: "参考答案：北宋山水画以'全景式'构图为主要特征，画面气势恢宏，主峰占据主体位置，如范宽《溪山行旅图》。画家注重写实，追求'可游可居'的空间感。南宋山水画则转向'边角式'构图，以马远、夏圭为代表，画面多从一角展开，大量运用留白，营造出空灵含蓄的意境。这种转变与南宋偏安江南的政治背景及文人审美趣味的变化密切相关。",
  },
];

export default function QuizSection({ questions: propQuestions, onComplete }: QuizSectionProps) {
  const questions = propQuestions && propQuestions.length > 0 ? propQuestions : DEMO_QUESTIONS;
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [essays, setEssays] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [expandedExplanation, setExpandedExplanation] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const handleSelect = (qId: number, optIdx: number, isMultiple: boolean) => {
    if (submitted) return;
    setAnswers(prev => {
      const current = prev[qId] || [];
      if (isMultiple) {
        const exists = current.includes(optIdx);
        return { ...prev, [qId]: exists ? current.filter(i => i !== optIdx) : [...current, optIdx] };
      }
      return { ...prev, [qId]: [optIdx] };
    });
  };

  const handleSubmit = () => {
    let correct = 0, totalGradable = 0;
    questions.forEach(q => {
      if (q.type === "essay") return;
      totalGradable++;
      const ans = answers[q.id] || [];
      if (q.correctAnswer && JSON.stringify(ans.sort()) === JSON.stringify([...q.correctAnswer].sort())) correct++;
    });
    setScore(totalGradable > 0 ? Math.round((correct / totalGradable) * 100) : 0);
    setSubmitted(true);
  };

  const isCorrect = (q: QuizQuestion): boolean | null => {
    if (!submitted || q.type === "essay" || !q.correctAnswer) return null;
    return JSON.stringify((answers[q.id] || []).sort()) === JSON.stringify([...q.correctAnswer].sort());
  };
  const isOptionCorrect = (q: QuizQuestion, optIdx: number): boolean | null => {
    if (!submitted || !q.correctAnswer) return null;
    return q.correctAnswer.includes(optIdx);
  };
  const isOptionSelected = (qId: number, optIdx: number) => (answers[qId] || []).includes(optIdx);

  // Empty state
  if (questions.length === 0) {
    return (
      <div className="w-full">
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-xuan-aged flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-400"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <p className="text-ink-500 text-base mb-1">暂无测验题目</p>
          <p className="text-ink-300 text-sm">课件生成后，AI 将自动创建课堂测验</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-chapter text-ink-900 flex items-center gap-2"><span className="w-1.5 h-6 bg-cinnabar rounded-full" ></span>课堂测验</h3>
          <p className="text-xs text-ink-400 mt-1">共 {questions.length} 题 · AI 实时判分</p>
        </div>
        {score !== null && <div className={`px-4 py-2 rounded-card font-title text-lg ${score >= 60 ? "bg-stone-green/10 text-stone-green border border-stone-green/20" : "bg-cinnabar/10 text-cinnabar border border-cinnabar/20"}`}>{score >= 60 ? "通过" : "未通过"} · {score}分</div>}
      </div>
      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const correct = isCorrect(q);
          return (
            <div key={q.id} className={`bg-xuan-white/95 backdrop-blur-sm rounded-card p-6 shadow-paper border transition-all ${correct === true ? "border-stone-green/30" : correct === false ? "border-cinnabar/30" : "border-gold-600/10"}`}>
              <div className="flex items-start gap-3 mb-4">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${correct === true ? "bg-stone-green text-white" : correct === false ? "bg-cinnabar text-white" : "bg-gold-600/10 text-gold-600"}`}>{correct === true ? "✓" : correct === false ? "✗" : qIdx + 1}</span>
                <div className="flex-1">
                  <p className="text-base text-ink-900 leading-relaxed">{q.question}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-btn bg-xuan-aged text-ink-400">{q.type === "single" ? "单选题" : q.type === "multiple" ? "多选题" : "简答题"}</span>
                </div>
              </div>
              {q.options && (
                <div className="space-y-2 ml-10">
                  {q.options.map((opt, optIdx) => {
                    const selected = isOptionSelected(q.id, optIdx);
                    const optCorrect = isOptionCorrect(q, optIdx);
                    return (
                      <button key={optIdx} onClick={() => handleSelect(q.id, optIdx, q.type === "multiple")} disabled={submitted}
                        className={`w-full text-left px-4 py-3 rounded-card border-2 transition-all flex items-center gap-3 ${optCorrect === true ? "border-stone-green bg-stone-green/5" : optCorrect === false && selected ? "border-cinnabar bg-cinnabar/5" : selected ? "border-gold-600 bg-gold-100/30" : "border-transparent bg-xuan-aged/30 hover:bg-xuan-aged/50"} ${submitted ? "cursor-default" : "cursor-pointer"}`}>
                        <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${optCorrect === true ? "border-stone-green bg-stone-green text-white" : optCorrect === false && selected ? "border-cinnabar bg-cinnabar text-white" : selected ? "border-gold-600 bg-gold-600 text-white" : "border-ink-300"}`}>{optCorrect === true ? "✓" : optCorrect === false && selected ? "✗" : String.fromCharCode(65 + optIdx)}</span>
                        <span className={`text-sm ${optCorrect === true ? "text-stone-green font-medium" : optCorrect === false && selected ? "text-cinnabar" : "text-ink-700"}`}>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {q.type === "essay" && (
                <div className="ml-10">
                  <textarea value={essays[q.id] || ""} onChange={e => setEssays(prev => ({ ...prev, [q.id]: e.target.value }))} disabled={submitted} placeholder="请输入你的答案..." className="w-full h-32 p-4 rounded-card border border-gold-600/15 bg-xuan-aged/20 text-sm text-ink-700 placeholder:text-ink-300 resize-none focus:outline-none focus:border-gold-600/40" />
                </div>
              )}
              {submitted && q.explanation && (
                <div className="mt-4 ml-10">
                  <button onClick={() => setExpandedExplanation(expandedExplanation === q.id ? null : q.id)} className="text-xs text-gold-600 hover:text-gold-700 flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>{expandedExplanation === q.id ? "收起解析" : "查看解析"}
                  </button>
                  {expandedExplanation === q.id && <div className="mt-2 p-4 bg-gold-100/30 rounded-card border border-gold-600/10 text-sm text-ink-600 leading-relaxed">{q.explanation}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex items-center justify-between">
        {!submitted ? (
          <button onClick={handleSubmit} className="px-8 py-3 bg-cinnabar text-white rounded-btn tracking-wider font-chapter flex items-center gap-2 hover:bg-cinnabar/90 seal-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>提交作答</button>
        ) : (
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium ${score! >= 60 ? "text-stone-green" : "text-cinnabar"}`}>{score! >= 60 ? "恭喜通过！" : "继续努力！"}</span>
            {onComplete && <button onClick={onComplete} className="px-6 py-2.5 bg-ink-900 text-white rounded-btn text-sm hover:bg-ink-800 flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>继续课堂</button>}
          </div>
        )}
        {submitted && <button onClick={() => { setSubmitted(false); setScore(null); setAnswers({}); setEssays({}); setExpandedExplanation(null); }} className="px-4 py-2 text-sm text-ink-500 hover:text-gold-600 border border-ink-300/20 rounded-btn hover:bg-xuan-aged">重新答题</button>}
      </div>
    </div>
  );
}
