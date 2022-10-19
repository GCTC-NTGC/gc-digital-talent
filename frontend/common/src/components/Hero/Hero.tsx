import React from "react";

import Heading from "../Heading";
import Breadcrumbs, { type BreadcrumbsProps } from "../Breadcrumbs/v2";

import "./hero.css";

interface HeroProps {
  imgPath: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  crumbs?: BreadcrumbsProps["crumbs"];
}

const Hero = ({ imgPath, title, subtitle, crumbs }: HeroProps) => (
  <>
    <div
      data-h2-background-color="base(black)"
      data-h2-padding="base(x3, 0, 50vh, 0) p-tablet(x4, 0, 60vh, 0) l-tablet(x4, 0)"
      className="header-bg-image"
      style={{
        backgroundImage: `url('${imgPath}')`,
      }}
    >
      <div
        data-h2-position="base(relative)"
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-layer="base(1, relative)"
      >
        <div
          data-h2-color="base(white)"
          data-h2-text-align="base(center) l-tablet(left)"
        >
          <Heading level="h1" data-h2-margin="base(0, 0, x0.5, 0)">
            {title}
          </Heading>
          {subtitle && (
            <p
              data-h2-font-size="base(h6, 1.4)"
              data-h2-font-weight="base(300)"
              data-h2-margin="base(x1, 0, 0, 0)"
              data-h2-max-width="l-tablet(50%)"
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
    {crumbs && crumbs.length > 0 ? <Breadcrumbs crumbs={crumbs} /> : null}
  </>
);

export default Hero;
