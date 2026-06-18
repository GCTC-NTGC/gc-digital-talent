import type { ReactNode } from "react";

import { Container } from "@gc-digital-talent/ui";

import type { ImgProps } from "~/components/GradientImage/GradientImage";
import GradientImage from "~/components/GradientImage/GradientImage";

interface HomeHeroProps {
  callToAction?: ReactNode;
  title: string;
  subtitle?: string;
  img: ImgProps;
}

const HomeHero = ({
  img,
  callToAction,
  title,
  subtitle,
}: HomeHeroProps) => (
  <GradientImage.Wrapper className="overflow-hidden bg-[#000]">
    <Container className="relative z-[1]">
      <GradientImage.Content className="py-12 xs:pt-24 xs:pb-30 sm:pt-36 sm:pb-36 md:pt-36 md:pb-47">
        <div className="text-center text-white xs:text-left">
          <h1 className="text-6xl font-bold mt-0 mb-6">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl">
              {subtitle}
            </p>
          )}
        </div>
        {callToAction ? (
          <div className="mt-12 flex flex-wrap items-start justify-center gap-6 xs:flex-nowrap xs:justify-start">
            {callToAction}
          </div>
        ) : null}
      </GradientImage.Content>
      <GradientImage.Image {...img} />
    </Container>
  </GradientImage.Wrapper>
);

export default HomeHero;
