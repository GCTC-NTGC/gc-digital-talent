const VIEWPORTS = {
  pTablet: {
    name: "Portrait Tablet",
    styles: {
      width: "768px",
      height: "1024px",
    },
  },
  lTablet: {
    name: "Landscape Tablet",
    styles: {
      width: "1080px",
      height: "600px",
    },
  },
  laptop: {
    name: "Laptop",
    styles: {
      width: "1280px",
      height: "800px",
    },
  },
  desktop: {
    name: "Desktop",
    styles: {
      width: "1600px",
      height: "900px",
    },
  },
};

type VIEWPORT = "pTablet" | "lTablet" | "laptop" | "desktop";
type DIMENSION = {
  width: number;
  height: number;
};

export const VIEWPORT_DIMENSIONS: Record<VIEWPORT, DIMENSION> = {
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

export default VIEWPORTS;
