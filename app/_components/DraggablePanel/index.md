---
nav: Components
group: Layout
title: DraggablePanel
description: DraggablePanel is a panel that can be dragged and resized. It supports pinning, fixed or floating mode, placement in four directions, minimum width and height, expandable or not, default and customizable size, and destroy on close. It also provides a handler for expanding and collapsing the panel.
---

## Default

<code src="./demos/index.tsx" noPadding></code>

> 提示：如果你需要「侧边栏缩放」能力，推荐使用 `DraggablePanelLayout`（内部基于 shadcn 的 `ResizablePanelGroup`），比组件内部缩放更适合“面板 + 主内容”的布局场景。

## Layout

<code src="./demos/Layout.tsx" noPadding></code>

## APIs

| Property                | Description                                                | Type                                                   | Default   |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------------------------ | --------- |
| placement               | Position of the panel                                      | `'right' \| 'left' \| 'top' \| 'bottom'`               | -         |
| mode                    | Display mode of the panel                                  | `'fixed' \| 'float'`                                   | `'float'` |
| expand                  | Whether the panel is expanded                              | `boolean`                                              | -         |
| defaultExpand           | Default expand state                                       | `boolean`                                              | `true`    |
| expandable              | Whether the panel can be expanded/collapsed                | `boolean`                                              | `true`    |
| pin                     | Whether the panel is pinned                                | `boolean`                                              | `false`   |
| size                    | Size of the panel                                          | `Partial<DraggablePanelSize>`                          | -         |
| defaultSize             | Default size of the panel                                  | `Partial<DraggablePanelSize>`                          | -         |
| minWidth                | Minimum width of the panel                                 | `number`                                               | -         |
| maxWidth                | Maximum width of the panel                                 | `number`                                               | -         |
| minHeight               | Minimum height of the panel                                | `number`                                               | -         |
| maxHeight               | Maximum height of the panel                                | `number`                                               | -         |
| headerHeight            | Height of the panel header                                 | `number`                                               | -         |
| fullscreen              | Whether the panel is in fullscreen mode                    | `boolean`                                              | `false`   |
| resize                  | Enable/disable resizing                                    | `boolean \| DraggablePanelResizing`                    | -         |
| destroyOnClose          | Whether to destroy panel content when collapsed            | `boolean`                                              | `false`   |
| showHandleWhenCollapsed | Whether to show the drag handle when panel is collapsed    | `boolean`                                              | `true`    |
| showHandleWideArea      | Whether to display a wider handle area for easier dragging | `boolean`                                              | `false`   |
| onExpandChange          | Callback when expand state changes                         | `(expand: boolean) => void`                            | -         |
| onSizeChange            | Callback when size changes                                 | `(delta: DraggablePanelDelta, size?: DraggablePanelSize) => void` | -         |
| onSizeDragging          | Callback when size is being dragged                        | `(delta: DraggablePanelDelta, size?: DraggablePanelSize) => void` | -         |
| draggable               | (Enhancement) free dragging when `mode="float"`            | `boolean`                                              | `false`   |
| dragHandleSelector      | (Enhancement) handle selector for dragging                 | `string`                                               | `"[data-draggable-panel-handle]"` |
| position                | (Enhancement) controlled position                          | `DraggablePanelPosition`                               | -         |
| defaultPosition         | (Enhancement) default position                             | `DraggablePanelPosition`                               | -         |
| onPositionChange        | (Enhancement) drag end callback                            | `(delta: DraggablePanelPositionDelta, position: DraggablePanelPosition) => void` | -         |
| onPositionDragging      | (Enhancement) dragging callback                            | `(delta: DraggablePanelPositionDelta, position: DraggablePanelPosition) => void` | -         |
| classNames              | Custom class names for panel elements                      | `{ content?: string; handle?: string; }`               | -         |
| styles                  | Custom styles for panel elements                           | `{ content?: CSSProperties; handle?: CSSProperties; }` | -         |
