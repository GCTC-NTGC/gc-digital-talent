type Styles = ViewportStyles | ((s: ViewportStyles) => ViewportStyles) | null;
interface Viewport {
  name: string;
  styles: Styles;
  type: "desktop" | "mobile" | "tablet" | "other";
}
interface ViewportStyles {
  height: string;
  width: string;
}

// type guard for ViewportStyles
function isViewportStyles(styles: Styles): styles is ViewportStyles {
  return (styles as ViewportStyles) !== undefined;
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

export const heightOf = (viewport: Viewport): number => {
  if (isViewportStyles(viewport.styles)) {
    const viewportStyles = viewport.styles as ViewportStyles;
    return styleStringToPixelNumber(viewportStyles.height);
  }

  throw new Error("Can't handle styles which is not a viewport");
};
