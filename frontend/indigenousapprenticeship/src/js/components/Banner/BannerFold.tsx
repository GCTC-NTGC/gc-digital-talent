import React from "react";

interface BannerFoldProps {
  position: "before" | "after";
}

const BannerFold: React.FC<BannerFoldProps> = ({ position }) => (
  <div
    className={`banner__fold banner__fold--${position}`}
    data-h2-display="base(block)"
    data-h2-background-color="base(dark.ia-primary)"
    data-h2-position="base(absolute)"
  />
);

export default BannerFold;
