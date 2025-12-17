/**
 * Chat Slice：selectors（派生读取聊天相关数据）。
 *
 * - 负责从当前会话中整理“可展示的聊天消息列表”（排序、过滤归档、补全 assistant 头像等）
 * - 提供 token 统计（消息 tokens / systemRole tokens）
 */
import { encode } from "gpt-tokenizer";

import { agentSelectors } from "@/store/session";
import type { ChatMessage } from "@/types/chatMessage";

import type { SessionStore } from "../../store";
import { sessionSelectors } from "../session";

/**
 * 展示在聊天框中的消息列表。
 *
 * 处理流程：
 * - 按时间排序（createAt 升序）
 * - 过滤归档消息（archive）
 * - 将 assistant 消息补充 avatar/title（用于 UI 展示）
 * - 根据 parentId 做简单父子顺序插入，保证对话串联的可读性
 */
const currentChats = (s: SessionStore): ChatMessage[] => {
  const session = sessionSelectors.currentSession(s);
  if (!session) return [];

  const basic = Object.values<ChatMessage>(session.chats)
    // 首先按照时间顺序排序，越早的在越前面
    .sort((pre, next) => pre.createAt - next.createAt)
    // 过滤掉已归档的消息，归档消息不应该出现在聊天框中
    .filter((m) => !m.archive)
    // 映射头像关系
    .map((m) => {
      return {
        ...m,
        meta:
          m.role === "assistant"
            ? {
                avatar: agentSelectors.currentAgentAvatar(s),
                title: session.meta.title,
              }
            : m.meta,
      };
    });

  const finalList: ChatMessage[] = [];

  /** 避免重复插入同一条消息 */
  const addItem = (item: ChatMessage) => {
    const isExist = finalList.findIndex((i) => item.id === i.id) > -1;
    if (!isExist) {
      finalList.push(item);
    }
  };

  for (const item of basic) {
    // 先判存在与否，不存在就加入
    addItem(item);

    for (const another of basic) {
      if (another.parentId === item.id) {
        addItem(another);
      }
    }
  }

  return finalList;
};

/** 当前会话 systemRole（系统提示词）。 */
const systemRoleSel = (s: SessionStore): string => {
  const config = agentSelectors.currentAgentConfigSafe(s);

  return config.systemRole;
};

/** 当前会话所有可展示消息的 tokens（用于长度/成本估算）。 */
const totalTokens = (s: SessionStore): number[] => {
  const chats = currentChats(s);
  return encode(chats.map((m) => m.content).join(""));
};

/** systemRole 的 tokens（用于单独统计系统提示词占用）。 */
const systemRoleTokens = (s: SessionStore): number[] => {
  const systemRole = systemRoleSel(s);

  return encode(systemRole || "");
};

/** 当前会话消息 tokens 总数。 */
const totalTokenCount = (s: SessionStore) => totalTokens(s).length;

/** systemRole tokens 总数。 */
const systemRoleTokenCount = (s: SessionStore) => systemRoleTokens(s).length;

export const chatSelectors = {
  currentChats,
  systemRoleTokenCount,
  systemRoleTokens,
  totalTokenCount,
  totalTokens,
};
