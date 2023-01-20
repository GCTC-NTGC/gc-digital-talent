import React from "react";

import Heading from "../Heading";
import Breadcrumbs, { type BreadcrumbsProps } from "../Breadcrumbs/v2";
import Flourish from "../Flourish";
import BackgroundGraphic from "./BackgroundPattern";

import "./hero.css";

const paddingMap = new Map([
  [
    "default",
    {
      "data-h2-padding": "base(x3, 0)",
    },
  ],
  [
    "image",
    {
      "data-h2-padding":
        "base(x3, 0, 50vh, 0) p-tablet(x3, 0, 60vh, 0) l-tablet(x3, 0)",
    },
  ],
  [
    "overlap",
    {
      "data-h2-padding": "base(x3, 0, x6, 0)",
    },
  ],
]);

export interface HeroProps {
  imgPath: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  crumbs?: BreadcrumbsProps["crumbs"];
  children?: React.ReactNode;
  centered?: boolean;
}

const Hero = ({
  imgPath,
  title,
  subtitle,
  crumbs,
  children,
  centered = false,
}: HeroProps) => {
  const showImg = imgPath && !centered && !children;
  const breadCrumbs =
    crumbs && crumbs.length > 0 ? <Breadcrumbs crumbs={crumbs} /> : null;
  const textAlignment = centered
    ? {
        "data-h2-text-align": "base(center)",
      }
    : {
        "data-h2-text-align": "base(center) l-tablet(left)",
      };
  let padding = paddingMap.get("default");
  if (showImg) {
    padding = paddingMap.get("image");
  } else if (children) {
    padding = paddingMap.get("overlap");
  }
  return (
    <>
      <div
        data-h2-background-color="base(black)"
        data-h2-overflow="base(hidden)"
        data-h2-position="base(relative)"
        {...padding}
      >
        <div
          data-h2-position="base(relative)"
          data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
          data-h2-layer="base(1, relative)"
          data-h2-z-index="base(3)"
        >
          <div data-h2-color="base(white)" {...textAlignment}>
            <Heading level="h1" data-h2-margin="base(0, 0, x0.5, 0)">
              {title}
            </Heading>
            {subtitle && (
              <p
                data-h2-font-size="base(h6, 1.4)"
                data-h2-font-weight="base(300)"
                data-h2-margin="base(x1, 0, 0, 0)"
                {...(!centered && { "data-h2-max-width": "l-tablet(50%)" })}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {showImg ? (
          <div
            data-h2-position="base(absolute)"
            data-h2-location="base(0)"
            data-h2-height="base(auto)"
            data-h2-width="base(100%)"
            data-h2-z-index="base(2)"
            className="header-bg-image"
            style={{ backgroundImage: `url('${imgPath}')` }}
          />
        ) : (
          <BackgroundGraphic
            data-h2-position="base(absolute)"
            data-h2-location="base(0, 0, auto, auto)"
            data-h2-height="base(auto)"
            data-h2-min-width="base(x20)"
            data-h2-width="base(75%)"
            data-h2-z-index="base(1)"
          />
        )}
      </div>
      {children ? (
        <>
          <Flourish />
          <div
            data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
            data-h2-position="base(relative)"
            data-h2-margin="base(-x3, auto, 0, auto)"
            data-h2-z-index="base(4)"
          >
            <div
              data-h2-background-color="base(white)"
              data-h2-radius="base(rounded)"
              data-h2-padding="base(x2, x1)"
              data-h2-shadow="base(s)"
              {...textAlignment}
            >
              {children}
            </div>
          </div>
        </>
      ) : (
        breadCrumbs
      )}
    </>
  );
};

export default Hero;
