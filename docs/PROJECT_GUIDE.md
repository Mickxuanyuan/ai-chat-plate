# ai-chat-plate 技术文档（搭建与规范）

本项目是一个 Next.js（App Router）示例工程，核心目的：

- **Zustand 管 UI 状态**
- **本项目不使用 React Query（请求在 Zustand 中发起）**
- **展示组件与数据请求彻底解耦**

---

## 1. 环境与启动

### 环境要求

- Node.js：建议 `>= 20`（本仓库使用现代 ESM/Next.js）
- 包管理器：当前脚本以 `npm` 为主

### 常用命令

- 开发：`npm run dev`
- 格式化：`npm run format`
- 静态检查：`npm run lint`
- Storybook：`npm run storybook`

---

## i18n

- `docs/I18N_GUIDE.md`

---

## 2. 目录结构与分层

### 分层职责（强制）

- `app/_components/*`：**纯展示组件（Presentational）**
  - 只负责渲染与交互
  - **不发请求、不直接用 React Query、不直接读写 store**
  - 需要的数据/回调统一通过 props 传入
- `app/page.tsx`：**组装层（Composition）**
  - 负责把 store + 业务层拿到的数据/方法传给展示组件
- `app/_services/*`：**业务层（Business）**
  - 允许组合多个请求、做缓存失效（invalidate）、做成功回调等业务编排
  - 允许使用 Zustand + React Query
- `model/*`：**查询层（Query/Model）**
  - 只做两件事：**(1) 请求 (2) 数据清洗**
  - 不做业务逻辑（不 invalidate、不串联 UI 回调、不持有 UI 状态）
  - **一个请求对应一个 hook**（如 `useXxxList` / `useXxxCreate`），hook 里直接写请求即可
- `store/*`：**UI 状态（Zustand）**
  - 仅放 UI 层状态（筛选条件、表单输入、tab 等）
  - 不放服务端缓存数据（由 React Query 管）

---

## 3. 请求封装（HTTP）

- `model/http.ts`：统一的 `http.request/get/post` 封装
  - 支持 `responseType: json | text | blob | arrayBuffer`
  - `http.download(...)` 用于文件下载场景（通过 `a[download]` 触发）
  - 错误使用 `HttpError`（包含 `status` 与可选 `data`）

---

## 4. 主题组件（可复用组件模板）

ThemeProvider 按“组件 5 件套”规范组织，目录：

- `app/_components/ThemeProvider/index.ts`
- `app/_components/ThemeProvider/interface.ts`
- `app/_components/ThemeProvider/ThemeProvider.tsx`
- `app/_components/ThemeProvider/helpers.ts`
- `app/_components/ThemeProvider/ThemeProvider.stories.tsx`
- `app/_components/ThemeProvider/index.md`

它做的事情非常简单：

- 管理 `system | light | dark` 模式
- 读取/写入 `localStorage`
- 将最终主题写入 `document.documentElement.classList`（切换 `dark` class）

全局样式通过 `app/globals.css` 的 `:root`（light）与 `.dark`（dark）覆盖生效。

更完整的主题落地说明见：

- `docs/THEME_GUIDE.md`

---

## 5. Alias（@/）

本项目使用 `@/` 作为绝对路径别名，指向项目根：

- 配置：`tsconfig.json` 的 `baseUrl` + `paths`
- 约定：业务代码一律使用 `@/xxx` 引用，避免 `../../../` 级联

---

## 6. Storybook 关联规则

为满足“组件同目录写 `.stories.tsx`”的规范：

- `.storybook/main.ts` 扫描：
  - `stories/**`（storybook 默认示例）
  - `app/**`（组件同目录 stories）
- `.storybook/preview.ts` 引入 `app/globals.css`，保证 Tailwind/主题变量一致

---

## 7. 重新搭建时的 Checklist

1. 初始化 Next.js（App Router）
2. 安装依赖：
   - `zustand`
3. 加 `@/` alias（`tsconfig.json`）
4. 添加 `model/http.ts`
5. 按分层规则组织代码（`AGENTS.md` 作为规范入口）
6. 如果需要 Storybook：
   - 增加 scripts：`storybook` / `build-storybook`
   - 配置 `.storybook/main.ts` 扫描 `app/**` 的 `.stories.*`

---

## 8. 相关规范入口

- 代码规范与模板：`AGENTS.md`
