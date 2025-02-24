export const VIEWPORT = {
  PHONE: "phone",
  P_TABLET: "pTablet",
  L_TABLET: "lTablet",
  LAPTOP: "laptop",
  DESKTOP: "desktop",
} as const;

export type Viewport = (typeof VIEWPORT)[keyof typeof VIEWPORT];

interface Dimension {
  width: number;
  height: number;
}

type DimensionTuple = [number, number]; // [width, height];

/**
 *
 * Widths come from `hydrogen.config.json` media key ({x}em * 16 = {x}px)
 * Height from most popular screen sizes, matching closest width value
 *
 * */
export const DIMENSIONS: Record<Viewport, Dimension> = {
  phone: {
    width: 375,
    height: 667,
  },
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
  phone: {
    name: "Phone",
    styles: {
      width: `${DIMENSIONS.phone.width}px`,
      height: `${DIMENSIONS.phone.height}px`,
    },
  },
  pTablet: {
    name: "Portrait Tablet",
    styles: {
      width: `${DIMENSIONS.pTablet.width}px`,
      height: `${DIMENSIONS.pTablet.height}px`,
    },
  },
  lTablet: {
    name: "Landscape Tablet",
    styles: {
      width: `${DIMENSIONS.lTablet.width}px`,
      height: `${DIMENSIONS.lTablet.height}px`,
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
  DIMENSIONS.phone.width,
  DIMENSIONS.desktop.width,
];
