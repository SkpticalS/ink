import { useState, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

const COLORS = [
  { value: "#1A1A1A", label: "墨" },
  { value: "#C4963D", label: "金" },
  { value: "#B54A3F", label: "朱" },
  { value: "#4A7C59", label: "翠" },
  { value: "#7B6F5D", label: "灰" },
];

const BRUSH_WIDTHS = [
  { value: 2, label: "细" },
  { value: 4, label: "中" },
  { value: 8, label: "粗" },
];

export default function WhiteboardSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#1A1A1A");
  const [brushWidth, setBrushWidth] = useState(4);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [aiDrawing, setAiDrawing] = useState(false);

  const getPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const p = getPoint(e);
    setCurrentStroke([p]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const p = getPoint(e);
    const newStroke = [...currentStroke, p];
    setCurrentStroke(newStroke);
    // Draw on canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (newStroke.length >= 2) {
      const prev = newStroke[newStroke.length - 2];
      const curr = newStroke[newStroke.length - 1];
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.strokeStyle = tool === "eraser" ? "#F7F2E8" : color;
      ctx.lineWidth = tool === "eraser" ? brushWidth * 3 : brushWidth;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.length > 1) {
      setStrokes(prev => [...prev, { points: currentStroke, color, width: brushWidth }]);
    }
    setCurrentStroke([]);
  };

  const clear = () => {
    setStrokes([]);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
  };

  const undo = () => {
    setStrokes(prev => prev.slice(0, -1));
  };

  // AI demo: auto-draw a simple mountain
  const triggerAiDraw = () => {
    setAiDrawing(true);
    const demoStrokes: Stroke[] = [
      { points: [{ x: 100, y: 250 }, { x: 200, y: 100 }, { x: 300, y: 250 }], color: "#1A1A1A", width: 3 },
      { points: [{ x: 250, y: 250 }, { x: 380, y: 80 }, { x: 500, y: 250 }], color: "#1A1A1A", width: 3 },
      { points: [{ x: 150, y: 270 }, { x: 350, y: 270 }, { x: 450, y: 270 }], color: "#7B6F5D", width: 2 },
      { points: [{ x: 195, y: 130 }, { x: 210, y: 110 }, { x: 200, y: 100 }], color: "#F7F2E8", width: 2 },
    ];
    let i = 0;
    const addStroke = () => {
      if (i < demoStrokes.length) {
        setStrokes(prev => [...prev, demoStrokes[i]]);
        i++;
        setTimeout(addStroke, 600);
      } else {
        setAiDrawing(false);
      }
    };
    setTimeout(addStroke, 300);
  };

  return (
    <div className="relative w-full">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* Tool selector */}
        <div className="flex items-center bg-xuan-aged/50 rounded-card p-1 border border-gold-600/10">
          <button
            onClick={() => setTool("pen")}
            className={`px-3 py-1.5 rounded-btn text-xs transition-all ${tool === "pen" ? "bg-gold-600 text-white" : "text-ink-500 hover:text-ink-700"}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-1"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
            画笔
          </button>
          <button
            onClick={() => setTool("eraser")}
            className={`px-3 py-1.5 rounded-btn text-xs transition-all ${tool === "eraser" ? "bg-gold-600 text-white" : "text-ink-500 hover:text-ink-700"}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-1"><path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L20 20Z"/><path d="M17 17L7 7"/></svg>
            橡皮
          </button>
        </div>

        {/* Color picker */}
        <div className="flex items-center gap-1.5">
          {COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => { setColor(c.value); setTool("pen"); }}
              className={`w-6 h-6 rounded-full border-2 transition-all ${color === c.value && tool === "pen" ? "border-gold-600 scale-110" : "border-transparent hover:scale-105"}`}
              style={{ backgroundColor: c.value }}
              title={c.label}
            ></button>
          ))}
        </div>

        {/* Brush width */}
        <div className="flex items-center bg-xuan-aged/50 rounded-card p-1 border border-gold-600/10">
          {BRUSH_WIDTHS.map(w => (
            <button
              key={w.value}
              onClick={() => setBrushWidth(w.value)}
              className={`px-2.5 py-1 rounded-btn text-xs transition-all ${brushWidth === w.value ? "bg-gold-600 text-white" : "text-ink-500"}`}
            >
              {w.label}
            </button>
          ))}
        </div>

        <div className="flex-1" ></div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={strokes.length === 0}
            className="px-3 py-1.5 rounded-btn bg-xuan-aged/60 text-ink-500 text-xs hover:bg-xuan-aged transition-all disabled:opacity-30 flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
            撤销
          </button>
          <button
            onClick={clear}
            className="px-3 py-1.5 rounded-btn bg-xuan-aged/60 text-cinnabar text-xs hover:bg-cinnabar/10 transition-all flex items-center gap-1.5 border border-cinnabar/10"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            清空
          </button>
          <button
            onClick={triggerAiDraw}
            disabled={aiDrawing}
            className="px-3 py-1.5 rounded-btn bg-gold-600/10 text-gold-600 text-xs hover:bg-gold-600/20 transition-all flex items-center gap-1.5 border border-gold-600/20 disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            {aiDrawing ? "AI 绘图中..." : "AI 演示绘图"}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="relative w-full h-[480px] rounded-card border border-gold-600/15 overflow-hidden bg-xuan-white cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="absolute inset-0"
        />
        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gold-600/30 pointer-events-none" ></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gold-600/30 pointer-events-none" ></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gold-600/30 pointer-events-none" ></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gold-600/30 pointer-events-none" ></div>
        {/* Stroke count */}
        <div className="absolute bottom-3 right-6 text-xs text-ink-300 pointer-events-none">
          {strokes.length} 笔
        </div>
      </div>

      {/* Hint */}
      <p className="mt-3 text-xs text-ink-400 text-center">
        支持鼠标和触屏绘图 · AI 讲师可在白板上实时书写讲解
      </p>
    </div>
  );
}
