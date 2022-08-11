import React from "react";

import CloseQuote from "../Svg/CloseQuote";
import OpenQuote from "../Svg/OpenQuote";

import type { Quote as QuoteProps } from "../../hooks/useQuote";

const Quote: React.FC<QuoteProps> = ({ content, author }) => (
  <figure data-h2-padding="base(x3, 0)">
    <blockquote
      data-h2-position="base(relative)"
      data-h2-color="base(ia-white)"
    >
      <div data-h2-text-align="base(left)">
        <OpenQuote
          data-h2-display="base(inline-block)"
          data-h2-width="base(x3)"
        />
      </div>
      <p
        data-h2-font-size="base(h1, 1.1)"
        data-h2-font-weight="base(800)"
        data-h2-position="base(relative)"
        data-h2-padding="base(0, x6)"
      >
        {content}
      </p>
      <div data-h2-text-align="base(right)">
        <CloseQuote
          data-h2-display="base(inline-block)"
          data-h2-width="base(x3)"
        />
      </div>
      <figcaption
        data-h2-margin="base(x2, x6, 0, x6)"
        data-h2-font-size="base(h4, 1)"
        data-h2-font-weight="base(700)"
      >
        —{author}
      </figcaption>
    </blockquote>
  </figure>
);

export default Quote;
