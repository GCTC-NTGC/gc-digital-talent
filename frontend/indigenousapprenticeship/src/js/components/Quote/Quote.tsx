import React from "react";

import CloseQuote from "../Svg/CloseQuote";
import OpenQuote from "../Svg/OpenQuote";

import type { Quote as QuoteProps } from "../../hooks/useQuote";

const Quote: React.FC<QuoteProps> = ({ content, author }) => (
  <figure data-h2-padding="base(x2, 0, x1, 0) p-tablet(x3, 0)">
    <blockquote
      data-h2-position="base(relative)"
      data-h2-color="base(ia-white)"
    >
      <div data-h2-text-align="base(left)">
        <OpenQuote
          data-h2-display="base(inline-block)"
          data-h2-width="base(x2) p-tablet(x3)"
        />
      </div>
      <p
        data-h2-font-size="base(h3, 1.1) l-tablet(h1, 1.1)"
        data-h2-font-weight="base(800)"
        data-h2-position="base(relative)"
        data-h2-padding="base(0, x2) p-tablet(0, x6)"
      >
        {content}
      </p>
      <div data-h2-text-align="base(right)">
        <CloseQuote
          data-h2-display="base(inline-block)"
          data-h2-width="base(x2) p-tablet(x3)"
        />
      </div>
      <figcaption
        data-h2-margin="base(x2, x2, 0, x2) p-tablet(x2, x6, 0, x6)"
        data-h2-font-size="base(h5, 1) l-tablet(h4, 1)"
        data-h2-font-weight="base(700)"
      >
        —{author}
      </figcaption>
    </blockquote>
  </figure>
);

export default Quote;
