---
nav: Components
group: Layout
title: DraggablePanel
description: DraggablePanel is a lightweight collapsible panel. For resizing sidebar layouts, use DraggablePanelLayout (ResizablePanelGroup).
---

# DraggablePanel

## 何时使用 {#when-to-use}

- 需要一个可折叠/展开的面板容器（展开状态由外部受控/非受控均可）
- 需要“面板 + 主内容”的可拖拽缩放布局时，使用 `DraggablePanelLayout`（内部基于 shadcn `ResizablePanelGroup`）

## 代码演示 {#examples}

<code src="./demos/index.tsx" noPadding></code>

> 提示：如果你需要「侧边栏缩放」能力，推荐使用 `DraggablePanelLayout`（内部基于 shadcn 的 `ResizablePanelGroup`），比组件内部缩放更适合“面板 + 主内容”的布局场景。

### Layout

<code src="./demos/Layout.tsx" noPadding></code>

## API（组件的 API）

- `expand?: boolean`
- `destroyOnClose?: boolean`
- 其余：继承 `HTMLAttributes<HTMLDivElement>`

## FAQ 注意事项

- `DraggablePanel` 本身不负责“改变宽高/拖拽分割条”，相关能力在 `DraggablePanelLayout`。
