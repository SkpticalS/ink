// =============================
// Type definitions only — no demo data
// All data should come from backend API
// =============================

export interface Source {
  id: number;
  title: string;
  url: string;
  snippet: string;
  checked: boolean;
}

export interface Perspective {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Message {
  id: number;
  sender: string;
  avatar: string;
  role: "teacher" | "student" | "ai" | "system";
  content: string;
  time: string;
}

export interface Member {
  id: number;
  name: string;
  role: string;
  online: boolean;
  avatar: string;
}

export interface Room {
  id: number;
  name: string;
  teacher: string;
  topic: string;
  members: number;
  status: string;
  time: string;
}

export interface Activity {
  id: number;
  type: string;
  title: string;
  user: string;
  time: string;
}

export interface TimelineRecord {
  id: number;
  time: string;
  speaker: string;
  content: string;
  topic: string;
}

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

export interface Slide {
  id: number;
  title: string;
  content: string;
  bulletPoints?: string[];
  image?: string;
  note?: string;
}

export interface QuizQuestion {
  id: number;
  type: "single" | "multiple" | "essay";
  question: string;
  options?: string[];
  correctAnswer?: number[];
  explanation: string;
}

export interface VideoParticipant {
  id: number;
  name: string;
  role: "host" | "student" | "expert" | "ai";
  avatar: string;
  isSpeaking?: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
}

export interface GenerationStep {
  id: string;
  label: string;
  status: "pending" | "running" | "completed" | "error";
  detail: string;
  logs: string[];
  duration?: string;
}
