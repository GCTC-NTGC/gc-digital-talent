import { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import { tv } from "tailwind-variants";

import { notEmpty } from "@gc-digital-talent/helpers";

type Breakpoint = "xs" | "sm" | "md" | "lg";
type PartialBreakpoints = Partial<Record<Breakpoint, string>>;

export interface ImgProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  sources?: PartialBreakpoints;
}

const sourceMediaMap = new Map<Breakpoint, string>([
  ["xs", "(max-width: 48rem)"],
  ["sm", "(max-width: 67.5rem)"],
  ["md", "(max-width: 80rem)"],
  ["lg", "(max-width: 100rem)"],
]);

interface PictureSource {
  srcSet: string;
  media: string;
}

const buildPictureSource = (
  sources?: PartialBreakpoints,
): PictureSource[] | null => {
  if (!sources) {
    return null;
  }

  return Object.keys(sources)
    .map((k) => {
      const srcSet = sources[k as Breakpoint];
      const media = sourceMediaMap.get(k as Breakpoint);
      if (!media || !srcSet) return null;

      return { srcSet, media };
    })
    .filter(notEmpty);
};

const image = tv({
  base: "z-0 block size-full object-cover object-center xs:absolute xs:inset-0",
});

const Image = ({ className, sources, alt, src, ...rest }: ImgProps) => {
  const pictureSources = buildPictureSource(sources);

  return (
    <>
      <div className="absolute inset-0 z-[1] -m-px size-[calc(100%+2px)] bg-linear-[180deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_100%] xs:bg-linear-[90deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_45%,_rgba(0,0,0,0)_55%,_rgba(0,0,0,1)_100%]" />
      <picture>
        {pictureSources?.length
          ? pictureSources?.map((sourceProps) => (
              <source key={sourceProps.srcSet} {...sourceProps} />
            ))
          : null}
        <img
          src={src}
          alt={alt}
          className={image({ class: className })}
          {...rest}
        />
      </picture>
    </>
  );
};

export default Image;
