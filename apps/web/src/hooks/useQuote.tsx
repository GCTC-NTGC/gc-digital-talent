import React from "react";
import { useIntl } from "react-intl";

import { wrapAbbr } from "~/utils/nameUtils";

export interface Quote {
  content: React.ReactNode | string;
  author: string | React.ReactNode;
}

const useQuote = (): Quote => {
  const intl = useIntl();

  const quotes: Quote[] = [
    {
      author: intl.formatMessage(
        {
          defaultMessage:
            "Government of Canada <abbreviation>IT</abbreviation> Apprentice",
          id: "pRGDLn",
          description: "author of testimonial number one",
        },
        {
          abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
        },
      ),
      content: intl.formatMessage(
        {
          defaultMessage:
            "This program has been a life-changing opportunity for me and I see a <b>greater future ahead</b>.",
          id: "404R1N",
          description: "testimonial number one",
        },
        {
          b: (chunks: React.ReactNode) => (
            <span style={{ color: "#FFDCA7" }}>{chunks}</span>
          ),
        },
      ),
    },
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
};

export default useQuote;
