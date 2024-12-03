import { ReactNode } from "react";

interface HomeHeroProps {
  children: ReactNode;
  callToAction?: ReactNode;
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
  <div
    data-h2-background-color="base(#000)"
    data-h2-position="base(relative)"
    data-h2-padding-top="base(x3) p-tablet(x4) l-tablet(x6)"
    data-h2-padding-bottom="p-tablet(calc(x4 + 3%)) l-tablet(calc(x6 + 3%))"
    data-h2-overflow="base(hidden)"
  >
    <div
      data-h2-position="base(relative)"
      data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
      data-h2-layer="base(1, relative)"
    >
      <div
        data-h2-color="base:all(white)"
        data-h2-text-align="base(center) p-tablet(left)"
      >
        {children}
      </div>
      {callToAction ? (
        <div
          data-h2-display="base(flex)"
          data-h2-align-items="base(flex-start)"
          data-h2-gap="base(x1)"
          data-h2-justify-content="base(center) p-tablet(flex-start)"
          data-h2-flex-wrap="base(wrap) p-tablet(initial)"
        >
          {callToAction}
        </div>
      ) : null}
    </div>
    <div data-h2-padding-top="base(x3) p-tablet(0)">
      <picture>
        {sources.map(({ srcset, media }) => (
          <source key={`${srcset}${media}`} srcSet={srcset} media={media} />
        ))}
        <img
          src={src}
          alt={alt}
          data-h2-height="p-tablet(100%)"
          data-h2-margin-bottom="base(-x2) p-tablet(0)"
          data-h2-position="base(relative) p-tablet(absolute)"
          data-h2-top="p-tablet(0)"
          data-h2-left="p-tablet(auto) l-tablet(50%)"
          data-h2-right="p-tablet(0px) l-tablet(auto)"
          data-h2-width="base(100%) p-tablet(auto)"
        />
      </picture>
    </div>
  </div>
);

export default HomeHero;
