/**
 * Session Slice：selectors（与 agent/chat 相关的轻量派生）。
 */
import { DEFAULT_AVATAR } from "@/store/session/slices/agentConfig";
import type { MetaData } from "@/types/meta";

/**
 * 从 MetaData 中拿到 avatar（带默认值兜底）。
 */
export const getAgentAvatar = (s: MetaData) => s.avatar || DEFAULT_AVATAR;
