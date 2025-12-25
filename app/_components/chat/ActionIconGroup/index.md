# ActionIconGroup

## 何时使用 {#when-to-use}

需要展示一组图标按钮，并且希望按钮在样式、尺寸和布局上保持一致时使用。

## 代码演示 {#examples}

<code src="./demos/index.tsx" nopadding></code>

## API（组件的 API）

- actionIconProps: 透传给所有按钮的属性（`Omit<React.ComponentProps<'button'>, 'type'>`）。
- disabled: 是否禁用全部按钮（`boolean`）。
- glass: 是否启用玻璃拟态效果（`boolean`）。
- horizontal: 布局方向（`boolean`）。
- items: 操作项列表（`ActionIconGroupItem[]`）。
- menu: 更多菜单配置（`ActionIconGroupMenu`）。
- onActionClick: 操作点击回调（`(action: ActionIconGroupEvent) => void`）。
- shadow: 是否启用阴影（`boolean`）。
- size: 按钮尺寸（`'small' | 'normal' | 'medium' | 'large'`）。
- variant: 按钮样式变体（`'filled' | 'outlined' | 'borderless'`）。

## FAQ 注意事项

1. `items` 与 `menu` 可以同时使用，适合“主操作 + 更多”的场景。
2. `disabled` 为 true 时会禁用所有操作按钮与菜单触发。
3. `danger` 项建议仅用于不可逆操作。
