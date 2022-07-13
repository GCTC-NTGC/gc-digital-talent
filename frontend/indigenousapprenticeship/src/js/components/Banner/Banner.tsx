import React from "react";
import BannerFold from "./BannerFold";
import "./style.css";

const Banner: React.FC = ({ children }) => (
  <div
    className="banner"
    data-h2-display="base(inline-block)"
    data-h2-position="base(relative)"
  >
    <BannerFold position="before" />
    <div
      className="banner__content"
      data-h2-background-color="base(ia-primary)"
      data-h2-position="base(relative)"
      data-h2-margin="base(x1, 0)"
    >
      {children}
    </div>
    <BannerFold position="after" />
  </div>
);

export default Banner;
