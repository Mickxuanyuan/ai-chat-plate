# AvatarWithUpload

## 何时使用 {#when-to-use}

- 需要展示头像并支持上传替换
- 需要在上传成功后把 base64 结果交给外部（由外部决定保存/上传到服务端）

## 代码演示 {#examples}

```tsx
import { useState } from "react";
import AvatarWithUpload from "@/app/_components/AvatarWithUpload";

export default function Demo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <AvatarWithUpload
      value={value}
      size={64}
      accept="image/*"
      onChange={(base64) => setValue(base64)}
    />
  );
}
```

## API（组件的 API）

- `value?: string | null`
- `size?: number`
- `disabled?: boolean`
- `accept?: string`
- `onChange?: (base64: string) => void`
- `onError?: (error: Error) => void`

## FAQ 注意事项

- 组件不负责上传到服务端；如需上传，请在 `onChange` 里处理并回填 url/base64。
- `accept` 建议显式传入（例如 `image/png,image/jpeg,image/webp`）避免用户选到不支持的格式。

