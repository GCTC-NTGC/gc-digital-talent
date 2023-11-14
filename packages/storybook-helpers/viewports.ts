type Viewport = "pTablet" | "lTablet" | "laptop" | "desktop";
type Dimension = {
  width: number;
  height: number;
};
type DimensionTuple = [number, number]; // [width, height];

export const DIMENSIONS: Record<Viewport, Dimension> = {
  pTablet: {
    width: 768,
    height: 1024,
  },
  lTablet: {
    width: 1080,
    height: 600,
  },
  laptop: {
    width: 1280,
    height: 800,
  },
  desktop: {
    width: 1600,
    height: 900,
  },
};

export const VIEWPORTS = {
  pTablet: {
    name: "Portrait Tablet",
    styles: {
      width: `${DIMENSIONS.lTablet.width}px`,
      height: `${DIMENSIONS.lTablet.height}px`,
    },
  },
  lTablet: {
    name: "Landscape Tablet",
    styles: {
      width: `${DIMENSIONS.pTablet.width}px`,
      height: `${DIMENSIONS.pTablet.height}px`,
    },
  },
  laptop: {
    name: "Laptop",
    styles: {
      width: `${DIMENSIONS.laptop.width}px`,
      height: `${DIMENSIONS.laptop.height}px`,
    },
  },
  desktop: {
    name: "Desktop",
    styles: {
      width: `${DIMENSIONS.desktop.width}px`,
      height: `${DIMENSIONS.desktop.height}px`,
    },
  },
};

export const CHROMATIC_VIEWPORTS: DimensionTuple = [
  DIMENSIONS.pTablet.width,
  DIMENSIONS.desktop.width,
];
