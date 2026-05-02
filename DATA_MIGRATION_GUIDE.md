# 前端 → 后端数据接入指南

> 所有组件的空状态提示文字已内置。接入后端时，通过 props 传入数据即可自动替换提示。

---

## 组件数据接口一览

### 1. PreClassSection（课前准备）

```tsx
interface PreClassSectionProps {
  onComplete?: () => void;
  sources?: Source[];           // 检索结果（联网+知识库）
  perspectives?: Perspective[]; // AI生成的选题视角
  outline?: string[];           // 课程大纲
  onStartSearch?: (topic: string) => void;
  onSelectSources?: (ids: number[]) => void;
  onSelectPerspective?: (id: number) => void;
}
```

| 空状态提示 | 数据接入方式 |
|-----------|------------|
| "暂无检索结果" | `sources` prop |
| "暂无选题视角" | `perspectives` prop |
| "暂无课程大纲" | `outline` prop |

---

### 2. GenerationDetail（课件生成流水线）

```tsx
interface GenerationDetailProps {
  steps?: GenerationStep[];      // 每步生成状态+日志
  overallProgress?: number;      // 0-100 总进度
}
```

**数据推送方式：** SSE 流式或 WebSocket
```tsx
// 示例：SSE 接入
const [steps, setSteps] = useState<GenerationStep[]>([]);
const [progress, setProgress] = useState(0);

useEffect(() => {
  const es = new EventSource('/api/generate/stream');
  es.onmessage = (e) => {
    const data = JSON.parse(e.data);
    setSteps(data.steps);
    setProgress(data.progress);
  };
  return () => es.close();
}, []);

<GenerationDetail steps={steps} overallProgress={progress} />
```

---

### 3. SlidesPlayer（幻灯片播放器）

```tsx
interface SlidesPlayerProps {
  slides?: Slide[];    // 课件幻灯片数组
  compact?: boolean;   // 视频边栏存在时紧凑模式
}
```

| 空状态提示 | 数据接入 |
|-----------|---------|
| "课件生成后，幻灯片将在此展示" | `slides` prop |

---

### 4. VideoConference（视频会议）

```tsx
interface VideoConferenceProps {
  layout: "sidebar" | "gallery";
  participants?: VideoParticipant[];  // 参与者列表
  onLayoutChange: (layout: "sidebar" | "gallery") => void;
}
```

| 空状态提示 | 数据接入 |
|-----------|---------|
| "暂无参与者" / "等待专家或学员加入" | `participants` prop |

**视频接入：** WebRTC + 信令服务器（LiveKit / Twilio / 自研）

---

### 5. QuizSection（课堂测验）

```tsx
interface QuizSectionProps {
  questions?: QuizQuestion[];  // 测验题目
  onComplete?: () => void;
}
```

| 空状态提示 | 数据接入 |
|-----------|---------|
| "暂无测验题目" | `questions` prop |

---

### 6. InClassSection（课中互动）

```tsx
interface InClassSectionProps {
  onComplete?: () => void;
  messages?: Message[];              // 聊天消息
  members?: Member[];                // 在线成员
  participants?: VideoParticipant[]; // 视频会议参与者
  slides?: Slide[];                  // 幻灯片（透传给 SlidesPlayer）
  questions?: QuizQuestion[];        // 测验题（透传给 QuizSection）
}
```

| 区域 | 空状态提示 | 数据接入 |
|------|-----------|---------|
| 聊天 | "暂无消息，开始讨论吧" | `messages` prop |
| 成员 | "暂无在线成员" | `members` prop |
| 视频 | 见 VideoConference | `participants` prop |

---

### 7. PostClassSection（课后归档）

```tsx
interface PostClassSectionProps {
  knowledgeTree?: TreeNode;         // 知识树
  timeline?: TimelineRecord[];      // 讨论时间轴
}
```

| 空状态提示 | 数据接入 |
|-----------|---------|
| "课程结束后，知识树将自动生成" | `knowledgeTree` prop |
| "课堂讨论记录将在此归档" | `timeline` prop |

---

### 8. LobbyPage（教室大厅）

```tsx
interface LobbyPageProps {
  onEnterClassroom: () => void;
  classrooms?: { id, name, topic, status, students, code }[];
}
```

| 空状态提示 | 数据接入 |
|-----------|---------|
| "暂无在线教室，创建教室后将在此显示" | `classrooms` prop |

---

## 接入模式总结

| 数据类型 | 推荐接入方式 | 示例接口 |
|---------|------------|---------|
| 检索结果 | REST API | `GET /api/search?query=xxx` |
| 生成状态 | SSE 流式 | `EventSource('/api/generate/stream')` |
| 聊天消息 | WebSocket | `new WebSocket('wss://api.com/ws/chat')` |
| 视频通话 | WebRTC 信令 | LiveKit / Twilio SDK |
| 成员状态 | WebSocket 或 REST 轮询 | `GET /api/room/{id}/members` |
| 静态内容 | REST API | `GET /api/slides/{id}` |

---

## 快速接入模板

```tsx
// App.tsx 中连接后端示例
import { useState, useEffect } from "react";

function ClassroomPage() {
  const [slides, setSlides] = useState([]);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch('/api/slides/1').then(r => r.json()).then(setSlides);
    fetch('/api/quiz/1').then(r => r.json()).then(setQuestions);
    // WebSocket for chat
    const ws = new WebSocket('wss://api.com/ws/chat?room=1');
    ws.onmessage = (e) => setMessages(prev => [...prev, JSON.parse(e.data)]);
    return () => ws.close();
  }, []);

  return (
    <InClassSection
      slides={slides}
      messages={messages}
      participants={participants}
      questions={questions}
    />
  );
}
```
