"use client";

import type { ReactNode } from "react";
import { memo } from "react";

export interface FormItemProps {
  /**
   * 表单项标题。
   */
  label: string;
  /**
   * 表单项内容区域。
   */
  children: ReactNode;
}

export const FormItem = memo<FormItemProps>(({ label, children }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div>{children}</div>
    </div>
  );
});
