/**
 * AgentConfig Slice：selectors（派生读取当前会话的 Agent 配置/Meta）。
 *
 * - 统一从 `sessionSelectors.currentSession` 读取当前会话
 * - 提供“安全兜底”的读取（例如无会话时返回默认 avatar / 默认 config）
 */
import type { SessionStore } from "@/store/session";
import { LanguageModel } from "@/types/llm";
import type { MetaData } from "@/types/meta";
import type { LobeAgentConfig } from "@/types/session";

import { sessionSelectors } from "../session";
import { DEFAULT_AVATAR, initialLobeAgentConfig } from "./initialState";

/**
 * 当前会话的 Meta（avatar/title/description...）。
 * - 若无当前会话，返回空对象兜底
 */
const currentAgentMeta = (s: SessionStore): MetaData => {
  const session = sessionSelectors.currentSession(s);

  return session?.meta || {};
};

/** 当前会话标题（可能为空）。 */
const currentAgentTitle = (s: SessionStore) => currentAgentMeta(s)?.title;

/**
 * 当前会话头像（带默认值兜底）。
 */
const currentAgentAvatar = (s: SessionStore) => {
  const session = sessionSelectors.currentSession(s);

  if (!session) return DEFAULT_AVATAR;

  return session.meta.avatar || DEFAULT_AVATAR;
};

/** 当前会话的 Agent 配置（可能为 undefined）。 */
const currentAgentConfig = (s: SessionStore) => {
  const session = sessionSelectors.currentSession(s);

  return session?.config;
};

/**
 * 当前会话的 Agent 配置（安全兜底，永不返回 undefined）。
 */
const currentAgentConfigSafe = (s: SessionStore): LobeAgentConfig => {
  return currentAgentConfig(s) || initialLobeAgentConfig;
};

/** 当前会话使用的模型（带默认值兜底）。 */
const currentAgentModel = (s: SessionStore): LanguageModel => {
  const config = currentAgentConfig(s);

  return config?.model || LanguageModel.GPT3_5;
};

/** 当前会话是否配置了 systemRole。 */
const hasSystemRole = (s: SessionStore) => {
  const config = currentAgentConfigSafe(s);

  return !!config.systemRole;
};

export const agentSelectors = {
  currentAgentAvatar,
  currentAgentConfig,
  currentAgentConfigSafe,
  currentAgentMeta,
  currentAgentModel,
  currentAgentTitle,
  hasSystemRole,
};
