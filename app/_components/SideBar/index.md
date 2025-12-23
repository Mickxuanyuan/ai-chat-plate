# SideBar

## 何时使用 {#when-to-use}

- 需要一个固定宽度的侧边栏导航（顶部头像/Logo + 导航项 + 底部操作区）
- 需要把路由/状态管理解耦：点击事件通过 `onTabChange`/`onClick` 回调交给外部处理

## 代码演示 {#examples}

```tsx
import { Home, Settings } from "lucide-react";
import SideBar from "@/app/_components/SideBar";

export default function Demo() {
  return (
    <SideBar
      activeKey="home"
      avatar={<div className="h-10 w-10 rounded-full bg-muted" />}
      items={[
        { key: "home", icon: Home, label: "Home" },
        { key: "settings", icon: Settings, label: "Settings" },
      ]}
      onTabChange={(key) => console.log(key)}
      bottomActions={[{ icon: Settings, label: "Settings" }]}
    />
  );
}
```

## API（组件的 API）

- `avatar?: ReactNode`
- `items: Array<{ key: string; icon: LucideIcon; label: string; disabled?: boolean }>`
- `activeKey: string`
- `onTabChange: (key: string) => void`
- `bottomActions?: Array<{ key?: string; icon: LucideIcon; label: string; onClick?: () => void; disabled?: boolean }>`
- `className?: string`

## FAQ 注意事项

- 这是一个纯展示组件：不要在组件内部直接读写 store/发请求，数据与回调都从外部传入。
- 建议 `items` 的 `key` 与路由/业务状态保持一致，便于联动高亮。

