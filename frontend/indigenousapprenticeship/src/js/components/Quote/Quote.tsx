import React from "react";

import CloseQuote from "../Svg/CloseQuote";
import OpenQuote from "../Svg/OpenQuote";

import type { Quote as QuoteProps } from "../../hooks/useQuote";

const Quote: React.FC<QuoteProps> = ({ content, author }) => (
  <figure data-h2-padding="base(x4, 0)">
    <blockquote
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-align-items="base(flex-start)"
      data-h2-position="base(relative)"
      data-h2-color="base(ia-white)"
    >
      <p
        data-h2-font-size="base(h2, 1.3) desktop(h1, 1.3)"
        data-h2-font-weight="base(900)"
        data-h2-padding="base(x3)"
        data-h2-position="base(relative)"
      >
        <OpenQuote data-h2-position="base(absolute)" />
        {content}
        <CloseQuote data-h2-position="base(absolute)" />
      </p>
      <figcaption
        data-h2-font-size="base(h5, 1.3) l-tablet(h4, 1.3)"
        data-h2-font-weight="base(700)"
      >
        —{author}
      </figcaption>
    </blockquote>
  </figure>
);

export default Quote;
