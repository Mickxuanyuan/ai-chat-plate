# 主题切换方案（ThemeProvider + html.dark + Tailwind dark）

本项目的主题切换目标是：

- 支持 `system / light / dark` 三种模式
- 不引入重量级主题库
- 用统一的 `html.dark` 驱动样式（CSS 变量 + Tailwind `dark:`）

---

## 1. 核心思路

1) **ThemeProvider 管理主题模式**（读写 `localStorage`，并计算最终主题）

2) **把最终主题写到根节点 class**

- `document.documentElement.classList.toggle("dark", resolvedTheme === "dark")`

3) **CSS 根据 `.dark` 覆盖变量**

- 在 `globals.css` 里定义 `:root`（light）+ `.dark`（dark）覆盖 `--background` / `--foreground` 等 CSS 变量

4) **Tailwind 的 `dark:` 变体跟随 `.dark`**

> 这样你写的 `dark:bg-xxx` 不再只跟系统深色模式走，而是跟你设置的主题走。

---

## 2. 项目落地位置

### 2.1 ThemeProvider 组件

- `app/_components/ThemeProvider/ThemeProvider.tsx`
- `app/_components/ThemeProvider/interface.ts`
- `app/_components/ThemeProvider/helpers.ts`

它做的事情：

- 启动时从 `localStorage` 读取 `mode`
- 当 `mode === "system"` 时监听系统主题变化（`matchMedia`）
- 计算 `resolvedTheme`（最终生效主题：`light|dark`）
- 写入 `document.documentElement.classList`（切换 `dark` class）
- 暴露 `useTheme()` 给页面/业务层调用 `setMode()`

### 2.2 Provider 挂载

在应用根部包一层即可：

- `app/providers.tsx`

```tsx
<ThemeProvider>{children}</ThemeProvider>
```

### 2.3 Tailwind dark: 跟随 html.dark

在 Tailwind v4 中，项目通过 `@custom-variant` 明确 `dark:` 的生效条件：

- `app/globals.css`

```css
@custom-variant dark (&:is(.dark *));
```

含义：当元素处于 `.dark` 作用域下时，`dark:*` 样式生效。

### 2.4 CSS 变量覆盖

仍在 `app/globals.css`：

```css
:root { /* light tokens */ }
.dark { /* dark tokens */ }
```

这样做有两个好处：

- 不依赖 Tailwind：纯 CSS 也能吃到主题变量
- Tailwind `bg-[var(--background)]` / `text-[var(--foreground)]` 也能统一

---

## 3. 使用方式（开发时怎么写）

### 3.1 页面中切换主题

在任意 Client Component 里：

```tsx
import { useTheme } from "@/app/_components/ThemeProvider";

const { mode, resolvedTheme, setMode } = useTheme();
```

然后用 `setMode("system" | "light" | "dark")` 即可切换。

### 3.2 写样式

- 用 CSS 变量：`background: var(--background);`
- 或 Tailwind：`className="text-zinc-900 dark:text-zinc-100"`

---

## 4. 常见问题

### Q1: 为什么要 `@custom-variant dark ...`？

Tailwind 默认的 `dark:` 通常跟随系统主题或 `.dark` 类；本项目明确使用 `.dark` 作为唯一的主题开关，所以在 `globals.css` 里把 `dark:` 的触发条件固定为 `.dark` 作用域，避免不同环境/配置下的差异。

### Q2: 可能出现首次渲染闪烁（FOUC）怎么办？

当前 ThemeProvider 在 `useEffect` 里切换 `html.dark`，极少数情况下会出现闪烁。
如果你需要“完全不闪烁”，可以在 `app/layout.tsx` 的 `<head>` 加一段很短的 inline script，尽早设置 `html.dark`。需要的话我可以帮你补一版。
