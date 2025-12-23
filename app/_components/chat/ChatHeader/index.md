# ChatHeader

## 何时使用 {#when-to-use}

- 聊天页顶部导航栏（左侧信息区 + 可选中间区 + 右侧操作区）
- 需要统一 header 高度/边框/背景模糊效果（Tailwind + shadcn/ui）

## 代码演示 {#examples}

```tsx
import ChatHeader, { ChatHeaderTitle } from "@/app/_components/chat/ChatHeader";

export default function Demo() {
  return (
    <ChatHeader
      left={<ChatHeaderTitle title="Agent" desc="Description" />}
      right={<div>Actions</div>}
    />
  );
}
```

## API（组件的 API）

- `left?: ReactNode`
- `right?: ReactNode`
- `showBackButton?: boolean`
- `onBackClick?: () => void`
- `gap?: number`
- `gaps?: { left?: number; center?: number; right?: number }`
- `classNames?: { left?: string; center?: string; right?: string }`
- `styles?: { left?: CSSProperties; center?: CSSProperties; right?: CSSProperties }`
- 其余：继承 `HTMLAttributes<HTMLDivElement>`

## FAQ 注意事项

- `ChatHeaderTitle` 是可选的便捷组件：用于渲染 title/desc/tag，支持完全自定义 `left` 内容。
- Header 本身是纯展示组件，不负责读取会话信息或路由跳转。

