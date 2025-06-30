import { ReactNode } from "react";

import { Container, Heading } from "@gc-digital-talent/ui";

interface HomeHeroProps {
  callToAction?: ReactNode;
  title: string;
  subtitle?: string;
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
}: HomeHeroProps) => (
  <div className="relative overflow-hidden bg-[#000] pt-18 pb-24 xs:pt-24 xs:pb-30 sm:pt-36 sm:pb-36 md:pt-36 md:pb-48">
    <Container className="relative z-[1]">
      <div className="text-center text-white xs:text-left">
        <Heading level="h1" className="mt-0 mb-6">
          {title}
        </Heading>
        {subtitle && (
          <p className="text-lg font-light xs:max-w-2/3 sm:max-w-1/2 lg:text-xl">
            {subtitle}
          </p>
        )}
      </div>
      {callToAction ? (
        <div className="mt-12 flex flex-wrap items-start justify-center gap-6 xs:flex-nowrap xs:justify-start">
          {callToAction}
        </div>
      ) : null}
    </Container>
    <div className="pt-18 xs:pt-0">
      <picture>
        {sources.map(({ srcset, media }) => (
          <source key={`${srcset}${media}`} srcSet={srcset} media={media} />
        ))}
        <img
          src={src}
          alt={alt}
          className="relative -mb-24 w-full xs:absolute xs:top-0 xs:right-0 xs:left-auto xs:mb-0 xs:h-full xs:w-auto sm:right-auto sm:left-1/2"
        />
      </picture>
    </div>
  </div>
);

export default HomeHero;
