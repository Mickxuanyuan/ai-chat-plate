"use client";

import type { DraggablePanelPlacement } from "./interface";

export type ResizeEdge = "top" | "right" | "bottom" | "left";

export function reversePlacement(
  placement: DraggablePanelPlacement,
): ResizeEdge {
  switch (placement) {
    case "bottom":
      return "top";
    case "top":
      return "bottom";
    case "right":
      return "left";
    case "left":
      return "right";
  }
}

export function clampNumber(value: number, min?: number, max?: number) {
  const safeMin = typeof min === "number" ? min : -Infinity;
  const safeMax = typeof max === "number" ? max : Infinity;
  return Math.min(safeMax, Math.max(safeMin, value));
}

export function toPxNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (trimmed.endsWith("%")) return fallback;
  if (trimmed.includes("calc(")) return fallback;
  if (trimmed.endsWith("px")) {
    const parsed = Number.parseFloat(trimmed.slice(0, -2));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getDocumentDir(): "ltr" | "rtl" | undefined {
  if (typeof document === "undefined") return undefined;
  const dir = document.documentElement.getAttribute("dir");
  return dir === "rtl" ? "rtl" : dir === "ltr" ? "ltr" : undefined;
}

export function isInteractiveTarget(target: Element) {
  return Boolean(
    target.closest(
      'button,a,input,textarea,select,option,[role="button"],[contenteditable="true"]',
    ),
  );
}
