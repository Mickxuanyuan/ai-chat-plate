# ui

## 何时使用 {#when-to-use}

- 需要使用项目内置的 shadcn/ui 风格基础组件（Button/Avatar/Resizable 等）
- 需要在业务组件中复用统一的交互与样式（避免重复造轮子）

## 代码演示 {#examples}

```tsx
import { Button } from "@/app/_components/ui/button";

export default function Demo() {
  return <Button>Button</Button>;
}
```

## API（组件的 API）

- `Button`：`@/app/_components/ui/button`
- `Avatar`：`@/app/_components/ui/avatar`
- `Resizable`：`@/app/_components/ui/resizable`

## FAQ 注意事项

- 该目录以“基础 UI 组件”为主，建议业务组件优先组合这些组件实现。

