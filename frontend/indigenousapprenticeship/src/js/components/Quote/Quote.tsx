import React from "react";

import CloseQuote from "../Svg/CloseQuote";
import OpenQuote from "../Svg/OpenQuote";

import type { Quote as QuoteProps } from "../../hooks/useQuote";

const Quote: React.FC<QuoteProps> = ({ content, author }) => (
  <figure data-h2-padding="b(x4, 0)">
    <blockquote
      data-h2-display="b(flex)"
      data-h2-flex-direction="b(column)"
      data-h2-align-items="b(flex-start)"
      data-h2-position="b(relative)"
      data-h2-color="b(ia-white)"
    >
      <p
        data-h2-font-size="b(h2, 1.3) l(h1, 1.3)"
        data-h2-font-weight="b(900)"
        data-h2-padding="b(x3)"
        data-h2-position="b(relative)"
      >
        <OpenQuote data-h2-position="b(absolute)" />
        {content}
        <CloseQuote data-h2-position="b(absolute)" />
      </p>
      <figcaption data-h2-font-size="b(h5, 1.3) m(h4, 1.3)" data-h2-font-weight="b(800)">
        —{author}
      </figcaption>
    </blockquote>
  </figure>
);

export default Quote;
