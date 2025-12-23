# ThemeProvider

## 何时使用 {#when-to-use}

- 需要在应用内支持 `system / light / dark` 三种模式切换
- 需要将主题状态持久化到 `localStorage`（刷新后保持）
- 需要使用 shadcn/ui 默认方案：通过给 `html` 节点加/删 `dark` class 驱动 Tailwind 的 `dark:` 样式

## 代码演示 {#examples}

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

- `children: React.ReactNode`
- `defaultMode?: "system" | "light" | "dark"`
- `storageKey?: string`
- `attribute?: "class"`

## FAQ 注意事项

- 这是一个 Client Component（文件内包含 `"use client"`），必须在客户端环境运行。
- 主题通过设置 `document.documentElement.classList.toggle("dark", ...)` 生效；请确保 `app/globals.css` 使用 `dark:` 或 `.dark { ... }` 覆盖变量/样式。
