import { ReactNode } from "react";
import { tv } from "tailwind-variants";

import { Container, Heading, HeadingRank } from "@gc-digital-talent/ui";

const gradient = tv({
  base: "absolute inset-y-0 z-[1] from-[#000] to-transparent",
});

interface HomeHeroProps {
  callToAction?: ReactNode;
  title: string;
  subtitle?: string;
  titleSize?: HeadingRank;
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
  title,
  subtitle,
  titleSize,
}: HomeHeroProps) => (
  <div className="relative overflow-hidden bg-[#000]">
    <Container className="relative z-[1]">
      <div className="relative z-10 w-full pt-18 pb-24 xs:max-w-fit xs:pt-24 xs:pb-30 sm:pt-36 sm:pb-36 md:pt-36 md:pb-47">
        <div className="text-center text-white xs:text-left">
          <Heading level="h1" size={titleSize} className="mt-0 mb-6">
            {title}
          </Heading>
          {subtitle && (
            <p className="text-lg/snug font-light xs:max-w-2/3 sm:max-w-1/2 lg:text-xl/snug">
              {subtitle}
            </p>
          )}
        </div>
        {callToAction ? (
          <div className="mt-12 flex flex-wrap items-start justify-center gap-6 xs:flex-nowrap xs:justify-start">
            {callToAction}
          </div>
        ) : null}
      </div>
      <div className="relative z-0 -mx-6 w-[calc(100%+(var(--spacing)*12))] xs:absolute xs:inset-y-0 xs:left-1/2 xs:mx-0 xs:h-auto xs:max-w-1/2 xs:pb-0 sm:max-w-2/3">
        <div className="absolute inset-0 z-[1] -m-px size-[calc(100%+2px)] bg-linear-[180deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_100%] xs:bg-linear-[90deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_45%,_rgba(0,0,0,0)_55%,_rgba(0,0,0,1)_100%]" />
        <picture>
          {sources.map(({ srcset, media }) => (
            <source key={`${srcset}${media}`} srcSet={srcset} media={media} />
          ))}
          <img
            src={src}
            alt={alt}
            className="z-0 block size-full object-cover object-center xs:absolute xs:inset-0"
          />
        </picture>
      </div>
    </Container>
  </div>
);

export default HomeHero;
