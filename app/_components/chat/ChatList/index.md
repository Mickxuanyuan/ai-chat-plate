# ChatList

## 何时使用 {#when-to-use}

- 聊天页面需要展示一组对话消息（支持左右对齐的气泡样式）
- 需要在 hover 时展示消息操作（copy / edit / regenerate / delete）

## 代码演示 {#examples}

```tsx
import type { ChatMessage } from "@/types/chatMessage";

import ChatList from "@/app/_components/chat/ChatList";

const data: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "你好",
    meta: { title: "Me" },
    createAt: Date.now(),
    updateAt: Date.now(),
  },
  {
    id: "2",
    role: "assistant",
    content: "你好，我能帮你做什么？",
    meta: { title: "Assistant" },
    createAt: Date.now(),
    updateAt: Date.now(),
  },
];

export default function Demo() {
  return (
    <ChatList
      data={data}
      onActionClick={(action, id) => {
        console.log(action, id);
      }}
    />
  );
}
```

## API（组件的 API）

- `data: ChatMessage[]`
- `variant?: "bubble" | "docs"`
- `showAvatar?: boolean`
- `showTitle?: boolean`
- `loadingId?: string`
- `text?: { copy?: string; delete?: string; edit?: string; regenerate?: string; history?: string }`
- `enableHistoryCount?: boolean`
- `historyCount?: number`
- `onActionClick?: (action, id, message) => void`
- `onActionsClick?: (action, id, message) => void`
- `onAvatarsClick?: (message) => void`
- `onMessageChange?: (id, content) => void`
- `renderItems?: (message, defaultItem) => ReactNode`
- `renderMessages?: (message) => ReactNode`
- `renderErrorMessages?: (message) => ReactNode`
- `renderMessagesExtra?: (message) => ReactNode`
- `renderActions?: (message, defaultActions) => ReactNode`
- 其余：继承 `HTMLAttributes<HTMLDivElement>`

## FAQ 注意事项

- 这是纯展示组件：不读取 store、不发请求，所有数据与操作回调都由上层传入。
- 内置 copy 会尝试调用 `navigator.clipboard`，失败会静默忽略，同时仍会触发 `onActionClick` 回调。
