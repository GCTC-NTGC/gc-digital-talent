/* eslint-disable import/prefer-default-export */
// this is a util file that could have many exports
import {
  Viewport,
  ViewportStyles,
} from "@storybook/addon-viewport/dist/ts3.9/models";

// type guard for ViewportStyles
function isViewportStyles(
  viewportStyles:
    | ViewportStyles
    | ((s: ViewportStyles) => ViewportStyles)
    | null,
): viewportStyles is ViewportStyles {
  return (viewportStyles as ViewportStyles) !== undefined;
}

function styleStringToPixelNumber(s: string): number {
  // parseInt can handle the px suffix
  const parsed = parseInt(s, 10);
  if (Number.isNaN(parsed)) throw new Error(`Can't parse style string ${s}`);
  return parsed;
}

export const widthOf = (viewport: Viewport): number => {
  if (isViewportStyles(viewport.styles)) {
    const viewportStyles = viewport.styles as ViewportStyles;
    return styleStringToPixelNumber(viewportStyles.width);
  }

  throw new Error("Can't handle styles which is not a viewport");
};
