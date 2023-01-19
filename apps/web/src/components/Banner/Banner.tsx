import React from "react";

const Banner: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div
    data-h2-display="base(inline-block)"
    data-h2-position="base(relative)"
    data-h2-location="base(-x3, auto, auto, auto)"
  >
    <div
      data-h2-position="base(absolute)"
      data-h2-background-color="base(ia-primary.dark)"
      data-h2-height="base(75%)"
      data-h2-width="base(45%)"
      data-h2-location="base(auto, auto, -20%, -15%)"
    />
    <div
      data-h2-position="base(absolute)"
      data-h2-background-color="base(ia-primary.dark)"
      data-h2-height="base(75%)"
      data-h2-width="base(45%)"
      data-h2-location="base(auto, -15%, -20%, auto)"
    />
    <div
      data-h2-padding="base(1rem) p-tablet(x1.5)"
      data-h2-background-color="base(ia-primary)"
      data-h2-position="base(relative)"
    >
      {children}
    </div>
  </div>
);

export default Banner;
