# ThemeProvider

ThemeProvider 用于在客户端统一管理主题模式（`system | light | dark`），并将最终主题写入到 `document.documentElement` 的 `data-theme` 属性，配合全局 CSS（如 `globals.css`）实现主题切换。

## 何时使用 {#when-to-use}

- 需要在应用内支持 `system / light / dark` 三种模式切换
- 需要将主题状态持久化到 `localStorage`（刷新后保持）
- 需要通过 `data-theme` 驱动 CSS 变量/样式（而不是引入复杂的 UI 主题库）

## 代码演示 {#examples}

### 1) 在应用根部挂载

```tsx
import ThemeProvider from "@/app/_components/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
```

### 2) 在组件中切换主题

```tsx
import ThemeProvider, { useTheme } from "@/app/_components/ThemeProvider";

function ThemeSwitcher() {
  const { mode, resolvedTheme, setMode } = useTheme();

  return (
    <div>
      <div>
        mode: {mode} / resolved: {resolvedTheme}
      </div>
      <button type="button" onClick={() => setMode("system")}>
        system
      </button>
      <button type="button" onClick={() => setMode("light")}>
        light
      </button>
      <button type="button" onClick={() => setMode("dark")}>
        dark
      </button>
    </div>
  );
}

export default function Demo() {
  return (
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>
  );
}
```

## API（组件的 API）

### ThemeProvider Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | 子节点 |
| `defaultMode` | `"system" \| "light" \| "dark"` | `"system"` | 初始模式（如果 `localStorage` 有值会覆盖） |
| `storageKey` | `string` | `"theme-mode"` | 持久化 key |
| `attribute` | `"data-theme"` | `"data-theme"` | 写入到 `document.documentElement` 的属性名 |

### useTheme()

| 返回值 | 类型 | 说明 |
| --- | --- | --- |
| `mode` | `"system" \| "light" \| "dark"` | 当前模式 |
| `resolvedTheme` | `"light" \| "dark"` | 最终生效主题（`mode=system` 时根据系统偏好计算） |
| `setMode(mode)` | `(mode) => void` | 设置模式并持久化 |

## FAQ 注意事项

- 这是一个 Client Component（文件内包含 `"use client"`），必须在客户端环境运行。
- 主题通过设置 `document.documentElement[data-theme="light|dark"]` 生效；请确保你的全局样式（如 `app/globals.css`）对该属性有对应的样式覆盖。
- 如果页面初次渲染时出现“闪烁”（FOUC），可考虑在 `head` 注入一个很小的内联脚本，尽早写入 `data-theme`（本组件当前在 `useEffect` 中执行）。如需要我可以帮你补一个不闪烁版本。

