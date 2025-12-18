"use client";

import { shallow } from "zustand/shallow";

import AvatarWithUpload from "@/app/_components/AvatarWithUpload";
import { useSettings } from "@/store/settings";

/**
 * Container：把 settings store 的 avatar 与更新逻辑注入到展示组件中。
 *
 * 说明：
 * - `app/_components/*` 应尽量保持“纯展示”，不直接读写 store
 * - 这里作为一个薄封装，负责把 store 里的值/回调转成组件 props
 */
export default function AvatarWithUploadFeature() {
  const [avatar, setSettings] = useSettings(
    (st) => [st.settings.avatar, st.setSettings],
    shallow,
  );

  return (
    <AvatarWithUpload
      value={avatar}
      onChange={(next) => setSettings({ avatar: next })}
    />
  );
}

