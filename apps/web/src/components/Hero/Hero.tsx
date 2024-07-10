import { ReactNode, useEffect, useRef } from "react";

import {
  Heading,
  type HeadingRef,
  Breadcrumbs,
  type BreadcrumbsProps,
  Flourish,
} from "@gc-digital-talent/ui";

import BackgroundGraphic from "./BackgroundPattern";

import "./hero.css";

const paddingMap = new Map([
  [
    "default",
    {
      "data-h2-padding": "base(x4, 0)",
    },
  ],
  [
    "image",
    {
      "data-h2-padding":
        "base(x3, 0, 50vh, 0) p-tablet(x3, 0, 60vh, 0) l-tablet(x4, 0)",
    },
  ],
  [
    "overlap",
    {
      "data-h2-padding": "base(x4, 0, x8, 0)",
    },
  ],
]);

interface HeroProps {
  imgPath?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  crumbs?: BreadcrumbsProps["crumbs"];
  children?: ReactNode;
  centered?: boolean;
  linkSlot?: ReactNode;
}

const Hero = ({
  imgPath,
  title,
  subtitle,
  crumbs,
  children,
  linkSlot,
  centered = false,
}: HeroProps) => {
  const headingRef = useRef<HeadingRef>(null);
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

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  return (
    <>
      <div
        data-h2-background="base(rgba(0, 0, 0, 1)) base:iap(linear-gradient(90deg, primary, rgb(104, 23, 53)))"
        data-h2-overflow="base(hidden)"
        data-h2-position="base(relative)"
        {...padding}
      >
        <div
          data-h2-display="base(none) base:iap(block)"
          data-h2-position="base(absolute)"
          data-h2-location="base(auto, 0, 0, auto)"
          data-h2-transform="base(translate(65%, 75%))"
        >
          <div
            data-h2-height="base(x30)"
            data-h2-width="base(x30)"
            data-h2-background-color="base:all(secondary.darker)"
            data-h2-radius="base(circle)"
          >
            &nbsp;
          </div>
        </div>
        <div
          data-h2-display="base(none) base:iap(block)"
          data-h2-position="base(absolute)"
          data-h2-location="base(0, auto, auto, 0)"
          data-h2-transform="base(translate(-75%, -65%))"
        >
          <div
            data-h2-height="base(x30)"
            data-h2-width="base(x30)"
            data-h2-border="base:all(x.25 solid secondary.darker)"
            data-h2-radius="base(circle)"
          />
          <div
            data-h2-height="base(x25)"
            data-h2-width="base(x25)"
            data-h2-border="base:all(x.25 solid secondary.darker)"
            data-h2-radius="base(circle)"
            data-h2-position="base(center)"
          />
          <div
            data-h2-height="base(x20)"
            data-h2-width="base(x20)"
            data-h2-border="base:all(x.25 solid secondary.darker)"
            data-h2-radius="base(circle)"
            data-h2-position="base(center)"
          >
            &nbsp;
          </div>
        </div>
        <div
          data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
          data-h2-layer="base(3, relative)"
        >
          <div
            data-h2-color="base:all(white)"
            {...textAlignment}
            {...(showImg && {
              "data-h2-margin-right": "l-tablet(x18)",
            })}
          >
            <Heading
              ref={headingRef}
              tabIndex={-1}
              data-h2-outline="base(none)"
              level="h1"
              size="h2"
              data-h2-margin="base(0)"
            >
              {title}
            </Heading>
            {subtitle && (
              <p
                data-h2-font-size="base(h5, 1.4)"
                data-h2-margin="base(x1, 0, 0, 0)"
              >
                {subtitle}
              </p>
            )}
            {linkSlot && (
              <div
                data-h2-display="base(flex)"
                data-h2-align-items="base(flex-start)"
                data-h2-margin="base(x1.5, 0, 0, 0)"
                data-h2-gap="base(x1)"
                data-h2-justify-content="base(center) p-tablet(flex-start)"
                data-h2-flex-wrap="base(wrap) p-tablet(initial)"
              >
                {linkSlot}
              </div>
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
            aria-hidden="true"
            data-h2-display="base(block) base:iap(none)"
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
            data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
            data-h2-position="base(relative)"
            data-h2-margin="base(-x5, auto, 0, auto)"
            data-h2-z-index="base(4)"
          >
            {children}
          </div>
        </>
      ) : (
        breadCrumbs
      )}
    </>
  );
};

export default Hero;
