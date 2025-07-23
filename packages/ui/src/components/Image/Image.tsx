import { ImgHTMLAttributes } from "react";

import { notEmpty } from "@gc-digital-talent/helpers";

type Breakpoint = "xs" | "sm" | "md" | "lg";
type PartialBreakpoints = Partial<Record<Breakpoint, string>>;

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

export interface ImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  sources?: PartialBreakpoints;
}

const Image = ({ sources, alt, ...rest }: ImgProps) => {
  const pictureSources = buildPictureSource(sources);

  return (
    <picture>
      {pictureSources?.length
        ? pictureSources?.map((sourceProps) => (
            <source key={sourceProps.srcSet} {...sourceProps} />
          ))
        : null}
      <img alt={alt ?? ""} {...rest} />
    </picture>
  );
};

export default Image;
