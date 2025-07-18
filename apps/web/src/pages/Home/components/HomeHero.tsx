import { ReactNode } from "react";

import { Container, Heading, HeadingRank } from "@gc-digital-talent/ui";

import GradientImage, {
  ImgProps,
} from "~/components/GradientImage/GradientImage";

interface HomeHeroProps {
  callToAction?: ReactNode;
  title: string;
  subtitle?: string;
  titleSize?: HeadingRank;
  img: ImgProps;
}

const HomeHero = ({
  img,
  callToAction,
  title,
  subtitle,
  titleSize,
}: HomeHeroProps) => (
  <GradientImage.Wrapper className="overflow-hidden bg-[#000]">
    <Container className="relative z-[1]">
      <GradientImage.Content className="pt-18 pb-24 xs:pt-24 xs:pb-30 sm:pt-36 sm:pb-36 md:pt-36 md:pb-47">
        <div className="text-center text-white xs:text-left">
          <Heading level="h1" size={titleSize} className="mt-0 mb-6">
            {title}
          </Heading>
          {subtitle && (
            <p className="text-lg/snug font-light lg:text-xl/snug">
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
