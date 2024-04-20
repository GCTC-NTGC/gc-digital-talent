import React from "react";

import {
  Heading,
  type HeadingRef,
  Breadcrumbs,
  type BreadcrumbsProps,
  Flourish,
  cn,
} from "@gc-digital-talent/ui";

import BackgroundGraphic from "./BackgroundPattern";

interface HeroProps {
  imgPath?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  crumbs?: BreadcrumbsProps["crumbs"];
  children?: React.ReactNode;
  centered?: boolean;
  linkSlot?: React.ReactNode;
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
  const headingRef = React.useRef<HeadingRef>(null);
  const showImg = imgPath && !centered && !children;
  const breadCrumbs =
    crumbs && crumbs.length > 0 ? <Breadcrumbs crumbs={crumbs} /> : null;

  React.useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  return (
    <>
      <div
        data-h2-background="base(rgba(0, 0, 0, 1)) base:iap(linear-gradient(90deg, primary, rgb(104, 23, 53)))"
        className={cn("relative overflow-hidden py-28", {
          "pb-[50vh] pt-20 sm:pb-[60vh] md:py-28": showImg,
          "pb-48 pt-28": !!children,
        })}
      >
        <div
          className="absolute bottom-0 right-0 translate-x-[65%] translate-y-3/4"
          data-h2-display="base(none) base:iap(block)"
        >
          <div
            className="h-[50rem] w-[50rem] rounded-full"
            data-h2-background-color="base:all(secondary.darker)"
          >
            &nbsp;
          </div>
        </div>
        <div
          className="absolute left-0 top-0 -translate-x-3/4 -translate-y-[65%]"
          data-h2-display="base(none) base:iap(block)"
        >
          <div
            className="h-[50rem] w-[50rem] rounded-full"
            data-h2-border="base:all(x.25 solid secondary.darker)"
          />
          <div
            className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
            data-h2-border="base:all(x.25 solid secondary.darker)"
          />
          <div
            className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
            data-h2-border="base:all(x.25 solid secondary.darker)"
          />
        </div>
        <div
          className="relative z-30"
          data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        >
          <div
            data-h2-color="base:all(white)"
            className={cn("text-center", {
              "md:text-left": !centered,
              "md:mr-[30rem]": showImg,
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
              <p className="mt-6" data-h2-font-size="base(h5, 1.4)">
                {subtitle}
              </p>
            )}
            {linkSlot && (
              <div className="mt-10 flex flex-wrap items-start justify-center gap-6 sm:justify-start">
                {linkSlot}
              </div>
            )}
          </div>
        </div>
        {showImg ? (
          <div
            className="absolute inset-0 z-20 h-auto w-full bg-[length:auto_50vh] bg-[50%_110%] bg-no-repeat sm:bg-[length:auto_60vh] md:bg-[length:auto_110%] md:bg-[calc(50%+25rem)_50%]"
            style={{ backgroundImage: `url('${imgPath}')` }}
          />
        ) : (
          <BackgroundGraphic
            aria-hidden="true"
            className="absolute right-0 top-0 z-10 h-auto w-3/4 min-w-[34rem]"
            data-h2-display="base(block) base:iap(none)"
          />
        )}
      </div>
      {children ? (
        <>
          <Flourish />
          <div
            data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
            className="relative z-40 -mt-28 mb-0"
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
