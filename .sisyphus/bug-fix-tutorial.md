# 修复 "ink-deploy" 项目 — 完整教程

> **写给其他 agent 的实战指南** — 你接手了一个看起来"编译不通过"、"页面一片空白"的项目，下面是一步步排查和修复的过程。

---

## 第一步：别猜，先构建拿错误信息

**永远不要直接读代码猜问题。** 先用构建命令让编译器告诉你哪里有错：

```bash
npx vite build
```

这个项目第一次构建返回了两个错误。我们的策略是：**修复一个 → 重新构建 → 再修下一个**。一次只修一个，不要批量改。

---

## 第二步：修复构建错误

### Bug 1 — PostClassSection.tsx 多余的闭合标签

**错误信息：**
```
ERROR: Unterminated regular expression
D:/web/ink-deploy/src/sections/PostClassSection.tsx:205:10
```

**关键线索：** 看到 `Unterminated regular expression` 在 `.tsx` 文件里，99% 的情况不是正则表达式的问题，而是 **JSX 标签嵌套出错**，导致 esbuild 解析器把后面的代码当成了正则表达式。

**排查方法：** 看错误位置（第 205 行），然后数 div 的配对。这个文件在 118-202 行有一个 `grid` 布局，里面两列各有一个 `post-anim` div。第 160 行多了一个 `</div>`。

**修复：** 删除多余的 `</div>`（第 160 行）。

```diff
             </div>
-            </div>   ← 这行是多余的
 
             {/* Video */}
```

---

### Bug 2 — InClassSection.tsx 文件末尾的 NULL 字节

**错误信息：**
```
ERROR: Unexpected "\x00"
D:/web/ink-deploy/src/sections/InClassSection.tsx:363:1
```

**关键线索：** `\x00` 是 NULL 字节。说明文件末尾有垃圾数据。

**排查方法：** 用 Node.js 脚本检查：
```js
const fs = require('fs');
const data = fs.readFileSync('src/sections/InClassSection.tsx');
const nullIndex = data.indexOf(0);
if (nullIndex !== -1) {
  console.log(`NULL byte at position ${nullIndex}`);
}
```

output: `NULL BYTE found in src/sections/InClassSection.tsx at position 23150`

**修复：** 用 Write 工具重写整个文件（Read 后再 Write），去除尾部 NULL 字节。

**教训：** `.tsx` 文件也可能被工具损坏。NULL 字节是不可见字符，肉眼看不出来，必须用脚本检查。

---

构建通过后，你已经有可运行的产物了。但用户可能会说"页面一片空白"。继续排查。

---

## 第三步：修复运行时崩溃（空白页面）

用户报告：进入课前准备后页面空白。

### Bug 3 — PreClassSection.tsx 未定义的 STEPS 常量

**排查方法：** 在代码中搜索被使用但未定义/未导入的变量。

第 265 行使用了 `STEPS.map(...)`，但搜索整个文件发现 `STEPS` 从未定义。缺少这个常量 → `ReferenceError: STEPS is not defined` → React 组件崩溃 → 空白页面。

**修复：** 添加 `STEPS` 常量：
```ts
const STEPS = ["探讨主题", "搜索资料", "选择视角", "课件大纲", "课件预览", "课件生成"];
```

**注意：** `currentStep` 的值范围是 0-5（有 6 个步骤），数组必须有恰好 6 个元素，否则会出现 undefined 标签。

---

## 第四步：修复代码质量问题（ESLint）

运行 `npx eslint src --ext .tsx,.ts` 得到 15 个问题。

### 4.1 变量提升（在声明前使用）

**GallerySection.tsx** — `goTo` 在 useEffect 中被使用，但声明在 useEffect 之后。

```tsx
// ❌ 错误：goTo 在 useEffect 之后声明
useEffect(() => {
  goTo((activeIndex + 1) % length);  // goTo 是 undefined！
}, [activeIndex]);

const goTo = (index) => { ... };
```

```tsx
// ✅ 正确：goTo 移到 useEffect 之前，并用 useCallback 包装
const goTo = useCallback((index) => { ... }, [activeIndex, isTransitioning]);

useEffect(() => {
  goTo((activeIndex + 1) % length);
}, [activeIndex, goTo]);
```

**WhiteboardSection.tsx** — 同样的模式，`redraw` 和 `drawPath` 在 useEffect 之后声明。由于这两个函数实际未被使用，直接移除它们。

---

### 4.2 useEffect 中同步调用 setState

**HeroSection.tsx、SlidesPlayer.tsx** — 在 useEffect 里直接调用 setState。

```tsx
// ❌ 不好：每次渲染触发两次 state 更新
useEffect(() => {
  setLoaded(true);     // 触发重渲染
  // ... animation
}, []);

// ✅ 或更好：直接用 useState 初始值
const [loaded] = useState(true);  // 初始就是 true，不需要 setLoaded
```

```tsx
// SlidesPlayer.tsx — setProgress(0) 应该在条件分支内
// ❌
useEffect(() => {
  setProgress(0);
  if (condition) { /* animate */ }
}, [currentIndex]);

// ✅
useEffect(() => {
  if (condition) {
    setProgress(0);
    /* animate */
  }
}, [currentIndex]);
```

---

### 4.3 三元表达式结果未使用

**PostClassSection.tsx、PreClassSection.tsx** — ESLint 规则 `@typescript-eslint/no-unused-expressions`。

```tsx
// ❌ 表达式结果被丢弃
next.has(id) ? next.delete(id) : next.add(id);

// ✅ 改为 if/else
if (next.has(id)) {
  next.delete(id);
} else {
  next.add(id);
}
```

---

### 4.4 未使用的变量 / 导入

| 文件 | 问题 | 修复 |
|------|------|------|
| InClassSection.tsx | `handRaised`, `setHandRaised` 声明但从未使用 | 删除 |
| PreClassSection.tsx | `panelBg` 常量未使用 | 删除 |
| PreClassSection.tsx | `setAgents` setter 未使用 | 改为 `const [agents] = useState(...)` |
| VideoConference.tsx | `useState` 导入未使用 | 从 import 中移除 |

---

### 4.5 any 类型

**PreClassSection.tsx** — `(e: any)` 在 onClick handler 中。

```tsx
// ❌
input.onchange = (e: any) => setPdfFile(e.target.files?.[0] || null);

// ✅
input.onchange = (e: Event) => setPdfFile((e.target as HTMLInputElement).files?.[0] || null);
```

---

## 总结：你在项目中应该用到的排查流程

```
1. npx vite build
   ↓ 有错误? 
2. 逐个修复，每次修一个 → 重新构建
   ↓ 构建通过
3. 检查是否空白页面
   ↓
4. grep 搜索被使用但未定义的标识符
   ↓
5. npx eslint src --ext .tsx,.ts
   ↓
6. 按优先级修复：
   - 变量提升（useEffect 闭包问题）
   - effect 中 setState（性能问题）
   - 未使用变量（删除）
   - TypeScript 类型（any → 具体类型）
   - 代码风格（三元 → if/else）
```

## 核心教训

1. **构建错误信息是金矿** — 不要跳过，仔细读每一个
2. **"Unterminated regular expression" 在 .tsx 里 = JSX 标签不匹配** — 不是真的正则表达式
3. **"\x00" = 文件损坏** — 用脚本检查，不要肉眼找
4. **空白页面 = ReferenceError** — 检查是否有未定义但被引用的变量
5. **ESLint 的错误是真实问题** — 可能不会让构建失败，但会导致运行时 Bug
6. **一次只修一个错误，修完立即构建验证** — 不要批量改
