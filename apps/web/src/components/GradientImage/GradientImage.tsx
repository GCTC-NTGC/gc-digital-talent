import { HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

import {
  Image as BaseImage,
  ImgProps as BaseImgProps,
} from "@gc-digital-talent/ui";

export interface ImgProps extends BaseImgProps {
  wrapperClassname?: string;
}

const image = tv({
  slots: {
    wrapper:
      "relative z-0 -mx-6 w-[calc(100%+(var(--spacing)*12))] xs:absolute xs:inset-y-0 xs:left-1/2 xs:mx-0 xs:h-auto xs:max-w-1/2 xs:pb-0 sm:max-w-2/3",
    base: "z-0 block size-full object-cover object-center xs:absolute xs:inset-0",
  },
});

const Image = ({ className, wrapperClassname, ...rest }: ImgProps) => {
  const { base, wrapper } = image();

  return (
    <div className={wrapper({ class: wrapperClassname })}>
      <div className="absolute inset-0 z-[1] -m-px size-[calc(100%+2px)] bg-linear-[180deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_65%,rgba(0,0,0,0)_100%] xs:bg-linear-[90deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_45%,_rgba(0,0,0,0)_55%,_rgba(0,0,0,1)_100%]" />
      <BaseImage className={base({ class: className })} {...rest} />
    </div>
  );
};

const wrapper = tv({ base: "relative overflow-hidden bg-[#000] text-white" });

const Wrapper = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={wrapper({ class: className })} {...rest} />
);

const content = tv({ base: "relative z-10 w-full xs:max-w-7/12 sm:max-w-1/2" });

const Content = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={content({ class: className })} {...rest} />
);

export default {
  Image,
  Content,
  Wrapper,
};
