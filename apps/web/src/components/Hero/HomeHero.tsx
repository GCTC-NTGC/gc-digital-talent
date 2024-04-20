import React from "react";

interface HomeHeroProps {
  children: React.ReactNode;
  callToAction?: React.ReactNode;
  img: {
    sources: {
      srcset: string;
      media: string;
    }[];
    src: string;
    alt: string;
  };
}

const HomeHero = ({
  img: { sources, src, alt },
  callToAction,
  children,
}: HomeHeroProps) => (
  <div className="relative overflow-hidden bg-black pb-[calc(6rem+3%)] pt-18 sm:pt-24 md:pb-[calc(10rem+3%)] md:pt-40">
    <div
      className="relative z-10"
      data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
    >
      <div data-h2-color="base:all(white)" className="text-center sm:text-left">
        {children}
      </div>
      {callToAction ? (
        <div className="flex flex-wrap items-start justify-center gap-6 sm:justify-start">
          {callToAction}
        </div>
      ) : null}
    </div>
    <div className="pt-18 sm:pt-0">
      <picture>
        {sources.map(({ srcset, media }) => (
          <source key={`${srcset}${media}`} srcSet={srcset} media={media} />
        ))}
        <img
          src={src}
          alt={alt}
          className="relative right-0 top-0 -mb-12 w-full sm:absolute sm:mb-0 sm:h-full sm:w-auto md:left-1/2 md:right-auto"
        />
      </picture>
    </div>
  </div>
);

export default HomeHero;
