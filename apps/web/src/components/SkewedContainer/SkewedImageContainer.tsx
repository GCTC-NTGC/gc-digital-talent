import { ReactNode } from "react";

import { Container, Flourish } from "@gc-digital-talent/ui";

import GradientImage, { ImgProps } from "../GradientImage/GradientImage";

interface SkewedImageContainerProps {
  children: ReactNode;
  img: ImgProps;
}

const SkewedImageContainer = ({ children, img }: SkewedImageContainerProps) => (
  <GradientImage.Wrapper className="z-[4] -skew-y-3">
    <Flourish className="absolute inset-0 bottom-auto z-20" />
    <div className="z-10 skew-y-3">
      <Container className="relative">
        <GradientImage.Content className="pt-24 pb-12 xs:py-30 sm:py-42 sm:pb-36">
          {children}
        </GradientImage.Content>
        <GradientImage.Image
          loading="lazy"
          wrapperClassname="xs:-inset-y-3"
          {...img}
        />
      </Container>
    </div>
    <Flourish className="absolute inset-0 top-auto z-20" />
  </GradientImage.Wrapper>
);

export default SkewedImageContainer;
