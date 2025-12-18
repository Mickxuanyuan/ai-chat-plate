export type AvatarWithUploadProps = {
  /**
   * 当前头像（base64/url）。为空时展示 fallback。
   */
  value?: string | null;
  /**
   * 头像尺寸（像素）。
   */
  size?: number;
  /**
   * 是否禁用上传。
   */
  disabled?: boolean;
  /**
   * `<input type="file" accept="...">` 的 accept 值。
   */
  accept?: string;
  /**
   * 选择图片后回调（返回 base64）。
   */
  onChange?: (base64: string) => void;
  /**
   * 读取文件失败时回调。
   */
  onError?: (error: Error) => void;
};

