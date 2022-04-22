import React from "react";

import CloseQuote from "../Svg/CloseQuote";
import OpenQuote from "../Svg/OpenQuote";

import type { Quote as QuoteProps } from "../../hooks/useQuote";

const Quote: React.FC<QuoteProps> = ({ content, author }) => (
  <figure data-h2-margin="b(top-bottom, m)">
    <blockquote
      data-h2-display="b(flex)"
      data-h2-flex-direction="b(column)"
      data-h2-align-items="b(flex-start)"
      data-h2-position="b(relative)"
      data-h2-font-color="b(white)"
    >
      <p
        data-h2-font-size="b(h4) m(h2) l(h1)"
        data-h2-font-weight="b(900)"
        data-h2-padding="b(all, xl)"
        data-h2-position="b(relative)"
      >
        <OpenQuote data-h2-position="b(absolute)" />
        {content}
        <CloseQuote data-h2-position="b(absolute)" />
      </p>
      <figcaption data-h2-font-size="b(h5) m(h4)" data-h2-font-weight="b(800)">
        —{author}
      </figcaption>
    </blockquote>
  </figure>
);

export default Quote;
