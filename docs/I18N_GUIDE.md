# i18n 方案说明（i18next + react-i18next + namespace resources）

本项目的 i18n 采用：

- `i18next`：核心翻译引擎
- `react-i18next`：React Hook/组件绑定
- `resources` 静态注入：将各语言的 JSON 资源在构建期打包进前端
- **namespace（命名空间）拆分**：将不同业务域的文案按文件/域拆开（如 `common`、`setting`）

---

## 1. 目录结构

以 `zh-CN` 为例：

- `locales/resources/zh_CN/common.json`：通用文案（跨页面/跨模块复用）
- `locales/resources/zh_CN/setting.json`：设置相关文案（设置页/设置模块专属）
- `locales/resources/zh_CN.ts`：将 namespace JSON 组装成 `resources` 对象

英文同理：

- `locales/resources/en_US/common.json`
- `locales/resources/en_US/setting.json`
- `locales/resources/en_US.ts`

总入口：

- `locales/resources/index.ts`：导出所有 locale 的 resources，并导出 `Namespaces` 类型

---

## 2. 初始化逻辑

初始化函数在 `locales/create.ts`：`createI18nNext(namespace?)`

关键点：

- **默认必带 `common`**：无论你传什么 namespace，最终 `ns` 都会包含 `common`
  - 目的：让所有页面/模块都能直接使用通用文案（按钮、通用提示等），减少重复声明
- 传入 `namespace` 时，会把它追加进 `ns`
  - 例如：`createI18nNext("setting")` 会得到 `["common", "setting"]`
- `resources` 由 `locales/resources/index.ts` 提供，形如：
  - `resources["zh-CN"].common`、`resources["zh-CN"].setting`

---

## 3. 为什么要拆 `common` 和 `setting`

这是典型的 **按业务域拆 namespace** 的做法，主要收益：

### 3.1 边界清晰（按域维护）

- `common`：全局通用文案（确认/取消/关闭/编辑…），任何页面都可能用
- `setting`：设置页领域文案（系统/主题/模型/OpenAI 等设置项），只在设置模块使用

这样做能避免：

- 所有文案堆在一个巨大 JSON 中，查找/修改困难
- 不同模块的人互相改同一个文件造成冲突

### 3.2 避免 key 冲突 / 命名更自然

如果所有文案都放在一个 namespace 里，为避免冲突你需要把 key 写得很长（例如 `setting.settingModel.maxTokens.title` 这种），不利于可读性。

拆 namespace 后可以做到：

- `common:ok`（短且通用）
- `setting:settingModel.maxTokens.title`（结构化归类）

### 3.3 性能与演进空间（可逐步支持按需加载）

当前实现是静态 `resources` 注入（会被打包进前端），但 namespace 拆分仍有价值：

- 未来如果要做“按路由/按模块懒加载翻译资源”，namespace 拆分是前置条件
- 即使不懒加载，拆分也能减少在开发时的认知负担与修改冲突

### 3.4 与 UI/产品结构一致

设置页通常文案量大且层级深（标题/描述/placeholder/提示等），拆成 `setting` 可以保持：

- `common.json` 简洁、稳定
- `setting.json` 可以快速扩展且结构化（更接近表单/设置项的层级结构）

---

## 4. 如何使用（开发建议）

### 4.1 在组件中读取文案

使用 `react-i18next` 的 `useTranslation`：

```ts
const { t } = useTranslation("setting");
t("settingTheme.title");
```

通用文案：

```ts
const { t } = useTranslation("common");
t("ok");
```

> 由于初始化总会包含 `common`，即使你只初始化 `setting`，也依然能读到 `common`。

### 4.2 新增文案的放置规则

- **跨多个页面/模块都会用到** → 放 `common.json`
  - 例如：`ok`、`cancel`、`close`、`search`、`delete` 等
- **只属于设置模块** → 放 `setting.json`
  - 例如：模型参数标题/描述、系统访问码、主题模式等
- 后续模块变多时，建议继续按域拆 namespace（如 `chat.json` / `agent.json` / `error.json` 等）

---

## 5. 如何新增一个 namespace（可选演进）

例如新增 `chat`：

1. 新增 `locales/resources/zh_CN/chat.json` 与 `locales/resources/en_US/chat.json`
2. 在 `locales/resources/zh_CN.ts` / `en_US.ts` 中引入并挂到 `resources` 对象：
   - `const resources = { common, setting, chat } as const;`
3. 在需要的地方初始化/使用：
   - `createI18nNext("chat")`
   - `useTranslation("chat")`

---

## 6. 注意事项

- 本方案的资源是静态注入到 `resources`，不依赖网络请求，适合 Demo/中小型项目。
- 如果后期语言包很大，可考虑把 namespace 改为动态加载（i18next 支持 backend 插件或自定义 loader）。

