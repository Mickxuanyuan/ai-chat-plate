import type { Locales } from "./locale";

/**
 * 配置设置
 */
export interface ConfigSettings {
  accessCode: string;
  avatar: string;
  compressThreshold: number;
  enableCompressThreshold: boolean;
  enableHistoryCount: boolean;
  enableMaxTokens: boolean;
  endpoint: string;
  fontSize: number;
  frequencyPenalty: number;
  historyCount: number;
  language: Locales;
  maxTokens: number;
  model: string;
  neutralColor: string;
  presencePenalty: number;
  primaryColor: string;
  temperature: number;
  token: string;
  topP: number;
}

export type ConfigKeys = keyof ConfigSettings;

export interface ConfigState {
  settings: ConfigSettings;
}

export interface ConfigFile {
  state: ConfigState;
  /**
   * 配置文件的版本号
   */
  version: number;
}
