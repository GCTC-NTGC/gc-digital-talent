import React from "react";

interface BannerFoldProps {
  position: "before" | "after";
}

const BannerFold: React.FC<BannerFoldProps> = ({ position }) => (
  <div
    className={`banner__fold banner__fold--${position}`}
    data-h2-display="b(block)"
    data-h2-background-color="b(dark.ia-primary)"
    data-h2-position="b(absolute)"
  />
);

export default BannerFold;
