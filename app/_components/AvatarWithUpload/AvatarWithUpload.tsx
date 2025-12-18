"use client";

import { memo, useId, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import { readAsDataURL } from "./helpers";
import type { AvatarWithUploadProps } from "./interface";

export default memo<AvatarWithUploadProps>(
  ({
    value,
    onChange,
    onError,
    size = 40,
    disabled = false,
    accept = "image/*",
  }) => {
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [hovered, setHovered] = useState(false);

    return (
      <div
        className="relative inline-flex"
        style={{ height: size, width: size }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <input
          ref={inputRef}
          id={inputId}
          className="sr-only"
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={async (event) => {
            try {
              const file = event.currentTarget.files?.[0];
              if (!file) return;
              const base64 = await readAsDataURL(file);
              onChange?.(base64);
            } catch (e) {
              onError?.(e as Error);
            } finally {
              // 允许重复选择同一个文件也触发 change
              event.currentTarget.value = "";
            }
          }}
        />

        <label
          htmlFor={inputId}
          className="cursor-pointer"
          aria-disabled={disabled}
          onClick={(e) => {
            if (!disabled) return;
            e.preventDefault();
          }}
        >
          <Avatar style={{ height: size, width: size }}>
            {value ? <AvatarImage src={value} alt="avatar" /> : null}
            <AvatarFallback
              className="text-xs font-semibold"
              style={{ fontSize: Math.max(10, Math.floor(size / 3)) }}
            >
              AI
            </AvatarFallback>
          </Avatar>
        </label>

        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{
            opacity: hovered && !disabled ? 1 : 0,
            transition: "opacity 120ms",
          }}
        >
          <Button
            className="pointer-events-auto h-7 px-2 text-xs"
            size="sm"
            variant="secondary"
            type="button"
            onClick={() => inputRef.current?.click()}
          >
            上传
          </Button>
        </div>
      </div>
    );
  },
);

