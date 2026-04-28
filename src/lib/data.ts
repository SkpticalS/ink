// Discipline colors
export const DISCIPLINE_COLORS: Record<string, string> = {
  art: "#5A7A96",
  music: "#C4963D",
  drama: "#B54A3F",
  film: "#6B8E6B",
  theory: "#6B6B6B",
};

// Demo outline data
export const DEMO_OUTLINE = [
  { id: "1", title: "第一章 中国山水画概述", pages: [
    { id: "1-1", title: "山水画的起源与发展" },
    { id: "1-2", title: "山水画的文化内涵" },
  ]},
  { id: "2", title: "第二章 宋代山水画", pages: [
    { id: "2-1", title: "北宋山水画的写实风格" },
    { id: "2-2", title: "范宽与《溪山行旅图》" },
    { id: "2-3", title: "南宋院体山水画" },
  ]},
  { id: "3", title: "第三章 元代文人画", pages: [
    { id: "3-1", title: "文人画的兴起" },
    { id: "3-2", title: "倪瓒与元代四家" },
  ]},
  { id: "4", title: "第四章 明清山水画", pages: [
    { id: "4-1", title: "明代吴门画派" },
    { id: "4-2", title: "清初四王与四僧" },
  ]},
];

// Demo search results
export const DEMO_SEARCH_RESULTS = [
  { id: 1, title: "《溪山行旅图》赏析", source: "中国美术史数据库", snippet: "范宽代表作，以雄浑壮阔的北方山水著称...", color: "art" },
  { id: 2, title: "宋代山水画的空间营造", source: "艺术学研究", snippet: "三远法是宋代山水画的重要构图法则...", color: "theory" },
  { id: 3, title: "文人画的美学思想", source: "美学理论库", snippet: "强调'逸笔草草，不求形似'的审美追求...", color: "theory" },
  { id: 4, title: "元四家艺术风格比较", source: "艺术百科", snippet: "黄公望、吴镇、倪瓒、王蒙四人各有千秋...", color: "art" },
];

// Demo discussion messages
export const DEMO_MESSAGES = [
  { id: 1, sender: "张同学", avatar: "张", role: "student", content: "老师，请问范宽的'雨点皴'具体是怎么表现的？", time: "14:32" },
  { id: 2, sender: "李教授", avatar: "李", role: "expert", content: "'雨点皴'是范宽独创的笔法，以密集的点状笔触表现山石的坚硬质感，你们可以仔细观察《溪山行旅图》的山体部分。", time: "14:33" },
  { id: 3, sender: "王同学", avatar: "王", role: "student", content: "我在画册上看过，感觉像是无数墨点密集堆积而成，非常有力量感。", time: "14:35" },
  { id: 4, sender: "李教授", avatar: "李", role: "expert", content: "说得很好。这种皴法不仅表现质感，更重要的是传达了画家对自然山川的敬畏之情。", time: "14:36" },
  { id: 5, sender: "赵同学", avatar: "赵", role: "student", content: "请问这种技法对后世有什么影响？", time: "14:38" },
];

// Demo members
export const DEMO_MEMBERS = [
  { id: 1, name: "罗文韬", role: "房主", online: true, avatar: "罗" },
  { id: 2, name: "张同学", role: "学生", online: true, avatar: "张" },
  { id: 3, name: "王同学", role: "学生", online: true, avatar: "王" },
  { id: 4, name: "赵同学", role: "学生", online: true, avatar: "赵" },
  { id: 5, name: "陈同学", role: "学生", online: false, avatar: "陈" },
  { id: 6, name: "刘同学", role: "学生", online: true, avatar: "刘" },
];

// Demo knowledge tree
export const DEMO_KNOWLEDGE_TREE = {
  id: "root", name: "中国山水画",
  children: [
    { id: "1", name: "起源发展", children: [
      { id: "1-1", name: "魏晋萌芽" }, { id: "1-2", name: "隋唐独立" }, { id: "1-3", name: "五代成熟" },
    ]},
    { id: "2", name: "宋代高峰", children: [
      { id: "2-1", name: "北宋写实" }, { id: "2-2", name: "南宋诗意" },
    ]},
    { id: "3", name: "文人写意", children: [
      { id: "3-1", name: "元四家" }, { id: "3-2", name: "明吴门" }, { id: "3-3", name: "清四僧" },
    ]},
    { id: "4", name: "技法体系", children: [
      { id: "4-1", name: "皴法" }, { id: "4-2", name: "构图" }, { id: "4-3", name: "设色" },
    ]},
  ],
};

// Demo timeline
export const DEMO_TIMELINE = [
  { id: 1, time: "14:32", speaker: "张同学", content: "老师，请问范宽的'雨点皴'具体是怎么表现的？", topic: "技法探讨" },
  { id: 2, time: "14:33", speaker: "李教授", content: "'雨点皴'是范宽独创的笔法，以密集的点状笔触表现山石的坚硬质感。", topic: "专家解答" },
  { id: 3, time: "14:35", speaker: "王同学", content: "感觉像是无数墨点密集堆积而成，非常有力量感。", topic: "互动讨论" },
  { id: 4, time: "14:36", speaker: "李教授", content: "这种皴法不仅表现质感，更重要的是传达了画家对自然山川的敬畏之情。", topic: "深度讲解" },
  { id: 5, time: "14:38", speaker: "赵同学", content: "请问这种技法对后世有什么影响？", topic: "技法探讨" },
  { id: 6, time: "14:40", speaker: "李教授", content: "影响了明代戴进、吴伟等人的'浙派'山水，以及清代石涛的墨法创新。", topic: "历史脉络" },
];

// Pre-class: generation steps
export const GENERATION_STEPS = ["准备", "检索", "大纲", "场景", "素材", "语音", "保存", "完成"];

// Pre-class: logs
export const DEMO_LOGS = [
  { id: 1, type: "system", content: "等待房主开始生成课程内容。" },
  { id: 2, type: "model", content: "已开启检索，系统会先查找相关依据，再组织课程内容。" },
];
