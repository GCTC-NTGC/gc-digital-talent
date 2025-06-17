import { ReactNode, DetailedHTMLProps, HTMLAttributes } from "react";

import { Container, Flourish } from "@gc-digital-talent/ui";

interface SkewedImageContainerProps {
  children: ReactNode;
  imgSrc: string;
  imgProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
    Record<string, string>;
}

const SkewedImageContainer = ({
  children,
  imgSrc,
  imgProps,
}: SkewedImageContainerProps) => {
  return (
    <div className="relative z-[4]">
      <div className="absolute h-full w-full -skew-y-3 overflow-hidden bg-black">
        <div
          className="absolute -top-12 h-[calc(100%+3rem)] w-full skew-y-3 bg-size-[auto_50vh] bg-no-repeat xs:bg-size-[auto_60vh] sm:bg-size-[auto_110%]"
          {...imgProps}
          style={{
            backgroundImage: `url('${imgSrc}')`,
          }}
        />
        <Flourish className="absolute inset-0 bottom-auto" />
        <Flourish className="absolute inset-0 top-auto" />
      </div>
      <Container className="relative">
        <div className="pt-24 pb-[50vh] xs:pt-30 xs:pb-[60vh] sm:pt-42 sm:pb-36">
          {children}
        </div>
      </Container>
    </div>
  );
};

export default SkewedImageContainer;
