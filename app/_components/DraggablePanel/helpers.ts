import type { DraggablePanelPlacement } from "./interface";

/**
 * 将面板 placement 转换成“拖拽边”的方向。
 *
 * 例：
 * - 面板在 `left`，可拖拽的是右侧边缘 => `right`
 * - 面板在 `top`，可拖拽的是底部边缘 => `bottom`
 */
export const reversePlacement = (placement: DraggablePanelPlacement) => {
  switch (placement) {
    case "bottom": {
      return "top";
    }
    case "top": {
      return "bottom";
    }
    case "right": {
      return "left";
    }
    case "left": {
      return "right";
    }
  }
};
