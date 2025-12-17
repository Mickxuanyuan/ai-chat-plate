# ai-chat-plate

Zustand 管理 UI 状态，React Query 管理服务端数据的最小示例。

## Run

```bash
npm i
npm run dev
```

## Structure

- `store/*`: UI 层状态（Zustand）
- `model/*`: 服务端对接
  - `*.interface.ts`: req/res 类型
  - `*.service.ts`: 纯 HTTP 调用
- `app/_services/*`: 业务层（组合请求/失效/回调）
- `app/_components/*`: 页面组件（消费 store + model）

## Docs

- `docs/PROJECT_GUIDE.md`
