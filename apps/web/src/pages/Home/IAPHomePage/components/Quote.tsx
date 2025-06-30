import type { Quote as QuoteProps } from "~/hooks/useQuote";

import { CloseQuote, OpenQuote } from "./Svg";

const hyphen = `—`;
const Quote = ({ content, author }: QuoteProps) => (
  <figure className="mb-6 pt-12 xs:py-18">
    <blockquote className="relative text-white">
      <div className="tex-left">
        <OpenQuote className="inline-block w-12 xs:w-18" />
      </div>
      <p className="relative px-12 text-3xl/[1.1] font-extrabold xs:px-36 sm:text-5xl/[1.1] lg:text-6xl/[1.1]">
        {content}
      </p>
      <div className="text-right">
        <CloseQuote className="inline-block w-12 xs:w-18" />
      </div>
      <figcaption className="text-text-xl m-12 mx-36 mb-0 font-bold xs:mt-12 sm:text-2xl lg:text-3xl">
        {hyphen}
        {author}
      </figcaption>
    </blockquote>
  </figure>
);

export default Quote;
