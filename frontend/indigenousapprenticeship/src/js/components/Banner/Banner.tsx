import React from "react";
import BannerFold from "./BannerFold";
import "./style.css";

const Banner: React.FC = ({ children }) => (
  <div
    className="banner"
    data-h2-display="b(inline-block)"
    data-h2-position="b(relative)"
  >
    <BannerFold position="before" />
    <div
      className="banner__content"
      data-h2-bg-color="b(ia-pink)"
      data-h2-position="b(relative)"
      data-h2-margin="b(top-bottom, m)"
    >
      {children}
    </div>
    <BannerFold position="after" />
  </div>
);

export default Banner;
